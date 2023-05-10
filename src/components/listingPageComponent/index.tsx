import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';

import styles from '~/pages/create-video-lesson/index.module.scss';

import { categories } from '~/helpers/categories';

type ListingComponentType = {
  thumbnailsURL: string;
  title: string;
  interest?: string;
  duration?: number;
  listingClickHandler: () => void;
};

function ListingPageComponent({
  title,
  interest,
  thumbnailsURL,
  listingClickHandler,
  duration,
}: ListingComponentType) {
  function secondsToTime(e) {
    const h = Math.floor(e / 3600)
        .toString()
        .padStart(2, '0'),
      m = Math.floor((e % 3600) / 60)
        .toString()
        .padStart(2, '0'),
      s = Math.floor(e % 60)
        .toString()
        .padStart(2, '0');

    return (h !== '00' ? h + ':' : '') + m + ':' + s;
  }
  const { t } = useTranslation();

  return (
    <div>
      <div onClick={listingClickHandler} className={styles.videoItemWrapper}>
        <div style={{ position: 'relative' }}>
          <img style={{ width: '100%' }} src={thumbnailsURL} alt="picture" />
          {duration && (
            <div className={styles.durationContainer}>
              <Typography variant="h5">{secondsToTime(duration)}</Typography>
            </div>
          )}
        </div>
        <div className={styles.title}>{title}</div>
        {interest && <div className={styles.tag}>{t(`videoCategoriesEmoji.${interest}`)}</div>}
      </div>
    </div>
  );
}

export default ListingPageComponent;
