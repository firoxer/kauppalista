import { useEffect, useState } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';

export function navigateTo(path) {
  history.pushState(null, '', path);
  dispatchEvent(new Event('popstate')); // To trigger the listener in useUrlPath
}

export function useUrlPath() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const listener = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', listener);

    return () => {
      window.removeEventListener('popstate', listener);
    };
  }, []);

  return path;
}
