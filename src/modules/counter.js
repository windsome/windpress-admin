export const COUNTER_INCREMENT = 'COUNTER_INCREMENT';
export const COUNTER_DECREMENT = 'COUNTER_DECREMENT';

export const increment = ({ value }) => {
  console.log('models/action/increment');
  return {
    type: COUNTER_INCREMENT,
    payload: value
  };
};

export const decrement = ({ value }) => ({
  type: COUNTER_DECREMENT,
  payload: value
});

const initialState = {
  value: parseInt(process.env.REACT_APP_INITIAL_COUNTER, 10)
};

export default (state = initialState, { type, payload, error }) => {
  switch (type) {
    case COUNTER_INCREMENT:
      console.log('models/reducer/increment');
      return {
        value: state.value + payload
      };

    case COUNTER_DECREMENT:
      return {
        value: state.value - payload
      };

    default:
      return state;
  }
};
