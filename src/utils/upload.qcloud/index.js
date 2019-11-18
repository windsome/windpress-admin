/**
 * 1. get signature from our server. visit /apis/uploader/qcloud/.
 * 2. get upload info. visit https://vod2.qcloud.com/v3/index.php?Action=ApplyUploadUGC
 *    request:  { signature, videoName, videoType, videoSize }
 *    response: { storageSignature, storagePath, storageAppId, storageBucket, storageRegion, storageRegionV5,
 *      domain, vodSessionKey, tempCertificate: { secretId, secretKey, token, expireTime }
 *      appId, timestamp }
 * 3. init upload. visit https://REGION.file.myqcloud.com/files/v2/APPID/BUCKET/PATH?sign=SIGN
 *    request: formdata{ op: 'upload_slice_init', uploadparts, sha, filesize, slice_size, biz_attr, insertOnly }
 *    response: 需要上传的情况：{ code, message, request_id, data: {session, slice_size} }
 *    response: 之前已经上传过，不需要上传的情况：{code, message, request_id, data:{access_url, resource_path, source_url, url, vid}}
 * 4. upload slice data. visit https://REGION.file.myqcloud.com/files/v2/APPID/BUCKET/PATH?sign=SIGN
 *    request: formdata{ op: 'upload_slice_data', sliceSize, session, offset, sha, fileContent }
 *    response: { code, message, request_id, data: {datalen, datamd5, offset, session}}
 * 5. finish upload. visit https://vod2.qcloud.com/v3/index.php?Action=CommitUploadUGC
 */
import calSha1sum from './sha1sum.qcloud';

const URL_GET_SIGNATURE = '/apis/v1/upload/authvod';
const URL_APPLY_UPLOAD_UGC =
  'https://vod2.qcloud.com/v3/index.php?Action=ApplyUploadUGC';
const URL_COMMIT_UPLOAD_UGC =
  'https://vod2.qcloud.com/v3/index.php?Action=CommitUploadUGC';
const URL_UPLOAD =
  'https://STORAGE_REGION.file.myqcloud.com/files/v2/STORAGE_APPID/STORAGE_BUCKETSTORAGE_PATH?sign=STORAGE_SIGNATURE';
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
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            var res = JSON.parse(xhr.responseText);
            //console.log('onreadystatechange: DONE ' + xhr.status, res);
            resolve(res);
          } catch (e) {
            reject(new Error('upload error! ' + e.message));
          }
        } else {
          reject(new Error('upload error, status=' + xhr.status));
        }
      }
    };
    xhr.send(data);
  });
};

/**
 * 通用方法，获取数据
 * @param {object} args
 */
const _formUrlencodedFetch = args => {
  // let str = [];
  // for(let p in args)
  //   str.push(encodeURIComponent(p) + "=" + encodeURIComponent(args[p]));
  // let body = str.join("&");

  return fetch(URL_APPLY_UPLOAD_UGC, {
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: JSON.stringify(args)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      if (response.status === 204) {
        throw new Error('没有数据');
      }
      return response;
    })
    .then(response => response.json());
};
/**
 * 从自己的服务器获取signature.
 */
