import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import classNames from 'classnames';
import { t } from 'i18next';

import styles from './lessonPageActivityView.module.scss';

import { lessonStore } from '~/stores';

function LessonPageActivityView() {
  const [allView, setAllView] = useState<boolean>(false);
  const { t } = useTranslation();
  const wrapperClasses = classNames({
    [styles.closeWrapper]: !allView,
  });

  return (
    <div className={styles.lessonPageActivityWrapper}>
      <div className={wrapperClasses}>
        <LessonActivityItem />
      </div>
      <Typography
        onClick={() => setAllView((prevState) => !prevState)}
        variant={'h5m'}
        sx={{ cursor: 'pointer', paddingTop: '8px', color: 'var(--Grey)' }}
      >
        {allView ? t('activityView.hide') : t('activityView.showMore')}
      </Typography>
    </div>
  );
}

export default LessonPageActivityView;

function LessonActivityItem() {
  return (
    <div>
      {lessonStore.sortVideoGameData.map((videoItem, index) => {
        return (
          <div key={videoItem.id}>
            {videoItem.gameType && (
              <Typography sx={{ color: 'var(--D_Grey)' }} variant={'h6'}>
                {index + 1}. {t(`interactiveGame.interactiveName.${videoItem.gameType}`)}
              </Typography>
            )}
            <Typography sx={{ color: 'var(--Grey)' }} variant={'body1'}>
              {videoItem.question}
            </Typography>
            {videoItem.answer?.option?.map((m) => {
              return (
                <div key={m.id} className={styles.option}>
                  <div className={styles.square} />{' '}
                  <Typography sx={{ color: 'var(--Grey)' }} variant={'body1'}>
                    {m.value}
                  </Typography>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
