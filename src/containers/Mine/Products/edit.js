import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push, replace, goBack } from 'react-router-redux';
import isNaN from 'lodash/isNaN';
import union from 'lodash/union';

import { MenuItem, GoBackItem } from 'components/widgets/Menu';
import { BigButton } from 'components/widgets/Bar';
import { ImageUploaderV2 } from 'components/widgets/FileInput';
import ImageClosable from 'components/widgets/ImageClosable';
import Gap from 'components/widgets/Gap';
import { FormInput, FormTextarea } from 'components/widgets/FormInput';
import CategoryList from 'components/widgets/CategoryList';
import { IconText } from 'components/dianping/IconText';
import { InputIconLeft } from 'components/dianping/IconInput';
import { PriceOne, PriceMulti } from 'components/widgets/PriceInput';

import { keyRetrieveResult, keyRetrieveInfo } from 'modules/u_key';
import { SHOP_STATUS_PUBLISHED } from 'modules/const';
import { meSelect } from 'selectors/user';
import { update as updateProduct, get as getProduct } from 'modules/product';
import {
  dbSelect as dbProductSelect,
  updateSelect as productUpdateSelect
} from 'selectors/product';
import { retrieve as retrieveShops } from 'modules/shop';
import {
  dbSelect as dbShopSelect,
  retrieveSelect as shopRetrieveSelect
} from 'selectors/shop';

import './edit.css';
import { retrieve } from 'modules/shop';

export class Page extends React.Component {
  state = {
    status: null,
    name: null,
    owner: null,
    category: null,
    type: null,
    desc: {
      content: null
    },
    extend: {
      offline: null,
      images: null,
      videos: null
    },
    shops: null,
    total: null,
    paid: null,
    prices: null,

    isOpenTagModal: false,
    isOpenMapModal: false,
    errMsg: null
  };

  constructor() {
    super();
    this.updateItem = this.updateItem.bind(this);
  }

  componentDidMount() {
    let { match } = this.props;
    let id = match.params && match.params.id;
    this.initFetchData(id);
  }

  // componentWillReceiveProps(nextProps) {
  //   let { match: oldMatch } = this.props;
  //   let oldId = oldMatch && oldMatch.params && oldMatch.params.id;
  //   let { match: newMatch } = nextProps;
  //   let newId = newMatch && newMatch.params && newMatch.params.id;
  //   if (oldId !== newId) {
  //     console.log('me change, we need refetch shops!');
  //     this.initFetchData(newId);
  //   }
  // }
  // getShopQs() {
  //   let { match, db } = this.props;
  //   let id = match && match.params && match.params.id;
  //   let item = db && db[id];
  //   let owner = item && item.owner;
  //   if (owner) {
  //     return 'owner=' + owner + ';status=' + SHOP_STATUS_PUBLISHED;
  //   }
  //   return null;
  // }
  getShopQs() {
    let { match, dbShop, me } = this.props;
    if (!me) return null;
    let { shopsOwn, shopsManage } = me;
    let shopIdArray = union(shopsOwn, shopsManage);
    let qsArr =
      (shopIdArray &&
        shopIdArray.length > 0 &&
        shopIdArray.map(shopId => {
          return 'id[$in][]=' + shopId;
        })) ||
      null;
    return qsArr && qsArr.join(';');
  }

  async initFetchData(id) {
    let { db, getProduct, retrieveShops } = this.props;
    let item = db && db[id];
    if (!item) {
      let ret = await getProduct(id);
      item = this.props.db && this.props.db[id];
    }
    if (item) {
      this.setState({ ...item });
      let qs = this.getShopQs();
      if (qs) {
        await retrieveShops(qs);
      }
    }
  }

  updateItem = evt => {
    evt.preventDefault();
    let {
      updateProduct,
      getProduct,
      push,
      replace,
      goBack,
      match
    } = this.props;
    let id = match.params.id;

    let {
      isOpenTagModal,
      isOpenMapModal,
      errMsg,
      type,
      category,
      prices,
      ...item
    } = this.state;
    let { desc, extend, total } = item || {};
    let { images, videos } = extend || {};

    let nextImages =
      images &&
      images.map((item, index) => {
        return { url: item.url };
      });
    let nextVideos =
      videos &&
      videos.map((item, index) => {
        return { url: item.url };
      });

    total = parseInt(total);
    if (isNaN(total)) {
      this.setState({ errMsg: '商品总量必须为整数' });
      return;
    }
    if (total < 0) {
      this.setState({ errMsg: '商品总量必须大于0' });
      return;
    }

    let nextPrices = null;
    if (prices) {
      nextPrices = [];
      for (let i = 0; i < prices.length; i++) {
        let item = prices[i] || {};
        let price = item.price && parseInt(item.price);
        let name = item.name || '';
        if (isNaN(price)) {
          this.setState({ errMsg: '价格错误，必须是一个整数' });
          return;
        }
        if (item.hasOwnProperty('past')) {
          let past = (item.past && parseInt(item.past)) || 0;
          nextPrices.push({ price, past, name });
        } else {
          nextPrices.push({ price, name });
        }
      }
    }

    let nextItem = {
      ...item,
      total,
      extend: { ...extend, images: nextImages, videos: nextVideos },
      prices: nextPrices
    };

    console.log('updateItem:', nextItem);
    updateProduct(id, nextItem)
      .then(ret => getProduct(id))
      .then(ret => {
        if (ret) {
          if (
            ret.type == '课程' ||
            ret.type == '试听课' ||
            ret.type == '活动'
          ) {
            replace('/mine/products/class/' + id + '/edit');
          } else if (ret.type == '商品') {
            goBack();
          } else {
            goBack();
          }
        }
      })
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  };

