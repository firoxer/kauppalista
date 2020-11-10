import { html, render } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';

import Kauppalista from './components/Kauppalista.js';

render(
  html`<${Kauppalista} />`,
  document.getElementById('root')
);