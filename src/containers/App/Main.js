import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';

import withTimely from 'components/hoc/withTimely';
import { dataUrlSvgWithSize } from 'components/widgets/_SvgWithSize';
import withScrollDetect from 'components/hoc/withScrollDetect';
import Gap, { GapVertical } from 'components/widgets/Gap';
import VideoItem from 'components/dianping/VideoItem';
import {
  ShopListItem,
  exchangeShopInfo
} from 'components/dianping/ShopListItem';
import SearchBar from 'components/widgets/SearchBar';
import SeckillPreview from 'components/widgets/Seckill';

import { keyRetrieveResult, keyRetrieveInfo } from 'modules/u_key';
import { meSelect } from 'selectors/user';
import { positionSelect } from 'selectors/position';
import { retrieve as retrieveShops } from 'modules/shop';
import {
  dbSelect as dbShopSelect,
  retrieveSelect as retrieveShopSelect
} from 'selectors/shop';
import {
  category as fetchCategory,
  getIndexPage,
  updateIndexPage
} from 'modules/setting';
import {
  indexPageDataSelect,
  categoryDataSelect,
  categoryDataEducationSelect
} from 'selectors/setting';
import { retrieve as retrieveProductSeckills } from 'modules/productSeckill';
import {
  dbSelect as dbProductSeckillSelect,
  retrieveSelect as retrieveProductSeckillSelect
} from 'selectors/productSeckill';

import EditSwitch from './widgets/EditSwitch';
import {
  TimelyAdvertiseSlide,
  AdvertiseSlideEditor
} from './widgets/AdvertiseSlide';
import {
  AdvertiseSingle,
  AdvertiseSingleEditor
} from './widgets/AdvertiseSingle';
import { AdvertiseThree, AdvertiseThreeEditor } from './widgets/AdvertiseThree';
import './Main.css';
let xdebug = window.myDebug('app:Main');

export const Header = ({ user }) => {
  let { account, desc, extend } = user || {};
  let { name, phone, address } = desc || {};
  let { nickname, headimgurl } = extend || {};
  name = name || nickname || account || '个人中心';

  let uiHeadImage = null;
  if (headimgurl)
    uiHeadImage = (
      <img
        src={headimgurl}
        className="rounded-circle"
        style={{ width: 20, height: 20 }}
      />
    );
  else uiHeadImage = <span className="fa fa-user-circle" />;

  return (
    <div className="media align-items-center bg-white pl-1">
      <div className="text-truncate" style={{ maxWidth: '80%' }}>
        <Link to="/mine" className="text-dark">
          {uiHeadImage}
          <span className="pl-1 small">{name}</span>
        </Link>
      </div>
      <div className="media-body input-group search">
        <Link to="/app/search" className="text-dark" style={{ width: '100%' }}>
          <SearchBar placeholder="搜索:商户,课程" />
        </Link>
      </div>
    </div>
  );
};

export const PartPopular = ({ data }) => {
  data = [
    { name: '英语', icon: 'fa fa-heart-o', url: '/app/shoplist/1' },
    { name: '钢琴', icon: 'fa fa-jpy', url: '/app/shoplist/1' },
    { name: '美术', icon: 'fa fa-user-o', url: '/app/shoplist/1' },
    { name: '升学辅导', icon: 'fa fa-user-o', url: '/app/shoplist/1' }
  ];
  let uis =
    data &&
    data.map((item, index) => {
      return (
        <div
          key={index}
          className={
            'media-body media align-items-center flex-column flex-nowrap m-2 big-icon-item' +
            ' item' +
            index
          }
        >
          <div className="mt-2">
            <span className={item.icon} />
          </div>
          <div className="mt-1 big-icon-item-text">{item.name}</div>
        </div>
      );
    });

  return (
    <div className="media align-items-center align-content-center big-icon">
      {uis}
      {/*<Link to="/app/shoplist" className="full-link" />*/}
    </div>
  );
};

