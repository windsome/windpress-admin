import calMd5sum from './md5sum';
import { dataURL2Blob } from './url';
import { imageFileScaleSync } from './imageScale';
import { chooseImage, getLocalImgData, uploadImage } from './jssdk';
import { getMedia, createResource } from './apis';
import rdebug from './apisRemoteDebug';

const CHUNKED_UPLOAD_URL = '/apis/v1/upload/chunk';
const CHUNKEDV2_URL_START = '/apis/v1/upload/chunk/start';
const CHUNKEDV2_URL_UPLOAD = '/apis/v1/upload/chunk/upload';
const CHUNKEDV2_URL_END = '/apis/v1/upload/chunk/end';
const DEFAULT_CHUNK_SIZE = 1024 * 1024;

const defProgress = evt => console.log('onprogress:', evt);

/**
 * XMLHttpRequest的基本post函数，向服务器发送formdata数据
 * @param {string} url
 * @param {FormData} data
 * @param {function} onprogress
 */
const xhrPost = (url, data, onprogress = null) => {
  return new Promise(function(resolve, reject) {
    if (!url || !data) {
      reject(new Error('error! url & data should not null!'));
    }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.upload.addEventListener('progress', evt => {
      if (evt.lengthComputable) {
        if (evt.total > 0) {
          onprogress && onprogress({ loaded: evt.loaded, total: evt.total });
        }
      } else {
        console.log('warning! total size is unknown:', evt);
      }
    });
    xhr.upload.addEventListener('load', evt => {
      //console.log('transfer complete.', evt);
      // if (evt.total > 0) {
      //   onprogress && onprogress({loaded: evt.loaded, total:evt.total});
      // }
    });
    xhr.upload.addEventListener('error', evt => {
      console.log('error: ', evt);
      reject(new Error('upload error'));
    });
    xhr.upload.addEventListener('abort', evt => {
      console.log('abort: ', evt);
      reject(new Error('user abort'));
    });
    xhr.onreadystatechange = evt => {
      if (xhr.readyState === xhr.DONE && xhr.status === 200) {
        try {
          console.log('onreadystatechange: 200 DONE!', evt);
          var res = JSON.parse(xhr.responseText);
          if (res.errcode == 0) {
            resolve(res);
            return;
          } else {
            reject(new Error('upload error: ' + res.message));
          }
        } catch (e) {
          reject(new Error('upload error! ' + e.message));
        }
      }
    };
    xhr.send(data);
  });
};

/**
 * 初始化上传信息，将文件及hash告知服务器，服务器判断是否上传。
 *
 * 返回：{url, status}, 服务器端url及status状态信息。
 * status：
 *   finish, 文件已经存在，没必要再上传。
 *   ready, 服务器端已准备好，等待上传。
 *   ..., 其他值，表示错误。
 * @param {file/blob} file 文件数据
 * @param {string} filename 文件名
 * @param {string} hash 文件哈希值，用于与服务器端校验相同文件是否存在
 * @param {function} onprogress default null! no need to report progress.
 */
const uploadFileStart = async ({
  file = null, // required
  filename = null, // optional
  hash = null, // optional
  onprogress = null // optional
} = {}) => {
  if (!file) {
    throw new Error('no file!');
  }
  let size = file.size;
  if (!size) {
    throw new Error('no file.size!');
  }
  filename = filename || file.name || 'noname';
  console.log('uploadFileInfo:', { filename, size, hash });

  let formData = new FormData();
  formData.append('cmd', 'start');
  formData.append('name', filename);
  formData.append('size', size);
  formData.append('hash', hash);
  let result = await xhrPost(CHUNKEDV2_URL_START, formData);
  if (result && result.errcode) {
    throw result;
  }

  return result;
  //return { ...result, file, filename, size, hash, chunkSize, count };
};
/**
 * 上传文件的一块数据
 * @param {file/blob} file 文件数据
 * @param {string} filename 文件名
 * @param {string} hash 文件哈希值，用于与服务器端校验相同文件是否存在
 * @param {number} chunkSize 上传块大小
 * @param {number} current 当前第几块
 * @param {function} onprogress default null! no need to report progress.
 */
const uploadFileChunk = async ({
  file = null, // required
  filename = null, // optional
  destname, // required, from server at start command.
  hash = null, // optional
  start, // required
  end, // required
  onprogress = null // optional
} = {}) => {
  if (!file) {
    throw new Error('no file!');
  }
  let size = file.size;
  if (!size) {
    throw new Error('no file.size!');
  }
  if (isNaN(start) || isNaN(end)) {
    throw new Error('not number! start=' + start + ', end=' + end);
  }
  if (start > size || end > size) {
    throw new Error('error position! ' + size + '[' + start + ',' + end + ']');
  }
  filename = filename || file.name || 'noname';

  console.log('uploadFileChunk start! ', { filename, size, hash, start, end });

  let formData = new FormData();
  formData.append('cmd', 'upload');
  formData.append('name', filename);
  formData.append('destname', destname);
  formData.append('size', size);
  formData.append('hash', hash);
  formData.append('chunk', file.slice(start, end));
  formData.append('start', start);
  formData.append('end', end);

  let result = await xhrPost(CHUNKEDV2_URL_UPLOAD, formData, onprogress);
  if (result && result.errcode) {
    throw result;
  }
  return result;
};

