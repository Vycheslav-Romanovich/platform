import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, FormHelperText, TextField } from '@mui/material';
import { observer } from 'mobx-react';

import styles from './option.module.scss';

import { openEndedGameStore } from '~/stores';
import { OptionType } from '~/types/video';

type PropsOptionBlockType = {
  optionState: OptionType;
  questionId: string;
};

export const OptionBlock: React.FC<PropsOptionBlockType> = observer(
  ({ optionState, questionId }) => {
    const { t } = useTranslation();
    const [checked, setChecked] = useState<boolean>(
      openEndedGameStore.checkedCorrect(questionId, optionState.id)
    );

    const handleChange = () => {
      openEndedGameStore.checkedCorrect(questionId, optionState.id)
        ? openEndedGameStore.deleteCorrect(questionId, optionState.id).then(() => setChecked(false))
        : openEndedGameStore.changeCorrect(questionId, optionState.id).then(() => setChecked(true));
    };

    const changeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
      openEndedGameStore.changeOption(questionId, optionState.id, event.target.value);
    };

    const memorizeCheckBox = useMemo(
      () => (
        <Checkbox
          checked={checked}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      ),
      [checked]
    );

    return (
      <div className={styles.optionContainer}>
        {memorizeCheckBox}
        <div className={styles.textFieldWrapper}>
          <TextField
            sx={{ height: '100%' }}
            variant={'standard'}
            label={t('interactiveGame.enterOption')}
            fullWidth
            value={optionState.value}
            placeholder={t('interactiveGame.labelEnter')}
            inputProps={{ maxLength: 50 }}
            onChange={changeTextField}
            onFocus={() => {
              focus();
            }}
          />
          <FormHelperText
            sx={{
              width: '100%',
              textAlign: 'end',
              position: 'absolute',
              right: '42px',
              bottom: '-22px',
            }}
          >
            {optionState.value.length}/50
          </FormHelperText>
          <div
            onClick={() => openEndedGameStore.deleteOption(questionId, optionState.id)}
            className={styles.deleteQuestionBlock}
          />
        </div>
      </div>
    );
  }
);
