import { html } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';

export default function LeftArrowIcon({ color }) {
  return html`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
      <g transform="rotate(-45, 12, 12)">
        <path fill="${color}" d="M 3,2 v 16 h 4 v -16 h -4 Z" />
        <path fill="${color}" d="M 3,2 v 4 h 16 v -4 h -16 Z" />
      </g>

      <path fill="${color}" d="M 4,9 v 4 h 20 v -4 h -20 Z" />
    </svg>
  `;
}
