//import jsSHA from 'jssha';
import jsSHA from './jssha1.qcloud';

const readFileBuffer = (file, pos, count) => {
  let slice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice;
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onerror = error => {
      console.log('error! ', error);
      reject(error);
    };
    reader.onload = evt => {
      console.log('evt:', evt, ', loaded:', evt.loaded);
      let result = evt.target.result;
      resolve(result);
    };
    let blob = slice.call(file, pos, pos + count);
    reader.readAsArrayBuffer(blob);
  });
};
const readFileBinaryString = (file, pos, count) => {
  let slice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice;
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onerror = error => {
      console.log('error! ', error);
      reject(error);
    };
    reader.onload = evt => {
      console.log('evt:', evt, ', loaded:', evt.loaded);
      let result = evt.target.result;
      resolve(result);
    };
    let blob = slice.call(file, pos, pos + count);
    reader.readAsBinaryString(blob);
  });
};

const calSha1sumArrayBuffer = ({
  file = null, // required
  onprogress = null, // optional
  sliceSize = 1 * 1024 * 1024 // optional
} = {}) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('no file!'));
    }
    if (!sliceSize) {
      reject(new Error('no sliceSize!'));
    }

    let totalSize = file.size;
    console.log('calSha1sum start! fileSize=' + totalSize);
    let startTime = new Date().getTime();
    let shaObj = new jsSHA('SHA-1', 'ARRAYBUFFER');
    (async function loop() {
      let hashArray = [];
      let count = Math.ceil(totalSize / sliceSize);
      let pos = 0;
      for (let i = 0; i < count; i++) {
        let buffer = await readFileBuffer(file, pos, sliceSize);
        if (buffer) {
          let len = buffer.byteLength;
          //console.log('buffer'+i, len, buffer);
          shaObj.update(buffer);
          let hash = shaObj.getHash('HEX');
          hashArray.push({
            offset: pos,
            datalen: len,
            datasha: hash
          });
          pos += len;
          let percent = Math.floor(100 * pos / totalSize);
          onprogress && onprogress(percent);
        }
      }
      return hashArray;
    })()
      .then(hashArray => {
        let endTime = new Date().getTime();
        console.log('hashArray:', hashArray, ', time:', endTime - startTime);
        resolve(hashArray);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const calSha1sum = ({
  file = null, // required
  onprogress = null, // optional
  sliceSize = 1 * 1024 * 1024 // optional
} = {}) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('no file!'));
    }
    if (!sliceSize) {
      reject(new Error('no sliceSize!'));
    }

    let totalSize = file.size;
    console.log('calSha1sum start! fileSize=' + totalSize);
    let startTime = new Date().getTime();
    let shaObj = new jsSHA('SHA-1', 'BYTES');
    (async function loop() {
      let hashArray = [];
      let count = Math.ceil(totalSize / sliceSize);
      let pos = 0;
      for (let i = 0; i < count; i++) {
        let buffer = await readFileBinaryString(file, pos, sliceSize);
        if (buffer) {
          let len = buffer.length;
          //console.log('buffer'+i, len, buffer);
          let hash = shaObj.update(buffer); // 腾讯云中特殊的update，会返回值用来检测
          if (i == count - 1) {
            console.log('last one! need getHash(HEX)');
            hash = shaObj.getHash('HEX');
          }
          hashArray.push({
            offset: pos,
            datalen: len,
            datasha: hash
          });
          pos += len;
          let percent = Math.floor(100 * pos / totalSize);
          onprogress && onprogress(percent);
        }
      }
      return hashArray;
    })()
      .then(hashArray => {
        let endTime = new Date().getTime();
        console.log('hashArray:', hashArray, ', time:', endTime - startTime);
        resolve(hashArray);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export default calSha1sum;
