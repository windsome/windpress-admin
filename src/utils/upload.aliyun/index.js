/**
 * 阿里云上传视频
 * https://help.aliyun.com/document_detail/52204.html?spm=a2c4g.11186623.2.20.m4y3AL
 */
import loadJsCss from '../loadScript';
const DEFAULT_CHUNK_SIZE = 1024 * 1024;
const URL_ASSUME_ROLE = '/apis/v1/upload/aliyun/assumeRole';

/**
 * 获取sts授权信息
 * @param {object} args
 */
const assumeRole = () => {
  return fetch(URL_ASSUME_ROLE, {
    credentials: 'include',
    method: 'get',
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

export const createUploader = ({
  chunkSize = DEFAULT_CHUNK_SIZE // optional
} = {}) => {
  return loadJsCss('/ysj/js/aliyun-oss-sdk4.13.2.min.js', 'js')
    .then(() => loadJsCss('/ysj/js/aliyun-upload1.3.1.js', 'js'))
    .then(() => {
      let uploader = new window.AliyunUpload.Vod({
        //分片大小默认1M，不能小于100K
        partSize: chunkSize,
        //并行上传分片个数，默认5
        parallel: 5,
        //网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        //网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: function(uploadInfo) {
          console.log('onUploadStarted:', uploadInfo);
          // let useMethod1 = true;
          // if (useMethod1) {
          //   //上传方式1
          //   if (!uploadInfo.videoId) {
          //     //这个文件没有上传异常
          //     //实际环境中调用调用点播的获取上传凭证接口
          //     uploader.setUploadAuthAndAddress(
          //       uploadInfo,
          //       uploadAuth,
          //       uploadAddress,
          //       videoId
          //     );
          //   } else {
          //     //如果videoId有值，根据videoId刷新上传凭证
          //     //实际环境中调用点播的刷新上传凭证接口，获取凭证
          //     uploader.setUploadAuthAndAddress(
          //       uploadInfo,
          //       uploadAuth,
          //       uploadAddress
          //     );
          //   }
          // } else {
          //   //上传方式2
          //   //实际环境中调用获取STS接口，获取STS的值
          //   uploader.setSTSToken(
          //     uploadInfo,
          //     accessKeyId,
          //     accessKeySecret,
          //     secretToken
          //   );
          // }
          uploadInfo.videoInfo = {
            ...uploadInfo.videoInfo,
            Title: uploadInfo.file.name
          };
          assumeRole().then(result => {
            if (result && result.Credentials) {
              let {
                AccessKeySecret,
                AccessKeyId,
                SecurityToken,
                Expiration
              } = result.Credentials;
              uploader.setSTSToken(
                uploadInfo,
                AccessKeyId,
                AccessKeySecret,
                SecurityToken
              );
            }
          });
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo) {
          console.log('onUploadSucceed: ', uploadInfo);
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo, code, message) {
          console.log(
            'onUploadFailed: ',
            uploadInfo.file.name,
            ',code:',
            code,
            ', message:',
            message
          );
        },
        // 文件上传进度，单位：字节
        onUploadProgress: function(uploadInfo, totalSize, loadedPercent) {
          console.log(
            'onUploadProgress:file:' +
              uploadInfo.file.name +
              ', fileSize:' +
              totalSize +
              ', percent:' +
              Math.ceil(loadedPercent * 100) +
              '%'
          );
        },
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {
          console.log('onUploadTokenExpired');
          //上传方式1  实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
          // uploader.resumeUploadWithAuth(uploadAuth);
          // 上传方式2 实现时，从新获取STS临时账号用于恢复上传
          // uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken, expireTime);
          assumeRole().then(result => {
            if (result && result.Credentials) {
              let {
                AccessKeySecret,
                AccessKeyId,
                SecurityToken,
                Expiration
              } = result.Credentials;
              uploader.resumeUploadWithSTSToken(
                AccessKeyId,
                AccessKeySecret,
                SecurityToken,
                Expiration
              );
            }
          });
        },
        //全部文件上传结束
        onUploadEnd: function(uploadInfo) {
          console.log('onUploadEnd: uploaded all the files', uploadInfo);
        }
      });
      return uploader;
    });
};

// export const createUploader = ({
//   chunkSize = DEFAULT_CHUNK_SIZE // optional
// }) => {
//   return new Promise((resolve, reject) => {
//     require.ensure([], () => {
//       let es6promise = require('./es6-promise.min');
//       let aliyunOss = require('./aliyun-oss-sdk4.13.2.min');
//       let AliyunUpload = require('./aliyun-vod-upload-sdk1.3.1.min');

//       var uploader = new AliyunUpload.Vod({
//         //分片大小默认1M，不能小于100K
//         partSize: chunkSize,
//         //并行上传分片个数，默认5
//         parallel: 5,
//         //网络原因失败时，重新上传次数，默认为3
//         retryCount: 3,
//         //网络原因失败时，重新上传间隔时间，默认为2秒
//         retryDuration: 2,
//         // 开始上传
//         onUploadstarted: function(uploadInfo) {
//           console.log(
//             'onUploadStarted:' +
//               uploadInfo.file.name +
//               ', endpoint:' +
//               uploadInfo.endpoint +
//               ', bucket:' +
//               uploadInfo.bucket +
//               ', object:' +
//               uploadInfo.object
//           );
//           //上传方式1, 需要根据uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress，如果videoId有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
//           // uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId);
//           //上传方式2
//           // uploader.setSTSToken(uploadInfo, accessKeyId, accessKeySecret,secretToken);
//         },
//         // 文件上传成功
//         onUploadSucceed: function(uploadInfo) {
//           console.log(
//             'onUploadSucceed: ' +
//               uploadInfo.file.name +
//               ', endpoint:' +
//               uploadInfo.endpoint +
//               ', bucket:' +
//               uploadInfo.bucket +
//               ', object:' +
//               uploadInfo.object
//           );
//         },
//         // 文件上传失败
//         onUploadFailed: function(uploadInfo, code, message) {
//           console.log(
//             'onUploadFailed: file:' +
//               uploadInfo.file.name +
//               ',code:' +
//               code +
//               ', message:' +
//               message
//           );
//         },
//         // 文件上传进度，单位：字节
//         onUploadProgress: function(uploadInfo, totalSize, loadedPercent) {
//           console.log(
//             'onUploadProgress:file:' +
//               uploadInfo.file.name +
//               ', fileSize:' +
//               totalSize +
//               ', percent:' +
//               Math.ceil(loadedPercent * 100) +
//               '%'
//           );
//         },
//         // 上传凭证超时
//         onUploadTokenExpired: function(uploadInfo) {
//           console.log('onUploadTokenExpired');
//           //上传方式1  实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
//           // uploader.resumeUploadWithAuth(uploadAuth);
//           // 上传方式2 实现时，从新获取STS临时账号用于恢复上传
//           // uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken, expireTime);
//         },
//         //全部文件上传结束
//         onUploadEnd: function(uploadInfo) {
//           console.log('onUploadEnd: uploaded all the files');
//         }
//       });
//       resolve(uploader);
//     });
//   });
// };
