import { RefObject, useEffect } from 'react';

export const useOutsideClick = (
  ref: RefObject<Element>,
  callback: () => void,
  exception?: RefObject<Element>
): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        ref.current &&
        !ref.current.contains(target) &&
        exception &&
        exception.current &&
        !exception.current.contains(target)
      ) {
        callback();
      }
    };

    document.addEventListener('mouseup', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [ref, exception]);
};
