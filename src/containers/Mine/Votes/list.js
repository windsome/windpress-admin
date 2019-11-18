import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, goBack } from 'react-router-redux';
import Moment from 'moment';
import isNull from 'lodash/isNull';

import Gap, { VerticalGap } from 'components/widgets/Gap';
import { MenuItem, GoBackItem } from 'components/widgets/Menu';
import ConfirmModal from 'components/widgets/ModalConfirm';

import {
  VOTE_STATUS_DRAFT,
  VOTE_STATUS_CHECKING,
  VOTE_STATUS_PUBLISHED,
  VOTE_STATUS_CHECKFAIL,
  VOTE_STATUS_CLOSED
} from 'modules/const';
import hasCaps from 'utils/caps';
import {
  retrieve as retrieveVotes,
  create as createVote,
  remove as removeVote,
  update as updateVote,
  get as getVote
} from 'modules/vote';
import {
  dbSelect as dbVoteSelect,
  getSelect as dataVoteGetSelect,
  retrieveSelect as dataVoteRetrieveSelect
} from 'selectors/vote';
import { meSelect } from 'selectors/user';
import _key from 'modules/u_key';
import { sleep } from 'utils/sleep';

import './list.css';

const xdebug = window.myDebug('app:vote:list');

const Ops = ({ ops }) => {
  if (!ops) return null;
  let uiOps = ops.map((op, index) => {
    if (!op) return null;
    return (
      <div
        key={index}
        className="d-inline-block mr-1 btn border border-warning"
        onClick={evt => op.func(evt, op)}
      >
        {op.name}
      </div>
    );
  });
  return <div>{uiOps}</div>;
};
export const ListItem = ({ item, ops }) => {
  let {
    id,
    name,
    status,
    owner,
    desc,
    startAt,
    endAt,
    reserved1,
    reserved2,
    link = '/',
    defaultPic
  } =
    item || {};

  let startAtStr =
    startAt && Moment.parseZone(startAt).format('YYYY-MM-DD HH:mm');
  let endAtStr = endAt && Moment.parseZone(endAt).format('YYYY-MM-DD HH:mm');

  return (
    <div className="bg-white p-1" style={{ marginBottom: 2 }}>
      <div className="media">
        <Link to={link}>
          <div className="leftpic">
            <img className="thumb" src={defaultPic} />
          </div>
        </Link>
        <div className="media-body" style={{ overflow: 'hidden' }}>
          <Link to={link}>
            <div className="py-1 text-truncate">
              <span>{name}</span>
            </div>
            <div className="py-1 text-truncate">
              <span>
                {'编号:' +
                  id +
                  ' / 候选数:' +
                  reserved2 +
                  ' / 总票数:' +
                  reserved1}
              </span>
            </div>
          </Link>
          <div className="py-1 text-truncate small">
            <span>{startAtStr + ' 至 ' + endAtStr}</span>
          </div>
          {/*<div className="py-1">
              <span>{link}</span>
            </div>*/}
        </div>
      </div>
      <div className="mt-2">
        <Ops ops={ops} />
      </div>
    </div>
  );
};

export class Page extends React.Component {
  constructor() {
    super();
    this._closeDlg = this._closeDlg.bind(this);
    this._updateVote = this._updateVote.bind(this);
    this._removeVote = this._removeVote.bind(this);
    this._cloneVote = this._cloneVote.bind(this);
    this._createVote = this._createVote.bind(this);
  }
  state = {
    qs: null,
    dlg: {
      isOpen: false,
      content: null,
      errMsg: null,
      func: null
    }
  };
  componentDidMount() {
    let { retrieveVotes } = this.props;
    let qs = this.getQString();
    if (!isNull(qs)) retrieveVotes(qs);
  }
  getQString() {
    let qstr = null;
    let { me } = this.props;
    let { qs } = this.state;
    let meId = me && me.id;
    let isRoot = hasCaps(me, 'root');

    qstr = 'order[0][0]=id;order[0][1]=DESC';
    if (meId) {
      if (!isRoot) {
        qstr = ';owner=' + meId;
      }
      if (qs) {
        qstr = ';fuzzy[desc]=' + qs + ';fuzzy[name]=' + qs;
      }
    }
    return qstr;
  }

