import React, { DOMAttributes, memo } from 'react';
import cn from 'classnames';

import styles from './backdrop.module.scss';

type Props = {
  show?: boolean;
  onClick?: DOMAttributes<HTMLDivElement>['onClick'];
  backdropId?: string;
  zIndex?: number;
  backdropClass?: string;
};

const BackDrop: React.FC<Props> = ({ show, onClick, backdropId, zIndex, backdropClass }) => {
  const backdropClasses = cn(styles.back, backdropClass, {
    [styles.show]: show !== undefined ? show : true,
  });
  return (
    <div className={backdropClasses} onClick={onClick} style={{ zIndex: zIndex }} id={backdropId} />
  );
};

export default memo(BackDrop);
