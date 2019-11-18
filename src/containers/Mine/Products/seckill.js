import React from 'react';
import { connect } from 'react-redux';
import { push, replace, goBack } from 'react-router-redux';
import NumberInput from 'react-number-input';
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import 'flatpickr/dist/themes/material_green.css';

import { MenuItem, GoBackItem } from 'components/widgets/Menu';
import { BigButton } from 'components/widgets/Bar';
import Gap from 'components/widgets/Gap';
import { keyRetrieveResult, keyRetrieveInfo } from 'modules/u_key';
import { get as getProduct } from 'modules/product';
import { dbSelect as dbProductSelect } from 'selectors/product';
import {
  get as getSeckill,
  create as createSeckill,
  update as updateSeckill,
  remove as removeSeckill,
  retrieve as retrieveSeckills
} from 'modules/seckill';
import {
  dbSelect as dbSeckillSelect,
  retrieveSelect as dataSeckillRetrieveSelect
} from 'selectors/seckill';
import { getNicePriceFromCent } from 'utils/price';

export class Page extends React.Component {
  state = {
    //data: {}, // id, productId, start, end(duration), price
    id: null,
    productId: null,
    start: null,
    end: null,
    duration: 7200,
    price: null,
    errMsg: null
  };

  constructor() {
    super();
    this.updateItem = this.updateItem.bind(this);
  }

  componentDidMount() {
    this.initFetchData(this.props);
  }

  async initFetchData(props) {
    try {
      let { dbProduct, dbSeckill, match, getProduct, retrieveSeckills } = props;
      let id = match.params && match.params.id;
      if (!id) {
        this.setState({ errMsg: '参数错误：ID为空' });
        return;
      }

      this.setState({ errMsg: '正在获取数据' });

      let product = dbProduct && dbProduct[id];
      if (!product) {
        product = await getProduct(id);
      }

      if (!product) {
        this.setState({ errMsg: '没有ID=' + id + '的商品' });
        return;
      }

      let seckills = await retrieveSeckills('productId=' + id);
      let seckill = seckills && seckills.data && seckills.data[0];
      if (!seckill) {
        this.setState({ errMsg: '没有找到此商品的秒杀设置' });
        return;
      }
      let duration = parseInt(
        (new Date(seckill.end).getTime() - new Date(seckill.start).getTime()) /
          1000
      );
      this.setState({ ...seckill, duration, errMsg: null });
    } catch (error) {
      this.setState({ errMsg: error.message });
    }
  }

  updateItem = evt => {
    evt.preventDefault();
    let { updateSeckill, createSeckill, push, match } = this.props;
    let { id, productId, start, duration, end, price } = this.state;
    productId = match.params && match.params.id;
    let nEnd =
      start &&
      moment(start)
        .add(duration, 'seconds')
        .toDate();
    console.log('nEnd:', nEnd, ', end:', end);
    end = nEnd || end;

    if (id) {
      // has id, need to update.
      updateSeckill(id, { productId, start, end, price })
        .then(ret => {
          this.setState({ end, price, errMsg: '更新秒杀成功！' });
        })
        .catch(error => {
          this.setState({ errMsg: '失败！' + error.message });
        });
    } else {
      // no id, need to create.
      //console.log('before create:', productId, start, end, price);
      createSeckill({ productId, start, end, price })
        .then(item => {
          //console.log('after create:', item);
          this.setState({ ...item, errMsg: '创建秒杀成功！id=' + item.id });
        })
        .catch(error => {
          this.setState({ errMsg: '失败！' + error.message });
        });
    }
  };

  render() {
    let { goBack, match } = this.props;
    let { id, productId, start, end, duration, price, errMsg } = this.state;
    productId = match.params && match.params.id;
    let nPrice = getNicePriceFromCent(price);
    //console.log('state:', this.state);
    return (
      <div>
        <GoBackItem onClick={goBack} title="设置秒杀" />
        <div>{'关联产品ID：' + productId}</div>
        <div>
          <div className="p-3">
            <span>开始日期：</span>
            <Flatpickr
              data-enable-time
              value={start}
              onChange={(_NOUSE, date) => this.setState({ start: date })}
            />
          </div>
        </div>
        <div>
          <span>秒杀持续时间：</span>
          <select
            className="custom-select"
            value={duration}
            onChange={evt => this.setState({ duration: evt.target.value })}
          >
            <option value="7200">2小时</option>
            <option value="21600">6小时</option>
            <option value="86400">1天</option>
            <option value="172800">2天</option>
          </select>
        </div>
        <div>
          <span>秒杀价格：</span>
          <NumberInput
            className="form-input"
            type="text" // optional, input[type]. Defaults to "tel" to allow non numeric characters
            onChange={value => this.setState({ price: parseInt(value * 100) })} // function (value: number | null, event: Event)
            value={nPrice || ''} // normal react input binding
            placeholder="秒杀价" // all other input properties are supported
            format="0,0[.]00" // optional, numbro.js format string. Defaults to "0,0[.][00]"
          />
        </div>

        {errMsg && (
          <div className="text-danger text-left">
            <span>{errMsg}</span>
          </div>
        )}
        <BigButton onClick={this.updateItem} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dbProduct: dbProductSelect(state),
  dbSeckill: dbSeckillSelect(state),
  dataSeckillRetrieve: dataSeckillRetrieveSelect(state)
});

const mapActionsToProps = {
  push,
  goBack,
  getProduct,
  getSeckill,
  createSeckill,
  updateSeckill,
  removeSeckill,
  retrieveSeckills
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
