import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, goBack } from 'react-router-redux';

import withScrollDetect from 'components/hoc/withScrollDetect';
import Gap, { VerticalGap } from 'components/widgets/Gap';
import { MenuItem, GoBackItem } from 'components/widgets/Menu';
import ConfirmModal from 'components/widgets/ModalConfirm';
import ProductListItem from 'components/dianping/ProductListItem';

import {
  keyRetrieveResult,
  keyRetrieveInfo,
  keyRetrieveItems
} from 'modules/u_key';
import hasCaps from 'utils/caps';
import { meSelect } from 'selectors/user';
import {
  PRODUCT_STATUS_DRAFT,
  PRODUCT_STATUS_CHECKING,
  PRODUCT_STATUS_PUBLISHED,
  PRODUCT_STATUS_CHECKFAIL,
  PRODUCT_STATUS_CLOSED,
  PRODUCT_STATUS_FINISH
} from 'modules/const';
import {
  retrieve as retrieveProducts,
  create as createProduct,
  remove as removeProduct,
  update as updateProduct,
  get as getProduct
} from 'modules/product';
import { dbSelect, retrieveSelect } from 'selectors/product';
import {
  retrieve as retrieveSeckills,
  create as createSeckill,
  remove as removeSeckill,
  update as updateSeckill,
  get as getSeckill
} from 'modules/seckill';
import {
  dbSelect as dbSeckillSelect,
  retrieveSelect as dataSeckillRetrieveSelect
} from 'selectors/seckill';
import { sleep } from 'utils/sleep';
let xdebug = window.myDebug('app:mine:productlist');

class FilterView extends React.Component {
  constructor() {
    super();
  }
  state = {
    data: null
  };
  componentDidMount() {
    let { data } = this.props;
    this.setState({ data });
  }

  render() {
    let { onChange } = this.props;
    let { data } = this.state;
    data = data || {};
    let { type } = data || {};
    type = type || '';
    const setData = updated => {
      let nData = { ...data, ...(updated || {}) };
      this.setState({ data: nData });
      onChange && onChange(nData);
    };

    return (
      <div>
        <div>
          <span>商品类型：</span>
          <select
            className="custom-select display-inline-block"
            value={type}
            onChange={evt => setData({ type: evt.target.value })}
          >
            <option value="">全部</option>
            <option value="课程">精品课程</option>
            <option value="商品">普通商品</option>
            <option value="试听课">试听课</option>
          </select>
        </div>
      </div>
    );
  }
}

export class Page extends React.Component {
  constructor() {
    super();
    this.removeProduct = this.removeProduct.bind(this);
    this._closeDlg = this._closeDlg.bind(this);
  }
  state = {
    qs: '',
    qstmp: '',
    errMsg: null,
    filter: null,
    dlg: {
      isOpen: false,
      content: null,
      errMsg: null,
      func: null
    }
  };
  componentDidMount() {
    this._doRetrieve();
  }

  componentWillReceiveProps(nextProps) {
    let currInScrollArea = this.props.xInScrollArea;
    let nextInScrollArea = nextProps.xInScrollArea;
    if (currInScrollArea != nextInScrollArea) {
      if (nextInScrollArea) {
        this.nextPage();
      }
    }
  }
  getQs() {
    let { me } = this.props;
    let isRoot = hasCaps(me, 'root');
    let qsArr = [];
    let qs1 =
      this.props.match && this.props.match.params && this.props.match.params.qs;
    qs1 = qs1 && qs1.trim();
    if (qs1) {
      qsArr.push(qs1);
    } else {
      if (!isRoot) {
        if (me && me.id) qsArr.push('owner=' + me.id);
      }
    }
    // let qs2 = this.state.qs;
    // qs2 = qs2 && qs2.trim();
    // if (qs2) {
    //   qsArr.push('tag=' + qs2);
    // }
    let { filter } = this.state;
    if (filter) {
      if (filter.type) {
        qsArr.push('type=' + filter.type);
      }
    }
    console.log('filter:', filter, qsArr);
    return qsArr.join(';');
  }
  _doRetrieve(page = -1) {
    let {
      retrieveProducts,
      dataSeckillRetrieve,
      retrieveSeckills
    } = this.props;
    let { length } = keyRetrieveInfo(dataSeckillRetrieve, '');
    if (length <= 0) {
      retrieveSeckills('').catch(error => xdebug('retrieveSeckills:', error));
    }

    retrieveProducts(this.getQs(), page)
      .then(ret => {
        console.log('list:', ret);
      })
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  }
  query(filter) {
    this.setState({ filter });
    setTimeout(this._doRetrieve.bind(this), 0);
  }
  nextPage() {
    let { dataProductRetrieve: dataRetrieve } = this.props;
    let key = this.getQs();
    let { total, page, length } = keyRetrieveInfo(dataRetrieve, key);
    if (length >= total) {
      xdebug('already get all data!');
      return;
    }
    return this._doRetrieve(page + 1);
  }

