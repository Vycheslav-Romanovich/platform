import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import screenfull from 'screenfull';

export default function ClientOnlyPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted
    ? createPortal(
        children,
        document.getElementById(
          screenfull.isFullscreen ? 'full-screen-tooltips-container' : 'modal'
        ) as HTMLElement
      )
    : null;
}
