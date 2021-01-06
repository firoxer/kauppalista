import { html, useContext, useState } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';
import { createCssComponent } from '../lib/css-component.js';
import { navigateTo } from '../lib/use-url-path.js';
import { sha256 } from '../lib/sha256.js';

import Button from './ui/buttons/Button.js';
import CallbackOnViewing from './ui/CallbackOnViewing.js';
import CrossIcon from './ui/icons/CrossIcon.js';
import Header from './ui/Header.js';
import IconButton from './ui/buttons/IconButton.js';
import ItemInput from './ItemInput.js';
import LeftArrowIcon from './ui/icons/LeftArrowIcon.js';
import OkIcon from './ui/icons/OkIcon.js';
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

const DeleteListButton = Button.extend(`
  background-color: ${colors.danger};
  color: ${colors.dangerText};
`);

const RecipesButton = Button.extend(`
  background-color: ${colors.secondary};
  color: ${colors.secondaryText};
`);

const ListHeader = Header.extend(`
  margin-bottom: 2rem;
  margin-right: auto;
  margin-top: 2rem;
`);

// Heavily copied from Button
const Item = createCssComponent('div', `
  align-items: center;
  background-color: ${colors.primary};
  color: ${colors.primaryText};
  border-radius: 1rem;
  box-sizing: border-box;
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
  word-wrap: anywhere;
`);

const UndoneItem = Item;

const FreshlyDoneItem = Item.extend(`
  background-color: ${colors.primaryMuted};
  color: ${colors.primaryMutedText};
  text-decoration: line-through;
`);

const LongDoneItem = Item.extend(`
  background-color: ${colors.primaryGray};
  color: ${colors.primaryGrayText};
  text-decoration: line-through;
`);

const ItemButtonWrapper = createCssComponent('div', `
  height: 1rem;
`);

const ItemButton = IconButton.extend(`
  position: relative;
  top: -0.5rem;
  transform: scale(0.75);
`);

const ItemButtonPlaceholder = ItemButton.extend(`
  height: 1rem;
  width: 2rem;
`);

const ItemDeleteButton = ItemButton.extend(`
  background-color: ${colors.danger};
  transform-origin: left;
`, html`
  <${CrossIcon} color=${colors.dangerText} />
`);

const ItemDoButton = ItemButton.extend(`
  background-color: ${colors.secondary};
  transform-origin: right;
`, html`
  <${OkIcon} color=${colors.secondaryText} />
`);

const ItemUndoButton = ItemButton.extend(`
  background-color: ${colors.secondary};
  transform-origin: right;
`, html`
  <${OkIcon} color=${colors.secondaryText} />
`);

const LONG_DONE_ITEMS_PER_LAZY_LOAD = 50;