const getVodSignature = () => {
  return fetch(URL_GET_SIGNATURE, {
    credentials: 'include',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      if (response.status === 204) {
        throw new Error('没有数据');
      }
      return response;
    })
    .then(response => response.json());
};
/**
 * 获取上传地址
 * @param {object} args 
  {
    signature:
      'xuSyMMbHwH4gmeCxfaLY19Nmqy5zZWNyZXRJZD1BS0lEbVc1VVFSYUF6bVJ2Slpzcm5vMTRCUnBBUVZlMUlvOVYmY3VycmVudFRpbWVTdGFtcD0xNTI0Mzg2ODcwJmV4cGlyZVRpbWU9MTUyNDQ3MzI3MCZwcm9jZWR1cmU9WElBT1pISUJPLURFRkFVTFQmcmFuZG9tPTU0MTQwNTk2NA==',
    videoName: 'VID_20170525_102356',
    videoType: 'mp4',
    videoSize: 214455733
  }
 * @return {object} 
  {
    code: 0,
    message: '成功',
    data: {
      video: {
        storageSignature:
          '3gftblWX/3QFwiRIXdVLppie4NhhPTEwMDIyODUzJmI9MzJkNzBlYWJ2b2RnenAxMjUzNjY4NTA4Jms9QUtJRElXZTdBdEkxMFBRa204UkVEbDRVTzdJNm15bjZOREY3JmU9MTUyNDU1OTY3MCZ0PTE1MjQzODY4NzAmcj02OTgwNzI5NDQmZj0vMTAwMjI4NTMvMzJkNzBlYWJ2b2RnenAxMjUzNjY4NTA4LzMyZDcwZWFidm9kZ3pwMTI1MzY2ODUwOC8wMDkxNzJiNzc0NDczOTgxNTU1OTg5MDEwNDkvRFJhcFlpQjUxaTRBLm1wNA==',
        storagePath:
          '/32d70eabvodgzp1253668508/009172b77447398155598901049/DRapYiB51i4A.mp4'
      },
      storageAppId: 10022853,
      storageBucket: '32d70eabvodgzp1253668508',
      storageRegion: 'gzp',
      storageRegionV5: 'ap-guangzhou-2',
      domain: 'vod2.qcloud.com',
      vodSessionKey:
        '3FEmq9DWHl1xF819mM4TLTM03ZGdLNcum47rEMoithp7UgRQA4uAs4MVgUxQRWEugBaaxWxmmhfbv1Ppb/NukjaxonYHcrs2JvYCqJ41qP/EINezf0rFP3KIVMM9Hz7/rPdQRdRPabmzPlErLsXOjA5NZ7UvVOnWGLilShdNGjvOYWdvbqfyCpqCRYoTuLzLGdfUlYaVBIP+f3QfmOflbW8nuOzXzPrAbMUDyhEe7CcQ7joxSs13HhWQnSze9xeZ7e8nRsEmI7UQRf9amqmf1jbjqyxOn9Brw4jcRtWtd/XpfOuhDwjTvlP80uvyDG8mp74PLasSnMYlxenfxcWGlf+pXRPzANrs5h2xmMH6d5gKpVaEKQ8jBirZSOVahaZ+bwoeBBTa+aKy762Of5j20c77HjLmqxA1459locghbvWpeJ0nB1zz9MUnEx4Fcj65B+oOqSi8j+8KuOYknHj3DmfnE1aR4zXbc3pdvRr2O5iAEzkp4GmzytYj5HvfeFGej6vG9NMWzEvYqrzOa87U/2nbdpmM/7RJeq0T60HS49//WWzW/h4kLrpGmg==',
      tempCertificate: {
        secretId: 'AKIDLJIYNQItW3sSbUkoCshZVLbzoIbFqctC',
        secretKey: 'ynlL4jrRgw5KSJicRfo9zpN5dA73w8NR',
        token: '7207c3c20f4451387e5a1231e8b446112af49b8c30001',
        expiredTime: 1524394071
      },
      appId: 1253668508,
      timestamp: 1524386871
    }
  } 
 */
