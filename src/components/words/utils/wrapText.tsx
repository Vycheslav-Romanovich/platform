import cn from 'classnames';

import styles from '../words.module.scss';

import { lessonStore, subtitlesStore } from '~/stores';
import { AddWordResponse, WordViewData } from '~/types/api';

export const wrapText = (
  text: string,
  handleClickOnWord: (event: React.MouseEvent<HTMLElement>, data: WordViewData) => void,
  selected: string
) => {
  const regExp = /([- ,().?"!$%&↵\\[\]\n\r\s])/g;
  const textSubArr = typeof text === 'string' && text.split(regExp);

  const classNames = {
    word: (key: string, idioms: number[], isAdded?: boolean) =>
      cn(styles.word, {
        [styles.selected]: key === selected,
        [styles.added]: isAdded && subtitlesStore.highlightWord,
      }),
  };

  return (
    textSubArr &&
    textSubArr.map((element, indexEl) => {
      if (element === '' || element.match(regExp)) {
        return element;
      }

      const startWordIndex = textSubArr.reduce((acc, item, index) => {
        if (index < indexEl) {
          return acc + item.length;
        }
        return acc;
      }, 0);

      const idiomIds: number[] = [];

      let curAdd = null;
      if (lessonStore.lessonData.word && lessonStore.lessonData.word.length > 0) {
        curAdd = lessonStore.lessonData.word.find(
          (added: AddWordResponse) => startWordIndex === added.index && element === added.word
        );
      }

      const id = 'word_' + element + indexEl;

      return (
        <span
          id="word"
          key={id}
          className={classNames.word(id, idiomIds, Boolean(curAdd))}
          onClick={(e) => {
            e.detail === 1
              ? handleClickOnWord(e, {
                  text: element,
                  id,
                  idiomIds,
                  addedWordInfo: lessonStore.lessonData.word as AddWordResponse[],
                })
              : null;
          }}
        >
          {element}
        </span>
      );
    })
  );
};
