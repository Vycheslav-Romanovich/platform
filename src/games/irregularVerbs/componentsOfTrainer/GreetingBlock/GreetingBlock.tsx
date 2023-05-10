import React from 'react';
import { useTranslation } from 'react-i18next';

import Levels from '../../../../assets/images/levels.svg';

import style from './GreetingBlock.module.scss';

const GreetingBlock = () => {
  const { t } = useTranslation();
  return (
    <div className={style.block}>
      <div className={style.text}>
        {t('greetingBlock.create')} <br /> {t('greetingBlock.lessons')}
      </div>
      <div className={style.image}>
        <Levels />
      </div>
    </div>
  );
};

export default GreetingBlock;
