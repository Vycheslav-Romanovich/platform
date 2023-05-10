import React, { useEffect, useState } from 'react';
import { MoreHoriz } from '@mui/icons-material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Box, Button, IconButton, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import Pointer from '~/assets/icons/pointer.svg';

import styles from './index.module.scss';

import { Accordion } from '~/components/accordion';
import { InitLoader } from '~/components/initLoader';
import AddCard from '~/components/lesson/addCard';
import AssignLessonWrapper from '~/components/teacherClasses/assignLessonWrapper';
import AssignOwnLessonWrapper from '~/components/teacherClasses/assignOwnLessonWrapper';
import { ProgressWrapper } from '~/components/teacherClasses/progressWrapper';
import SelectLesson from '~/components/teacherClasses/selectLesson';
import { StudentCard } from '~/components/teacherClasses/studentCard';
import { StudentCardWrapper } from '~/components/teacherClasses/studentCardWrapper';
import { TeacherLessonTab } from '~/components/teacherClasses/teacherLessonTab';
import { FirstLetterAvatar } from '~/entities/FirstLetterAvatar';
// import { sortByOrder } from '~/constants/sortLessons';
import { sendEvent } from '~/helpers/sendToGtm';
import Layout from '~/hocs/layout';
import CreateClass from '~/modals/createClass';
import { CustomModal } from '~/modals/customModal';
import { FullViewModal } from '~/modals/fullViewModal';
import InviteStudents from '~/modals/inviteStudents';
import Notification from '~/modals/notification';
import { lessonStore, sortStore, teacherClassesStore, userStore } from '~/stores';
// import { SortByOrderType } from '~/types/sort';
// import { AutocompleteDropdown } from '~/UI/autocomplete';
import { DropDownMenu } from '~/UI/dropDownMenu';
// import SortDropdown from '~/UI/sortDropdown';
import TabBar from '~/UI/tabBar';
import { ChoosePlan } from '~/widget/ChoosePlan';

