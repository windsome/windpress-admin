import React from 'react';
import isNull from 'lodash/isNull';

import './SmartNav.css';

const allcond = {
  area: [
    ['热门商区', ['全部商区', '淮海路', '打浦桥']],
    ['卢湾区', ['全部卢湾区', '淮海路', '打浦桥', '新天地', '瑞金宾馆区']],
    ['静安区', ['全部静安区', '静安寺', '南京西路', '同乐坊', '曹家渡']],
    [
      '长宁区',
      [
        '全部长宁区',
        '虹桥',
        '天山',
        '中山公园',
        '古北',
        '上海影城/新华路',
        '北新泾',
        '动物园/虹桥机场'
      ]
    ],
    ['徐汇区', ['全部徐汇区']],
    ['黄浦区', ['全部黄浦区']],
    ['虹口区', ['全部虹口区']],
    ['杨浦区', ['全部杨浦区']],
    ['普陀区', ['全部普陀区']],
    ['闵行区', ['全部闵行区']],
    ['宝山区', ['全部宝山区']],
    ['浦东新区', ['全部浦东新区']],
    ['嘉定区', ['全部嘉定区']],
    ['松江区', ['全部松江区']],
    ['青浦区', ['全部青浦区']],
    ['金山区', ['全部金山区']],
    ['奉贤区', ['全部奉贤区']],
    ['崇明区', ['全部崇明区']]
  ],
  type: [
    ['热门类型', ['全部艺术教育', '少儿舞蹈', '跆拳道']],
    ['美术', ['全部美术', '国画', '西洋画']],
    ['音乐', ['全部音乐', '美声', '民族音乐', '吉他', '钢琴']],
    ['体育', ['全部体育', '跆拳道']]
  ],
  zizhi: ['全部资质', '许可证', '民办非盈利', '保证金', '公司'],
  order: [
    '智能排序',
    '离我最近',
    '人气最高',
    '评价最好',
    '人均最低',
    '人均最高'
  ]
};
const defaultSelection = ['全部商区', '全部类型', '全部资质', '智能排序'];

export default class SmartNav extends React.Component {
  constructor() {
    super();
  }
  state = {
    open: -1,
    mainMenuIndex: -1
  };

  componentDidMount() {
    this.initData(this.props);
  }
  componentWillReceiveProps(nextProps) {
    let { selection: oSelection } = this.props;
    let { selection: nSelection } = nextProps;
    if (oSelection != nSelection) {
      this.initData(nextProps);
    }
  }

  initData(props) {
    let { hasSubMenu, mainMenu, mainMenuIndex, subMenu } = this.getData(
      props,
      this.state.open
    );

    this.setState({ mainMenuIndex });
  }

  getData(props, open = -1, mainMenuIndex = null) {
    let { data0, data1, data2, data3, selection } = props;
    if (open < 0 || open >= 4) return {};

    selection = selection || defaultSelection;
    let currentSelect = selection && selection[open];
    let hasSubMenu = false;
    let mainMenu = null;
    switch (open) {
      case 0:
        mainMenu = data0 || allcond.area;
        hasSubMenu = true;
        break;
      case 1:
        mainMenu = data1 || allcond.type;
        hasSubMenu = true;
        break;
      case 2:
        mainMenu = data2 || allcond.zizhi;
        hasSubMenu = false;
        break;
      case 3:
        mainMenu = data3 || allcond.order;
        hasSubMenu = false;
        break;
      default:
        mainMenu = data3 || allcond.order;
        hasSubMenu = false;
        break;
    }

    let subMenu = null;
    if (isNull(mainMenuIndex)) {
      mainMenuIndex = -1;
      if (hasSubMenu) {
        for (let i = 0; i < mainMenu.length; i++) {
          let subarr = mainMenu[i][1];
          if (subarr) {
            for (let j = 0; j < subarr.length; j++) {
              if (subarr[j] == currentSelect) {
                mainMenuIndex = i;
                subMenu = subarr;
                break;
              }
            }
            if (mainMenuIndex >= 0) break;
          }
        }
      } else {
        for (let i = 0; i < mainMenu.length; i++) {
          let menuitem = mainMenu[i];
          if (menuitem == currentSelect) {
            mainMenuIndex = i;
            break;
          }
        }
      }
    } else {
      subMenu =
        mainMenuIndex >= 0 &&
        mainMenu[mainMenuIndex] &&
        mainMenu[mainMenuIndex][1];
    }
    return { hasSubMenu, mainMenu, mainMenuIndex, subMenu };
  }

