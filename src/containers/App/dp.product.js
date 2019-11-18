import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';
import _ from 'lodash';
import moment from 'moment';

import withTimely from 'components/hoc/withTimely';
import Gap from 'components/widgets/Gap';
import { FiveStarSvg } from 'components/widgets/FiveStar';
import ConfirmModal from 'components/widgets/ModalConfirm';

import { keyRetrieveResult, keyRetrieveInfo } from 'modules/u_key';
import { positionSelect } from 'selectors/position';
import { meSelect } from 'selectors/user';
import { retrieve as retrieveShops } from 'modules/shop';
import {
  dbSelect as dbShopSelect,
  retrieveSelect as retrieveShopSelect
} from 'selectors/shop';
import { get as getProduct, update as updateProduct } from 'modules/product';
import {
  dbSelect as dbProductSelect,
  getSelect as getProductSelect
} from 'selectors/product';
import { retrieve as retrieveSeckills } from 'modules/seckill';
import {
  dbSelect as dbSeckillSelect,
  retrieveSelect as dataSeckillRetrieveSelect
} from 'selectors/seckill';
import { create as createOrder } from 'modules/order';
import { gpsDistance, strDistance } from 'utils/gps';
import { openLocation } from 'utils/jssdk';
import { getNicePriceFromCent } from 'utils/price';

import cx from 'classnames';
import EditSwitch from './widgets/EditSwitch';
import './dp.product.css';

let xdebug = window.myDebug('app:product');

const getRedirectOrderUrl = id =>
  require('store').basename + '/app/order/' + id;

export class BannerCarousel extends React.Component {
  constructor() {
    super();
    this.intervalId = null;
    this.nextItem = this.nextItem.bind(this);
  }
  state = {
    current: 0
  };

