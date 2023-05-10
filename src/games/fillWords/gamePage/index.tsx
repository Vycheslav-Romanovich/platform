import React, { FC, MouseEvent, TouchEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton } from '@mui/material';
import { observer } from 'mobx-react';

import ImageHint from '~/assets/images/hint.svg';

import styles from './index.module.scss';

import { fillWordStore, lessonStore, mainStore } from '~/stores';
import { WordPair } from '~/types/api';

const combination: number[][] = [];
const combinationDom: Array<HTMLElement> = [];
const hintColor: string = null;
let firstCell: HTMLDivElement = null;
let targetCell: HTMLDivElement = null;
let hintCell: HTMLElement = null;
let nextCellColor: string = null;

const GamePage: FC = () => {
  const { t } = useTranslation();
  const { lessonData } = lessonStore;
  let { wordsDataStorage } = fillWordStore;
  const wordsToGame: WordPair[] = [];
  const {
    isFieldBlocked,
    loadData,
    wordsPair,
    countWordReadyGame,
    fillWordDataStorage,
    wordsCount,
    value,
    round,
    hintWordId,
    validColors,
    translateWord,
    countRound,
    currentCountAnswer,
    setIsOpenedModal,
    setCurrentCountAnswer,
    addTranslateWord,
    setHintWordId,
    setWordsCount,
    setValidColors,
    setWordsPair,
    setCountWordReadyGame,
    resetCountReadyWords,
    resetTranslatedWord,
    addWords,
    getRandomField,
    setFillWordDataStorage,
    setPage,
    resetCells,
    isIncludeWord,
    pushWordsPair,
  } = fillWordStore;

  useEffect(() => {
    if (mainStore.isMobile) {
      document.body.style.overflow = 'hidden';
    }
    if (loadData && round === 1) {
      resetCountReadyWords();
      counterWordsGame(lessonData.word);
      addWords(wordsToGame);
      const level = getRandomField(5);
      setFillWordDataStorage(level);
    }
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [loadData]);

  useEffect(() => {
    if (value > 0) {
      resetCells(fillWordStore.combinationDomList);
      resetTranslatedWord();
      addWords(wordsToGame);
      const level = getRandomField(5);
      setFillWordDataStorage(level);
      setValidColors();
    }
  }, [value]);

  useEffect(() => {
    resetCells(fillWordStore.combinationDomList);
    resetTranslatedWord();
    setValidColors();
    if (wordsPair) {
      let lenghtWordPair = 0;
      const newWordPair: WordPair[] = wordsPair;
      if (round === countRound && wordsCount < countWordReadyGame) {
        newWordPair.forEach((pair) => {
          if (pair.word.length >= 20) {
            return;
          } else {
            lenghtWordPair += pair.word.length;
          }
        });
        for (const word of lessonData.word) {
          if (!isIncludeWord(newWordPair, word.word)) {
            newWordPair.push(word);
            lenghtWordPair += word.word.length;
            if (lenghtWordPair >= 25) {
              break;
            }
          }
        }
        setWordsPair(newWordPair);
      }
      addWords(wordsPair);
      const level = getRandomField(5);
      setFillWordDataStorage(level);
    }
  }, [round]);

  function counterWordsGame(items: WordPair[]) {
    items.forEach((item) => {
      const wordLength = item.word.length;
      if (wordLength >= 20) {
        return;
      } else {
        wordsToGame.push(item);
        pushWordsPair(item);
        setCountWordReadyGame();
      }
    });
  }

  function firstOnTouchStart(element: HTMLDivElement): void {
    const x: string = element.dataset.x;
    const y: string = element.dataset.y;

    if (x && y && element?.dataset.state !== 'valid') {
      firstCell = element;
      setActiveCell(element);
    }
  }

  function firstOnTouchMove(x: number, y: number): void {
    const currentCell = document.elementFromPoint(x, y) as HTMLDivElement;

    if (checkValidCell(targetCell, currentCell)) {
      setActiveCell(currentCell);
    } else if (checkMovingBack(targetCell, currentCell)) {
      cancellingSelection(currentCell);
    }
  }

  function firstOnTouchEnd() {
    const userCombination = JSON.stringify(combination);
    let isWordCorrect = false;
    wordsDataStorage = wordsDataStorage.filter((word) => {
      if (JSON.stringify(word.connection) === userCombination) {
        isWordCorrect = true;
        addTranslateWord(word.id);
        if (hintWordId != 0 && word.id === hintWordId && hintCell != null) {
          hintCell.style.color = 'var(--Black)';
          setHintWordId(0);
          hintCell = null;
        }
        if (hintWordId != 0 && word.id != hintWordId && hintCell != null) {
          hintCell.style.background = validColors[validColors.length - 2];
        }
        if (wordsPair.find((wordsPair) => wordsPair.word === word.word)) {
          setWordsCount();
        }
        setWordsPair(wordsPair.filter((wordPair) => wordPair.word != word.word));

        return false;
      } else {
        return true;
      }
    });

    if (isWordCorrect) {
      nextCellColor = getNextCellColor();
      combinationDom.forEach((e) => {
        e.dataset.state = 'valid';
        e.style.background = nextCellColor;
        fillWordStore.setCombinationDomList([e]);
        setCurrentCountAnswer(currentCountAnswer + 1);
      });
    } else {
      let collectWord = '';

      combinationDom.forEach((el) => {
        collectWord += el.textContent.trim();
      });
      checkCollectDifferently(collectWord, wordsDataStorage);

      resetCells(combinationDom);
      if (hintWordId != 0 && hintCell != null) {
        hintCell.style.background = validColors[validColors.length - 1];
      }
    }
    clearCellData();
  }

  function setActiveCell(cell: any): void {
    targetCell = cell;
    const x = parseInt(targetCell?.dataset.x, 10);
    const y = parseInt(targetCell?.dataset.y, 10);

    nextCellColor = validColors[validColors.length - 1];
    targetCell.dataset.state = 'active';
    targetCell.style.background = firstCell?.dataset.hint === 'hinted' ? hintColor : nextCellColor;
    combinationDom.push(targetCell);
    combination.push([y, x]);
  }

  function checkValidCell(currentCell: any, nextCell: any): boolean {
    const currentX = parseInt(currentCell?.dataset.x, 10);
    const currentY = parseInt(currentCell?.dataset.y, 10);
    const nextX = parseInt(nextCell?.dataset.x, 10);
    const nextY = parseInt(nextCell?.dataset.y, 10);

    return (
      ((currentX === nextX - 1 && currentY === nextY) ||
        (currentX === nextX + 1 && currentY === nextY) ||
        (currentX === nextX && currentY === nextY + 1) ||
        (currentX === nextX && currentY === nextY - 1)) &&
      !nextCell?.dataset.state &&
      (nextCell.dataset.hint !== 'hinted' ||
        (nextCell.dataset.hint === 'hinted' && currentCell.dataset.hint === 'hinted'))
    );
  }

  function checkMovingBack(currentCell: any, nextCell: any): boolean {
    return (
      nextCell?.dataset.state && nextCell?.dataset.state !== 'valid' && currentCell !== nextCell
    );
  }

  function cancellingSelection(cell: any): void {
    targetCell = cell;
    const index = combinationDom.indexOf(targetCell) + 1;
    const arrToDelete = combinationDom.slice(index);
    resetCells(arrToDelete);
    combinationDom.length = combination.length = index;
  }

  function getNextCellColor(): string {
    if (combinationDom[0].dataset.hint !== 'hinted') {
      return validColors.pop();
    } else {
      return hintColor;
    }
  }

  function checkCollectDifferently(collectWord: any, level: any) {
    level.forEach((word: { word: string }) => {
      if (word.word.toLowerCase() === collectWord.toLowerCase()) {
        setIsOpenedModal('DONE');
      }
    });
  }

  function clearCellData() {
    combinationDom.length = 0;
    combination.length = 0;
    firstCell = null;
    targetCell = null;
  }

  function SpliteWord(wordString: any) {
    const COUNTLETTER = mainStore.isMobile ? 29 : 22;
    const wordTranslate = objToString(wordString);

    function objToString(obj) {
      let str = '';
      for (const [, val] of Object.entries(obj)) {
        str += `${val}`;
      }
      return str;
    }

    const countWord = Math.ceil(wordTranslate.length / COUNTLETTER);
    const content = [];
    for (let i = 0; i < countWord; i++) {
      content.push(
        <p key={i}>{wordTranslate.substring(i * COUNTLETTER, COUNTLETTER * (i + 1))}</p>
      );
    }

    return <>{content}</>;
  }

  function HiddenWords(props: any): JSX.Element {
    const [hidden, hiddenChange] = useState(0);
    const length = mainStore.isMobile ? 29 : 22;
    useEffect(() => {
      setTimeout(() => hiddenChange(hidden + 1), 300);
    }, [hidden]);
    return (
      <p
        className={translateWord.includes(props.word.id, 0) ? styles.word_valid : styles.word}
        style={
          props.word.id === hintWordId
            ? {
                textDecoration: `underline 2px ${validColors[validColors.length - 1]}`,
                textUnderlineOffset: 4,
              }
            : null
        }
      >
        {props.word.translate.length > length ? (
          <SpliteWord Word={props.word.translate} key={props.word.translate} />
        ) : (
          props.word.translate
        )}
      </p>
    );
  }

  function isString(value: any) {
    return typeof value === 'string' || value instanceof String;
  }

  const hint = () => {
    wordsDataStorage.forEach((word) => {
      if (!translateWord.includes(word.id, 0)) {
        setHintWordId(word.id);
        hintCell = document.getElementById(`y=${word.connection[0][0]}x=${word.connection[0][1]}`);
        return false;
      }
    });
    hintCell.style.background = validColors[validColors.length - 1];
    hintCell.style.color = 'var(--White)';
  };

  return (
    <>
      {currentCountAnswer < fillWordDataStorage?.words.length ? (
        <>
          <div className={styles.adaptiveBtn}>
            <IconButton onClick={() => setPage('leave')}>
              <CloseRoundedIcon style={{ height: 24 }} />
            </IconButton>
          </div>

          <div className={styles.gamefield}>
            <div
              className={styles.cellwrapper}
              onMouseDown={
                isFieldBlocked
                  ? null
                  : (e: MouseEvent) => firstOnTouchStart(e.target as HTMLDivElement)
              }
              onTouchStart={
                isFieldBlocked
                  ? null
                  : (e: TouchEvent) => firstOnTouchStart(e.target as HTMLDivElement)
              }
              onMouseMove={
                isFieldBlocked ? null : (e: MouseEvent) => firstOnTouchMove(e.clientX, e.clientY)
              }
              onTouchMove={
                isFieldBlocked
                  ? null
                  : (e: TouchEvent) =>
                      firstOnTouchMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
              }
              onMouseUp={isFieldBlocked ? null : () => firstOnTouchEnd()}
              onTouchEnd={isFieldBlocked ? null : () => firstOnTouchEnd()}
            >
              {
                <div className={styles.cellsrow}>
                  {fillWordDataStorage.board.map((celly, y) => (
                    <div className={styles.row} key={y}>
                      {celly.map((col, x) => (
                        <div
                          className={styles.cell}
                          key={x}
                          id={`y=${y}x=${x}`}
                          data-y={y}
                          data-x={x}
                          data-state={isString(col) ? '' : 'valid'}
                        >
                          {isString(col) ? col : ''}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              }
            </div>
            <div className={styles.appwordsblock}>
              <div className={styles.wordswrapper}>
                {fillWordDataStorage.words.map((word) => (
                  <HiddenWords word={word} key={word.id} />
                ))}
              </div>
            </div>
          </div>
          <>
            <div className={styles.adaptiveBtnHint}>
              <div className={styles.divHint}>
                <ImageHint onClick={hint} />
              </div>
            </div>
          </>
        </>
      ) : null}
    </>
  );
};
export default observer(GamePage);
