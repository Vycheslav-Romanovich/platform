import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import classNames from 'classnames';

import styles from './index.module.scss';

import { sortByEnglishLevel } from '~/constants/sortLessons';

type Props = {
  levelLanguages?: string;
  handleChangeSelect: (event) => void;
  warning: boolean;
};

const LessonSelectLevel: React.FC<Props> = ({ levelLanguages, handleChangeSelect, warning }) => {
  const { t } = useTranslation();
  const selectCLasses = classNames(styles.selectField, {
    [styles.warning]: warning,
  });

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="simple-select-helper-label">{t('lessonSelectLevel.chooseLevel')}</InputLabel>
      <Select
        labelId="simple-select-helper-label"
        id="simple-select-helper"
        value={levelLanguages}
        label={t('lessonSelectLevel.chooseLevel')}
        onChange={handleChangeSelect}
        className={selectCLasses}
      >
        {sortByEnglishLevel.map(({ lable, value }, index) => {
          if (lable !== 'All') {
            return (
              <MenuItem key={index} value={value}>
                {t(`sortLessons.sortByEnglishLevel.${lable}`)}
              </MenuItem>
            );
          }
        })}
      </Select>
    </FormControl>
  );
};

export default LessonSelectLevel;
