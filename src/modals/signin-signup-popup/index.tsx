import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import Link from 'next/link';

import styles from './signin-signup-popup.module.scss';

import { mainStore } from '~/stores';

const SigninSignupPopup = (props: {
  open: boolean;
  addText: string;
  handleHover?: () => void;
  handleBlur?: () => void;
}) => {
  // const [bottom, setBottom] = useState('100%');
  const { t } = useTranslation();
  const [position, setPosition] = useState({
    right: false,
    left: false,
  });

  const popupRef: RefObject<HTMLDivElement> = useRef();
  useEffect(() => {
    if (typeof popupRef.current !== 'undefined') {
      if (popupRef.current.getBoundingClientRect().left <= 0) {
        setPosition({ right: false, left: true });
      } else if (
        popupRef.current.getBoundingClientRect().left + popupRef.current.offsetWidth >=
        mainStore.deviceWidth
      ) {
        setPosition({ right: true, left: false });
      } else {
        setPosition({ right: false, left: false });
      }
    }
  }, [props.open, mainStore.deviceWidth]);

  const classes = classNames(styles.popupField, {
    // [styles.bigger]: localizationStore.lang === 'ru',
    [styles.show]: props.open,
    [styles.left]: position.left,
    [styles.right]: position.right,
  });

  return (
    <div
      ref={popupRef}
      className={classes}
      onMouseEnter={props.handleHover}
      onMouseLeave={props.handleBlur}
    >
      <p>
        <Link href={'/auth?signIn'}>
          <a>{t('choiseOfPath.logIn')}</a>
        </Link>
        {t('inviteStudents.or')}
        <Link href={'/auth?signUp'}>
          <a>{t('choiseOfPath.signUp')}</a>
        </Link>
      </p>
      <p>{props.addText}</p>
    </div>
  );
};

export default observer(SigninSignupPopup);
