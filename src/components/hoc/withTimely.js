import React from 'react';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default (interval = 5) => {
  if (interval < 0) interval = 5;
  if (interval > 1000000000) interval = 5;
  // This function takes a component...
  return WrappedComponent => {
    // ...and returns another component...
    class withTimely extends React.Component {
      constructor(props) {
        super(props);
        this.handleNext = this.handleNext.bind(this);
        this.state = {
          xTimeCount: 0
        };
      }

      componentDidMount() {
        this.intervalId = setInterval(this.handleNext, interval * 1000);
      }

      componentWillUnmount() {
        this.intervalId && clearInterval(this.intervalId);
        this.intervalId = null;
      }

      handleNext() {
        let count = (this.state.xTimeCount + 1) % 1000000000;
        this.setState({ xTimeCount: count });
      }

      render() {
        // ... and renders the wrapped component with the fresh data!
        // Notice that we pass through any additional props
        return (
          <WrappedComponent
            xTimeCount={this.state.xTimeCount}
            {...this.props}
          />
        );
      }
    }
    withTimely.displayName = `withTimely(${getDisplayName(WrappedComponent)})`;
    return withTimely;
  };
};
