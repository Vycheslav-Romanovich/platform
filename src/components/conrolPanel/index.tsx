import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import DualSubIcon from '~/assets/icons/control_panel/dualSub.svg';
import NextIcon from '~/assets/icons/control_panel/next.svg';
import PrevIcon from '~/assets/icons/control_panel/prev.svg';
// import utilsStyles from '~/styles/utils.module.scss';
import RepeatIcon from '~/assets/icons/control_panel/repeat.svg';
import SlowRepeatIcon from '~/assets/icons/control_panel/slowRepeat.svg';

import styles from './controlPanel.module.scss';

import { handleBtnPress } from '~/helpers/handleVideoHotkeysPress';
import { sendEvent } from '~/helpers/sendToGtm';
import videoAction from '~/helpers/videoAction';
import SigninSignupPopup from '~/modals/signin-signup-popup';
import { subtitlesStore, videoStore } from '~/stores';

let timeout;

export default observer(function ControlPanel() {
  const { t } = useTranslation();
  const buttonClasses = classNames(styles.button);
  const [hoverStyle, setHoverStyle] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const RepeatBtn = (props: {
    style?: React.CSSProperties;
    onClickAdded?: () => void;
    classesAdded?: string;
  }) => {
    return (
      <button
        id={'rep'}
        onMouseOver={() => {
          setHoverStyle(1);
        }}
        onMouseOut={() => {
          setHoverStyle(0);
        }}
        className={`${buttonClasses}  ${hoverStyle === 1 ? styles.hover : ''}${
          videoStore.actionMode === 'repeat' ? styles.active : ''
        } ${props.classesAdded ? props.classesAdded : ''}`}
        onClick={() => {
          videoAction.repeatSubtitle();
          handleBtnPress('repeat');
        }}
      >
        <RepeatIcon />
        <div className={styles.text}>{t('controlPanel.repeat')}</div>
      </button>
    );
  };
  const RepeatButton = observer(RepeatBtn);

  const SlowRepeatBtn = (props: {
    style?: React.CSSProperties;
    onClickAdded?: () => void;
    classesAdded?: string;
  }) => {
    return (
      <button
        id={'slow_rep'}
        onMouseOver={() => {
          setHoverStyle(2);
        }}
        onMouseOut={() => {
          setHoverStyle(0);
        }}
        className={`${buttonClasses} ${hoverStyle === 2 ? styles.hover : ''} ${
          videoStore.actionMode === 'slow repeat' ? styles.active : ''
        } ${props.classesAdded ? props.classesAdded : ''}`}
        onClick={() => {
          videoAction.slowRepeatSubtitle();
          handleBtnPress('slow repeat');
        }}
        style={props.style}
      >
        <SlowRepeatIcon />
        <div className={styles.text}>{t('controlPanel.slowR')}</div>
      </button>
    );
  };
  const SlowRepeatButton = observer(SlowRepeatBtn);

  const DualSubtitleBtn = (props: {
    style?: React.CSSProperties;
    onClickAdded?: () => void;
    classesAdded?: string;
  }) => {
    // const handleShowPopup = (ms: number) => {
    //   setShowPopup(true);
    //   timeout = setTimeout(() => {
    //     setShowPopup(false);
    //   }, ms);
    // };
    return (
      <button
        id={'7561'}
        onMouseOver={() => {
          setHoverStyle(3);
        }}
        onMouseOut={() => {
          setHoverStyle(0);
        }}
        className={`${buttonClasses} 
                     ${hoverStyle === 3 ? styles.hover : ''}
                            ${videoStore.actionMode === 'translateOn' ? styles.active : ''} ${
          props.classesAdded ? props.classesAdded : ''
        }`}
        onClick={() => {
          if (subtitlesStore.isAlwaysShowed) {
            sendEvent('dual_subs_click', { power: 'Off' });
            handleBtnPress('translateOff');
            subtitlesStore.setIsAlwaysShowed(false);
          } else {
            sendEvent('dual_subs_click', { power: 'On' });
            handleBtnPress('translateOn');
            subtitlesStore.setIsAlwaysShowed(true);
          }
        }}
        style={{ ...props.style }}
      >
        <DualSubIcon />
        <div className={styles.text}>{t('controlPanel.dualSub')}</div>
      </button>
    );
  };
  const DualSubtitleButton = observer(DualSubtitleBtn);

  const NextBtn = (props: {
    style?: React.CSSProperties;
    onClickAdded?: () => void;
    classesAdded?: string;
  }) => {
    return (
      <button
        onMouseOver={() => {
          setHoverStyle(4);
        }}
        onMouseOut={() => {
          setHoverStyle(0);
        }}
        className={`${buttonClasses}  ${hoverStyle === 4 ? styles.hover : ''}
                ${videoStore.actionMode === 'next' ? styles.active : ''} ${
          props.classesAdded ? props.classesAdded : ''
        } ${styles.right}`}
        onClick={() => {
          videoAction.nextSubtitle();
          handleBtnPress('next');
        }}
      >
        <NextIcon />
        <div className={styles.text}>{t('controlPanel.next')}</div>
      </button>
    );
  };
  const NextButton = observer(NextBtn);

  const PrevBtn = (props: {
    style?: React.CSSProperties;
    onClickAdded?: () => void;
    classesAdded?: string;
  }) => {
    return (
      <button
        id={'prev_sub'}
        onMouseOver={() => {
          setHoverStyle(5);
        }}
        onMouseOut={() => {
          setHoverStyle(0);
        }}
        className={`${buttonClasses} 
                ${hoverStyle === 5 ? styles.hover : ''}
                ${videoStore.actionMode === 'prev' ? styles.active : ''} ${
          props.classesAdded ? props.classesAdded : ''
        } ${styles.left}`}
        onClick={() => {
          videoAction.prevSubtitle();
          handleBtnPress('prev');
        }}
      >
        <PrevIcon />
        <div className={styles.text}>{t('controlPanel.prev')}</div>
      </button>
    );
  };
  const PrevButton = observer(PrevBtn);

  return (
    <div className={styles.wrapper}>
      <div className={styles.panel}>
        <PrevButton />
        <div className={styles.divider} />
        <SlowRepeatButton />
        <div className={styles.divider} />
        <DualSubtitleButton />
        {showPopup ? (
          <SigninSignupPopup
            open={showPopup}
            addText={t('controlPanel.toGet')}
            handleHover={() => {
              clearTimeout(timeout);
              setShowPopup(true);
            }}
            handleBlur={() => {
              setShowPopup(false);
            }}
          />
        ) : null}

        <div className={styles.divider} />
        <RepeatButton />
        <div className={styles.divider} />
        <NextButton />
      </div>
    </div>
  );
});
