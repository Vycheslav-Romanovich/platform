import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, FormHelperText, TextField, Typography } from '@mui/material';
import { observer } from 'mobx-react';

import { DeleteButton } from '../deleteButton';
import { OptionBlock } from './optionBlock';

import styles from './multipleChoice.module.scss';

import { openEndedGameStore, videoStore } from '~/stores';
import { VideoGameAnswerType } from '~/types/video';

export type MultipleChoicePropsType = {
  initialStateQuestion: string;
  index: number;
  id: string;
  answer?: VideoGameAnswerType;
  openSnackBar?: () => void;
};

export const MultipleChoice: React.FC<MultipleChoicePropsType> = observer(
  ({ initialStateQuestion, index, id, answer }) => {
    const checkedArrayLength = openEndedGameStore.gameData.filter(
      (f) => f.timeCode === Math.floor(videoStore.state.time)
    ).length;

    const { t } = useTranslation();
    const checkedOptionLength = answer.option?.length < 5;

    return (
      <div className={styles.questionBlock}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant={'h4'}>
            {t('interactiveGame.question')} {index + 1}
          </Typography>

          {checkedArrayLength > 1 && (
            <DeleteButton
              onClick={() => openEndedGameStore.deleteQuestion(id)}
              className={styles.deleteQuestionBlock}
            />
          )}
        </Box>

        <div className={styles.blockFlow}>
          <div className={styles.flowWrapper}>
            <div style={{ width: '100%', marginBottom: '10px' }}>
              <TextField
                sx={{ height: '100%' }}
                variant={'standard'}
                label={t('interactiveGame.labelEnter')}
                fullWidth
                value={initialStateQuestion}
                placeholder={t('interactiveGame.labelEnter')}
                inputProps={{ maxLength: 140 }}
                onChange={(event) => openEndedGameStore.changeQuestion(id, event.target.value)}
              />
              <FormHelperText
                sx={{ width: '100%', textAlign: 'end', position: 'absolute', right: '0' }}
              >
                {initialStateQuestion.length}/140
              </FormHelperText>
            </div>
          </div>
        </div>
        <div className={styles.optionWrapper}>
          {answer.option?.map((element, index) => {
            return <OptionBlock key={index} optionState={element} questionId={id} />;
          })}
        </div>
        {checkedOptionLength && (
          <div
            className={styles.addTrueFalseButton}
            onClick={() => {
              answer.option?.length < 5 && openEndedGameStore.addOption(id);
            }}
          >
            <Typography
              variant={'h4'}
              textAlign={'center'}
              color={'var(--Blue)'}
              padding={'8px 32px'}
            >
              {t('interactiveGame.addOption')}
            </Typography>
          </div>
        )}
      </div>
    );
  }
);
