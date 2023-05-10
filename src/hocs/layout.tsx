import React, { useRef } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import styles from './layout.module.scss';

import { Footer } from '~/components/footer';
import Header from '~/components/header';
import HelpButton from '~/components/helpButton/helpButton';
import ScrollTopButton from '~/components/scrollTopButton/';
import { userStore } from '~/stores';

type Props = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  classNameContent?: string;
  classNameHeaderWrapper?: string;
  hidePadding?: boolean;
  bg?: 'sky' | 'gradient' | 'lBlue' | 'white';
  onScroll?: (ref: React.MutableRefObject<undefined>) => void;
  showFooter?: boolean;
  mobile?: boolean;
  layoutOff?: boolean;
};

const Layout: React.FC<Props> = ({
  children,
  classNameHeaderWrapper,
  style,
  className,
  hidePadding,
  classNameContent,
  bg,
  onScroll,
  showFooter = false,
  mobile,
  layoutOff,
}) => {
  const listInnerRef = useRef();
  const { isAuth } = userStore;

  const contentStyles = classNames(styles.content, {
    [styles.padding]: !hidePadding,
    [styles.paddingMobile]: mobile,
  });

  const scrollableWrapperStyle = classNames(styles.scroll, {
    [styles.videoScrollWrapper]: layoutOff,
    [styles.bgSky]: bg === 'sky',
    [styles.bgLBlue]: bg === 'lBlue',
    [styles.bgWhite]: bg === 'white',
  });

  return (
    <div
      ref={listInnerRef}
      onScroll={onScroll ? () => onScroll(listInnerRef) : null}
      className={scrollableWrapperStyle}
    >
      <header className={`${styles.header} ${classNameHeaderWrapper}`}>
        <Header />
      </header>

      {layoutOff ? (
        <>{children}</>
      ) : (
        <main style={style} className={`${styles.wrapper} ${className}`}>
          <div className={`${contentStyles} ${classNameContent}`}>{children}</div>
        </main>
      )}

      {showFooter && <Footer />}

      {isAuth ? <HelpButton /> : <ScrollTopButton />}
    </div>
  );
};

export default observer(Layout);
