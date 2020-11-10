import { createContext } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';

import * as jsonPatch from './lib/json-patch.js';

let onPatch = (_) => void 0;

export function setOnPatch(newOnPatch) {
  onPatch = newOnPatch;
}

export const patches = {
  addItemToList: function addItemToList(listId, item) {
    return [
      { op: 'add', path: `/lists/${listId}/items/${item.id}`, value: item },
    ];
  },

  addItemToRecipe: function addItemToList(listId, recipeId, item) {
    return [
      { op: 'add', path: `/lists/${listId}/recipes/${recipeId}/items/${item.id}`, value: item },
    ];
  },

  addList: function addList(list) {
    return [
      { op: 'add', path: `/lists/${list.id}`, value: list },
    ];
  },

  addRecipe: function addRecipe(listId, recipe) {
    return [
      { op: 'add', path: `/lists/${listId}/recipes/${recipe.id}`, value: recipe },
    ];
  },

  addRecipeToList: function addRecipeToList(listId, recipe) {
    return Object.values(recipe.items).map((item) => ({
      // FIXME: not good
      op: 'add', path: `/lists/${listId}/items/${item.id}`, value: { ...item, createdAt: new Date().valueOf(), doneAt: null },
    }));
  },

  doItem: function doItem(listId, itemId, doneAt) {
    return [
      { op: 'replace', path: `/lists/${listId}/items/${itemId}/doneAt`, value: doneAt },
    ];
  },

  reset: function reset(newStore) {
    return [
      { op: 'replace', path: '', value: newStore }
    ];
  },

  removeItemFromList: function removeItemFromList(listId, itemId) {
    return [
      { op: 'remove', path: `/lists/${listId}/items/${itemId}` }
    ];
  },

  removeItemFromRecipe: function removeItemFromList(listId, recipeId, itemId) {
    return [
      { op: 'remove', path: `/lists/${listId}/recipes/${recipeId}/items/${itemId}` }
    ];
  },

  removeList: function removeList(listId) {
    return [
      { op: 'remove', path: `/lists/${listId}` }
    ]
  },

  removeRecipe: function removeList(listId, recipeId) {
    return [
      { op: 'remove', path: `/lists/${listId}/recipes/${recipeId}` }
    ]
  },

  undoItem: function doItem(listId, itemId) {
    return [
      { op: 'replace', path: `/lists/${listId}/items/${itemId}/doneAt`, value: null },
    ];
  },
};

export function applyPatch(state, patch) {
  console.debug('patching', patch);

  try {
    const newState = jsonPatch.apply(state, patch);

    console.debug('new state', newState);

    if (!patch.ignoreListener) {
      onPatch(patch);
    }

    return newState;
  } catch (e) {
    console.error('patch error', e);

    return state;
  }
};

export const context = createContext();