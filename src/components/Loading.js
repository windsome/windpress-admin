import React from 'react';

export default ({ isLoading, error }) => {
  // Handle the loading state
  if (isLoading) {
    return <div>正在加载...</div>;
  } else if (error) {
    // Handle the error state
    return (
      <div>{'对不起，加载页面失败！请关闭页面重新进入！' + error.message}</div>
    );
  } else {
    return null;
  }
};
