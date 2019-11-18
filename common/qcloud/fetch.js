import 'isomorphic-fetch';

/**
 *
 * @param {string} url
 * @param {object} options
 * {
 *  method: 'GET'/'POST',
 *  headers: {}
 *  credentials: 'include'/'cross_origin'
 *  body
 * }
 */
export const request = (url, options = {}) => {
  let { method = 'GET', body, headers = {}, credentials } = options || {};
  if (!method) {
    console.log('error! method=null!');
  }
  if (!url) {
    console.log('error! url=null!');
  }
  if (method === 'GET' || method === 'DELETE') {
    body = null;
  }

  return fetch(url, {
    credentials,
    method,
    headers,
    body
  })
    .then(response => {
      let clonedResponse = response.clone();
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      let contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        //throw new TypeError("Oops, we haven't got JSON!");
        //console.log ("headers:", response.headers);
        return { errcode: 0, _orig_data: clonedResponse };
      }
    })
    .then(json => {
      if (!json.errcode) {
        return json;
      }
      throw json;
    });
};

export const requestPost = (url, data = {}) => {
  return request(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data)
  });
};

export const requestPut = (url, data = {}) => {
  return request(url, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify(data)
  });
};

export const requestGet = url => {
  return request(url, { credentials: 'include' });
};

export const requestDelete = url => {
  return request(url, { method: 'DELETE', credentials: 'include' });
};

export default request;
