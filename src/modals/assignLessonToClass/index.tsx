import { FC } from 'react';
import { Button, Typography } from '@mui/material';
import { observer } from 'mobx-react';

import styles from './index.module.scss';

import { ClassCard } from '~/components/teacherClasses/classCard';
import { teacherClassesStore } from '~/stores';
import Modal from '~/UI/modal';

type Props = {
  isOpen: boolean;
  close: () => void;
  headerText: string;
  currentLessonId?: number;
};

const AsssignLessonsToClass: FC<Props> = ({ isOpen, close, headerText, currentLessonId }) => {
  const handleAddTeacherLesson = async (id: number, lessonId: number) => {
    const resp = await teacherClassesStore.addTeacherLesson({ classId: id, lessonId });
    if (resp.message === 'TEACHER_LESSON_CREATED') {
      teacherClassesStore.toggleDoneButton(true);
      teacherClassesStore.getClassesByUserId();
    }
  };
  return (
    <Modal modalClasses={styles.modalWrapper} isOpen={isOpen} close={close}>
      <div className={styles.innerWrapper}>
        <Typography variant="h4" className={styles.libraryTitle}>
          {headerText}
        </Typography>
        <div className={styles.cardsWrapper}>
          {teacherClassesStore?.classesData[0]?.teacherClasses.map(
            ({ id, name, students, avatarUrl, teacherLessons }) => {
              return (
                <ClassCard
                  id={id}
                  key={id}
                  titleLesson={name}
                  studentCount={students?.length || '0'}
                  avatarUrl={avatarUrl}
                  assignedLessonsArr={teacherLessons?.some(
                    ({ lessonId }) => lessonId === currentLessonId
                  )}
                  isModal
                  assignLesson={() => handleAddTeacherLesson(id, currentLessonId)}
                />
              );
            }
          )}
        </div>

        <div className={styles.libraryButton}>
          {teacherClassesStore.isDoneActive ? (
            <Button onClick={close} variant="contained" size="large">
              Done
            </Button>
          ) : (
            <Button onClick={close} variant="outlined" disabled size="large">
              Done
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default observer(AsssignLessonsToClass);
