import React from 'react';

const getViewport = () => {
  /*
    获取网页的大小:
    see also: http://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html
    网页上的每个元素，都有clientHeight和clientWidth属性。这两个属性指元素的内容部分再加上padding的所占据的视觉面积，不包括border和滚动条占用的空间。
    因此，document元素的clientHeight和clientWidth属性，就代表了网页的大小。
    上面的getViewport函数就可以返回浏览器窗口的高和宽。使用的时候，有三个地方需要注意：
    1）这个函数必须在页面加载完成后才能运行，否则document对象还没生成，浏览器会报错。
    2）大多数情况下，都是document.documentElement.clientWidth返回正确值。但是，在IE6的quirks模式中，document.body.clientWidth返回正确的值，因此函数中加入了对文档模式的判断。
    3）clientWidth和clientHeight都是只读属性，不能对它们赋值。
  */
  if (document.compatMode == 'BackCompat') {
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    };
  } else {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    };
  }
};

// This function takes a component...
export default WrappedComponent => {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleScroll = this.handleScroll.bind(this);
      this.state = {
        xInScrollArea: false
      };
    }

    componentDidMount() {
      window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props !== nextProps) {
        return true;
      }
      if (
        this.state.xInScrollArea === false &&
        nextState.xInScrollArea === true
      ) {
        return true;
      }
      return false;
    }

    handleScroll(evt) {
      let { xInScrollArea } = this.state;
      let rect = document.body.getBoundingClientRect();
      let viewport = getViewport();
      if (
        rect.bottom > viewport.height - 2 &&
        rect.bottom < viewport.height + 2
      ) {
        if (!xInScrollArea) this.setState({ xInScrollArea: true });
      } else {
        if (xInScrollArea) this.setState({ xInScrollArea: false });
      }
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return (
        <WrappedComponent
          xInScrollArea={this.state.xInScrollArea}
          {...this.props}
        />
      );
    }
  };
};
