// !!!CAUTION: 每加一个reducer，需要手动加入到_database.js中，以便reducer能正常工作
import { createModule } from './_baseMongo';
import {
  createShopManager as apiCreate,
  updateShopManager as apiUpdate,
  deleteShopManager as apiRemove,
  getShopManager as apiGet,
  retrieveShopManagers as apiRetrieve
} from 'utils/apis';
import { schema } from 'normalizr';

let moduleName = 'shopManager';
const itemSchema = new schema.Entity(
  `${moduleName}s`,
  {},
  {
    idAttribute: 'id'
  }
);

let { createDefaultCRUDApiActions } = createModule(moduleName);
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
