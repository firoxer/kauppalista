import { createCssComponent } from '../../lib/css-component.js';

import colors from './colors.js';

export default createCssComponent('div', `
  align-items: center;
  background-color: ${colors.danger};
  color: ${colors.dangerText};
  display: flex;
  min-height: 100vh;
  justify-content: center;
  padding: 0 10vmin;
  text-align: center;
`);
