import React from 'react';

// actions
export const CALL_PAGE_DATA_UPDATE_METHOD =
  '@@pagedata/CALL_PAGE_DATA_UPDATE_METHOD';
function updateValue(route) {
  return (...args) => ({
    type: CALL_PAGE_DATA_UPDATE_METHOD,
    payload: { route, args }
  });
}

// This function takes a component...
export default route => {
  return WrappedComponent => {
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

      handleScroll(evt) {
        let rect = document.body.getBoundingClientRect();
        let viewport = getViewport();
        if (
          rect.bottom > viewport.height - 2 &&
          rect.bottom < viewport.height + 2
        ) {
          this.setState({ xInScrollArea: true });
        } else {
          this.setState({ xInScrollArea: false });
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
};
