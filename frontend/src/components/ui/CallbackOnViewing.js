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
      root: null,
      rootMargin: '0px',
      threshold: 0.25,
    })

    observer.observe(triggerElement.current);

    return () => observer.unobserve(triggerElement.current);
  })

  return html`
    <div style=${{ height: 0 }} ref=${triggerElement} />
  `;
}