  closeSearch() {
    this.setState({ open: -1 });
  }
  changeCate(evt, open) {
    evt.preventDefault();
    if (open == this.state.open) {
      this.setState({ open: -1 });
    } else {
      let { mainMenuIndex } = this.getData(this.props, open);
      this.setState({ open, mainMenuIndex });
    }
  }
  changeMainMenuIndex(index) {
    this.setState({ mainMenuIndex: index });
  }

  render() {
    let {
      data0,
      data1,
      data2,
      data3,
      selection,
      onChangeSelection
    } = this.props;
    let { open, mainMenuIndex } = this.state;
    selection = selection || defaultSelection;
    let uiMenus = null;
    if (open >= 0 && open < 4) {
      let { hasSubMenu, mainMenu, subMenu } = this.getData(
        this.props,
        open,
        mainMenuIndex
      );
      let currentSelect = selection && selection[open];

      let setSelection = val => {
        let nSelection = [...selection];
        nSelection[open] = val;
        this.setState({ open: -1 });
        onChangeSelection && onChangeSelection(nSelection);
      };
      if (mainMenu) {
        if (hasSubMenu) {
          let uiLeft = mainMenu.map((item, index) => {
            let on = '';
            if (index == mainMenuIndex) on = ' on';
            return (
              <div
                key={index}
                onClick={() => this.setState({ mainMenuIndex: index })}
              >
                <p className={'item clearfix my-0' + on}>{item[0]}</p>
              </div>
            );
          });
          let uiRight =
            subMenu &&
            subMenu.map((item, index) => {
              let on = '';
              if (item == currentSelect) on = ' on';
              return (
                <a
                  className={'item clearfix' + on}
                  onClick={evt => {
                    evt.preventDefault();
                    setSelection(item);
                  }}
                  key={index}
                >
                  {item}
                </a>
              );
            });
          uiMenus = (
            <div className="second-selector">
              <div className="menu main">
                <div>{uiLeft}</div>
              </div>
              <div className="menu sub">
                <div>{uiRight}</div>
              </div>
            </div>
          );
        } else {
          let uiLeft = mainMenu.map((item, index) => {
            let on = '';
            if (item == currentSelect) on = ' on';
            return (
              <div key={index}>
                <p
                  className={'item clearfix my-0' + on}
                  onClick={evt => {
                    evt.preventDefault();
                    setSelection(item);
                  }}
                >
                  {item}
                </p>
              </div>
            );
          });
          uiMenus = (
            <div className="second-selector">
              <div className="menu full">
                <div>{uiLeft}</div>
              </div>
            </div>
          );
        }
      }
    }

    let uiCates =
      selection &&
      selection.map((item, index) => {
        let on = '';
        if (open == index) on = ' on';
        return (
          <a
            key={index}
            className={'item' + on}
            onClick={evt => this.changeCate(evt, index)}
          >
            {item}
            <i className="fa drop" />
          </a>
        );
      });

    let overlayClass = ' d-none';
    if (open >= 0 && open < 4) overlayClass = ' d-block';
    return (
      <div>
        <div
          className={'cate-overlay ' + overlayClass}
          onClick={this.closeSearch.bind(this)}
        />
        <nav className="list-nav border-bottom-new">
          <div className="cat clearfix">
            {uiCates}
            {/*<a href="javascript:void(0)" className="item on">全部商区<i className="fa drop"></i></a>
        <a href="javascript:void(0)" className="item">学习培训<i className="fa drop"></i></a>
        <a href="javascript:void(0)" className="item">全部资质<i className="fa drop"></i></a>
    <a href="javascript:void(0)" className="item">智能排序<i className="fa drop"></i></a>*/}
          </div>
          <section className="selector">{uiMenus}</section>
        </nav>
      </div>
    );
  }
}
