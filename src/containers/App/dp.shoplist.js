import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';
import isNull from 'lodash/isNull';

import withScrollDetect from 'components/hoc/withScrollDetect';
import Gap from 'components/widgets/Gap';
import {
  ShopListItem,
  ShopList,
  exchangeShopInfo
} from 'components/dianping/ShopListItem';
import SmartNav from './widgets/SmartNav';

import { keyRetrieveResult, keyRetrieveInfo } from 'modules/u_key';
import { meSelect } from 'selectors/user';
import { positionSelect } from 'selectors/position';
import { retrieve as retrieveShops } from 'modules/shop';
import {
  dbSelect as dbShopSelect,
  retrieveSelect as dataShopRetrieveSelect
} from 'selectors/shop';
import { category as fetchCategory } from 'modules/setting';
import {
  categoryDataSelect,
  categoryDataEducationSelect
} from 'selectors/setting';
let xdebug = window.myDebug('app:shoplist');

export class Page extends React.Component {
  constructor() {
    super();
    //this.removeShop = this.removeShop.bind(this);
    //this._closeDlg = this._closeDlg.bind(this);
    this.getQs = this.getQs.bind(this);
  }
  state = {
    currentCategory: null,
    qs: '',
    qstmp: '',
    selection: null,
    errMsg: null
  };
  componentDidMount() {
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
    let qsArr = ['status=2'];
    let qs1 =
      this.props.match && this.props.match.params && this.props.match.params.qs;
    qs1 = qs1 && qs1.trim();
    let qs2 = this.state.qs;
    qs2 = qs2 && qs2.trim();
    if (qs1) {
      qsArr.push(qs1);
    }
    if (qs2) {
      qsArr.push('tag=' + qs2);
    }
    return qsArr.join(';');
  }
  _doRetrieve(page = -1) {
    var { retrieveShops } = this.props;
    retrieveShops(this.getQs(), page)
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
    let { position, dbShop, dataShopRetrieve } = this.props;
    let items = keyRetrieveResult(dataShopRetrieve, this.getQs());
    if (!dbShop || !items) {
      return <div>没有数据</div>;
    }

    //console.log('renderList:', position);
    let uiItems = items.map((itemId, index) => {
      let item = dbShop[itemId];
      if (!item) return null;
      let shopInfo = exchangeShopInfo(item, position);
      return <ShopListItem key={index} data={shopInfo} />;
    });

    return uiItems;
  }

  render() {
    let { selection } = this.state;
    return (
      <div>
        <SmartNav
          selection={selection}
          onChangeSelection={selection => {
            this.setState({ selection });
          }}
        />
        <div>{this.renderList()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  me: meSelect(state, props),
  position: positionSelect(state, props),
  dbShop: dbShopSelect(state),
  dataShopRetrieve: dataShopRetrieveSelect(state)
});
const mapActionsToProps = {
  push,
  retrieveShops,
  fetchCategory
};
export default connect(mapStateToProps, mapActionsToProps)(
  withScrollDetect(Page)
);
