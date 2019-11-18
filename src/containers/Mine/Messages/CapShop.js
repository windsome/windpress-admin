import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';

import { BigButton } from 'components/widgets/Bar';
import Gap from 'components/widgets/Gap';

import { meSelect } from 'selectors/user';
import { create as createMessage, get as getMessage } from 'modules/message';
import {
  dbSelect as dbMessageSelect,
  createSelect as createMessageSelect
} from 'selectors/message';
let xdebug = window.myDebug('app:mine:message');

export class Page extends React.Component {
  state = {
    isOpenTagModal: false,
    isOpenMapModal: false,
    errMsg: null
  };

  constructor() {
    super();
    this.createMessage = this.createMessage.bind(this);
  }

  createMessage(evt) {
    evt.preventDefault();
    let { push, createMessage } = this.props;
    let args = {
      status: 1,
      name: '申请成为商家',
      receiver: 0,
      type: 'request',
      desc: {
        addCaps: ['SHOP']
      },
      parent: 0
    };
    createMessage(args)
      .then(ret => {
        xdebug('ret:', ret);
        push('/mine');
      })
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  }

  // componentDidMount() {
  //   let { match } = this.props;
  //   let id = match.params && match.params.id;
  //   this.initFetchData(id);
  // }

  // initFetchData(id) {
  //   let { db, getMessage, retrieveShops } = this.props;
  //   let item = db && db[id];
  //   if (!item) {
  //     getMessage(id)
  //       .then(ret => {
  //         item = this.props.db && this.props.db[id];
  //         if (item) {
  //           this.setState({ ...item });
  //         } else {
  //           console.log('getMessage fail!');
  //         }
  //         return ret;
  //       })
  //       .then(ret => {
  //         let owner = ret.owner;
  //         return retrieveShops('owner=' + owner);
  //       });
  //   } else {
  //     this.setState({ ...item });
  //     let owner = item.owner;
  //     return retrieveShops('owner=' + owner);
  //   }
  // }

  render() {
    //console.log('render()', this.state, this.props);
    let { push, match, dbMessage, dataMessageCreate } = this.props;
    let { isOpenTagModal, isOpenMapModal, errMsg } = this.state;

    let fetching = dataMessageCreate && dataMessageCreate.fetching;

    return (
      <div>
        <div className="p-3 bg-white">申请商家权限</div>
        <div className="p-3 bg-white">将向管理员发送消息</div>
        <Gap width={1} />
        <div className="text-danger">{errMsg}</div>
        <div>
          <BigButton title={'确定'} onClick={this.createMessage} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  me: meSelect(state, props),
  dbMessage: dbMessageSelect(state),
  dataMessageCreate: createMessageSelect(state)
});

const mapActionsToProps = {
  push,
  createMessage,
  getMessage
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