export const PartSecondCategory = ({ items }) => {
  items = [
    { name: '免费试听', icon: 'fa fa-tv', to: '/app/shoplist' },
    {
      name: '比赛',
      icon: 'fa fa-trophy',
      href: 'http://www.ysjclass.com/match/list'
    },
    {
      name: '考级',
      icon: 'fa fa-star',
      href: 'http://www.ysjclass.com/grading/list'
    },
    {
      name: '艺教资讯',
      icon: 'fa fa-newspaper-o',
      href: 'http://www.ysjclass.com/news/list'
    },
    {
      name: '家长课堂',
      icon: 'fa fa-graduation-cap',
      href: 'http://www.ysjclass.com/famous/list'
    },
    {
      name: '精品课程',
      icon: 'fa fa-video-camera',
      to: '/app/productlist/type=课程'
    },
    { name: '优选活动', icon: 'fa fa-users', to: '/app/productlist/type=活动' },
    //{ name: '秒杀', icon: 'fa fa-users', to: '/app/seckilllist' },
    {
      name: '艺术商城',
      icon: 'fa fa-shopping-cart',
      to: '/app/productlist/type=活动'
    }
  ];
  let colors = [
    '#ffd076',
    '#9ed872',
    '#ffa4c3',
    '#cab59a',
    '#fdb07f',
    '#cab59a',
    '#77d1ef',
    '#9ed874',
    '#ffd076',
    '#6acdee'
  ];

  let uis =
    items &&
    items.map((item, index) => {
      return (
        <div className="col-3 col-md p-1" key={index}>
          {item.to && (
            <Link to={item.to}>
              <div>
                <div
                  className={'p-2 rounded-circle ' + item.icon}
                  style={{
                    color: '#fff',
                    backgroundColor: colors[index],
                    fontSize: '1.5rem'
                  }}
                />
              </div>
              <div className="small text-truncate text-dark">{item.name}</div>
            </Link>
          )}
          {item.href && (
            <a href={item.href}>
              <div>
                <div
                  className={'p-2 rounded-circle ' + item.icon}
                  style={{
                    color: '#fff',
                    backgroundColor: colors[index],
                    fontSize: '1.5rem'
                  }}
                />
              </div>
              <div className="small text-truncate text-dark">{item.name}</div>
            </a>
          )}
        </div>
      );
    });
  return (
    <div className="container-fluid jumbotron-fluid">
      <div className="second-category row no-gutters">{uis}</div>
    </div>
  );
};

export const PartVideoBox = ({}) => {
  return (
    <div className="videoBox">
      {/*<div className="videoLogo" />*/}
      <div className="videoTop media align-items-center ">
        <div className="media-body">
          <div className="videoBox-titleText">轻松学</div>
          <div className="videoBox-subTitleText">看视频涨姿势</div>
        </div>
        <div>
          <div className="moreVedioBtn">
            <span>更多视频</span>
            <span className="buttonArrow" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6" style={{ paddingLeft: 2, paddingRight: 2 }}>
          <VideoItem />
        </div>
        <div className="col-6" style={{ paddingLeft: 2, paddingRight: 2 }}>
          <VideoItem />
        </div>
      </div>
    </div>
  );
};

export const PartBillBoard = ({ data }) => {
  data = [
    {
      link: '/app/shoplist/tag=音乐培训',
      subTitle: '排行榜',
      thumb:
        '//www.dpfile.com/sc/ares_pics/9db683557663a832ba9b1853c66fefbf.png',
      title: '音乐机构'
    },
    {
      link: '/app/shoplist/tag=美术培训',
      subTitle: '排行榜',
      thumb:
        '//www.dpfile.com/sc/ares_pics/9db683557663a832ba9b1853c66fefbf.png',
      title: '美术机构'
    },
    {
      link: '/app/shoplist/tag=外语培训',
      subTitle: '排行榜',
      thumb:
        '//www.dpfile.com/sc/ares_pics/9db683557663a832ba9b1853c66fefbf.png',
      title: '外语培训机构'
    }
  ];

  let uis =
    data &&
    data.map((item, index) => {
      return (
        <div key={index} className="col-4 bill-board-item">
          <img className="img-fluid" src={item.thumb} />
          <Link to={item.link}>
            <div className="bill-board-item-title text-truncate">
              {item.title}
            </div>
            <div className="bill-board-item-sub-title text-truncate">
              排行榜
            </div>
          </Link>
        </div>
      );
    });
  return (
    <div className="container-fluid jumbotron-fluid bill-board px-1">
      <div className="row no-gutters">{uis}</div>
    </div>
  );
};

export const CategoryList = ({
  data = null,
  current = 0,
  onSetCurrent = null
}) => {
  let uis =
    data &&
    data.map((item, index) => {
      if (current === index) {
        return (
          <span key={index} className="on" onClick={() => onSetCurrent(index)}>
            {item.name}
          </span>
        );
      } else {
        return (
          <span key={index} onClick={() => onSetCurrent(index)}>
            {item.name}
          </span>
        );
      }
    });
  return (
    <div className="tab-wrap-wrap">
      <div className="tab-wrap">
        <div className="tab-nav">{uis}</div>
      </div>
    </div>
  );
};

export class Page extends React.Component {
  constructor() {
    super();
  }
  state = {
    currentCategory: null,
    qs: '',
    qstmp: '',
    errMsg: null,
    editing: null
  };

