import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Carousel.css';

// see also: https://github.com/mcuznz/bootstrap-carousel-vertical
// see also: https://codepen.io/danbhala/pen/eNZrQW
export const VerticalCarousel = ({ items, current }) => {
  items = [
    {
      to: '/coin/1',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      to: '/coin/2',
      title: 'Cras luctus eu odio fermentum tempus. Aliquam erat volutpat.'
    },
    {
      to: '/coin/3',
      title:
        'consectetur adipiscing elit. Etiam arcu urna, lacinia sed dapibus sed, molestie ac mi.'
    }
  ];
  current = 0;
  let uis =
    items &&
    items.map((item, index) => {
      let active = current === index;
      let cn = active ? 'carousel-item active' : 'carousel-item';
      return (
        <div className={cn} key={index}>
          <Link to={item.to}>{item.title}</Link>
        </div>
      );
    });
  return (
    <div className="carousel vertical slide">
      <div className="carousel-inner" role="listbox">
        {uis}
      </div>

      {/*<!-- Controls -->*/}
      <a
        className="carousel-control-up"
        href="#carouselExampleIndicators"
        role="button"
      >
        <i
          className="fa fa-sort-asc"
          aria-hidden="true"
          style={{ color: '#f00' }}
        />
        <span className="sr-only">Previous</span>
      </a>
      <a
        className="carousel-control-down"
        href="#carouselExampleIndicators"
        role="button"
      >
        <i
          className="fa fa-sort-desc"
          aria-hidden="true"
          style={{ color: '#f00' }}
        />
        <span className="sr-only">Next</span>
      </a>
    </div>
  );
};

export default () => (
  <div className="carousel slide">
    <ol className="carousel-indicators">
      <li className="active" />
      <li />
      <li />
    </ol>
    <div className="carousel-inner">
      <div className="carousel-item active">
        <img
          className="d-block img-fluid"
          src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ec3c69e39%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ec3c69e39%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22217.7%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
          alt="First slide"
        />
        <div className="carousel-caption">
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </div>
      </div>
      <div className="carousel-item">
        <img
          className="d-block img-fluid"
          src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ec3c69e39%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ec3c69e39%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22217.7%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
          alt="Second slide"
        />
        <div className="carousel-caption d-none d-sm-block">
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
      <div className="carousel-item">
        <img
          className="d-block img-fluid"
          src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ec3c69e39%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ec3c69e39%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22217.7%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
          alt="Third slide"
        />
        <div className="carousel-caption d-none d-md-block">
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </div>
      </div>
    </div>
    <a
      className="carousel-control-prev"
      href="#carouselExampleIndicators"
      role="button"
    >
      <span className="carousel-control-prev-icon" aria-hidden="true" />
      <span className="sr-only">Previous</span>
    </a>
    <a
      className="carousel-control-next"
      href="#carouselExampleIndicators"
      role="button"
    >
      <span className="carousel-control-next-icon" aria-hidden="true" />
      <span className="sr-only">Next</span>
    </a>
  </div>
);