  renderShopList() {
    let { dbShop, dataShopRetrieve } = this.props;
    let { shops } = this.state;
    if (!dbShop) return null;

    let key = this.getShopQs();
    if (!key) return null;

    let items = keyRetrieveResult(dataShopRetrieve, key);

    shops = shops || [];
    let uiItems =
      items &&
      items.map((itemId, index) => {
        let item = dbShop[itemId];
        if (!item) return null;
        if (shops.indexOf(item.id) === -1) {
          // not exist, need to add.
          return (
            <span key={index} className="mr-1">
              <IconText
                name={item.name}
                textFunc={() => this.setState({ shops: [...shops, item.id] })}
              />
            </span>
          );
        } else {
          // exist, need to remove.
          let nextShops = shops.reduce((result, id) => {
            if (id == item.id) return result;
            else return result.concat(id);
          }, []);
          return (
            <span key={index} className="mr-1">
              <IconText
                name={item.name}
                iconBack="fa fa-check"
                iconBackFunc={() => this.setState({ shops: nextShops })}
                textFunc={() => this.setState({ shops: nextShops })}
              />
            </span>
          );
        }
      });
    return uiItems;
  }

  uploadImages(imgList) {
    let { extend } = this.state;
    let { images } = extend || {};
    let nImages = (images && images.slice(0)) || [];
    nImages = nImages.concat(imgList);
    console.log('nImages:', nImages, imgList);
    this.setState({ extend: { ...extend, images: nImages } });
  }

  removeImageIndex(index) {
    let { extend } = this.state;
    let { images } = extend || {};
    let nImages = (images && images.slice(0)) || [];
    nImages.splice(index, 1);
    console.log('removeImageIndex:', index, nImages, images);
    this.setState({ extend: { ...extend, images: nImages } });
  }

  render() {
    let { push, goBack } = this.props;
    let {
      isOpenTagModal,
      isOpenMapModal,
      errMsg,
      name,
      category,
      type,
      desc,
      total,
      extend,
      prices
    } = this.state;
    let { content } = desc || {};
    let { images, videos } = extend || {};
    type = type || '无';
    let isMultiPrice = false;
    if (type == '比赛') {
      isMultiPrice = true;
    }
    let showPrice = true;
    let submitTitle = '下一步 编辑详细信息';

    let uiImages =
      images &&
      images.map((image, index) => {
        if (!image) return null;
        let src = image.src || image.url;
        return (
          <div
            key={index}
            className="col-4 col-sm-2 p-1"
            style={{ paddingBottom: '100%' }}
          >
            <ImageClosable
              src={src}
              onClose={() => this.removeImageIndex(index)}
            />
          </div>
        );
      });

    //console.log('render()', this.state, this.props);
    return (
      <div>
        <GoBackItem onClick={goBack} title="编辑商品" />
        <CategoryList data={category} />
        <div className="p-3 bg-white">{'商品模板：' + type}</div>
        <Gap width={1} />
        <div className="p-3 bg-white">
          <small className="d-block">适用门店（可多选）</small>
          {this.renderShopList()}
        </div>
        <Gap width={1} />
        <div>
          <FormInput
            placeholder="标题 品类品牌型号都是买家喜欢搜索的"
            value={name}
            onChange={evt => this.setState({ name: evt.target.value })}
          />
        </div>
        {/*<Gap width={1} />
        <div>
          <FormTextarea
            placeholder="描述一下商品的细节或故事"
            value={content}
            onChange={evt =>
              this.setState({
                desc: { ...this.state.desc, content: evt.target.value }
              })}
          />
            </div>*/}
        <Gap width={3} />
        <MenuItem
          icon={null}
          title="商品图片"
          subtitle=""
          subicon="fa fa-angle-down"
        />
        <div className="py-1">
          <span
            className="align-middle mx-1 bg-dark"
            style={{ width: 100, height: 30, display: 'inline-block' }}
          >
            <ImageUploaderV2
              count={9}
              onUpload={this.uploadImages.bind(this)}
            />
          </span>
        </div>
        <div className="container-fluid jumbotron-fluid">
          <div className="row no-gutters">{uiImages}</div>
        </div>
        {showPrice && (
          <div className="media px-3 py-1 align-items-center">
            <span>价格</span>
            <div className="media-body m-2">
              {!isMultiPrice && (
                <PriceOne
                  prices={prices}
                  update={data => this.setState({ prices: data })}
                />
              )}
              {isMultiPrice && (
                <PriceMulti
                  prices={prices}
                  update={data => this.setState({ prices: data })}
                />
              )}
            </div>
          </div>
        )}
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">商品总数量</span>
          </div>
          <input
            type="text"
            className="form-control"
            value={total}
            onChange={evt => this.setState({ total: evt.target.value })}
          />
        </div>

        <div className="text-danger">{errMsg}</div>
        <div>
          <BigButton title={submitTitle} onClick={this.updateItem} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  me: meSelect(state),
  db: dbProductSelect(state),
  dbShop: dbShopSelect(state),
  dataUpdate: productUpdateSelect(state),
  dataShopRetrieve: shopRetrieveSelect(state)
});

const mapActionsToProps = {
  push,
  replace,
  goBack,
  updateProduct,
  getProduct,
  retrieveShops
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
