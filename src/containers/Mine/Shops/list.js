import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';

import withScrollDetect from 'components/hoc/withScrollDetect';
import hasCaps from 'utils/caps';
import Gap, { VerticalGap } from 'components/widgets/Gap';
import { MenuItem, GoBackItem } from 'components/widgets/Menu';
import ConfirmModal from 'components/widgets/ModalConfirm';
import ModalAd from './ModalAd';
import {
  ShopListItem,
  exchangeShopInfo
} from 'components/dianping/ShopListItem';

//import { keyRetrieveItems, keyRetrieveInfo } from 'modules/u_key';
import {
  SHOP_STATUS_DRAFT,
  SHOP_STATUS_CHECKING,
  SHOP_STATUS_PUBLISHED,
  SHOP_STATUS_CHECKFAIL,
  SHOP_STATUS_CLOSED
} from 'modules/const';
import { meSelect } from 'selectors/user';
import {
  retrieve as retrieveShops,
  remove as removeShop,
  update as updateShop,
  get as getShop
} from 'modules/shop';
import { keyRetrieveItems, keyRetrieveInfo } from 'modules/u_key';
import { dbSelect, retrieveSelect } from 'selectors/shop';
let xdebug = window.myDebug('app:mine:shoplist');

export class Page extends React.Component {
  constructor() {
    super();
    this.initOps = this.initOps.bind(this);
  }
  state = {
    qs: '',
    qstmp: '',
    errMsg: null,
    dlg: {
      isOpen: false,
      content: null,
      errMsg: null,
      func: null
    },
    dlgAd: {
      isOpen: false,
      data: [],
      func: null
    },
    dlgUserQuery: {
      isOpen: false,
      data: [],
      func: null,
      queryFunc: null
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
    let { me } = this.props;
    let isRoot = hasCaps(me, 'root');
    let qsArr = [];
    let qs1 =
      this.props.match && this.props.match.params && this.props.match.params.qs;
    qs1 = qs1 && qs1.trim();
    let qs2 = this.state.qs;
    qs2 = qs2 && qs2.trim();
    if (!isRoot) {
      if (me && me.id) qsArr.push('owner=' + me.id);
    }
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
        //console.log('list:', ret);
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
    var { dataShopRetrieve: dataRetrieve } = this.props;
    let key = this.getQs();
    let { total, page, length } = keyRetrieveInfo(dataRetrieve, key);
    if (length >= total) {
      xdebug('already get all data!');
      return;
    }
    return this._doRetrieve(page + 1);
  }

  renderList() {
    let { me, dbShop, dataShopRetrieve } = this.props;
    let items = keyRetrieveItems(dbShop, dataShopRetrieve, this.getQs());
    if (!items) {
      return <div>没有数据</div>;
    }

    let uiItems = items.map((item, index) => {
      if (!item) return null;
      let shopInfo = exchangeShopInfo(item);
      let ops = this.initOps(item, me);
      return <ShopListItem key={index} data={shopInfo} ops={ops} />;
    });

    return uiItems;
  }

  initOps(shop, user) {
    if (!shop || !shop.id || !user || !user.id) {
      // if shop == null or user == null, return null!
      //console.log ("error! parameter! shop=", shop, ", user=", user);
      return null;
    }
    let { push, removeShop, updateShop, getShop } = this.props;
    let id = shop.id;
    let isRoot = hasCaps(user, 'root');
    let isOwner = user.id == shop.owner;
    let status = shop.status;

    let fnUpdateShop = (id, args) => {
      updateShop(id, args)
        .then(ret => getShop(id))
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
    let fnUpdateShopAd = (id, args) => {
      updateShop(id, args)
        .then(ret => getShop(id))
        .then(ret => this.setState({ dlgAd: { isOpen: false, func: null } }))
        .catch(error => {
          this.setState({
            dlgAd: { ...this.state.dlgAd, errMsg: error.message }
          });
          console.log('error!', error);
        });
    };
    let fnRemoveShop = id => {
      removeShop(id)
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

    // let fnUpdateShopManager = (id, args) => {
    //   updateShop(id, args)
    //     .then(ret => getShop(id))
    //     .then(ret => this.setState({ dlgUserQuery: { isOpen: false, func: null } }))
    //     .catch(error => {
    //       this.setState({
    //         dlgUserQuery: { ...this.state.dlgUserQuery, errMsg: error.message }
    //       });
    //       console.log('error!', error);
    //     });
    // };

    let opEdit = {
      name: '编辑',
      func: evt => {
        evt.preventDefault();
        push('/mine/shops/edit/' + id);
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
            func: () => fnRemoveShop(id)
          }
        });
      }
    };
    let opRequestCheck = {
      name: '提交审核',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定提交审核吗？',
            errMsg: null,
            func: () => fnUpdateShop(id, { status: 1 })
          }
        });
      }
    };
    let opCheckFail = {
      name: '审核不通过',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定审核不通过吗？',
            errMsg: null,
            func: () => fnUpdateShop(id, { status: 3 })
          }
        });
      }
    };
    let opCheckOk = {
      name: '通过审核',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确认通过审核吗？',
            errMsg: null,
            func: () => fnUpdateShop(id, { status: 2 })
          }
        });
      }
    };
    let opSetAd = {
      name: '设置广告',
      func: evt => {
        let promote = shop.extend && shop.extend.promote;
        evt.preventDefault();
        this.setState({
          dlgAd: {
            isOpen: true,
            data: promote,
            func: data => {
              let extend = shop.extend || {};
              fnUpdateShopAd(id, { extend: { ...extend, promote: data } });
            }
          }
        });
      }
    };
    let opSetManager = {
      name: '设置管理员',
      func: evt => {
        evt.preventDefault();
        push('/mine/shops/editManager/' + id);
      }
    };
    /*let opRecommend = {
      name: '推荐',
      func: (evt) => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确认推荐吗？',
            errMsg: null,
            func: () => fnUpdateShop(id, {status:2})
          }
        });
      }
    };
    let opUnrecommend = {
      name: '取消推荐',
      func: (evt) => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确认取消推荐吗？',
            errMsg: null,
            func: () => fnUpdateShop(id, {status:2})
          }
        });
      }
    };*/
    let opClose = {
      name: '关闭',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确认关闭门店吗？',
            errMsg: null,
            func: () => fnUpdateShop(id, { status: 4 })
          }
        });
      }
    };
    let opOpen = {
      name: '开启',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确认开启门店吗？',
            errMsg: null,
            func: () => fnUpdateShop(id, { status: 2 })
          }
        });
      }
    };

    // [
    //   opEdit,
    //   opDelete,
    //   opRequestCheck,
    //   opCheckFail,
    //   opCheckOk,
    //   opRecommend,
    //   opUnrecommend,
    //   opClose,
    //   opOpen
    // ];
    let ops = [];
    if (isRoot) {
      switch (shop.status) {
        case 0:
          ops = [opEdit, opDelete, opCheckFail, opCheckOk];
          break;
        case 1:
          ops = [opCheckFail, opCheckOk];
          break;
        case 2:
          ops = [opEdit, opClose];
          break;
        case 3:
          ops = [opEdit, opDelete, opClose];
          break;
        case 4:
          ops = [opOpen];
          break;
        case 5:
          ops = [opEdit, opDelete, opCheckFail, opCheckOk];
          break;
        default:
          break;
      }
      ops = [...ops, opSetManager];
    } else if (isOwner) {
      switch (shop.status) {
        case 0:
          ops = [opEdit, opDelete, opRequestCheck];
          break;
        case 1:
          ops = [opDelete];
          break;
        case 2:
          ops = [opEdit, opDelete, opClose];
          break;
        case 3:
          ops = [opEdit, opDelete, opRequestCheck, opClose];
          break;
        case 4:
          ops = [opEdit, opDelete, opRequestCheck, opOpen];
          break;
        case 5:
          ops = [opEdit, opDelete, opRequestCheck];
          break;
        default:
          break;
      }
      ops = [...ops, opSetManager];
    }
    return [...ops, opSetAd];
  }

  render() {
    let { match, goBack } = this.props;
    //console.log('render:', this.props);

    return (
      <div>
        <GoBackItem onClick={goBack} title="门店列表" />
        <MenuItem
          icon="fa fa-file-text-o"
          title="添加新店"
          subtitle="新的门店"
          arrow={true}
          link={`${match.url}/create`}
        />
        <Gap width={10} />
        {this.renderList()}
        <ConfirmModal
          isOpen={this.state.dlg.isOpen}
          title={this.state.dlg.title}
          content={this.state.dlg.content}
          errMsg={this.state.dlg.errMsg}
          onRequestClose={() =>
            this.setState({
              dlg: { isOpen: false, content: null, func: null }
            })
          }
          func={this.state.dlg.func}
        />
        <ModalAd
          isOpen={this.state.dlgAd.isOpen}
          data={this.state.dlgAd.data}
          onRequestClose={() =>
            this.setState({
              dlgAd: { isOpen: false, func: null }
            })
          }
          func={this.state.dlgAd.func}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    me: meSelect(state, props),
    dbShop: dbSelect(state),
    dataShopRetrieve: retrieveSelect(state)
  };
};

const mapActionsToProps = {
  push,
  goBack,
  retrieveShops,
  removeShop,
  updateShop,
  getShop
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
