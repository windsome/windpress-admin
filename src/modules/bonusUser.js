// !!!CAUTION: 每加一个reducer，需要手动加入到_database.js中，以便reducer能正常工作
import { createModule } from './_baseMongo';
import {
  createBonusUser as apiCreate,
  updateBonusUser as apiUpdate,
  deleteBonusUser as apiRemove,
  getBonusUser as apiGet,
  retrieveBonusUsers as apiRetrieve
} from 'utils/apisBonus';
import { schema } from 'normalizr';

let moduleName = 'bonusUser';
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
