import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      <span>页面飞走了！！！</span>
      <Link to={'/'}>回到首页</Link>
    </div>
  );
};

export default NotFound;
