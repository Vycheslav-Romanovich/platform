import { FC } from 'react';
import { Button, Typography } from '@mui/material';
import { observer } from 'mobx-react';

import styles from './index.module.scss';

import LessonPageComponentTeach from '~/components/lesson/lessonPageComponentTeach';
import { teacherClassesStore } from '~/stores';
import Modal from '~/UI/modal';

type Props = {
  showLessons: boolean;
  setShowLessons: () => void;
  headerText: string;
  classId?: number | null;
};

const AssignOwnLessonWrapper: FC<Props> = ({
  showLessons,
  setShowLessons,
  headerText,
  classId,
}) => {
  return (
    <Modal modalClasses={styles.libraryLessons} isOpen={showLessons} close={setShowLessons}>
      <div className={styles.innerWrapper}>
        <Typography variant="h4" className={styles.libraryTitle}>
          {headerText}
        </Typography>
        <LessonPageComponentTeach isTeacherClass classId={classId} />
        <div className={styles.libraryButton}>
          {teacherClassesStore.isDoneActive ? (
            <Button onClick={setShowLessons} variant="contained" size="large">
              Done
            </Button>
          ) : (
            <Button onClick={setShowLessons} variant="outlined" disabled size="large">
              Done
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default observer(AssignOwnLessonWrapper);
