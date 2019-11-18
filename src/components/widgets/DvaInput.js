import React from 'react';
import { Link } from 'react-router-dom';

export const DvaInput = ({
  name = '名称',
  nameStyle = {},
  value = '',
  placeholder = '请输入...'
}) => {
  return (
    <div className="media border-1 rounded-0 aligh-items-center">
      <div className="align-self-center" style={nameStyle}>
        {name}
      </div>
      <div className="media-body">
        <input
          type="text"
          className="form-control border-0 rounded-0"
          placeholder={placeholder}
          value={value || ''}
        />
      </div>
    </div>
  );
};

export default DvaInput;
