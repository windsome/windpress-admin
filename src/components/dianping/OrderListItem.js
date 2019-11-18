import React from 'react';
import { Link } from 'react-router-dom';
import isArray from 'lodash/isArray';
import Moment from 'moment';

import Gap from 'components/widgets/Gap';
import FlagArrow from './FlagArrow';
import {
  ORDER_STATUS_DRAFT,
  ORDER_STATUS_PREPAY,
  ORDER_STATUS_PAID,
  ORDER_STATUS_FAIL,
  ORDER_STATUS_CLOSED,
  ORDER_STATUS_TIMEOUT
} from 'modules/const';

import './OrderListItem.css';

export const strOrderStatus = status => {
  let orderStatus = '';
  switch (status) {
    case ORDER_STATUS_DRAFT:
      orderStatus = '未支付';
      break;
    case ORDER_STATUS_PREPAY:
      orderStatus = '等待支付';
      break;
    case ORDER_STATUS_PAID:
      orderStatus = '支付成功';
      break;
    case ORDER_STATUS_FAIL:
      orderStatus = '支付失败';
      break;
    case ORDER_STATUS_CLOSED:
      orderStatus = '订单关闭';
      break;
    case ORDER_STATUS_TIMEOUT:
      orderStatus = '支付超时';
      break;
    default:
      orderStatus = '未知状态';
      break;
  }
  return orderStatus;
};

const friendlyTime = payTime => {
  if (!payTime) return null;
  let now = new Date();
  let destDate = new Date(payTime);
  let diff = now.getTime() - destDate.getTime();
  let duration = Moment.duration(diff);

  let str = null;
  //xdebug('finish:', finishDate, ', now:', now, ', diff:', diff);
  if (diff > 10 * 24 * 60 * 60 * 1000) {
    str = Moment.parseZone(payTime).format('YYYY-MM-DD HH:mm');
  } else if (diff >= 1 * 24 * 60 * 60 * 1000) {
    str =
      parseInt(duration.asDays()) +
      '天' +
      duration.hours() +
      '时' +
      duration.minutes() +
      '分' +
      duration.seconds() +
      '秒前';
  } else if (diff >= 60 * 60 * 1000) {
    str =
      parseInt(duration.asHours()) +
      '时' +
      duration.minutes() +
      '分' +
      duration.seconds() +
      '秒前';
  } else if (diff >= 60 * 1000) {
    str = parseInt(duration.asMinutes()) + '分' + duration.seconds() + '秒前';
  } else if (diff > 0) {
    str = parseInt(duration.asSeconds()) + '秒前';
  } else {
    str = '错误日期';
  }
  return str;
};

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
    link: '/app/product/1',
    name: '零基础 学唱歌 一对一导师现场指导教学, 节假日通用',
    defaultPic:
      '//p0.meituan.net/education/ac09d62ff48190e5ca3433ce6d59aa01700490.jpg%40132w_132h_1e_1c_1l%7Cwatermark%3D0',
    prices: [{
      price: 10,
      name: '3W'
    },{
      price:20,
      name: '10W'
    }],
    saled: 100
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

  注：
  prices的格式还有（现价/原价，数组只有一个元素）：
  prices: [{
    price: 10,
    post: 30
  }],

 */
export const ListItem = ({ data, ops }) => {
  // let defaultData = {
  //   shopName: '都爱小吃浏阳蒸菜馆',
  //   shopLink: '/app/shop/1',
  //   shopLogo:
  //     'https://fuss10.elemecdn.com/e/8e/fe7728b96ab29d781586c3a2fc87dpng.png?imageMogr/thumbnail/!64x64r/gravity/Center/crop/64x64/',
  //   productName: '农家小炒肉',
  //   productLink: '/app/product/1',
  //   orderStatus: '支付成功',
  //   payTime: new Date(),
  //   fee: '2100'
  // };
  // let {
  //   shopName,
  //   shopLink,
  //   shopLogo,
  //   productName,
  //   productLink,
  //   orderStatus,
  //   payTime,
  //   fee
  // } = { ...defaultData, ...data };
  // let payTimeStr = '1小时45分钟前';
  // fee = new Number(fee / 100).toFixed(2);

  let { id, status, owner, desc, extend, productId, shopId, fee, payTime } =
    data || {};
  let { product, shop, user } = desc || {};
  let orderStatus = strOrderStatus(status);

  let shopLink = '/app/shop/' + shopId;
  let productLink = '/app/product/' + productId;
  let userLink = '/mine/users/' + owner;
  let shopName = (shop && shop.name) || '未命名店铺';
  let shopLogo =
    (shop && shop.desc && shop.desc.logo) || '/ysj/images/logo2.png';

  let productName = product && product.name;
  let payTimeStr = friendlyTime(payTime);

  fee = new Number(fee / 100).toFixed(2);

  let username =
    (user &&
      ((user.desc && user.desc.name) ||
        (user.extend && user.extend.nickname) ||
        user.account)) ||
    '用户' + owner;
  let userHeadimgurl =
    (user && user.extend && user.extend.headimgurl) ||
    '/ysj/images/avatar-1.png';

  return (
    <div className="orderlist-item bg-white mt-1 p-2">
      <div className="media">
        <Link to={shopLink}>
          <img className="logo" src={shopLogo} />
        </Link>
        <div className="px-2 media-body small">
          <Link className="d-block" to={shopLink}>
            <div className="media">
              <span className="d-block media-body">{shopName}</span>
              <span className="d-block small">{orderStatus}</span>
            </div>
          </Link>
          <div>
            <Link to={userLink}>
              <span className="small font-weight-light">
                <img
                  className="rounded-circle"
                  style={{ width: 30, height: 30 }}
                  src={userHeadimgurl}
                />
              </span>
              <span className="ml-1 small font-weight-light">{username}</span>
            </Link>
            <span className="float-right small font-weight-light">
              {payTimeStr}
            </span>
          </div>
          <Gap width={1} />
          <div className="small py-2">
            <Link to={productLink}>
              <span className="font-weight-light">{productName}</span>
            </Link>
            <span className="float-right font-weight-bold">{'¥' + fee}</span>
          </div>
        </div>
      </div>
      <Gap width={1} />
      <div className="mt-2">
        <Ops ops={ops} />
      </div>
    </div>
  );
};

export default ListItem;
