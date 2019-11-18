// !!!CAUTION: 每加一个reducer，需要手动加入到_database.js中，以便reducer能正常工作
import { createModule } from './_baseMongo';
import { getPointUser as apiGet } from 'utils/apis';
import { schema } from 'normalizr';

let moduleName = 'pointUser';
const itemSchema = new schema.Entity(
  `${moduleName}s`,
  {},
  {
    idAttribute: 'id'
  }
);

let { createDefaultCRUDApiActions } = createModule(moduleName);
export const { get } = createDefaultCRUDApiActions({
  schema: itemSchema,
  apiGet
});
