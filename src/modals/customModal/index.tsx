import { HTMLAttributes } from 'react';
import { Button, Typography } from '@mui/material';

import styles from './index.module.scss';

import Modal from '~/UI/modal';

type Props = {
  isOpen: boolean;
  close: () => void;
  access: () => void;
  bodyStyle?: HTMLAttributes<HTMLDivElement>['style'];
  backdropId?: string;
  closeBtnId?: string;
  withoutCloseBtn?: boolean;
  modalClasses?: string;
  backdropClasses?: string;
  wrapperClasses?: string;
  title: string;
  subtitle1: string;
  subtitle2?: string;
  subtitle3?: string;
  buttonTextLeft?: string;
  idYesButton?: string;
  buttonTextRight?: string;
  revert?: boolean;
};

export const CustomModal: React.FC<Props> = ({
  isOpen,
  close,
  access,
  modalClasses,
  withoutCloseBtn,
  backdropClasses,
  wrapperClasses,
  bodyStyle,
  title,
  subtitle1,
  subtitle2,
  subtitle3,
  idYesButton,
  buttonTextRight,
  buttonTextLeft,
  revert,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      close={close}
      bodyStyle={bodyStyle}
      wrapperClasses={wrapperClasses}
      backdropClasses={backdropClasses}
      modalClasses={`${styles.modalClasses} ${modalClasses}`}
      withoutCloseBtn={withoutCloseBtn}
    >
      <Typography variant="h4" className={styles.title}>
        {title}
      </Typography>

      <p className={styles.subTitle}>{subtitle1}</p>
      {subtitle2 && <p className={styles.subTitle}>{subtitle2}</p>}
      {subtitle3 && <p className={styles.subTitle}>{subtitle3}</p>}

      <div className={styles.btnBlock}>
        {buttonTextLeft && (
          <Button
            onClick={revert ? access : close}
            sx={{ height: '48px', width: '100%', whiteSpace: 'nowrap', minWidth: 'auto' }}
            variant="outlined"
          >
            {buttonTextLeft}
          </Button>
        )}

        {buttonTextRight && (
          <Button
            id={idYesButton}
            size="large"
            sx={{ width: '100%', whiteSpace: 'nowrap', minWidth: 'auto' }}
            variant="contained"
            onClick={revert ? close : access}
          >
            {buttonTextRight}
          </Button>
        )}
      </div>
    </Modal>
  );
};
