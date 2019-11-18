import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { push, goBack } from 'react-router-redux';
import { connect } from 'react-redux';
import withPagedata from '../hoc/withPagedata';
import withModules from '../hoc/withModules';
import { meSelect } from 'selectors/user';
import { loginCookie } from 'modules/user';
import {
  keyRetrieveResult,
  keyRetrieveInfo,
  keyRetrieveItems
} from 'modules/u_key';

export class Page extends Component {
  constructor(props) {
    super(props);
    console.log('constructor');
  }
  state = {
    rawContent: null
  };
  componentDidMount() {
    let { retrieveProduct } = this.props;
    retrieveProduct()
      .then(result => {
        console.log('result:', result);
      })
      .catch(error => {
        console.log('error:', error);
      });
  }

  renderProductList() {
    let { dbProduct, dataProductRetrieve } = this.props;
    let items = keyRetrieveItems(dbProduct, dataProductRetrieve);
    if (!items) {
      return <div>没有数据</div>;
    }

    let uiItems = items.map((item, index) => {
      if (!item) return null;
      return <div>{JSON.stringify(item)}</div>;
    });

    return <div>{uiItems}</div>;
  }

  renderList() {
    let { goBack } = this.props;
    let arr = [];
    for (let i = 0; i < 100; i++) {
      arr.push(i);
    }
    let uis = arr.map(item => {
      return <div>{'index:' + item}</div>;
    });
    return (
      <div>
        <div onClick={() => goBack(-1)}>需要测试返回时滚动条滚动到先前位置</div>
        <div onClick={() => goBack(-1)}>{'返回'}</div>
        {uis}
        <div onClick={() => goBack(-1)}>{'返回'}</div>
      </div>
    );
  }
  render() {
    console.log('render', this.props);

    const { rawContent } = this.state;
    let { _pagedata, _updatePagedata } = this.props;
    let { count = 0 } = _pagedata || {};
    let add = () => _updatePagedata({ count: count + 1 });
    let minus = () => _updatePagedata({ count: count - 1 });

    return (
      <div className="bg-white">
        <div>
          <span>{'当前值:' + count}</span>
        </div>
        <div>
          <button className="btn" onClick={add}>
            +
          </button>
          <button className="btn" onClick={minus}>
            -
          </button>
        </div>
        {this.renderProductList()}
        {this.renderList()}
        <div>
          <button className="btn" onClick={add}>
            +
          </button>
          <button className="btn" onClick={minus}>
            -
          </button>
        </div>
        <div>
          <Link to="/test">主测</Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    me: meSelect(state, props)
  };
};

const mapActionsToProps = {
  loginCookie,
  goBack
};

export default connect(mapStateToProps, mapActionsToProps)(
  withModules({
    resource: {
      actions: require('modules/resource'),
      selectors: require('selectors/resource')
    },
    product: {
      actions: require('modules/product'),
      selectors: require('selectors/product')
    }
  })(withPagedata({ path: '/test/TestWithModules' })(Page))
);
