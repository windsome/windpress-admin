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

import { keyRetrieveResult, keyRetrieveInfo } from 'modules/u_key';
import hasCaps from 'utils/caps';
import { meSelect } from 'selectors/user';
import { get as getUser } from 'modules/user';
import { dbSelect as dbUserSelect } from 'selectors/user';
import {
  retrieve as retrieveBonusUsers,
  create as createBonusUser,
  remove as removeBonusUser,
  update as updateBonusUser,
  get as getBonusUser
} from 'modules/bonusUser';
import {
  dbSelect as dbBonusUserSelect,
  retrieveSelect as dataBonusUserRetrieveSelect
} from 'selectors/bonusUser';

let xdebug = window.myDebug('app:mine:bonusUserList');

const BonusUser = ({ data }) => {
  let { id, account, desc, extend, bonus, ratio, isBonusUser } = data;
  let userHeadimgurl =
    (data && data.extend && data.extend.headimgurl) ||
    '/ysj/images/avatar-1.png';
  bonus = (bonus && parseInt(bonus)) || 0;
  let link = '/app/bonus/invite/' + id;
  return (
    <div className="bg-white mt-1 p-2">
      <div>
        <img style={{ width: 64, height: 64 }} src={userHeadimgurl} />
      </div>
      <div>
        <div>{'帐号：' + account}</div>
      </div>
      {isBonusUser && (
        <div>
          <div className="px-1">{'分成比例：' + ratio}</div>
          <div className="px-1">{'积分：' + bonus}</div>
          <Link to={link}>
            <div>邀请朋友进入分利系统</div>
          </Link>
        </div>
      )}
      {!isBonusUser && <div>不是分利系统用户！</div>}
    </div>
  );
};

const BonusUserListItem = ({ data, ops }) => {
  let { account, desc, extend, bonus, ratio } = data;
  let userHeadimgurl =
    (data && data.extend && data.extend.headimgurl) ||
    '/ysj/images/avatar-1.png';
  bonus = (bonus && parseInt(bonus)) || 0;
  return (
    <div className="media align-items-center bg-white mt-1 p-2">
      <div>
        <img style={{ width: 32, height: 32 }} src={userHeadimgurl} />
      </div>
      <div className="media-body">
        <span>{account}</span>
        <span className="px-1">{'分成比例：' + ratio}</span>
        <span className="px-1">{'积分：' + bonus}</span>
      </div>
    </div>
  );
};

export class Page extends React.Component {
  constructor() {
    super();
    this._closeDlg = this._closeDlg.bind(this);
  }
  state = {
    errMsg: null,
    dlg: {
      isOpen: false,
      content: null,
      errMsg: null,
      func: null
    }
  };
  componentDidMount() {
    this.initFetchData(this.props);
    //this._doRetrieve();
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
  async initFetchData(props) {
    let { match, me, dbUser, getUser, dbBonusUser, getBonusUser } = props;
    let id = this.getId();
    if (id) {
      let user = dbUser && dbUser[id];
      if (!user) {
        try {
          user = await getUser(id);
        } catch (error) {
          xdebug('error! initFetchData: ', error);
        }
      }
      let bonusUser = dbBonusUser && dbBonusUser[id];
      if (!bonusUser) {
        try {
          bonusUser = await getBonusUser(id);
        } catch (error) {
          xdebug('error! initFetchData: ', error);
        }
      }
    }
    await this._doRetrieve();
  }
  getId() {
    let { me, match } = this.props;
    let isRoot = hasCaps(me, 'root');
    let meId = me && me.id;
    let queryId = match && match.params && match.params.id;
    let id = queryId || meId;
    if (id) {
      if (id != meId && !isRoot) {
        id = meId;
      }
    }
    return id;
  }
  getQs() {
    let qsArr = [];
    let id = this.getId();
    if (id) {
      qsArr.push('owner=' + id);
    }
    return qsArr.join(';');
  }
  _doRetrieve(page = -1) {
    let { retrieveBonusUsers } = this.props;
    return retrieveBonusUsers(this.getQs(), page)
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
    var { dataBonusUserRetrieve: dataRetrieve } = this.props;
    let key = this.getQs();
    let items = keyRetrieveResult(dataRetrieve, key);
    let info = keyRetrieveInfo(dataRetrieve, key);
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
    let { me, dbBonusUser, dataBonusUserRetrieve } = this.props;
    let items = keyRetrieveResult(dataBonusUserRetrieve, this.getQs());
    if (!dbBonusUser || !items) {
      return <div>没有数据</div>;
    }

    let uiItems = items.map((itemId, index) => {
      let item = dbBonusUser[itemId];
      if (!item) return null;

      //let ops = this.initOps(item, me);
      return <BonusUserListItem key={index} data={item} ops={null} />;
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
    let { goBack, dbUser, dbBonusUser } = this.props;
    let id = this.getId();
    let user = dbUser && id && dbUser[id];
    let bonusUser = dbBonusUser && id && dbBonusUser[id];
    let bonusUserData = {
      ...(user || {}),
      ...(bonusUser || {}),
      isBonusUser: !!bonusUser
    };
    console.log('bonus:list:render:', id, user, bonusUser, bonusUserData);
    return (
      <div>
        <GoBackItem onClick={goBack} title="分利系统" />
        <div>
          <BonusUser data={bonusUserData} />
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
    dbUser: dbUserSelect(state),
    dbBonusUser: dbBonusUserSelect(state),
    dataBonusUserRetrieve: dataBonusUserRetrieveSelect(state)
  };
};

const mapActionsToProps = {
  push,
  goBack,
  getUser,
  retrieveBonusUsers,
  createBonusUser,
  removeBonusUser,
  updateBonusUser,
  getBonusUser
};

export default connect(mapStateToProps, mapActionsToProps)(
  withScrollDetect(Page)
);
