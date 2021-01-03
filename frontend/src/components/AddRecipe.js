import { html, useContext, useEffect, useRef, useState } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';
import { createCssComponent } from '../lib/css-component.js';
import { navigateTo } from '../lib/use-url-path.js';

import LeftArrowIcon from './ui/icons/LeftArrowIcon.js';
import NarrowPage from './ui/NarrowPage.js';
import OkIcon from './ui/icons/OkIcon.js';
import TextInput from './ui/TextInput.js';
import VerticalCentering from './ui/VerticalCentering.js';
import colors from './ui/colors.js';
import { context, patches } from '../store.js';
import { sha256 } from '../lib/sha256.js';
import IconButton from './ui/buttons/IconButton.js';
import { translate } from '../services/translate.js';

const GoBackButton = IconButton.extend(`
  background-color: ${colors.tertiary};
`, html`
  <${LeftArrowIcon} color=${colors.tertiaryText} />
`);

const Form = createCssComponent('form', `
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  height: 12rem;
`)

const Text = createCssComponent('p', `
  margin: 0;
`)

const SubmitButton = IconButton.extend(`
  background-color: ${colors.primary};
  margin-left: auto;
`, html`
  <${OkIcon} color=${colors.primaryText} />
`);

export default function AddRecipe({ list }) {
  const { dispatch } = useContext(context);

  const [input, setInput] = useState('');

  const inputElement = useRef(null);

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.base.focus();
    }
  }, []);

  const submit = async (ev) => {
    ev.preventDefault();

    if (input.length === 0) {
      return;
    }

    const recipe = {
      id: await sha256(input + Math.random()),
      name: input,
      items: {},
    };

    dispatch(patches.addRecipe(list.id, recipe));

    navigateTo(`/lists/${list.id}/recipes/${recipe.id}`);
  };

  return html`
    <${NarrowPage}>
      <${VerticalCentering}>
        <${Form} onSubmit=${submit}>
          <${GoBackButton} onClick=${() => navigateTo(`/lists/${list.id}/recipes`)} type="button" />

          <${Text}>${translate('to add a recipe, name it')}<//>

          <${TextInput}
            autocapitalize="off"
            placeholder=${translate('name of recipe')}
            onKeyUp=${(ev) => setInput(ev.target.value)}
            ref=${inputElement}
            value=${input}
          />

          <${SubmitButton} onClick=${submit} />
        <//>
      <//>
    <//>
  `;
}
