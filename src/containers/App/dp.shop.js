import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';
import _ from 'lodash';

import withScrollDetect from 'components/hoc/withScrollDetect';
import Gap from 'components/widgets/Gap';
import { FiveStarSvg } from 'components/widgets/FiveStar';
import ProductListItem from 'components/dianping/ProductListItem';
import ShopCard from 'components/dianping/ShopCard';

import { keyRetrieveResult, keyRetrieveInfo } from 'modules/u_key';
import { PRODUCT_STATUS_PUBLISHED } from 'modules/const';
import { get as getShop, update as updateShop } from 'modules/shop';
import {
  dbSelect as dbShopSelect,
  updateSelect as updateShopSelect,
  getSelect as getShopSelect
} from 'selectors/shop';
import {
  retrieve as retrieveProducts,
  create as createProduct,
  remove as removeProduct,
  update as updateProduct,
  get as getProduct
} from 'modules/product';
import {
  dbSelect as dbProductSelect,
  retrieveSelect as retrieveProductSelect
} from 'selectors/product';
import { meSelect } from 'selectors/user';

//import cx from 'classnames';
//import './dp.shop.css';
let xdebug = window.myDebug('app:shop');

export class Page extends React.Component {
  state = {
    qs: '',
    qstmp: '',
    errMsg: null,
    errMsgProducts: null
  };
  constructor() {
    super();
  }

  componentDidMount() {
    let { match, dbShop, getShop } = this.props;
    let id = match.params && match.params.id;
    let item = dbShop && dbShop[id];
    if (!item) {
      getShop(id)
        .then(ret => {
          console.log('getShop:', ret);
        })
        .catch(error => {
          console.log('error:', error.message);
          this.setState({ errMsg: error.message });
        });
    }
    this._doRetrieve();
  }

  componentWillReceiveProps(nextProps) {
    let currInScrollArea = this.props.xInScrollArea;
    let nextInScrollArea = nextProps.xInScrollArea;
    if (currInScrollArea != nextInScrollArea) {
      if (nextInScrollArea) {
        this.nextPage();
      }
    }
  }
  getQs() {
    let qsArr = ['status=' + PRODUCT_STATUS_PUBLISHED];
    let shopId =
      this.props.match && this.props.match.params && this.props.match.params.id;
    let qs2 = this.state.qs;
    qs2 = qs2 && qs2.trim();
    if (shopId) {
      qsArr.push('shop=' + shopId);
    }
    if (qs2) {
      qsArr.push('tag=' + qs2);
    }
    return qsArr.join(';');
  }
  _doRetrieve(page = -1) {
    var { retrieveProducts } = this.props;
    retrieveProducts(this.getQs(), page)
      .then(ret => {
        console.log('list:', ret);
      })
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  }
  query(qs) {
    this.setState({ qs });
    setTimeout(this._doRetrieve.bind(this), 0);
  }
  nextPage() {
    var { dataShopRetrieve } = this.props;
    let key = this.getQs();
    let items = keyRetrieveResult(dataShopRetrieve, key);
    let info = keyRetrieveInfo(dataShopRetrieve, key);
    let total = (info && info.total) || 0;
    let page = (info && info.page && parseInt(info.page)) || 0;
    let count = (items && items.length) || 0;
    if (count >= total) {
      xdebug('already get all data!');
      return;
    }
    return this._doRetrieve(page + 1);
  }

  renderList() {
    let { dbProduct, dataProductRetrieve } = this.props;
    let items = keyRetrieveResult(dataProductRetrieve, this.getQs());
    if (!dbProduct || !items) {
      return <div>没有数据</div>;
    }

    let uiItems = items.map((itemId, index) => {
      let item = dbProduct[itemId];
      if (!item) return null;
      let link = '/app/product/' + itemId;
      return <ProductListItem key={index} data={{ ...item, link }} />;
    });

    return uiItems;
  }

  render() {
    let { match, dbShop } = this.props;
    let { errMsg } = this.state;
    console.log('props:', this.props, ', state:', this.state);
    let id = match.params && match.params.id;
    let shop = dbShop && dbShop[id];
    if (!shop) {
      if (errMsg) return <div>{errMsg}</div>;
      else return <div>加载中...</div>;
    }

    return (
      <div className="container-fluid" style={{ textAlign: 'left' }}>
        <div className="row">
          <div
            className="col-12"
            style={{ overflow: 'hidden', backgroundColor: '#fff' }}
          >
            <ShopCard data={shop} />
          </div>
          <div
            className="col-12"
            style={{ overflow: 'hidden', backgroundColor: '#fff' }}
          >
            {this.renderList()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  me: meSelect(state, props),
  dbShop: dbShopSelect(state),
  dataShopUpdate: updateShopSelect(state),
  dataShopGet: getShopSelect(state),
  dbProduct: dbProductSelect(state),
  dataProductRetrieve: retrieveProductSelect(state)
});
const mapActionsToProps = {
  push,
  updateShop,
  getShop,
  retrieveProducts,
  createProduct,
  removeProduct,
  updateProduct
};
export default connect(mapStateToProps, mapActionsToProps)(
  withScrollDetect(Page)
);
