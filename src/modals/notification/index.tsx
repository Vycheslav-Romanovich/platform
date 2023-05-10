import React, { useEffect } from 'react';
import { Typography } from '@mui/material';

import SquareCheck from './../../assets/icons/squareCheck.svg';
import SquareError from './../../assets/icons/squareError.svg';

import Modal from '../../UI/modal';

import styles from './notification.module.scss';

let timer: any;

type Props = {
  isOpen: boolean;
  close: () => void;
  error?: boolean;
  message: string | React.ReactNode;
  description?: string | React.ReactNode;
  duration?: number;
};

const Notification: React.FC<Props> = ({
  isOpen,
  close,
  message,
  description,
  duration,
  error,
}) => {
  const clearTimer = () => {
    timer && clearTimeout(timer);
    timer = undefined;
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
    <Modal
      isOpen={isOpen}
      close={() => {
        close();
        clearTimer();
      }}
      withoutCloseBtn={true}
      modalClasses={styles.modalBody}
    >
      {error ? (
        <div className={styles.innerWrapper}>
          <SquareError className={styles.buttonWrapper} />
        </div>
      ) : (
        <div className={styles.innerWrapper}>
          <SquareCheck className={styles.buttonWrapper} />
          <Typography variant="h3" className={styles.text}>
            {message}
          </Typography>
        </div>
      )}

      <Typography variant="body1" className={styles.description}>
        {description}
      </Typography>
    </Modal>
  );
};
export default Notification;
