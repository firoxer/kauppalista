import { html, useRef, useState } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';
import { createCssComponent } from '../lib/css-component.js';
import { autocomplete } from '../lib/autocomplete.js';

import FullWidthButton from './ui/buttons/FullWidthButton.js';
import CrossIcon from './ui/icons/CrossIcon.js';
import IconButton from './ui/buttons/IconButton.js';
import TextInput from './ui/TextInput.js';
import colors from './ui/colors.js';
import { translate } from '../services/translate.js';

const Backdrop = createCssComponent('div', `
  background-color: ${colors.backgroundOverlay};
  height: 200vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 1;
`);

const StickyContainer = createCssComponent('div', `
  position: sticky;
  top: 4rem;

  /* Show on top of the Backdrop */
  z-index: 2;
`)

const CloseButton = IconButton.extend(`
  background-color: ${colors.tertiary};
  position: absolute;
  top: -2.5rem;
`, html`
  <${CrossIcon} color=${colors.tertiaryText} />
`);

const CloseButtonPlaceholder = IconButton.extend(`
  background-color: transparent;
  position: absolute;
  top: -3rem;
`, html`
`);

const Form = createCssComponent('form', `
  margin-bottom: 1.5rem; /* The rows that follow include a .5rem margin that push this up to 2rem */
  width: 100%;
`);

const Input = TextInput.extend(`
  background-color: ${colors.backgroundAccented};
`);

const AutocompletionList = createCssComponent('div', `
  display: flex;
  flex-direction: column;
  position: absolute;

  /* Imitating the underlying WidePage */
  max-width: 24rem;
  width: 90vw;
`);

const Autocompletion = FullWidthButton.extend(`
  background-color: ${colors.secondary};
  color: ${colors.secondaryText};
`);

export default function ItemInput({
  autocomplete: autocompletionEnabled = true,
  list,
  onInput
}) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const focus = () => {
    setIsFocused(true);
  };

  const defocus = () => {
    setIsFocused(false);
  };

  const submit = async (input) => {
    onInput(input);
    setInput('');
  };

  const onFormSubmit = (ev) => {
    ev.preventDefault();

    submit(input);
  }

  const renderAutocompletions = (input, list) => {
    const choices = Object.values(list.items).map(({ name }) => name);
    const autocompletions = autocomplete(input, choices, { maxSuggestions: 10 })
      .map((autocompletion) => {
        const onClick = () => {
          setInput(autocompletion);
          inputRef.current.base.focus();
        };
        return html`<${Autocompletion} onClick=${onClick}>${autocompletion}<//>`;
      });

    return html`
      <${AutocompletionList}>
        ${autocompletions}
      <//>
    `;
  };

  return html`
    ${isFocused && html`<${Backdrop} onClick=${defocus} />`}

    <${StickyContainer}>
      ${isFocused
        ? html`<${CloseButton} onClick=${defocus} type="button" />`
        : html`<${CloseButtonPlaceholder} />`}

      <${Form} onSubmit=${onFormSubmit}>
        <${Input}
          autocapitalize="off"
          ref=${inputRef}
          placeholder=${translate('add item')}
          onKeyUp=${(ev) => setInput(ev.target.value)}
          onFocus=${focus}
          value=${input}
        />
      <//>

      ${isFocused && autocompletionEnabled && renderAutocompletions(input, list)}
    <//>
  `;
}
