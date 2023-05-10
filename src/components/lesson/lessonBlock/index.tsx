import React, { LegacyRef } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutline';
import { Box, IconButton, Stack, TextField } from '@mui/material';
import cn from 'classnames';
import { observer } from 'mobx-react';

import styles from './index.module.scss';

import { ErrorValidation } from '~/components/error';
import { hintTranslationStore } from '~/stores';
import { AddWordResponse } from '~/types/api';

type Props = {
  numberBlock: number;
  wordPair: AddWordResponse;
  deleteItem: (lessonId: number) => void;
  changeHandlerWord: (id: number, newWord: string) => void;
  changeHandlerTranslation: (id: number, translate: string) => void;
  changeHandlerTranslationHint: (hint: string) => void;
  lessonId?: number;
  wordId?: number;
  checkValidate?: boolean;
  wordBlock?: boolean;
  errorRef: LegacyRef<HTMLDivElement> | null;
};

const LessonBlock: React.FC<Props> = ({
  wordPair,
  numberBlock,
  deleteItem,
  wordBlock,
  lessonId,
  changeHandlerWord,
  changeHandlerTranslation,
  changeHandlerTranslationHint,
  checkValidate,
  errorRef,
}) => {
  const pattern = /^[\s]+$/;
  const { t } = useTranslation();
  const handleDelete = () => {
    deleteItem(lessonId);
  };

  const textInputStyle = cn(styles.textInput, {
    [styles.textInputNormal]: wordBlock,
  });

  const lessonBlockStyle = cn(styles.lessonBlock, {
    [styles.lessonBlockNormal]: wordBlock,
  });

  const handleFocusToWord = () => {
    hintTranslationStore.setTranslateWord(wordPair);
    hintTranslationStore.setIsOnFocus(false);
  };

  const handleFocusToTranslation = () => {
    hintTranslationStore.getTranslation(wordPair);
  };

  const handleChangeWord = (event) => {
    changeHandlerWord(wordPair.id, event.target.value);
  };
  const handleChangeWordBlur = (event) => {
    changeHandlerWord(wordPair.id, event.target.value.trim());
  };

  const handleChangeTranslation = (event) => {
    changeHandlerTranslation(wordPair.id, event.target.value);
  };

  const handleChangeTranslationBlur = (event) => {
    changeHandlerTranslation(wordPair.id, event.target.value.trim());
  };

  const handleClickToTranslateVariant = (value: string) => {
    changeHandlerTranslationHint(value);
    hintTranslationStore.setIsOnFocus(false);
  };

  return (
    <div className={lessonBlockStyle}>
      <h2 className={styles.numberBlock}>{numberBlock}</h2>
      <Box className={textInputStyle} sx={{ gap: { lg: '66px', md: '32px', xs: '0' } }}>
        <Stack
          sx={{
            display: 'flex',
            mb: `${
              checkValidate && (pattern.test(wordPair.word) || !wordPair.word) ? '0' : '32px'
            }`,
            width: '100%',
            maxWidth: '412px',
          }}
        >
          <TextField
            sx={{ fontSize: { lg: '28px', sm: '16px' }, padding: '0' }}
            id="standard-basic"
            label={t('lessonBlock.labelTerm')}
            focused
            color="secondary"
            variant="standard"
            value={wordPair.word}
            onBlur={handleChangeWordBlur}
            onChange={handleChangeWord}
            onFocus={handleFocusToWord}
          />
          {checkValidate && (pattern.test(wordPair.word) || !wordPair.word) && (
            <div className={styles.errorMb} ref={errorRef}>
              <ErrorValidation>{t('errorValidation.lessonCardWord')}</ErrorValidation>
            </div>
          )}
        </Stack>

        <Stack
          sx={{
            width: '100%',
            maxWidth: '412px',
            mb: {
              md: 0,
              xs: `${
                checkValidate && (pattern.test(wordPair.word) || !wordPair.word) ? '0' : '24px'
              }`,
            },
          }}
        >
          <TextField
            sx={{
              display: 'flex',
              fontSize: { lg: '28px', sm: '16px' },
              padding: '0',
              width: '100%',
              maxWidth: '412px',
            }}
            id="standard-basic"
            focused
            label={t('lessonBlock.labelDefinition')}
            color="secondary"
            variant="standard"
            value={wordPair.translate}
            onBlur={handleChangeTranslationBlur}
            onChange={handleChangeTranslation}
            onFocus={handleFocusToTranslation}
          />

          {hintTranslationStore.isOnFocus &&
            hintTranslationStore.translateWord.id === wordPair.id &&
            hintTranslationStore.translation.map((value, index) => (
              <div
                className={styles.translateHint}
                key={index}
                onClick={() => handleClickToTranslateVariant(value.translation)}
              >
                {value.translation}
              </div>
            ))}

          {checkValidate && (pattern.test(wordPair.translate) || !wordPair.translate) && (
            <div className={styles.errorMb} ref={errorRef}>
              <ErrorValidation>{t('errorValidation.lessonCardTranslateWord')}</ErrorValidation>
            </div>
          )}
        </Stack>
      </Box>

      <IconButton id="deleteSubWord" onClick={handleDelete} classes={{ root: styles.trashIcon }}>
        <DeleteOutlineOutlinedIcon />
      </IconButton>
    </div>
  );
};

export default observer(LessonBlock);
