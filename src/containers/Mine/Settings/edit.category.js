import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';
import _ from 'lodash';

import { BigButton } from 'components/widgets/Bar';
import Gap from 'components/widgets/Gap';
import { FormInput, FormTextarea } from 'components/widgets/FormInput';
import CategoryList from 'components/widgets/CategoryList';

import {
  category as fetchCategory,
  update as updateSetting
} from 'modules/setting';
import { categorySelect, categoryDataSelect } from 'selectors/setting';

export class Page extends React.Component {
  state = {
    current: [],
    nameCreated: '',
    errMsg: null
  };

  constructor() {
    super();
    this.updateItem = this.updateItem.bind(this);
    this.subLevel = this.subLevel.bind(this);
    this.setLevel = this.setLevel.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.delCategory = this.delCategory.bind(this);
  }

  componentDidMount() {
    let { dataCategory, fetchCategory } = this.props;
    if (dataCategory) {
      this.initStateFromProps();
      return;
    }
    fetchCategory().then(ret => {
      console.log('fetchCategory result:', ret);
      this.initStateFromProps();
    });
  }
  initStateFromProps() {
    let { dataCategory } = this.props;
    if (!dataCategory) return;
    let root =
      dataCategory.desc && dataCategory.desc[0] && dataCategory.desc[0].name;
    let current = [root];
    this.setState({ ...dataCategory, current });
  }
  updateItem = evt => {
    evt.preventDefault();
    let { push, match, updateSetting, fetchCategory } = this.props;
    let { id, name, desc } = this.state;
    let nextItem = { id, name, desc };
    this.setState({ errMsg: '正在提交数据' });
    updateSetting(id, nextItem)
      .then(ret => {
        if (ret) {
          fetchCategory().then(ret2 => {
            console.log('fetchCategory result:', ret2);
            push('/mine/root');
          });
        }
      })
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  };

  subLevel = value => {
    let { current } = this.state;
    let nextCurrent = [...current, value];
    this.setState({ current: nextCurrent });
  };

  setLevel = value => {
    let { current } = this.state;
    if (!value || value.length < 1) {
      console.log(
        "must have at least one level! currently, can't add/delete root level!"
      );
      value = current.slice(0, 1);
    }
    this.setState({ current: value });
  };

  addCategory = value => {
    let { id, name, desc, current } = this.state;

    let desc2 = _.cloneDeep(desc);
    let rootNode = { name: '', alias: 'root', children: desc2 };
    let currNode = rootNode;
    for (let i = 0; i < current.length; i++) {
      let currName = current[i];
      let currSubs = (currNode && currNode.children) || [];
      let findNode = null;
      for (let j = 0; j < currSubs.length; j++) {
        let node = currSubs[j];
        if (node.name === currName) {
          findNode = node;
          break;
        }
      }
      if (!findNode) {
        console.log('findNode null! some error!', rootNode, current, value);
        return -1;
      }
      currNode = findNode;
    }

    if (currNode) {
      (currNode.children && currNode.children.push({ name: value })) ||
        (currNode.children = [{ name: value }]);
      this.setState({ desc: desc2 });
    } else {
      console.log(
        'error! currNode=null! current:',
        current,
        ', value:',
        value,
        ', rootNode:',
        rootNode
      );
    }
  };
  delCategory = value => {
    let { id, name, desc, current } = this.state;

    let desc2 = _.cloneDeep(desc);
    let rootNode = { name: '', alias: 'root', children: desc2 };
    let currNode = rootNode;
    for (let i = 0; i < current.length; i++) {
      let currName = current[i];
      let currSubs = (currNode && currNode.children) || [];
      let findNode = null;
      for (let j = 0; j < currSubs.length; j++) {
        let node = currSubs[j];
        if (node.name === currName) {
          findNode = node;
          break;
        }
      }
      if (!findNode) {
        console.log('findNode null! some error!', rootNode, current, value);
        return -1;
      }
      currNode = findNode;
    }

    if (currNode) {
      let nextChildren =
        currNode.children &&
        currNode.children.reduce((result, node) => {
          if (node.name === value) {
            return result;
          }
          return result.concat(node);
        }, []);
      currNode.children = nextChildren;
      this.setState({ desc: desc2 });
    } else {
      console.log(
        'error! currNode=null! current:',
        current,
        ', value:',
        value,
        ', rootNode:',
        rootNode
      );
    }
  };

  render() {
    let { push, statusCategory } = this.props;
    let { id, name, desc, current, nameCreated, errMsg } = this.state;

    let rootNode = { name: '', alias: 'root', children: desc };
    let currNode = rootNode;
    for (let i = 0; currNode != null && i < current.length; i++) {
      let currName = current[i];
      let currSubs = (currNode && currNode.children) || [];
      let findNode = null;
      for (let j = 0; j < currSubs.length; j++) {
        let node = currSubs[j];
        if (node.name === currName) {
          findNode = node;
          break;
        }
      }
      if (!findNode) {
        console.log('findNode null! some error!', rootNode, current);
      }
      currNode = findNode;
    }

    let uiSubs =
      currNode &&
      currNode.children &&
      currNode.children.map((sub, index) => {
        let name = sub && sub.name;
        return (
          <div key={index}>
            <i
              className="fa fa-times"
              aria-hidden="true"
              onClick={() => this.delCategory(name)}
            />
            <button
              type="button"
              className="btn btn-link"
              onClick={() => this.subLevel(name)}
            >
              {name}
            </button>
          </div>
        );
      });

    return (
      <div>
        <CategoryList
          changable={true}
          data={current}
          changeValue={this.setLevel}
        />
        {uiSubs}
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="输入新类型名称"
            value={nameCreated}
            onChange={evt => this.setState({ nameCreated: evt.target.value })}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={evt => {
                evt.preventDefault();
                this.addCategory(this.state.nameCreated);
              }}
            >
              添加
            </button>
          </span>
        </div>
        {errMsg && <div> {errMsg}</div>}
        <div>
          <BigButton onClick={this.updateItem} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  statusCategory: categorySelect(state),
  dataCategory: categoryDataSelect(state)
});

const mapActionsToProps = {
  push,
  fetchCategory,
  updateSetting
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
