import { createActions, handleActions } from 'redux-actions';
import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import merge from 'lodash/merge';

export const _key = args => 'q_' + args;

/**
 * action 映射表
 */
let actionHandlerMap = {};
/**
 * 初始状态映射表
 */
let defInitState = {
  db: {}
};

/**
 * 最终生成reducer，供redux进行使用。
 */
export const getReducer = () => {
  return handleActions(actionHandlerMap, defInitState);
};

/**
 * 创建模块，一般一个文件一个模块。基本描述某个数据库表。
 * @param {string} moduleName 模块名称，某个意义上独立的模块，比如积分模块。但简单起见，通常为数据库表名。如果包含子表的，则自动更新到db下相应表中去。
 */
export const createModule = moduleName => {
  let moduleNameLowerCase = moduleName && moduleName.toLowerCase();
  let moduleNameUpperCase = moduleName && moduleName.toUpperCase();
  /**
   * 创建redux的主action，包括了request, fetch, success/fail流程的一个获取数据action.
   * @param {string} actionName redux的action名，同一个模块下不可重复，不区分大小写。
   * @param {*} param2
   * api: fetch api, 返回promise.
   * initState: action初始状态。
   * 如果原初始化state中已经有相应字段，则不操作。
   * 如果initState为空，则默认添加一个action名字段到module下。
   * 如果initState不为空，则合并进去。
   * 如：原状态为：{db:{}, get:{}}，此时新创建一个remove action，但initState为空，则合并结果为：{db:{}, get:{}, remove:{}}
   * 如：原状态为：{db:{}, get:{}}，此时新创建一个logout action，但initState不为空，为{login:{}}，则合并结果为：{db:{}, get:{}, login:{}}
   */
  const createApiAction = (
    actionName,
    { api, requestHandler, successHandler, failureHandler, initState }
  ) => {
    //console.log('api:', api);
    let actionNameLowerCase = actionName && actionName.toLowerCase();
    let actionNameUpperCase = actionName && actionName.toUpperCase();
    const {
      [moduleNameLowerCase]: {
        [actionNameLowerCase]: { request, success, failure }
      }
    } = createActions({
      [moduleNameUpperCase]: {
        [actionNameUpperCase]: {
          REQUEST: null,
          SUCCESS: null,
          FAILURE: null
        }
      }
    });

    const apiAction = (...args) => {
      // should not use arguments.
      // let args = Array.prototype.slice.call(arguments);
      return (dispatch, getState) => {
        dispatch(request({ _vargs: args }));
        //console.log('apiAction: args:', args, arguments[0], arguments[1])
        return api
          .apply(null, args)
          .then(ret => {
            dispatch(success({ ...ret, _vargs: args }));
            return ret;
          })
          .catch(error => {
            dispatch(failure({ error, _vargs: args }));
            //return null;
            throw error;
          });
      };
    };

    if (!actionHandlerMap[moduleNameUpperCase])
      actionHandlerMap[moduleNameUpperCase] = {};
    actionHandlerMap[moduleNameUpperCase][actionNameUpperCase] = {
      REQUEST: requestHandler || createDefaultRequestHandler(actionName),
      SUCCESS: successHandler || createDefaultSuccessHandler(actionName),
      FAILURE: failureHandler || createDefaultFailureHandler(actionName)
    };
    if (!defInitState[moduleName]) defInitState[moduleName] = {};
    if (initState) {
      let oldInitState = defInitState[moduleName];
      defInitState[moduleName] = { ...oldInitState, ...initState };
    } else defInitState[moduleName][actionName] = {};

    return { [actionName]: apiAction, apiAction };
  };

  const createDefaultCRUDApiActions = ({
    schema,
    apiCreate,
    apiUpdate,
    apiRemove,
    apiGet,
    apiRetrieve
  }) => {
    const { create } =
      (apiCreate &&
        createApiAction('create', {
          api: wrapCreate(apiCreate, schema),
          successHandler: createDefaultOneSuccessHandler('create')
        })) ||
      {};
    const { update } =
      (apiUpdate &&
        createApiAction('update', {
          api: wrapUpdate(apiUpdate, schema),
          successHandler: createDefaultOneSuccessHandler('update')
        })) ||
      {};
    const { remove } =
      (apiRemove &&
        createApiAction('remove', {
          api: wrapRemove(apiRemove, schema),
          successHandler: createDefaultOneSuccessHandler('remove')
        })) ||
      {};
    const { get } =
      (apiGet &&
        createApiAction('get', {
          api: wrapGet(apiGet, schema),
          successHandler: createDefaultOneSuccessHandler('get')
        })) ||
      {};
    const { retrieve } =
      (apiRetrieve &&
        createApiAction('retrieve', {
          api: wrapRetrieve(apiRetrieve, schema),
          requestHandler: defRetrieveRequestHandler,
          failureHandler: defRetrieveFailureHandler,
          successHandler: defRetrieveSuccessHandler
        })) ||
      {};
    return { create, update, remove, get, retrieve };
  };

  const createDefaultRequestHandler = actionName => {
    return (state, action) => ({
      ...state,
      [moduleName]: {
        ...(state[moduleName] || {}),
        [actionName]: { fetching: true, error: null }
      }
    });
  };
  const createDefaultSuccessHandler = actionName => {
    return (state, action) => ({
      ...state,
      [moduleName]: {
        ...(state[moduleName] || {}),
        [actionName]: { fetching: false, error: null, data: action.payload }
      }
    });
  };
  const createDefaultFailureHandler = actionName => {
    return (state, action) => ({
      ...state,
      [moduleName]: {
        ...(state[moduleName] || {}),
        [actionName]: { fetching: false, error: action.payload }
      }
    });
  };
  /**
   * create an actionHandler which deal with one item or null.
   * normally deal with create/update/remove/get result.
   * eg:
   * create: { db, result }, {db:{user: {2:{...userinfo}}}, result:2}
   * update: { [db,] result }, {db:{user: {2:{...userinfo}}}, result:2} or {result: 2}
   * remove: { [db,] result }, {db:{user: {2:null}}, result:2} or {result: 2}
   * get: { db, result, id }, {db:{user: {2:{...userinfo}}}, result:2, id:2}
   * @param {string} actionName
   */
  const createDefaultOneSuccessHandler = actionName => {
    return (state, action) => ({
      ...state,
      db: _updateDb(state.db, action.payload.db),
      [moduleName]: {
        ...(state[moduleName] || {}),
        [actionName]: {
          fetching: false,
          error: null,
          id: action.payload.result
        }
      }
    });
  };

  const defRetrieveRequestHandler = (state, action) => {
    let { args = '' } = action.payload || {};
    let key = _key(args);
    let oldModule = state[moduleName] || {};
    let oldRetrieveKey = (oldModule.retrieve && oldModule.retrieve[key]) || {};

    let nextRetrieveKey = {
      ...oldRetrieveKey,
      fetching: true
    };

    return {
      ...state,
      [moduleName]: {
        ...(state[moduleName] || {}),
        retrieve: {
          ...(oldModule.retrieve || {}),
          [key]: nextRetrieveKey
        }
      }
    };
  };

  const defRetrieveFailureHandler = (state, action) => {
    let { args = '', error } = action.payload || {};
    let key = _key(args);
    let oldModule = state[moduleName] || {};
    let oldRetrieveKey = (oldModule.retrieve && oldModule.retrieve[key]) || {};

    let nextRetrieveKey = {
      ...oldRetrieveKey,
      fetching: false,
      error
    };

    return {
      ...state,
      [moduleName]: {
        ...(state[moduleName] || {}),
        retrieve: {
          ...(oldModule.retrieve || {}),
          [key]: nextRetrieveKey
        }
      }
    };
  };

  const defRetrieveSuccessHandler = (state, action) => {
    let { args, page, result = [], info } = action.payload;
    let key = _key(args);
    let oldModule = state[moduleName] || {};
    let oldRetrieveKey = (oldModule.retrieve && oldModule.retrieve[key]) || {};

    let nextResult = null;
    let nextPages = null;
    if (page < 0) {
      // refresh result.
      nextResult = result;
      nextPages = [0];
    } else {
      let oldResult = oldRetrieveKey.result || [];
      let oldPages = oldRetrieveKey.pages || [];
      nextResult = [...oldResult, ...(result || [])];
      nextPages = [...oldPages, page];
    }
    let nextRetrieveKey = {
      fetching: false,
      error: null,
      result: nextResult,
      pages: nextPages,
      info
    };
    // // content in info from server side.
    // info = {
    //   total: result.count,
    //   count: objs.length,
    //   date: new Date(),
    //   page,
    //   limit,
    // }
    return {
      ...state,
      db: _updateDb(state.db, action.payload.db),
      [moduleName]: {
        ...(state[moduleName] || {}),
        retrieve: {
          ...(oldModule.retrieve || {}),
          [key]: nextRetrieveKey
        }
      }
    };
  };

  return {
    createApiAction,
    createDefaultCRUDApiActions,
    createDefaultRequestHandler,
    createDefaultSuccessHandler,
    createDefaultFailureHandler,
    createDefaultOneSuccessHandler,
    defRetrieveSuccessHandler,
    defRetrieveFailureHandler,
    defRetrieveRequestHandler
  };
};

