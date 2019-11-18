import React from 'react';
import { Link } from 'react-router-dom';
import isArray from 'lodash/isArray';
import moment from 'moment';

import withTimely from '../hoc/withTimely';
import FlagArrow from './FlagArrow';
import { Progress } from '../widgets/Progress';
import { getNicePriceFromCent } from 'utils/price';

import './ProductListItem.css';
import {
  PRODUCT_STATUS_DRAFT,
  PRODUCT_STATUS_CHECKING,
  PRODUCT_STATUS_PUBLISHED,
  PRODUCT_STATUS_CHECKFAIL,
  PRODUCT_STATUS_CLOSED,
  PRODUCT_STATUS_FINISH
} from 'modules/const';

const CountDown = ({ start, end, xTimeCount }) => {
  let now = new Date();
  start = start && new Date(start);
  end = end && new Date(end);

  let diffStart = (start && start.getTime() - now.getTime()) || 0;
  let diffEnd = (end && end.getTime() - now.getTime()) || 0;

  console.log('CountDown:', diffStart, diffEnd, start, end);
  if (diffStart <= 0 && diffEnd <= 0) {
    // expire.
    return null;
  }
  if (diffEnd <= diffStart) {
    // wrong duration.
    return null;
  }

  let str = '';
  let diff = 0;
  if (diffStart > 0) {
    diff = diffStart;
    str = '距离开始';
  } else if (diffEnd > 0) {
    diff = diffEnd;
    str = '距离结束';
  }
  let duration = moment.duration(diff);
  let hours = parseInt(duration.asHours());
  let strHours = hours < 10 ? '0' + hours : hours;
  let strMinutes =
    duration.minutes() < 10 ? '0' + duration.minutes() : duration.minutes();
  let strSeconds =
    duration.seconds() < 10 ? '0' + duration.seconds() : duration.seconds();

  return (
    <span className="text-warning">
      <span className="pr-1 small">{str}</span>
      <span className="pr-1 small">
        <span>{strHours}</span>
        <span> : </span>
        <span>{strMinutes}</span>
        <span> : </span>
        <span>{strSeconds}</span>
      </span>
    </span>
  );
};
const TimelyCountDown = withTimely(1)(CountDown);

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
export const ListItemShiTing = ({ data, ops }) => {
  //let { id, type, link = '/', name, defaultPic, prices, saled } = data || {};
  let {
    id,
    status,
    name,
    owner,
    category,
    type,
    desc,
    extend,
    shops,
    total,
    paid,
    prices,
    seckill,
    reserved1
  } =
    data || {};
  let { images, videos, ads } = extend || {};
  let dispName = '';
  switch (status) {
    case PRODUCT_STATUS_DRAFT:
      dispName = '草案' + id + '：' + name;
      break;
    case PRODUCT_STATUS_PUBLISHED:
      dispName = name;
      break;
    case PRODUCT_STATUS_CLOSED:
      dispName = '已下架' + id + '：' + name;
      break;
    case PRODUCT_STATUS_FINISH:
    default:
      dispName = '未知状态' + id + '：' + name;
      break;
  }
  let defaultPic =
    (images && images[0] && images[0].url) || '/ysj/images/logo2.png';
  let link = '/app/product/' + id;
  let saled = paid;
  let percent = (total && parseInt(paid * 100 / total)) || 0;

  let priceNew = null;
  let priceOld = null;
  if (prices && isArray(prices)) {
    if (prices.length > 1) {
      let priceMin = prices[0].price;
      let priceMax = prices[0].price;
      for (let i = 1; i < prices.length; i++) {
        if (prices[i].price > priceMax) priceMax = prices[i].price;
        if (prices[i].price < priceMin) priceMin = prices[i].price;
      }
      priceMin = getNicePriceFromCent(priceMin);
      priceMax = getNicePriceFromCent(priceMax);
      priceNew =
        priceMin == priceMax ? priceMin + '' : priceMin + '-' + priceMax;
    } else if (prices.length == 1) {
      priceNew = getNicePriceFromCent(prices[0].price);
      priceOld = getNicePriceFromCent(prices[0].past);
    }
  }

  let { start, end } = seckill || {};
  if (seckill) {
    let { price } = seckill;
    start = start && new Date(start);
    end = end && new Date(end);
    if (start && end) {
      let now = new Date();
      if (now >= start && now < end) {
        priceOld = priceNew;
        priceNew = getNicePriceFromCent(price);
      }
    }
  }

  let showSaled = true; //!!saled;
  //console.log('ListItemShiTing:', priceNew, priceOld, saled, showSaled);
  let soldOut = paid >= total;

  return (
    <div className="itemlist-item">
      <div className="media">
        <Link to={link}>
          <div className="leftpic">
            <img className="thumb" src={defaultPic} />
          </div>
        </Link>
        <div className="media-body iteminfo">
          <Link to={link}>
            <h4 className="shop-name text-truncate">
              <span>{name}</span>
            </h4>
            <div>{seckill && <TimelyCountDown start={start} end={end} />}</div>
            <div className="detail">
              {priceNew && (
                <span className="cur">
                  ¥<span className="price">{priceNew}</span>
                </span>
              )}
              {priceOld && <span className="past">{'¥' + priceOld}</span>}
              {!soldOut && (
                <div className="bg-dp-pink text-center float-right rounded small">
                  <span className="text-white m-2">立即抢购</span>
                </div>
              )}
              {soldOut && (
                <div className="bg-dp-pink text-center float-right rounded small">
                  <span className="text-white m-2">已经卖完</span>
                </div>
              )}
            </div>
            <div>
              <Progress value={percent} style={{ height: 5 }} />
              <div className="small text-secondary">
                {showSaled && (
                  <span className="sale">
                    {'已售' +
                      saled +
                      '份 / 共锁定' +
                      reserved1 +
                      '份 / 总' +
                      total +
                      '份'}
                  </span>
                )}
              </div>
            </div>
            <div
              style={{ width: '100%', height: 1, backgroundColor: '#eee' }}
            />
          </Link>
        </div>
      </div>
      <div className="mt-2">
        <Ops ops={ops} />
      </div>
    </div>
  );
};

export default ListItemShiTing;
