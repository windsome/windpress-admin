// !!!CAUTION: 每加一个reducer，需要手动加入到_database.js中，以便reducer能正常工作
import { createModule } from './_baseMongo';
import {
  createSetting as apiCreate,
  updateSetting as apiUpdate,
  deleteSetting as apiRemove,
  getSetting as apiGet,
  retrieveSettings as apiRetrieve,
  getCategory,
  getTag,
  getProductType,
  getIndexPage as getIndexPageApi,
  updateIndexPage as updateIndexPageApi
} from 'utils/apis';
import { schema } from 'normalizr';

let moduleName = 'setting';
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
  return (state, action) => ({
    ...state,
    [moduleName]: {
      ...(state[moduleName] || {}),
      [actionName]: { fetching: false, error: null, item: action.payload }
    }
  });
};

export const { category } = createApiAction('category', {
  api: getCategory,
  successHandler: createSuccessHandler('category')
});

export const { tag } = createApiAction('tag', {
  api: getTag,
  successHandler: createSuccessHandler('tag')
});

export const { productType } = createApiAction('productType', {
  api: getProductType,
  successHandler: createSuccessHandler('productType')
});

const createRequestHandler = actionName => {
  return (state, action) => ({
    ...state,
    [moduleName]: {
      ...(state[moduleName] || {}),
      [actionName]: { fetching: true, error: null }
    }
  });
};
const createFailureHandler = actionName => {
  return (state, action) => ({
    ...state,
    [moduleName]: {
      ...(state[moduleName] || {}),
      [actionName]: { fetching: false, error: null }
    }
  });
};
export const { getIndexPage } = createApiAction('getIndexPage', {
  api: getIndexPageApi,
  requestHandler: createRequestHandler('indexPage'),
  failureHandler: createFailureHandler('indexPage'),
  successHandler: createSuccessHandler('indexPage'),
  initState: { indexPage: {} }
});
export const { updateIndexPage } = createApiAction('updateIndexPage', {
  api: updateIndexPageApi,
  requestHandler: createRequestHandler('indexPage'),
  failureHandler: createFailureHandler('indexPage'),
  successHandler: createSuccessHandler('indexPage'),
  initState: { indexPage: {} }
});
