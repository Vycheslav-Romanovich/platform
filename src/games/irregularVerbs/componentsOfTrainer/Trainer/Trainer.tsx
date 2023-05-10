import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { getMessage, getMessages } from '../../data/verbs';
import {
  Group,
  MessagesInterface,
  SetWordsListType,
  TranslateType,
} from '../../models/model_verbs';
import Answer from '../Answer/Answer';
import ChooseVerb from '../ChooseVerb/ChooseVerb';
import Translate from '../Translate/Translate';

import style from './Trainer.module.scss';

import { ProgressBar } from '~/components/progressBar/progressBar';
import Hint from '~/games/irregularVerbs/componentsOfTrainer/Hint/Hint';

type PropsTrainerType = {
  setPage: (str: string) => void;
  setIsHint: (value: boolean) => void;
  isHint: boolean;
  rating: number;
  noProgress?: boolean;
  id?: string;
  setCongrats?: (value: boolean) => void;
  setRating: (rating) => void;
};
const Trainer = (props: PropsTrainerType) => {
  const router = useRouter();
  const query = props.id ? props.id : router.query.id;

  const [message, setMessage] = useState<MessagesInterface>();
  const [numberVerb, setNumberVerb] = useState(0);
  const [random, setRandom] = useState<Group[]>();
  const [lang, setLang] = useState<keyof TranslateType>('en');
  const [styleForm_1, setStyleForm_1] = useState(style.readyWords);
  const [styleForm_2, setStyleForm_2] = useState(style.readyWords);
  const [styleForm_3, setStyleForm_3] = useState(style.readyWords);
  const [isCheckForm_1, setIsCheckForm_1] = useState(style.wrongWords);
  const [isCheckForm_2, setIsCheckForm_2] = useState(style.wrongWords);
  const [isCheckForm_3, setIsCheckForm_3] = useState(style.wrongWords);
  const [win, setWin] = useState(false);
  const [fail, setFail] = useState(false);
  const [stopScores, setStopScores] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [isSound, setIsSound] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const [wordList_1, setWordsList_1] = useState<SetWordsListType>({
    id: 'one',
    wordId: 11,
    word: ' ',
  });
  const [wordList_2, setWordsList_2] = useState<SetWordsListType>({
    id: 'two',
    wordId: 111,
    word: ' ',
  });
  const [wordList_3, setWordsList_3] = useState<SetWordsListType>({
    id: 'three',
    wordId: 1111,
    word: ' ',
  });
  const setWordHandler = (word: string, wordId: number) => {
    if (wordList_1.word === ' ') {
      setStyleForm_1(style.wordFromList);
      setWordsList_1({ id: 'one', wordId: wordId, word: word });
    } else if (wordList_2.word === ' ') {
      setStyleForm_2(style.wordFromList);
      setWordsList_2({ id: 'two', wordId: wordId, word: word });
    } else if (wordList_3.word === ' ') {
      setStyleForm_3(style.wordFromList);
      setWordsList_3({ id: 'three', wordId: wordId, word: word });
    } else if (wordList_3.word !== ' ') {
      return;
    }
  };
  const setCancelWordHandler = (id: string) => {
    if (wordList_3.word === ' ') {
      if (id === 'one' && wordList_1.word !== ' ') {
        setWordsList_1({ id: 'one', wordId: 11, word: ' ' });
        setStyleForm_1(style.readyWords);
      } else if (id === 'two' && wordList_2.word !== ' ') {
        setWordsList_2({ id: 'two', wordId: 111, word: ' ' });
        setStyleForm_2(style.readyWords);
      } else if (id === 'three' && wordList_3.word !== ' ') {
        setWordsList_3({ id: 'three', wordId: 1111, word: ' ' });
        setStyleForm_3(style.readyWords);
      }
    }
  };
  const randomHandling = () => {
    const randomList = message?.verbs[numberVerb]?.group.sort(
      () => Math.round(Math.random() * 100) - 50
    );
    if (randomList) {
      setRandom(randomList);
    }
  };

  const allFormsForAlert = message?.verbs[numberVerb]?.formVerbs.map((el) => el).join(' - ');

  const checkFunction = () => {
    const genMessage = message?.verbs[numberVerb]?.formVerbs;
    if (message && wordList_1.word === genMessage[0]) {
      setIsCheckForm_1(style.rightWords);
    }
    if (message && wordList_2.word === genMessage[1]) {
      setIsCheckForm_2(style.rightWords);
    }
    if (message && wordList_3.word === genMessage[2]) {
      setIsCheckForm_3(style.rightWords);
    }
    if (
      message &&
      wordList_1.word === genMessage[0] &&
      message &&
      wordList_2.word === genMessage[1] &&
      message &&
      wordList_3.word === genMessage[2]
    ) {
      setWin(true);
      props.noProgress && props.setCongrats(true);
      if (props.rating !== 20 && !stopScores) props.setRating(props.rating + 1);
    } else {
      setFail(true);
      !props.noProgress && setShowAlert(true);
      props.noProgress && props.setCongrats(true);
      if (props.rating > 0) props.setRating(props.rating - 1);
    }
  };

  const vinHandling = () => {
    if (win) {
      setStyleForm_1(style.readyWords);
      setStyleForm_2(style.readyWords);
      setStyleForm_3(style.readyWords);
      setWordsList_1({ id: 'one', wordId: 11, word: ' ' });
      setWordsList_2({ id: 'two', wordId: 111, word: ' ' });
      setWordsList_3({ id: 'three', wordId: 1111, word: ' ' });
      setIsCheck(false);
      setIsCheckForm_1(style.wrongWords);
      setIsCheckForm_2(style.wrongWords);
      setIsCheckForm_3(style.wrongWords);
      setWin(false);
      setStopScores(false);

      if (numberVerb < 19) setNumberVerb(numberVerb + 1);
      else setNumberVerb(0);
      setMessage((messages) => messages);
    }
  };
  const hintStopScores = () => {
    setStopScores(true);
  };

  const failHandling = () => {
    if (fail) {
      props.noProgress && props.setCongrats(true);
      setStyleForm_1(style.readyWords);
      setStyleForm_2(style.readyWords);
      setStyleForm_3(style.readyWords);
      setWordsList_1({ id: 'one', wordId: 11, word: ' ' });
      setWordsList_2({ id: 'two', wordId: 111, word: ' ' });
      setWordsList_3({ id: 'three', wordId: 1111, word: ' ' });
      setIsCheck(false);
      setIsCheckForm_1(style.wrongWords);
      setIsCheckForm_2(style.wrongWords);
      setIsCheckForm_3(style.wrongWords);
      setFail(false);
      setShowAlert(false);
      stop();
      setMessage((messages) => messages);
    }
    if (props.isHint) {
      hintStopScores();
      props.setIsHint(false);
      setShowAlert(false);
      stop();
    }
  };
  useEffect(() => {
    let time = 2200;
    if (!isSound) {
      time = 1000;
    }
    if (props.rating === 20) {
      setMessage(message);
      const timeId = setTimeout(() => {
        setIsEnd(true);
        props.setPage('finish');
      }, time);
      return () => clearTimeout(timeId);
    }
  }, [props.rating]);

  useEffect(() => {
    if (wordList_3.word !== ' ') {
      setIsCheck(true);
      checkFunction();
    }
  }, [wordList_3.word]);

  useEffect(() => {
    let time = 2400;
    if (!isSound) {
      time = 1200;
    }
    const idTime = setTimeout(() => {
      vinHandling();
    }, time);
    return () => clearTimeout(idTime);
  }, [win]);

  useEffect(() => {
    if (typeof query === 'string') {
      const msg = getMessage(parseInt(query), props.noProgress);
      setMessage(msg);
    }
  });

  useEffect(() => {
    randomHandling();
  }, [message, numberVerb]);

  useEffect(() => {
    return () => {
      getMessages();
      setWordsList_1({ id: 'one', wordId: 11, word: ' ' });
      setWordsList_2({ id: 'two', wordId: 111, word: ' ' });
      setWordsList_3({ id: 'three', wordId: 1111, word: ' ' });
      setNumberVerb(0);
    };
  }, [query]);

  return (
    <div>
      {!props.noProgress && (
        <ProgressBar
          setPage={props.setPage}
          currentValue={props.rating}
          maxLength={20}
          step={0}
          isValue={true}
        />
      )}
      <Translate translate={message?.verbs[numberVerb]?.translate[lang]} />
      <Answer
        isCheck={isCheck}
        isCheckForm_1={isCheckForm_1}
        isCheckForm_2={isCheckForm_2}
        isCheckForm_3={isCheckForm_3}
        styleForm_1={styleForm_1}
        styleForm_2={styleForm_2}
        styleForm_3={styleForm_3}
        wordList_1={wordList_1}
        wordList_2={wordList_2}
        wordList_3={wordList_3}
        setCancelWordHandler={setCancelWordHandler}
      />
      <ChooseVerb
        random={random}
        setWordHandler={setWordHandler}
        wordList_1={wordList_1}
        wordList_2={wordList_2}
        wordList_3={wordList_3}
        allFormsForAlert={allFormsForAlert}
        failHandling={failHandling}
        showAlert={showAlert}
        isHint={props.isHint}
      />
      {!props.noProgress && (
        <div className={style.viewHint}>
          <Hint setIsHint={props.setIsHint} />
        </div>
      )}
    </div>
  );
};

export default Trainer;
