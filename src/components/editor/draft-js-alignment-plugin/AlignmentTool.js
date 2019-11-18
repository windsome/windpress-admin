/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  AlignBlockDefaultButton,
  AlignBlockLeftButton,
  AlignBlockCenterButton,
  AlignBlockRightButton
} from 'draft-js-buttons';
import './alignmentToolStyles.css';
import '../draft-js-buttonStyles.css';
const defaultTheme = {
  buttonStyles: {
    buttonWrapper: 'draft-plugin-buttonWrapper',
    button: 'draft-plugin-button',
    active: 'draft-plugin-button-active'
  },
  toolbarStyles: { alignmentTool: 'draft-plugin-alignmentTool' }
};

const getRelativeParent = element => {
  if (!element) {
    return null;
  }

  const position = window
    .getComputedStyle(element)
    .getPropertyValue('position');
  if (position !== 'static') {
    return element;
  }

  return getRelativeParent(element.parentElement);
};

export default class AlignmentTool extends React.Component {
  state = {
    position: {},
    alignment: null
  };

  componentWillMount() {
    this.props.store.subscribeToItem('visibleBlock', this.onVisibilityChanged);
    this.props.store.subscribeToItem('alignment', this.onAlignmentChange);
  }

  componentWillUnmount() {
    this.props.store.unsubscribeFromItem(
      'visibleBlock',
      this.onVisibilityChanged
    );
    this.props.store.unsubscribeFromItem('alignment', this.onAlignmentChange);
  }

  onVisibilityChanged = visibleBlock => {
    setTimeout(() => {
      let position;
      const boundingRect = this.props.store.getItem('boundingRect');
      if (visibleBlock) {
        const relativeParent = getRelativeParent(this.toolbar.parentElement);
        const toolbarHeight = this.toolbar.clientHeight;
        const relativeRect = relativeParent
          ? relativeParent.getBoundingClientRect()
          : document.body.getBoundingClientRect();
        position = {
          top: boundingRect.top - relativeRect.top - toolbarHeight,
          left: boundingRect.left - relativeRect.left + boundingRect.width / 2,
          transform: 'scale(1)',
          transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)'
        };
      } else {
        position = { transform: 'scale(0)' };
      }
      const alignment = this.props.store.getItem('alignment') || 'default';
      this.setState({
        alignment,
        position
      });
    }, 0);
  };

  onAlignmentChange = alignment => {
    this.setState({
      alignment
    });
  };

  render() {
    let { theme } = this.props;
    theme = theme || defaultTheme;
    const defaultButtons = [
      AlignBlockDefaultButton,
      AlignBlockLeftButton,
      AlignBlockCenterButton,
      AlignBlockRightButton
    ];
    return (
      <div
        className={theme.toolbarStyles.alignmentTool}
        style={this.state.position}
        ref={toolbar => {
          this.toolbar = toolbar;
        }}
      >
        {defaultButtons.map((Button, index) => (
          <Button
            /* the index can be used here as the buttons list won't change */
            key={index}
            alignment={this.state.alignment}
            setAlignment={this.props.store.getItem('setAlignment')}
            theme={theme.buttonStyles}
          />
        ))}
      </div>
    );
  }
}