const ClassId: NextPage = () => {
  const { asPath, query, replace, push } = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [teacherClassData, setTeacherClassData] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openDeleteStudentModal, setOpenDeleteStudentModal] = useState<boolean>(false);
  const [openNotifyModal, setOpenNotifyModal] = useState<boolean>(false);
  const [linkToCopy, setLinkToCopy] = useState('');
  // const [showSorting, setShowSorting] = useState(true);
  const [showLessons, setShowLessons] = useState(false);
  const [showOwnLessons, setShowOwnLessons] = useState(false);
  const [isInviteStudents, setIsInviteStudents] = useState<boolean>(
    teacherClassesStore.isInviteStudentsModal
  );
  const [openPopupLimitModal, setOpenPopupLimitModal] = useState({
    isOpen: false,
    title: '',
  });
  const [isCreateClass, setIsCreateClass] = useState(false);

  const [openDeleteClassModal, setOpenDeleteClassModal] = useState<boolean>(false);

  const assignLesson = [
    { name: 'from Library', action: openLibraryLessons },
    { name: 'from My lessons', action: openOwnLessons },
  ];

  const classesPaths = [
    {
      title: 'Lessons',
      path: `/teacher-classes/${query.classId}?q=lessons`,
    },
    {
      title: teacherClassesStore.isTeacherClass ? 'Students' : 'Members',
      path: `/teacher-classes/${query.classId}?q=students`,
    },
    {
      title: 'Progress',
      path: `/teacher-classes/${query.classId}?q=progress`,
      addition: teacherClassesStore.isTeacherClass && {
        onClick: (cb: () => void) => {
          userStore.user.isActivePremium
            ? cb()
            : handleOpenPopupLimit("Switch to another plan to track student's progress");
        },
        icon: (
          <Image
            src="/assets/icons/lock.svg"
            width="24px"
            height="24px"
            alt="lock"
            style={{ marginRight: '6px' }}
          />
        ),
      },
    },
  ];

  const updateTeacherClass = () => {
    teacherClassesStore.getTeacherClassData(+query.classId);
  };

  useEffect(() => {
    setTeacherClassData(teacherClassesStore.defaultTeacherClassProgress);
  }, [teacherClassesStore.defaultTeacherClassProgress]);

  useEffect(() => {
    +query.classId > 0 && updateTeacherClass();
  }, [query.classId && userStore.isAuth]);

  useEffect(() => {
    userStore.isAuth &&
      !teacherClassesStore.isTeacherClass &&
      asPath === `/teacher-classes/${+query.classId}?q=progress`;
    localStorage.setItem('teacherClassId', `${query.classId}`);
  }, [userStore.isAuth, query.classId]);

  useEffect(() => {
    if (popoverOpen) {
      setTimeout(() => {
        setPopoverOpen(false);
      }, 2000);
    }
  }, [popoverOpen]);

  useEffect(() => {
    const { pathname } = window.location;
    userStore.setUserNotAuthLink(pathname);
    // redirection of a teacher/student
    asPath === `/teacher-classes/${query.classId}`
      ? replace(`/teacher-classes/${query.classId}?q=lessons`)
      : asPath;
    setLinkToCopy(`https://${window.location.host}/teacher-classes/${+query.classId}`);
  }, [asPath]);

  const closeDeleteModal = () => {
    setOpenDeleteModal(false);
    sendEvent('delete_teacher_lesson');
    setTimeout(() => {
      setOpenNotifyModal(true);
      teacherClassesStore
        .deleteTeacherLesson(teacherClassesStore.deleteId)
        .then(() => {
          updateTeacherClass();
        })
        .catch((error) => {
          console.error(error);
        });
    }, 1000);
  };
  const closeDeleteStudentModal = () => {
    setOpenDeleteStudentModal(false);
    sendEvent('delete_teacher_lesson');
    setTimeout(() => {
      setOpenNotifyModal(true);
      try {
        removeStudent(teacherClassesStore.deleteId);
      } catch (error) {
        console.error(error);
      }
    }, 1000);
  };

  const closeDeleteClassModal = () => {
    setOpenDeleteClassModal(false);
    sendEvent('delete_teacher_class');
    teacherClassesStore
      .deleteTeacherClasses(+query.classId)
      .then(() => {
        push('/teacher-classes');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // const sortByType = (sortType: SortByOrderType) => {
  //   if (asPath === `/teacher-classes/${query.classId}?q=lessons`) {
  //     sortStore.setLessonsSorted(sortType, lessonStore.lessons);
  //   }
  // } else {
  //   if (asPath === '/lessons?q=favorite') {
  //     sortStore.setLessonsSorted(sortType, lessonStore.favoriteLessons);
  //   } else {
  //     sortStore.setLessonsSorted(sortType, lessonStore.sharedLessons);
  //   }
  // }
  // };

  // const handleChangeSort = (event) => {
  //   const name = event.target.name;
  //   const value = event.target.value as SortByOrderType;
  //   sortByType(value);
  //   sortStore.setSortTypes({ [name]: value });
  // };

  // useEffect(() => {
  //   sortByType(sortStore.sortTypes.order);
  // }, [asPath]);

  function openLibraryLessons() {
    getLessons();
    setShowLessons((prev) => !prev);
  }

  function openOwnLessons() {
    getMyLessons();
    setShowOwnLessons((prev) => !prev);
  }

  const joinClass = async () => {
    if (teacherClassesStore.teacherClassData[0].students.length < 3) {
      await teacherClassesStore.joinTeacherClass(+query.classId);
      await updateTeacherClass();
      sendEvent('enter_class');
      userStore.userNotAuthLinkLessonId && push(userStore.userNotAuthLinkLessonId);
    }
  };

  const removeStudent = async (id) => {
    await teacherClassesStore.deleteStudentFromClass(+query.classId, id);
    await updateTeacherClass();
    userStore.getUserInfo();
    userStore.setUserNotAuthLinkLessonId('');
  };

  const askToRemoveStudent = () => {
    removeStudent(userStore.user.id);
  };

  const selectLesson = (event) => {
    teacherClassesStore.teacherClassDataAll.find((item) => {
      if (item.id === event.target.value) {
        setTeacherClassData(item);
      }
    });
  };

  const editTeacherClass = (id: number) => {
    teacherClassesStore.setIsEditClassModal(true);
    teacherClassesStore.writeClassDataId(id);
    setIsCreateClass((prev) => !prev);
  };

  const deleteTeacherClass = (id: number) => {
    setOpenDeleteClassModal(true);
    if (id) {
      teacherClassesStore.writeClassDataId(id);
    }
  };

  const getLessons = async () => {
    await lessonStore.getLessonDataPublic({
      ...sortStore.sortTypes,
      isTeacherClass: true,
      page: sortStore.sortTypes.page,
    });
  };

  const getMyLessons = async () => {
    await lessonStore.updateLessons(true);
  };

  const showModalLessons = () => {
    setShowLessons((prev) => !prev);
    updateTeacherClass();
  };

  const showModalMyLessons = () => {
    setShowOwnLessons((prev) => !prev);
    updateTeacherClass();
  };

  const handleOpenPopupLimit = (title?: string) => {
    setOpenPopupLimitModal({
      ...openPopupLimitModal,
      isOpen: !openPopupLimitModal.isOpen,
      title,
    });
  };

  const handleClickAddNewStudent = () => {
    const isLimitReached =
      userStore.user.limits.studentsInClassCounter < 1 && !userStore.user.isActivePremium;

    if (isLimitReached) {
      handleOpenPopupLimit('Switch to another plan to invite more than 3 students');
    } else {
      setIsInviteStudents((prev) => !prev);
    }
  };

  const deleteStudent = async (id: number) => {
    teacherClassesStore.writeDeleteId(id);
    await updateTeacherClass();
    setOpenDeleteStudentModal(true);
  };

  return (
    <Layout>
      <NextSeo title="Class" />
      {lessonStore.isLoadingLessons === 'true' ? (
        <InitLoader />
      ) : (
        <>
          <div className={styles.headerWrapper}>
            <div>
              <div className={styles.classInfo}>
                <div className={styles.imgContainer}>
                  {teacherClassesStore?.teacherClassData[0]?.avatarUrl ? (
                    <Image
                      className={styles.img}
                      width={'100%'}
                      height={'100%'}
                      src={teacherClassesStore?.teacherClassData[0]?.avatarUrl}
                      alt="lesson cover"
                    />
                  ) : (
                    teacherClassesStore.teacherClassData[0]?.name && (
                      <FirstLetterAvatar title={teacherClassesStore.teacherClassData[0]?.name} />
                    )
                  )}
                </div>

                <div className={styles.titleLesson}>
                  <Typography variant="h2">
                    {teacherClassesStore.teacherClassData[0]?.name}
                  </Typography>
                  <div>
                    <span className={styles.teacherClassData}>
                      {`${teacherClassesStore.teacherClassData[0]?.teacherLessons?.length || '0'}
                    ${
                      teacherClassesStore.teacherClassData[0]?.teacherLessons?.length === 1
                        ? ' lesson'
                        : ' lessons'
                    },
                    ${+teacherClassesStore.teacherClassData[0]?.students?.length || '0'}${
                        teacherClassesStore.teacherClassData[0]?.students?.length === 1
                          ? ' student'
                          : ' students'
                      } `}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <>
              {!userStore.isAuth ? (
                <div className={styles.signupButtons}>
                  <span>You were invited to this class, to join it please</span>
                  <Button
                    onClick={() => push(`/login?next=${userStore.userNotAuthLink}`)}
                    variant="outlined"
                    size="large"
                  >
                    Log in
                  </Button>
                  <Button
                    onClick={() => push(`/signup?next=${userStore.userNotAuthLink}`)}
                    variant="contained"
                    size="large"
                  >
                    Sign up
                  </Button>
                </div>
              ) : teacherClassesStore.isTeacherClass ? (
                <div className={styles.assignLessonDropDownBox}>
                  <Accordion
                    headerName={'Assign a lesson'}
                    actionsToMap={assignLesson}
                    className={styles.accordion}
                    size={'large'}
                    nameData={'Assign a lesson'}
                  />

                  <DropDownMenu
                    sx={{ backgroundColor: 'var(--L_Blue)', borderRadius: '8px' }}
                    buttonEl={
                      <IconButton>
                        <MoreHoriz color="primary" />
                      </IconButton>
                    }
                  >
                    <MenuItem onClick={() => editTeacherClass(+query.classId)}>
                      <ListItemIcon>
                        <DriveFileRenameOutlineIcon />
                      </ListItemIcon>
                      <Typography variant="text1">Edit</Typography>
                    </MenuItem>

                    <MenuItem
                      id={'invite_students'}
                      className={styles.link}
                      onClick={() => setIsInviteStudents((prev) => !prev)}
                    >
                      <ListItemIcon>
                        <PersonAddAlt1Icon />
                      </ListItemIcon>
                      <Typography variant="text1">Invite students</Typography>
                    </MenuItem>

                    <MenuItem onClick={() => deleteTeacherClass(+query.classId)}>
                      <ListItemIcon>
                        <DeleteOutlineOutlinedIcon />
                      </ListItemIcon>
                      <Typography variant="text1">Delete class</Typography>
                    </MenuItem>
                  </DropDownMenu>
                </div>
              ) : !teacherClassesStore.hasJoined ? (
                <div style={{ position: 'relative' }}>
                  <Pointer className={styles.pointerPic} />
                  <Button onClick={joinClass} variant="contained" size="large">
                    Join the class
                  </Button>
                </div>
              ) : (
                <IconButton className={styles.logoutIcon}>
                  <LogoutIcon onClick={askToRemoveStudent} />
                </IconButton>
              )}
            </>
          </div>

          {userStore.isAuth && (
            <div
              className={
                !teacherClassesStore.hasJoined &&
                !teacherClassesStore.isTeacherClass &&
                styles.lessonBlockWrapper
              }
            >
              <TabBar
                isPrem={userStore.user.isActivePremium}
                data={classesPaths}
                nameData="classesStates"
              />
              <>
                {asPath === `/teacher-classes/${query.classId}?q=lessons` &&
                  teacherClassesStore.teacherClassData && (
                    <TeacherLessonTab
                      classId={+query.classId}
                      actionsToMap={assignLesson}
                      setOpenDeleteModal={setOpenDeleteModal}
                    />
                  )}

                {asPath === `/teacher-classes/${+query.classId}?q=students` &&
                  (teacherClassesStore.teacherClassData[0]?.students &&
                  teacherClassesStore.teacherClassData[0]?.students.length > 0 ? (
                    <StudentCardWrapper>
                      {/* <AutocompleteDropdown
                    inputValue={'inputValue'}
                    setInputValue={() => console.log('first')}
                  /> */}
                      {/* {showSorting && teacherClassesStore.isTeacherClass && (
                      <div className={styles.sortingStyles}>
                        <SortDropdown
                          sortValue={sortStore.sortTypes.order}
                          // handleChangeSort={handleChangeSort}
                          sortOptions={sortByOrder}
                        />
                      </div>
                    )} */}
                      <div className={styles.numberOfClasses}>
                        <span className={styles.number}>
                          {`Number of students 
                         ${teacherClassesStore.teacherClassData[0]?.students.length}`}
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

                      {!teacherClassesStore.isTeacherClass &&
                        teacherClassesStore?.teacherClassData.map(({ teacher }) => {
                          return (
                            <StudentCard
                              key={teacher.id}
                              lessonOwnerAvatar={teacher.avatarUrl}
                              studentName={`${teacher.name}`}
                              isTeacher
                            />
                          );
                        })}
                      {teacherClassesStore.teacherClassData[0]?.students.map(({ user }) => {
                        return (
                          <StudentCard
                            key={user.id}
                            lessonOwnerAvatar={user.avatarUrl}
                            studentName={`${user.name}`}
                            deleteStudent={() => deleteStudent(user.id)}
                          />
                        );
                      })}

                      {teacherClassesStore.isTeacherClass && (
                        <div style={{ margin: '24px 0', height: '86px !important' }}>
                          <AddCard
                            addText={'Invite students'}
                            addItemAction={handleClickAddNewStudent}
                            showLock={
                              userStore.user.limits.studentsInClassCounter < 1 &&
                              !userStore.user.isActivePremium
                            }
                          />
                        </div>
                      )}
                    </StudentCardWrapper>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        maxWidth: '471px',
                      }}
                    >
                      <Typography variant="h4" sx={{ mb: '16px' }}>
                        You have no students in this class yet
                      </Typography>
                      <Typography variant="body1" sx={{ mb: '48px' }}>
                        Invite students to this class to assign lessons and monitor their progress.
                      </Typography>
                      <div className={styles.inviteButton}>
                        <Button
                          onClick={() => setIsInviteStudents((prev) => !prev)}
                          variant="contained"
                          startIcon={<PersonAddAltIcon />}
                          size="large"
                        >
                          Invite students
                        </Button>
                      </div>
                    </Box>
                  ))}
                {asPath === `/teacher-classes/${+query.classId}?q=progress` &&
                  (teacherClassesStore.teacherClassDataAll[0]?.students &&
                  teacherClassesStore.teacherClassDataAll[0]?.students.length > 0 ? (
                    <StudentCardWrapper>
                      {/* <AutocompleteDropdown
                    inputValue={'inputValue'}
                    setInputValue={() => console.log('first')}
                  /> */}
                      {teacherClassesStore.isTeacherClass ? (
                        <>
                          <SelectLesson
                            firstLesson={teacherClassesStore.teacherClassDataAll[0].id}
                            handleChangeSelect={selectLesson}
                            dataToMap={teacherClassesStore.teacherClassDataAll}
                          />
                          <ProgressWrapper columnName={'Student’s name'} />
                          {teacherClassData &&
                            teacherClassData.students.map((item) => {
                              return (
                                <StudentCard
                                  key={item.id}
                                  mediaUrl={item.avatarUrl}
                                  studentName={item.name}
                                  deleteStudent={() => deleteStudent(item.id)}
                                  dataToMap={item.lessons}
                                  isProgress
                                />
                              );
                            })}
                        </>
                      ) : (
                        <>
                          <ProgressWrapper columnName={'Lesson’s name'} />
                          {teacherClassesStore?.statisticStudent &&
                            teacherClassesStore?.statisticStudent.map((item) => {
                              return (
                                <StudentCard
                                  key={item.id}
                                  mediaUrl={item.lesson.mediaUrl}
                                  studentName={item.lesson.name}
                                  isProgress
                                  dataToMap={item.statistics}
                                  isStudentProgress
                                />
                              );
                            })}
                        </>
                      )}
                    </StudentCardWrapper>
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
                        You have no reports in this class yet
                      </Typography>
                      <Typography variant="body1">
                        Assign lessons to the class and invite your students to monitor their
                        progress.
                      </Typography>
                    </Box>
                  ))}
              </>

              {/* modalsVVVV */}
              <CreateClass
                isOpen={isCreateClass}
                close={() => setIsCreateClass((prev) => !prev)}
                isCreateModal={!teacherClassesStore.isEditClassModal}
                isTeacherClass
              />
              <AssignLessonWrapper
                showLessons={showLessons}
                setShowLessons={showModalLessons}
                headerText={'Assign a lesson from Library'}
              />
              <AssignOwnLessonWrapper
                showLessons={showOwnLessons}
                setShowLessons={showModalMyLessons}
                headerText={'Assign a lesson from My lessons'}
              />
              <InviteStudents
                isOpen={isInviteStudents}
                linkForInvite={linkToCopy}
                isInviteAfterCreate={teacherClassesStore.isInviteStudentsModal}
                close={() => {
                  setIsInviteStudents((prev) => !prev);
                  teacherClassesStore.toggleInviteStudentsModal(false);
                }}
              />
              <Notification
                isOpen={openNotifyModal}
                close={() => setOpenNotifyModal(false)}
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

              {/* delete modals */}
              <CustomModal
                isOpen={openDeleteModal}
                close={() => setOpenDeleteModal(false)}
                modalClasses={styles.modalClasses}
                withoutCloseBtn={false}
                title="Delete the lesson?"
                subtitle1="You will lose it forever"
                access={closeDeleteModal}
                idYesButton={'delete_lesson'}
                buttonTextLeft={'Cancel'}
                buttonTextRight={'Delete'}
              />
              <CustomModal
                isOpen={openDeleteStudentModal}
                close={() => setOpenDeleteStudentModal(false)}
                modalClasses={styles.modalClasses}
                withoutCloseBtn={false}
                title="Remove a student?"
                subtitle1="They’ll be removed from the class. To add them again, send them an invitation link."
                access={closeDeleteStudentModal}
                idYesButton={'delete_student'}
                buttonTextLeft={'Cancel'}
                buttonTextRight={'Remove'}
              />
              <CustomModal
                isOpen={openDeleteClassModal}
                close={() => setOpenDeleteClassModal(false)}
                modalClasses={styles.modalClasses}
                title="Delete the class?"
                subtitle1="All the lessons, students and progress in the class will be erased."
                access={closeDeleteClassModal}
                idYesButton={'delete_lesson'}
                buttonTextLeft={'Cancel'}
                buttonTextRight={'Delete'}
              />
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default observer(ClassId);
