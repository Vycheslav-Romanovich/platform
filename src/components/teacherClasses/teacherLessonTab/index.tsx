import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { PublicCardClasses } from '../publicCardClasses';

import { Accordion } from '~/components/accordion';
import { LessonCardWrapper } from '~/components/lesson/lessonCardWrapper';
import { teacherClassesStore, userStore } from '~/stores';

type Props = {
  classId: number;
  setOpenDeleteModal: (state: boolean) => void;
  actionsToMap: { name: string; action: () => void }[];
};

export const TeacherLessonTab: FC<Props> = ({ classId, setOpenDeleteModal, actionsToMap }) => {
  const handleAddTeacherLesson = (id: number) => {
    console.log(id);
  };
  const deleteLesson = (id: number) => {
    setOpenDeleteModal(true);
    if (id) {
      teacherClassesStore.writeDeleteId(id);
    }
  };
  const viewProgress = (event) => {
    console.log(event);
  };
  return (
    <>
      {teacherClassesStore.teacherClassData[0]?.teacherLessons?.length > 0 ? (
        <LessonCardWrapper>
          {teacherClassesStore.teacherClassData[0]?.teacherLessons?.map(({ id, lesson }) => {
            return (
              <PublicCardClasses
                id={lesson.id}
                key={lesson.id}
                titleLesson={lesson.name}
                numberWords={+lesson.wordsCount}
                coverIndex={lesson.picture}
                level={lesson.level}
                isTeacherLesson
                classId={classId}
                mediaUrl={lesson.mediaUrl}
                teacherLessonId={id}
                viewProgress={() => viewProgress(id)}
                lessonOwnerAvatar={lesson.user.avatarUrl}
                lessonOwnerName={lesson.user.name}
                isTeacher={userStore.user.id === teacherClassesStore.teacherClassData[0].teacherId}
                addTeacherLesson={() => handleAddTeacherLesson(id)}
                deleteLesson={() => deleteLesson(id)}
              />
            );
          })}
        </LessonCardWrapper>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '468px',
          }}
        >
          <Typography variant="h3" sx={{ mb: '16px' }}>
            Assign your first lesson
          </Typography>
          <Typography variant="body1" sx={{ mb: '48px' }}>
            To monitor your students progress assign lessons choosing a lesson from Library or
            creating your own ones.
          </Typography>
          <Accordion
            headerName={'Assign a lesson'}
            actionsToMap={actionsToMap}
            size={'large'}
            nameData={'Assign a lesson'}
          />
        </Box>
      )}
    </>
  );
};