const _updateDb = (old, updated) => {
  let next = (old && { ...old }) || {};
  if (updated) {
    for (const prop in updated) {
      if (updated.hasOwnProperty(prop)) {
        let nextProp = next[prop] || {};
        let updatedProp = updated[prop];
        if (typeof updatedProp === 'object') {
          // update
          //console.log('old:', old, 'nextProp:', nextProp, ', updated:', updatedProp);
          nextProp = { ...nextProp, ...updatedProp };
          next = { ...next, [prop]: nextProp };
        }
      }
    }
  }
  return next;
};
const _getArg0 = args => {
  return (args && args.length > 0 && args[0]) || null;
};

export default createModule;

///////////////////////////////////////////////////
// for reducers.
///////////////////////////////////////////////////
export const wrapCreate = (api, schema) => {
  return (args = {}) => {
    return api(args).then(ret => {
      if (!ret || (!ret.id && !ret._id)) {
        console.log('no id:', ret);
        throw new Error('no id return!');
      }
      const camelizedJson = camelizeKeys(ret);
      const res = normalize(camelizedJson, schema);
      let { entities, result } = res || {};
      return { db: entities, result, id: result, item: ret };
    });
  };
};

export const wrapUpdate = (api, schema) => {
  return (id, args = {}) => {
    return api(id, args).then(ret => {
      if (ret.id) {
        // has updated item.
        const camelizedJson = camelizeKeys(ret);
        const res = normalize(camelizedJson, schema);
        let { entities, result } = res || {};
        return { db: entities, result, id };
      }
      return { result: id, id };
    });
  };
};
export const wrapRemove = (api, schema) => {
  return id => {
    return api(id).then(ret => {
      if (ret.errcode) {
        throw ret;
      }
      // delete ok.
      return { db: { [schema.key]: { [id]: null } }, result: id, id };
    });
  };
};
export const wrapGet = (api, schema) => {
  return id => {
    return api(id).then(ret => {
      if (ret.errcode) {
        throw ret;
      }
      // has got item.
      const camelizedJson = camelizeKeys(ret);
      const res = normalize(camelizedJson, schema);
      let { entities, result } = res || {};
      return { db: entities, result, id: result, item: ret };
    });
  };
};
export const wrapRetrieve = (api, schema) => {
  return (args = '', page = -1) => {
    return api(args + ';page=' + page).then(ret => {
      if (ret.errcode) {
        throw ret;
      }
      let db = null;
      let result = null;
      const { data, ...info } = ret;
      if (data) {
        const camelizedJson = camelizeKeys(data);
        const res = normalize(camelizedJson, [schema]);
        db = res.entities;
        result = res.result;
      }
      return { args, page, db, result, info };
    });
  };
};
