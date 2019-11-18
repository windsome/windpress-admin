import {
  cachedDbTableSelector,
  cachedDbModuleActionSelector
} from './_database';

const moduleName = 'pointUser';
export const dbSelect = state => cachedDbTableSelector(state, `${moduleName}s`);
export const getSelect = state =>
  cachedDbModuleActionSelector(state, moduleName, 'get');