const applyUploadUGC = async args => {
  return await _formUrlencodedFetch(args);
};
/**
 * 完成上传，获得最后的url
 * @param {object} args
  {
    signature:
      'nvrLkEIy9IXrJ4zpPP5EWhcYs1BzZWNyZXRJZD1BS0lEbVc1VVFSYUF6bVJ2Slpzcm5vMTRCUnBBUVZlMUlvOVYmY3VycmVudFRpbWVTdGFtcD0xNTI0NDY2MDQ4JmV4cGlyZVRpbWU9MTUyNDU1MjQ0OCZwcm9jZWR1cmU9WElBT1pISUJPLURFRkFVTFQmcmFuZG9tPTIxMjgxMTk5NTE=',
    vodSessionKey:
      '3FEmq9DWHl1xF819mM4kXFVHzdfFf4J06tTHYIpg7EtvShlCRdDW7tllwh1nXHUii3fPhx4jy06G/kL/b7Y1kmTuhHgWRqExKukGu5YiqPuWL9LmJgqfcmCGStZjbmS/yqAcGMZNabqielx4e8/sgQtyYqY9BuLGArihGBhIT2KDcT47au+2X5yAQogSs7DDEM3Rk46VC4KrcXcYg/L6diF/6byNtq2KEpVemwoL7Ft3rTIQQuEBE1ePvW/WpRmZhZ8wX/wqDsNOX5l+062AjDb1qz1di5coopHGcNWlXfX0DLTkAR3Nykr8nqD3GS0CvawzL7YTnN1ewunJxdKf3P2zehT4H/vnsQqhjdnsNsJX+Aj3dVV3fnbIRf5ZgrBlfkVPUUSAn/Lws7+FfZT7wNfpX2+u7AkP7oBv14tjOuOnb8VgAE3z9NI+BzIOBH34UP0HvXP0jv0etqUknl7wSTmjUwaA7yG7Dwsqy3DPC7jOMhga01ndpNZXj0n/V2u0qLCSwPNytyrpEXsgOkV7cyD7KpAOQrxAPA=='
  }
 * @return {object}
  {
    code: 0,
    message: '成功',
    data: {
      video: {
        url:
          'http://1253668508.vod2.myqcloud.com/32d70eabvodgzp1253668508/f60c24d47447398155611837943/PE5aEmC5b1QA.mp4',
        verify_content:
          'emdHTPljTSsIglyK4PPXOakgreZFeHBUaW1lPTE1MjQ0Njk2NjkmRmlsZUlkPTc0NDczOTgxNTU2MTE4Mzc5NDM='
      },
      fileId: '7447398155611837943'
    }
  }
 */
const commitUploadUGC = async args => {
  return await _formUrlencodedFetch(args);
};

const uploadSliceList = async ({ resUrl }) => {
  let formData = new FormData();
  formData.append('op', 'upload_slice_list');
  let result = await xhrPost(resUrl, formData);
  if (result && result.code != 0) {
    throw result;
  }
  return result;
};
/**
 * 初始化分块上传，如果文件曾经上传成功过，则返回链接地址data.url，否则返回data.session
 * @param {object} args
 * { op: 'upload_slice_init', uploadparts, sha, filesize, slice_size, biz_attr, insertOnly }
 * @return {object}
 * 需要上传的情况：{ code, message, request_id, data: {session, slice_size} }
 * 之前已经上传过，不需要上传的情况：{code, message, request_id, data:{access_url, resource_path, source_url, url, vid}}
 */
const uploadInit = async ({
  resUrl,
  uploadparts,
  sha,
  filesize,
  chunkSize
}) => {
  let formData = new FormData();
  formData.append('op', 'upload_slice_init');
  formData.append('uploadparts', uploadparts);
  formData.append('sha', sha);
  formData.append('filesize', filesize);
  formData.append('slice_size', chunkSize);
  formData.append('biz_attr', '');
  formData.append('insertOnly', '1');
  let result = await xhrPost(resUrl, formData);
  if (result && result.code != 0) {
    throw result;
  }
  return result;
};
/**
 * 告知服务器，已经上传完成
 * @param {object} param0
 */
const uploadFinish = async ({ resUrl, session, sha, filesize }) => {
  let formData = new FormData();
  formData.append('op', 'upload_slice_finish');
  formData.append('sha', sha);
  formData.append('filesize', filesize);
  formData.append('session', session);
  let result = await xhrPost(resUrl, formData);
  if (result && result.code != 0) {
    throw result;
  }
  return result;
};

/**
 * 上传一个分片的数据
 * @param {object} args
 * formdata{ op: 'upload_slice_data', sliceSize, session, offset, sha, fileContent }
 * @return {object}
 * { code, message, request_id, data: {datalen, datamd5, offset, session}}
 */
const uploadSlice = async ({
  resUrl,
  session,
  offset,
  sliceSize,
  sha,
  fileContent,
  onprogress
}) => {
  let formData = new FormData();
  formData.append('op', 'upload_slice_data');
  formData.append('sliceSize', sliceSize);
  formData.append('session', session);
  formData.append('offset', offset);
  formData.append('sha', sha);
  formData.append('fileContent', fileContent);
  let result = await xhrPost(resUrl, formData, onprogress);
  if (result && result.code != 0) {
    throw result;
  }
  return result;
};

