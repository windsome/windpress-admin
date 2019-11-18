import React from 'react';

import './FileInput.css';

export const ImageClosable = ({ src, onClose }) => {
  return (
    <div className="image_closable_wrapper">
      <div className="fileinput" style={{ opacity: 1 }}>
        <img src={src} className="preview img-thumbnail" alt={src} />
        <i className="close fa fa-times" onClick={onClose} tabIndex="0" />
      </div>
    </div>
  );
};

const ImageClosableTest = () => {
  let images = [
    { src: '/ysj/images/slide1.jpg' },
    { src: '/ysj/images/headnews.jpeg' },
    { src: '/ysj/images/slide4.jpg' }
  ];
  let uiImages = images.map((image, index) => {
    return (
      <div key={index} className="col-4">
        <ImageClosable
          src={image.src}
          onClose={() => console.log('close' + index)}
        />
      </div>
    );
  });
  return (
    <div className="container-fluid jumbotron-fluid">
      <div className="row no-gutters">{uiImages}</div>
    </div>
  );
};

export default ImageClosable;
