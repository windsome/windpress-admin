import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, goBack } from 'react-router-redux';
import Moment from 'moment';
import isNull from 'lodash/isNull';

import hasCaps from 'utils/caps';

import Gap, { VerticalGap } from 'components/widgets/Gap';
import { GoBackItem } from 'components/widgets/Menu';
import ConfirmModal from 'components/widgets/ModalConfirm';

import {
  VOTEOPTION_STATUS_DRAFT,
  VOTEOPTION_STATUS_CHECKING,
  VOTEOPTION_STATUS_PUBLISHED,
  VOTEOPTION_STATUS_CHECKFAIL,
  VOTEOPTION_STATUS_CLOSED
} from 'modules/const';

import {
  retrieve as retrieveOptions,
  create as createOption,
  remove as removeOption,
  update as updateOption,
  get as getOption
} from 'modules/voteOption';
import {
  dbSelect as dbOptionSelect,
  getSelect as dataOptionGetSelect,
  retrieveSelect as dataOptionRetrieveSelect
} from 'selectors/voteOption';
import { meSelect } from 'selectors/user';
import _key from 'modules/u_key';
import { sleep } from 'utils/sleep';

import './list.css';

const xdebug = window.myDebug('app:voteOption:list');

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
  let { id, status, owner, desc, reserved1, link = '/', defaultPic } =
    item || {};
  let { name, phone, content } = desc || {};

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
          </Link>
          <div className="py-1 text-truncate">
            <span>{'电话：' + phone}</span>
          </div>
          <div className="py-1 text-truncate">
            <span>{'编号:' + id + ' / 票数:' + reserved1}</span>
          </div>
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
    this._updateOption = this._updateOption.bind(this);
    this._removeOption = this._removeOption.bind(this);
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
    let { retrieveOptions } = this.props;
    let qs = this.getQString();
    if (!isNull(qs)) retrieveOptions(qs);
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
        qstr = ';fuzzy[desc]=' + qs;
      }
    }
    return qstr;
  }

  _closeDlg() {
    this.setState({ dlg: { isOpen: false, content: null, func: null } });
  }
  _updateOption(id, args) {
    let { updateOption, getOption } = this.props;
    updateOption(id, args)
      .then(ret => getOption(id))
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
  _removeOption(id) {
    let { removeOption } = this.props;
    removeOption(id)
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

  initOps(item, user) {
    if (!item || !item.id || !user || !user.id) {
      xdebug('error! parameter error!', item, user);
      return null;
    }
    let { me, push } = this.props;

    let id = item.id;
    let voteId = item.voteId;
    let isRoot = hasCaps(user, 'root');
    let isOwner = user.id == item.owner;
    let status = item.status;

    let fnUpdateOption = this._updateOption;
    let fnRemoveOption = this._removeOption;

    let opEdit = {
      name: '编辑',
      func: evt => {
        evt.preventDefault();
        push('/mine/votes/' + voteId + '/options/' + id + '/edit');
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
            func: () => fnRemoveOption(id)
          }
        });
      }
    };
    let opPublish = {
      name: '显示',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定显示吗？',
            errMsg: null,
            func: () => fnUpdateOption(id, { status: 2 })
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
            func: () => fnUpdateOption(id, { status: 4 })
          }
        });
      }
    };
    let ops = [];
    if (isRoot || isOwner) {
      switch (status) {
        case VOTEOPTION_STATUS_DRAFT:
          ops = [opDelete, opPublish];
          break;
        // case VOTEOPTION_STATUS_CHECKING:
        //   ops = [opDelete, opClose, opClone];
        //   break;
        case VOTEOPTION_STATUS_PUBLISHED:
          ops = [opClose];
          break;
        // case VOTEOPTION_STATUS_CHECKFAIL:
        //   ops = [opDelete, opPublish, opClone];
        //   break;
        case VOTEOPTION_STATUS_CLOSED:
        default:
          ops = [opDelete, opPublish];
          break;
      }
      ops = [opEdit, ...ops];
    }
    return ops;
  }

  render() {
    let { match, me, dbOption, dataOptionRetrieve, push, goBack } = this.props;
    xdebug('state:', this.state, ', props:', this.props);

    let voteId = match && match.params && match.params.voteId;
    if (!voteId) {
      return <div>错误页面，没有voteId!</div>;
    }

    let keyQs = _key(this.getQString());
    let dataRetrieve = dataOptionRetrieve[keyQs];
    let optionResult = dataRetrieve && dataRetrieve.result;
    let optionInfo = dataRetrieve && dataRetrieve.info;

    let hasMore =
      optionInfo && optionResult && optionResult.length < optionInfo.total;

    let uiOptions =
      dbOption &&
      optionResult &&
      optionResult.map((itemId, index) => {
        let item = dbOption[itemId];
        if (!item) return null;
        let { id, status, owner, desc, reserved1 } = item;
        let { name, phone, content } = desc || {};

        switch (status) {
          case VOTEOPTION_STATUS_DRAFT:
            name = '草案' + id + '：' + name;
            break;
          case VOTEOPTION_STATUS_CHECKING:
            name = '待审核' + id + ': ' + name;
            break;
          case VOTEOPTION_STATUS_PUBLISHED:
            break;
          case VOTEOPTION_STATUS_CHECKFAIL:
            name = '审核失败' + id + '：' + name;
            break;
          case VOTEOPTION_STATUS_CLOSED:
            '已关闭' + id + '：' + name;
            break;
          default:
            name = '未知状态' + id + '：' + name;
            break;
        }

        let { images } = desc || {};
        let defaultPic =
          (images && images[0] && images[0].url) || '/ysj/images/logo2.png';

        let link = '/app/vote/' + voteId + '/' + id;

        let itemInfo = {
          ...item,
          link,
          name,
          defaultPic
        };

        let ops = this.initOps(item, me);
        return <ListItem key={index} item={itemInfo} ops={ops} />;
      });

    return (
      <div className="container-fluid jumbotron-fluid">
        <GoBackItem onClick={goBack} title="投票候选项列表" />
        <div className="row no-gutters">
          <div className="col-12" style={{ overflow: 'hidden' }}>
            {uiOptions || <div>没有记录</div>}
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
    dbOption: dbOptionSelect(state),
    dataOptionRetrieve: dataOptionRetrieveSelect(state)
  };
};

const mapActionsToProps = {
  push,
  goBack,
  retrieveOptions,
  createOption,
  removeOption,
  updateOption,
  getOption
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
