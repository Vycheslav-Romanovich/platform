import React, { HTMLAttributes, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import classNames from 'classnames';

import BackDrop from '../backdrop';
import ClientOnlyPortal from './../../hocs/clientOnlyPortal';

import styles from './modal.module.scss';

type Props = {
  isOpen: boolean;
  close: () => void;
  children: React.ReactNode;
  bodyStyle?: HTMLAttributes<HTMLDivElement>['style'];
  backdropId?: string;
  closeBtnId?: string;
  withoutCloseBtn?: boolean;
  modalClasses?: string;
  backdropClasses?: string;
  wrapperClasses?: string;
  video?: boolean;
};

const Modal: React.FC<Props> = ({
  isOpen,
  close,
  children,
  bodyStyle,
  backdropId,
  closeBtnId,
  withoutCloseBtn,
  modalClasses,
  backdropClasses,
  wrapperClasses,
  video,
}) => {
  useEffect(() => {
    const closeOnEsc = (e) => {
      if (e.keyCode === 27) {
        close();
      }
    };
    document.addEventListener('keydown', closeOnEsc);
    return () => {
      document.removeEventListener('keydown', closeOnEsc);
    };
  }, []);

  useEffect(() => {
    isOpen
      ? document.body.classList.add('modal-open')
      : document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  const wrapperClass = classNames(styles.modalWrapper, {
    [styles.active]: isOpen,
  });
  const modalClass = classNames(styles.modal, modalClasses, {
    [styles.videoModal]: video,
  });
  const closeClass = classNames(styles.close, {
    [styles.closeVideo]: video,
  });

  return (
    <ClientOnlyPortal>
      <div className={`${wrapperClasses} ${wrapperClass}`}>
        <div className={modalClass} style={{ ...bodyStyle }}>
          {children}

          {!withoutCloseBtn ? (
            <IconButton
              id={closeBtnId}
              aria-label="Close modal"
              className={closeClass}
              onClick={close}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </div>

        <div className={styles.backDrop} onClick={close} />

        <BackDrop
          show={isOpen}
          onClick={close}
          backdropId={backdropId}
          backdropClass={backdropClasses}
        />
      </div>
    </ClientOnlyPortal>
  );
};

export default Modal;
