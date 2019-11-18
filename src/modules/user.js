// !!!CAUTION: 每加一个reducer，需要手动加入到_database.js中，以便reducer能正常工作
import { createModule } from './_baseMongo';
import {
  createUser as apiCreate,
  updateUser as apiUpdate,
  deleteUser as apiRemove,
  getUser as apiGet,
  retrieveUsers as apiRetrieve,
  loginByCookie,
  loginByNicename,
  logout as logoutApi,
  getSmsCode as getSmsCodeApi,
  loginBySmsCheck
} from 'utils/apis';
import { schema } from 'normalizr';

let moduleName = 'user';
const itemSchema = new schema.Entity(
  `${moduleName}s`,
  {},
  {
    idAttribute: 'id'
  }
);

let { createApiAction, createDefaultCRUDApiActions } = createModule(moduleName);
export const {
  create,
  update,
  remove,
  get,
  retrieve
} = createDefaultCRUDApiActions({
  schema: itemSchema,
  apiCreate,
  apiUpdate,
  apiRemove,
  apiGet,
  apiRetrieve
});

const createSuccessHandler = actionName => {
  return (state, action) => {
    let old = state[moduleName][actionName] || {};
    return {
      ...state,
      [moduleName]: {
        ...(state[moduleName] || {}),
        [actionName]: {
          ...old,
          fetching: false,
          error: null,
          me: action.payload
        }
      }
    };
  };
};
const createRequestHandler = actionName => {
  return (state, action) => {
    let old = state[moduleName][actionName] || {};
    return {
      ...state,
      [moduleName]: {
        ...(state[moduleName] || {}),
        [actionName]: { ...old, fetching: true, error: null }
      }
    };
  };
};
const createFailureHandler = actionName => {
  return (state, action) => {
    let old = state[moduleName][actionName] || {};
    return {
      ...state,
      [moduleName]: {
        ...(state[moduleName] || {}),
        [actionName]: { ...old, fetching: false, error: action.payload }
      }
    };
  };
};
export const { loginCookie } = createApiAction('loginCookie', {
  api: loginByCookie,
  requestHandler: createRequestHandler('login'),
  failureHandler: createFailureHandler('login'),
  successHandler: createSuccessHandler('login'),
  initState: { login: {} }
});
export const { loginNicename } = createApiAction('loginNicename', {
  api: loginByNicename,
  requestHandler: createRequestHandler('login'),
  failureHandler: createFailureHandler('login'),
  successHandler: createSuccessHandler('login'),
  initState: { login: {} }
});
export const { getSmsCode } = createApiAction('getSmsCode', {
  api: getSmsCodeApi,
  requestHandler: createRequestHandler('smscode'),
  failureHandler: createFailureHandler('smscode'),
  successHandler: createSuccessHandler('smscode'),
  initState: { smscode: {} }
});
export const { loginSms } = createApiAction('loginSms', {
  api: loginBySmsCheck,
  requestHandler: createRequestHandler('login'),
  failureHandler: createFailureHandler('login'),
  successHandler: createSuccessHandler('login'),
  initState: { login: {} }
});

const createLogoutSuccessHandler = actionName => {
  return (state, action) => ({
    ...state,
    [moduleName]: {
      ...(state[moduleName] || {}),
      [actionName]: { fetching: false, error: null, me: null }
    }
  });
};
export const { logout } = createApiAction('logout', {
  api: logoutApi,
  requestHandler: createRequestHandler('login'),
  failureHandler: createFailureHandler('login'),
  successHandler: createLogoutSuccessHandler('login'),
  initState: { login: {} }
});
