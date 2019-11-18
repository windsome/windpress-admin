// !!!CAUTION: 每加一个reducer，需要手动加入到_database.js中，以便reducer能正常工作
import { createModule } from './_baseMongo';
import {
  createOrder as apiCreate,
  updateOrder as apiUpdate,
  deleteOrder as apiRemove,
  getOrder as apiGet,
  retrieveOrders as apiRetrieve
} from 'utils/apis';
import { schema } from 'normalizr';

let moduleName = 'order';
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
