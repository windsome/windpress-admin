export const request = (method, url, data = {}) => {
  if (!method) {
    console.log('error! method=null!');
  }
  if (!url) {
    console.log('error! url=null!');
  }
  let body = null;
  if (method === 'GET' || method === 'DELETE') {
    body = null;
  } else {
    body = JSON.stringify(data);
  }

  return (
    fetch(url, {
      credentials: 'include',
      method,
      headers: { 'Content-Type': 'application/json' },
      body
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        if (response.status === 204) {
          throw new Error('没有数据');
        }
        // let contentLength = response.headers.get("Content-Length");
        // if (typeof (contentLength) != 'null' &&  contentLength <= 0) {
        //   throw new Error ('未得到数据！'+contentLength);
        // }
        return response;
      })
      .then(response => response.json())
      // .then(response => {
      //   let contentType = response.headers.get('content-type');
      //   //console.log ("contentType:", contentType);
      //   if (contentType.includes('application/json')) {
      //     return response.json();
      //   } else {
      //     console.log("Oops, we haven't got JSON!");
      //     return { errcode: -1, xContentType: contentType, xOrigData: response };
      //   }
      // })
      .then(json => {
        if (!json.errcode) {
          return json;
        }
        throw json;
        //throw new Error('errcode=' + json.errcode + ' ' + json.message);
      })
  );
};

export const requestPost = (url, data = {}) => {
  return request('POST', url, data);
};

export const requestPut = (url, data = {}) => {
  return request('PUT', url, data);
};

export const requestGet = url => {
  return request('GET', url);
};

export const requestDelete = url => {
  return request('DELETE', url);
};

export default request;
