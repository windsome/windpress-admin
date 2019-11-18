export const urlUpLevel = (url = '/') => {
  let basePath = '';
  let pathArray = url && url.split('/');
  for (let i = 0; i < pathArray.length - 1; i++) {
    if (pathArray[i] != '') {
      basePath += '/';
      basePath += pathArray[i];
    }
  }
  return basePath;
};

export const urlParams = queryString => {
  /*
    see: https://developer.mozilla.org/en-US/docs/Web/API/Location
    Location.search
    eg: ?a=1&b=2&c=3
  */
  var qsObj = {};
  var qs = queryString.substring(1);
  var qsArr = qs && qs.split('&');
  for (var i = 0; i < qsArr.length; i++) {
    var arr2 = qsArr[i].split('=');
    var name = arr2[0];
    qsObj[name] = arr2[1];
  }
  return qsObj;
};

export const dataURL2Blob = dataURL => {
  var dataArray = dataURL.split(',');

  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataArray[1]);

  // separate out the mime component
  var mimeString = dataArray[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  //Old Code
  //write the ArrayBuffer to a blob, and you're done
  //var bb = new BlobBuilder();
  //bb.append(ab);
  //return bb.getBlob(mimeString);

  //New Code
  return new Blob([ab], { type: mimeString });
};
