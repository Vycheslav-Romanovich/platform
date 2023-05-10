import React from 'react';
import { useTranslation } from 'react-i18next';

import NotSearchImage from '~/assets/images/notLinkSearch.svg';
import NotSearchImageMobile from '~/assets/images/notLinkSearchMobile.svg';

import style from './NotLinkSearch.module.scss';

const NotLinkSearch = () => {
  const { t } = useTranslation();
  return (
    <div className={style.wrapper}>
      <div className={style.tip}>{t('notLinkSearch.tip')}</div>
      <div className={style.description}>{t('notLinkSearch.description')}</div>
      <div className={style.mem}>
        <div className={style.desktop}>
          <NotSearchImage />
        </div>
        <div className={style.mobile}>
          <NotSearchImageMobile />
        </div>
      </div>
    </div>
  );
};

export default NotLinkSearch;
