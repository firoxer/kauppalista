import { useEffect } from 'https://unpkg.com/htm@3.0.4/preact/standalone.module.js';

export function useWakeLock() {
  useEffect(async () => {
    if (!('wakeLock' in navigator)) {
      console.debug('browser does not support wake lock, would have used it otherwise');
      return;
    }

    let lock;

    try {
      lock = await navigator.wakeLock.request('screen');
    } catch (e) {
      console.error('could not obtain wake lock', e);
    }

    return () => {
      lock.release();
    };
  }, []);
}
