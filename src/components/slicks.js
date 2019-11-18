import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styles from './slicks.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export class SimpleSlider extends Component {
  render() {
    const settings = {
      className: cx('slickBannder'),
      adaptiveHeight: true,
      arrows: false,
      autoplay: true,
      pauseOnHover: true,
      centerMode: true,
      dots: true,
      dotsClass: cx('slick-dots', 'slickDotsBanner'),
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    const styles = {
      width: '100%',
      paddingBottom: '50%'
    };
    return (
      <div>
        <Slider {...settings}>
          <div>
            <Link to="/coin/market">
              <img src={'/ysj/images/slide1.jpg'} className="img-responsive" />
            </Link>
          </div>
          <div>
            <Link to="/coin/market">
              <img src={'/ysj/images/slide2.jpg'} className="img-responsive" />
            </Link>
          </div>
          <div>
            <Link to="/coin/market">
              <img src={'/ysj/images/slide3.jpg'} className="img-responsive" />
            </Link>
          </div>
          <div>
            <Link to="/coin/market">
              <img src={'/ysj/images/slide4.jpg'} className="img-responsive" />
            </Link>
          </div>
          <div>
            <Link to="/coin/market">
              <img src={'/ysj/images/slide5.jpg'} className="img-responsive" />
            </Link>
          </div>
        </Slider>
      </div>
    );
  }
}

export class VerticalMode extends Component {
  render() {
    const settings = {
      dots: false,
      arrows: false,
      autoplay: true,
      pauseOnHover: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      vertical: true,
      //centerMode: true,
      //verticalSwiping: true,
      beforeChange: function(currentSlide, nextSlide) {
        console.log('before change', currentSlide, nextSlide);
      },
      afterChange: function(currentSlide) {
        console.log('after change', currentSlide);
      }
    };
    return (
      <div>
        <Slider {...settings}>
          <div>
            <i
              className="fa fa-circle"
              style={{ paddingRight: 5, color: '#f00', fontSize: '8' }}
            />
            <Link to="/coin/market">
              <span>7月8日 第二届“足迹”全国少年儿童画展</span>
            </Link>
          </div>
          <div>
            <i
              className="fa fa-circle"
              style={{ paddingRight: 5, color: '#f00', fontSize: '8' }}
            />
            <Link to="/coin/market">
              <span>7月29日 上海音协管乐。打击乐考级</span>
            </Link>
          </div>
          <div>
            <i
              className="fa fa-circle"
              style={{ paddingRight: 5, color: '#f00', fontSize: '8' }}
            />
            <Link to="/coin/market">
              <span>8月5日 钢琴大作战首场演出</span>
            </Link>
          </div>
        </Slider>
      </div>
    );
  }
}

export default class PreviousNextMethods extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }
  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    let pieceStyle = {
      width: '100%'
    };
    return (
      <Slider ref={c => (this.slider = c)} {...settings}>
        <div style={pieceStyle} key={1}>
          <h3>1</h3>
        </div>
        <div style={pieceStyle} key={2}>
          <h3>2</h3>
        </div>
        <div style={pieceStyle} key={3}>
          <h3>3</h3>
        </div>
        <div style={pieceStyle} key={4}>
          <h3>4</h3>
        </div>
        <div style={pieceStyle} key={5}>
          <h3>5</h3>
        </div>
        <div style={pieceStyle} key={6}>
          <h3>6</h3>
        </div>
      </Slider>
    );
  }
}
