import { RefObject, useEffect } from 'react';

export const useOutsideClick = (
  ref: RefObject<Element>,
  handler: (e: any) => void,
  exception?: RefObject<Element>
): void => {
  useEffect(
    () => {
      const listener = (event: any) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        if (exception && (!exception.current || exception.current.contains(event.target))) {
          return;
        }
        handler(event);
      };

      document.addEventListener('mouseup', listener);
      // document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mouseup', listener);
        // document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler, exception]
  );
};
