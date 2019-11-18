import SparkMD5 from 'spark-md5';

const calMd5sum = ({
  file = null, // required
  onprogress = null, // optional
  sliceSize = 1 * 1024 * 1024 // optional
} = {}) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('no file!'));
    }
    if (!file.read) {
      reject(new Error('file not contain read()'));
    }
    if (!sliceSize) {
      reject(new Error('no sliceSize!'));
    }

    console.log('calMd5sum start! file.size=' + file.size);
    let totalSize = file.size;
    let startTime = new Date().getTime();
    let spark = new SparkMD5.ArrayBuffer();
    (async function loop() {
      let count = Math.ceil(totalSize / sliceSize);
      let pos = 0;
      for (let i = 0; i < count; i++) {
        let arraybuffer = await file.read(pos, sliceSize);
        if (arraybuffer) {
          spark.append(arraybuffer); // append array buffer
          pos += arraybuffer.length;
          let percent = Math.floor(100 * pos / totalSize);
          onprogress && onprogress(percent);
        }
      }
      return pos;
    })()
      .then(readSize => {
        let hash = spark.end().toUpperCase();
        let endTime = new Date().getTime();
        console.log(
          'readSize:' +
            readSize +
            ', md5sum:' +
            hash +
            ', time:' +
            (endTime - startTime)
        );
        resolve(hash);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export default calMd5sum;
