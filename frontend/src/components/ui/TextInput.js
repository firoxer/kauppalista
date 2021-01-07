import { createCssComponent } from '../../lib/css-component.js';

import colors from '../ui/colors.js';

export default createCssComponent('input', `
  background-color: ${colors.background};
  border: none;
  border-bottom: 0.175rem solid hsl(0, 0%, 0%);
  box-sizing: border-box;
  color: inherit;
  font: inherit;
  height: 2rem;
  margin: 0 0.5rem;
  padding: 0.5rem;
  text-align: center;
  width: calc(100% - 1rem);

  &::placeholder {
    color: ${colors.textMuted};
  }
`);
