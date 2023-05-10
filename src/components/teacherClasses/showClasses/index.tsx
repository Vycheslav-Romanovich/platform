import React from 'react';
import { Button, Typography } from '@mui/material';

import { ClassCard } from '../classCard';
import { ClassCardWrapper } from '../classCardWrapper';

import styles from './index.module.scss';

import AddCard from '~/components/lesson/addCard';
import { teacherClassesStore } from '~/stores';
import Modal from '~/UI/modal';

type Props = {
  showLessons: boolean;
  setShowLessons: () => void;
  setIsCreateClass: () => void;
  lessonId: number;
  headerText: string;
};

const ShowClasses: React.FC<Props> = ({
  showLessons,
  setIsCreateClass,
  setShowLessons,
  headerText,
  lessonId,
}) => {
  return (
    <Modal modalClasses={styles.libraryLessons} isOpen={showLessons} close={setShowLessons}>
      <div className={styles.innerWrapper}>
        <Typography variant="h4" className={styles.libraryTitle}>
          {headerText}
        </Typography>
        <ClassCardWrapper isModal>
          {/* <AutocompleteDropdown
                  inputValue={'inputValue'}
                  setInputValue={() => console.log('first')}
                /> */}
          <div className={styles.sortingStyles}>
            {/* <SortDropdown
              sortValue={sortStore.sortTypes.order}
              handleChangeSort={handleChangeSort}
              sortOptions={sortByOrder}
            /> */}
          </div>

          {teacherClassesStore?.teacherClassData.map(({ id, name, students, avatarUrl }) => {
            return (
              <ClassCard
                id={id}
                key={id}
                titleLesson={name}
                studentCount={students?.length || '0'}
                avatarUrl={avatarUrl}
                isModal
                assignLesson={() =>
                  teacherClassesStore.addTeacherLesson({ classId: id, lessonId: lessonId })
                }
              />
            );
          })}
          <div style={{ paddingBottom: '20px' }}>
            <AddCard addText={'Create a class'} addItemAction={setIsCreateClass} />
          </div>
        </ClassCardWrapper>
        <div className={styles.libraryButton}>
          <Button onClick={setShowLessons} variant="outlined" disabled size="large">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShowClasses;