  renderList() {
    let { me, dbProduct, dataProductRetrieve } = this.props;
    let items = keyRetrieveItems(dbProduct, dataProductRetrieve, this.getQs());
    if (!items) {
      return <div>没有数据</div>;
    }

    let uiItems = items.map((item, index) => {
      if (!item) return null;
      let link = '/app/product/' + item.id;
      let ops = this.initOps(item, me);
      return <ProductListItem key={index} data={{ ...item, link }} ops={ops} />;
    });

    return uiItems;
  }

  _closeDlg() {
    this.setState({ dlg: { isOpen: false, content: null, func: null } });
  }

  removeProduct(id) {
    let { removeProduct } = this.props;
    removeProduct(id).then(ret => {
      if (ret) {
        this._closeDlg();
      } else {
        console.log('error! removeProduct!');
      }
    });
  }

  setSeckill(data) {
    if (!data) return null;
    let { getSeckill, updateSeckill, createSeckill } = this.props;
    if (data.id) {
      // update
      updateSeckill(data.id, data).then(ret => {
        getSeckill(data.id);
      });
    } else {
      // create
      createSeckill(data);
    }
  }

  initOps(product, user) {
    if (!product || !product.id || !user || !user.id) {
      // if product == null or user == null, return null!
      //console.log ("error! parameter! product=", product, ", user=", user);
      return null;
    }
    let {
      me,
      push,
      retrieveProducts,
      removeProduct,
      updateProduct,
      getProduct,
      createProduct
    } = this.props;
    let id = product.id;
    let isRoot = hasCaps(user, 'root');
    let isOwner = user.id == product.owner;
    let status = product.status;
    let productType = product.type;

    let fnUpdateProduct = (id, args) => {
      updateProduct(id, args)
        .then(ret => getProduct(id))
        .then(ret =>
          this.setState({ dlg: { isOpen: false, content: null, func: null } })
        )
        .catch(error => {
          this.setState({
            dlg: { ...this.state.dlg, errMsg: error.message }
          });
          console.log('error!', error);
        });
    };
    let fnRemoveProduct = id => {
      removeProduct(id)
        .then(ret =>
          this.setState({ dlg: { isOpen: false, content: null, func: null } })
        )
        .catch(error => {
          this.setState({
            dlg: { ...this.state.dlg, errMsg: error.message }
          });
          console.log('error!', error);
        });
    };
    let fnCreateProduct = item => {
      if (!item) {
        return null;
      }
      let { id, status, paid, reserved1, reserved2, ...info } = item || {};
      createProduct(info)
        .then(ret => {
          let message = '已克隆成功！id=' + ret.id + ', 2秒后刷新！';
          this.setState({
            dlg: { isOpen: true, content: message, func: null }
          });
          return ret;
        })
        .then(() => {
          if (me && me.id) {
            let isRoot = hasCaps(me, 'root');
            if (isRoot) {
              return retrieveProducts('');
            } else {
              return retrieveProducts('owner=' + me.id);
            }
          }
          return null;
        })
        .then(() => {
          console.log('clone 3');
          return sleep(2000);
        })
        .then(() => {
          console.log('clone 4');
          this.setState({ dlg: { isOpen: false, content: null, func: null } });
        })
        .catch(error => {
          console.log('clone 5');
          this.setState({
            dlg: { ...this.state.dlg, errMsg: error.message }
          });
          console.log('error!', error);
        });
    };

    let opOrderList = {
      name: '查看订单列表',
      func: evt => {
        evt.preventDefault();
        push('/mine/orders/query/productId=' + id);
      }
    };

    let opEditBase = {
      name: '编辑基本信息',
      func: evt => {
        evt.preventDefault();
        push('/mine/products/edit/' + id);
      }
    };

    let opEdit = {
      name: '编辑更多信息',
      func: evt => {
        evt.preventDefault();
        push('/mine/products/class/' + id + '/edit');
      }
    };

    let opSeckill = {
      name: '编辑秒杀信息',
      func: evt => {
        evt.preventDefault();
        push('/mine/products/edit/' + id + '/seckill');
      }
    };

    let opDelete = {
      name: '删除',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定要删除吗？',
            errMsg: null,
            func: () => fnRemoveProduct(id)
          }
        });
      }
    };
    let opPublish = {
      name: '发布',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定发布吗？',
            errMsg: null,
            func: () =>
              fnUpdateProduct(id, { status: PRODUCT_STATUS_PUBLISHED })
          }
        });
      }
    };
    let opTakeOff = {
      name: '下架',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确定下架吗？',
            errMsg: null,
            func: () => fnUpdateProduct(id, { status: PRODUCT_STATUS_CLOSED })
          }
        });
      }
    };
    let opRefresh = {
      name: '刷新',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确认刷新吗？',
            errMsg: null,
            func: () =>
              fnUpdateProduct(id, { status: PRODUCT_STATUS_PUBLISHED })
          }
        });
      }
    };
    let opClone = {
      name: '克隆',
      func: evt => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确认克隆吗？',
            errMsg: null,
            func: () => fnCreateProduct(product)
          }
        });
      }
    };
    /*let opRecommend = {
      name: '推荐',
      func: (evt) => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确认推荐吗？',
            errMsg: null,
            func: () => fnUpdateProduct(id, {status:2})
          }
        });
      }
    };
    let opUnrecommend = {
      name: '取消推荐',
      func: (evt) => {
        evt.preventDefault();
        this.setState({
          dlg: {
            isOpen: true,
            content: '确认取消推荐吗？',
            errMsg: null,
            func: () => fnUpdateProduct(id, {status:2})
          }
        });
      }
    };*/

    // [
    //   opEdit,
    //   opDelete,
    //   opPublish,
    //   opTakeOff,
    //   opRefresh,
    //   opRecommend,
    //   opUnrecommend,
    // ];
    let ops = [];
    if (isRoot || isOwner) {
      switch (status) {
        case PRODUCT_STATUS_DRAFT:
          ops = [opDelete, opPublish];
          break;
        case PRODUCT_STATUS_PUBLISHED:
          ops = [opDelete, opTakeOff, opRefresh, opClone];
          break;
        case PRODUCT_STATUS_CLOSED:
          ops = [opDelete, opPublish, opClone];
          break;
        case PRODUCT_STATUS_FINISH:
        default:
          ops = [opDelete];
          break;
      }
      if (isRoot && status == PRODUCT_STATUS_PUBLISHED)
        ops = [opSeckill, ...ops];
      ops = [opOrderList, opEditBase, opEdit, ...ops];
    }
    return ops;
  }

  render() {
    let { match, goBack } = this.props;
    let { filter } = this.state;

    return (
      <div>
        <GoBackItem onClick={goBack} title="商品列表" />
        <MenuItem
          icon="fa fa-file-text-o"
          title="添加商品"
          subtitle="创建新的课程/活动/比赛/考级"
          arrow={true}
          link="/mine/products/create"
        />
        <Gap width={5} />
        <FilterView data={filter} onChange={data => this.query(data)} />
        <Gap width={5} />
        {this.renderList()}
        <ConfirmModal
          isOpen={this.state.dlg.isOpen}
          title={this.state.dlg.title}
          content={this.state.dlg.content}
          errMsg={this.state.dlg.errMsg}
          onRequestClose={this._closeDlg}
          func={this.state.dlg.func}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    me: meSelect(state, props),
    dbProduct: dbSelect(state),
    dataProductRetrieve: retrieveSelect(state),
    dbSeckill: dbSeckillSelect(state),
    dataSeckillRetrieve: dataSeckillRetrieveSelect(state)
  };
};

const mapActionsToProps = {
  push,
  goBack,
  retrieveProducts,
  createProduct,
  removeProduct,
  updateProduct,
  getProduct,
  retrieveSeckills,
  createSeckill,
  updateSeckill,
  getSeckill
};

export default connect(mapStateToProps, mapActionsToProps)(
  withScrollDetect(Page)
);
