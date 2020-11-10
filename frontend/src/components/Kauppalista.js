import { html, useEffect, useState, useReducer } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';
import { useUrlPath } from '../lib/use-url-path.js';
import { createCssComponent } from '../lib/css-component.js';

import AddList from './AddList.js';
import AddRecipe from './AddRecipe.js';
import DeleteList from './DeleteList.js';
import DeleteRecipe from './DeleteRecipe.js';
import ErrorSplash from './ui/ErrorSplash.js';
import FullscreenLoader from './ui/FullscreenLoader.js';
import List from './List.js';
import Lists from './Lists.js';
import Recipe from './Recipe.js';
import Recipes from './Recipes.js';
import colors from './ui/colors.js';
import { ServerConnection } from '../services/server-connection.js';
import { applyPatch, context, patches, setOnPatch } from '../store.js';

const Root = createCssComponent('div', `
  background-color: ${colors.background};
  color: ${colors.text};
  min-height: 100vh;

  & ::selection {
    background: hsl(0, 0%, 0%);
    color: hsl(40, 20%, 98%);
  }
`);

export default function Kauppalista() {
  const [state, dispatch] = useReducer(applyPatch, null);

  const [connectionError, setConnectionError] = useState(null);

  const path = useUrlPath();

  const token = 'demo';

  useEffect(() => {
    const connection = new ServerConnection('wss://kauppalista2.rakkine.fi/ws', token);

    connection.listen(({ data, patch }) => {
      if (data) {
        const resetPatch = patches.reset(data);
        resetPatch.ignoreListener = true; // To prevent an infinite loop
        dispatch(resetPatch);
      }

      if (patch) {
        patch.ignoreListener = true; // To prevent an infinite loop
        dispatch(patch);
      }
    });

    connection.onError((error) => {
      setConnectionError(error);
    });

    setOnPatch((patch) => {
      connection.send({ patch });
    });
  }, []);

  if (connectionError) {
    return html`<${ErrorSplash}>${connectionError}<//>`;
  }

  const pageIsLoading = state === null;
  if (pageIsLoading) {
    return html`<${FullscreenLoader} />`;
  }

  const renderContentByPath = () => {
    if (path) {
      if (path === '/add-list') {
        return html`<${AddList} />`;
      }

      if (path.startsWith('/lists/')) {
        const pathParts = path.split('/').slice(1);

        const selectedListId = pathParts[1];
        if (selectedListId in state.lists) {
          const selectedList = state.lists[selectedListId];

          if (pathParts[2] === 'deletion') {
            return html`<${DeleteList} list=${selectedList} />`;
          } else if (pathParts[2] === 'add-recipe') {
            return html`<${AddRecipe} list=${selectedList} />`;
          } else if (pathParts[2] === 'recipes') {
            const selectedRecipeId = pathParts[3];

            if (selectedRecipeId in selectedList.recipes) {
              const selectedRecipe = selectedList.recipes[pathParts[3]];

              if (pathParts[4] === 'deletion') {
                return html`<${DeleteRecipe} list=${selectedList} recipe=${selectedRecipe} />`;
              } else {
                return html`<${Recipe} list=${selectedList} recipe=${selectedRecipe} />`;
              }
            } else {
              return html`<${Recipes} list=${selectedList} />`;
            }
          } else {
            return html`<${List} list=${selectedList} />`;
          }
        }
      }
    }

    return html`<${Lists} lists=${state.lists} />`;
  };

  return html`
    <${Root}>
      <${context.Provider} value=${{ state, dispatch }}>
        ${renderContentByPath()}
      <//>
    <//>
  `;
}
