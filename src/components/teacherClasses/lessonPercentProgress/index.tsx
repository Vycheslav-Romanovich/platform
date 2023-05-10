import { FC } from 'react';
import { Box } from '@mui/material';

import styles from './index.module.scss';

type Props = {
  number: boolean | number;
};

const LessonPercentProgress: FC<Props> = ({ number }) => {
  return (
    <Box className={styles.box}>
      <span className={styles.resultBox}>{`${number} %`}</span>
    </Box>
  );
};

export default LessonPercentProgress;
