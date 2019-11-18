import { CALL_PAGE_DATA_UPDATE_METHOD } from './actions';

/**
 * This middleware captures CALL_PAGE_DATA_UPDATE_METHOD actions to redirect to the
 * provided history object. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */
export default function routerPageData(history) {
  return () => next => action => {
    if (action.type !== CALL_PAGE_DATA_UPDATE_METHOD) {
      return next(action);
    }

    const { payload: { method, args } } = action;
    history[method](...args);
  };
}
