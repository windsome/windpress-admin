import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, goBack } from 'react-router-redux';
import isNull from 'lodash/isNull';

import Gap, { VerticalGap } from 'components/widgets/Gap';
import ConfirmModal from 'components/widgets/ModalConfirm';
import FlagArrow from 'components/dianping/FlagArrow';
import { GoBackItem } from 'components/widgets/Menu';

import hasCaps from 'utils/caps';
import { meSelect } from 'selectors/user';
import {
  retrieve as retrieveMessages,
  create as createMessage,
  remove as removeMessage,
  update as updateMessage,
  get as getMessage
} from 'modules/message';
import { dbSelect, retrieveSelect } from 'selectors/message';
import { keyRetrieveResult } from 'modules/u_key';

const Ops = ({ ops }) => {
  if (!ops) return null;
  let uiOps = ops.map((op, index) => {
    return (
      <div
        key={index}
        className="d-inline-block mr-1"
        onClick={evt => op.func(evt, op)}
      >
        <FlagArrow name={op.name} color="#f63" />
      </div>
    );
  });
  return <div className="mt-2">{uiOps}</div>;
};

const ListItem = ({ data, ops }) => {
  let defaultData = {
    id: 1,
    status: 1,
    name: '标题',
    owner: 0,
    receiver: 0,
    type: 'request',
    desc: { addcaps: ['shop', 'teacher'] },
    extend,
    parent
  };
  let { id, status, name, owner, receiver, type, desc, extend, parent } =
    data || defaultData;
  let messageLink = '/mine/messages/' + id;
  return (
    <div className="orderlist-item bg-white mt-1 p-2">
      <Link className="d-block" to={messageLink}>
        <div>{name}</div>
      </Link>
      <Gap width={1} />
      <div className="mt-2">
        <Ops ops={ops} />
      </div>
    </div>
  );
};

export const MessageSelection = ({ data }) => {
  data = data || [
    { name: '收件箱', count: 0, url: '/mine/messages/query/receive' },
    { name: '发件箱', count: 0, url: '/mine/messages/query/send' },
    { name: '历史消息', count: 0, url: '/mine/messages/query/history' }
  ];
  let uis = data.map((item, index) => {
    return (
      <li className="media-body" key={index}>
        <Link to={item.url}>
          <div>{item.name}</div>
          <div className="small">{item.count}</div>
        </Link>
      </li>
    );
  });
  return <ul className="media align-items-center text-center">{uis}</ul>;
};

export class Page extends React.Component {
  constructor() {
    super();
    this._closeDlg = this._closeDlg.bind(this);
    this.qs = '';
  }
  state = {
    dlg: {
      isOpen: false,
      content: null,
      errMsg: null,
      func: null
    }
  };
  componentDidMount() {
    let { me, retrieveMessages } = this.props;
    console.log('props:', this.props, ', state:', this.state);

    retrieveMessages(this.qs);
  }

  _closeDlg() {
    this.setState({
      dlg: { isOpen: false, content: null, errMsg: null, func: null }
    });
  }

  initOps(message, user) {
    if (!message || !message.id || !user || !user.id) {
      // if message == null or user == null, return null!
      //console.log ("error! parameter! message=", message, ", user=", user);
      return null;
    }
    let {
      me,
      push,
      retrieveMessages,
      removeMessage,
      updateMessage,
      getMessage,
      createMessage
    } = this.props;
    let id = message.id;
    let isRoot = hasCaps(user, 'root');
    let isOwner = user.id == message.owner;
    let status = message.status;

    let fnUpdateMessage = (id, args) => {
      updateMessage(id, args)
        .then(ret => getMessage(id))
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
    let fnRemoveMessage = id => {
      removeMessage(id)
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
      name: '查看消息',
      func: evt => {
        evt.preventDefault();
        push('/mine/messages/' + id);
        //window.location.href = '/mine/messages/' + id;
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
            func: () => fnRemoveMessage(id)
          }
        });
      }
    };

    if (isRoot) return [opView, opDelete];
    else return [opView];
  }

  render() {
    let {
      match,
      push,
      goBack,
      me,
      db,
      dataMessageRetrieve,
      removeMessage
    } = this.props;
    console.log('state:', this.state, ', props:', this.props);

    let messages = keyRetrieveResult(dataMessageRetrieve, this.qs);
    let uiMessages =
      messages &&
      messages.map((itemId, index) => {
        let item = db && db[itemId];
        if (!item) return null;
        console.log('item:', item);

        let ops = this.initOps(item, me);
        return <ListItem key={index} data={item} ops={ops} />;
      });

    return (
      <div>
        <GoBackItem onClick={goBack} title="消息列表" />
        <section className="bg-white">
          <MessageSelection />
        </section>
        <div className="container">
          <div className="row">
            <div className="col">未处理的</div>
            <div className="col">已处理</div>
            <div className="col">全部</div>
          </div>
        </div>
        {uiMessages}
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
    dataMessageRetrieve: retrieveSelect(state)
  };
};

const mapActionsToProps = {
  push,
  goBack,
  retrieveMessages,
  createMessage,
  removeMessage,
  updateMessage,
  getMessage
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
