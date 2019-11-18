import React from 'react';
import { Link } from 'react-router-dom';
import isNull from 'lodash/isNull';
import { FiveStarSvg } from 'components/widgets/FiveStar';
import FlagArrow from './FlagArrow';
import { gpsDistance, strDistance } from 'utils/gps';
import './ShopListItem.css';

/*
 示例数据：
  data = {
    shopId: 1,
    shopLink: '/app/shop/1',
    shopName: '引领英语Leading English 引领英语Leading English',
    address: '西康路1018号元茂金豪大厦1104室',
    defaultPic:
      '//p0.meituan.net/education/ac09d62ff48190e5ca3433ce6d59aa01700490.jpg%40132w_132h_1e_1c_1l%7Cwatermark%3D0',
    showAd: true,
    rating: 90,
    regionName: '长寿路',
    categoryName: '英语',
    adReason: ['效果', '环境'],
    extInfo: {
      content: '视频展示：课堂、师资、品牌',
      extTag: null,
      showType: 'video'
    },
    promoteInfos: [
      {
        content: '免费试听：特色精品口语小班课+免费等级测评+免费英语资料',
        extTag: '预约礼',
        showType: 'ding'
      },
      {
        content: 'LeadingEnglish!仅售18.9元，价值850元单人精品小班化外教英语体验，节假日通用！',
        extTag: null,
        showType: 'tuan'
      }
    ]
  };

  ops = [
    {
      name: '编辑',
      func: (evt, id) => {
        evt.preventDefault();
        console.log('action=编辑, id=' + id);
      }
    },
    {
      name: '删除',
      func: (evt, id) => {
        evt.preventDefault();
        console.log('action=删除, id=' + id);
      }
    },
    {
      name: '提交审核',
      func: (evt, id) => {
        evt.preventDefault();
        console.log('action=提交审核, id=' + id);
      }
    },
    {
      name: '退回修改',
      func: (evt, id) => {
        evt.preventDefault();
        console.log('action=退回修改, id=' + id);
      }
    },
    {
      name: '发布',
      func: (evt, id) => {
        evt.preventDefault();
        console.log('action=发布, id=' + id);
      }
    },
    {
      name: '推荐',
      func: (evt, id) => {
        evt.preventDefault();
        console.log('action=推荐, id=' + id);
      }
    },
    {
      name: '取消推荐',
      func: (evt, id) => {
        evt.preventDefault();
        console.log('action=取消推荐, id=' + id);
      }
    },
    {
      name: '下架',
      func: (evt, id) => {
        evt.preventDefault();
        console.log('action=下架, id=' + id);
      }
    },
    {
      name: '退款',
      func: (evt, id) => {
        evt.preventDefault();
        console.log('action=退款, id=' + id);
      }
    }
  ];

 */
export const ShopListItem = ({ data, ops }) => {
  if (!data) {
    console.log('error! no data!');
    return null;
  }
  let {
    shopId,
    shopName,
    shopLink,
    adReason,
    promoteInfos,
    showAd = false,
    defaultPic,
    rating = 0,
    regionName,
    categoryName,
    extInfo,
    POSITION
  } = data;
  let uiAds =
    adReason &&
    adReason.map((value, index) => {
      return (
        <div key={index} className="ml-2">
          <FlagArrow name={value} icon="fa fa-thumbs-o-up" />
        </div>
      );
    });

  let uiPromotes =
    promoteInfos &&
    promoteInfos.map((info, index) => {
      return (
        <div key={index} className="media mt-1 align-items-center">
          <div className="pr-2" style={{ width: 86 }}>
            {info.extTag && (
              <FlagArrow name={info.extTag} icon="fa fa-star-o" />
            )}
          </div>
          <div className="media-body">
            <span className="d-block b-desc text-truncate">
              <i className="fa fa-heart highlight mr-1"> </i>
              <span>{info.content}</span>
            </span>
          </div>
        </div>
      );
    });

  let uiOps =
    ops &&
    ops.map((op, index) => {
      return (
        <div
          key={index}
          className="d-inline-block mr-1"
          onClick={evt => op.func(evt, shopId)}
        >
          <FlagArrow name={op.name} color="#f63" />
        </div>
      );
    });

  return (
    <div className="shoplist-item">
      <div className="media">
        <Link to={shopLink}>
          <div className="leftpic">
            <img className="thumb" src={defaultPic} />
            {showAd && <div className="ad-over-icon">广告</div>}
          </div>
        </Link>
        <div className="media-body info">
          <Link to={shopLink}>
            <h4 className="shop-name text-truncate">
              <span className="small">{}</span>
              <span>{shopName || '未命名门店'}</span>
            </h4>
            <div className="b-desc">
              <FiveStarSvg height={12} value={rating} />
              <span className="float-right">{POSITION}</span>
            </div>
            <div className="b-desc media align-items-center">
              <div className="text-truncate regionName">{regionName}</div>
              <div className="ml-2">{categoryName}</div>
              {uiAds}
            </div>
            <div className="b-desc text-truncate">
              {extInfo &&
                extInfo.showType === 'video' && (
                  <i className="fa fa-video-camera highlight mr-1" />
                )}
              <span>{(extInfo && extInfo.content) || '图片展示'}</span>
            </div>
            <div
              style={{ width: '100%', height: 1, backgroundColor: '#eee' }}
            />
          </Link>
        </div>
      </div>
      <div className="mt-2">{uiPromotes}</div>
      <div className="mt-2">{uiOps}</div>
    </div>
  );
};

export const exchangeShopInfo = (shop, position) => {
  if (!shop) {
    console.log('error! no shop!');
    return null;
  }

  let { id, name, status, lng, lat, desc, extend, tags, ratingScore } = shop;
  let { region } = desc || {};
  let { images, videos, ads, showAd, promote } = extend || {};
  showAd = true;

  let regionName = (region && region[0]) || '';
  let tagName = tags && tags[0];
  let adReason = ads || [];
  let defaultPic =
    (images && images[0] && images[0].url) || '/ysj/images/logo.png';
  let extInfo = videos &&
    videos.length > 0 && {
      content: '视频展示：课堂、师资、品牌',
      extTag: null,
      showType: 'video'
    };

  let distanceStr =
    position && strDistance(gpsDistance(position.lat, position.lng, lat, lng));

  let shopInfo = {
    shopId: id,
    shopLink: '/app/shop/' + id,
    shopName: name,
    defaultPic,
    showAd,
    rating: ratingScore,
    regionName: regionName,
    categoryName: tagName,
    adReason,
    extInfo,
    promoteInfos: promote,
    distanceStr
  };
  return shopInfo;
};

export const ShopList = ({ data }) => {
  data = data || [null, null];
  let uis =
    data &&
    data.map((data, index) => {
      return <ShopListItem key={index} data={data} />;
    });
  return <div>{uis}</div>;
};

export default ShopListItem;
