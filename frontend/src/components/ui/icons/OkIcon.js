import { html } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';

export default function OkIcon({ color }) {
  return html`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
      <path fill="${color}" d="M 21.171573,3.0857863 9,15.257361 2.8284272,9.0857868 0,11.914214 l 9,9 15,-15 z" />
    </svg>
  `;
}
