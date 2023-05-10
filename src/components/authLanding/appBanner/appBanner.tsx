import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Image from 'next/image';

import StudentDesktop from '~/assets/content/appBanner/studentDesktop.jpg';
import StudentMobile from '~/assets/content/appBanner/studentMobile.jpg';
import TeachDesktop from '~/assets/content/appBanner/teachDesktop.jpg';
import TeachMobile from '~/assets/content/appBanner/teachMobile.jpg';

import styles from './appBanner.module.scss';

import { eLangAppAndroid, eLangAppIos } from '~/constants/links';
import { mainStore, userStore } from '~/stores';

const images = [
  {
    imgPath: mainStore.isMobile ? TeachMobile : TeachDesktop,
    label: 'teacher',
  },
  {
    imgPath: mainStore.isMobile ? StudentMobile : StudentDesktop,
    label: 'student',
  },
];

function AppBanner() {
  const { t } = useTranslation();
  const linkStore = mainStore.isMobile
    ? mainStore.isIos
      ? eLangAppIos
      : eLangAppAndroid
    : eLangAppIos;

  return (
    <div className={styles.wrapperApp}>
      {userStore.user?.role === 'teacher' ? (
        <Image src={images[0].imgPath} alt="appBanner" />
      ) : (
        <Image src={images[1].imgPath} alt="appBanner" />
      )}
      <Button
        variant="contained"
        size="large"
        className={styles.linkBtn}
        href={linkStore}
        target="_blank"
        sx={{ zIndex: 1 }}
      >
        {t('authLanding.viewApps')}
      </Button>
    </div>
  );
}

export default AppBanner;
