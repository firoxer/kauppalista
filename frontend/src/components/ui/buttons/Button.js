import { createCssComponent } from '../../../lib/css-component.js';

export default createCssComponent('button', `
  background: transparent;
  border-radius: 2rem;
  border: none;
  color: inherit;
  cursor: pointer;
  font: inherit;
  height: 2rem;
  line-height: 1rem;
  padding: 0.25rem 0.5rem;
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`);