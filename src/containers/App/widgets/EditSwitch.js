import React from 'react';
let xdebug = window.myDebug('app:EditSwitch');

const EditSwitch = ({
  canEdit = false,
  editing = false,
  className = '',
  style = {},
  onClick
}) => {
  if (!canEdit) return null;

  if (editing) {
    return (
      <span
        className={'badge badge-danger position-absolute ' + className}
        style={{ ...style, opacity: 0.5, zIndex: 1001 }}
        onClick={onClick}
      >
        完成
      </span>
    );
  } else {
    return (
      <span
        className={'badge badge-warning position-absolute ' + className}
        style={{ ...style, opacity: 0.5, zIndex: 1001 }}
        onClick={onClick}
      >
        编辑
      </span>
    );
  }
};

export default EditSwitch;
