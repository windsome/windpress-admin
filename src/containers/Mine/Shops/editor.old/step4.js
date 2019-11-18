import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';

import { MenuItem } from 'components/widgets/Menu';
import FileInput from 'components/widgets/FileInput';
import { urlUpLevel } from 'utils/url';

import './step4.css';

export const Page = ({ match, push }) => {
  let next = urlUpLevel(match.url) + '/step5';
  // tags
  return (
    <div className="step4">
      <div class="form-group">
        <label>选择标签（机构服务的项目）</label>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <span className="d-inline-block bg-primary rounded p-1 mx-2 my-1 item">
              英语<sup className="badge bg-warning rounded-circle deselect">
                x
              </sup>
            </span>
            <span className="d-inline-block bg-primary rounded p-1 mx-2 my-1 item">
              德语<sup className="badge bg-warning rounded-circle deselect">
                x
              </sup>
            </span>
            <span className="d-inline-block bg-primary rounded p-1 mx-2 my-1 item">
              日语<sup className="badge bg-warning rounded-circle deselect">
                x
              </sup>
            </span>
            <span className="d-inline-block bg-primary rounded p-1 mx-2 my-1 item">
              汉语
            </span>
            <span className="d-inline-block bg-primary rounded p-1 mx-2 my-1 item">
              西班牙语<sup className="badge bg-warning rounded-circle deselect">
                x
              </sup>
            </span>
            <span className="d-inline-block bg-primary rounded p-1 mx-2 my-1 item">
              法语<sup className="badge bg-warning rounded-circle deselect">
                x
              </sup>
            </span>
            <span className="d-inline-block bg-primary rounded p-1 mx-2 my-1 item">
              英语
            </span>
          </div>
          <div className="col-12">
            <span className="d-inline-block bg-primary rounded p-1 mx-2 my-1 item">
              声乐<sup className="badge bg-warning rounded-circle deselect">
                x
              </sup>
            </span>
            <span className="d-inline-block bg-primary rounded p-1 mx-2 my-1 item">
              口琴<sup className="badge bg-warning rounded-circle deselect">
                x
              </sup>
            </span>
            <span className="d-inline-block bg-primary rounded p-1 mx-2 my-1 item">
              钢琴<sup className="badge bg-warning rounded-circle deselect">
                x
              </sup>
            </span>
            <span className="d-inline-block bg-primary rounded p-1 mx-2 my-1 item">
              小提琴
            </span>
            <span className="d-inline-block bg-primary rounded p-1 mx-2 my-1 item">
              吉他<sup className="badge bg-warning rounded-circle deselect">
                x
              </sup>
            </span>
            <span className="d-inline-block bg-primary rounded p-1 mx-2 my-1 item">
              萨克风<sup className="badge bg-warning rounded-circle deselect">
                x
              </sup>
            </span>
            <span className="d-inline-block bg-primary rounded p-1 mx-2 my-1 item">
              英语
            </span>
          </div>
        </div>
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
