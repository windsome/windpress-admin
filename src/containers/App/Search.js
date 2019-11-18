import React from 'react';
//import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';

import SearchBar from 'components/widgets/SearchBar';
import Gap, { VerticalGap } from 'components/widgets/Gap';

let xdebug = window.myDebug('app:search');

export class Page extends React.Component {
  constructor() {
    super();
  }
  state = {
    qs: '',
    errMsg: null
  };

  render() {
    let { replace } = this.props;
    let { qs } = this.state;
    const gotoShopList = () => {
      let url = '/app/shoplist/fuzzy=' + qs;
      console.log('url:', url, replace);
      replace && replace(url);
    };
    const gotoProductList = () => {
      let url = '/app/productlist/fuzzy=' + qs;
      replace && replace(url);
    };
    return (
      <div>
        <SearchBar
          placeholder="搜索:商户,课程,商品"
          value={qs}
          onChange={evt => this.setState({ qs: evt.target.value })}
        />
        <Gap width={5} />
        <div
          className="px-2 py-1 align-items-center media bg-white"
          onClick={gotoShopList}
        >
          <div
            className="p-2 fa fa-address-book-o"
            style={{ color: '#fff', backgroundColor: '#ffd076' }}
          />
          <div className="pl-2 media-body small">
            <div>搜索店家</div>
            <div className="small">关键字搜索门店、商家</div>
          </div>
        </div>
        <Gap width={1} />
        <div
          className="px-2 py-1 align-items-center media bg-white"
          onClick={gotoProductList}
        >
          <div
            className="p-2 fa fa-shopping-cart"
            style={{ color: '#fff', backgroundColor: '#ffd076' }}
          />
          <div className="pl-2 media-body small">
            <div>搜索商品</div>
            <div className="small">关键字搜索商品、精品课程、试听课、活动</div>
          </div>
        </div>
        <Gap width={1} />
      </div>
    );
  }
}

const mapActionsToProps = {
  push,
  goBack,
  replace
};

export default connect(null, mapActionsToProps)(Page);