  _closeDlg() {
    this.setState({ dlg: { isOpen: false, content: null, func: null } });
  }
  _updateVote(id, args) {
    let { updateVote, getVote } = this.props;
    updateVote(id, args)
      .then(ret => getVote(id))
      .then(ret =>
        this.setState({ dlg: { isOpen: false, content: null, func: null } })
      )
      .catch(error => {
        this.setState({
          dlg: { ...this.state.dlg, errMsg: error.message }
        });
        xdebug('error!', error);
      });
  }
  _removeVote(id) {
    let { removeVote } = this.props;
    removeVote(id)
      .then(ret =>
        this.setState({ dlg: { isOpen: false, content: null, func: null } })
      )
      .catch(error => {
        this.setState({
          dlg: { ...this.state.dlg, errMsg: error.message }
        });
        xdebug('error!', error);
      });
  }
  _cloneVote(item) {
    if (!item) {
      return null;
    }
    let { id, status, ...info } = item || {};
    let { createVote, retrieveVotes } = this.props;

    createVote(info)
      .then(ret => {
        xdebug('clone 1');
        let message = '已克隆成功！id=' + ret.id + ', 2秒后刷新！';
        this.setState({
          dlg: { isOpen: true, content: message, func: null }
        });
        return ret;
      })
      .then(() => {
        let qs = this.getQString();
        if (!isNull(qs)) return retrieveVotes(qs);
        else return null;
        this.setState({ dlg: { func: this._closeDlg } });
      })
      .then(() => {
        return sleep(2000);
      })
      .then(() => {
        this.setState({ dlg: { isOpen: false, content: null, func: null } });
      })
      .catch(error => {
        this.setState({
          dlg: { ...this.state.dlg, errMsg: error.message }
        });
        xdebug('error!', error);
      });
  }
  _createVote(item) {
    if (!item) {
      return null;
    }
    let { id, status, ...info } = item || {};
    let { push, createVote } = this.props;

    createVote(info)
      .then(ret => {
        let message = '已创建成功！id=' + ret.id + ', 2秒后刷新！';
        this.setState({
          dlg: { isOpen: true, content: message, func: null }
        });
        return ret;
      })
      .then(ret => {
        push('/mine/votes/' + ret.id + '/edit');
      })
      .catch(error => {
        this.setState({
          dlg: { ...this.state.dlg, errMsg: error.message }
        });
        xdebug('error!', error);
      });
  }