///////////////////////////////////////////////////////////////////////////////
// 使用 async/await模式，比较容易理解
///////////////////////////////////////////////////////////////////////////////
const uploadFileInner = async ({
  resUrl = null, // required
  file = null, // required
  chunkSize = DEFAULT_CHUNK_SIZE, // optional
  filename = null, // optional
  onprogress = null, // optional
  hash = null // required
} = {}) => {
  filename = filename || file.name || 'noname';
  let size = file.size;
  try {
    let result0 = await uploadSliceList({ resUrl });
    console.log('result0:', result0);
  } catch (error) {
    console.log('error! uploadSliceList!', error);
  }
  let sha = (hash && hash.length > 0 && hash[hash.length - 1].datasha) || '';
  let result = await uploadInit({
    resUrl,
    uploadparts: JSON.stringify(hash),
    hash,
    sha,
    filesize: size,
    chunkSize
  });
  let session = result && result.data && result.data.session;
  if (!session) {
    console.log('no session! already exist at server!', result);
    return result;
  }

  let count = Math.ceil(size / chunkSize);
  console.log('uploadFile:', { filename, size, hash, chunkSize, count });

  let resultList = [];
  for (let i = 0; i < count; i++) {
    let offset = i * chunkSize;
    //sha = hash[i].datasha;
    let sliceSize = chunkSize;
    if (offset + sliceSize > size) sliceSize = size - offset;
    let result = await uploadSlice({
      resUrl,
      sliceSize,
      session,
      offset,
      sha,
      fileContent: file.slice(offset, offset + sliceSize),
      onprogress: ({ loaded, total }) => {
        let percent = parseInt(
          100 * (i * chunkSize + loaded / total * sliceSize) / size
        );
        onprogress && onprogress({ action: 'upload', filename, percent });
      }
    });
    resultList.push(result);
  }
  console.log('uploadSliceResultArray:', resultList);
  let result3 = await uploadFinish({
    resUrl,
    session,
    sha,
    filesize: size
  });
  return result3;
};

/**
 * @param {object} param0
 */
export const uploadFile = async ({
  file = null, // required
  chunkSize = DEFAULT_CHUNK_SIZE, // optional
  filename = null, // optional
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
  if (!chunkSize) {
    throw new Error('no chunkSize!');
  }

  let result = await getVodSignature();
  if (!result || result.errcode) {
    throw new Error('error! getVodSignature fail! ' + result.message);
  }
  let signature = result.authorization;

  let videoType =
    (file.type &&
      file.type.indexOf('/') >= 0 &&
      file.type.slice(file.type.indexOf('/') + 1)) ||
    'mp4';
  let result2 = await applyUploadUGC({
    signature,
    videoName: filename,
    videoType,
    videoSize: size
  });
  if (!result2 || result2.code) {
    throw new Error('error! applyUploadUGC fail! ' + result2.message);
  }
  if (!result2.data) {
    throw new Error('error! applyUploadUGC return no data!');
  }

  let hashArray = await calSha1sum({
    file,
    chunkSize,
    onprogress: percent => {
      onprogress && onprogress({ action: 'sha1sum', percent, filename });
    }
  });

  let {
    vodSessionKey,
    storageRegion,
    storageAppId,
    storageBucket,
    video
  } = result2.data;
  let { storageSignature, storagePath } = video;
  let resUrl = URL_UPLOAD.replace(/STORAGE_REGION/g, storageRegion)
    .replace(/STORAGE_APPID/g, storageAppId)
    .replace(/STORAGE_BUCKET/g, storageBucket)
    .replace(/STORAGE_PATH/g, storagePath)
    .replace(/STORAGE_SIGNATURE/g, storageSignature);
  console.log('resUrl:', resUrl, 'result2:', result2);
  let result3 = await uploadFileInner({
    resUrl,
    file,
    chunkSize,
    hash: hashArray,
    onprogress: percent => {
      onprogress && onprogress({ action: 'upload', percent, filename });
    }
  });

  let resultN = await commitUploadUGC({
    signature,
    vodSessionKey
  });
  console.log('commitUploadUGC:', resultN);
  if (!resultN || !resultN.code) {
    throw new Error('error! commitUploadUGC fail! ' + resultN.message);
  }

  return resultN;
};

///////////////////////////////////////////////////////////////////////////////
// List组合函数!
///////////////////////////////////////////////////////////////////////////////
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
