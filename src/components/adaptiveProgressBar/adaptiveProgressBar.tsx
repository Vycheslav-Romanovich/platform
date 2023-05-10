import { FC } from 'react';
import { observer } from 'mobx-react';

import styles from './adaptiveProgressBar.module.scss';

import { PERCENT_COMPLETE } from '~/constants/variable';

type Props = {
  currentValue: number;
  maxLength: number;
  createVideo?: boolean;
  step?: number;
  isValue?: boolean;
};

const AdaptiveProgressBar: FC<Props> = ({ currentValue, maxLength, step = 1, isValue = false }) => {
  const width = (currentValue / maxLength) * PERCENT_COMPLETE;
  const widthStyle = {
    width: `${width}%`,
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.progress} style={widthStyle} />
      </div>
      {isValue ? (
        <div className={styles.values}>
          {currentValue + step} / {maxLength}
        </div>
      ) : null}
    </div>
  );
};

export default observer(AdaptiveProgressBar);