/**
 * 结束上传，通知服务器结束此文件上传
 *
 * 返回：{url, status, message}, 服务器端url, status状态信息, message描述信息
 * status：
 *   finish, 文件已经存在，没必要再上传。
 *   ready, 服务器端已准备好，等待上传。
 *   ..., 其他值，表示错误。
 * @param {file/blob} file 文件数据
 * @param {string} filename 文件名
 * @param {string} hash 文件哈希值，用于与服务器端校验相同文件是否存在
 * @param {function} onprogress default null! no need to report progress.
 */
const uploadFileEnd = async ({
  file = null, // required
  filename = null, // optional
  destname, //required, from start command.
  hash = null, // optional
  onprogress = null // optional
} = {}) => {
  if (!file) {
    throw new Error('no file!');
  }
  let size = file.size;
  if (!size) {
    throw new Error('no file.size!');
  }
  filename = filename || file.name || 'noname';
  console.log('uploadFileEnd:', { filename, size, hash });

  let formData = new FormData();
  formData.append('cmd', 'end');
  formData.append('name', filename);
  formData.append('destname', destname);
  formData.append('size', size);
  formData.append('hash', hash);
  let result = await xhrPost(CHUNKEDV2_URL_END, formData);
  if (result && result.errcode) {
    throw result;
  }

  return result;
};

///////////////////////////////////////////////////////////////////////////////
// 使用 async/await模式，比较容易理解
///////////////////////////////////////////////////////////////////////////////
export const uploadFile = async ({
  file = null, // required
  chunkSize = DEFAULT_CHUNK_SIZE, // optional
  filename = null, // optional
  onprogress = null, // optional
  hash = null // optional
} = {}) => {
  if (!file) {
    throw new Error('no file!');
  }
  let size = file.size;
  if (!size) {
    throw new Error('no file.size!');
  }
  filename = filename || file.name || 'noname';
  if (!chunkSize) {
    throw new Error('no chunkSize!');
  }
  let count = Math.ceil(size / chunkSize);
  console.log('uploadFile:', { filename, size, hash, chunkSize, count });

  let info = await uploadFileStart({ file, filename, hash });
  if (!info) {
    throw new Error('uploadFileStart fail!');
  }
  if (info.status == 'finish') return info;
  if (info.status != 'ready') {
    throw new Error('uploadFile unknown status=' + info.status);
  }
  let { destname } = info;
  let resultList = [];
  for (let i = 0; i < count; i++) {
    let start = i * chunkSize;
    let end = (i + 1) * chunkSize;
    if (end > size) end = size;
    let opts = {
      file,
      filename,
      destname,
      hash,
      start,
      end,
      onprogress: ({ loaded, total }) => {
        let percent = parseInt(
          100 * (i * chunkSize + loaded / total * (end - start)) / size
        );
        onprogress && onprogress({ action: 'upload', filename, percent });
      }
    };
    let result = await uploadFileChunk(opts);
    resultList.push(result);
  }
  // if (resultList) {
  //   // check every slice is right.
  // }
  // let lastResult =
  //   resultList.length > 0 ? resultList[resultList.length - 1] : null;
  // return lastResult;
  let finalResult = await uploadFileEnd({ file, filename, destname, hash });
  return finalResult;
};

///////////////////////////////////////////////////////////////////////////////
// 快捷组合函数! (scale, hash, upload)(wx:localId, serverId) support dataUrls.
///////////////////////////////////////////////////////////////////////////////
export const hash$UploadFile = async ({
  file = null, // required
  chunkSize = 1 * 1024 * 1024, // optional
  filename = null, // optional
  onprogress = null // optional
} = {}) => {
  if (!file) {
    throw new Error('no file!');
  }
  if (!chunkSize) {
    throw new Error('no chunkSize!');
  }
  let totalSize = file.size;
  if (!totalSize) {
    throw new Error('no totalSize!');
  }
  filename = filename || file.name || 'noname';

  let hash = await calMd5sum({
    file,
    chunkSize,
    onprogress: percent => {
      onprogress && onprogress({ action: 'md5sum', percent, filename });
    }
  });
  let ret = await uploadFile({
    file,
    chunkSize,
    filename,
    hash,
    onprogress: evt => {
      console.log('uploadFileList progress:', evt);
      onprogress && onprogress(evt);
    }
  });
  return ret;
};

