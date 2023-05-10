import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Typography } from '@mui/material';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import SpeakButtonDisabled from '~/assets/icons/speakButtons/speakButtonDisabled.svg';
import SpeakButtonPress from '~/assets/icons/speakButtons/speakButtonPress.svg';
import SpeakButtonRec from '~/assets/icons/speakButtons/speakButtonRec.svg';
import Volume from '~/assets/icons/vocabulary/volume.svg';

import styles from './speechText.module.scss';

import { RIGHT_ANSWER_DELAY_MS, WRONG_ANSWER_DELAY_MS } from '~/constants/variable';
import { playMachineAudioFragment } from '~/helpers/playMachineAudioFragment';
import { speechRecognition } from '~/helpers/speechRecognition';
import { lessonStore, variantStore } from '~/stores';

export const SpeechText: React.FC = observer(() => {
  const { currentIndexQuestion, currentRound, setPage, nextQuestion, nextQuestionSkip } =
    variantStore;
  const { wordsData } = lessonStore;
  const { t } = useTranslation();
  const [iconsButton, setIconsButton] = useState(SpeakButtonDisabled);
  const [micDisabled, setMicDisabled] = useState<boolean>(true);
  const [pressMic, setPressMic] = useState<boolean>(false);
  const [isActiveVoice, setIsActiveVoice] = useState<boolean>(false);
  const [isActiveMicText, setIsActiveMicText] = useState<boolean>(false);
  const [isActiveButtonEmojiText, setIsActiveButtonEmojiText] = useState<boolean>(true);
  const [rightAnswer, setRightAnswer] = useState<boolean>(false);
  const [wrongAnswer, setWrongAnswer] = useState<boolean>(false);
  const [emojiTextButton, setEmojiTextButton] = useState<string>(t('games.speechText.next'));
  const [textMic, setTextMic] = useState<string>(t('games.speechText.clickSpeak'));
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
  const buttonClassesVoice = classNames(styles.voiceButton, {
    [styles.active]: isActiveVoice,
  });
  let textVoice = '';
  const IsChrome = navigator.userAgent.toLowerCase().includes('chrome');
  const IsSafari =
    navigator.userAgent.toLowerCase().includes('safari') ||
    navigator.userAgent.toLowerCase().includes('mac');
  const recognition = speechRecognition(lang);

  useEffect(() => {
    if (!micDisabled) {
      recognition.start();
    }

    recognition.onerror = ({ error }) => {
      console.error(error);
      recognition.abort();
    };

    recognition.onstart = () => {
      setIconsButton(SpeakButtonRec);
      setTextMic('Speak');
      setPressMic(true);
      setMicDisabled(true);
      setWrongAnswer(false);
      setValue('');
      setTimeout(() => {
        recognition.stop();
      }, wordsData[currentIndexQuestion].word.length * 500);
    };

    recognition.onend = () => {
      setIconsButton(SpeakButtonPress);
      setPressMic(false);
      setTextMic(t('games.speechText.clickSpeak'));
      setMicDisabled(false);
      if (
        wordsData[currentIndexQuestion].word.trim().toLowerCase() !== textVoice.trim().toLowerCase()
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
  useEffect(() => {
    setValue('');
    setRightAnswer(false);
    setWrongAnswer(false);
    setIsActiveMicText(false);
    setIconsButton(SpeakButtonDisabled);
    setPressMic(false);
    setMicDisabled(true);
    setIsActiveButtonEmojiText(true);
    const timer = setTimeout(() => {
      setIsActiveVoice(true);
      playMachineAudioFragment(wordsData[currentIndexQuestion].word)
        .then(() => setIsActiveVoice(false))
        .then(() => setIconsButton(SpeakButtonPress))
        .then(() => setMicDisabled(false));
      setCount(-1);
    }, RIGHT_ANSWER_DELAY_MS);

    return () => {
      clearTimeout(timer);
      recognition.stop();
    };
  }, [currentIndexQuestion, wordsData]);

  useEffect(() => {
    if (wordsData[currentIndexQuestion].word.trim().toLowerCase() === value.trim().toLowerCase()) {
      setRightAnswer(true);
      setIsActiveMicText(true);
      setIsActiveButtonEmojiText(false);
      setEmojiFace(POSITIVE_REACTION[currentIndexQuestion % 4].emoji);
      setEmojiText(POSITIVE_REACTION[currentIndexQuestion % 4].text);
      setEmojiTextButton(t('games.speechText.next'));
      setTimeout(() => {
        setValue('');
      }, RIGHT_ANSWER_DELAY_MS);
    }
  }, [iconsButton]);

  useEffect(() => {
    if (currentIndexQuestion === 12 * currentRound) {
      setPage('finish');
    }
  }, [currentIndexQuestion]);

  const handleClick = () => {
    if (rightAnswer) {
      nextQuestion();
    } else if (count >= 2) {
      nextQuestionSkip();
    } else if (wrongAnswer) {
      setIsActiveButtonEmojiText(true);
      setIsActiveMicText(false);
      setWrongAnswer(false);
    }
  };
  const handleClickAgain = () => {
    setIsActiveButtonEmojiText(true);
    setIsActiveMicText(false);
    setWrongAnswer(false);
  };

  return (
    <>
      <div className={styles.gameField}>
        <div className={styles.wordButton}>
          <div className={styles.buttonVoiceWord}>
            <IconButton
              className={buttonClassesVoice}
              onClick={() => {
                setIsActiveVoice(true);
                playMachineAudioFragment(wordsData[currentIndexQuestion].word).then(() =>
                  setIsActiveVoice(false)
                );
              }}
            >
              <Volume />
            </IconButton>
            <Typography className={buttonClassesWord}>
              {wordsData[currentIndexQuestion].word}
            </Typography>
          </div>
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
              {textMic}
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
