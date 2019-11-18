import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, goBack } from 'react-router-redux';
import isNull from 'lodash/isNull';
import isInteger from 'lodash/isInteger';

import withScrollDetect from 'components/hoc/withScrollDetect';
import { GoBackItem } from 'components/widgets/Menu';
import Gap, { VerticalGap } from 'components/widgets/Gap';
import ConfirmModal from 'components/widgets/ModalConfirm';
import OrderListItem from 'components/dianping/OrderListItem';

import { ORDER_STATUS_PAID } from 'modules/const';
import { keyRetrieveInfo, keyRetrieveItems } from 'modules/u_key';
import hasCaps from 'utils/caps';
import { meSelect } from 'selectors/user';
import {
  retrieve as retrieveOrders,
  create as createOrder,
  remove as removeOrder,
  update as updateOrder,
  get as getOrder
} from 'modules/order';
import { dbSelect, retrieveSelect } from 'selectors/order';
let xdebug = window.myDebug('app:mine:orderlist');

const getRedirectOrderUrl = id =>
  require('store').basename + '/app/order/' + id;

export class Page extends React.Component {
  constructor() {
    super();
    this._closeDlg = this._closeDlg.bind(this);
  }
  state = {
    //qs: '',
    //qstmp: '',
    query: { status: ORDER_STATUS_PAID },
    errMsg: null,
    dlg: {
      isOpen: false,
      content: null,
      errMsg: null,
      func: null
    }
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
    let { me, match } = this.props;
    let qsArr = [];
    let qs1 = match && match.params && match.params.qs;
    qs1 = qs1 && qs1.trim();
    if (qs1) {
      // has qs in props, search all.
      qsArr.push(qs1);
    } else {
      // has no qs in props, search by owner.
      let isRoot = hasCaps(me, 'root');
      if (!isRoot) {
        if (me && me.id) qsArr.push('owner=' + me.id);
      }
    }
    let query = this.state.query;
    if (query) {
      let { status } = query;
      if (isInteger(status)) {
        qsArr.push('status=' + status);
      }
    }
    /*let qs2 = this.state.qs;
    qs2 = qs2 && qs2.trim();
    if (qs2) {
      qsArr.push('tag=' + qs2);
    }*/
    return qsArr.join(';');
  }
  _doRetrieve(page = -1) {
    var { retrieveOrders } = this.props;
    retrieveOrders(this.getQs(), page)
      .then(ret => {
        console.log('list:', ret);
      })
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  }
  // query(qs) {
  //   this.setState({ qs });
  //   setTimeout(this._doRetrieve.bind(this), 0);
  // }
  updateQuery(query) {
    let oQuery = this.state.query || {};
    this.setState({ query: { ...oQuery, ...query } });
    setTimeout(this._doRetrieve.bind(this), 0);
  }
  nextPage() {
    var { dataOrderRetrieve: dataRetrieve } = this.props;
    let key = this.getQs();
    let { total, page, length } = keyRetrieveInfo(dataRetrieve, key);
    if (length >= total) {
      xdebug('already get all data!');
      return;
    }
    return this._doRetrieve(page + 1);
  }

  renderList() {
    let { me, db, dataOrderRetrieve } = this.props;
    let items = keyRetrieveItems(db, dataOrderRetrieve, this.getQs());
    if (!items) {
      return <div>没有数据</div>;
    }
    let uiItems = items.map((item, index) => {
      if (!item) return null;
      let ops = this.initOps(item, me);
      return <OrderListItem key={index} data={item} ops={ops} />;
    });
    return uiItems;
  }

  _closeDlg() {
    this.setState({
      dlg: { isOpen: false, content: null, errMsg: null, func: null }
    });
  }

  initOps(order, user) {
    if (!order || !order.id || !user || !user.id) {
      // if order == null or user == null, return null!
      //console.log ("error! parameter! order=", order, ", user=", user);
      return null;
    }
    let {
      me,
      push,
      retrieveOrders,
      removeOrder,
      updateOrder,
      getOrder,
      createOrder
    } = this.props;
    let id = order.id;
    let isRoot = hasCaps(user, 'root');
    let isOwner = user.id == order.owner;
    let status = order.status;

    let fnUpdateOrder = (id, args) => {
      updateOrder(id, args)
        .then(ret => getOrder(id))
        .then(ret =>
          this.setState({ dlg: { isOpen: false, content: null, func: null } })
        )
        .catch(error => {
          this.setState({
            dlg: { ...this.state.dlg, errMsg: error.message }
          });
          console.log('error!', error);
        });
    };
    let fnRemoveOrder = id => {
      removeOrder(id)
        .then(ret =>
          this.setState({ dlg: { isOpen: false, content: null, func: null } })
        )
        .catch(error => {
          this.setState({
            dlg: { ...this.state.dlg, errMsg: error.message }
          });
          console.log('error!', error);
        });
    };

    let opView = {
      name: '订单支付',
      func: evt => {
        evt.preventDefault();
        push('/app/order/' + id);
        //let orderUrl = getRedirectOrderUrl(id);
        //window.location.href = orderUrl;
      }
    };

    let opDelete = {
      name: '删除',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定要删除吗？',
            errMsg: null,
            func: () => fnRemoveOrder(id)
          }
        });
      }
    };

    let opComment = {
      name: '评价',
      func: evt => {
        evt.preventDefault();
        push('/app/order/' + id);
      }
    };

    if (isRoot) return [opView, opComment, opDelete];
    else return [opView];
  }

  render() {
    let { goBack } = this.props;
    let { query } = this.state;
    let { status } = query || {};
    let classPaid = 'btn btn-secondary';
    let classAll = 'btn btn-secondary';
    if (isInteger(status)) {
      if (status === ORDER_STATUS_PAID) {
        classPaid = 'btn btn-primary';
      }
    } else {
      classAll = 'btn btn-primary';
    }
    console.log('state:', this.state);

    return (
      <div>
        <GoBackItem onClick={goBack} title="订单列表" />
        <div>
          <button
            type="button"
            className={classPaid}
            onClick={() => this.updateQuery({ status: ORDER_STATUS_PAID })}
          >
            已支付
          </button>
          <button
            type="button"
            className={classAll}
            onClick={() => this.updateQuery({ status: null })}
          >
            所有订单
          </button>
        </div>
        {this.renderList()}
        <ConfirmModal
          isOpen={this.state.dlg.isOpen}
          title={this.state.dlg.title}
          content={this.state.dlg.content}
          errMsg={this.state.dlg.errMsg}
          onRequestClose={this._closeDlg}
          func={this.state.dlg.func}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    me: meSelect(state, props),
    db: dbSelect(state),
    dataOrderRetrieve: retrieveSelect(state)
  };
};

const mapActionsToProps = {
  push,
  goBack,
  retrieveOrders,
  createOrder,
  removeOrder,
  updateOrder,
  getOrder
};

export default connect(mapStateToProps, mapActionsToProps)(
  withScrollDetect(Page)
);
