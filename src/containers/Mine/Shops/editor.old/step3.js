import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';

import { MenuItem } from 'components/widgets/Menu';
import FileInput from 'components/widgets/FileInput';
import { urlUpLevel } from 'utils/url';

export const Page = ({ match, push }) => {
  let next = urlUpLevel(match.url) + '/step4';
  // map
  return (
    <div>
      <div className="form-group">
        <label htmlFor="address">详细地址（请在地图上拖动）</label>
        <input
          className="form-control"
          id="address"
          placeholder="详细地址（下拉框中选择或手动输入）"
        />
      </div>
      <div />
      <button
        type="submit"
        className="btn btn-default"
        onClick={() => {
          push(next);
        }}
      >
        下一步
      </button>
    </div>
  );
};

export default connect(null, { push })(Page);