  initOps(vote, user) {
    if (!vote || !vote.id || !user || !user.id) {
      xdebug('error! parameter error!', vote, user);
      return null;
    }
    let { me, push } = this.props;

    let id = vote.id;
    let isRoot = hasCaps(user, 'root');
    let isOwner = user.id == vote.owner;
    let status = vote.status;

    let fnUpdateVote = this._updateVote;
    let fnRemoveVote = this._removeVote;
    let fnCloneVote = this._cloneVote;

    let opEdit = {
      name: '编辑',
      func: evt => {
        evt.preventDefault();
        push('/mine/votes/' + id + '/edit');
      }
    };

    let opManageOptions = {
      name: '查看候选项',
      func: evt => {
        evt.preventDefault();
        push('/mine/votes/' + id + '/options');
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
            func: () => fnRemoveVote(id)
          }
        });
      }
    };
    let opPublish = {
      name: '发布',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定发布吗？',
            errMsg: null,
            func: () => fnUpdateVote(id, { status: 2 })
          }
        });
      }
    };
    let opClose = {
      name: '关闭',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定关闭吗？',
            errMsg: null,
            func: () => fnUpdateVote(id, { status: 4 })
          }
        });
      }
    };
    let opClone = {
      name: '克隆',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确认克隆吗？',
            errMsg: null,
            func: () => fnCloneVote(vote)
          }
        });
      }
    };
    let ops = [];
    if (isRoot || isOwner) {
      switch (status) {
        case VOTE_STATUS_DRAFT:
          ops = [opDelete, opPublish];
          break;
        // case VOTE_STATUS_CHECKING:
        //   ops = [opDelete, opClose, opClone];
        //   break;
        case VOTE_STATUS_PUBLISHED:
          ops = [opClose, opClone, opManageOptions];
          break;
        // case VOTE_STATUS_CHECKFAIL:
        //   ops = [opDelete, opPublish, opClone];
        //   break;
        case VOTE_STATUS_CLOSED:
        default:
          ops = [opDelete, opPublish, opManageOptions];
          break;
      }
      ops = [opEdit, ...ops];
    }
    return ops;
  }

  render() {
    let { match, me, dbVote, dataVoteRetrieve, push, goBack } = this.props;
    xdebug('state:', this.state, ', props:', this.props);

    let keyQs = _key(this.getQString());
    let dataRetrieve = dataVoteRetrieve[keyQs];
    let voteResult = dataRetrieve && dataRetrieve.result;
    let voteInfo = dataRetrieve && dataRetrieve.info;

    let hasMore = voteInfo && voteResult && voteResult.length < voteInfo.total;

    let uiVotes =
      dbVote &&
      voteResult &&
      voteResult.map((itemId, index) => {
        let item = dbVote[itemId];
        if (!item) return null;
        let {
          id,
          status,
          name,
          owner,
          desc,
          startAt,
          endAt,
          reserved1,
          reserved2
        } = item;

        switch (status) {
          case VOTE_STATUS_DRAFT:
            name = '草案' + id + '：' + name;
            break;
          case VOTE_STATUS_CHECKING:
            name = '待审核' + id + ': ' + name;
            break;
          case VOTE_STATUS_PUBLISHED:
            break;
          case VOTE_STATUS_CHECKFAIL:
            name = '审核失败' + id + '：' + name;
            break;
          case VOTE_STATUS_CLOSED:
            '已下架' + id + '：' + name;
            break;
          default:
            name = '未知状态' + id + '：' + name;
            break;
        }

        let { images } = desc || {};
        let defaultPic =
          (images && images[0] && images[0].url) || '/ysj/images/logo2.png';

        let link = '/app/vote/' + id;

        let voteInfo = {
          ...item,
          link,
          name,
          defaultPic
        };

        let ops = this.initOps(item, me);
        return <ListItem key={index} item={voteInfo} ops={ops} />;
      });

    return (
      <div className="container-fluid jumbotron-fluid">
        <GoBackItem onClick={goBack} title="投票列表" />
        <div className="row no-gutters">
          <div className="col-12" style={{ overflow: 'hidden' }}>
            <MenuItem
              icon="fa fa-file-text-o"
              title="创建投票"
              subtitle="创建新的投票"
              arrow={true}
              onClick={() =>
                this.setState({
                  dlg: {
                    isOpen: true,
                    content: '确认创建吗？',
                    errMsg: null,
                    func: () => this._createVote({})
                  }
                })
              }
            />
            <Gap width={10} />
            {uiVotes}
            {hasMore && (
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block mt-1"
                onClick={this.pageNext}
              >
                <span className="small">加载更多...</span>
              </button>
            )}
          </div>
        </div>
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
    dbVote: dbVoteSelect(state),
    dataVoteRetrieve: dataVoteRetrieveSelect(state)
  };
};

const mapActionsToProps = {
  push,
  goBack,
  retrieveVotes,
  createVote,
  removeVote,
  updateVote,
  getVote
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
