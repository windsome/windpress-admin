import calMd5sum from './md5sum';
import { dataURL2Blob } from './url';

const UPLOAD_URL = '/apis/v1/upload/form';
const CHUNKED_UPLOAD_URL = '/apis/v1/upload/chunk';

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
// V1! support files from FileInput.
// 使用promise的链式调用processPromiseArrayInOrder，太费解了！！！
///////////////////////////////////////////////////////////////////////////////

const processPromiseArrayInOrder = (array, fn) => {
  var results = [];
  return array.reduce((p, item) => {
    //console.log ("p", p, "item", item);
    return p.then(() => {
      return fn(item).then(function(data) {
        console.log('processPromiseArrayInOrder item:', item, ',data:', data);
        results.push(data);
        return results;
      });
    });
  }, Promise.resolve());
};

export const uploadFile = ({
  file = null, // required
  chunkSize = 1 * 1024 * 1024, // optional
  filename = null, // optional
  onprogress = null, // optional
  calcHash = true // optional
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
    console.log(
      'uploadFile start! filename=',
      filename,
      ', calcHash=',
      calcHash
    );

    let hashProc = Promise.resolve(null);
    if (calcHash) {
      let opts1 = {
        file,
        chunkSize,
        onprogress: percent => {
          onprogress && onprogress({ section: 'md5sum', percent });
        }
      };
      hashProc = calMd5sum(opts1);
    }
    hashProc
      .then(hash => {
        let arr = [];
        let count = Math.ceil(totalSize / chunkSize);
        let opts2 = {
          file,
          chunkSize,
          hash,
          onprogress: percent => {
            onprogress && onprogress({ section: 'upload', filename, percent });
          }
        };
        let index = 0;
        while (count-- > 0) {
          arr.push({ ...opts2, current: index++ });
        }
        console.log('processArray arr:', arr);
        return processPromiseArrayInOrder(arr, uploadOneChunk);
      })
      .then(result => {
        console.log('resolve', result);
        resolve(result);
      })
      .catch(error => {
        console.log('reject:', error);
        reject(error);
      });
  });
};

export const uploadFileList = (
  filelist,
  {
    chunkSize = 1 * 1024 * 1024, // optional
    onprogress = null, // optional
    calcHash = true // optional
  } = {}
) => {
  // 用reduce,promise方式，图片一张张加载，节省资源
  console.log('uploadFileList:', chunkSize, onprogress, calcHash);
  if (!chunkSize) {
    throw new Error('no chunkSize!');
  }
  // dispatch image names.
  var fileinfos = filelist.map(file => {
    return {
      file,
      chunkSize,
      calcHash,
      onprogress: evt => {
        console.log('uploadFileList progress:', evt);
        onprogress && onprogress({ ...evt, filename: file && file.name });
      }
    };
  });
  console.log('processPromiseArrayInOrder fileinfos:', fileinfos);
  return processPromiseArrayInOrder(fileinfos, uploadFile)
    .then(result => {
      console.log('resolve', result);
      return result;
    })
    .catch(error => {
      console.log('reject:', error);
      return null;
    });
};

export const uploadFileInput = evt => {
  var filelist = [];
  for (var i = 0; i < evt.target.files.length; i++) {
    filelist.push(evt.target.files[i]);
  }
  return uploadFileList(filelist);
};

///////////////////////////////////////////////////////////////////////////////
// V2! support dataUrls.
// 使用 async/await模式，比较容易理解
///////////////////////////////////////////////////////////////////////////////

export const uploadFileV2 = async ({
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
    throw new Error('no totalSize!');
  }
  filename = filename || file.name || 'noname';
  console.log('uploadFileV2 start! filename=', filename, ', calcHash=', hash);

  let result = null;
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
    result = await uploadOneChunk({ ...opts2, current: i });
  }
  return result;
};

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
  let ret = await uploadFileV2({
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

export const hash$UploadDataURLs = async ({
  dataUrls = [], //required
  chunkSize = 1 * 1024 * 1024, // optional
  onprogress = null // optional
} = {}) => {
  if (!dataUrls) {
    throw new Error('no dataUrls!');
  }
  let retList = [];
  for (let i = 0; i < dataUrls.length; i++) {
    let src = dataUrls[i];
    let blob = dataURL2Blob(src.dataUrl);
    let ret = await hash$UploadFile({
      file: blob,
      filename: src.filename,
      chunkSize,
      onprogress
    });
    retList.push({ ...ret, src: src.dataUrl });
  }
  return retList;
};
