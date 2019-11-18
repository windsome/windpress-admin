import React from 'react';

import './FileInput.css';

export const ImageKeepRatio = ({ src, ratio = 100 }) => {
  let style = {
    paddingBottom: ratio + '%'
  };
  return (
    <div className="image_closable_wrapper border-0" style={style}>
      <div className="fileinput" style={{ opacity: 1 }}>
        <img
          src={src}
          className="preview img-thumbnail rounded-0 border-0"
          alt={src}
        />
      </div>
    </div>
  );
};

export default ImageKeepRatio;
