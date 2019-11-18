import request from '../fetch';

export const putFile = (file, options) => {
  if (!file) {
    throw new Error('error! parameter file missing!');
  }
  let bucket = options && options.bucket;
  let authorization = options && options.authorization;
  let path = (options && options.path) || file.name;
  let region = (options && options.region) || 'sh';
  let protocol = (options && options.protocol) || 'https';

  if (!bucket) {
    throw new Error('error! parameter bucket missing!');
  }

  if (!authorization) {
    throw new Error('error! parameter authorization missing!');
  }

  if (!path) {
    throw new Error('error! parameter path missing!');
  }

  if (!(file && file.getArrayBuffer)) {
    throw new Error('error! missing file.getArrayBuffer()!');
  }

  let urlPrefix = 'PROTOCOL://BUCKET.cos.REGION.myqcloud.com';
  let url = urlPrefix
    .replace(/PROTOCOL/g, protocol)
    .replace(/BUCKET/g, bucket)
    .replace(/REGION/g, region);
  if (path[0] != '/') url = url + '/' + path;
  else url += path;

  return file.getArrayBuffer().then(arraybuffer =>
    request(url, {
      method: 'PUT',
      headers: {
        Authorization: authorization
      },
      body: arraybuffer
    })
  );
};

export const postFormData = (formdata, options) => {
  if (!formdata) {
    throw new Error('error! parameter formdata missing!');
  }
  let bucket = options && options.bucket;
  let authorization = options && options.authorization;
  let path = (options && options.path) || '';
  let region = (options && options.region) || 'sh';
  let protocol = (options && options.protocol) || 'https';

  if (!bucket) {
    throw new Error('error! parameter bucket missing!');
  }

  if (!authorization) {
    throw new Error('error! parameter authorization missing!');
  }

  let urlPrefix = 'PROTOCOL://BUCKET.cos.REGION.myqcloud.com';
  let url = urlPrefix
    .replace(/PROTOCOL/g, protocol)
    .replace(/BUCKET/g, bucket)
    .replace(/REGION/g, region);

  path.indexOf('/') !== 0 && (path = '/' + path);
  url += path;

  return request(url, {
    method: 'POST',
    body: formdata
  });
};
