import React from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';

import styles from '~/components/useDesktopNotification/useDesktopNotification.module.scss';

import { QueryOptions } from '~/constants/video-lesson-steps';
import { mainStore } from '~/stores';

const UseDesktopNotification = () => {
  const { t } = useTranslation();
  const { asPath } = useRouter();

  return (
    <>
      {mainStore.isMobile &&
        mainStore.showNotification &&
        (QueryOptions(0, asPath) || asPath.includes('own-words')) && (
          <div className={styles.notificationUseDesktop}>
            {t('useDesktopNotification')}
            <span
              onClick={() => {
                mainStore.closeNotification();
              }}
              style={{ fontSize: 'large' }}
            >
              ×
            </span>
          </div>
        )}
    </>
  );
};

export default observer(UseDesktopNotification);
