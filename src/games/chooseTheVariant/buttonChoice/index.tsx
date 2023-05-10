import React, { useEffect, useState } from 'react';
import { Button, buttonClasses } from '@mui/material';
import cn from 'classnames';
import { observer } from 'mobx-react';

import styles from './buttonChoice.module.scss';

import { RIGHT_ANSWER_DELAY_MS, WRONG_ANSWER_DELAY_MS } from '~/constants/variable';
import { variantStore } from '~/stores';

type Props = {
  translation: string;
  correctTranslation: string;
  variantSize: 'small' | 'medium' | 'large';
};

export const ButtonChoice = observer(({ translation, correctTranslation, variantSize }: Props) => {
  const [rightAnswer, setRightAnswer] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [hidden, setHidden] = useState(false);
  const {
    currentIndexQuestion,
    nextQuestion,
    currentStepInRound,
    setCurrentStepInRound,
    wordsInCurrentRound,
    clickIsAble,
    setClickIsAbles,
  } = variantStore;

  const btnClasses = cn(styles.buttonChoiceQuiz, {
    [styles.buttonChoiceRight]: rightAnswer,
    [styles.buttonChoiceWrong]: wrongAnswer,
    [styles.buttonChoiceHidden]: hidden,
  });

  const finalButtonClass =
    variantSize === 'small'
      ? btnClasses
      : variantSize === 'medium'
      ? cn(btnClasses, styles.mediumProperties)
      : cn(btnClasses, styles.largeProperties);

  const handleAnswer = () => {
    if (correctTranslation === translation) {
      setClickIsAbles(false);
      setRightAnswer(true);
      currentStepInRound === wordsInCurrentRound
        ? setCurrentStepInRound(currentStepInRound)
        : setCurrentStepInRound(currentStepInRound + 1);
      setTimeout(() => {
        nextQuestion();
        setClickIsAbles(true);
      }, RIGHT_ANSWER_DELAY_MS);
    } else if (correctTranslation !== translation) {
      setWrongAnswer(true);

      setTimeout(() => {
        setHidden(true);
        setWrongAnswer(false);
      }, WRONG_ANSWER_DELAY_MS);
    }
  };

  // reset button state
  useEffect(() => {
    setHidden(false);
    setRightAnswer(false);
    setHidden(false);
  }, [currentIndexQuestion]);

  return (
    <Button
      variant="outlined"
      onClick={clickIsAble ? handleAnswer : null}
      className={finalButtonClass}
    >
      {translation}
    </Button>
  );
});
