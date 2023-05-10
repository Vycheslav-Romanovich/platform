import cn from 'classnames';

import Close from './../../assets/icons/close.svg';

import styles from './progressBar.module.scss';

import { PERCENT_COMPLETE } from '~/constants/variable';

type Props = {
  currentValue: number;
  maxLength: number;
  createVideo?: boolean;
  step?: number;
  isValue?: boolean;
  setPage?: (leave: string) => void;
};

export const ProgressBar: React.FC<Props> = ({
  currentValue,
  maxLength,
  step = 1,
  createVideo,
  isValue = false,
  setPage,
}) => {
  const width = ((currentValue + step) / maxLength) * PERCENT_COMPLETE;
  const widthStyle = {
    width: `${width}%`,
  };
  const containerClasses = cn(styles.container, {
    [styles.containerInCreateVideo]: createVideo === true,
  });
  const wrapperClasses = cn(styles.wrapper, {
    [styles.start]: createVideo === true,
  });

  return (
    <div className={wrapperClasses}>
      <div className={styles.back} onClick={() => setPage('leave')}>
        <Close />
      </div>
      <div className={containerClasses}>
        <div className={styles.progress} style={widthStyle} />
        {createVideo && (
          <>
            <div
              className={styles.stepDots}
              style={{ left: '33%', backgroundColor: width > 35 ? 'var(--Blue)' : 'var(--Sky)' }}
            />
            <div
              className={styles.stepDots}
              style={{ left: '66%', backgroundColor: width > 69 ? 'var(--Blue)' : 'var(--Sky)' }}
            />
            <div
              className={styles.stepDots}
              style={{ left: '98%', backgroundColor: width > 100 ? 'var(--Blue)' : 'var(--Sky)' }}
            />
          </>
        )}
      </div>
      {isValue ? (
        <div className={styles.values}>
          {currentValue + step} / {maxLength}
        </div>
      ) : null}
    </div>
  );
};
