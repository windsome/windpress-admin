require('babel-register');
let uploadFile = require('../../upload').putFile;
let FileServer = require('../../FileServer').default;
let getAuthorization = require('../../auth').default;

const help = () => {
  console.log('####################################');
  console.log('usage:');
  console.log(process.argv[0], process.argv[1], '[filename]');
  console.log('filename: default: ', process.argv[1]);
  console.log('####################################');
};
help();
let arguments = process.argv.splice(2);
let filename =
  (arguments && arguments[0]) || process.argv[1] || './md5_server.js';

let file = new FileServer(filename);
let onprogress = progress => {
  console.log('progress:', progress);
};

let pathname = file.name;
let authorization = getAuthorization(
  {
    appId: '1255968143',
    secretId: 'AKIDqVv74qZpxpWx8AaSjlZ8ScXCcolUPCCx',
    secretKey: 'e4FAqHTP6XkhPr65nMgofGaeW8XhhTzJ'
  },
  { pathname, method: 'put' }
);

console.log('get authorization:', authorization);
uploadFile(file, {
  bucket: 'ceshi-1255968143',
  authorization,
  protocol: 'http',
  path: pathname,
  region: 'ap-shanghai'
}).then(result => {
  let response = result._orig_data;
  let ETag = response.headers.get('etag');

  console.log('etag:', ETag, ', headers:', response.headers);
  response.text().then(text => {
    console.log('to text:', text);
    console.log('response:', response);
  });
});
