import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';

import { BigButton } from 'components/widgets/Bar';
import Gap from 'components/widgets/Gap';

import { meSelect } from 'selectors/user';
import { update as updateMessage, get as getMessage } from 'modules/message';
import {
  dbSelect as dbMessageSelect,
  updateSelect as updateMessageSelect
} from 'selectors/message';

export class Page extends React.Component {
  state = {
    isOpenTagModal: false,
    isOpenMapModal: false,
    errMsg: null
  };

  constructor() {
    super();
    //this.updateItem = this.updateItem.bind(this);
  }

  componentDidMount() {
    let { match } = this.props;
    let id = match.params && match.params.id;
    this.initFetchData(id);
  }

  componentWillReceiveProps(nextProps) {
    let { match: oldMatch } = this.props;
    let oldId = oldMatch && oldMatch.params && oldMatch.params.id;
    let { match: newMatch } = nextProps;
    let newId = newMatch && newMatch.params && newMatch.params.id;
    if (oldId !== newId) {
      console.log('me change, we need refetch shops!');
      this.initFetchData(newId);
    }
  }

  initFetchData(id) {
    let { db, getMessage, retrieveShops } = this.props;
    let item = db && db[id];
    if (!item) {
      getMessage(id)
        .then(ret => {
          item = this.props.db && this.props.db[id];
          if (item) {
            this.setState({ ...item });
          } else {
            console.log('getMessage fail!');
          }
          return ret;
        })
        .then(ret => {
          let owner = ret.owner;
          return retrieveShops('owner=' + owner);
        });
    } else {
      this.setState({ ...item });
      let owner = item.owner;
      return retrieveShops('owner=' + owner);
    }
  }

  render() {
    //console.log('render()', this.state, this.props);
    let { push, dbMessage, match } = this.props;
    let { isOpenTagModal, isOpenMapModal, errMsg } = this.state;

    let id = match && match.params && match.params.id;
    if (!id) {
      return <div>没有消息id！</div>;
    }

    let message = dbMessage && dbMessage[id];
    if (!message) {
      return <div>{'消息' + id + '未加载！'}</div>;
    }

    let { status, name, owner, receiver, type, desc, extend, parent } = message;

    return (
      <div>
        <div className="p-3 bg-white">{'消息标题：' + name}</div>
        <div className="p-3 bg-white">{'类型：' + type}</div>
        <Gap width={1} />
        <div className="p-3 bg-white">
          <small className="d-block">消息内容：</small>
          <div className="p-3 bg-white">{JSON.stringify(desc)}</div>
        </div>
        <Gap width={1} />
        <div>{errMsg}</div>
        <div>
          <BigButton title={'确定'} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  me: meSelect(state, props),
  dbMessage: dbMessageSelect(state),
  dataMessageUpdate: updateMessageSelect(state)
});

const mapActionsToProps = {
  push,
  updateMessage,
  getMessage
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
