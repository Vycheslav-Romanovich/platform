import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Button } from '@mui/material';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import styles from './addWordBtn.module.scss';

import { InitLoader } from '~/components/initLoader';
import { sendEvent } from '~/helpers/sendToGtm';
import { lessonStore, mainStore, subtitlesStore, userStore } from '~/stores';
import { AddWordResponse, IAddWord } from '~/types/api';

type Props = {
  addedWordInfo: AddWordResponse;
  word: string;
  translate: string;
  index: number;
  showError: (ms: number) => void;
  showPopup?: (ms: number) => void;
  isIdiom?: boolean;
};

function AddWordBtn({ addedWordInfo, word, translate, isIdiom, showError, index }: Props) {
  const [lastAddedWord, setLastAddedWord] = useState<AddWordResponse>();
  const [buttonState, setButtonState] = useState<
    'none' | 'loading' | 'complete' | 'error' | 'noAuth'
  >(addedWordInfo ? 'complete' : 'none');
  const btnClasses = classNames(styles.add, {
    [styles.isIdiom]: isIdiom,
    [styles.default]: buttonState === 'none',
    [styles.complete]: buttonState === 'complete',
    [styles.error]: buttonState === 'error' || buttonState === 'noAuth',
    [styles.loading]: buttonState === 'loading',
  });
  const { t } = useTranslation();

  const addWord = () => {
    const contextSelectedWord = subtitlesStore.getContextSelectedWord();
    if (userStore.isAuth) {
      setButtonState('loading');

      const data: IAddWord = {
        sentence: {
          text: contextSelectedWord.text,
          videoTimestamp: subtitlesStore.currentSubtitle.startTime,
          videoTimestampEnd: subtitlesStore.currentSubtitle.endTime,
        },
        word: {
          word: word,
          isIdiom: isIdiom,
          translate: translate,
          index: index + contextSelectedWord.index,
          length: word.length,
        },
      };
      lessonStore.setLessonInfo(data);
      const newWords = lessonStore.addWord(data);
      lessonStore.setVariantBox('word');
      setLastAddedWord(newWords);
      sendEvent('add_sub_word');
      setButtonState('complete');
    }
  };

  const deleteWord = () => {
    const findWord = lessonStore.lessonData.word.find((el) => el.word === word);

    if (findWord) {
      lessonStore.deleteWordLocal(findWord.id);
    } else {
      lessonStore.deleteWordLocal(lastAddedWord.id);
    }
    setButtonState('none');
  };

  const getButtonIcon = () => {
    switch (buttonState) {
      case 'complete':
        return mainStore.isMobile ? (
          t('routes.lessonsStates.Saved')
        ) : (
          <>
            <CheckIcon fontSize="small" color="inherit" /> {t('routes.lessonsStates.Saved')}
          </>
        );
      case 'error':
      case 'noAuth':
        return <ErrorOutlineOutlinedIcon color="error" />;
      case 'loading':
        return <InitLoader type="dots" />;
      default:
        return t('account.save');
    }
  };

  useEffect(() => {
    let timeout;
    const ms = 3000;
    if (buttonState === 'error') {
      showError(ms);
      timeout = setTimeout(() => {
        setButtonState('none');
      }, ms);
    } else if (buttonState === 'noAuth') {
      timeout = setTimeout(() => {
        setButtonState('none');
      }, ms);
    }
    return () => {
      if ((buttonState === 'error' || buttonState === 'noAuth') && timeout) {
        clearTimeout(timeout);
      }
    };
  }, [buttonState]);

  return (
    <Button
      id={
        buttonState === 'none'
          ? 'add_sub_word'
          : buttonState === 'complete'
          ? 'delete_sub_word'
          : null
      }
      className={btnClasses}
      onClick={buttonState === 'none' ? addWord : buttonState === 'complete' ? deleteWord : null}
      disabled={!(buttonState === 'none' || buttonState === 'complete')}
      variant="contained"
    >
      {getButtonIcon()}
    </Button>
  );
}

export default observer(AddWordBtn);
