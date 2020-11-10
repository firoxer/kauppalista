import { html } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';

export default function PlusIcon({ color }) {
  return html`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
      <path fill="${color}" d="M 10,0 V 10 H 0 v 4 h 10 v 10 h 4 V 14 H 24 V 10 H 14 V 0 Z" />
    </svg>
  `;
}
