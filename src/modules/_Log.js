import {
  createModule,
  wrapCreate,
  wrapUpdate,
  wrapRemove,
  wrapGet,
  wrapRetrieve
} from './_baseMongo';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  retrieveProducts
} from 'utils/apis';
import { schema } from 'normalizr';
//import { schema, normalize } from 'normalizr';
//import { camelizeKeys } from 'humps';

const itemSchema = new schema.Entity(
  'products',
  {},
  {
    idAttribute: 'id'
  }
);

/**
 * 方案1, 对api进行包装，使得传入redux-reducer的数据是经过整理的，符合reducer接口的。
 * 使用 createDefaultOneSuccessHandler, defRetrieveSuccessHandler, defRetrieveFailureHandler, defRetrieveRequestHandler对进入reducer的数据进行处理，形成redux的database-store
 */
// const _create = (args = {}) => {
//   return createProduct(args).then(ret => {
//     if (!ret || !ret.id) {
//       throw new Error('no id return!');
//     }
//     const camelizedJson = camelizeKeys(ret);
//     const res = normalize(camelizedJson, itemSchema);
//     let { entities, result } = res || {};
//     return { db: entities, result };
//   });
// };
// const _update = (id, args = {}) => {
//   return updateProduct(id, args).then(ret => {
//     if (ret.id) {
//       // has updated item.
//       const camelizedJson = camelizeKeys(ret);
//       const res = normalize(camelizedJson, itemSchema);
//       let { entities, result } = res || {};
//       return { db: entities, result };
//     }
//     return { result: id };
//   });
// };
// const _remove = id => {
//   return deleteProduct(id, args).then(ret => {
//     if (ret.errcode) {
//       throw ret;
//     }
//     // delete ok.
//     return { db: { products: { [id]: null } }, result: id };
//   });
// };
// const _get = id => {
//   return getProduct(id, args).then(ret => {
//     if (ret.errcode) {
//       throw ret;
//     }
//     // has got item.
//     const camelizedJson = camelizeKeys(ret);
//     const res = normalize(camelizedJson, itemSchema);
//     let { entities, result } = res || {};
//     return { db: entities, result, id };
//   });
// };
// const _retrieve = (args, page = -1) => {
//   return retrieveProduct(args).then(ret => {
//     if (ret.errcode) {
//       throw ret;
//     }
//     let db = null;
//     let result = null;
//     const { data, ...info } = ret;
//     if (data) {
//       const camelizedJson = camelizeKeys(data);
//       const res = normalize(camelizedJson, [itemSchema]);
//       db = res.entities;
//       result = res.result;
//     }
//     //console.log("result:", ret, schema);
//     return { args, page, db, result, info };
//   });
// };
// let {
//   createApiAction,
//   createDefaultOneSuccessHandler,
//   defRetrieveSuccessHandler,
//   defRetrieveFailureHandler,
//   defRetrieveRequestHandler
// } = createModule('log');
// export const { create } = createApiAction('create', {
//   api: _create,
//   successHandler: createDefaultOneSuccessHandler('create')
// });
// export const { update } = createApiAction('update', {
//   api: _update,
//   successHandler: createDefaultOneSuccessHandler('update')
// });
// export const { remove } = createApiAction('remove', {
//   api: _remove,
//   successHandler: createDefaultOneSuccessHandler('remove')
// });
// export const { get } = createApiAction('get', {
//   api: _get,
//   successHandler: createDefaultOneSuccessHandler('get')
// });
// export const { retrieve } = createApiAction('retrieve', {
//   api: _retrieve,
//   requestHandler: defRetrieveRequestHandler,
//   failureHandler: defRetrieveFailureHandler,
//   successHandler: defRetrieveSuccessHandler
// });

/**
 * 方案二，使用_baseMongo.js内置的 wrapCreate, wrapUpdate, wrapRemove, wrapGet, wrapRetrieve对api进行包装，对数组数据进行扁平化处理
 * 使用 createDefaultOneSuccessHandler, defRetrieveSuccessHandler, defRetrieveFailureHandler, defRetrieveRequestHandler对进入reducer的数据进行处理，形成redux的database-store
 */
// let {
//   createApiAction,
//   createDefaultOneSuccessHandler,
//   defRetrieveSuccessHandler,
//   defRetrieveFailureHandler,
//   defRetrieveRequestHandler
// } = createModule('log');
// export const { create } = createApiAction('create', {
//   api: wrapCreate(createProduct, itemSchema),
//   successHandler: createDefaultOneSuccessHandler('create')
// });
// export const { update } = createApiAction('update', {
//   api: wrapUpdate(updateProduct, itemSchema),
//   successHandler: createDefaultOneSuccessHandler('update')
// });
// export const { remove } = createApiAction('remove', {
//   api: wrapRemove(deleteProduct, itemSchema),
//   successHandler: createDefaultOneSuccessHandler('remove')
// });
// export const { get } = createApiAction('get', {
//   api: wrapGet(getProduct, itemSchema),
//   successHandler: createDefaultOneSuccessHandler('get')
// });
// export const { retrieve } = createApiAction('retrieve', {
//   api: wrapRetrieve(retrieveProducts, itemSchema),
//   requestHandler: defRetrieveRequestHandler,
//   failureHandler: defRetrieveFailureHandler,
//   successHandler: defRetrieveSuccessHandler
// });

/**
 * 方案三，使用createDefaultCRUDApiActions来简化创建固定格式的CRUD-actions
 */
let { createDefaultCRUDApiActions } = createModule(moduleName);
export const {
  create,
  update,
  remove,
  get,
  retrieve
} = createDefaultCRUDApiActions({
  schema: itemSchema,
  apiCreate: createProduct,
  apiUpdate: updateProduct,
  apiRemove: deleteProduct,
  apiGet: getProduct,
  apiRetrieve: retrieveProducts
});
