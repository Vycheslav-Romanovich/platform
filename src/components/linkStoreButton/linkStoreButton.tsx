import React from 'react';
import { Link } from '@mui/material';

import GoogleIcon from '~/assets/icons/appStoreGoogle.svg';
import IosIcon from '~/assets/icons/appStoreIos.svg';

import styles from './linkStoreButton.module.scss';

import { eLangAppAndroid, eLangAppIos } from '~/constants/links';
import { mainStore } from '~/stores';

const LinkStoreButton = () => {
  const href = mainStore.isIos ? eLangAppIos : eLangAppAndroid;
  const icon = mainStore.isIos ? <IosIcon /> : <GoogleIcon />;

  return (
    <div className={styles.appStoreWrapper}>
      <Link href={href} target="_blank">
        <a className={styles.link}>{icon}</a>
      </Link>
    </div>
  );
};

export default LinkStoreButton;
