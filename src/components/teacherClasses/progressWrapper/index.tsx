import { FC, ReactNode } from 'react';
import { Box } from '@mui/system';

import styles from './index.module.scss';

import { progressActivities } from '~/constants/progressActivities';

interface ProgressActivities {
  id: number;
  name: string;
  Picture: ReactNode;
}
const GameIcon = ({ Img }: any) => {
  return <Img width="50px" height="56px" />;
};
type Props = {
  columnName: string;
};

export const ProgressWrapper: FC<Props> = ({ columnName }) => {
  return (
    <Box className={styles.progressWrapper}>
      <span className={styles.text}>{columnName}</span>
      {progressActivities.map(({ id, name, Picture }: ProgressActivities) => {
        return (
          <div key={id} className={styles.gamesBlock}>
            <GameIcon Img={Picture} />
            <span className={styles.text1}>{name}</span>
          </div>
        );
      })}
    </Box>
  );
};
