import _ from 'lodash';
import { createActions, handleActions } from 'redux-actions';
import { getPayRequestParams, getSignKey } from 'utils/apis';
import { getBrandWCPayRequest } from '../utils/jssdk';
let xdebug = window.myDebug('PAY:pay');

export const {
  pay: {
    sandboxKeyRequest,
    sandboxKeySuccess,
    sandboxKeyFailure,
    paymentRequest,
    paymentSuccess,
    paymentFailure
  }
} = createActions({
  PAY: {
    SANDBOX_KEY_REQUEST: null,
    SANDBOX_KEY_SUCCESS: null,
    SANDBOX_KEY_FAILURE: null,
    PAYMENT_REQUEST: null,
    PAYMENT_SUCCESS: null,
    PAYMENT_FAILURE: null
  }
});

export const invokePayment = id => {
  return dispatch => {
    dispatch(paymentRequest());
    return getPayRequestParams({ id })
      .then(payargs => {
        if (!payargs) {
          throw new Error('支付失败：getPayRequestParams return null!');
        }
        if (payargs.errcode && payargs.errcode != 0) {
          throw new Error(
            '支付失败：code=' + payargs.errcode + ',' + payargs.message
          );
        }
        // no error.
        return getBrandWCPayRequest(payargs);
      })
      .then(ret => {
        if (!ret) {
          throw new Error('支付失败：getBrandWCPayRequest return null!');
        }
        dispatch(paymentSuccess(id));
        return ret;
      })
      .catch(error => {
        xdebug('error! invokePayment caught:', error.message);
        dispatch(paymentFailure(error));
        throw error;
      });
  };
};

export const acquireSandboxKey = () => {
  return dispatch => {
    dispatch(sandboxKeyRequest());
    return getSignKey()
      .then(retobj => {
        if (retobj.return_code == 'SUCCESS') {
          dispatch(sandboxKeySuccess(retobj.sandbox_signkey));
          return retobj.sandbox_signkey;
        } else {
          throw retobj;
        }
      })
      .catch(error => {
        dispatch(sandboxKeyFailure(error));
        throw error;
        //return null;
      });
  };
};

const reducer = handleActions(
  {
    PAY: {
      SANDBOX_KEY_REQUEST: (state, action) => ({
        ...state,
        sandbox: { fetching: true, error: null }
      }),
      SANDBOX_KEY_SUCCESS: (state, action) => ({
        ...state,
        sandbox: {
          ...state.sandbox,
          fetching: false,
          error: null,
          key: action.payload
        }
      }),
      SANDBOX_KEY_FAILURE: (state, action) => ({
        ...state,
        sandbox: { ...state.sandbox, fetching: false, error: action.payload }
      }),
      PAYMENT_REQUEST: (state, action) => ({
        ...state,
        payment: { fetching: true, error: null, id: null }
      }),
      PAYMENT_SUCCESS: (state, action) => ({
        ...state,
        payment: { fetching: false, error: null, id: action.payload }
      }),
      PAYMENT_FAILURE: (state, action) => ({
        ...state,
        payment: { fetching: false, error: action.payload, id: null }
      })
    }
  },
  {
    payment: { fetching: false, error: null, id: null },
    sandbox: { fetching: false, error: null }
  }
);

export default reducer;
