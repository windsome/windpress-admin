/* eslint-disable react/no-children-prop */
import React, { Component } from 'react';
import { Image } from 'components/widgets/Svg';

export default ({ theme, onClick }) =>
  class ImageButton extends Component {
    preventBubblingUp = event => {
      event.preventDefault();
    };

    render() {
      return (
        <div
          className={theme.buttonWrapper}
          onMouseDown={this.preventBubblingUp}
        >
          <button className={theme.button} type="button" onClick={onClick}>
            <Image />
          </button>
        </div>
      );
    }
  };
