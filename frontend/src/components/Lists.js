import { html } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';
import { createCssComponent } from '../lib/css-component.js';
import { navigateTo } from '../lib/use-url-path.js';

import FullWidthButton from './ui/buttons/FullWidthButton.js';
import Header from './ui/Header.js';
import IconButton from './ui/buttons/IconButton.js';
import NarrowPage from './ui/NarrowPage.js';
import PlusIcon from './ui/icons/PlusIcon.js';
import VerticalCentering from './ui/VerticalCentering.js';
import colors from './ui/colors.js';
import { translate } from '../services/translate.js';

const Menu = createCssComponent('div', `
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`);

const Placeholder = createCssComponent('div', `
  color: ${colors.textMuted};
  margin-bottom: 1rem;
`);

const ListButton = FullWidthButton.extend(`
  background-color: ${colors.primary};
  color: ${colors.primaryText};
`);

const AddButton = IconButton.extend(
  `
    background-color: ${colors.secondary};
    margin-left: auto;
    margin-top: 0.5rem;
  `,
  html`<${PlusIcon} color=${colors.secondaryText} />`
);

export default function Lists({ lists }) {
  const renderedLists =
    Object.keys(lists).length === 0
      ? html`<${Placeholder}>${translate('there are no lists...')}<//>`
      : Object.values(lists).map((list) => html`
        <${ListButton} onClick=${() => navigateTo(`/lists/${list.id}`)}>
          ${list.name}
        <//>
      `);

  return html`
    <${NarrowPage}>
      <${VerticalCentering}>
        <${Menu}>
          <${Header}>Kauppalista<//>

          ${renderedLists}

          <${AddButton} onClick=${() => navigateTo('/add-list')} />
        <//>
      <//>
    <//>
  `;
}