export const hash$UploadDataURL = async ({
  dataUrl = null, //required
  filename = null, //option, orignal filename.
  chunkSize = 1 * 1024 * 1024, // optional
  onprogress = null // optional
} = {}) => {
  if (!dataUrl) {
    throw new Error('no dataUrl!');
  }
  filename = filename || 'noname_dataurl';
  let blob = dataURL2Blob(dataUrl);
  return await hash$UploadFile({
    file: blob,
    filename,
    chunkSize,
    onprogress
  });
};

export const scale$hash$uploadFile = async ({
  file = null,
  maxWidth = 720, // optional
  maxHeight = 720, // optional
  keepRatio = true, // optional
  chunkSize = 1 * 1024 * 1024, // optional
  onprogress = null // optional
} = {}) => {
  let result = await imageFileScaleSync(file, {
    maxWidth,
    maxHeight,
    keepRatio
  });
  let { filename, dataUrl, width, height } = result || {};
  let blob = dataURL2Blob(dataUrl);
  return await hash$UploadFile({
    file: blob,
    filename,
    chunkSize,
    onprogress
  });
};

export const uploadLocalId = async ({
  localId,
  chunkSize = 1 * 1024 * 1024, // optional
  onprogress = null // optional
} = {}) => {
  let ret = null;
  let isWkWebview = window.__wxjs_is_wkwebview;
  //rdebug({msg:'uploadLocalId', isWkWebview, localId});
  //alert('isWkWebview:'+isWkWebview+', localId'+localId);
  if (isWkWebview) {
    // 1: use `getLocalImgData` get dataURL
    // 2: convert dataURL to blob.
    // 3: upload blob to our own server, return the url.
    var dataUrl = await getLocalImgData(localId);
    ret = await hash$UploadDataURL({
      dataUrl,
      filename: localId,
      chunkSize,
      onprogress
    });
  } else {
    // 1: upload localId image to wechat-server, got serverId.
    // 2: send a request to our own server, download image from wechat-server to our own server. return url.
    let serverId = await uploadImage(localId);
    console.log('upload to weixin:', serverId);
    ret = await getMedia(serverId);
  }
  return ret;
};

///////////////////////////////////////////////////////////////////////////////
// List组合函数!
///////////////////////////////////////////////////////////////////////////////
export const hash$UploadDataURLs = async ({
  dataUrls = [], //required
  chunkSize = 1 * 1024 * 1024, // optional
  onprogress = null // optional
} = {}) => {
  if (!dataUrls) {
    throw new Error('no dataUrls!');
  }
  let resultList = [];
  for (let i = 0; i < dataUrls.length; i++) {
    let src = dataUrls[i];
    let result = await hash$UploadDataURL({
      dataUrl: src.dataUrl,
      filename: src.filename,
      onprogress: evt => {
        console.log('hash$UploadDataURLs', evt);
      }
    });
    resultList.push(result);
  }
  return resultList;
};

export const uploadFileInput = async evt => {
  let resultList = [];
  let files = evt.target.files;
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let result = await uploadFile({
      file,
      onprogress: evt => {
        console.log('uploadFileInput', evt);
      }
    });
    resultList.push(result);
  }
  return resultList;
};

///////////////////////////////////////////////////////////////////////////////
// FileInput/WxUpload combine.
///////////////////////////////////////////////////////////////////////////////
export const uploadCombinedFileInput = async (
  evt,
  { isWechat, count = 1, maxWidth = 720, maxHeight = 720, keepRatio = true }
) => {
  //rdebug({msg:'uploadCombinedFileInput', isWechat, count, maxWidth, maxHeight});
  let resultList = [];
  if (isWechat) {
    let localIds = await chooseImage({ count });
    for (let i = 0; i < localIds.length; i++) {
      let result = await uploadLocalId({ localId: localIds[i] });
      resultList.push({ ...result, type: 'image' });
    }
  } else {
    let files = evt.target.files;
    console.log('files:', files);
    for (let i = 0; i < files.length && i < count; i++) {
      let file = files[i];
      let type = file.type;
      let result = await scale$hash$uploadFile({
        file,
        maxWidth, // optional
        maxHeight, // optional
        keepRatio // optional
      });
      resultList.push({ ...result, type });
    }
  }

  // try {
  //   let resultList2 = [];
  //   for (let i = 0; i < resultList.length; i++) {
  //     let result = await createResource(resultList[i]);
  //     resultList2.push(result);
  //   }
  //   return resultList2;
  // } catch (error) {
  //   console.log('error! uploadCombinedFileInput!', error)
  // }
  return resultList;
};
