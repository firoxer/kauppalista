import { html, useContext, useState } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';
import { createCssComponent } from '../lib/css-component.js';
import { navigateTo } from '../lib/use-url-path.js';
import { sha256 } from '../lib/sha256.js';

import Button from './ui/buttons/Button.js';
import CrossIcon from './ui/icons/CrossIcon.js';
import Header from './ui/Header.js';
import IconButton from './ui/buttons/IconButton.js';
import ItemInput from './ItemInput.js';
import LeftArrowIcon from './ui/icons/LeftArrowIcon.js';
import WidePage from './ui/WidePage.js';
import colors from './ui/colors.js';
import { context, patches } from '../store.js';
import { translate } from '../services/translate.js';

const GoBackButton = IconButton.extend(`
  background-color: ${colors.tertiary};
`, html`
  <${LeftArrowIcon} color=${colors.tertiaryText} />
`);

const Buttons = createCssComponent('div', `
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-top: -0.5rem; /* To counter the +0.5rem below */

  & > * {
    margin-left: 0.5rem;
    margin-top: 0.5rem;
  }

  & > *:first-child {
    margin-right: auto;
    margin-left: 0;
  }
`);

const DeleteRecipeButton = Button.extend(`
  background-color: ${colors.danger};
  color: ${colors.dangerText};
`);

const AddRecipeToListButton = Button.extend(`
  background-color: ${colors.primary};
  color: ${colors.primaryText};
`);

const RecipeHeader = Header.extend(`
  margin-right: auto;
  margin-top: 2rem;
`);

// Heavily copied from Button
const Item = createCssComponent('div', `
  align-items: center;
  background-color: ${colors.secondary};
  border-radius: 1rem;
  box-sizing: border-box;
  color: ${colors.secondaryText};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 1rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0.25rem;
  text-align: center;

  & > :only-child {
    margin-left: auto;
    margin-right: auto;
  }
`);

const ItemName = createCssComponent('div', `
  text-align: center;
  width: 75%;
`);

const ItemButtonWrapper = createCssComponent('div', `
  height: 1rem;
`);

const ItemButton = IconButton.extend(`
  position: relative;
  top: -0.5rem;
  transform: scale(0.75);
`);

const ItemDeleteButton = ItemButton.extend(`
  background-color: ${colors.danger};
  transform-origin: left;
`, html`
  <${CrossIcon} color=${colors.dangerText} />
`);

// TODO: Do this nicely
const HiddenAlignmentButton = ItemButton;

export default function Recipe({ list, recipe }) {
  const { dispatch } = useContext(context);

  const [selectedItemId, selectItemId] = useState(null);

  const removeItemFromRecipe = (itemId) => {
    dispatch(patches.removeItemFromRecipe(list.id, recipe.id, itemId));
    requestAnimationFrame(() => selectItemId(null)); // FIXME: This should not require requestAnimationFrame
  };

  const renderedItems = Object.values(recipe.items)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) =>
      selectedItemId === item.id
        ? html`
            <${Item}>
              <${ItemButtonWrapper}>
                <${ItemDeleteButton} onClick=${() => removeItemFromRecipe(item.id)} />
              <//>

              <${ItemName}>${item.name}<///>
 
              <${ItemButtonWrapper}>
                <${HiddenAlignmentButton} />
              <//>
            <//>
          `
        : html`
            <${Item} onClick=${() => selectItemId(item.id)}>
              <${ItemName}>${item.name}<//>
            <//>
          `
    );

  const addRecipeToList = () => {
    dispatch(patches.addRecipeToList(list.id, recipe));
    navigateTo(`/lists/${list.id}`);
  };

  const onItemInput = async (input) => {
    const createdAt = new Date().valueOf();

    const item = {
      id: await sha256(input + String(createdAt)),
      name: input,
      createdAt,
      doneAt: null,
    };

    dispatch(patches.addItemToRecipe(list.id, recipe.id, item));
  };

  return html`
    <${WidePage}>
      <${Buttons}>
        <${GoBackButton} onClick=${() => navigateTo(`/lists/${list.id}/recipes`)} />

        <${DeleteRecipeButton} onClick=${() => navigateTo(`/lists/${list.id}/recipes/${recipe.id}/deletion`)}>
          ${translate('delete')}
        <//>

        <${AddRecipeToListButton} onClick=${addRecipeToList}>
          ${translate('add to list')}
        <//>
      <//>

      <${RecipeHeader}>${recipe.name}<//>

      <${ItemInput} autocomplete=${false} list=${recipe} onInput=${onItemInput} />

      ${renderedItems}
    <//>
  `;
}
