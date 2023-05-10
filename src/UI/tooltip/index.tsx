import React from 'react';
import classNames from 'classnames';

import TooltipArrowBottom from '~/assets/icons/tooltip_arrow_bottom.svg';
import TooltipArrowTop from '~/assets/icons/tooltip_arrow_top.svg';

import styles from './tooltip.module.scss';

type Props = {
  children: React.ReactNode;
  popupStyles?: React.StyleHTMLAttributes<object>;
  text: string;
  bottom?: boolean;
  top?: boolean;
  left?: boolean;
  right?: boolean;
};

const Tooltip: React.FC<Props> = ({ children, popupStyles, text, bottom, top, left, right }) => {
  const popupClasses = classNames(styles.tooltipPopup, {
    [styles.bottom]: bottom,
    [styles.top]: top,
    [styles.left]: left,
    [styles.right]: right,
  });

  const arrowClasses = classNames(styles.arrow, {
    [styles.topArrow]: bottom,
    [styles.bottomArrow]: top,
  });

  return (
    <div className={styles.tooltip}>
      {children}
      <div className={popupClasses} style={popupStyles}>
        {text}
        {bottom ? (
          <TooltipArrowTop className={arrowClasses} />
        ) : (
          <TooltipArrowBottom className={arrowClasses} />
        )}
      </div>
    </div>
  );
};

export default Tooltip;
