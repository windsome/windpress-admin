import COS from 'cos-js-sdk-v5';
import { requestGet } from './_request';
///////////////////////////////////////////////////
// COS functions.
///////////////////////////////////////////////////
// 初始化实例
let cos = new COS({
  getAuthorization: function(options, callback) {
    // 异步获取签名
    let method = (options.Method || 'get').toLowerCase();
    let pathname = '/' + (options.Key || '');
    requestGet(
      '/apis/v1/upload/auth?pathname=' + pathname + '&method=' + method
    ).then(ret => {
      let authorization = ret.authorization;
      callback(authorization);
    });
  }
});

export const sliceUploadFile = ({
  Bucket = 'yishujia-1255968143',
  Region = 'ap-shanghai',
  Key,
  file
}) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('error! parmeter missing! file!'));
    }
    if (!Bucket) {
      reject(new Error('error! parmeter missing! Bucket!'));
    }
    if (!Region) {
      reject(new Error('error! parmeter missing! Region!'));
    }
    // 分片上传文件
    cos.sliceUploadFile(
      {
        Bucket,
        Region,
        Key: Key || file.name,
        Body: file,
        TaskReady: taskId => {
          console.log('taskId:', taskId);
        },
        onHashProgress: function(progressData) {
          /* 非必须 */
          console.log(JSON.stringify(progressData));
        },
        onProgress: function(progressData) {
          /* 非必须 */
          console.log(JSON.stringify(progressData));
        }
      },
      function(err, data) {
        console.log('err:', err, ', data:', data);
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      }
    );
  });
};

///////////////////////////////////////////////////
// VOD functions.
///////////////////////////////////////////////////
