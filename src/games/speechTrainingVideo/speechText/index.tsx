import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Typography } from '@mui/material';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import SpeakButtonDisabled from '~/assets/icons/speakButtons/speakButtonDisabled.svg';
import SpeakButtonPress from '~/assets/icons/speakButtons/speakButtonPress.svg';
import SpeakButtonRec from '~/assets/icons/speakButtons/speakButtonRec.svg';

import styles from './speechText.module.scss';

import { WRONG_ANSWER_DELAY_MS } from '~/constants/variable';
import Video from '~/games/speechTrainingVideo/video/video';
import { speechRecognition } from '~/helpers/speechRecognition';
import {
  fillInTheBlankGameStore,
  lessonStore,
  mainStore,
  variantStore,
  videoStore,
} from '~/stores';

export default observer(function SpeechText(props: {
  videoUrl: string;
  sentence: string;
  interval: number[];
  missingWord: string;
}) {
  const { currentIndexQuestion, currentRound, setPage, nextQuestion, nextQuestionSkip } =
    variantStore;
  const {
    trigger,
    tasks,
    addToAlreadyLearned,
    addWordToShowAgain,
    resetChoices,
    nextWord,
    nextStep,
  } = fillInTheBlankGameStore;
  const firstUpdate = useRef(true);
  const { wordsData } = lessonStore;
  const { t } = useTranslation();
  const [iconsButton, setIconsButton] = useState(SpeakButtonDisabled);
  const [correct, setCorrect] = useState<boolean>(false);
  const [micDisabled, setMicDisabled] = useState<boolean>(true);
  const [pressMic, setPressMic] = useState<boolean>(false);
  const [isActiveMicText, setIsActiveMicText] = useState<boolean>(false);
  const [isActiveButtonEmojiText, setIsActiveButtonEmojiText] = useState<boolean>(true);
  const [rightAnswer, setRightAnswer] = useState<boolean>(false);
  const [wrongAnswer, setWrongAnswer] = useState<boolean>(false);
  const [textClickSpeak, setTextClickSpeak] = useState<string>(t('games.speechText.clickSpeak'));
  const [emojiTextButton, setEmojiTextButton] = useState<string>(t('games.speechText.next'));
  const [count, setCount] = useState<number>(-1);
  const [lang, setLang] = useState<string>('en-US');
  const [value, setValue] = useState<string>('');
  const POSITIVE_REACTION: { emoji: string; text: string }[] = [
    { emoji: '😍', text: t('games.speechText.great') },
    { emoji: '😎', text: t('games.speechText.awesome') },
    { emoji: '✌', text: t('games.speechText.rock') },
    { emoji: '🤩', text: t('games.speechText.fantastic') },
  ];
  const NEGATIVE_REACTION: { emoji: string; text: string }[] = [
    { emoji: '😉', text: t('games.speechText.better') },
    { emoji: '🤔', text: t('games.speechText.hmm') },
    { emoji: '😉', text: t('games.speechText.better') },
    { emoji: '😐', text: t('games.speechText.skip') },
  ];
  const [emojiText, setEmojiText] = useState<string>(POSITIVE_REACTION[0].text);
  const [emojiFace, setEmojiFace] = useState<string>(POSITIVE_REACTION[0].emoji);
  const buttonClassesWord = classNames(styles.word, {
    [styles.wordRight]: rightAnswer,
    [styles.wordWrong]: wrongAnswer,
  });
  const buttonEmojiText = classNames(styles.emojiText, {
    [styles.active]: isActiveButtonEmojiText,
  });
  const buttonMicText = classNames(styles.buttonMicText, {
    [styles.active]: isActiveMicText,
  });
  let textVoice = '';
  const IsChrome = navigator.userAgent.toLowerCase().includes('chrome');
  const IsSafari =
    navigator.userAgent.toLowerCase().includes('safari') ||
    navigator.userAgent.toLowerCase().includes('mac');
  const recognition = speechRecognition(lang);

  useEffect(() => {
    if (videoStore.state.isPause) {
      setValue('');
      refreshPage();
      setMicDisabled(false);
    }
  }, [videoStore.state.isPause]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (correct) {
        nextStep();
      }
      resetChoices();
    }, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, [trigger]);

  useEffect(() => {
    setValue('');
    setRightAnswer(false);
    setWrongAnswer(false);
    setIsActiveMicText(false);
    setIconsButton(SpeakButtonDisabled);
    setPressMic(false);
    setMicDisabled(true);
    setIsActiveButtonEmojiText(true);
  }, [currentIndexQuestion]);

  useEffect(() => {
    if (
      tasks[currentIndexQuestion]?.correctAnswer.trim().toLowerCase() === value.trim().toLowerCase()
    ) {
      setRightAnswer(true);
      setIsActiveMicText(true);
      setIsActiveButtonEmojiText(false);
      setEmojiFace(POSITIVE_REACTION[currentIndexQuestion % 4].emoji);
      setEmojiText(POSITIVE_REACTION[currentIndexQuestion % 4].text);
      setEmojiTextButton(t('games.speechText.next'));
    }
  }, [iconsButton]);

  useEffect(() => {
    if (currentIndexQuestion === 12 * currentRound) {
      setPage('finish');
    }
  }, [currentIndexQuestion]);

  useEffect(() => {
    if (!micDisabled) {
      recognition.start();
    }
    recognition.onerror = ({ error }) => {
      console.error(error);
    };

    recognition.onstart = () => {
      setIconsButton(SpeakButtonRec);
      setTextClickSpeak('Speak');
      setPressMic(true);
      setMicDisabled(true);
      setWrongAnswer(false);
      setValue('');
      setTimeout(() => {
        recognition.stop();
      }, wordsData[currentIndexQuestion].word.length * 500);
    };

    recognition.onend = () => {
      setPressMic(false);
      setIconsButton(SpeakButtonPress);
      setTextClickSpeak(t('games.speechText.clickSpeak'));
      setMicDisabled(false);
      if (
        tasks[currentIndexQuestion]?.correctAnswer.trim().toLowerCase() !==
        textVoice.trim().toLowerCase()
      ) {
        setWrongAnswer(true);
        setIsActiveMicText(true);
        setIsActiveButtonEmojiText(false);
        if (count >= 2) {
          setEmojiText(NEGATIVE_REACTION[3].text);
          setEmojiFace(NEGATIVE_REACTION[3].emoji);
          setEmojiTextButton(t('games.speechText.next'));
        } else {
          setEmojiFace(NEGATIVE_REACTION[count].emoji);
          setEmojiText(NEGATIVE_REACTION[count].text);
          setEmojiTextButton(t('games.speechText.try'));
        }
      }
    };

    recognition.onresult = (event) => {
      let text = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          text += event.results[i][0].transcript;
        }
      }
      textVoice = text;
      if (IsChrome) {
        setValue(text);
      } else if (IsSafari) {
        setValue(text);
        setTimeout(() => {
          recognition.stop();
        }, WRONG_ANSWER_DELAY_MS);
      }
    };
  }, [count]);
  const handleClick = () => {
    if (rightAnswer) {
      nextQuestion();
      addToAlreadyLearned();
      setCorrect(true);
      nextWord();
      nextStep();
      setCount(-1);
      setMicDisabled(true);
    } else if (count >= 2) {
      nextQuestionSkip();
      addToAlreadyLearned();
      setCorrect(true);
      nextWord();
      nextStep();
      setCount(-1);
      setMicDisabled(true);
    } else if (wrongAnswer) {
      setIsActiveButtonEmojiText(true);
      setIsActiveMicText(false);
      setWrongAnswer(false);
      addWordToShowAgain();
      setCorrect(false);
    }
  };

  const refreshPage = () => {
    if (!pressMic) {
      setIconsButton(SpeakButtonPress);
    }
  };

  const handleClickAgain = () => {
    setIsActiveButtonEmojiText(true);
    setIsActiveMicText(false);
    setWrongAnswer(false);
  };

  return (
    <>
      {mainStore.isMobile ? (
        <Typography variant="h3" className={styles.speak}>
          {t('games.speechText.speak')}
        </Typography>
      ) : null}
      <div className={styles.sentence}>
        <div className={styles.blockWrapper}>
          <div className={styles.playerContainer}>
            <Video interval={props.interval} videoUrl={props.videoUrl} />
          </div>
        </div>
        <div className={styles.speakSentence}>
          {mainStore.isMobile ? null : (
            <Typography variant="h3" className={styles.speak}>
              {t('games.speechText.speak')}
            </Typography>
          )}
          <Typography variant="game" className={styles.sentenceGame}>
            {props.sentence?.split(props.missingWord)[0]}
            <span className={buttonClassesWord}>{props.missingWord}</span>
            {props.sentence?.split(props.missingWord)[1]}
          </Typography>
        </div>
      </div>
      <div className={styles.gameField}>
        <div className={styles.wordButton}>
          <div className={buttonMicText}>
            <IconButton
              disabled={micDisabled}
              className={styles.micButton}
              onClick={() => setCount(count + 1)}
            >
              {iconsButton}
              {pressMic ? (
                <div>
                  <span className={styles.micButton__line1}></span>
                  <span className={styles.micButton__line2}></span>
                  <span className={styles.micButton__line3}></span>
                </div>
              ) : null}
            </IconButton>
            <Typography variant="h4" className={styles.textClick}>
              {textClickSpeak}
            </Typography>
          </div>
          <div className={buttonEmojiText}>
            <span className={styles.emoji}>{emojiFace}</span>
            <Typography variant="text1" className={styles.textEmoji}>
              {emojiText}
            </Typography>
            <Button
              onClick={handleClick}
              color="primary"
              variant="contained"
              size="large"
              className={styles.buttonEmoji}
            >
              {emojiTextButton}
            </Button>
            {count >= 2 && !rightAnswer ? (
              <Typography
                variant="button2"
                className={styles.textButtonTry}
                onClick={handleClickAgain}
              >
                {t('games.speechText.try')}
              </Typography>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
});
