import {
  cachedDbTableSelector,
  cachedDbModuleActionSelector
} from './_database';
import { createSelector } from 'reselect';

const moduleName = 'setting';
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

export const tagSelect = state => state.database[moduleName].tag;
export const categorySelect = state => state.database[moduleName].category;
export const productTypeSelect = state =>
  state.database[moduleName].productType;
export const tagDataSelect = state => state.database[moduleName].tag.item;
export const categoryDataSelect = state =>
  state.database[moduleName].category.item;
export const productTypeDataSelect = state =>
  state.database[moduleName].productType.item;
export const indexPageDataSelect = state =>
  state.database[moduleName].indexPage.item;

export const categoryDataEducationSelect = createSelector(
  categoryDataSelect,
  data => {
    let categoryEducation = null;
    let categories = data && data.desc;
    //console.log("categoryDataEducationSelect:", categories);
    if (categories) {
      for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        if (category && category.alias == 'education') {
          categoryEducation = category;
          break;
        }
      }
    }
    categories = categoryEducation && categoryEducation.children;
    return categories;
  }
);
