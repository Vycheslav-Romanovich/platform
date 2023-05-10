import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Breadcrumbs, Button, Dialog, Typography, useMediaQuery } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import Arrow from '~/assets/icons/arrows/arrow.svg';

import styles from './index.module.scss';

import api from '~/api_client/api';
import Avatar from '~/components/avatar';
import { InitLoader } from '~/components/initLoader';
// import RatingModule from '~/components/rating/ratingModule';
import LessonPercentProgress from '~/components/teacherClasses/lessonPercentProgress';
import Video from '~/components/video/Video';
import { WordPairBlock } from '~/components/wordPairBlock';
import { toClipboard } from '~/helpers/useClipboard';
import Layout from '~/hocs/layout';
import { CustomModal } from '~/modals/customModal';
import {
  lessonStore,
  mainStore,
  openEndedGameStore,
  teacherClassesStore,
  userStore,
  variantStore,
  videoStore,
} from '~/stores';
import Modal from '~/UI/modal';

const TeacherLessonId: NextPage = () => {
  const { push, query, asPath } = useRouter();
  const { t } = useTranslation();
  const { resetDataChooseGame } = variantStore;

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [wordBan, setWordBan] = useState<boolean>(false);
  const [myLesson, setMyLesson] = useState<boolean>(false);
  const [isCreateClass, setIsCreateClass] = useState(false);

  const [videoLesson, setVideoLesson] = useState<boolean>(true);
  const [serviceId, setServiceId] = useState<string>();
  const [openCreateClassModal, setOpenCreateClassModal] = useState(false);
  // const [showClasses, setShowClasses] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const popoverOpen = Boolean(anchorEl);
  const isLg = useMediaQuery('(min-width:1024px)');
  const [expanded, setExpanded] = useState(false);
  const [isStudent, setIsStudent] = useState(null);
  const [display, setDisplay] = useState<string>('none');
  const gamesRef = useRef<HTMLInputElement>(null);
  const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setTimeout(() => {
      setAnchorEl(null);
    }, 2000);
  };

  const changeDisplay = () => {
    if (display === 'flex') {
      setDisplay('none');
      setExpanded(!expanded);
    } else {
      setDisplay('flex');
      setExpanded(!expanded);
    }
  };

  const closeDeleteModal = () => {
    setOpenModal(false);
  };

  const handleClickDeleteLesson = () => {
    lessonStore.deleteVideoLesson(lessonStore.lessonData.id).then(() => {
      push('/lessons').then(() => lessonStore.setDeleteLessonModal(true));
    });
  };

  useEffect(() => {
    lessonStore.resetProcentToClassActivity();
    openEndedGameStore.resetData();
    return () => {
      openEndedGameStore.resetData();
    };
  }, []);

  useEffect(() => {
    teacherClassesStore.resetProgress();
    const { pathname } = window.location;
    userStore.setUserNotAuthLink(pathname);
    userStore.setUserNotAuthLinkLessonId(pathname);

    if (lessonStore.lessonData) {
      setVideoLesson(!!lessonStore.lessonData.mediaUrl);
    }
    if (lessonStore.lessonData && userStore.user) {
      setMyLesson(userStore.user.id === lessonStore.lessonData.userId);
    }
  }, [userStore.user, lessonStore.lessonData]);

  useEffect(() => {
    if (lessonStore.lessonData) {
      if (lessonStore.lessonData.mediaUrl) {
        const url = new URL(lessonStore.lessonData.mediaUrl);
        setServiceId(url.searchParams.get('v'));
      }
    }
    teacherClassesStore.setLessonPercentProgress(lessonStore.lessonData?.statistic);
  }, [lessonStore.lessonData]);

  useEffect(() => {
    if (
      lessonStore.lessonData &&
      lessonStore.lessonData.userId !== userStore?.user?.id &&
      userStore.isAuth &&
      query.shared === 'true' &&
      lessonStore.sharedLessons &&
      !lessonStore.sharedLessons.find((f) => f.id === +query.lessonId)
    ) {
      api
        .postSharedLessonById({ lessonIds: [lessonStore.lessonData.id] })
        .then()
        .catch();
    }
  }, [lessonStore.lessonData, userStore.user, query.shared]);

  // reset game data
  useEffect(() => {
    resetDataChooseGame();
  }, [resetDataChooseGame]);

  const quizDescription = () => {
    if (
      lessonStore?.lessonData?.videoGame?.length > 0 &&
      lessonStore?.lessonData?.sentences?.length > 0
    ) {
      return 'Pay attention to the words highlighted in blue and answer the pop up questions.';
    }
    if (
      lessonStore?.lessonData?.videoGame?.length > 0 &&
      lessonStore?.lessonData?.sentences?.length === 0
    ) {
      return 'Watch the video and answer the pop up questions.';
    }
    if (
      lessonStore?.lessonData?.videoGame?.length === 0 &&
      lessonStore?.lessonData?.sentences?.length > 0
    ) {
      return 'Words to memorize will be highlighted in blue.';
    }
  };

  // const showCopyLessonButton =
  //   userStore.isAuth && lessonStore?.lessonData?.userId !== userStore.user.id;

  // const copyLessonHandler = () => {
  //   lessonStore.copyFullLesson().then((resp) => {
  //     lessonStore.setLesson(resp);
  //   });
  // .then(() => {
  //   replace(`/lessons/${lessonStore.lessonData.id}/edit`);
  // });
  // };

  const layoutClasses = cn({
    [styles.layoutCustomClass]: lessonStore.lessonData?.word?.length < 1,
  });

  return (
    <Layout className={layoutClasses}>
      <NextSeo title={'teacher lesson'} />
      {lessonStore.isLoadingLessons === 'true' ? (
        <InitLoader />
      ) : !userStore.isAuth ? (
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
      ) : (
        <>
          <CustomModal
            isOpen={openCreateClassModal}
            close={() => setOpenCreateClassModal(false)}
            modalClasses={styles.modalClasses}
            title="Assign lesson to a class"
            subtitle1="You have no classes yet. Create a class to assign lessons and invite students."
            access={() => {
              setOpenCreateClassModal((prev) => !prev);
              setIsCreateClass((prev) => !prev);
            }}
            idYesButton={'delete_lesson'}
            buttonTextLeft={'Cancel'}
            buttonTextRight={'Create a class'}
          />
          <div className={styles.breadcrumbsWrapper}>
            <Arrow
              className={styles.teacherLessonBack}
              onClick={() => push(`/teacher-classes/${query.classId}`)}
            />
            <Breadcrumbs aria-label="breadcrumb">
              <Typography
                onClick={() => push(`/teacher-classes/${query.classId}`)}
                variant="h5"
                sx={{ cursor: 'pointer' }}
                color={`var(--Black)`}
              >
                {lessonStore.lessonData?.teacherClassName}
              </Typography>
              <Typography variant="h5" color={`var(--Black)`}>
                {lessonStore.lessonData?.name}
              </Typography>
            </Breadcrumbs>
          </div>
          <div className={styles.header}>
            <div className={styles.titleWrapper}>
              <Typography variant="h2" sx={{ lineHeight: { xs: '36px' } }}>
                {lessonStore.lessonData?.name}
              </Typography>
            </div>
            {!(isStudent === asPath) ? (
              <div className={styles.editBlockButton}>
                {/* {showCopyLessonButton && (
                  <Tooltip
                    arrow
                    title={'Copy and edit'}
                    classes={{
                      tooltip: styles.tooltip,
                      arrow: styles.tooltipArrow,
                    }}
                  >
                    <Button
                      id={'copy_public_lesson'}
                      style={{
                        marginLeft: !myLesson ? '10px' : '0',
                      }}
                      sx={{ width: '48px', height: '48px' }}
                      variant={'contained'}
                      size="medium"
                      color="lightBlue"
                      onClick={(event) => {
                        copyLessonHandler();
                        event.preventDefault();
                      }}
                    >
                      <ContentCopyRounded
                        sx={{
                          width: '25px',
                          height: '25px',
                          color: 'var(--Grey)',
                          margin: 0,
                        }}
                      />
                    </Button>
                  </Tooltip>
                )} */}
                {/* {myLesson && (
                  <Link href={`${+query.lessonId}/edit`} passHref>
                    <a style={{ display: 'flex' }}>
                      <Tooltip
                        arrow
                        title={'Edit lesson'}
                        classes={{
                          tooltip: styles.tooltip,
                          arrow: styles.tooltipArrow,
                        }}
                      >
                        <Button
                          id={'edit_les_words'}
                          style={{
                            marginLeft: !myLesson ? '10px' : '0',
                          }}
                          sx={{ width: '48px', height: '48px' }}
                          variant={myLesson ? 'contained' : 'outlined'}
                          size="medium"
                          color="lightBlue"
                          onClick={() => videoStore.setEditVideoId(serviceId)}
                        >
                          <DriveFileRenameOutlineOutlinedIcon
                            sx={{
                              width: '25px',
                              height: '25px',
                              color: 'var(--Grey)',
                              margin: 0,
                            }}
                          />
                        </Button>
                      </Tooltip>
                    </a>
                  </Link>
                )} */}
                {lessonStore?.lessonData?.teacherId === userStore.user.id ? (
                  <Tooltip
                    arrow
                    title={'Copy lesson link'}
                    classes={{
                      tooltip: styles.tooltip,
                      arrow: styles.tooltipArrow,
                    }}
                  >
                    <Button
                      style={{
                        minWidth: 'fit-content',
                        marginLeft: !myLesson ? '10px' : '0',
                      }}
                      sx={{ width: '48px', height: '48px' }}
                      variant={'contained'}
                      size="medium"
                      color="lightBlue"
                      onClick={(event) => {
                        toClipboard(
                          `https://${window.location.host}/teacher-classes/${query.classId}/${query.teacherLessonId}`
                        );
                        openPopover(event);
                      }}
                    >
                      <InsertLinkOutlinedIcon
                        id={'copy_link'}
                        sx={{
                          width: '25px',
                          height: '25px',
                          transform: 'rotate(135deg)',
                          color: 'var(--Grey)',
                          margin: 0,
                        }}
                      />
                    </Button>
                  </Tooltip>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span>{t('lessonId.myResult')}</span>
                    <LessonPercentProgress number={+teacherClassesStore.lessonPercentProgress} />
                  </div>
                )}
                {myLesson && (
                  <Tooltip
                    arrow
                    title={'Delete the lesson'}
                    classes={{
                      tooltip: styles.tooltip,
                      arrow: styles.tooltipArrow,
                    }}
                  >
                    <Button
                      style={{
                        minWidth: 'fit-content',
                        marginLeft: !myLesson ? '10px' : '0',
                      }}
                      sx={{ width: '48px', height: '48px' }}
                      variant={myLesson ? 'contained' : 'outlined'}
                      size="medium"
                      color="lightBlue"
                      onClick={() => setOpenModal(true)}
                    >
                      <DeleteOutlineIcon
                        sx={{
                          width: '25px',
                          height: '25px',
                          color: 'var(--Grey)',
                          margin: 0,
                        }}
                      />
                    </Button>
                  </Tooltip>
                )}
                {/* {!myLesson && userStore.isAuth && (
                  <Tooltip
                    arrow
                    title={
                      lessonStore.lessonData?.favoriteLessons?.length === 0
                        ? 'Save the lesson'
                        : 'Unsave the lesson'
                    }
                    classes={{
                      tooltip: styles.tooltip,
                      arrow: styles.tooltipArrow,
                    }}
                  >
                    <Button
                      style={{
                        minWidth: 'fit-content',
                        marginLeft: !myLesson ? '10px' : '0',
                      }}
                      sx={{ width: '48px', height: '48px' }}
                      variant={'contained'}
                      size="medium"
                      color="lightBlue"
                      onClick={() => lessonStore.addFavoriteLesson(lessonStore.lessonData.id)}
                    >
                      {lessonStore.isLoadingFavoriteLessons !== 'true' ? (
                        lessonStore.lessonData?.favoriteLessons?.length === 0 ? (
                          <TurnedInNotIcon
                            sx={{
                              width: '25px',
                              height: '25px',
                              color: 'var(--Grey)',
                              margin: 0,
                            }}
                          />
                        ) : (
                          <TurnedInIcon
                            sx={{
                              width: '25px',
                              height: '25px',
                              color: 'var(--Blue)',
                              margin: 0,
                            }}
                          />
                        )
                      ) : (
                        <CircularProgress style={{ width: '25px', height: '25px' }} />
                      )}
                    </Button>
                  </Tooltip>
                )} */}
                <div className={popoverOpen ? styles.toastOnCopyOpen : styles.closeToastOnCopy}>
                  <div className={styles.toastOnCopy}>
                    <span className={styles.toastOnCopyText}>Link is copied</span>
                  </div>
                </div>
                {/* <Button
                  style={{
                    minWidth: 'fit-content',
                  }}
                  sx={{ width: '84px', height: '48px' }}
                  variant={'contained'}
                  size="medium"
                  // onClick={checkToAssignLesson}
                >
                  Assign
                </Button> */}
              </div>
            ) : (
              <div style={{ display: 'flex' }}>
                <span>My overall result:</span>
                <div style={{ position: 'relative' }}>
                  <LessonPercentProgress number={+teacherClassesStore.lessonPercentProgress} />
                </div>
              </div>
            )}
          </div>
          {lessonStore.isLoadingLessons === 'false' ? (
            myLesson ? (
              <></>
            ) : (
              // <RatingModule myLesson={myLesson} />
              <div className={styles.avatarBlock}>
                <Avatar
                  src={lessonStore.lessonData?.user?.avatarUrl}
                  size="small"
                  alt={lessonStore.lessonData?.user?.name}
                />
                <div className={styles.userName}>
                  {lessonStore.lessonData?.user?.name
                    ? lessonStore.lessonData?.user.name
                    : 'Name not found'}
                </div>
                {/* <RatingModule myLesson={myLesson} /> */}
              </div>
            )
          ) : (
            <InitLoader />
          )}

          {lessonStore.lessonData?.word?.length > 0 && (
            <div className={styles.wrapper}>
              <div className={styles.titleBlock}>
                <Typography variant="h3" className={styles.lessonStep}>
                  1
                </Typography>
                <Typography variant="h3">{`Words to study (${lessonStore.lessonData?.word?.length})`}</Typography>
              </div>

              <div className={styles.pairsBlock}>
                <Typography variant="body2" className={styles.subtitleBlock}>
                  You haven’t studied these words yet! Look them through before training
                </Typography>
                <div className={styles.wordsList}>
                  {lessonStore.lessonData?.word?.map(({ word, translate }, index) => {
                    return (
                      <WordPairBlock
                        key={index}
                        word={word}
                        translate={translate}
                        display={index < 5 ? 'flex' : display}
                      />
                    );
                  })}
                  {lessonStore.lessonData?.word?.length > 5 ? (
                    <div className={styles.showAllWordsWrap}>
                      <Typography
                        variant="body1"
                        className={styles.showAllWords}
                        onClick={changeDisplay}
                      >
                        {expanded ? 'Show less words' : 'Show all words'}{' '}
                      </Typography>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          )}

          {videoLesson && (
            <div
              className={styles.wrapper}
              style={lessonStore.lessonData?.word?.length < 1 ? { marginBottom: '14px' } : {}}
            >
              <div className={styles.titleBlock}>
                <Typography variant="h3" className={styles.lessonStep}>
                  {lessonStore.lessonData?.word?.length > 0 ? '2' : '1'}
                </Typography>
                <Typography variant="h3">
                  {t('lessonId.watchVideo')}
                  {lessonStore?.lessonData?.videoGame?.length > 0 && t('lessonId.answer')}
                </Typography>
              </div>
              <div className={styles.pairsBlock} style={{ alignItems: 'flex-start' }}>
                <Typography variant="body2" className={styles.subtitleBlock}>
                  {quizDescription()}
                </Typography>

                <div
                  className={styles.videoPicWrapper}
                  onClick={() => {
                    videoStore.setOpenVideoModal(true);
                    setWordBan(true);
                  }}
                >
                  <div className={styles.background} />
                  <Button variant={'contained'} className={styles.playIcon}>
                    <PlayArrowIcon />
                    <Typography variant={'button1'}>
                      {lessonStore?.lessonData?.videoGame?.length > 0
                        ? t('lessonId.startQuiz')
                        : t('lessonId.watchVideo')}
                    </Typography>
                  </Button>
                  <img src={`https://i.ytimg.com/vi/${serviceId}/hqdefault.jpg`} alt="" />

                  {lessonStore?.lessonData?.statistic?.videoGame && (
                    <div className={styles.tickVideoGame}>
                      <LessonPercentProgress
                        number={lessonStore?.lessonData?.statistic?.videoGame}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {lessonStore.lessonData?.word?.length > 0 && (
            <div className={styles.wrapper}>
              <div className={styles.titleBlock}>
                <Typography variant="h3" className={styles.lessonStep}>
                  {videoLesson ? 3 : 2}
                </Typography>
                <Typography variant="h3" noWrap={false} ref={gamesRef}>
                  Choose the way to learn the words
                </Typography>
              </div>
              <div className={styles.blockGames}>
                {lessonStore.lessonGames.map(
                  ({ Img, ImgMobile, title, text, path, name }, index) => {
                    return (
                      <Link
                        key={index}
                        href={`/teacher-classes/${+query.classId}/${+query.teacherLessonId}/${path}`}
                      >
                        <a className={styles.blockBtn}>
                          <div className={styles.imgWrapper}>
                            {isLg ? (
                              <Img width="100%" height="100%" />
                            ) : (
                              <ImgMobile width="100%" height="100%" />
                            )}
                          </div>
                          <div className={styles.explanationGame}>
                            <Typography variant="h4" component="p" className={styles.titleGame}>
                              {t(`games.${title}`)}
                            </Typography>
                            <Typography variant="body1" component="p" className={styles.textGame}>
                              {t(`games.${text}`)}
                            </Typography>
                            {lessonStore?.lessonData?.statistic?.[name] > 0 && (
                              <div className={styles.tick}>
                                <LessonPercentProgress
                                  number={lessonStore.lessonData.statistic[name]}
                                />
                              </div>
                            )}
                          </div>
                        </a>
                      </Link>
                    );
                  }
                )}
              </div>
            </div>
          )}

          <CustomModal
            isOpen={openModal}
            close={closeDeleteModal}
            modalClasses={styles.modalClasses}
            withoutCloseBtn={false}
            title="Delete the lesson?"
            subtitle1="You will lose it forever"
            access={handleClickDeleteLesson}
            idYesButton={'delete_lesson'}
            buttonTextLeft={'Cancel'}
            buttonTextRight={'Delete'}
          />

          {mainStore.isMobile ? (
            <Dialog
              fullScreen
              className={styles.dialogVideo}
              open={videoStore.state.openVideoModal}
              onClose={() => {
                videoStore.setOpenVideoModal(false);
                setWordBan(false);
              }}
            >
              <div className={styles.backArrow} onClick={() => videoStore.setOpenVideoModal(false)}>
                <div style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
                  <ArrowBackOutlinedIcon />
                  {t('lessonId.backLesson')}
                </div>
              </div>
              <div>
                <Video id={serviceId} withSubtitles modal wordBan={wordBan} />
              </div>
            </Dialog>
          ) : (
            <Modal
              modalClasses={styles.modalVideo}
              isOpen={videoStore.state.openVideoModal}
              close={() => {
                videoStore.setOpenVideoModal(false);
                setWordBan(false);
              }}
              video
            >
              {videoStore.state.openVideoModal && (
                <>
                  <div
                    className={styles.customHeaderWrapper}
                    onClick={() => videoStore.setOpenVideoModal(false)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
                      <ArrowBackOutlinedIcon />
                      {t('lessonId.theLesson')}
                    </div>
                  </div>
                  <Video id={serviceId} withSubtitles modal wordBan={wordBan} />
                </>
              )}
            </Modal>
          )}
        </>
      )}
    </Layout>
  );
};

export default observer(TeacherLessonId);
