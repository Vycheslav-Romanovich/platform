import React, { forwardRef, RefObject, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

import { InitLoader } from '../initLoader';

import styles from './contextMenu.module.scss';

import api from '~/api_client/api';
import AddWordBtn from '~/components/contextMenu/addWordBtn';
import ClientOnlyPortal from '~/hocs/clientOnlyPortal';
import { lessonStore, mainStore, userStore } from '~/stores';
import { AddWordResponse } from '~/types/api';

interface OneWordInfo {
  text: string;
  index: number;
  translate?: string;
  isIdiom?: boolean;
  currentAddedWordInfo?: AddWordResponse;
}

let timeout: any;

// eslint-disable-next-line react/display-name
export default forwardRef(
  (
    props: {
      isOpen: boolean;
      text: string;
      position: { x: number; y: number };
      index: number;
      wordBan?: boolean;
    },
    ref?: RefObject<HTMLDivElement>
  ) => {
    const [translates, setTranslates] = useState<OneWordInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [popupPos, setPopupPos] = useState<'left' | 'right' | null>(null);

    useEffect(() => {
      if (props.isOpen) {
        setLoading(true);

        const texts: OneWordInfo[] = [
          ...(lessonStore.lessonData.word
            ? lessonStore.lessonData.word.map((word: AddWordResponse) => ({
                text: word.word,
                index: word.index,
                translate: word.translate,
                currentAddedWordInfo: word,
              }))
            : []),
        ];

        const foundText = texts.find((text) => text.text === props.text);
        if (foundText) {
          api
            .translate({
              text: props.text,
              from: userStore.user?.from || 'en',
              to: userStore.user?.to || lessonStore.lessonData.to || 'ru',
            })
            .then((resp) => {
              setTranslates([
                {
                  ...foundText,
                  translate: resp,
                },
              ]);
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          api
            .translate({
              text: props.text,
              from: userStore.user?.from || 'en',
              to: userStore.user?.to || lessonStore.lessonData.to || 'ru',
            })
            .then((resp) => {
              setTranslates([{ text: props.text, translate: resp, index: props.index }]);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      }
      return () => {
        setShowError(false);
        setTranslates([]);
        timeout && clearTimeout(timeout);
      };
    }, [props.isOpen]);

    // Check if popup goes beyond the boundaries of the screen
    useEffect(() => {
      if (ref && typeof ref.current !== 'undefined' && ref.current !== null) {
        if (ref.current.getBoundingClientRect().left < 10) {
          setPopupPos('left');
        } else if (ref.current.getBoundingClientRect().right > mainStore.deviceWidth - 10) {
          setPopupPos('right');
        } else if (
          ref.current.getBoundingClientRect().width !== 44 &&
          props.position.x - ref.current.getBoundingClientRect().width / 2 > 0 &&
          props.position.x + ref.current.getBoundingClientRect().width / 2 < mainStore.deviceWidth
        ) {
          setPopupPos(null);
        }
      }
    });

    const classNames = {
      wrapper: cn(styles.wrapper, {
        [styles.show]: props.isOpen,
        [styles.right]: popupPos === 'right',
        [styles.left]: popupPos === 'left',
      }),
    };
    const handleShowError = (ms: number) => {
      setShowError(true);
      timeout = setTimeout(() => {
        setShowError(false);
      }, ms);
    };

    return (
      <ClientOnlyPortal>
        <div
          className={classNames.wrapper}
          style={{
            top: props.position.y || '60%',
            left: props.position.x || '50%',
          }}
          ref={ref}
        >
          <ErrorBlock open={showError} />

          <div className={styles.context}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <InitLoader type="dots" />
              </div>
            ) : (
              translates.map((data, i) => (
                <div key={i}>
                  <div className={styles.context_container}>
                    <TranslateBlock
                      origin={data.text}
                      translate={data.translate}
                      isIdiom={data.isIdiom}
                    />
                    {data.translate && !props.wordBan ? (
                      <AddWordBtn
                        word={data.text}
                        translate={data.translate}
                        index={data.index}
                        isIdiom={data.isIdiom}
                        showError={handleShowError}
                        addedWordInfo={data.currentAddedWordInfo}
                      />
                    ) : null}
                  </div>
                  {i !== translates.length - 1 && <div className={styles.divider} />}
                </div>
              ))
            )}
          </div>
          <div className={styles.triangle} />
        </div>
      </ClientOnlyPortal>
    );
  }
);

const TranslateBlock = (props: {
  origin: string;
  translate: string | undefined;
  isIdiom?: boolean;
}) => {
  const { t } = useTranslation();
  const isArticle = !props.translate;
  return !isArticle ? (
    <div className={styles.context_text}>
      <div className={styles.orig}>{props.origin}</div>
      <div className={styles.translate}>{props.translate}</div>
      {props.isIdiom && <div className={styles.idiom}>{t('contextMenu.idiom')}</div>}
    </div>
  ) : (
    <div className={styles.context_article}>{t('contextMenu.article')}</div>
  );
};

const ErrorBlock = (props: { open: boolean }) => {
  const { t } = useTranslation();
  const classes = cn(styles.context, styles.errorField, {
    [styles.show]: props.open,
  });
  return (
    <div className={classes}>
      <div>{t('contextMenu.error')}</div>
    </div>
  );
};
