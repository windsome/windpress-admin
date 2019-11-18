// !!!CAUTION: 每加一个reducer，需要手动加入到_database.js中，以便reducer能正常工作
import { createModule, wrapCreate } from './_baseMongo';
import {
  createOption as apiCreate,
  updateOption as apiUpdate,
  deleteOption as apiRemove,
  getOption as apiGet,
  retrieveOptions as apiRetrieve,
  createRecord
} from 'utils/apisVote';
import { schema } from 'normalizr';

let moduleName = 'voteOption';
const itemSchema = new schema.Entity(
  `${moduleName}s`,
  {},
  {
    idAttribute: 'id'
  }
);

let {
  createApiAction,
  createDefaultCRUDApiActions,
  createDefaultOneSuccessHandler
} = createModule(moduleName);
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

/**
 * TODO: different to old.
 */
export const { add } = createApiAction('add', {
  api: wrapCreate(createRecord, itemSchema),
  successHandler: createDefaultOneSuccessHandler('add')
});
