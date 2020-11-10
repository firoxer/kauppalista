import { html, useContext } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';
import { createCssComponent } from '../lib/css-component.js';
import { navigateTo } from '../lib/use-url-path.js';

import NarrowPage from './ui/NarrowPage.js';
import VerticalCentering from './ui/VerticalCentering.js';
import colors from './ui/colors.js';
import { context, patches } from '../store.js';
import Button from './ui/buttons/Button.js';
import { translate } from '../services/translate.js';

const Wrapper = createCssComponent('div', `
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  height: 8rem;
`)

const Buttons = createCssComponent('div', `
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`);

const YesButton = Button.extend(`
  background-color: ${colors.danger};
  color: ${colors.dangerText};
`);

const NoButton = Button.extend(`
  background-color: ${colors.primary};
  color: ${colors.primaryText};
`);

export default function DeleteList({ list }) {
  const { dispatch } = useContext(context);

  const translationSlug = Object.keys(list.items).length === 1
    ? 'are you sure you want to delete the list with one item'
    : 'are you sure you want to delete the list with multiple items';

  const remove = () => {
    dispatch(patches.removeList(list.id));
    navigateTo('/');
  };

  return html`
    <${NarrowPage}>
      <${VerticalCentering}>
        <${Wrapper}>
          <p>${translate(translationSlug, list.name, Object.keys(list.items).length)}</p>

          <${Buttons}>
            <${NoButton} onClick=${() => navigateTo(`/lists/${list.id}`)}>
              ${translate('no, take me back')}
            <//>

            <${YesButton} onClick=${remove}>
              ${translate('yes')}
            <//>
          <//>
        <//>
      <//>
    <//>
  `;
}