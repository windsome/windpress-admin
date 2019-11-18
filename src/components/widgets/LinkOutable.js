import React from 'react';
import { Link } from 'react-router-dom';

export const LinkOutable = props => {
  let { to, ...restProps } = props || {};
  to = to || '/';
  let lowerTo = to && to.toLowerCase();
  let isOutLink =
    (lowerTo &&
      (lowerTo.indexOf('http://') >= 0 || lowerTo.indexOf('https://') >= 0)) ||
    false;
  if (isOutLink) {
    return <a href={to} {...restProps} />;
  } else {
    return <Link to={to} {...restProps} />;
  }
};

export default LinkOutable;
