import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { observer } from 'mobx-react';

import styles from './index.module.scss';

import { IAddTeacherClassResponse } from '~/types/api';

type Props = {
  firstLesson: number;
  lessonData?: string;
  handleChangeSelect: (event) => void;
  dataToMap: Array<IAddTeacherClassResponse>;
};

const SelectLesson: React.FC<Props> = ({
  firstLesson,
  lessonData,
  handleChangeSelect,
  dataToMap,
}) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} className={styles.clipText}>
      <InputLabel id="simple-select-helper-label">{'Choose the lesson'}</InputLabel>
      <Select
        labelId="simple-select-helper-label"
        id="simple-select-helper"
        value={lessonData}
        label={'Choose the lesson'}
        defaultValue={`${firstLesson}`}
        onChange={handleChangeSelect}
        className={styles.selectField}
      >
        {dataToMap.map(({ id, name }) => {
          return (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default observer(SelectLesson);
