export const getViewport = () => {
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

export const getPagearea = () => {
  /*
    获取网页大小的另一种方法:
    see also: http://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html
    网页上的每个元素还有scrollHeight和scrollWidth属性，指包含滚动条在内的该元素的视觉面积。
    那么，document对象的scrollHeight和scrollWidth属性就是网页的大小，意思就是滚动条滚过的所有长度和宽度。
    但是，这个函数有一个问题。如果网页内容能够在浏览器窗口中全部显示，不出现滚动条，那么网页的clientWidth和scrollWidth应该相等。但是实际上，不同浏览器有不同的处理，这两个值未必相等。所以，我们需要取它们之中较大的那个值
  */
  if (document.compatMode == 'BackCompat') {
    return {
      width: Math.max(document.body.scrollWidth, document.body.clientWidth),
      height: Math.max(document.body.scrollHeight, document.body.clientHeight)
    };
  } else {
    return {
      width: Math.max(
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth
      ),
      height: Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.clientHeight
      )
    };
  }
};

export const getElementAbsolutePos = element => {
  /*
    获取网页元素的绝对位置:
    see also: http://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html
    网页元素的绝对位置，指该元素的左上角相对于整张网页左上角的坐标。这个绝对位置要通过计算才能得到。
    首先，每个元素都有offsetTop和offsetLeft属性，表示该元素的左上角与父容器（offsetParent对象）左上角的距离。所以，只需要将这两个值进行累加，就可以得到该元素的绝对坐标。
    注意：由于在表格和iframe中，offsetParent对象未必等于父容器，所以上面的函数对于表格和iframe中的元素不适用。
  */
  let actualLeft = element.offsetLeft;
  let actualTop = element.offsetTop;
  let current = element.offsetParent;
  while (current !== null) {
    actualLeft += current.offsetLeft;
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return { left: actualLeft, top: actualTop };
};

export const getElementViewPos = element => {
  /*
    获取网页元素的相对位置:
    see also: http://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html
    网页元素的相对位置，指该元素左上角相对于浏览器窗口左上角的坐标。
    有了绝对位置以后，获得相对位置就很容易了，只要将绝对坐标减去页面的滚动条滚动的距离就可以了。滚动条滚动的垂直距离，是document对象的scrollTop属性；滚动条滚动的水平距离是document对象的scrollLeft属性。
    注意：scrollTop和scrollLeft属性是可以赋值的，并且会立即自动滚动网页到相应位置，因此可以利用它们改变网页元素的相对位置。另外，element.scrollIntoView()方法也有类似作用，可以使网页元素出现在浏览器窗口的左上角。
  */
  let actualLeft = element.offsetLeft;
  let actualTop = element.offsetTop;
  let current = element.offsetParent;
  while (current !== null) {
    actualLeft += current.offsetLeft;
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  let elementScrollLeft = document.documentElement.scrollLeft;
  let elementScrollTop = document.documentElement.scrollTop;
  if (document.compatMode == 'BackCompat') {
    elementScrollLeft = document.body.scrollLeft;
    elementScrollTop = document.body.scrollTop;
  }
  return {
    left: actualLeft - elementScrollLeft,
    top: actualTop - elementScrollTop
  };
};

/*
  获取元素位置的快速方法:
  see also: http://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html
  除了上面的函数以外，还有一种快速方法，可以立刻获得网页元素的位置。
  那就是使用getBoundingClientRect()方法。它返回一个对象，其中包含了left、right、top、bottom四个属性，分别对应了该元素的左上角和右下角相对于浏览器窗口（viewport）左上角的距离。
  所以，网页元素的相对位置就是
    let X=this.getBoundingClientRect().left;
    let Y=this.getBoundingClientRect().top;
  再加上滚动距离，就可以得到绝对位置
    let X=this.getBoundingClientRect().left+document.documentElement.scrollLeft;
    let Y=this.getBoundingClientRect().top+document.documentElement.scrollTop;
  目前，IE、Firefox 3.0+、Opera 9.5+都支持该方法，而Firefox 2.x、Safari、Chrome、Konqueror不支持。
*/
export const getElementAbsolutePosV2 = element => {
  let rect = element.getBoundingClientRect();
  return {
    left: rect.left + document.documentElement.scrollLeft,
    top: rect.top + document.documentElement.scrollTop
  };
};
export const getElementViewPosV2 = element => {
  let rect = element.getBoundingClientRect();
  return { left: rect.left, top: rect.top };
};
