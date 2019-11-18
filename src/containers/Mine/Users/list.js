import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, goBack } from 'react-router-redux';

import withScrollDetect from 'components/hoc/withScrollDetect';
import Gap, { VerticalGap } from 'components/widgets/Gap';
import FlagArrow from 'components/dianping/FlagArrow';
import ConfirmModal from 'components/widgets/ModalConfirm';
import { MenuItem, GoBackItem } from 'components/widgets/Menu';
import UserListItem from 'components/dianping/UserListItem';
import SearchBar from 'components/widgets/SearchBar';

import { keyRetrieveResult, keyRetrieveInfo } from 'modules/u_key';
import {
  retrieve as retrieveUsers,
  remove as removeUser,
  update as updateUser,
  get as getUser
} from 'modules/user';
import { meSelect, dbSelect, retrieveSelect } from 'selectors/user';
import { addCap, delCap, hasCaps } from 'utils/caps';
import {
  USER_STATUS_NORMAL,
  USER_STATUS_CHECKING,
  USER_STATUS_CLOSED
} from 'modules/const';
import './list.css';

let xdebug = window.myDebug('app:Users:list');

export class Page extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this._closeDlg = this._closeDlg.bind(this);
  }

  state = {
    currentUserId: 0,
    qstmp: '',
    qs: '',
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
    let qsArr = [];
    let qs1 =
      this.props.match && this.props.match.params && this.props.match.params.qs;
    qs1 = qs1 && qs1.trim();
    let qs2 = this.state.qs;
    qs2 = qs2 && qs2.trim();
    if (qs1) {
      qsArr.push(qs1);
    }
    if (qs2) {
      qsArr.push('fuzzy[desc]=' + qs2);
      qsArr.push('fuzzy[extend]=' + qs2);
      qsArr.push('fuzzy[account]=' + qs2);
    }
    return qsArr.join(';');
  }
  _doRetrieve(page = -1) {
    var { retrieveUsers } = this.props;
    retrieveUsers(this.getQs(), page)
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
    var { dataUserRetrieve } = this.props;
    let key = this.getQs();
    let items = keyRetrieveResult(dataUserRetrieve, key);
    let info = keyRetrieveInfo(dataUserRetrieve, key);
    let total = (info && info.total) || 0;
    let page = (info && info.page && parseInt(info.page)) || 0;
    let count = (items && items.length) || 0;
    if (count >= total) {
      xdebug('already get all data!');
      return;
    }
    return this._doRetrieve(page + 1);
  }

  _closeDlg() {
    this.setState({
      dlg: { isOpen: false, content: null, errMsg: null, func: null }
    });
  }

  renderList() {
    const { currentUserId } = this.state;

    let { me, dbUser, dataUserRetrieve } = this.props;
    let items = keyRetrieveResult(dataUserRetrieve, this.getQs());
    if (!dbUser || !items) {
      return <div>没有用户</div>;
    }
    let isRoot = hasCaps(me, 'root');

    const toggleCurrent = id => {
      if (this.state.currentUserId == id) {
        this.setState({ currentUserId: 0 });
      } else {
        this.setState({ currentUserId: id });
      }
    };
    let uiUsers = items.map((itemId, index) => {
      let item = dbUser[itemId];
      if (!item) return null;
      //console.log('item:', item);

      let ops = null;
      if (currentUserId == itemId && isRoot) {
        ops = this.initOps(item);
      }
      let link = '/mine/users/' + itemId;
      let data = { ...item, link };
      return (
        <UserListItem
          key={index}
          data={data}
          ops={ops}
          toggleCurrent={() => toggleCurrent(itemId)}
        />
      );
    });

    return uiUsers;
  }

  render() {
    let { goBack } = this.props;
    return (
      <div>
        <GoBackItem onClick={goBack} title="用户列表" />
        <Gap width={5} />
        <SearchBar
          placeholder="输入搜索条件，如手机号，姓名等"
          value={this.state.qstmp}
          onChange={evt => this.setState({ qstmp: evt.target.value })}
          onSubmit={() => {
            this.query(this.state.qstmp);
          }}
        />
        <Gap width={5} />
        <div>{this.renderList()}</div>
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

  initOps(user) {
    if (!user) {
      return null;
    }

    let { dbUser, push, removeUser, updateUser, getUser } = this.props;
    let id = user.id;
    let status = user.status;

    let capRoot = hasCaps(user, 'root');
    let capShop = hasCaps(user, 'shop');
    let capTeacher = hasCaps(user, 'teacher');
    let capDebug = hasCaps(user, 'debug');

    let fnUpdateUser = (id, args) => {
      updateUser(id, args)
        .then(ret => getUser(id))
        .then(ret =>
          this.setState({
            dlg: { isOpen: false, content: null, errMsg: null, func: null }
          })
        )
        .catch(error => {
          this.setState({
            dlg: { ...this.state.dlg, errMsg: error.message }
          });
          console.log('error!', error);
        });
    };
    let fnRemoveUser = id => {
      removeUser(id)
        .then(ret =>
          this.setState({
            dlg: { isOpen: false, content: null, errMsg: null, func: null }
          })
        )
        .catch(error => {
          this.setState({
            dlg: { ...this.state.dlg, errMsg: error.message }
          });
          console.log('error!', error);
        });
    };

    let addOneCap = (id, cap) => {
      let user = dbUser && dbUser[id];
      let caps = addCap(user, cap);
      if (!caps) return;
      return fnUpdateUser(id, { caps });
    };
    let delOneCap = (id, cap) => {
      let user = dbUser && dbUser[id];
      let caps = delCap(user, cap);
      if (!caps) return;
      return fnUpdateUser(id, { caps });
    };
    let setStatus = (id, status) => {
      let user = dbUser && dbUser[id];
      return fnUpdateUser(id, { status });
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
            func: () => fnRemoveUser(id)
          }
        });
      }
    };
    let opOpenUser = {
      name: '开通用户',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定开通用户吗？',
            errMsg: null,
            func: () => setStatus(id, USER_STATUS_NORMAL)
          }
        });
      }
    };
    let opCloseUser = {
      name: '关闭用户',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定关闭用户吗？',
            errMsg: null,
            func: () => setStatus(id, USER_STATUS_CLOSED)
          }
        });
      }
    };
    let opCapRoot = {
      name: '设为管理员',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定设为管理员吗？',
            errMsg: null,
            func: () => addOneCap(id, 'ROOT')
          }
        });
      }
    };
    let opUncapRoot = {
      name: '取消管理员',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定取消管理员吗？',
            errMsg: null,
            func: () => delOneCap(id, 'ROOT')
          }
        });
      }
    };
    let opCapShop = {
      name: '赋予商家权限',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定赋予商家权限吗？',
            errMsg: null,
            func: () => addOneCap(id, 'SHOP')
          }
        });
      }
    };
    let opUncapShop = {
      name: '取消商家权限',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定取消商家权限吗？',
            errMsg: null,
            func: () => delOneCap(id, 'SHOP')
          }
        });
      }
    };
    let opCapTeacher = {
      name: '赋予教师资格',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定赋予教师资格吗？',
            errMsg: null,
            func: () => addOneCap(id, 'TEACHER')
          }
        });
      }
    };
    let opUncapTeacher = {
      name: '取消教师资格',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定取消教师资格吗？',
            errMsg: null,
            func: () => delOneCap(id, 'TEACHER')
          }
        });
      }
    };
    let opCapDebug = {
      name: '赋予调试资格',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定赋予调试资格吗？',
            errMsg: null,
            func: () => addOneCap(id, 'DEBUG')
          }
        });
      }
    };
    let opUncapDebug = {
      name: '取消调试资格',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定取消调试资格吗？',
            errMsg: null,
            func: () => delOneCap(id, 'DEBUG')
          }
        });
      }
    };
    let ops = [];
    switch (status) {
      case USER_STATUS_NORMAL:
        ops = [...ops, opCloseUser];
        break;
      default:
        ops = [...ops, opOpenUser];
        break;
    }
    if (capRoot) ops = [...ops, opUncapRoot];
    else ops = [...ops, opCapRoot];
    if (capShop) ops = [...ops, opUncapShop];
    else ops = [...ops, opCapShop];
    if (capTeacher) ops = [...ops, opUncapTeacher];
    else ops = [...ops, opCapTeacher];
    if (capDebug) ops = [...ops, opUncapDebug];
    else ops = [...ops, opCapDebug];
    return ops;
  }
}

const mapStateToProps = (state, props) => {
  return {
    me: meSelect(state, props),
    dbUser: dbSelect(state),
    dataUserRetrieve: retrieveSelect(state)
  };
};
const mapActionsToProps = {
  push,
  goBack,
  retrieveUsers,
  removeUser,
  updateUser,
  getUser
};

export default connect(mapStateToProps, mapActionsToProps)(
  withScrollDetect(Page)
);
