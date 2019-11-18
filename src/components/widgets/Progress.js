import React from 'react';

export const Progress = ({ value, style }) => {
  let additionClass = '';
  if (value < 25) {
    additionClass = '';
  } else if (value < 50) {
    additionClass = ' bg-success';
  } else if (value < 75) {
    additionClass = ' bg-warning';
  } else {
    additionClass = ' bg-danger';
  }
  if (value > 100) value = 100;
  if (value < 0) value = 0;
  let widthStyle = { width: value + '%' };
  return (
    <div className="progress" style={style}>
      <div
        className={'progress-bar progress-bar-striped' + additionClass}
        style={widthStyle}
      />
    </div>
  );
};
