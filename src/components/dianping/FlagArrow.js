import React from 'react';

export const FlagArrow = ({
  name,
  icon = 'fa fa-angle-right',
  style = null
}) => {
  let defaultStyle = {
    border: '1px solid #ff9470',
    maxWidth: '100%',
    lineHeight: '1',
    fontSize: '0.7em',
    color: '#f63'
    //padding: '3px'
  };
  style = { ...defaultStyle, ...style };
  return (
    <div className="media align-items-center" style={style}>
      <div className="media-body text-truncate p-1">{name}</div>
      <span className={'mr-1 ' + icon} />
    </div>
  );
};

export default FlagArrow;
