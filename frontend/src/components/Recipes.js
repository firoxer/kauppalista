import { html } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';
import { createCssComponent } from '../lib/css-component.js';
import { navigateTo } from '../lib/use-url-path.js';

import FullWidthButton from './ui/buttons/FullWidthButton.js';
import Header from './ui/Header.js';
import IconButton from './ui/buttons/IconButton.js';
import LeftArrowIcon from './ui/icons/LeftArrowIcon.js';
import PlusIcon from './ui/icons/PlusIcon.js';
import WidePage from './ui/WidePage.js';
import colors from './ui/colors.js';
import { shuffle } from '../util.js';
import { translate } from '../services/translate.js';

const Column = createCssComponent('div', `
  align-items: center;
  display: flex;
  flex-direction: column;
`)

const GoBackButton = IconButton.extend(`
  background-color: ${colors.tertiary};
`, html`
  <${LeftArrowIcon} color=${colors.tertiaryText} />
`);

const RecipesHeader = Header.extend(`
  margin-right: auto;
  margin-top: 2rem;
`);

const Placeholder = createCssComponent('div', `
  color: ${colors.textMuted};
  margin-bottom: 1rem;
`);

const RecipeButton = FullWidthButton.extend(`
  background-color: ${colors.primary};
  color: ${colors.primaryText};
`);

const AddButton = IconButton.extend(`
  background-color: ${colors.secondary};
  margin-left: auto;
  margin-top: 0.5rem;
`, html`
  <${PlusIcon} color=${colors.secondaryText} />
`);

export default function Recipes({ list }) {
  let renderedRecipes =
    Object.keys(list.recipes).length === 0
      ? html`<${Placeholder}>${translate('there are no recipes...')}<//>`
      : Object.values(list.recipes).map((recipe) => html`
        <${RecipeButton} onClick=${() => navigateTo(`/lists/${list.id}/recipes/${recipe.id}`)}>
          ${recipe.name}
        <//>
      `);

  shuffle(renderedRecipes);

  return html`
    <${WidePage}>
      <${GoBackButton} onClick=${() => navigateTo(`/lists/${list.id}`)} />

      <${Column}>
        <${RecipesHeader}>${translate('recipes for list', list.name)}<//>

        ${renderedRecipes}

        <${AddButton} onClick=${() => navigateTo(`/lists/${list.id}/add-recipe`)} />
      <//>
    <//>
  `;
}
