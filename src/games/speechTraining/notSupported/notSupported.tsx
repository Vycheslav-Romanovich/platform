import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Chrome from '~/assets/images/chrome.svg';
import Edge from '~/assets/images/edge.svg';
import Safari from '~/assets/images/safari.svg';

import styles from './notSupported.module.scss';

const NotSupported: FC = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.notSupportedContainer}>
      <div className={styles.textSorry}>{t('games.notSupported.textSorry')}</div>
      <div className={styles.textTry}>{t('games.notSupported.textTry')}</div>
      <div className={styles.browserContainer}>
        <div className={styles.iconWrapper}>
          <Chrome style={{ height: 32, width: 32 }} />
          <div className={styles.textIcon}>Chrome</div>
        </div>
        <div className={styles.iconWrapper}>
          <Edge style={{ height: 32, width: 32 }} />
          <div className={styles.textIcon}>Edge</div>
        </div>
        <div className={styles.iconWrapper}>
          <Safari style={{ height: 32, width: 32 }} />
          <div className={styles.textIcon}>Safari</div>
        </div>
      </div>
    </div>
  );
};

export default NotSupported;
