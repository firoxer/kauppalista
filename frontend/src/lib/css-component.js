import { html } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';

let counter = 0;
function uniqueId() {
  return ++counter;
}

function extractAmpersandBlocks(css) {
  const indices = [];
  for (const match of css.matchAll(/&.*?{.*?}/gs)) {
    indices.push([match.index, match.index + match[0].length - 1])
  }

  return indices;
}

function calculateRegularBlockIndices(css, ampersandBlockIndices) {
  const indices = []
  for (let i = 0; i <= ampersandBlockIndices.length; ++i) {
    const start =
      ampersandBlockIndices[i - 1]
        ? ampersandBlockIndices[i - 1][1] + 1
        : 0;
    const end =
      ampersandBlockIndices[i]
        ? ampersandBlockIndices[i][0] - 1
        : css.length;

    if (end < start) {
      continue;
    }

    indices.push([start, end]);
  }

  return indices;
}

function parseCss(css, className) {
  const ampersandBlockIndices = extractAmpersandBlocks(css);
  const regularBlockIndices = calculateRegularBlockIndices(css, ampersandBlockIndices);

  const regularBlock = `
    .${className} {
      ${regularBlockIndices.map(([start, end]) => css.slice(start, end + 1)).join('')}
    }
  `;

  const ampersandBlocks =
    ampersandBlockIndices
      .map(([start, end]) => css.slice(start, end + 1))
      .map((s) => s.replaceAll('&', '.' + className))
      .join('\n\n');

  return `
    ${regularBlock}
    ${ampersandBlocks}
  `;
}

export function createCssComponent(element, css, staticChildren) {
  const styleElement = document.createElement('style');
  styleElement.setAttribute('type', 'text/css');

  const className = 'css-component-' + uniqueId();

  styleElement.innerHTML = parseCss(css, className);

  document.getElementsByTagName('head')[0].appendChild(styleElement);

  const create = ({ children, ...otherProps }) => {
    if (staticChildren) {
      children = staticChildren;
    }

    return html`
      <${element} className="${className}" ...${otherProps}>
        ${children}
      <//>
    `;
  }

  create.originalCss = css;
  create.element = element;

  create.extend =
    (additionalCss, staticChildren) =>
      createCssComponent(element, css + additionalCss, staticChildren);

  return create;
}