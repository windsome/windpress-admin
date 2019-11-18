require('babel-register');
let calMd5sum = require('../md5sum').default;
let FileFront = require('../FileFront').default;

const md5 = file => {
  console.log('will md5');
  let onprogress = progress => {
    console.log('progress:', progress);
  };
  calMd5sum({ file: new FileFront(file), onprogress });
};

module.exports = md5;
