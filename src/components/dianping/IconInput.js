import React from 'react';

export const InputIconLeft = ({
  value = '',
  placeholder = '关键词',
  icon = 'fa fa-search',
  inputStyle = null,
  onChange = null,
  iconFunc = null
}) => {
  let defaultInputStyle = {
    background: '#f3f3f3 none repeat scroll 0 0',
    border: 'medium none',
    borderRadius: '30px',
    boxShadow: 'none',
    fontSize: '14px',
    margin: 0,
    position: 'absolute',
    paddingLeft: '22px',
    //height: '35px',
    width: '100px'
  };
  inputStyle = { ...defaultInputStyle, ...inputStyle };
  let iconStyle = {
    left: '5px',
    position: 'relative'
  };
  return (
    <span className="d-inline-block">
      <input
        type="text"
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={onChange}
      />
      <span style={iconStyle} onClick={iconFunc}>
        <i className={icon} />
      </span>
    </span>
  );
};

export const InputIconRight = ({
  value = '',
  placeholder = '关键词',
  icon = 'fa fa-search',
  inputStyle = null,
  onChange = null,
  iconFunc = null
}) => {
  let defaultInputStyle = {
    background: '#f3f3f3 none repeat scroll 0 0',
    border: 'medium none',
    borderRadius: '30px',
    boxShadow: 'none',
    fontSize: '14px',
    margin: 0,
    paddingLeft: '12px',
    paddingRight: '22px',
    //height: '35px',
    width: '100px'
  };
  inputStyle = { ...defaultInputStyle, ...inputStyle };
  let iconStyle = {
    position: 'absolute',
    right: '5px'
  };
  return (
    <span className="d-inline-block position-relative">
      <input
        type="text"
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={onChange}
      />
      <span style={iconStyle} onClick={iconFunc}>
        <i className={icon} />
      </span>
    </span>
  );
};

export default InputIconLeft;