  nextItem() {
    let { data } = this.props;
    let count = data && data.length;
    let next = 0;
    if (count > 0) {
      next = (this.state.current + 1) % count;
    }
    if (next != this.state.current) {
      this.setState({ current: next });
    }
  }
  componentDidMount() {
    this.intervalId = setInterval(this.nextItem, 3 * 1000);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  render() {
    let { data } = this.props;
    let { current } = this.state;
    let img = data && data[current] && data[current].url;
    let defaultImg =
      'https://p0.meituan.net/education/1ddcb8da997bbc598812577c26ddcb0c83486.jpg%40640w_360h_1e_1c_1l%7Cwatermark%3D0';
    img = img || defaultImg;
    return (
      <div className="banner">
        <div className="h-100 w-100 position-absolute text-center">
          <img
            className="img-fluid"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            src={img}
          />
        </div>
      </div>
    );
  }
}

const Banner = ({ img, url }) => {
  /*let sampleData=[
    {
      img: 'https://p0.meituan.net/education/1ddcb8da997bbc598812577c26ddcb0c83486.jpg%40640w_360h_1e_1c_1l%7Cwatermark%3D0',
      url: null,
    },
    {
      img: 'https://p0.meituan.net/education/71cf008cf489797b93dae49b0edec100247627.jpg%40640w_360h_1e_1c_1l%7Cwatermark%3D0',
      url: '/app/shops/13',
    }
  ];

  data = data || sampleData;
  */
  img =
    img ||
    'https://p0.meituan.net/education/1ddcb8da997bbc598812577c26ddcb0c83486.jpg%40640w_360h_1e_1c_1l%7Cwatermark%3D0';
  return (
    <div className="banner">
      <div className="h-100 w-100 position-absolute text-center">
        <img className="img-fluid" src={img} />
      </div>
    </div>
  );
};

const Feature = ({ full, data, editing, onChange }) => {
  let defaultData = [
    {
      name: '适合人群',
      icon: 'fa fa-users',
      value: '成人'
    },
    {
      name: '适合基础',
      icon: 'fa fa-pencil-square-o',
      value: '不限'
    },
    {
      name: '上课人数',
      icon: 'fa fa-handshake-o',
      value: '1对1'
    },
    {
      name: '教师国籍',
      icon: 'fa fa-users',
      value: '外教、中教'
    }
  ];

  data = data || defaultData;
  let uis =
    data &&
    data.map((item, index) => {
      return (
        <div className="col text-center p-2" key={index}>
          <i className={item.icon + ' d-block text-secondary'} />
          <span className="d-block text-secondary small">{item.name}</span>
          <span className="d-block small">{item.value}</span>
        </div>
      );
    });

  return (
    <div className="container">
      <div className="row small">
        <EditSwitch editing={editing} />
        {uis}
      </div>
    </div>
  );
};

const TextListEditor = ({
  data,
  changeData,
  canEdit = false,
  editing = false
}) => {
  editing = canEdit && editing;
  let nData = (data && _.clone(data)) || [];
  let updDataInner = (value, index) => {
    nData[index] = value;
    changeData(nData);
  };
  let addDataInner = value => {
    //evt.preventDefault();
    console.log('addDataInner:', value);
    nData.push(value);
    changeData(nData);
  };
  let delDataInner = index => {
    nData.splice(index, 1);
    changeData(nData);
  };

  let uiDatas =
    data &&
    data.map((item, index) => {
      if (editing) {
        return (
          <div key={index} className="media">
            <button
              type="button"
              className="badge badge-primary"
              onClick={evt => delDataInner(index)}
            >
              <span>删除</span>
            </button>

            <input
              className="media-body"
              value={item}
              placeholder="请输入亮点内容"
              onChange={evt => updDataInner(evt.target.value, index)}
            />
          </div>
        );
      } else {
        return <div key={index}>{item}</div>;
      }
    });

  //console.log('data:', data, uiDatas);

  return (
    <div>
      {uiDatas}
      {/*<div>所有外教均持有TESOL教学证书</div>
        <div>一对一授课，上课时间灵活可选</div>
        <div>专属学习顾问，并每期开设口语训练营</div>*/}
      {editing && (
        <div>
          <button
            type="button"
            className="badge badge-primary"
            onClick={evt => addDataInner('')}
          >
            <span>增加一行</span>
          </button>
        </div>
      )}
    </div>
  );
};

const ShopInfo = ({ data, position }) => {
  let {
    status,
    name = '未命名店铺',
    address = '未填写地址',
    lng,
    lat,
    tags,
    desc,
    extend,
    owner,
    managers
  } =
    data || {};

  let distanceStr =
    strDistance(gpsDistance(position.lat, position.lng, lat, lng)) ||
    '未获取位置';

  let shopPos = {
    latitude: lat,
    longitude: lng
  };

  console.log('ShopInfo:', data, position, shopPos, distanceStr);
  return (
    <div>
      <div className="p-2">
        <div className="media align-items-center">
          <div
            className="media-body pr-2 mr-2"
            style={{ borderRight: '1px solid #ddd' }}
          >
            <div className="font-weight-bold">{name}</div>
            <div className="text-secondary media small">
              <div className="media-body">
                <FiveStarSvg />
              </div>
              <div>{distanceStr}</div>
            </div>
          </div>
          <div className="text-center text-secondary px-2">
            <i className="fa fa-phone d-block" />
          </div>
        </div>
      </div>
      <Gap width={1} />
      <div className="p-2">
        <div className="media" onClick={() => openLocation(shopPos)}>
          <div className="media-body">
            <i className="fa fa-map-marker mr-2" aria-hidden="true" />
            <span>{address}</span>
          </div>
          <div>
            <i className="fa fa-angle-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ShopsUsing = ({
  dbShop,
  data,
  changeData,
  canEdit = false,
  editing = false,
  switchEditMode,
  nextShop
}) => {
  let shopCount = (data && data.length) || 0;
  return (
    <div>
      <div className="media">
        <div className="media-body">
          <span>适用商户</span>
          <span>{'(' + shopCount + ')'}</span>
        </div>
        {data &&
          data.length > 1 && (
            <div className="pl-3" onClick={nextShop}>
              <i className="fa fa-angle-right" />
            </div>
          )}
      </div>
      <div />
    </div>
  );
};

const BuyDetail = ({
  data,
  changeData,
  canEdit = false,
  editing = false,
  switchEditMode
}) => {
  editing = canEdit && editing;
  if (!editing) {
    let uiDatas =
      data &&
      data.map((item, index) => {
        let key = (item && item[0]) || '';
        let value = (item && item[1]) || '';
        return (
          <tr key={index}>
            <td className="text-nowrap">{key}</td>
            <td>{value}</td>
          </tr>
        );
      });
    return (
      <table className="table buyinfo">
        <tbody className="px-1">{uiDatas}</tbody>
      </table>
    );
  }

  let nData = (data && _.clone(data)) || [];
  let updDataInner = (value, index, subIndex) => {
    nData[index][subIndex] = value;
    changeData(nData);
  };
  let addDataInner = value => {
    //evt.preventDefault();
    console.log('addDataInner:', value);
    nData.push(value);
    changeData(nData);
  };
  let delDataInner = index => {
    nData.splice(index, 1);
    changeData(nData);
  };

  let uiDatas =
    data &&
    data.map((item, index) => {
      let key = (item && item[0]) || '';
      let value = (item && item[1]) || '';
      return (
        <div key={index} className="media">
          <button
            type="button"
            className="badge badge-primary"
            onClick={evt => delDataInner(index)}
          >
            <span>删除</span>
          </button>

          <div className="media-body">
            <input
              value={key}
              placeholder="输入左列"
              style={{ width: '38%' }}
              onChange={evt => updDataInner(evt.target.value, index, 0)}
            />
            <input
              value={value}
              placeholder="输入右列"
              style={{ width: '60%' }}
              onChange={evt => updDataInner(evt.target.value, index, 1)}
            />
          </div>
        </div>
      );
    });
  return (
    <div>
      {uiDatas}
      <div>
        <button
          type="button"
          className="badge badge-primary"
          onClick={evt => addDataInner(['', ''])}
        >
          <span>增加一行</span>
        </button>
      </div>
    </div>
  );
};

const CountDown = ({ xTimeCount, finish }) => {
  if (!finish) {
    return null;
  }

  let now = new Date();
  let finishDate = new Date(finish);

  let diff = finishDate.getTime() - now.getTime();
  let duration = moment.duration(diff);
  let hours = parseInt(duration.asHours());
  let strHours = hours < 10 ? '0' + hours : hours;
  let strMinutes =
    duration.minutes() < 10 ? '0' + duration.minutes() : duration.minutes();
  let strSeconds =
    duration.seconds() < 10 ? '0' + duration.seconds() : duration.seconds();

  return (
    <span>
      <span className="pr-1 small">
        <span>秒杀倒计时 </span>
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

const Price = ({ priceOld, priceNew, seckillEnd = null }) => {
  let strNew = getNicePriceFromCent(priceNew);
  let strOld = getNicePriceFromCent(priceOld);
  console.log(
    'priceOld:',
    priceOld,
    ', priceNew:',
    priceNew,
    ',seckillEnd:',
    seckillEnd
  );
  return (
    <span>
      <div>
        {strNew && (
          <span className="text-dp-pink">
            <span className="small">￥</span>
            <span className="h5">{strNew}</span>
          </span>
        )}
        {strOld && (
          <span
            className="text-secondary small"
            style={{ textDecoration: 'line-through' }}
          >
            {'￥' + strOld}
          </span>
        )}
      </div>
      <div className="text-dp-pink">
        {seckillEnd && <TimelyCountDown finish={seckillEnd} />}
      </div>
    </span>
  );
};

export class Page extends React.Component {
  constructor() {
    super();
    this.saveProduct = this.saveProduct.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.nextShop = this.nextShop.bind(this);
    this.initFetchData = this.initFetchData.bind(this);
  }
  state = {
    shopId: null,
    position: null,
    dlg: {
      isOpen: false,
      content: null,
      errMsg: null,
      func: null
    },
    product: null,
    editing: null
  };

  componentDidMount() {
    let { match } = this.props;
    let id = match.params && match.params.id;
    this.initFetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    let { match: oldMatch } = this.props;
    let oldId = oldMatch && oldMatch.params && oldMatch.params.id;
    let { match: newMatch } = nextProps;
    let newId = newMatch && newMatch.params && newMatch.params.id;
    if (oldId !== newId) {
      console.log('me change, we need refetch shops!');
      this.initFetchData(nextProps);
    }
  }

  async initFetchData(props) {
    let {
      match,
      dbProduct,
      getProduct,
      dbShop,
      retrieveShops,
      dbSeckill,
      retrieveSeckills
    } = props;
    let id = match.params && match.params.id;

    // get product.
    let item = dbProduct && dbProduct[id];
    if (!item) {
      try {
        item = await getProduct(id);
        xdebug('initFetchData getProduct: ', item);
      } catch (error) {
        return false;
      }
    }
    if (!item) {
      console.log('error! no product found! id=' + id);
      return false;
    }

    // get seckill
    let seckills = await retrieveSeckills('productId=' + id);
    let seckill = seckills && seckills.data && seckills.data[0];

    this.setState({ product: item, seckill });

    // get shops needed.
    let action = match.params && match.params.action;
    let qsShops = null;
    if (action == 'edit') {
      qsShops = 'owner=' + item.owner;
    } else {
      let notRetrievedShops =
        item.shops &&
        item.shops.reduce((result, shopId) => {
          if (dbShop[shopId]) return result;
          else return result.concat(shopId);
        }, []);
      if (notRetrievedShops && notRetrievedShops.length > 0) {
        qsShops =
          notRetrievedShops &&
          notRetrievedShops.reduce((result, shopId) => {
            return result + 'id[]=' + shopId + ';';
          }, '');
      }
    }
    if (qsShops) {
      try {
        let items = await retrieveShops(qsShops);
        xdebug('initFetchData retrieveShops:', items);
      } catch (error) {
        return false;
      }
    }
    return true;
  }

  saveProduct() {
    let { updateProduct, push, match } = this.props;
    let id = match.params.id;
    let { product } = this.state;
    updateProduct(id, product).then(ret => {
      if (ret) {
        push('/mine/products');
      }
    });
  }

  createOrder(price) {
    let { match, dbShop, dbProduct, createOrder, push } = this.props;
    let { shopId, seckill } = this.state;
    let id = match && match.params && match.params.id;
    if (!shopId) {
      let product = dbProduct && dbProduct[id];
      shopId = product && product.shops && product.shops[0];
    }
    let seckillId = seckill && seckill.id;
    let args = {
      productId: id,
      shopId,
      seckillId,
      price,
      feeIndex: 0
      // desc: {
      //   product,
      //   shop
      // }
    };
    createOrder(args)
      .then(ret => {
        console.log('create:', ret);
        let orderId = ret.id;
        push('/app/order/' + ret.id);
        //let orderUrl = getRedirectOrderUrl(orderId);
        //window.location.href = orderUrl;
      })
      .catch(error => {
        this.setState({
          dlg: {
            isOpen: true,
            content: null,
            errMsg: '创建订单失败！ ' + error.message,
            func: () =>
              this.setState({
                dlg: { isOpen: false, content: null, func: null }
              })
          }
        });
        console.log('create fail:', error);
      });
  }

  nextShop() {
    let { match, dbShop, dbProduct } = this.props;
    let id = match.params && match.params.id;
    let product = dbProduct && dbProduct[id];
    if (!product) {
      return;
    }

    let { shopId } = this.state;
    let nextShopId = shopId;

    let { shops } = product;
    let shopCount = (shops && shops.length) || 0;
    if (shopCount > 0) {
      let shopIndex = 0;
      if (shopId) {
        for (let i = 0; i < shopCount; i++) {
          if (shops[i] == shopId) {
            shopIndex = i;
            break;
          }
        }
      }
      shopIndex = (shopIndex + 1) % shopCount;
      nextShopId = shops[shopIndex];
    }
    if (nextShopId != shopId) {
      this.setState({ shopId: nextShopId });
    }
  }

  getRightPrice(prices, priceIndex = 0, seckill = null) {
    if (!prices) return {};
    let priceCount = prices.length;
    if (priceIndex < 0 || priceIndex >= priceCount) {
      xdebug(
        'error! wrong priceIndex=' +
          priceCount +
          ', not in[0,' +
          priceCount +
          ')'
      );
      return {};
    }

    // let isMultiPrice = false;
    // if (type == '比赛') {
    //   isMultiPrice = true;
    // }

    let { price: priceNew, past: priceOld, name: priceName } =
      (prices && prices[priceIndex]) || {};
    //let priceSeckill = null;
    let seckillEnd = null;
    if (seckill) {
      let { start, end, price } = seckill;
      start = start && new Date(start);
      end = end && new Date(end);
      if (start && end) {
        let now = new Date();
        if (now >= start && now < end) {
          seckillEnd = end;
          //priceSeckill = price;
          priceOld = priceNew;
          priceNew = price;
        }
      }
    }
    return { priceNew, priceOld, priceName, seckillEnd };
  }

  renderCourse() {
    let { match, dbShop, position } = this.props;
    let { shopId, product, seckill, editing } = this.state;

    if (!shopId) {
      shopId = product && product.shops && product.shops[0];
    }
    let shop = dbShop && shopId && dbShop[shopId];

    let {
      status,
      name,
      owner,
      category,
      type = '无',
      desc,
      extend,
      shops,
      total,
      paid,
      prices
    } = product;
    let {
      feature,
      highlight,
      courseUser,
      courseTarget,
      courseRemark,
      buyDetail
    } =
      desc || {};
    let { images, videos } = extend || {};
    let shopCount = (shops && shops.length) || 0;
    let strPaid = (paid && '已售' + paid) || '';

    let { priceNew, priceOld, priceName, seckillEnd } = this.getRightPrice(
      prices,
      0,
      seckill
    );

    let updateProduct = kvmap => {
      let nProduct = { ...product, ...kvmap };
      this.setState({ product: nProduct });
    };
    let updateProductDesc = kvmap => {
      let nDesc = { ...desc, ...kvmap };
      let nProduct = { ...product, desc: nDesc };
      this.setState({ product: nProduct });
    };

    let canEdit =
      (match.params && match.params.action && match.params.action == 'edit') ||
      false;
    const amEditing = what => editing == what && canEdit;
    const setEditing = what => this.setState({ editing: what });
    const toggleEditing = what => {
      console.log('toggle:', what, this.state.editing);
      if (what == this.state.editing) this.setState({ editing: null });
      else this.setState({ editing: what });
    };

    return (
      <div>
        <div style={{ overflow: 'hidden' }}>
          <BannerCarousel data={images} />
        </div>
        <div className="m-2">
          <div className="media align-items-center">
            <div
              className="media-body media pr-2 mr-2"
              style={{ borderRight: '1px solid #ddd' }}
            >
              <div className="media-body font-weight-bold position-relative">
                <EditSwitch
                  canEdit={canEdit}
                  editing={amEditing('name')}
                  style={{ top: -10 }}
                  onClick={() => toggleEditing('name')}
                />
                {canEdit &&
                  amEditing('name') && (
                    <input
                      value={name}
                      placeholder="输入商品名称"
                      onChange={evt =>
                        updateProduct({ name: evt.target.value })
                      }
                    />
                  )}
                {(!canEdit || !amEditing('name')) && name}
              </div>
              <div className="small text-secondary">{strPaid}</div>
            </div>
            <div className="text-center text-secondary px-2">
              <i className="fa fa-star-o d-block" />
              <span className="d-block small">收藏(暂未开放)</span>
            </div>
          </div>
        </div>
        <Gap width={1} />
        {/*<Feature />*/}
        <Gap width={1} />
        <div className="py-2">
          <EditSwitch
            canEdit={canEdit}
            editing={amEditing('highlight')}
            style={{ right: 10 }}
            onClick={() => toggleEditing('highlight')}
          />
          <div className="course-highlight-tag">亮点</div>
          <div className="p-2 px-4 small">
            <TextListEditor
              data={highlight}
              changeData={data => updateProductDesc({ highlight: data })}
              canEdit={canEdit}
              editing={amEditing('highlight')}
            />
          </div>
        </div>
        <Gap width={10} />
        <div>
          <div className="p-2">
            <ShopsUsing
              dbShop={dbShop}
              data={shops}
              changeData={null}
              canEdit={false}
              editing={false}
              switchEditMode={() => toggleEditing('highlight')}
              nextShop={this.nextShop}
            />
          </div>
          <Gap width={1} />
          <ShopInfo data={shop} position={position} />
        </div>
        <Gap width={10} />
        <div className="small">
          <div className="p-2">
            <span>课程详情</span>
          </div>
          <Gap width={1} />
          <div className="p-2">
            <div>
              <span
                className="pl-2 font-weight-bold"
                style={{ borderLeft: '3px solid #dc3545' }}
              >
                使用对象
              </span>
              <EditSwitch
                canEdit={canEdit}
                style={{ right: 10 }}
                editing={amEditing('courseUser')}
                onClick={() => toggleEditing('courseUser')}
              />
            </div>
            <div className="px-4 small">
              <TextListEditor
                data={courseUser}
                changeData={data => updateProductDesc({ courseUser: data })}
                canEdit={canEdit}
                editing={amEditing('courseUser')}
              />
            </div>
          </div>
          <Gap width={1} />
          <div className="p-2">
            <div>
              <span
                className="pl-2 font-weight-bold"
                style={{ borderLeft: '3px solid #dc3545' }}
              >
                学习目标
              </span>
              <EditSwitch
                canEdit={canEdit}
                style={{ right: 10 }}
                editing={amEditing('courseTarget')}
                onClick={() => toggleEditing('courseTarget')}
              />
            </div>
            <div className="px-4 small">
              <TextListEditor
                data={courseTarget}
                changeData={data => updateProductDesc({ courseTarget: data })}
                canEdit={canEdit}
                editing={amEditing('courseTarget')}
              />
            </div>
          </div>
          <Gap width={1} />
          <div className="p-2">
            <div>
              <span
                className="pl-2 font-weight-bold"
                style={{ borderLeft: '3px solid #dc3545' }}
              >
                课程特色
              </span>
              <EditSwitch
                canEdit={canEdit}
                style={{ right: 10 }}
                editing={amEditing('courseRemark')}
                onClick={() => toggleEditing('courseRemark')}
              />
            </div>
            <div className="px-4 small">
              <TextListEditor
                data={courseRemark}
                changeData={data => updateProductDesc({ courseRemark: data })}
                canEdit={canEdit}
                editing={amEditing('courseRemark')}
              />
            </div>
          </div>
        </div>
        <Gap width={10} />
        <div className="small">
          <div className="p-2">
            <EditSwitch
              canEdit={canEdit}
              style={{ right: 10 }}
              editing={amEditing('buyDetail')}
              onClick={() => toggleEditing('buyDetail')}
            />
            <span>购买说明</span>
          </div>
          <div className="px-2">
            <BuyDetail
              data={buyDetail}
              changeData={data => updateProductDesc({ buyDetail: data })}
              canEdit={canEdit}
              editing={amEditing('buyDetail')}
              switchEditMode={() => toggleEditing('buyDetail')}
            />
          </div>
        </div>

        <div style={{ height: 60 }} />
        <div className="fixed-bottom bg-white">
          <nav className="navbar navbar-default media align-items-center">
            <div className="media-body position-relative">
              <Price
                priceOld={priceOld}
                priceNew={priceNew}
                seckillEnd={seckillEnd}
              />
            </div>
            {!canEdit && (
              <div
                className="btn justify-content-center bg-dp-pink text-center"
                onClick={() => this.createOrder(priceNew)}
              >
                <span className="h6 text-white">立即购买</span>
              </div>
            )}
            {canEdit && (
              <div
                className="btn justify-content-center bg-dp-pink text-center"
                onClick={this.saveProduct}
              >
                <span className="h6 text-white">保存</span>
              </div>
            )}
          </nav>
        </div>
      </div>
    );
  }

  renderNormalProduct() {
    let { match, dbShop, position } = this.props;
    let { shopId, product, seckill, editing } = this.state;

    if (!shopId) {
      shopId = product && product.shops && product.shops[0];
    }
    let shop = dbShop && shopId && dbShop[shopId];

    let {
      status,
      name,
      owner,
      category,
      type = '无',
      desc,
      extend,
      shops,
      total,
      paid,
      prices
    } = product;
    let { content } = desc || {};
    let { images, videos } = extend || {};
    let shopCount = (shops && shops.length) || 0;
    let strPaid = (paid && '已售' + paid) || '';

    let { priceNew, priceOld, priceName, seckillEnd } = this.getRightPrice(
      prices,
      0,
      seckill
    );

    let uiImages =
      images &&
      images.map((item, index) => {
        let url = item && item.url;
        if (url) {
          return (
            <div key={index}>
              <img className="img-fluid" src={url} />
            </div>
          );
        } else {
          return null;
        }
      });

    return (
      <div>
        <div className="m-2">
          <div className="media align-items-center">
            <div
              className="media-body media pr-2 mr-2"
              style={{ borderRight: '1px solid #ddd' }}
            >
              <div className="media-body font-weight-bold position-relative">
                {name}
              </div>
              <div className="small text-secondary">{strPaid}</div>
            </div>
            <div className="text-center text-secondary px-2">
              <i className="fa fa-star-o d-block" />
              <span className="d-block small">收藏(暂未开放)</span>
            </div>
          </div>
        </div>
        <Gap width={5} />
        <div>
          <div className="p-2">
            <ShopsUsing
              dbShop={dbShop}
              data={shops}
              changeData={null}
              canEdit={false}
              editing={false}
              nextShop={this.nextShop}
            />
          </div>
          <Gap width={1} />
          <ShopInfo data={shop} position={position} />
        </div>
        <Gap width={10} />
        <div>{uiImages}</div>
        <Gap width={10} />
        <div style={{ height: 60 }} />
        <div className="fixed-bottom bg-white">
          <nav className="navbar navbar-default media align-items-center">
            <div className="media-body position-relative">
              <Price
                priceOld={priceOld}
                priceNew={priceNew}
                seckillEnd={seckillEnd}
              />
            </div>
            <div
              className="btn justify-content-center bg-dp-pink text-center"
              onClick={() => this.createOrder(priceNew)}
            >
              <span className="h6 text-white">立即购买</span>
            </div>
          </nav>
        </div>
      </div>
    );
  }

  render() {
    console.log('render() ', this.props, this.state);

    let { product } = this.state;

    if (!product) {
      return <div>正在加载产品信息...</div>;
    }

    let { type } = product;

    let uiProduct = null;
    if (type == '课程' || type == '试听课' || type == '活动') {
      uiProduct = this.renderCourse();
    } else if (type == '商品') {
      uiProduct = this.renderNormalProduct();
    } else {
      uiProduct = this.renderNormalProduct();
    }

    return (
      <div className="product bg-white">
        {uiProduct}
        <ConfirmModal
          isOpen={this.state.dlg.isOpen}
          title={this.state.dlg.title}
          content={this.state.dlg.content}
          errMsg={this.state.dlg.errMsg}
          onRequestClose={() =>
            this.setState({
              dlg: { isOpen: false, content: null, func: null }
            })
          }
          func={this.state.dlg.func}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  me: meSelect(state, props),
  position: positionSelect(state),
  dbShop: dbShopSelect(state),
  dbProduct: dbProductSelect(state),
  dbSeckill: dbSeckillSelect(state),
  dataSeckillRetrieve: dataSeckillRetrieveSelect(state)
});
const mapActionsToProps = {
  push,
  retrieveShops,
  getProduct,
  updateProduct,
  createOrder,
  retrieveSeckills
};
export default connect(mapStateToProps, mapActionsToProps)(Page);
