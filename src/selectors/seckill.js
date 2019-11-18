import {
  cachedDbTableSelector,
  cachedDbModuleActionSelector
} from './_database';

const moduleName = 'seckill';
export const dbSelect = state => cachedDbTableSelector(state, `${moduleName}s`);
export const createSelect = state =>
  cachedDbModuleActionSelector(state, moduleName, 'create');
export const updateSelect = state =>
  cachedDbModuleActionSelector(state, moduleName, 'update');
export const removeSelect = state =>
  cachedDbModuleActionSelector(state, moduleName, 'remove');
export const getSelect = state =>
  cachedDbModuleActionSelector(state, moduleName, 'get');
export const retrieveSelect = state =>
  cachedDbModuleActionSelector(state, moduleName, 'retrieve');
