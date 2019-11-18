require('babel-register');
let calMd5sum = require('../../md5sum').default;
let FileServer = require('../../FileServer').default;

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
console.log('will md5: ', filename);
let file = new FileServer(filename);
let onprogress = progress => {
  console.log('progress:', progress);
};
calMd5sum({ file, onprogress });
