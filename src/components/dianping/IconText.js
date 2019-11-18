import React from 'react';

export const IconText = ({
  name,
  textStyle = null,
  iconFront = null, //'fa fa-angle-right',
  iconBack = null, //'fa fa-angle-right',
  iconFrontFunc = null,
  iconBackFunc = null,
  textFunc = null
}) => {
  let defaultStyle = {
    border: '1px solid #f63',
    maxWidth: '100%',
    lineHeight: '1',
    fontSize: '0.7rem',
    color: '#f63',
    padding: '2px'
  };
  textStyle = { ...defaultStyle, ...textStyle };
  return (
    <div className="d-inline-block">
      <div className="media" style={textStyle}>
        {iconFront && (
          <span className="mr-1">
            <i className={iconFront} onClick={iconFrontFunc} />
          </span>
        )}
        <span className="media-body text-truncate" onClick={textFunc}>
          {name}
        </span>
        {iconBack && (
          <span className="ml-1">
            <i className={iconBack} onClick={iconBackFunc} />
          </span>
        )}
      </div>
    </div>
  );
};

export default IconText;
