import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';
import Moment from 'moment';

import Loadable from 'react-loadable';
import Loading from 'components/Loading';
import NotFound from 'components/NotFound';

import { retrieve as retrieveMatchs } from 'modules/match';
import {
  dbSelect as dbMatchSelect,
  retrieveSelect as dataMatchRetrieveSelect
} from 'selectors/match';
import _key from 'modules/u_key';

import './index.css';

let xdebug = window.myDebug('app:match:index:');

export class Page extends React.Component {
  constructor() {
    super();
    this.doQuery = this.doQuery.bind(this);
  }
  state = {
    qs: null,
    result: null,
    errMsg: null
  };

  getQs(match, qs) {
    let id = match && match.params && match.params.id;
    if (qs) {
      return 'id=' + id + ';arg=' + qs;
    } else return 'id=' + id;
  }

  doQuery() {
    let { retrieveMatchs } = this.props;
    let qs = this.getQs(this.props.match, this.state.qs);
    retrieveMatchs(qs)
      .then(ret => {
        console.log('retrieveMatchs result:', ret);
        let result = ret && ret.data && ret.data[0];
        this.setState({ result, errMsg: null });
      })
      .catch(error => {
        console.log('match error!', error);
        this.setState({ result: null, errMsg: error.message });
      });
  }

  render() {
    console.log('render() ', this.props, this.state);
    let { match } = this.props;
    let { result, errMsg, qs } = this.state;
    let matchId = match && match.params && match.params.id;
    let uiDetail =
      result &&
      result.detail &&
      result.detail.map(item => {
        return <div>{item}</div>;
      });

    return (
      <div>
        <div className="ys-head">
          <h1>成绩查询</h1>
        </div>
        <div>
          <img src="/ysj/images/match1.jpg" className="img-fluid" />
        </div>
        <div className="text-center p-2">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="姓名或电话"
              value={this.state.qs || ''}
              onChange={evt => this.setState({ qs: evt.target.value })}
            />
            <button
              className="btn btn-warning input-group-addon"
              onClick={this.doQuery}
            >
              搜索
            </button>
          </div>
          <div>{errMsg}</div>
        </div>
        {result && (
          <div className="bg-white h5 mx-2">
            <div>{result.name}</div>
            {uiDetail}
          </div>
        )}
        <footer className="match-footer text-center">
          <div>艺书佳教育科技（上海）有限公司</div>
          <div class="bbbb">沪ICP备14023766号-2</div>
          <div>电话：56613193&nbsp;&nbsp;邮箱：drm321123@163.com</div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    dbMatch: dbMatchSelect(state),
    dataMatchRetrieve: dataMatchRetrieveSelect(state)
  };
};

const mapActionsToProps = {
  push,
  retrieveMatchs
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
