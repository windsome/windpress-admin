import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';
import _ from 'lodash';

import { MenuItem, GoBackItem } from 'components/widgets/Menu';
import { FixedBottomButton } from 'components/widgets/Bar';
import FileInput, { FileInputPreview } from 'components/widgets/FileInput';
import Gap from 'components/widgets/Gap';
import DvaInput from 'components/widgets/DvaInput';
import MapModal from 'components/widgets/ModalMap';

import hasCaps, { CAPNAMES } from 'utils/caps';
import { meSelect } from 'selectors/user';
import { update as updateUser, get as getUser } from 'modules/user';
import {
  dbSelect as dbUserSelect,
  getSelect as dataUserGetSelect,
  updateSelect as dataUserUpdateSelect
} from 'selectors/user';
import { get as getBonusUser } from 'modules/bonusUser';
import { dbSelect as dbBonusUserSelect } from 'selectors/bonusUser';
import { dbSelect as dbPointUserSelect } from 'selectors/pointUser';

const EditableItem = ({
  name,
  value,
  placeholder,
  editing,
  setEditable,
  changeValue
}) => {
  if (editing) {
    return (
      <div className="bg-white px-2">
        <div className="media border-1 rounded-0 aligh-items-center">
          <div className="align-self-center" style={{ width: '6rem' }}>
            {name}
          </div>
          <div className="media-body">
            <input
              type="text"
              className="form-control border-0 rounded-0"
              placeholder={placeholder}
              value={value || ''}
              onChange={evt => changeValue(evt.target.value)}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <MenuItem
        icon={null}
        title={name}
        subtitle={value}
        subicon="fa fa-edit"
        onClick={setEditable}
      />
    );
  }
};

const AddressItem = ({ value, onClick }) => {
  return (
    <div
      className="media align-items-center align-content-center px-2 py-2 label-act"
      style={{ width: '100%' }}
    >
      <div className="media-body media linkwrapper" onClick={onClick}>
        <div className="media-body text-nowrap title mr-2">
          <span>地址：</span>
        </div>
        <div className="text-right px-1">
          <span className="subtitle mr-2">{value}</span>
        </div>
        <div>
          <span className="fa fa-angle-right" />
        </div>
      </div>
    </div>
  );
};

const CapList = ({ caps }) => {
  let uiCaps =
    caps &&
    caps.map((cap, index) => {
      let cap2 = cap && cap.toUpperCase();
      if (cap2) {
        let capname = CAPNAMES[cap2];
        if (capname) {
          return (
            <div
              key={index}
              className="border border-warning rounded p-1 m-1 d-inline-block"
            >
              {capname}{' '}
            </div>
          );
        }
      }
    });
  return (
    <div
      className="media align-items-center align-content-center p-2 label-act"
      style={{ width: '100%' }}
    >
      <div className="media-body media linkwrapper">
        <div className="media-body text-nowrap title mr-2">
          <span>已有权限：</span>
        </div>
        <div className="text-right px-1">{uiCaps}</div>
      </div>
    </div>
  );
};

const CapAssign = ({ caps, removeCap, addCap }) => {
  let caps2 =
    (caps &&
      caps.map(cap => {
        return cap.toUpperCase();
      })) ||
    [];

  let capkeys = _.keys(CAPNAMES) || [];
  let uiCaps = capkeys.map((key, index) => {
    let capname = CAPNAMES[key];
    if (caps2.indexOf(key) >= 0) {
      // has cap.
      return (
        <div
          key={key}
          className="border border-danger rounded p-1 m-1 d-inline-block"
          onClick={() => {
            removeCap(key);
          }}
        >
          {capname}
          <i className="fa fa-times-circle" />
        </div>
      );
    } else {
      return (
        <div
          key={key}
          className="border border-primary rounded p-1 m-1 d-inline-block"
          onClick={() => {
            addCap(key);
          }}
        >
          {capname}
          <i className="fa fa-plus-circle" />
        </div>
      );
    }
  });

  return (
    <div
      className="media align-items-center align-content-center p-2 label-act"
      style={{ width: '100%' }}
    >
      <div className="media-body media linkwrapper">
        <div className="media-body text-nowrap title mr-2">
          <span>设置权限：</span>
        </div>
        <div className="text-right px-1">{uiCaps}</div>
      </div>
    </div>
  );
};

/**
 * user: {
 *   account, name, phone, district, address,
 * }
 */
export class Page extends Component {
  state = {
    id: null,
    status: null,
    account: null,
    phone: null,
    subscribe: null,
    openid: null,
    desc: null,
    extend: null,
    caps: null,

    isOpenMapModal: false,
    editing: null,
    orgPassword: null,
    errMsg: null
  };

