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
  let next = urlUpLevel(match.url) + '/step3';
  return (
    <div>
      <div>上传营业执照的清晰照片</div>
      <div className="col-6">
        <FileInput
          noinput={false}
          onClick={() => console.log('onClick')}
          onChange={() => console.log('onChange')}
        />
      </div>
      <div>上传主图</div>
      <div className="col-6">
        <FileInput
          noinput={false}
          onClick={() => console.log('onClick')}
          onChange={() => console.log('onChange')}
        />
      </div>
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