export default function List({ list }) {
  const { dispatch } = useContext(context);

  const [selectedItemId, selectItemId] = useState(null);

  const [longDoneItemsRendered, setLongDoneItemsRendered] = useState(0);

  const currentTime = new Date().valueOf();
  const newerThanOneDay = (time) => currentTime - time < 86400000;

  const removeItemFromList = (itemId) => {
    dispatch(patches.removeItemFromList(list.id, itemId));
    requestAnimationFrame(() => selectItemId(null)); // FIXME: This should not require requestAnimationFrame
  };

  const doItem = (itemId) => {
    dispatch(patches.doItem(list.id, itemId, new Date().valueOf()));
    requestAnimationFrame(() => selectItemId(null)); // FIXME: This should not require requestAnimationFrame
  };

  const undoItem = (itemId) => {
    dispatch(patches.undoItem(list.id, itemId));
    requestAnimationFrame(() => selectItemId(null)); // FIXME: This should not require requestAnimationFrame
  };

  const renderedUndoneItems =
    Object.values(list.items)
      .filter(({ doneAt }) => doneAt === null)
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((item) =>
        selectedItemId === item.id
          ? html`
            <${UndoneItem}>
              <${ItemButtonWrapper}>
                <${ItemDeleteButton} onClick=${() => removeItemFromList(item.id)} />
              <//>

              <${ItemName}>${item.name}<//>

              <${ItemButtonWrapper}>
                <${ItemDoButton} onClick=${() => doItem(item.id)} />
              <//>
            <//>
          `
          : html`
            <${UndoneItem} onClick=${() => selectItemId(item.id)}>
              <${ItemButtonPlaceholder} />
              <${ItemName}>${item.name}<//>
              <${ItemButtonPlaceholder} />
            <//>
          `
      );

  const renderedFreshlyDoneItems =
    Object.values(list.items)
      .filter(({ doneAt }) => doneAt !== null && newerThanOneDay(doneAt))
      .sort((a, b) => b.doneAt - a.doneAt)
      .map((item) =>
        selectedItemId === item.id
          ? html`
            <${FreshlyDoneItem}>
              <${ItemButtonWrapper}>
                <${ItemDeleteButton} onClick=${() => removeItemFromList(item.id)} />
              <//>

              <${ItemName}>${item.name}<//>

              <${ItemButtonWrapper}>
                <${ItemUndoButton} onClick=${() => undoItem(item.id)} />
              <//>
            <//>
          `
          : html`
            <${FreshlyDoneItem} onClick=${() => selectItemId(item.id)}>
              <${ItemButtonPlaceholder} />
              <${ItemName}>${item.name}<//>
              <${ItemButtonPlaceholder} />
            <//>
          `
      );

  const renderedLongDoneItems =
    Object.values(list.items)
      .filter(({ doneAt }) => doneAt !== null && !newerThanOneDay(doneAt))
      .sort((a, b) => b.doneAt - a.doneAt)
      .slice(0, longDoneItemsRendered)
      .map((item) =>
        selectedItemId === item.id
          ? html`
            <${LongDoneItem}>
              <${ItemButtonWrapper}>
                <${ItemDeleteButton} onClick=${() => removeItemFromList(item.id)} />
              <//>

              <${ItemName}>${item.name}<//>

              <${ItemButtonWrapper}>
                <${ItemUndoButton} onClick=${() => undoItem(item.id)} />
              <//>
            <//>
          `
          : html`
            <${LongDoneItem} onClick=${() => selectItemId(item.id)}>
              <${ItemButtonPlaceholder} />
              <${ItemName}>${item.name}<//>
              <${ItemButtonPlaceholder} />
            <//>
          `
      );

  const onItemInput = async (input) => {
    const createdAt = new Date().valueOf();

    const item = {
      id: await sha256(input + String(createdAt)),
      name: input,
      createdAt,
      doneAt: null,
    };

    dispatch(patches.addItemToList(list.id, item));
  };

  const renderMoreLongDoneItems = () => {
    setLongDoneItemsRendered(longDoneItemsRendered + LONG_DONE_ITEMS_PER_LAZY_LOAD);
  };

  return html`
    <${WidePage}>
      <${Buttons}>
        <${GoBackButton} onClick=${() => navigateTo('/')} />

        <${DeleteListButton} onClick=${() => navigateTo(`/lists/${list.id}/deletion`)}>
          ${translate('delete')}
        <//>

        <${RecipesButton} onClick=${() => navigateTo(`/lists/${list.id}/recipes`)}>
          ${translate('recipes')}
        <//>
      <//>

      <${ListHeader}>${list.name}<//>

      <${ItemInput} list=${list} onInput=${onItemInput} />

      ${renderedUndoneItems}

      ${renderedFreshlyDoneItems}

      <!-- The lazy load trigger is rendered early to smoothen scrolling -->
      ${renderedLongDoneItems.slice(0, renderMoreLongDoneItems.length - LONG_DONE_ITEMS_PER_LAZY_LOAD)}
      <${CallbackOnViewing} callback=${renderMoreLongDoneItems} />
      ${renderedLongDoneItems.slice(renderMoreLongDoneItems.length - LONG_DONE_ITEMS_PER_LAZY_LOAD)}
    <//>
  `;
}
