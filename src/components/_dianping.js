import React from 'react';
import { Link } from 'react-router-dom';
import { FiveStar } from 'components/widgets/FiveStar';
import Gap, { GapVertical } from 'components/widgets/Gap';
import { dataUrlSvgWithSize } from 'components/widgets/_SvgWithSize';
import './dianping.css';

export const VideoItem = ({ item }) => {
  item = {
    attributeName: '炫技能',
    categoryName: '绘画',
    contentId: 2596,
    defaultPic:
      'https://p0.meituan.net/merchantpic/981882e84723db61530f3310a0f46a2f887386.jpg%40280w_200h_1e_1c_1l%7Cwatermark%3D0',
    detailLink:
      'https://g.dianping.com/app/app-education-cms-c/cms_detail.html?cmsId=2596&source=dianping',
    duration: '02:32',
    likeCount: 0,
    videoId: 33182,
    videoTitle: '超燃的战狼2，她的第一次献给了吴京！！！'
  };

  return (
    <div className="videoItem">
      <div className="shadowBox">
        <div className="picBox">
          <img className="img-fluid" src={item.defaultPic} />
          <div className="videoIcon">
            <i className="fa fa-play" />
            {item.duration}
          </div>
        </div>
        <div className="videoName text-truncate">{item.videoTitle}</div>
        <div className="videoTagBox">
          <span className="videoTagItem">{item.categoryName}</span>
          <span className="videoTagItem">{item.attributeName}</span>
        </div>
      </div>
    </div>
  );
};

export const FlagArrow = ({
  name,
  icon = 'fa fa-angle-right',
  color = '#ff8400'
}) => (
  <div className="media flag" style={{ borderColor: color, color: color }}>
    <div className="media-body text-truncate">{name}</div>
    <span className={'ml-1 ' + icon} />
  </div>
);

