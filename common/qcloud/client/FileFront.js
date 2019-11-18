export default class FileFront {
  constructor(file) {
    this.file = file;
    this.slice =
      File.prototype.slice ||
      File.prototype.mozSlice ||
      File.prototype.webkitSlice;
    this.size = (file && file.size) || 0;
    this.name = file.name;
  }

  read(pos, count) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onerror = error => {
        console.log('error! ', error);
        reject(error);
      };
      reader.onload = evt => {
        console.log('evt:', evt, ', loaded:', evt.loaded);
        let arraybuffer = evt.target.result;
        resolve(arraybuffer);
      };
      let blob = this.slice.call(this.file, pos, pos + count);
      reader.readAsArrayBuffer(blob);
    });
  }

  getArrayBuffer() {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onerror = error => {
        console.log('error! ', error);
        reject(error);
      };
      reader.onload = evt => {
        console.log('evt:', evt, ', loaded:', evt.loaded);
        let arraybuffer = evt.target.result;
        resolve(arraybuffer);
      };
      reader.readAsArrayBuffer(this.file);
    });
  }
}
