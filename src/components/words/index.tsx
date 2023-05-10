import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import { getWordIndex } from './utils/getWordIndex';
import { wrapText } from './utils/wrapText';

import { videoStore } from '~/stores';
import { AddWordResponse, WordInfo, WordViewData } from '~/types/api';
import { Idioms } from '~/types/subtitles';

type Props = {
  onSelect?: (data: WordInfo) => void;
  onCloseSelect?: (e?) => void;
  children: string;
  idioms?: Idioms;
  addedWords?: AddWordResponse[];
  disableSelecting?: boolean;
};

export const Words: React.FC<Props> = observer(({ onSelect, onCloseSelect, children, idioms }) => {
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    const resetSelected = (event?) => {
      setSelected((old) => {
        if (old) return undefined;
        return old;
      });
      onCloseSelect && onCloseSelect(event);
    };

    document.addEventListener('mousedown', resetSelected);
    document.addEventListener('touchstart', resetSelected);
    return () => {
      resetSelected();
      document.removeEventListener('mousedown', resetSelected);
      document.removeEventListener('touchstart', resetSelected);
    };
  }, []);

  const handleClickOnWord = (event, data: WordViewData) => {
    const target = event.target;
    const index = getWordIndex(target);
    const clientRect: DOMRect = target.getClientRects()[0];
    const text = target.textContent;
    let selectedIdioms = null;

    videoStore.setPause(true);
    setSelected(data.id);

    if (idioms) {
      selectedIdioms = { ...idioms };
      selectedIdioms.foundIdioms = selectedIdioms.foundIdioms.filter((_, i) =>
        data.idiomIds.some((ind) => ind == i)
      );
      selectedIdioms.foundIdiomPosition = selectedIdioms.foundIdiomPosition.filter((_, i) =>
        data.idiomIds.some((ind) => ind == i)
      );
    }
    onSelect &&
      onSelect({
        index,
        text,
        clientRect,
        selectedIdioms,
        addedWordInfo: data.addedWordInfo,
      });
  };

  return <div id="subtitles">{wrapText(children, handleClickOnWord, selected)}</div>;
});
