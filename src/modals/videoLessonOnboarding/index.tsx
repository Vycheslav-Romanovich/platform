import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import ModalBottomArrow from '~/assets/icons/modalBottomArrow.svg';

import Modal from '../../UI/modal';

import styles from './index.module.scss';

import { mainStore } from '~/stores';

type Props = {
  isOpen: boolean;
  close: () => void;
  modalPosition?: number;
};

const VideoLessonOnboarding: React.FC<Props> = ({ isOpen, close, modalPosition }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      close={() => close()}
      modalClasses={styles.modal}
      bodyStyle={{
        top: `${mainStore.isMobile ? 370 : modalPosition - 264}px`,
        position: 'absolute',
      }}
      withoutCloseBtn={true}
    >
      <div className={styles.innerWrapper}>
        <h2>{t('videoLessonOnboard.clickWord')}</h2>
        <h3>{t('videoLessonOnboard.clickSave')}</h3>

        <div className={styles.buttons}>
          <Button
            onClick={() => close()}
            size="large"
            variant="contained"
            style={{ minWidth: '106px' }}
          >
            {t('videoLessonOnboard.gotIt')}
          </Button>
        </div>
      </div>
      <ModalBottomArrow className={styles.bottomArrow} />
    </Modal>
  );
};
export default VideoLessonOnboarding;
