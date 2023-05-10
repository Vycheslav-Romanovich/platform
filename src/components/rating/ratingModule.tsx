import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StarIcon from '@mui/icons-material/Star';
import { Button, IconButton, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import { observer } from 'mobx-react';

import styles from './ratingModule.module.scss';

import { sendEvent } from '~/helpers/sendToGtm';
import { lessonStore } from '~/stores';
import Modal from '~/UI/modal';

type Props = {
  myLesson: boolean;
};

const RatingModule: FC<Props> = ({ myLesson }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [value, setValue] = useState<number | null>(null);

  const changeRating = () => {
    sendEvent('rate_lesson', { star_rate: value.toString() });
    lessonStore.setLessonRating(value);
    setShowModal(false);
  };

  return (
    <div className={styles.ratingButtonContainer}>
      <Modal
        isOpen={showModal}
        close={() => setShowModal(false)}
        wrapperClasses={styles.popupWindow}
        modalClasses={styles.modalBodyStyle}
      >
        <Typography variant="h4" className={styles.modalTitleMessage}>
          {t('ratingModule.titleMessage')}
        </Typography>
        <Typography variant="body1" className={styles.modalMessage}>
          {value != null ? `${value} ${t('ratingModule.stars')}` : t('ratingModule.rateNumber')}
        </Typography>
        <div className={styles.modalButtonsWrapper}>
          <Rating
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
          {value != null ? (
            <Button
              classes={{ contained: styles.btn }}
              variant="contained"
              size="large"
              onClick={changeRating}
            >
              {t('ratingModule.submit')}
            </Button>
          ) : (
            ''
          )}
        </div>
      </Modal>
      <Tooltip
        classes={{ tooltip: styles.tooltip }}
        arrow
        placement="left"
        title={t('ratingModule.titleRate')}
      >
        <>
          {!myLesson || lessonStore.lessonData?.avgRating != null ? (
            <>
              <IconButton
                disabled={myLesson}
                onClick={() => setShowModal(true)}
                style={{ padding: '0', marginRight: '8px' }}
              >
                <StarIcon style={{ width: '32px', height: '32px', color: '#FFCF26' }} />
              </IconButton>
              <Typography variant="body2" className={styles.rating}>
                {lessonStore.lessonData?.avgRating != null
                  ? `${lessonStore.lessonData?.avgRating.toFixed(2)} (${
                      lessonStore.lessonData?.numberVoters
                    } ${t('ratingModule.review')})`
                  : t('ratingModule.rateFirst')}
              </Typography>
            </>
          ) : null}
        </>
      </Tooltip>
    </div>
  );
};

export default observer(RatingModule);
