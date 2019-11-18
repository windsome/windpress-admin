import calMd5sum from './md5sum';
import { dataURL2Blob } from './url';
import { imageFileScaleSync } from './imageScale';
import { chooseImage, getLocalImgData, uploadImage } from './jssdk';
import { getMedia } from './apis';
import rdebug from './apisRemoteDebug';

const CHUNKED_UPLOAD_URL = '/apis/v1/upload/chunk';

const defProgress = evt => console.log('onprogress:', evt);

const uploadOneChunk = ({
  file = null, // required
  current = 0, // required
  chunkSize = 1 * 1024 * 1024, // optional
  filename = null, // optional
  hash = null, // optional
  onprogress = null // optional
} = {}) => {
  return new Promise(function(resolve, reject) {
    if (!file) {
      reject(new Error('no file!'));
    }
    if (!chunkSize) {
      reject(new Error('no chunkSize!'));
    }
    let totalSize = file.size;
    if (!totalSize) {
      reject(new Error('no totalSize!'));
    }
    filename = filename || file.name || 'noname';
    let count = Math.ceil(totalSize / chunkSize);

    let start = current * chunkSize;
    let end = (current + 1) * chunkSize;
    if (end > totalSize) end = totalSize;

    let formData = new FormData();
    formData.append('name', filename);
    formData.append('hash', hash);
    formData.append('count', count);
    formData.append('current', current);
    formData.append('chunk', file.slice(start, end));
    formData.append('size', totalSize);
    formData.append('chunkSize', chunkSize);
    formData.append('start', start);
    formData.append('end', end);

    console.log('uploadOneChunk start! count=', count, ', current=', current);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', CHUNKED_UPLOAD_URL, true);
    xhr.upload.addEventListener('progress', evt => {
      if (evt.lengthComputable) {
        //console.log('progress:', evt);
        if (evt.total > 0) {
          let percent = Math.floor(
            100 *
              (current * chunkSize / totalSize +
                (end - start) / totalSize * evt.loaded / evt.total)
          );
          onprogress && onprogress(percent);
        }
      } else {
        console.log(
          'Unable to compute progress information since the total size is unknown:',
          evt
        );
      }
    });
    xhr.upload.addEventListener('load', evt => {
      console.log('current=', current, ': The transfer is complete.', evt);
      if (evt.total > 0) {
        var percent = Math.floor(
          100 *
            (current * chunkSize / totalSize +
              (end - start) / totalSize * evt.loaded / evt.total)
        );
        onprogress && onprogress(percent);
      }
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
          console.log(
            'current=',
            current,
            ': onreadystatechange: 200 DONE!',
            evt
          );
          var res = JSON.parse(xhr.responseText);
          if (res.errcode == 0) {
            current++;
            resolve(res);
            return;
          } else {
            reject(new Error('upload error: ' + res.message));
          }
        } catch (e) {
          reject(new Error('upload error!'));
        }
      }
    };

    xhr.send(formData);
  });
};

///////////////////////////////////////////////////////////////////////////////
// 使用 async/await模式，比较容易理解
///////////////////////////////////////////////////////////////////////////////
export const uploadFile = async ({
  file = null, // required
  chunkSize = 1 * 1024 * 1024, // optional
  filename = null, // optional
  onprogress = null, // optional
  hash = null // optional
} = {}) => {
  if (!file) {
    throw new Error('no file!');
  }
  if (!chunkSize) {
    throw new Error('no chunkSize!');
  }
  let totalSize = file.size;
  if (!totalSize) {
    throw new Error('no file.size!');
  }
  filename = filename || file.name || 'noname';
  console.log('uploadFile start! filename=', filename, ', hash=', hash);

  let resultList = [];
  let count = Math.ceil(totalSize / chunkSize);
  for (let i = 0; i < count; i++) {
    let opts2 = {
      file,
      chunkSize,
      filename,
      hash,
      onprogress: percent => {
        onprogress && onprogress({ action: 'upload', filename, percent });
      }
    };
    let result = await uploadOneChunk({ ...opts2, current: i });
    resultList.push(result);
  }
  if (resultList) {
    // check every slice is right.
  }
  let lastResult =
    resultList.length > 0 ? resultList[resultList.length - 1] : null;
  return lastResult;
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
      resultList.push(result);
    }
  } else {
    let files = evt.target.files;
    console.log('files:', files);
    for (let i = 0; i < files.length && i < count; i++) {
      let file = files[i];
      let result = await scale$hash$uploadFile({
        file,
        maxWidth, // optional
        maxHeight, // optional
        keepRatio // optional
      });
      resultList.push(result);
    }
  }
  return resultList;
};
