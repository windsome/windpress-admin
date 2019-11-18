import React from 'react';

import './FormInput.css';

export const FormInput = ({
  wrapperClassName = 'ysj-input-wrapper',
  innerClassName = 'form-control ysj-input-inner',
  placeholder = '请输入内容',
  value = null,
  onChange = null
}) => {
  return (
    <div className={wrapperClassName}>
      <input
        type="text"
        className={innerClassName}
        placeholder={placeholder}
        onChange={onChange}
        value={value || ''}
      />
    </div>
  );
};

export const FormTextarea = ({
  wrapperClassName = 'ysj-input-wrapper',
  innerClassName = 'form-control ysj-input-inner',
  placeholder = '请输入内容',
  value = null,
  onChange = null,
  rows = 3
}) => {
  return (
    <div className={wrapperClassName}>
      <textarea
        className={innerClassName}
        rows={rows}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
      />
    </div>
  );
};
