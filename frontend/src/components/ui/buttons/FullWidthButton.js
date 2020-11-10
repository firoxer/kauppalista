import Button from './Button.js';

export default Button.extend(`
  display: block;
  width: 100%;

  & + & {
    margin-top: 0.5rem;
  }
`);