import React, { useEffect } from 'react';
import classNames from 'classnames';

import styles from './tooltip.module.scss';

type Props = {
  popupStyles?: React.StyleHTMLAttributes<object>;
  text: string;
  bottom?: boolean;
  top?: boolean;
  left?: boolean;
  right?: boolean;
  isOpen?: boolean;
  duration?: number;
  setOpen?: () => void;
  popupPosition?: number;
};

let timer: any;

const NotifcatingTooltip: React.FC<Props> = ({
  popupPosition,
  text,
  bottom,
  top,
  left,
  right,
  isOpen,
  duration,
  setOpen,
}) => {
  const clearTimer = () => {
    timer && clearTimeout(timer);
    timer = undefined;
  };
  const popupClasses = classNames(styles.tooltipPopup, {
    [styles.bottom]: bottom,
    [styles.top]: top,
    [styles.left]: left,
    [styles.right]: right,
  });

  const close = () => {
    isOpen = !isOpen;
    // close();
    clearTimer();
  };

  useEffect(() => {
    if (isOpen) {
      timer = setTimeout(
        () => {
          close();
        },
        duration !== undefined ? duration : 1000
      );
    }
    return () => {
      if (!isOpen) {
        clearTimer();
      }
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className={styles.tooltip} onClick={setOpen}>
          <div className={popupClasses} style={{ transform: `translateX(${popupPosition}px)` }}>
            {text}
          </div>
        </div>
      )}
    </>
  );
};

export default NotifcatingTooltip;
