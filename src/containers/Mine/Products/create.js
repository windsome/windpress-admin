import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';
import isArray from 'lodash/isArray';

import { MenuItem, GoBackItem } from 'components/widgets/Menu';
import FileInput from 'components/widgets/FileInput';
import Select, { SelectInline } from 'components/widgets/Select';
import CategoryList from 'components/widgets/CategoryList';
import { IconText } from 'components/dianping/IconText';

import { create as createProduct } from 'modules/product';
import { dbSelect, createSelect } from 'selectors/product';
import { category as fetchCategory } from 'modules/setting';
import { categoryDataSelect } from 'selectors/setting';

const CategoryListEditor = ({
  current,
  categories,
  changable = false,
  changeValue = null
}) => {
  let uis = (current &&
    isArray(current) &&
    current.map((item, index) => {
      let value = current.slice(0, index);
      return (
        <li key={index} className="breadcrumb-item">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => changeValue(value)}
          >
            {item}
          </button>
        </li>
      );
    })) || <li className="breadcrumb-item">{current}</li>;

  const onChange = evt => {
    current = current || [];
    console.log('onChange:', evt, evt.target.value);
    changeValue && changeValue([...current, evt.target.value]);
  };
  return (
    <nav>
      <ol className="breadcrumb">
        {uis}
        <li className="breadcrumb-item">
          <SelectInline all={categories} value={'无'} onChange={onChange} />
        </li>
      </ol>
    </nav>
  );
};

export class Page extends React.Component {
  state = {
    category: [],
    errMsg: null
  };
  constructor() {
    super();
    this.createItem = this.createItem.bind(this);
  }

  componentDidMount() {
    let { dataCategory, fetchCategory } = this.props;
    if (!dataCategory) {
      fetchCategory();
    }
  }
  createItem = (evt, type) => {
    evt.preventDefault();
    let { replace, createProduct, match } = this.props;
    let { category } = this.state;
    let args = { category, type };
    // let shopId = match && match.params && match.params.shopId;
    // if (shopId) {
    //   args = { ...args, shop: [shopId] };
    // }
    createProduct(args)
      .then(ret => {
        console.log('ret:', ret);
        replace('/mine/products/edit/' + ret.id);
      })
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  };

  findCategoryNode(rootNode, current) {
    if (!rootNode) {
      console.log('error! parameter error!', rootNode);
      return null;
    }
    if (!current || current.length <= 0) {
      console.log('current is null! return rootNode');
      return rootNode;
    }
    let findNode = null;
    let currNode = rootNode;
    for (let i = 0; currNode != null && i < current.length; i++) {
      let currName = current[i];
      let children = (currNode && currNode.children) || [];
      findNode = null;
      for (let j = 0; j < children.length; j++) {
        if (children[j].name === currName) {
          findNode = children[j];
          break;
        }
      }
      currNode = findNode;
    }
    if (!findNode) {
      console.log('warning! findNode null! some error!', rootNode, current);
    }
    return findNode;
  }
  render() {
    let {
      match,
      push,
      goBack,
      createProduct,
      dataCreate,
      dataCategory
    } = this.props;
    let { category, errMsg } = this.state;
    let { desc } = dataCategory || {};

    let rootNode = { name: '', alias: 'root', children: desc };
    let currNode = this.findCategoryNode(rootNode, category);
    let categories =
      (currNode &&
        currNode.children &&
        currNode.children.map(item => {
          return { name: item.name, value: item.name };
        })) ||
      [];
    categories = [{ name: '无', value: '无' }, ...categories];
    console.log('categories:', categories);

    /*let allCategory = [
      { name: '无', value: '无' },
      { name: '课程', value: '课程' },
      { name: '试听课', value: '试听课' },
      { name: '试听课', value: '试听课' },
      { name: '活动', value: '活动' },
      { name: '比赛', value: '比赛' },
      { name: '考级', value: '考级' }
    ];*/
    const setCategory = value => {
      console.log('setCategory:', value);
      this.setState({ category: value });
    };

    let fetching = dataCreate && dataCreate.fetching;
    return (
      <div>
        <GoBackItem onClick={goBack} title="添加商品" />
        <div>
          <strong>创建一个新课程/试听课/活动/商品</strong>
        </div>

        <div className="mt-2">
          <small className="d-block">首先选择一个分类:</small>
        </div>
        <div>
          <CategoryListEditor
            changable={true}
            current={category}
            categories={categories}
            changeValue={setCategory}
          />
        </div>

        <div className="text-danger">{errMsg}</div>
        <div>
          {!fetching && (
            <div>
              <div className="p-2">
                <Link
                  to={'/mine/products'}
                  className="btn btn-primary"
                  onClick={evt => this.createItem(evt, '课程')}
                >
                  创建课程
                </Link>
              </div>
              <div className="p-2">
                <Link
                  to={'/mine/products'}
                  className="btn btn-primary"
                  onClick={evt => this.createItem(evt, '试听课')}
                >
                  创建试听课
                </Link>
              </div>
              <div className="p-2">
                <Link
                  to={'/mine/products'}
                  className="btn btn-primary"
                  onClick={evt => this.createItem(evt, '活动')}
                >
                  创建活动
                </Link>
              </div>
              <div className="p-2">
                <Link
                  to={'/mine/products'}
                  className="btn btn-primary"
                  onClick={evt => this.createItem(evt, '商品')}
                >
                  创建普通商品
                </Link>
              </div>
            </div>
          )}
          {fetching && <div>正在创建...</div>}
        </div>

        <div className="mt-5" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  db: dbSelect(state),
  dataCreate: createSelect(state),
  dataCategory: categoryDataSelect(state)
});

const mapActionsToProps = {
  push,
  replace,
  goBack,
  fetchCategory,
  createProduct
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
