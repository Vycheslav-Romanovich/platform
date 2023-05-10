import React from 'react';
import { Typography } from '@mui/material';
import { observer } from 'mobx-react';

import styles from './openEndQuestionView.module.scss';

type OpenEndQuestionType = {
  open_end_question_index: number;
  question: string;
  customStyles?: string;
};

export const OpenEndQuestionView: React.FC<OpenEndQuestionType> = observer(
  ({ open_end_question_index, question }) => {
    return (
      <div className={styles.openEndedBlock}>
        <Typography variant={'h5'} color={'var(--Grey)'}>
          {open_end_question_index}. {question}
        </Typography>
      </div>
    );
  }
);
