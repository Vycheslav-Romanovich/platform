import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import Layout from '../../hocs/layout';

import styles from './index.module.scss';

import { InitLoader } from '~/components/initLoader';
import AddCard from '~/components/lesson/addCard';
import AssignLessonWrapper from '~/components/teacherClasses/assignLessonWrapper';
import { ClassCard } from '~/components/teacherClasses/classCard';
import { ClassCardWrapper } from '~/components/teacherClasses/classCardWrapper';
import { classesStatesTeacher } from '~/constants/routes';
import { sendEvent } from '~/helpers/sendToGtm';
import CreateClass from '~/modals/createClass';
import { CustomModal } from '~/modals/customModal';
import { FullViewModal } from '~/modals/fullViewModal';
import Notification from '~/modals/notification';
import { lessonStore, teacherClassesStore, userStore } from '~/stores';
// import { SortByOrderType } from '~/types/sort';
// import { AutocompleteDropdown } from '~/UI/autocomplete';
// import SortDropdown from '~/UI/sortDropdown';
import TabBar from '~/UI/tabBar';
import { ChoosePlan } from '~/widget/ChoosePlan'; // import { sortByOrder } from '~/constants/sortLessons';

const TeacherClasses: NextPage = () => {
  const { asPath, pathname, query } = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openNotifyModal, setOpenNotifyModal] = useState<boolean>(false);
  const [openDeleteClassNotifyModal, setOpenDeleteClassNotifyModal] = useState<boolean>(false);
  const [leaveClassModal, setLeaveClassModal] = useState<boolean>(false);
  // const [showSorting, setShowSorting] = useState(true);
  const [isCreateClass, setIsCreateClass] = useState(false);
  const [showLessons, setShowLessons] = useState(false);
  const [classIdForAssignLesson, setClassIdForAssignLesson] = useState<number | null>(null);
  const [openPopupLimitModal, setOpenPopupLimitModal] = useState({
    isOpen: false,
    title: '',
  });

  const updateTeacherClasses = () => {
    teacherClassesStore.getClassesByUserId();
  };

  useEffect(() => {
    userStore.isAuth && updateTeacherClasses();
  }, [userStore.isAuth]);

  useEffect(() => {
    if (query.create === 'true') {
      const isLimitReached =
        teacherClassesStore?.classesData[0]?.teacherClasses.length >= 1 &&
        !userStore.user.isActivePremium;
      if (isLimitReached) {
        handleOpenPopupLimit('Switch to another plan to create more than 1 classes');
      } else {
        setIsCreateClass(true);
      }
    }
  }, [query]);

  useEffect(() => {
    if (popoverOpen) {
      setTimeout(() => {
        setPopoverOpen(false);
      }, 2000);
    }
  }, [popoverOpen]);

  const deleteTeacherClass = (id: number) => {
    setOpenDeleteModal(true);
    if (id) {
      teacherClassesStore.writeClassDataId(id);
    }
  };

  const editTeacherClass = (id: number) => {
    teacherClassesStore.setIsEditClassModal(true);
    teacherClassesStore.writeClassDataId(id);
    setIsCreateClass((prev) => !prev);
  };

  const handleOpenPopupLimit = (title?: string) => {
    setOpenPopupLimitModal({
      ...openPopupLimitModal,
      isOpen: !openPopupLimitModal.isOpen,
      title,
    });
  };

  const openCreateClassModal = () => {
    const isLimitReached =
      teacherClassesStore?.classesData[0]?.teacherClasses.length >= 1 &&
      !userStore.user.isActivePremium;
    if (isLimitReached) {
      handleOpenPopupLimit('Switch to another plan to create more than 1 classes');
    } else {
      teacherClassesStore.setIsEditClassModal(false);
      setIsCreateClass((prev) => !prev);
    }
  };

  const countStudents = () => {
    const index = teacherClassesStore.classesData[0].teacherClasses.findIndex(
      (item) => item.id === teacherClassesStore.classDataId.classId
    );
    return teacherClassesStore.classesData[0].teacherClasses[index].students.length.toString();
  };

  const closeDeleteModal = () => {
    setOpenDeleteModal(false);
    sendEvent('delete_class', { assigned_students_number: countStudents() });
    setTimeout(() => {
      setOpenDeleteClassNotifyModal(true);
      teacherClassesStore
        .deleteTeacherClasses(teacherClassesStore.classDataId.classId)
        .then(() => {
          updateTeacherClasses();
        })
        .catch((error) => {
          console.error(error);
        });
    }, 2000);
  };
  //sorting and searching to add VVVVVVVVVVVVVVV

  // const sortByType = (sortType: SortByOrderType) => {
  //   if (asPath === '/lessons?q=created') {
  //     sortStore.setLessonsSorted(sortType, lessonStore.lessons);
  //   } else {
  //     if (asPath === '/lessons?q=favorite') {
  //       sortStore.setLessonsSorted(sortType, lessonStore.favoriteLessons);
  //     } else {
  //       sortStore.setLessonsSorted(sortType, lessonStore.sharedLessons);
  //     }
  //   }
  // };

  // const handleChangeSort = () => {
  // console.log(event);
  // const name = event.target.name;
  // const value = event.target.value as SortByOrderType;
  // sortByType(value);
  // sortStore.setSortTypes({ [name]: value });
  // };

  // useEffect(() => {
  //   sortByType(sortStore.sortTypes.order);
  // }, [asPath]);

  // useEffect(() => {
  //   asPath === '/lessons?q=received'
  //     ? lessonStore.sharedLessons.length > 0
  //       ? setShowSorting(true)
  //       : setShowSorting(false)
  //     : lessonStore.lessons.length > 0
  //     ? setShowSorting(true)
  //     : setShowSorting(false);
  // }, [asPath, lessonStore.sharedLessons, lessonStore.lessons]);

  // const closeModalWindow = () => {
  //   setShowHighlighted(true);
  //   sortStore.setLessonsSorted('date:desc', lessonStore.lessons);
  //   sortStore.setLessonsSorted('date:desc', lessonStore.sharedLessons);
  //   setClosePopup(false);
  //   lessonStore.setCreateLessonModal(false);
  //   setTimeout(() => {
  //     setShowHighlighted(false);
  //   }, 1200);
  //   lessonStore.resetLessonDataAndSentenseWithWordData();
  // };

  const removeStudent = async (id) => {
    await teacherClassesStore.writeDeleteId(id);
    setLeaveClassModal(true);
  };

  const askToRemoveStudent = (id) => {
    removeStudent(id);
  };

  const closeLeaveClassModal = () => {
    setLeaveClassModal(false);
    sendEvent('leave_class');
    setTimeout(() => {
      setOpenNotifyModal(true);
      teacherClassesStore
        .deleteStudentFromClass(teacherClassesStore.deleteId, userStore.user.id)
        .then(() => {
          updateTeacherClasses();
        })
        .catch((error) => {
          console.error(error);
        });
    }, 2000);
  };

  useEffect(() => {
    teacherClassesStore.setIsEditClassModal(false);
  }, []);

  return (
    <Layout>
      <NextSeo title="Classes" />

      <CreateClass
        isOpen={isCreateClass}
        close={() => setIsCreateClass((prev) => !prev)}
        isCreateModal={!teacherClassesStore.isEditClassModal}
      />

      <Notification
        isOpen={openNotifyModal}
        close={() => setOpenNotifyModal(false)}
        duration={500}
        message={'Done'}
        description={'The lesson was deleted'}
      />

      <Notification
        isOpen={openDeleteClassNotifyModal}
        close={() => setOpenDeleteClassNotifyModal(false)}
        duration={500}
        message={'Done'}
        description={'Class deleted'}
      />

      <FullViewModal
        isOpen={openPopupLimitModal.isOpen}
        close={() =>
          setOpenPopupLimitModal({
            ...openPopupLimitModal,
            isOpen: !openPopupLimitModal.isOpen,
          })
        }
        title={openPopupLimitModal.title}
      >
        <ChoosePlan openFromPopup />
      </FullViewModal>

      <CustomModal
        isOpen={leaveClassModal}
        close={() => setLeaveClassModal(false)}
        modalClasses={styles.modalClasses}
        title="Leave the class?"
        subtitle1="To join it again you’ll have to get the invitation link from your teacher."
        access={closeLeaveClassModal}
        idYesButton={'quit_class'}
        buttonTextLeft={'Cancel'}
        buttonTextRight={'Leave the class'}
      />

      <CustomModal
        isOpen={openDeleteModal}
        close={() => setOpenDeleteModal(false)}
        modalClasses={styles.modalClasses}
        title="Delete the class?"
        subtitle1="All the lessons, students and progress in the class will be erased."
        access={closeDeleteModal}
        idYesButton={'delete_lesson'}
        buttonTextRight={'Delete'}
        buttonTextLeft={'Cancel'}
      />

      <AssignLessonWrapper
        showLessons={showLessons}
        setShowLessons={() => {
          setShowLessons((prev) => !prev);
          setClassIdForAssignLesson(null);
        }}
        headerText={'Assign a lesson from Library'}
        classId={classIdForAssignLesson}
      />

      <div className={styles.headerWrapper}>
        <Typography variant="h2">Classes</Typography>

        {userStore.user.role === 'teacher' && (
          <Button
            onClick={openCreateClassModal}
            variant="contained"
            classes={styles.accordion}
            startIcon={<AddIcon />}
            size="large"
          >
            Create a class
          </Button>
        )}
      </div>

      {teacherClassesStore?.classesData[0]?.studentClasses.length > 0 &&
        teacherClassesStore?.classesData[0]?.teacherClasses.length > 0 && (
          <TabBar data={classesStatesTeacher} nameData="classesStates" />
        )}

      <div className={styles.numberOfClasses}>
        <span className={styles.number}>
          {`Number of classes ${
            pathname === `/teacher-classes` && userStore.user.role === 'teacher'
              ? teacherClassesStore?.classesData[0]?.teacherClasses.length ||
                teacherClassesStore?.classesData[0]?.studentClasses.length ||
                '0'
              : teacherClassesStore?.classesData[0]?.studentClasses.length || '0'
          }`}
        </span>
        <Box
          sx={{
            height: '10px',
            width: '100%',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        />
      </div>

      {lessonStore.isLoadingLessons === 'true' ? (
        <InitLoader />
      ) : (
        <>
          {teacherClassesStore?.classesData[0]?.teacherClasses.length !== 0 ||
          teacherClassesStore?.classesData[0]?.studentClasses.length !== 0 ? (
            <ClassCardWrapper>
              {/* <AutocompleteDropdown
                  inputValue={'inputValue'}
                  setInputValue={() => console.log('first')}
                /> */}
              {/* <div className={styles.sortingStyles}>
                <SortDropdown
                  sortValue={sortStore.sortTypes.order}
                  handleChangeSort={handleChangeSort}
                  sortOptions={sortByOrder}
                />
              </div> */}

              <>
                {pathname === `/teacher-classes` &&
                  teacherClassesStore?.classesData[0]?.teacherClasses.map(
                    ({ id, name, students, avatarUrl }) => {
                      return (
                        <ClassCard
                          id={id}
                          key={id}
                          titleLesson={name}
                          studentCount={students?.length || '0'}
                          avatarUrl={avatarUrl}
                          inviteStudents={() => teacherClassesStore.toggleInviteStudentsModal(true)}
                          editClass={() => editTeacherClass(id)}
                          deleteClass={() => deleteTeacherClass(id)}
                          assignLesson={() => {
                            setShowLessons((prev) => !prev);
                            setClassIdForAssignLesson(id);
                          }}
                        />
                      );
                    }
                  )}
              </>

              <>
                {(teacherClassesStore?.classesData[0]?.teacherClasses.length > 0
                  ? asPath === `/teacher-classes?q=joined`
                  : pathname === `/teacher-classes`) &&
                  teacherClassesStore?.classesData[0] &&
                  teacherClassesStore?.classesData[0]?.studentClasses.map(({ teacherClasses }) => {
                    return (
                      <ClassCard
                        id={teacherClasses.id}
                        key={teacherClasses.id}
                        titleLesson={teacherClasses.name}
                        avatarUrl={teacherClasses.avatarUrl}
                        lessonOwnerName={teacherClasses.teacher?.name}
                        lessonOwnerAvatar={teacherClasses.teacher?.avatarUrl}
                        checkForClassOwner={!(userStore.user.id === teacherClasses.teacherId)}
                        askToRemoveStudent={() => askToRemoveStudent(teacherClasses.id)}
                      />
                    );
                  })}
              </>
            </ClassCardWrapper>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '468px',
                mb: '50px',
              }}
            >
              <Typography variant="h3" sx={{ mb: '16px' }}>
                You have no classes yet
              </Typography>
              <Typography variant="body2">
                To monitor your students progress and assign lessons create virtual classes and
                invite students to them.
              </Typography>
            </Box>
          )}
        </>
      )}

      {userStore.user.role === 'teacher' && pathname === `/teacher-classes` && (
        <div style={{ paddingBottom: '100px' }}>
          <AddCard
            addText={'Create a class'}
            addItemAction={openCreateClassModal}
            showLock={
              teacherClassesStore?.classesData[0]?.teacherClasses.length >= 1 &&
              !userStore.user.isActivePremium
            }
          />
        </div>
      )}
    </Layout>
  );
};

export async function getStaticProps() {
  return {
    props: {
      protected: true,
    },
  };
}

export default observer(TeacherClasses);
