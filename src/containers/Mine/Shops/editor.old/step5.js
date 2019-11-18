import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';

import { MenuItem } from 'components/widgets/Menu';
import FileInput from 'components/widgets/FileInput';

export const Page = ({ push }) => {
  // map
  return (
    <div>
      <div>恭喜您完成店铺上传！开店成功！</div>
      <button
        type="submit"
        className="btn btn-default"
        onClick={() => {
          push('/mine/shops');
        }}
      >
        下一步
      </button>
    </div>
  );
};

export default connect(null, { push })(Page);
