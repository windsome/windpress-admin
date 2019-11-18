// !!!CAUTION: 每加一个reducer，需要手动加入到_database.js中，以便reducer能正常工作
import { createModule } from './_baseMongo';
import {
  createSeckill as apiCreate,
  updateSeckill as apiUpdate,
  deleteSeckill as apiRemove,
  getSeckill as apiGet,
  retrieveSeckills as apiRetrieve
} from 'utils/apis';
import { schema } from 'normalizr';

let moduleName = 'seckill';
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
