import fs from 'fs';
import path from 'path';

export default class FileServer {
  constructor(file) {
    this.fd = 0;
    this.size = 0;
    if (typeof file === 'string') {
      this.fd = fs.openSync(file, 'r');
      let stat = fs.statSync(file);
      this.size = stat.size;
      this.name = path.basename(file);
    } else {
      console.log('error! parameter file not string! file:', file);
    }
  }

  read(offset, count) {
    return new Promise((resolve, reject) => {
      if (!this.fd) {
        reject(new Error('fd is null!'));
      }
      let buf = new Buffer(count);
      fs.read(this.fd, buf, 0, buf.length, offset, function(err, bytes) {
        if (err) {
          reject(err);
        }
        console.log(bytes + ' bytes read');

        // Print only read bytes to avoid junk.
        if (bytes > 0) {
          resolve(buf.slice(0, bytes));
        } else {
          resolve(null);
        }
      });
    });
  }

  getArrayBuffer() {
    return new Promise((resolve, reject) => {
      if (!this.fd) {
        reject(new Error('fd is null!'));
      }
      let buf = new Buffer(this.size);
      fs.read(this.fd, buf, 0, buf.length, 0, function(err, bytes) {
        if (err) {
          reject(err);
        }
        console.log(bytes + ' bytes read');

        // Print only read bytes to avoid junk.
        if (bytes > 0) {
          let retbuf = buf.slice(0, bytes);
          resolve(retbuf);
          // //let buffer = Buffer.from(arraybuffer);
          // let arraybuffer = Uint8Array.from(retbuf).buffer;
          // resolve(arraybuffer);
        } else {
          resolve(null);
        }
      });
    });
  }
}
