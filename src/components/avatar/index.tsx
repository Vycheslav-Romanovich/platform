import { memo } from 'react';
import AvatarComp from '@mui/material/Avatar';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import styles from './index.module.scss';

type Props = {
  src?: string | null;
  onClick?: () => void;
  size?: 'small' | 'big' | 'medium' | 'huge';
  isHeader?: boolean;
  isPointer?: boolean;
  alt: string;
};

const Avatar: React.FC<Props> = observer(
  ({ onClick, size = 'big', isHeader, isPointer = false, src, alt }) => {
    const btnClasses = classNames(styles.avatar, {
      [styles.small]: size === 'small',
      [styles.medium]: size === 'medium',
      [styles.big]: size === 'big',
      [styles.huge]: size === 'huge',
      [styles.mediaHeader]: isHeader,
      [styles.isPointer]: isPointer,
    });

    const handleClick = () => {
      onClick && onClick();
    };

    return (
      <div className={btnClasses} onClick={handleClick}>
        <AvatarComp
          src={src}
          alt={alt}
          sx={size === 'small' && { width: '1em!important', height: '1em!important' }}
        />
      </div>
    );
  }
);

export default memo(Avatar);
