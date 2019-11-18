import React from 'react';
import { Link } from 'react-router-dom';
import isArray from 'lodash/isArray';

import FlagArrow from './FlagArrow';
import {
  USER_STATUS_NORMAL,
  USER_STATUS_CHECKING,
  USER_STATUS_CLOSED
} from 'modules/const';
import hasCaps, { CAPNAMES } from 'utils/caps';

import './ProductListItem.css';

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
/*
  参数格式：
  data = {
    id: 1,
    status: 0,
    account: 'windsome',
    subscribe: 1,
    openid:'a1s21adf12eadsf3adfasdfdsaf',
    link: '/app/product/1',
    name: 'windsome',
    headImage: '/a/asd/ads/fa/sdf.jpg',
    caps:['TEACHER','SHOP'],
    phone:'1234234234',
  };
  ops = [
    {
      name: '编辑',
      func: (evt, op) => {
        evt.preventDefault();
        console.log('action=编辑, op=', op);
      }
    }
  ];
*/
export const ListItem = ({ data, ops, toggleCurrent }) => {
  if (!data) return null;
  let {
    id,
    status,
    account,
    subscribe,
    openid,
    caps,
    desc,
    extend,
    link = '/'
  } = data;

  let { name, phone, address } = desc || {};
  let { nickname, headimgurl } = extend || {};
  name = name || nickname || '无昵称';
  account = account || '未设置';
  let headImage = headimgurl;

  let strStatus = '';
  switch (status) {
    case USER_STATUS_NORMAL:
      strStatus = '';
      break;
    case USER_STATUS_CHECKING:
      strStatus = '等待审核';
      break;
    case USER_STATUS_CLOSED:
      strStatus = '已经封闭';
      break;
    default:
      strStatus = '未知状态';
      break;
  }
  let classSubscribe = '';
  if (subscribe) classSubscribe = 'text-warning';
  else classSubscribe = 'text-muted';

  let hasOps = !!ops;

  let uiCaps =
    caps &&
    caps.map((cap, index) => {
      let cap2 = cap && cap.toUpperCase();
      if (cap2) {
        let capname = CAPNAMES[cap2];
        if (capname) {
          return (
            <span
              key={index}
              className="border border-warning rounded p-1 m-1 d-inline-block"
            >
              {capname}
            </span>
          );
        }
      }
    });

  return (
    <div className="itemlist-item">
      <div className="media">
        <Link to={link}>
          <div className="leftpic">
            <img className="thumb" src={headImage} />
          </div>
        </Link>
        <div className="media-body iteminfo">
          <Link to={link}>
            <h4 className="shop-name text-truncate">
              <span>{id + ': '}</span>
              <span>{name}</span>
              <span className="small">{'(' + account + ')'}</span>
            </h4>
            <div className="detail">
              <i className={'fa fa-heart ' + classSubscribe} />
              <span className="cur mx-2">{strStatus}</span>
              {phone && <span className="cur mx-2 small">{' T:' + phone}</span>}
            </div>
          </Link>
          <div style={{ width: '100%', height: 1, backgroundColor: '#eee' }} />
          <div onClick={toggleCurrent} className="pr-2 small media">
            <div className="media-body"> {uiCaps} </div>
            <div>
              {hasOps && <i className="fa fa-angle-double-up mt-2" />}
              {!hasOps && <i className="fa fa-angle-double-down mt-2" />}
            </div>
          </div>
        </div>
      </div>
      {ops && (
        <div className="mt-2">
          <Ops ops={ops} />
        </div>
      )}
    </div>
  );
};

export default ListItem;
