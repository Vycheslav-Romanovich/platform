import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import SwiperCore, { Virtual } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { getWordIndex } from '../words/utils/getWordIndex';
import GetTranslation from './getTranslation';

import styles from './subtitles.module.scss';

import api from '~/api_client/api';
import ContextMenu from '~/components/contextMenu';
import { Words } from '~/components/words';
import videoAction from '~/helpers/videoAction';
import { lessonStore, subtitlesStore, videoStore } from '~/stores';
import { AddWordResponse, WordInfo } from '~/types/api';
import SimpleText from '~/UI/simpleText';

SwiperCore.use([Virtual]);

type Props = {
  loading: boolean;
  translationSubtitles: {
    translation: string;
    isTouched: boolean;
  }[];
  setTranslationSubtitles: React.Dispatch<
    React.SetStateAction<
      {
        translation: string;
        isTouched: boolean;
      }[]
    >
  >;
  wordBan?: boolean;
};

export const useSelectedText = () => {
  const [text, setText] = useState('');

  const select = () => {
    const selected = window.getSelection() as Selection;
    setText(selected.toString().trim());
  };

  return [select, text] as const;
};

export default observer(function Subtitles({
  translationSubtitles,
  setTranslationSubtitles,
  wordBan,
}: Props) {
  const [swiper, setSwiper] = useState<SwiperCore>(null);
  const [second, setSecond] = useState({
    text: '',
    isHide: true,
    loading: false,
    isTouched: false,
  });
  const [contextMenuState, setContextMenuState] = useState({
    isOpen: false,
    text: '',
    position: { x: 0, y: 0 },
    index: 0,
    wordBan: wordBan,
  });
  const [addedWords, setAddedWords] = useState<AddWordResponse[]>([]);
  const contextMenuRef = useRef(null);
  let renderCounter = 3;

  useEffect(() => {
    if (subtitlesStore.isAlwaysShowed) {
      setSecond((old) => ({
        text: old.text,
        isHide: false,
        loading: false,
        isTouched: true,
      }));
    }

    if (subtitlesStore.currentSubtitleId) {
      const words = lessonStore.getWordsFromText(subtitlesStore.currentSubtitle.text);
      setAddedWords(words);
    }
  }, [
    subtitlesStore.currentSubtitleId,
    lessonStore.currentLessonOnLessons,
    subtitlesStore.currentSubtitlesId,
  ]);

  useEffect(() => {
    if (!translationSubtitles.length) {
      const subs = subtitlesStore.currentSubtitles.map(() => ({
        translation: '',
        isTouched: false,
      }));
      setTranslationSubtitles(subs);
    }
    if (
      subtitlesStore.isFastSubtitlesReady &&
      translationSubtitles.length &&
      subtitlesStore.translateSubtitle &&
      subtitlesStore.translateSubtitle.subtitles.length &&
      !translationSubtitles[translationSubtitles.length - 1].translation
    ) {
      const subs = subtitlesStore.translateSubtitle.subtitles.map((sub) => {
        return {
          translation: sub.text,
          isTouched: false,
        };
      });

      setTranslationSubtitles(subs);
    }
  }, [
    subtitlesStore.isFastSubtitlesReady,
    subtitlesStore.currentSubtitleId,
    subtitlesStore.translateSubtitle,
  ]);

  //VVVV самый главный юзеффект
  useEffect(() => {
    const curId = subtitlesStore.currentSubtitleId - 1;
    if (swiper && curId !== swiper.activeIndex) {
      swiper.slideTo(curId);
    }
    if (
      subtitlesStore.currentSubtitleId &&
      subtitlesStore.translateSubtitle &&
      subtitlesStore.currentSubtitles.length === subtitlesStore.translateSubtitle.subtitles.length
    ) {
      subtitlesStore.setSubtitlesTranslation(
        subtitlesStore.translateSubtitle.subtitles[curId].text
      );
      if (translationSubtitles[curId]) {
        setSecond({
          text: translationSubtitles[curId].translation,
          isHide: true,
          loading: false,
          isTouched: translationSubtitles[curId].isTouched,
        });
        if (subtitlesStore.isAlwaysShowed) {
          setSecond({
            text: translationSubtitles[curId].translation,
            isHide: false,
            loading: false,
            isTouched: translationSubtitles[curId].isTouched,
          });
        }
      }
    } else if (translationSubtitles[curId]) {
      setSecond(() => ({
        text: translationSubtitles[curId].translation,
        isHide: true,
        loading: false,
        isTouched: translationSubtitles[curId].isTouched,
      }));
    }
  }, [subtitlesStore.currentSubtitleId, subtitlesStore.isFastSubtitlesReady, translationSubtitles]);

  useEffect(() => {
    if (subtitlesStore.isAlwaysShowed && subtitlesStore.currentSubtitleId) {
      setTranslationSubtitles((old) => {
        old[subtitlesStore.currentSubtitleId - 1] = {
          translation: old[subtitlesStore.currentSubtitleId - 1]?.translation,
          isTouched: true,
        };
        return old;
      });
      if (translationSubtitles[subtitlesStore.currentSubtitleId - 1]?.translation) {
        setSecond((old) => ({
          text: old.text,
          isHide: second.isHide,
          loading: false,
          isTouched: true,
        }));
      }
    }
  }, [subtitlesStore.isAlwaysShowed, subtitlesStore.currentSubtitleId]);

  const showSecond = (text: string, curId?: number) => {
    if (
      second.text &&
      translationSubtitles[subtitlesStore.currentSubtitleId - 1]?.translation !== ''
    ) {
      setSecond((old) => ({ ...old, isHide: false, isTouched: true }));
      setTranslationSubtitles((old) => {
        old[subtitlesStore.currentSubtitleId - 1].isTouched = true;
        return old;
      });
    } else {
      setSecond((old) => ({ ...old, loading: true }));
      api
        .translate({ text })
        .then((text) => {
          if (subtitlesStore.currentSubtitleId === curId) {
            setSecond({ text, isHide: false, loading: false, isTouched: true });
            setTranslationSubtitles((old) => {
              old[subtitlesStore.currentSubtitleId - 1] = {
                translation: text,
                isTouched: true,
              };
              return old;
            });
            subtitlesStore.setSubtitlesTranslation(text);
          }
        })
        .catch((err) => {
          setSecond((old) => ({ ...old, loading: false }));
          console.error(err);
        });
    }
  };

  const handleSwipe = (e: SwiperCore) => {
    const curId = subtitlesStore.currentSubtitleId - 1;
    const needId = e.activeIndex;
    if (needId === curId + 1) {
      window.dataLayer && window.dataLayer.push({ event: 'Swipe', direction: 'forth' });
      videoAction.nextSubtitle();
    } else if (needId === curId - 1) {
      window.dataLayer && window.dataLayer.push({ event: 'Swipe', direction: 'back' });
      videoAction.prevSubtitle();
    } else if (curId !== needId && renderCounter > 0 && needId !== 0) {
      renderCounter--;
      videoAction.setSubtitleById(needId + 1);
    }
  };

  const handleSelectWord = (data: WordInfo | null) => {
    const position = {
      x: data.clientRect.left + data.clientRect.width / 2,
      y: data.clientRect.top,
    };

    setContextMenuState({
      isOpen: true,
      text: data.text,
      position,
      index: data.index,
      wordBan: wordBan,
    });
  };

  const handleCloseSelectWord = (e) => {
    const cur: HTMLElement = contextMenuRef.current;
    document.getSelection().removeAllRanges();
    if (subtitlesStore.isExist) {
      if (!e || !cur.contains(e.target)) {
        setContextMenuState((old) => {
          if (old.isOpen) {
            return { ...old, isOpen: false };
          }
          return old;
        });
      }
    }
  };

  function handleSelectPhrase(event) {
    const { target } = event;

    if (target.id === 'word' || target.id === 'wrapper_sub' || target.id === 'subtitles') {
      const { anchorNode, focusNode } = document.getSelection();
      let selection = '';
      videoStore.setPause(true);

      if (window.getSelection) {
        selection = window.getSelection().toString().trim();
      } else {
        // IE, используем объект selection
        selection = document.selection.createRange().text.trim();
      }

      if (selection !== '') {
        const index = getWordIndex(anchorNode.parentNode);
        const clientRectAncoreNode = anchorNode.parentNode.getClientRects()[0];
        const clientRectFocusNode = focusNode.parentNode.getClientRects()[0];
        let positionX;

        if (anchorNode.parentNode.id === 'word' && focusNode.parentNode.id === 'word') {
          positionX =
            clientRectAncoreNode.left > clientRectFocusNode.left
              ? clientRectFocusNode.left
              : clientRectAncoreNode.left +
                Math.abs(clientRectAncoreNode.left - clientRectFocusNode.left) / 2;
        } else if (
          anchorNode.parentNode.id === 'subtitles' &&
          focusNode.parentNode.id === 'subtitles'
        ) {
          positionX = clientRectAncoreNode.left + anchorNode.parentNode.offsetWidth / 2;
        }

        const position = {
          x: positionX,
          y:
            clientRectFocusNode.y > clientRectAncoreNode.y
              ? clientRectAncoreNode.y
              : clientRectFocusNode.y,
        };

        setContextMenuState({
          isOpen: true,
          text: selection,
          position,
          wordBan: wordBan,
          index: index,
        });
      }
    }
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleSelectPhrase);
    document.addEventListener('mousedown', handleCloseSelectWord);
    return () => {
      document.removeEventListener('mousedown', handleCloseSelectWord);
      document.removeEventListener('mouseup', handleSelectPhrase);
    };
  }, []);

  return (
    subtitlesStore.isExist && (
      <div className={styles.wrapper} id={'slider-subtitles-wrapper'}>
        <Swiper
          onSlideChange={handleSwipe}
          onSwiper={setSwiper}
          simulateTouch={false}
          speed={1}
          virtual
          style={{ width: '100%' }}
        >
          {subtitlesStore.isExist ? (
            subtitlesStore.currentSubtitles.map((subtitle) => {
              const isCurrent = swiper ? swiper.activeIndex === subtitle.id - 1 : false;

              return (
                <SwiperSlide key={subtitle.id}>
                  <div className={styles.subtitle}>
                    {subtitlesStore.subtitleMode === 'Off' ? null : subtitlesStore.subtitleMode ===
                      'to' ? (
                      <span id="wrapper_sub" className={styles.current}>
                        <SimpleText className={isCurrent ? styles.currentText : ''}>
                          {second.text}
                        </SimpleText>
                      </span>
                    ) : (
                      <span id="wrapper_sub" className={styles.current}>
                        <SimpleText className={isCurrent ? styles.currentText : ''}>
                          {isCurrent ? (
                            <Words
                              onSelect={handleSelectWord}
                              onCloseSelect={handleCloseSelectWord}
                              idioms={subtitle.idioms}
                              addedWords={addedWords}
                            >
                              {subtitle.text}
                            </Words>
                          ) : (
                            subtitle.text
                          )}
                        </SimpleText>
                      </span>
                    )}
                    {subtitlesStore.isAlwaysShowed ||
                    subtitlesStore.subtitleMode === 'Dual Subtitles' ? (
                      <>
                        <div className={styles.line} />
                        <GetTranslation
                          subtitle={subtitle}
                          second={second}
                          showSecond={showSecond}
                          isCurrent={isCurrent}
                        />
                      </>
                    ) : null}
                  </div>
                </SwiperSlide>
              );
            })
          ) : (
            <div className={styles.subtitle}>
              <div className={styles.current} />
              <div className={styles.second} />
            </div>
          )}
        </Swiper>
        <ContextMenu {...contextMenuState} ref={contextMenuRef} />
      </div>
    )
  );
});
