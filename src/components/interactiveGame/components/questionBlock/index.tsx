import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, FormHelperText, Input, Typography } from '@mui/material';
import { observer } from 'mobx-react';

import { DeleteButton } from '../deleteButton';

import styles from './questionBlock.module.scss';

import { openEndedGameStore, videoStore } from '~/stores';
import { VideoGameAnswerType } from '~/types/video';

export type QuestionBlockPropsType = {
  initialStateQuestion: string;
  index: number;
  id: string;
  answer?: VideoGameAnswerType;
  openSnackBar?: () => void;
};

export const QuestionBlock: React.FC<QuestionBlockPropsType> = observer(
  ({ initialStateQuestion, index, id }) => {
    const { t } = useTranslation();
    const checkedArrayLength = openEndedGameStore.gameData.filter(
      (f) => f.timeCode === Math.floor(videoStore.state.time)
    ).length;
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
          <div style={{ width: '100%' }}>
            <Input
              fullWidth
              value={initialStateQuestion}
              placeholder={t('interactiveGame.labelEnter')}
              inputProps={{ maxLength: 140 }}
              onChange={(event) => openEndedGameStore.changeQuestion(id, event.target.value)}
            />

            <FormHelperText sx={{ width: '100%', textAlign: 'end' }}>
              {initialStateQuestion.length}/140
            </FormHelperText>
          </div>
        </div>
      </div>
    );
  }
);
