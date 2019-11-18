export const DEFAULT_MAX_WIDTH = 720;
export const DEFAULT_MAX_HEIGHT = 720;

const calcDestRect = (
  srcRect,
  {
    keepRatio = true, // optional
    maxWidth = DEFAULT_MAX_WIDTH, // optional
    maxHeight = DEFAULT_MAX_HEIGHT // optional
  } = {}
) => {
  if (!maxWidth && !maxHeight) {
    console.log(
      'option missing! maxWidth=',
      maxWidth,
      ', maxHeight=',
      maxHeight
    );
    return srcRect;
  }
  var destWidth = srcRect.width;
  var destHeight = srcRect.height;
  if (keepRatio) {
    if (maxWidth && maxHeight) {
      var ratio = maxWidth / srcRect.width;
      var ratioH = maxHeight / srcRect.height;
      if (ratioH < ratio) ratio = ratioH;
      destWidth = srcRect.width * ratio;
      destHeight = srcRect.height * ratio;
    } else if (maxWidth) {
      var ratio = maxWidth / srcRect.width;
      destWidth = srcRect.width * ratio;
      destHeight = srcRect.height * ratio;
    } else if (maxHeight) {
      var ratio = maxHeight / srcRect.height;
      destWidth = srcRect.width * ratio;
      destHeight = srcRect.height * ratio;
    }
  } else {
    if (maxWidth && maxHeight) {
      destWidth = maxWidth;
      destHeight = maxHeight;
    } else if (maxWidth) {
      destWidth = maxWidth;
    } else if (maxHeight) {
      destHeight = maxHeight;
    }
  }
  return { width: Math.floor(destWidth), height: Math.floor(destHeight) };
};

const getFileDataURL = file => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result);
    };
    reader.onerror = function(e) {
      console.log('getFileDataURL error:', e);
      reject(e);
    };
    reader.readAsDataURL(file);
  });
};

const getFilename = url => {
  if (url) {
    var m = url.toString().match(/.*\/(.+?)\./);
    if (m && m.length > 1) {
      return m[1];
    }
  }
  return null;
};

const basename = name => {
  if (name && name.lastIndexOf('.') > 0)
    return name.substr(0, name.lastIndexOf('.'));
  else return name;
};

export const dataUrlScale = (
  dataUrl,
  {
    maxWidth = DEFAULT_MAX_WIDTH, // optional
    maxHeight = DEFAULT_MAX_HEIGHT, // optional
    keepRatio = true, // optional
    filename = null // optional
  } = {}
) => {
  /* 
    output: { width, height, dataUrl, [filename] }
  */
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function() {
      if (dataUrl.indexOf(';base64,') < 0) {
        filename = getFilename(dataUrl) || filename || 'noname';
      }

      let destRect = calcDestRect(
        { width: this.width, height: this.height },
        { maxWidth, maxHeight, keepRatio }
      );
      let canvas = document.createElement('canvas');
      canvas.width = destRect.width;
      canvas.height = destRect.height;

      let ctx = canvas.getContext('2d');
      ctx.drawImage(this, 0, 0, destRect.width, destRect.height);

      //let dataUrlDest = canvas.toDataURL("image/png");
      //filename = basename(filename) + '.png';
      let dataUrlDest = canvas.toDataURL('image/jpeg', 0.2);
      filename = basename(filename) + '.jpg';
      //console.log ("dataUrlDest:", dataUrlDest);

      //let blob = canvas.toBlob("image/png");
      //let blob = canvas.toBlob("image/jpeg", 0.5);
      resolve({
        filename,
        dataUrl: dataUrlDest,
        width: destRect.width,
        height: destRect.height
      });
    };
    img.onerror = function(e) {
      console.log('error:', e);
      reject(e);
    };

    img.src = dataUrl;
  });
};

export const imageFileScale = async (
  file,
  {
    maxWidth = DEFAULT_MAX_WIDTH, // optional
    maxHeight = DEFAULT_MAX_HEIGHT, // optional
    keepRatio = true, // optional
    filename = null // optional
  } = {}
) => {
  /*
    output: { width, height, dataURL, filename }
  */
  let dataUrl = await getFileDataURL(file);
  filename = file.name || filename;
  return await dataUrlScale(dataUrl, {
    maxWidth,
    maxHeight,
    keepRatio,
    filename
  });
};

export const imageFileScaleSync = (
  file,
  {
    maxWidth = DEFAULT_MAX_WIDTH, // optional
    maxHeight = DEFAULT_MAX_HEIGHT, // optional
    keepRatio = true, // optional
    filename = null // optional
  } = {}
) => {
  filename = filename || file.name || 'noname_scale';
  return getFileDataURL(file).then(dataUrl =>
    dataUrlScale(dataUrl, { maxWidth, maxHeight, keepRatio, filename })
  );
};

export const imageFileListScale = async (
  files,
  {
    maxWidth = DEFAULT_MAX_WIDTH, // optional
    maxHeight = DEFAULT_MAX_HEIGHT, // optional
    keepRatio = true, // optional
    onprogress = null // optional
  } = {}
) => {
  /* 
    output: [{ width, height, dataUrl, filename }]
  */
  let list = [];
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let filename = file.name;
    //let dataUrl = await getFileDataURL (file);
    //let dest = await dataUrlScale (dataUrl, opts);

    let dest = await imageFileScale(file, {
      maxWidth,
      maxHeight,
      keepRatio,
      filename
    });
    list.push(dest);
    let percent = 100 * (i + 1) / files.length;
    onprogress && onprogress({ filename, percent });
  }
  return list;
};
