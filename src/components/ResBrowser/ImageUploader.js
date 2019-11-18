import React from 'react';
import parseUserAgent from 'utils/userAgent';
import { ImageAdd } from '../widgets/Svg';
import './ImageUploader.css';
let xdebug = window.myDebug('app:ImageUploader');

export const ImageUploader = ({
  multiple = false, // "multiple"
  doUpload = null,
  accept = 'image/*',
  text = '添加图片'
} = {}) => {
  let ua = parseUserAgent(navigator.userAgent);
  let isWechat = !!ua.wechat;

  let InputElement = () => {
    if (isWechat) {
      return (
        <div
          className="fileinput"
          onClick={evt => doUpload(evt, isWechat)}
          tabIndex="0"
        />
      );
    } else {
      let inputAttrs = {};
      if (multiple) inputAttrs = { multiple: 'multiple' };
      return (
        <input
          className="fileinput"
          type="file"
          accept={accept}
          onChange={evt => doUpload(evt)}
          {...inputAttrs}
        />
      );
    }
  };

  return (
    <div className="weui_uploader_input">
      <span className="desc1">{text}</span>
      <InputElement />
    </div>
  );
};

export const ImageUploaderSvg = ({
  multiple = false, // "multiple"
  isWechat = false,
  doUpload = null,
  accept = 'image/*',
  text = '添加图片'
} = {}) => {
  let InputElement = () => {
    if (isWechat) {
      return (
        <div
          className="fileinput"
          onClick={evt => doUpload(evt, isWechat)}
          tabIndex="0"
        />
      );
    } else {
      let inputAttrs = {};
      if (multiple) inputAttrs = { multiple: 'multiple' };
      return (
        <input
          className="fileinput"
          type="file"
          accept={accept}
          onChange={evt => doUpload(evt)}
          {...inputAttrs}
        />
      );
    }
  };

  return (
    <div className="weui_uploader_v2">
      <ImageAdd />
      <InputElement />
    </div>
  );
};

export default ImageUploader;
