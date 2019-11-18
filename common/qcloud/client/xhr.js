/**
 *
 * @param {string} url dest url.
 * @param {object} options same as fetch()
 * {
 *  credentials: 'include',
 *  method: 'POST'/'GET'/'PUT'
 *  headers: {'Content-Type': 'application/json'},
 *  body,
 *  onupprogress: <function>,
 *  onprogress: <function>,
 *  async: true,
 *  responseType: 空字符串 (默认), "arraybuffer", "blob", "document", 和 "text".
 * }
 *
 * see also: https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
 * see also: https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
 */
const request = (url, options) => {
  return new Promise((resolve, reject) => {
    if (typeof url === 'object') {
      options = url;
      url = undefined;
    }

    url = url || options.url;
    let {
      credentials = null,
      method = 'GET',
      headers = {},
      body = null,
      onupprogress = null,
      onprogress = null,
      async = true,
      responseType = ''
    } =
      options || {};

    let xhr = new XMLHttpRequest();
    if (credentials) xhr.withCredentials = true;
    if (responseType) xhr.responseType = responseType;

    xhr.upload.addEventListener('progress', evt => {
      if (evt.lengthComputable) {
        if (evt.total > 0) {
          let percent = Math.floor(100 * evt.loaded / evt.total);
          onupprogress && onupprogress(percent, evt.loaded, evt.total);
        } else {
          console.log('can not compute since evt.total=' + evt.total);
        }
      } else {
        console.log(
          'Unable to compute progress since the total size is unknown'
        );
      }
    });
    xhr.upload.addEventListener('load', evt => {
      onupprogress && onupprogress(100, evt && evt.loaded, evt && evt.total);
    });
    xhr.upload.addEventListener('error', evt => {
      reject(new Error('error upload'));
    });
    xhr.upload.addEventListener('abort', evt => {
      reject(new Error('abort upload'));
    });

    xhr.addEventListener('progress', evt => {
      if (evt.lengthComputable) {
        if (evt.total > 0) {
          let percent = Math.floor(100 * evt.loaded / evt.total);
          onprogress && onprogress(percent, evt.loaded, evt.total);
        } else {
          console.log('can not compute since evt.total=' + evt.total);
        }
      } else {
        console.log(
          'Unable to compute progress since the total size is unknown'
        );
      }
    });
    xhr.addEventListener('load', evt => {
      onprogress && onprogress(100, evt && evt.loaded, evt && evt.total);
    });
    xhr.addEventListener('error', evt => {
      reject(new Error('error download'));
    });
    xhr.addEventListener('abort', evt => {
      reject(new Error('abort download'));
    });

    xhr.onreadystatechange = evt => {
      console.log('readyState:', xhr.readyState, ', status:', xhr.status);
      if (xhr.readyState === xhr.DONE) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          //do successCallback
          let result = null;
          if (xhr.responseType === 'json') {
            result = xhr.response;
          } else if (xhr.responseType === 'text' || xhr.responseType === '') {
            try {
              result = JSON.parse(xhr.responseText);
            } catch (e) {
              console.log('warning! parse json fail!');
              result = {
                errcode: 0,
                _orig_type: xhr.responseType,
                _orig_data: xhr.responseText
              };
            }
          } else {
            // if (xhr.responseType === 'arraybuffer' || xhr.responseType === 'blob' || xhr.responseType === 'document') {
            result = {
              errcode: 0,
              _orig_type: xhr.responseType,
              _orig_data: xhr.response
            };
          }
          resolve(result);
        } else {
          reject(new Error('xhr.status:' + xhr.status));
        }
      }
    };

    xhr.open(method, url, async);
    // Set headers
    for (let i in headers) {
      if (headers[i] !== undefined) {
        xhr.setRequestHeader(i, headers[i] + '');
      }
    }
    xhr.send(body);
  });
};

export default request;