  static propTypes = {
    push: PropTypes.func
  };
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.initFetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    let { match: oldMatch } = this.props;
    let oldId = oldMatch && oldMatch.params && oldMatch.params.id;
    let { match: newMatch } = nextProps;
    let newId = newMatch && newMatch.params && newMatch.params.id;
    if (oldId !== newId) {
      console.log('id change, we need refetch user!');
      this.initFetchData(nextProps);
    }
  }

  async initFetchData(props) {
    let { match, me, dbUser, getUser, dbBonusUser, getBonusUser } = props;
    let id = match.params && match.params.id;
    let meId = me && me.id;
    let userId = id || meId;
    if (!userId) {
      console.log('error! no userId!');
      return;
    }
    try {
      let item = dbUser && dbUser[userId];
      if (!item) {
        let result = await getUser(userId);
        item = result.item;
      }
      if (item) {
        this.setState({ ...item });
      }
    } catch (error) {
      // warning
      console.log('users/edit/initFetchData fail', error);
    }
    try {
      let bonusUser = dbBonusUser && dbBonusUser[userId];
      if (!bonusUser) {
        await getBonusUser(userId);
      }
    } catch (error) {
      // warning
      console.log('users/edit/initFetchData fail', error);
    }
  }

  updateItem = evt => {
    evt.preventDefault();
    let { updateUser, getUser, push, match } = this.props;

    let {
      errMsg,
      editing,
      isOpenMapModal,
      orgPassword,
      id,
      ...item
    } = this.state;
    if (orgPassword) {
      item.password = orgPassword;
    }

    updateUser(id, item)
      .then(ret => getUser(id))
      .then(result => {
        item = result && result.item;
        if (item) {
          this.setState({ ...item, errMsg: '更新成功' });
        }
      })
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  };

  render() {
    let { me, push, goBack, dbBonusUser, dbPointUser } = this.props;
    let {
      errMsg,
      editing,
      isOpenMapModal,
      orgPassword,
      id,
      status,
      account = '',
      subscribe,
      openid,
      desc,
      extend,
      caps
    } = this.state;
    let { phone = '', address = '', gps, region } = desc || {};
    let bonusUser = dbBonusUser && dbBonusUser[id];
    let bonus = (bonusUser && parseInt(bonusUser.bonus)) || '0';
    let pointUser = dbPointUser && dbPointUser[id];
    let point = (pointUser && pointUser.count) || '0';
    //let {lng, lat} = gps ||{};
    //let gps2 = lng && lat && {lng, lat, N: lng, Q:lat} || null;

    let isRoot = hasCaps(me, 'root');

    let changePhone = value => {
      let nextDesc = { ...(desc || {}), phone: value };
      this.setState({ phone: value, desc: nextDesc });
    };
    let changeAddress = (gps, address, region) => {
      let nextDesc = { ...(desc || {}), gps, address, region };
      this.setState({ desc: nextDesc });
    };

    let addCap = cap => {
      let capset = new Set(caps || []);
      capset.add(cap);
      let caparr = Array.from(capset);
      this.setState({ caps: caparr });
    };

    let removeCap = cap => {
      let capset = new Set(caps || []);
      capset.delete(cap);
      let caparr = Array.from(capset);
      this.setState({ caps: caparr });
    };

    return (
      <div>
        <GoBackItem onClick={goBack} title="编辑个人信息" />
        <MenuItem icon={null} title="用户ID：" subtitle={id} subicon={null} />
        <EditableItem
          name="账户名："
          value={account}
          placeholder="输入账户名"
          editing={editing === 'account'}
          setEditable={() => this.setState({ editing: 'account' })}
          changeValue={value => this.setState({ account: value })}
        />
        {bonusUser && (
          <div>
            <Gap width={1} />
            <MenuItem
              icon={null}
              title="当前分利："
              subtitle={bonus}
              subicon={null}
            />
          </div>
        )}
        <div>
          <Gap width={1} />
          <MenuItem
            icon={null}
            title="当前积分："
            subtitle={point}
            subicon={null}
          />
        </div>
        <Gap width={1} />
        <EditableItem
          name="修改网页端登录密码："
          value={orgPassword}
          placeholder="输入密码"
          editing={editing === 'orgPassword'}
          setEditable={() => this.setState({ editing: 'orgPassword' })}
          changeValue={value => this.setState({ orgPassword: value })}
        />
        <Gap width={1} />
        <EditableItem
          name="联系电话："
          value={phone}
          placeholder="输入联系电话"
          editing={editing === 'phone'}
          setEditable={() => this.setState({ editing: 'phone' })}
          changeValue={value => changePhone(value)}
        />
        <Gap width={1} />
        <AddressItem
          value={address}
          onClick={() =>
            this.setState({ isOpenMapModal: true, editing: 'address' })
          }
        />
        <Gap width={1} />
        <CapList caps={caps} />
        <Gap width={1} />
        {isRoot && (
          <CapAssign caps={caps} addCap={addCap} removeCap={removeCap} />
        )}
        <Gap width={2} />
        <div className="bg-white text-center text-warning">{errMsg}</div>
        <Gap width={1} />
        <button
          type="submit"
          className="mt-2 btn btn-primary btn-lg btn-block border-0 rounded-0"
          onClick={this.updateItem}
        >
          保存
        </button>
        <MapModal
          isOpen={isOpenMapModal}
          gps={gps}
          address={address}
          onRequestClose={() => this.setState({ isOpenMapModal: false })}
          func={({ gps, address, region }) => {
            changeAddress(gps, address, region);
            this.setState({
              isOpenMapModal: false
            });
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  me: meSelect(state),
  dbUser: dbUserSelect(state),
  dataUserUpdate: dataUserUpdateSelect(state),
  dbBonusUser: dbBonusUserSelect(state),
  dbPointUser: dbPointUserSelect(state)
});

const mapActionsToProps = {
  push,
  goBack,
  getUser,
  updateUser,
  getBonusUser
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
