import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';
import _ from 'lodash';

import { MenuItem, GoBackItem } from 'components/widgets/Menu';
import { Gap, GapVertical } from 'components/widgets/Gap';
import SearchBar from 'components/widgets/SearchBar';
import ShopCard from 'components/dianping/ShopCard';
import UserListItem from 'components/dianping/UserListItem';

import { keyRetrieveItems } from 'modules/u_key';
import { get as getUser } from 'modules/user';
import { dbSelect as dbUserSelect } from 'selectors/user';
import { get as getShop } from 'modules/shop';
import { dbSelect as dbShopSelect } from 'selectors/shop';
import {
  create as createShopManager,
  remove as removeShopManager,
  update as updateShopManager,
  get as getShopManager,
  retrieve as retrieveShopManagers
} from 'modules/shopManager';
import {
  dbSelect as dbShopManagerSelect,
  retrieveSelect as dataShopManagerRetrieveSelect
} from 'selectors/shopManager';

import './edit.css';

export class Page extends React.Component {
  state = {
    qs: '',
    errMsg: ''
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.initFetchData(this.props);
  }

  async initFetchData(props) {
    // fetch shop info.
    // fetch shopManagers.
    let { match, dbShop, getShop, dbShopManager, retrieveShopManagers } = props;
    let id = match.params && match.params.id;
    if (!id) {
      this.setState({ errMsg: '错误！ID为空！' });
      return;
    }
    try {
      let shop = dbShop && dbShop[id];
      if (!shop) shop = await getShop(id);
      let shopManagers = await retrieveShopManagers('shopId=' + id);
      console.log('shop:', shop, ', shopManagers:', shopManagers);
    } catch (e) {
      this.setState({ errMsg: '错误：' + e.message });
    }
  }

  addManager(userId) {
    if (!userId) {
      this.setState({ errMsg: '错误！您没有填写需要添加的用户！' });
      return;
    }
    this.setState({ errMsg: '' });
    let {
      match,
      dbShopManager,
      dataShopManagerRetrieve,
      createShopManager,
      retrieveShopManagers
    } = this.props;
    let id = match.params && match.params.id;
    let items = keyRetrieveItems(
      dbShopManager,
      dataShopManagerRetrieve,
      'shopId=' + id
    );
    let exist =
      items &&
      items.reduce((result, item) => {
        if (item.userId == userId) return true;
        else return result;
      }, false);
    if (exist) {
      this.setState({ errMsg: '此用户已经是管理员了！不需在添加！' });
      return;
    }
    createShopManager({ shopId: id, userId })
      .then(result => {
        return retrieveShopManagers('shopId=' + id);
      })
      .then(result => {
        this.setState({ qsUser: null });
      })
      .catch(error => {
        this.setState({ errMsg: '错误！' + error.message });
      });
  }
  remManager(itemId) {
    if (!itemId) {
      this.setState({ errMsg: '错误！未指定要删除的管理员！' });
      return;
    }
    this.setState({ errMsg: '' });
    let {
      match,
      dbShopManager,
      dataShopManagerRetrieve,
      removeShopManager,
      retrieveShopManagers
    } = this.props;
    let id = match.params && match.params.id;
    let items = keyRetrieveItems(
      dbShopManager,
      dataShopManagerRetrieve,
      'shopId=' + id
    );
    let exist =
      items &&
      items.reduce((result, item) => {
        if (!item) return result;
        if (item.id == itemId) return true;
        else return result;
      }, false);
    if (!exist) {
      this.setState({ errMsg: '此用户不是管理员，不用删除！' });
      return;
    }
    removeShopManager(itemId)
      .then(result => {
        return retrieveShopManagers('shopId=' + id);
      })
      .then(result => {
        this.setState({ qsUser: null });
      })
      .catch(error => {
        this.setState({ errMsg: '错误！' + error.message });
      });
  }
  searchManager(userId) {
    if (!userId) {
      this.setState({ errMsg: '错误！未输入用户ID！' });
      return;
    }
    this.setState({ errMsg: '', qsUser: null });
    let { dbUser, getUser } = this.props;
    let user = dbUser && dbUser[userId];
    if (user) {
      this.setState({ qsUser: user });
      return;
    }
    getUser(userId)
      .then(result => {
        dbUser = this.props.dbUser;
        user = dbUser && dbUser[userId];
        console.log('result:', result);
        this.setState({ qsUser: user });
      })
      .catch(error => {
        this.setState({ errMsg: '错误！' + error.message });
      });
  }
  renderShop() {
    let { match, dbShop } = this.props;
    let id = match.params && match.params.id;
    if (!id) {
      return <div>错误！没有门店ID！</div>;
    }
    let shop = dbShop && dbShop[id];
    if (!shop) {
      return <div>未获得门店信息！</div>;
    }
    return <ShopCard data={shop} />;
  }

  renderManagers() {
    let { match, dbShopManager, dataShopManagerRetrieve } = this.props;
    let id = match.params && match.params.id;
    if (!id) return null;
    let items = keyRetrieveItems(
      dbShopManager,
      dataShopManagerRetrieve,
      'shopId=' + id
    );
    let uiItems =
      items &&
      items.map((item, index) => {
        if (!item) return null;
        return (
          <tr key={index}>
            <td>{item.shopId}</td>
            <td>{item.userId}</td>
            <td onClick={() => this.remManager(item.id)}>删除</td>
          </tr>
        );
      });
    return (
      <div className="small">
        <div>管理员列表</div>
        <table className="table mb-0">
          <thead>
            <tr>
              <th scope="col">门店Id</th>
              <th scope="col">管理员id</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          <tbody>{uiItems}</tbody>
        </table>
      </div>
    );
  }

  renderQsUser() {
    let { qsUser } = this.state;
    if (!qsUser) return null;
    return (
      <div className="media bg-white align-items-center">
        <div className="media-body">
          <UserListItem data={qsUser} />
        </div>
        <div onClick={() => this.addManager(qsUser.id)}>
          <GapVertical width={2} />
          <div>添加</div>
        </div>
      </div>
    );
  }

  render() {
    let { match, push, goBack } = this.props;
    console.log('state:', this.state, ', props:', this.props);
    let { qs, errMsg } = this.state;
    return (
      <div>
        <GoBackItem onClick={goBack} title="设置门店管理员" />
        <Gap width={3} />
        <div
          className="p-2"
          style={{ overflow: 'hidden', backgroundColor: '#fff' }}
        >
          {this.renderShop()}
        </div>
        <Gap width={3} />
        <div
          className="p-2"
          style={{ overflow: 'hidden', backgroundColor: '#fff' }}
        >
          {this.renderManagers()}
        </div>
        <Gap width={3} />
        <div className="p-2">
          <div className="text-warning bg-white">{errMsg}</div>
          <Gap width={1} />
          <div>
            <SearchBar
              placeholder="搜索并添加:用户ID"
              value={qs}
              onChange={evt => this.setState({ qs: evt.target.value })}
              onSubmit={() => this.searchManager(qs)}
            />
          </div>
          <Gap width={1} />
          {this.renderQsUser()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dbUser: dbUserSelect(state),
  dbShop: dbShopSelect(state),
  dbShopManager: dbShopManagerSelect(state),
  dataShopManagerRetrieve: dataShopManagerRetrieveSelect(state)
});

const mapActionsToProps = {
  push,
  goBack,
  getUser,
  getShop,
  createShopManager,
  removeShopManager,
  retrieveShopManagers
};
export default connect(mapStateToProps, mapActionsToProps)(Page);
