import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@mui/material';
import cn from 'classnames';
import { observer } from 'mobx-react';

import styles from './trueFalseView.module.scss';

import { lessonStore } from '~/stores';
import { VideoGameDto } from '~/types/video';

type TrueFalseViewType = {
  true_or_false_index: number;
  element: VideoGameDto;
  customStyles?: string;
  disable?: boolean;
  checkRightAnswerMode?: boolean;
  buttonMode?: (
    answer: string | boolean,
    element: VideoGameDto,
    checkRightAnswerMode?: boolean
  ) =>
    | 'var(--Silver)'
    | 'var(--M_Blue)'
    | 'var(--White)'
    | 'var(--M_Green)'
    | 'var(--M_Pink)'
    | 'transparent';
};

export const TrueFalseView: React.FC<TrueFalseViewType> = observer(
  ({ true_or_false_index, disable, checkRightAnswerMode, customStyles, element, buttonMode }) => {
    const color = (answ: boolean) => {
      if (buttonMode) {
        return buttonMode(answ, element) === 'var(--White)'
          ? 'var(--White)'
          : checkRightAnswerMode
          ? buttonMode(answ, element)
          : 'var(--Blue)';
      } else {
        return lessonStore.videoGameData.some(
          (s) => s.id === element.id && s.answer?.correct === answ
        )
          ? 'var(--M_Green)'
          : 'none';
      }
    };
    const { t } = useTranslation();

    return (
      <div className={cn(customStyles, styles.trueFalseBlock)}>
        <Typography variant={'h5'} color={'var(--Grey)'}>
          {true_or_false_index}. {element.question}
        </Typography>
        <div className={styles.buttonBlock}>
          <Button
            disableRipple
            className={styles.muiButton}
            sx={{
              background: buttonMode
                ? !checkRightAnswerMode
                  ? buttonMode(true, element)
                  : 'var(--Silver)'
                : 'var(--White)',
              borderColor: color(true),
              '&:hover': {
                background: disable && 'var(--White)',
                cursor: disable && 'unset',
              },
            }}
            variant={'outlined'}
            onClick={() => {
              lessonStore.deleteTrueFalseAnswer(element.id);
              lessonStore.setCheckAnswerTrueFalse({ answer: true, id: element.id });
            }}
          >
            {t('interactiveGame.true')}
          </Button>
          <Button
            className={styles.muiButton}
            disableRipple
            onClick={() => {
              lessonStore.deleteTrueFalseAnswer(element.id);
              lessonStore.setCheckAnswerTrueFalse({ answer: false, id: element.id });
            }}
            sx={{
              background: buttonMode
                ? !checkRightAnswerMode
                  ? buttonMode(false, element)
                  : 'var(--Silver)'
                : 'var(--White)',
              borderColor: color(false),
              '&:hover': {
                background: disable && 'var(--White)',
                cursor: disable && 'unset',
              },
            }}
            variant={'outlined'}
          >
            {t('interactiveGame.false')}
          </Button>
        </div>
      </div>
    );
  }
);