  componentDidMount() {
    this.initFetchData(this.props);
    this._doRetrieve();
    console.log('Main:', this.props.match);
  }
  async initFetchData(props) {
    let {
      indexPageData,
      getIndexPage,
      dataCategory,
      fetchCategory,
      retrieveShops,
      dbProductSeckill,
      dataProductSeckillRetrieve,
      retrieveProductSeckills
    } = props;
    if (!dataCategory) {
      await fetchCategory();
    }
    //console.log('componentDidMount:', indexPageData)
    if (!indexPageData) {
      try {
        indexPageData = await getIndexPage();
      } catch (error) {}
    }
    if (indexPageData) {
      let desc = indexPageData.desc || {};
      this.setState({ ...desc });
    }

    let items = keyRetrieveResult(dataProductSeckillRetrieve, '');
    if (!dbProductSeckill || !items) {
      try {
        await retrieveProductSeckills();
      } catch (error) {}
    }
  }

  componentWillReceiveProps(nextProps) {
    let currInScrollArea = this.props.xInScrollArea;
    let nextInScrollArea = nextProps.xInScrollArea;
    if (currInScrollArea != nextInScrollArea) {
      if (nextInScrollArea) {
        //console.log('componentWillReceiveProps:', nextInScrollArea);
        this.nextPage();
      }
    }
  }
  getQs() {
    let qsArr = ['status=2'];
    let qs2 = this.state.qs;
    qs2 = qs2 && qs2.trim();
    if (qs2) {
      qsArr.push('tag=' + qs2);
    }
    return qsArr.join(';');
  }
  _doRetrieve(page = -1) {
    var { retrieveShops } = this.props;
    retrieveShops(this.getQs(), page)
      .then(ret => {
        console.log('list:', ret);
      })
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  }
  query(qs) {
    this.setState({ qs });
    setTimeout(this._doRetrieve.bind(this), 0);
  }
  nextPage() {
    var { dataShopRetrieve } = this.props;
    let key = this.getQs();
    let items = keyRetrieveResult(dataShopRetrieve, key);
    let info = keyRetrieveInfo(dataShopRetrieve, key);
    let total = (info && info.total) || 0;
    let page = (info && info.page && parseInt(info.page)) || 0;
    let count = (items && items.length) || 0;
    if (count >= total) {
      xdebug('already get all data!');
      return;
    }
    return this._doRetrieve(page + 1);
  }

  renderList() {
    let { position, dbShop, dataShopRetrieve } = this.props;
    let items = keyRetrieveResult(dataShopRetrieve, this.getQs());
    if (!dbShop || !items) {
      return <div>没有数据</div>;
    }

    let uiItems = items.map((itemId, index) => {
      let item = dbShop[itemId];
      if (!item) return null;
      let shopInfo = exchangeShopInfo(item, position);
      return <ShopListItem key={index} data={shopInfo} />;
    });

    return uiItems;
  }

