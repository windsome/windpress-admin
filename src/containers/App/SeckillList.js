import React from 'react';
//import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, goBack } from 'react-router-redux';

import withScrollDetect from 'components/hoc/withScrollDetect';
import Gap, { VerticalGap } from 'components/widgets/Gap';
import ConfirmModal from 'components/widgets/ModalConfirm';
import ProductListItem from 'components/dianping/ProductListItem';
import SmartNav from './widgets/SmartNav';
import { TimelyCountDown } from 'components/widgets/Seckill';

import { keyRetrieveResult, keyRetrieveInfo } from 'modules/u_key';
import { PRODUCT_STATUS_PUBLISHED } from 'modules/const';
import { retrieve as retrieveProductSeckills } from 'modules/productSeckill';
import {
  dbSelect as dbProductSeckillSelect,
  retrieveSelect as retrieveProductSeckillSelect
} from 'selectors/productSeckill';
let xdebug = window.myDebug('app:productSeckillList');

export class Page extends React.Component {
  constructor() {
    super();
  }
  state = {
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
    let qsArr = ['status=' + PRODUCT_STATUS_PUBLISHED];
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
    var { retrieveProductSeckills } = this.props;
    retrieveProductSeckills(this.getQs(), page)
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
    var { dataProductSeckillRetrieve } = this.props;
    let key = this.getQs();
    let items = keyRetrieveResult(dataProductSeckillRetrieve, key);
    let info = keyRetrieveInfo(dataProductSeckillRetrieve, key);
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
    let { dbProductSeckill, dataProductSeckillRetrieve } = this.props;
    let items = keyRetrieveResult(dataProductSeckillRetrieve, this.getQs());
    if (!dbProductSeckill || !items) {
      return <div>没有数据</div>;
    }

    let uiItems = items.map((itemId, index) => {
      let item = dbProductSeckill[itemId];
      if (!item) return null;
      let link = '/app/product/' + itemId;
      return <ProductListItem key={index} data={{ ...item, link }} />;
    });

    return uiItems;
  }

  render() {
    let { selection } = this.state;
    return (
      <div>
        <div className="px-1 bg-white">
          <span className="pr-1">秒杀</span>
          <TimelyCountDown />
        </div>
        {/*<SmartNav
          selection={selection}
          onChangeSelection={selection => {
            this.setState({ selection });
          }}
        />*/}
        <div className="bg-white">{this.renderList()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    dbProductSeckill: dbProductSeckillSelect(state),
    dataProductSeckillRetrieve: retrieveProductSeckillSelect(state)
  };
};

const mapActionsToProps = {
  push,
  goBack,
  retrieveProductSeckills
};

export default connect(mapStateToProps, mapActionsToProps)(
  withScrollDetect(Page)
);
