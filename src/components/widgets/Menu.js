import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

export const MenuItem = ({
  icon = 'fa fa-shopping-cart',
  title = '主标题',
  subtitle = '副标题',
  subicon = 'fa fa-angle-right',
  link = null,
  href = null,
  onClick = null,
  height = 50
}) => {
  let Inner = ({ ...props }) => {
    if (onClick) {
      return <div {...props} onClick={onClick} />;
    } else if (link) {
      return <Link {...props} to={link} />;
    } else if (href) {
      return <a {...props} href={href} />;
    } else {
      return <div {...props} />;
    }
  };

  return (
    <div
      className="media align-items-center align-content-center px-2 label-act"
      style={{ height, width: '100%' }}
    >
      <Inner className="media-body media linkwrapper">
        {icon && (
          <div className="mr-2">
            <span className={icon} />
          </div>
        )}
        <div className="media-body text-nowrap title mr-2">
          <span>{title}</span>
        </div>
        {subtitle && (
          <div className="text-truncate">
            <span className="subtitle mr-2">{subtitle}</span>
          </div>
        )}
        {subicon && (
          <div>
            <span className={subicon} />
          </div>
        )}
      </Inner>
    </div>
  );
};

export const GoBackItem = ({
  title = '主标题',
  link = '/',
  onClick = null,
  height = 50
}) => {
  let Inner = ({ ...props }) => {
    if (onClick) {
      return <div {...props} onClick={onClick} />;
    } else {
      return <Link {...props} to={link} />;
    }
  };

  return (
    <div
      className="media align-items-center align-content-center px-2 label-act"
      style={{ height }}
    >
      <Inner className="media-body media linkwrapper align-items-center">
        <i className="fa fa-arrow-left px-2" />
        <div className="media-body text-nowrap title mr-2">
          <span>{title}</span>
        </div>
      </Inner>
    </div>
  );
};
