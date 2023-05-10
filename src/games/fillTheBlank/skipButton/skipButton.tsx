import React, { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import styles from '~/games/fillTheBlank/skipButton/skipButton.module.scss';

import { fillInTheBlankGameStore } from '~/stores';
import Modal from '~/UI/modal';

const SkipButton: FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [skip, setSkip] = useState<boolean>(false);
  const { skipWord, resetChoices, correctChoices } = fillInTheBlankGameStore;
  const { t } = useTranslation();

  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    correctChoices.length = 1;
    const timer = setTimeout(() => {
      skipWord();
      resetChoices();
      correctChoices.length = 0;
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [skip]);

  return (
    <div className={styles.skipButtonContainer}>
      <Modal
        isOpen={showModal}
        close={() => setShowModal(false)}
        wrapperClasses={styles.popupWindow}
        modalClasses={styles.modalBodyStyle}
      >
        <div className={styles.modalTitleMessage}>{t('games.skipButton.titleMessage')}</div>
        <div className={styles.modalMessage}>{t('games.skipButton.message')}</div>
        <div className={styles.modalButtonsWrapper}>
          <Button
            classes={{ outlined: styles.Btn }}
            variant="outlined"
            size="large"
            onClick={() => setShowModal(false)}
          >
            {t('games.skipButton.cancel')}
          </Button>
          <Button
            classes={{ contained: styles.Btn }}
            variant="contained"
            size="large"
            onClick={() => {
              setSkip(!skip);
              setShowModal(false);
            }}
          >
            {t('games.skipButton.skip')}
          </Button>
        </div>
      </Modal>
      <Tooltip
        classes={{ tooltip: styles.tooltip }}
        arrow
        placement="left"
        title={t('games.skipButton.title')}
      >
        <Button variant="text" onClick={() => setShowModal(true)}>
          {t('games.skipButton.skip')}
        </Button>
      </Tooltip>
    </div>
  );
};

export default SkipButton;
