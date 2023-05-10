import React, { useEffect } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';

import { ButtonChoice } from '../buttonChoice';
import { VolumeButton } from '../volume-button';

import styles from './chooseVariant.module.scss';

import { lessonStore, variantStore } from '~/stores';

export const ChooseVariant: React.FC = observer(() => {
  const {
    currentIndexQuestion,
    currentRound,
    currentStepInRound,
    titleSize,
    variantSize,
    setPage,
    translationsVariants,
    setTranslationsVariants,
    setVariantSize,
  } = variantStore;
  const { wordsData } = lessonStore;

  useEffect(() => {
    const wrongTranslations = wordsData
      .filter((item) => {
        return item.translate !== wordsData[currentIndexQuestion].translate;
      })
      .map((item) => {
        return item.translate;
      });
    if (wrongTranslations.length > 2) {
      wrongTranslations.sort(() => Math.round(Math.random() * 100) - 50).length = 2;
    }
    const shuffledTranslations = [
      wordsData[currentIndexQuestion].translate,
      ...wrongTranslations,
    ].sort(() => Math.round(Math.random() * 100) - 50);
    setTranslationsVariants(shuffledTranslations);
    setVariantSize();
  }, [currentIndexQuestion]);

  useEffect(() => {
    if (currentIndexQuestion === 12 * currentRound) {
      setPage('finish');
    }
  }, [currentStepInRound, currentIndexQuestion]);

  return (
    <>
      <div className={styles.volumeButton}>
        <VolumeButton word={wordsData[currentIndexQuestion].word} />
      </div>

      <div
        className={
          titleSize === 'large'
            ? cn(styles.titleNameQuiz, styles.largeProperties)
            : styles.titleNameQuiz
        }
      >
        {wordsData[currentIndexQuestion].word}
      </div>

      <div className={styles.buttonsChoiceQuiz}>
        {translationsVariants.map((translation: string, index: number) => (
          <ButtonChoice
            variantSize={variantSize}
            key={index}
            correctTranslation={wordsData[currentIndexQuestion].translate}
            translation={translation}
          />
        ))}
      </div>
    </>
  );
});
