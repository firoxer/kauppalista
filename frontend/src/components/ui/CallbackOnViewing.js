import { html, useEffect, useRef } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';

export default function CallbackOnViewing({ callback }) {
  const triggerElement = useRef(null);

  useEffect(() => {
    const onObservation = ([target]) => {
      if (target.isIntersecting) {
        callback();
      }
    };

    const observer = new IntersectionObserver(onObservation, {
      root: null, // Defaults to viewport
    });

    observer.observe(triggerElement.current);

    return () => observer.unobserve(triggerElement.current);
  })

  // HACK: Without the \u00A0, mobile Firefox won't render the element
  return html`
    <div style=${{ position: 'absolute' }} ref=${triggerElement}>\u00A0</div>
  `;
}
