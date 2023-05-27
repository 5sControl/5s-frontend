/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject, useEffect } from 'react';

export const useOutsideClick = (
  ref: RefObject<Element>,
  handler: (e: any) => void,
  exception?: RefObject<Element>
): void => {
  useEffect(() => {
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

    return () => {
      document.removeEventListener('mouseup', listener);
    };
  }, [ref, handler, exception]);
};
