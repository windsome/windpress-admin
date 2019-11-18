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
import IconText from 'components/dianping/IconText';
import { InputIconLeft, InputIconRight } from 'components/dianping/IconInput';

import { tag as fetchTag, update as updateSetting } from 'modules/setting';
import { tagDataSelect } from 'selectors/setting';

class TagList extends React.Component {
  state = {
    category: '',
    tags: [],
    created: ''
  };

  constructor() {
    super();
  }
  componentDidMount() {
    let { category, tags, fetchTag } = this.props;
    this.setState({ tags, category });
  }
  render() {
    let { tags, category, add, remove } = this.props;
    let { created } = this.state;
    let uiTags =
      tags &&
      tags.map((item, index) => {
        return (
          <span className="mr-1">
            <IconText
              name={item}
              iconBack="fa fa-minus-circle"
              iconBackFunc={() => remove(category, item)}
            />
          </span>
        );
      });

    return (
      <div>
        {uiTags}
        <InputIconLeft
          placeholder="新标签"
          value={created}
          onChange={evt => this.setState({ created: evt.target.value })}
          icon="fa fa-plus"
          iconFunc={() => {
            add(category, created);
            this.setState({ created: '' });
          }}
        />
      </div>
    );
  }
}

export class Page extends React.Component {
  state = {
    id: null,
    name: null,
    desc: null,

    created: '',
    errMsg: null
  };

  constructor() {
    super();
    this.updateItem = this.updateItem.bind(this);
    this.addTag = this.addTag.bind(this);
    this.delTag = this.delTag.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.delCategory = this.delCategory.bind(this);
  }

  componentDidMount() {
    let { dataTag, fetchTag } = this.props;
    if (dataTag) {
      this.initStateFromProps();
      return;
    }
    fetchTag().then(ret => {
      console.log('fetchTag result:', ret);
      this.initStateFromProps();
    });
  }
  initStateFromProps() {
    let { dataTag } = this.props;
    if (!dataTag) return;
    this.setState({ ...dataTag });
  }
  updateItem = evt => {
    evt.preventDefault();
    let { push, match, updateSetting, fetchTag } = this.props;
    let { id, name, desc } = this.state;
    let nextItem = { id, name, desc };
    this.setState({ errMsg: '正在提交数据' });
    updateSetting(id, nextItem)
      .then(ret => {
        if (ret) {
          fetchTag().then(ret2 => {
            console.log('fetchTag result:', ret2);
            push('/mine/root');
          });
        }
      })
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  };
  addTag = (category, tag) => {
    let { desc } = this.state;
    let tags = desc[category];
    let nextTags = [...tags, tag];
    let nextDesc = { ...desc, [category]: nextTags };
    this.setState({ desc: nextDesc });
  };
  delTag = (category, tag) => {
    let { desc } = this.state;
    let tags = desc[category];
    let nextTags =
      tags &&
      tags.reduce((result, item) => {
        if (item === tag) return result;
        else return result.concat(item);
      }, []);
    let nextDesc = { ...desc, [category]: nextTags };
    this.setState({ desc: nextDesc });
  };
  addCategory = category => {
    let { desc } = this.state;
    let nextDesc = { ...desc, [category]: [] };
    this.setState({ desc: nextDesc });
  };
  delCategory = category => {
    let { desc } = this.state;
    let nextDesc = { ...desc };
    delete nextDesc[category];
    this.setState({ desc: nextDesc });
  };

  render() {
    let { push } = this.props;
    let { id, name, desc, created, errMsg } = this.state;

    let categories = [];
    _.forOwn(desc, (value, key) => {
      categories.push({ name: key, tags: value });
    });

    let uiCategories =
      categories &&
      categories.map((item, index) => {
        return (
          <div className="mx-1 my-1">
            <div>
              <IconText
                name={item.name}
                iconFront="fa fa-minus-circle"
                iconFrontFunc={() => this.delCategory(item.name)}
                textStyle={{
                  lineHeight: '1.5rem',
                  fontSize: '1rem',
                  color: '#f93'
                }}
              />
            </div>
            <div className="mx-2">
              <TagList
                category={item.name}
                tags={item.tags}
                add={this.addTag}
                remove={this.delTag}
              />
            </div>
          </div>
        );
      });

    return (
      <div>
        {uiCategories}
        <div className="mt-2 mx-1">
          <InputIconRight
            placeholder="新分类"
            value={created}
            onChange={evt => this.setState({ created: evt.target.value })}
            icon="fa fa-plus"
            iconFunc={() => {
              this.addCategory(created);
              this.setState({ created: '' });
            }}
          />
        </div>
        {errMsg && <div> {errMsg}</div>}
        <div className="mt-2">
          <BigButton onClick={this.updateItem} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dataTag: tagDataSelect(state)
});

const mapActionsToProps = {
  push,
  fetchTag,
  updateSetting
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
