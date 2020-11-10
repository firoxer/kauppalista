import { createCssComponent } from '../../lib/css-component.js';

import colors from './colors.js';
import { translate } from '../../services/translate.js';

export default createCssComponent('div', `
  align-items: center;
  background-color: ${colors.background};
  display: flex;
  height: 100vh;
  justify-content: center;
  width: 100vw;

  &:before {
    color: hsla(0, 0%, 0%, 50%);
    content: "${translate('loading...')}";
  }
`);
