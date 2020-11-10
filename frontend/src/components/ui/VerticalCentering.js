import { createCssComponent } from '../../lib/css-component.js';

export default createCssComponent('div', `
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-height: 100vh;
`);