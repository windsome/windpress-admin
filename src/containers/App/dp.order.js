import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';
import _ from 'lodash';
import Moment from 'moment';

import Gap from 'components/widgets/Gap';
import { FiveStarSvg } from 'components/widgets/FiveStar';
import { strOrderStatus } from 'components/dianping/OrderListItem';
import { BigButton } from 'components/widgets/Bar';
import ConfirmModal from 'components/widgets/ModalConfirm';

import { get as getOrder, update as updateOrder } from 'modules/order';
import { invokePayment } from 'modules/pay';
import {
  dbSelect as dbOrderSelect,
  getSelect as getOrderSelect
} from 'selectors/order';
import { dbSelect as dbProductSelect } from 'selectors/product';
import { dbSelect as dbShopSelect } from 'selectors/shop';
import { meSelect } from 'selectors/user';
import { urlParams } from 'utils/url';

let xdebug = window.myDebug('app:order:');

export class Page extends React.Component {
  constructor() {
    super();
    this.getId = this.getId.bind(this);
    this.initFetchData = this.initFetchData.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.countDownOrderStatus = this.countDownOrderStatus.bind(this);
  }
  state = {};

  getId() {
    let { match } = this.props;
    let orderId = match && match.params && match.params.id;
    let qs = urlParams(window.location.search);
    return (qs && qs.id) || orderId;
  }

  componentDidMount() {
    this.initFetchData(this.props);
  }

  async initFetchData(props) {
    let { dbOrder, getOrder } = props;
    let id = this.getId();
    let item = id && dbOrder && dbOrder[id];
    if (!item) {
      try {
        item = await getOrder(id);
      } catch (error) {
        this.setState({ errMsg: error.message });
        return false;
      }
    }
    if (!item) {
      xdebug('error! no order found! id=' + id);
      return false;
    }
    return true;
  }

  handlePayment() {
    let { me, dbOrder, invokePayment, push } = this.props;
    let id = this.getId();
    if (!id) {
      this.setState({ errMsg: '没有订单id!' });
      return false;
    }
    let openid = me && me.openid;
    if (!openid || !id) {
      this.setState({
        errMsg: 'can not issue payment! openid=' + openid + ',id=' + id
      });
      return false;
    }

    let order = dbOrder && dbOrder[id];
    if (!order) {
      this.setState({ errMsg: 'can not issue payment! order=null!' });
      return false;
    }

    invokePayment(id)
      .then(ret => {
        xdebug('invokePayment return:', ret);
        if (ret === true) {
          this.setState({
            errMsg: '用户支付成功，等待服务器返回！订单号' + id
          });
        } else {
          this.setState({ errMsg: '支付异常！等待服务器返回！订单号' + id });
        }
        this.countDownOrderStatus(5);
        // can notify links.
      })
      .catch(e => {
        xdebug('pay error:' + e.message);
        this.setState({ errMsg: e.message });
      });
  }

  countDownOrderStatus(countdown) {
    let { dbOrder, getOrder } = this.props;
    let orderId = this.getId();
    this.setState({ errMsg: '等待' + countdown + '秒' });
    getOrder(orderId)
      .then(ret => {
        if (ret.status == 2) {
          this.setState({ errMsg: '支付成功！订单号' + orderId });
        } else {
          if (countdown <= 0) {
            this.setState({ errMsg: '服务器返回超时！订单号' + orderId });
            return;
          } else {
            if (countdown > 0) {
              setTimeout(() => {
                this.countDownOrderStatus(countdown - 1);
              }, 1000);
            }
          }
        }
      })
      .catch(e => {
        this.setState({ errMsg: e.message });
      });
  }

  render() {
    let { dbShop, dbProduct, dbOrder } = this.props;
    let { errMsg } = this.state;
    let id = this.getId();
    if (!id) {
      return <div>{'订单未找到！id=' + id}</div>;
    }
    let order = dbOrder && dbOrder[id];
    if (!order) {
      return <div>加载中...</div>;
    }

    let { status, owner, desc, extend, productId, shopId, fee } = order || {};

    let { shop, product } = desc || {};

    let orderStatus = strOrderStatus(status);
    let shopName = (shop && shop.name) || '未命名店铺';
    let shopLogo =
      (shop && shop.desc && shop.desc.logo) || '/ysj/images/logo2.png';
    let shopLink = '/app/shop/' + shopId;

    let productName = product && product.name;
    let productLink = '/app/product/' + productId;

    fee = new Number(fee / 100).toFixed(2);

    let createdAt = order.createdAt;
    //createdAt = Moment.parseZone(createdAt).format('YYYY-MM-DD HH:mm');
    createdAt = Moment(order.createdAt)
      .utcOffset('+08:00')
      .format('YYYY-MM-DD HH:mm');
    let uuid = order.uuid;

    let showPayButton = status === 0 || status === 1;

    return (
      <div>
        <div className="bg-white text-center">
          <div className="p-2">{shopName}</div>
          <div className="p-2">
            <img style={{ width: 64, height: 64 }} src={shopLogo} />
          </div>
          <div className="p-2">
            <span className="h5">{'总金额：￥' + fee}</span>
          </div>
          <div className="p-2">
            <span className="h5">{orderStatus}</span>
          </div>
          <div>{errMsg}</div>
          {showPayButton && (
            <div>
              <nav className="navbar navbar-default bg-dp-pink text-white">
                <div
                  className="container justify-content-center"
                  onClick={this.handlePayment}
                >
                  <span>确认支付</span>
                </div>
              </nav>
            </div>
          )}
        </div>

        <Gap width={1} />
        <div className="bg-white small p-2">
          <Link className="d-block pd-2" to={shopLink}>
            <div className="media align-items-center">
              <img style={{ width: 32, height: 32 }} src={shopLogo} />
              <div className="pl-2">{shopName}</div>
            </div>
          </Link>
          <Gap width={1} />
          <Link className="d-block pt-2" to={productLink}>
            <div>{productName}</div>
          </Link>
        </div>

        <Gap width={1} />
        <div className="bg-white small">
          <div className="p-2">
            <span>订单信息</span>
          </div>
          <div className="px-2">
            <table className="table buyinfo">
              <tbody className="px-1">
                <tr>
                  <td className="text-nowrap">订单号</td>
                  <td>{uuid}</td>
                </tr>
                <tr>
                  <td className="text-nowrap">支付方式</td>
                  <td>在线支付</td>
                </tr>
                <tr>
                  <td className="text-nowrap">下单时间</td>
                  <td>{createdAt}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  me: meSelect(state, props),
  dbShop: dbShopSelect(state),
  dbProduct: dbProductSelect(state),
  dbOrder: dbOrderSelect(state)
});
const mapActionsToProps = {
  push,
  getOrder,
  updateOrder,
  invokePayment
};
export default connect(mapStateToProps, mapActionsToProps)(Page);