export const ShopListItem = ({ item }) => {
  item = {
    shopId: 1,
    shopName: '引领英语Leading English',
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
        content:
          'LeadingEnglish!仅售18.9元，价值850元单人精品小班化外教英语体验，节假日通用！',
        extTag: null,
        showType: 'tuan'
      }
    ]
  };
  return (
    <div className="shoplist-item">
      <Link to={'/app/shop/' + item.shopId} className="full-link">
        <div className="shoplist-item-leftpic">
          <img className="thumb" src={item.defaultPic} />
          {item.showAd && <div className="ad-over-icon">广告</div>}
        </div>
      </Link>
      <div className="shoplist-item-info">
        <h4 className="shop-name text-truncate">
          <span>{item.shopName}</span>
        </h4>
        <div className="b-desc">
          <FiveStar value={item.rating || 0} />
        </div>
        <div className="b-desc media align-items-center">
          <div className="text-truncate regionName">{item.regionName}</div>
          <div className="ml-2">{item.categoryName}</div>
          <div className="ml-2">
            <FlagArrow name="效果" icon="fa fa-thumbs-o-up" />
          </div>
          <div className="ml-2">
            <FlagArrow name="环境" icon="fa fa-thumbs-o-up" />
          </div>
        </div>
        <div className="b-desc text-truncate">
          <i className="fa fa-video-camera highlight mr-1" />视频展示：课堂、师资、品牌
        </div>
        <Gap width={1} />
        <div className="coupon mt-2">
          <div className="item">
            <div className="flag-box text-truncate">
              <FlagArrow name="预sss约ssss礼" />
            </div>
            <span className="d-block b-desc text-truncate">
              <i className="fa fa-heart highlight mr-1"> </i>
              免费试听：特色精品口语小班课+免费等级测评+免费英语资料
            </span>
          </div>
          <div className="item">
            <span className="d-block b-desc text-truncate">
              <i className="fa fa-flag highlight mr-1" />
              LeadingEnglish!仅售18.9元，价值850元单人精品小班化外教英语体验，节假日通用！
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ShopListItemV2 = ({ item }) => {
  return (
    <div className="shoplist-item">
      <Link to="/app/shop" className="full-link">
        <div className="shoplist-item-leftpic">
          <img
            className="thumb"
            src="//p0.meituan.net/education/ac09d62ff48190e5ca3433ce6d59aa01700490.jpg%40132w_132h_1e_1c_1l%7Cwatermark%3D0"
          />
          <div className="ad-over-icon">广告</div>
        </div>
      </Link>
      <div className="shoplist-item-info">
        <h4 className="shop-name text-truncate">
          <span>引领英语Leading English</span>
        </h4>
        <div className="b-desc">
          <FiveStar value={50} />
        </div>
        <div className="b-desc media align-items-center">
          <div className="text-truncate regionName">长寿路</div>
          <div className="ml-2">英语</div>
          <div className="ml-2">
            <FlagArrow name="效果" icon="fa fa-thumbs-o-up" />
          </div>
          <div className="ml-2">
            <FlagArrow name="环境" icon="fa fa-thumbs-o-up" />
          </div>
        </div>
        <div className="b-desc text-truncate">
          <i className="fa fa-video-camera highlight mr-1" />视频展示：课堂、师资、品牌
        </div>
        <Gap width={1} />
        <div className="coupon mt-2">
          <div className="item">
            <div className="flag-box text-truncate">
              <FlagArrow name="预sss约ssss礼" />
            </div>
            <span className="d-block b-desc text-truncate">
              <i className="fa fa-heart highlight mr-1"> </i>
              免费试听：特色精品口语小班课+免费等级测评+免费英语资料
            </span>
          </div>
          <div className="item">
            <span className="d-block b-desc text-truncate">
              <i className="fa fa-flag highlight mr-1" />
              LeadingEnglish!仅售18.9元，价值850元单人精品小班化外教英语体验，节假日通用！
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export const ShopList = ({ data }) => {
  data = [
    {
      adReason: '效果',
      address: '西康路1018号元茂金豪大厦1104室',
      admark: '广告',
      avgPrice: '3975',
      categoryName: '英语',
      defaultPic:
        '//p0.meituan.net/education/ac09d62ff48190e5ca3433ce6d59aa01700490.jpg%40132w_132h_1e_1c_1l%7Cwatermark%3D0',
      displayTemplateId: '24',
      distance: null,
      extInfo: {
        content: '视频展示：课堂、师资、品牌',
        extTag: null,
        showType: 'video'
      },
      feedback:
        'rmp%3Dl5SyrEbUxPMbB_-5PbG-xFAl0DmwmrRmyvqcj3qS52A7OBNIywDgrBAJ_yIv9g%26entityid%3D10012417%26adshop_id%3D10012417%26userid%3D0%26category_id%3D2872%26target_id%3D2331225%26request_id%3Dc7ddecd2-95df-433a-8290-e1fb630a810b%26page_city_id%3D1%26adstime%3D1506841064%26ad%3D20630408%26sver%3D2%26slot%3D10108%26entitytype%3D1',
      ka: false,
      promoteInfos: [
        {
          content: '免费试听：特色精品口语小班课+免费等级测评+免费英语资料',
          extTag: '预约礼',
          showType: 'ding'
        },
        {
          content:
            'LeadingEnglish!仅售18.9元，价值850元单人精品小班化外教英语体验，节假日通用！',
          extTag: null,
          showType: 'tuan'
        }
      ],
      regionName: '长寿路',
      shopId: '10012417',
      shopLink: '/app/shop/10012417',
      shopName: '引领英语Leading English',
      shopNameEncode: '%E5%BC%95%E9%A2%86%E8%8B%B1%E8%AF%ADLeading+English',
      shopPower: '50',
      showAd: true,
      top: true
    },
    {
      adReason: '效果',
      address: '国宾路36号万达广场B楼10楼',
      admark: '广告',
      avgPrice: '28576',
      categoryName: '英语',
      defaultPic:
        '//p0.meituan.net/education/f4037b05c088a92eaa23bd0017290b5f147625.jpg%40132w_132h_1e_1c_1l%7Cwatermark%3D0',
      displayTemplateId: '24',
      distance: null,
      extInfo: {
        content: '视频展示：课堂、师资、品牌',
        extTag: null,
        showType: 'video'
      },
      feedback:
        'rmp%3DoSghBMig1Bs7iX5ewBE6Muoh0auEU7XeEaCFSAWTELlQzeMxLfVP6rShZWMA9w%26entityid%3D4057474%26adshop_id%3D4057474%26userid%3D0%26category_id%3D2872%26target_id%3D4302053%26request_id%3Dc7ddecd2-95df-433a-8290-e1fb630a810b%26page_city_id%3D1%26adstime%3D1506841064%26ad%3D22110113%26sver%3D2%26slot%3D10108%26entitytype%3D1',
      ka: false,
      promoteInfos: [
        {
          content:
            '免费试听：资深外教精选课1节+1对1英语学习规划与指导+【国庆随意学】7天在线课程',
          extTag: '预约礼',
          showType: 'ding'
        },
        {
          content:
            '韦博英语!仅售1.9元，价值450元韦博口语课程体验大礼包！国际化教育理念，国内英语教育行业品牌！',
          extTag: null,
          showType: 'tuan'
        }
      ],
      regionName: '五角场/大学区',
      shopId: '4057474',
      shopLink: '/app/shop/4057474',
      shopName: '韦博英语(五角场万达广场中心)',
      shopNameEncode:
        '%E9%9F%A6%E5%8D%9A%E8%8B%B1%E8%AF%AD%28%E4%BA%94%E8%A7%92%E5%9C%BA%E4%B8%87%E8%BE%BE%E5%B9%BF%E5%9C%BA%E4%B8%AD%E5%BF%83%29',
      shopPower: '45',
      showAd: true,
      top: true
    }
  ];
  let uis =
    data &&
    data.map((item, index) => {
      return (
        <div
          key={index}
          className="col-12"
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <ShopListItem item={item} />
        </div>
      );
    });
  return (
    <div className="container-fluid">
      <div className="row">{uis}</div>
    </div>
  );
};
