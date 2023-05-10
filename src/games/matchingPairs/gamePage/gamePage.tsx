import React, { FC } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';

import s from '~/games/matchingPairs/gamePage/gamePage.module.scss';

import { matchingPairsGameStore } from '~/stores';
import { wordData } from '~/stores/MatchingPairsGameStore';

interface GamePage {
  arrayForRender: wordData[];
  onClickForWord: (word: wordData) => void;
  size: 'xsmall' | 'small' | 'medium' | 'large';
}

const GamePage: FC<GamePage> = ({ arrayForRender, onClickForWord, size }) => {
  const { matchedWords, correctChoices, incorrectChoices, selectedWords } = matchingPairsGameStore;

  const wordDecoration = (word: wordData) => {
    const isWordAlreadyMatched = matchedWords.find((w) => w === word);
    const styleForEachSize = (style: string) => {
      switch (size) {
        case 'xsmall':
          return style;
        case 'small':
          return cn(style, s.smallProperties);
        case 'medium':
          return cn(style, s.mediumProperties);
        case 'large':
          return cn(style, s.largeProperties);
      }
    };

    if (isWordAlreadyMatched) {
      return styleForEachSize(s.contentWrapperAlreadyMatched);
    }

    const isChoiceCorrect = correctChoices.find((w) => w === word);
    const isChoiceIncorrect = incorrectChoices.find((w) => w === word);

    if (isChoiceCorrect) {
      if (word.type === 'original') {
        return styleForEachSize(s.contentWrapperBoldCorrect);
      } else {
        return styleForEachSize(s.contentWrapperCorrect);
      }
    }

    if (isChoiceIncorrect) {
      if (word.type === 'original') {
        return styleForEachSize(s.contentWrapperBoldIncorrect);
      } else {
        return styleForEachSize(s.contentWrapperIncorrect);
      }
    }

    if (word.type === 'original') {
      if (selectedWords.includes(word)) {
        return styleForEachSize(s.clickedContentWrapperBold);
      } else {
        return styleForEachSize(s.contentWrapperBold);
      }
    } else {
      if (selectedWords.includes(word)) {
        return styleForEachSize(s.clickedContentWrapper);
      } else {
        return styleForEachSize(s.contentWrapper);
      }
    }
  };

  return (
    <div className={size === 'xsmall' ? s.gameTable : cn(s.gameTable, s.biggerBlocks)}>
      {arrayForRender.map((word, index) => (
        <div className={wordDecoration(word)} key={index} onClick={() => onClickForWord(word)}>
          {word.word}
        </div>
      ))}
    </div>
  );
};

export default observer(GamePage);
