import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
} from '@mui/material';
import { observer } from 'mobx-react';

import { DeleteButton } from '../deleteButton';
import { QuestionBlockPropsType } from '../questionBlock';

import styles from './trueFalseBlock.module.scss';

import { openEndedGameStore, videoStore } from '~/stores';

export const TrueFalseBlock: React.FC<QuestionBlockPropsType> = observer(
  ({ initialStateQuestion, id, answer, index }) => {
    const isSmSize = useMediaQuery('(max-width:639px)');
    const { t } = useTranslation();

    const checkedArrayLength = openEndedGameStore.gameData.filter(
      (f) => f.timeCode === Math.floor(videoStore.state.time)
    ).length;
    const handleChange = (event) => {
      openEndedGameStore.changeAnswerTrueFalse(id, event.target.value === 'true');
    };
    return (
      <div className={styles.questionBlock}>
        <div className={styles.blockFlow}>
          <Select
            id="demo-simple-select"
            value={answer.correct?.toString()}
            onChange={handleChange}
            size={isSmSize ? 'small' : 'medium'}
          >
            <MenuItem value={'true'}>{t('interactiveGame.true')}</MenuItem>
            <MenuItem value={'false'}>{t('interactiveGame.false')}</MenuItem>
          </Select>

          <Box
            sx={{
              width: '100%',
              marginBottom: {
                xs: '24px',
                md: 0,
              },
            }}
          >
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
              <InputLabel className={styles.inputLabel} htmlFor={'inputTrueFalse'}>
                {t('interactiveGame.statement')} {index}
              </InputLabel>
            </Box>

            <Input
              id={'inputTrueFalse'}
              sx={{
                height: '100%',
              }}
              fullWidth
              value={initialStateQuestion}
              inputProps={{ maxLength: 50 }}
              placeholder={t('interactiveGame.placeholderStatement')}
              onChange={(event) => openEndedGameStore.changeQuestion(id, event.target.value)}
            />

            <FormHelperText
              sx={{ width: '100%', textAlign: 'end', position: 'absolute', right: '0' }}
            >
              {initialStateQuestion.length}/50
            </FormHelperText>
          </Box>

          {checkedArrayLength > 1 && (
            <DeleteButton
              onClick={() => openEndedGameStore.deleteQuestion(id)}
              className={styles.deleteBtn}
            />
          )}
        </div>
      </div>
    );
  }
);