  updatePageData() {
    let {
      currentCategory,
      qs,
      qstmp,
      errMsg,
      editing,
      ...pageData
    } = this.state;
    let { updateIndexPage } = this.props;
    updateIndexPage({ desc: pageData })
      .then(ret => {
        let desc = (ret && ret.desc) || {};
        this.setState({ ...desc });
      })
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  }
  render() {
    let {
      location,
      me,
      match,
      dataCategoryEducation,
      dbProductSeckill,
      dataProductSeckillRetrieve
    } = this.props;
    let {
      editing,
      currentCategory,
      slide,
      ad1,
      ad2_1,
      ad2_2,
      ad3
    } = this.state;

    let categories = [{ name: '全部' }];
    if (dataCategoryEducation)
      categories = [...categories, ...dataCategoryEducation];

    let seckills = keyRetrieveResult(dataProductSeckillRetrieve, '');
    let seckills3 = seckills && seckills.slice(0, 3);
    let seckills3_data =
      seckills3 &&
      seckills3.map(productId => {
        let item = dbProductSeckill && dbProductSeckill[productId];
        if (!item) return null;
        let image =
          item.extend &&
          item.extend.images &&
          item.extend.images[0] &&
          item.extend.images[0].url;
        let priceOrigin = item.prices && item.prices[0] && item.prices[0].price;
        let priceSeckill = item.seckill && item.seckill.price;
        return {
          image,
          priceOrigin,
          priceSeckill
        };
      });

    let canEdit =
      (match.params && match.params.action && match.params.action == 'edit') ||
      false;
    const amEditing = what => editing == what && canEdit;
    const setEditing = what => this.setState({ editing: what });
    const toggleEditing = what => {
      if (what == this.state.editing) this.setState({ editing: null });
      else this.setState({ editing: what });
    };

    return (
      <div>
        <Header user={me} />
        <Gap width={1} />
        <div className="position-relative">
          <EditSwitch
            canEdit={canEdit}
            editing={amEditing('slide')}
            style={{ top: 1, fontSize: '1.2em' }}
            onClick={() => toggleEditing('slide')}
          />
          {amEditing('slide') && (
            <AdvertiseSlideEditor
              data={slide}
              onChange={data => {
                this.setState({ slide: data, editing: null });
                setTimeout(this.updatePageData.bind(this), 0);
              }}
            />
          )}
          {!amEditing('slide') && <TimelyAdvertiseSlide data={slide} />}
        </div>
        <Gap width={1} />
        <div className="clearfix" style={{ overflow: 'hidden' }}>
          {/*<PartPopular />*/}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <PartSecondCategory />
        </div>
        <Gap width={1} />
        <div className="media align-items-center bg-white">
          <Link
            to="/app/seckilllist"
            style={{ display: 'block', width: '50%' }}
          >
            <SeckillPreview data={seckills3_data} />
          </Link>
          <div className="media-body">
            <div className="position-relative" style={{ overflow: 'hidden' }}>
              <EditSwitch
                canEdit={canEdit}
                editing={amEditing('ad2_1')}
                style={{ top: 1, fontSize: '1.2em' }}
                onClick={() => toggleEditing('ad2_1')}
              />
              {amEditing('ad2_1') && (
                <AdvertiseSingleEditor
                  data={ad2_1}
                  ratio={30}
                  onChange={data => {
                    this.setState({ ad2_1: data, editing: null });
                    setTimeout(this.updatePageData.bind(this), 0);
                  }}
                />
              )}
              {!amEditing('ad2_1') && (
                <AdvertiseSingle data={ad2_1} ratio={30} />
              )}
            </div>
            <div className="position-relative" style={{ overflow: 'hidden' }}>
              <EditSwitch
                canEdit={canEdit}
                editing={amEditing('ad2_2')}
                style={{ top: 1, fontSize: '1.2em' }}
                onClick={() => toggleEditing('ad2_2')}
              />
              {amEditing('ad2_2') && (
                <AdvertiseSingleEditor
                  data={ad2_2}
                  ratio={30}
                  onChange={data => {
                    this.setState({ ad2_2: data, editing: null });
                    setTimeout(this.updatePageData.bind(this), 0);
                  }}
                />
              )}
              {!amEditing('ad2_2') && (
                <AdvertiseSingle data={ad2_2} ratio={30} />
              )}
            </div>
          </div>
        </div>
        <Gap width={1} />
        <div className="position-relative" style={{ overflow: 'hidden' }}>
          <EditSwitch
            canEdit={canEdit}
            editing={amEditing('ad1')}
            style={{ top: 1, fontSize: '1.2em' }}
            onClick={() => toggleEditing('ad1')}
          />
          {amEditing('ad1') && (
            <AdvertiseSingleEditor
              data={ad1}
              onChange={data => {
                this.setState({ ad1: data, editing: null });
                setTimeout(this.updatePageData.bind(this), 0);
              }}
            />
          )}
          {!amEditing('ad1') && <AdvertiseSingle data={ad1} />}
        </div>
        <Gap width={1} />
        <div className="position-relative" style={{ overflow: 'hidden' }}>
          <EditSwitch
            canEdit={canEdit}
            editing={amEditing('ad3')}
            style={{ top: 1, fontSize: '1.2em' }}
            onClick={() => toggleEditing('ad3')}
          />
          {amEditing('ad3') && (
            <AdvertiseThreeEditor
              data={ad3}
              onChange={data => {
                this.setState({ ad3: data, editing: null });
                setTimeout(this.updatePageData.bind(this), 0);
              }}
            />
          )}
          {!amEditing('ad3') && <AdvertiseThree data={ad3} />}
        </div>
        {/*<div style={{ overflow: 'hidden' }}>
          <PartVideoBox />
        </div>
        <Gap />
        <div style={{ overflow: 'hidden' }}>
          <PartBillBoard />
        </div>*/}
        <Gap width={1} />
        {/* <div style={{ overflow: 'hidden' }}>
          <CategoryList
            data={categories}
            current={currentCategory}
            onSetCurrent={index => this.setState({ currentCategory: index })}
          />
        </div> */}
        <div style={{ overflow: 'hidden' }}>{this.renderList()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  me: meSelect(state, props),
  position: positionSelect(state, props),
  dbShop: dbShopSelect(state),
  dataShopRetrieve: retrieveShopSelect(state),
  dbProductSeckill: dbProductSeckillSelect(state),
  dataProductSeckillRetrieve: retrieveProductSeckillSelect(state),
  indexPageData: indexPageDataSelect(state),
  dataCategory: categoryDataSelect(state),
  dataCategoryEducation: categoryDataEducationSelect(state)
});

const mapActionsToProps = {
  push,
  fetchCategory,
  getIndexPage,
  updateIndexPage,
  retrieveShops,
  retrieveProductSeckills
};

export default connect(mapStateToProps, mapActionsToProps)(
  withScrollDetect(Page)
);
