import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentCopyRounded } from '@mui/icons-material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import { Button, CircularProgress, Dialog, Typography, useMediaQuery } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import styles from './index.module.scss';

import api from '~/api_client/api';
import Avatar from '~/components/avatar';
import { InitLoader } from '~/components/initLoader';
import LessonPageActivityView from '~/components/lessonPageActivityView';
import LevelLanguage from '~/components/levelLanguage/levelLanguage';
import LinkStoreButton from '~/components/linkStoreButton/linkStoreButton';
import RatingModule from '~/components/rating/ratingModule';
import LessonPercentProgress from '~/components/teacherClasses/lessonPercentProgress';
import Video from '~/components/video/Video';
import { WordPairBlock } from '~/components/wordPairBlock';
import { gameBlock } from '~/constants/blocks';
import { sendEvent } from '~/helpers/sendToGtm';
import { toClipboard } from '~/helpers/useClipboard';
import Layout from '~/hocs/layout';
import AsssignLessonsToClass from '~/modals/assignLessonToClass';
import CreateClass from '~/modals/createClass';
import { CustomModal } from '~/modals/customModal';
import { FullViewModal } from '~/modals/fullViewModal';
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
import { ChoosePlan } from '~/widget/ChoosePlan';

const Lesson: NextPage = () => {
  const { push, query, replace } = useRouter();
  const { t } = useTranslation();
  const { resetDataChooseGame } = variantStore;

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openPopupLimitModal, setOpenPopupLimitModal] = useState<boolean>(false);

  const [wordBan, setWordBan] = useState<boolean>(false);
  const [myLesson, setMyLesson] = useState<boolean>(false);

  const [videoLesson, setVideoLesson] = useState<boolean>(true);
  const [serviceId, setServiceId] = useState<string>();
  const [openCreateClassModal, setOpenCreateClassModal] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [isCreateClass, setIsCreateClass] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const popoverOpen = Boolean(anchorEl);
  const isLg = useMediaQuery('(min-width:1024px)');
  const [countLetterWord, setCountLetterWord] = useState<number>();
  const [expanded, setExpanded] = useState(false);
  // const [isStudent, setIsStudent] = useState(null);
  const [display, setDisplay] = useState<string>('none');
  const gamesRef = useRef<HTMLInputElement>(null);

  const openPopover = (event: MouseEvent<HTMLButtonElement>) => {
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
    setTimeout(() => {
      if (lessonStore.scrollToGames && gamesRef.current) {
        gamesRef.current.scrollIntoView();
        lessonStore.setScrollToGames(false);
      }
    }, 100);
  }, [lessonStore.isLoadingLessons]);

  useEffect(() => {
    lessonStore.resetProcentToClassActivity();
    openEndedGameStore.resetData();
    return () => {
      lessonStore.setScrollToGames(false);
      openEndedGameStore.resetData();
    };
  }, []);

  useEffect(() => {
    if (lessonStore.isLoadingLessons === 'false') {
      let countLetterWord = 0;
      if (lessonStore.lessonData && lessonStore.lessonData.word) {
        lessonStore.lessonData.word.forEach((item) => {
          if (item.word.length <= 19) countLetterWord += item.word.length;
        });
        countLetterWord != 0 ? setCountLetterWord(countLetterWord) : setCountLetterWord(1);
      }
    }
  }, [lessonStore.isLoadingLessons]);

  useEffect(() => {
    if (lessonStore.lessonData) {
      setVideoLesson(!!lessonStore.lessonData.mediaUrl);
    }
    if (lessonStore.lessonData && userStore.user) {
      setMyLesson(userStore.user.id === lessonStore.lessonData.userId);
    }
  }, [userStore.user, lessonStore.lessonData]);

  useEffect(() => {
    userStore.isAuth && lessonStore.updateLessons(true);
  }, [userStore.isAuth]);

  useEffect(() => {
    if (lessonStore.lessonData) {
      lessonStore.sortVideoGameDataLesson();
      if (lessonStore.lessonData.mediaUrl) {
        const url = new URL(lessonStore.lessonData.mediaUrl);
        setServiceId(url.searchParams.get('v'));
      }
    }
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

  const games = videoLesson
    ? gameBlock.filter((game) => {
        return countLetterWord > game.countLetterWord && !game.copy;
      })
    : gameBlock.filter((game) => {
        return !game.withVideo && countLetterWord > game.countLetterWord;
      });

  const quizDescription = () => {
    if (
      lessonStore?.lessonData?.videoGame?.length > 0 &&
      lessonStore?.lessonData?.sentences?.length > 0
    ) {
      return t('lessonId.quizDescription.pay');
    }
    if (
      lessonStore?.lessonData?.videoGame?.length > 0 &&
      lessonStore?.lessonData?.sentences?.length === 0
    ) {
      return t('lessonId.quizDescription.watch');
    }
    if (
      lessonStore?.lessonData?.videoGame?.length === 0 &&
      lessonStore?.lessonData?.sentences?.length > 0
    ) {
      return t('lessonId.quizDescription.words');
    }
  };

  const showCopyLessonButton =
    userStore.isAuth && lessonStore?.lessonData?.userId !== userStore.user.id;

  const copyLessonHandler = () => {
    userStore.getUserInfo();
    userStore.user.limits.ownLessonCounter < 1 && !userStore.user.isActivePremium
      ? handleOpenPopupLimit()
      : (sendEvent('copy_edit_lesson', {
          lesson_rate: lessonStore?.lessonData?.avgRating?.toFixed(2) || '0 review',
        }),
        lessonStore
          .copyFullLesson()
          .then((resp) => {
            lessonStore.setLesson(resp);
          })
          .then(() => {
            replace(`/lessons/${lessonStore.lessonData.id}/edit`);
          }));
  };

  const layoutClasses = cn({
    [styles.layoutCustomClass]: lessonStore.lessonData?.word?.length < 1,
  });

  const checkToAssignLesson = async () => {
    const teacherClassesLength = await teacherClassesStore.getClassesByUserId();
    if (teacherClassesLength) {
      setShowClasses((prev) => !prev);
    } else {
      setOpenCreateClassModal(true);
    }
  };

  const handleOpenPopupLimit = () => {
    setOpenPopupLimitModal(!openPopupLimitModal);
  };

  return (
    <Layout className={layoutClasses}>
      <NextSeo title={lessonStore.lessonData ? lessonStore.lessonData?.name : 'Lesson'} />
      {lessonStore.isLoadingLessons === 'true' ? (
        <InitLoader />
      ) : (
        <>
          <FullViewModal
            isOpen={openPopupLimitModal}
            close={handleOpenPopupLimit}
            title={'Switch to another plan to copy more than 6 lessons'}
          >
            <ChoosePlan openFromPopup />
          </FullViewModal>
          <LinkStoreButton />
          <CustomModal
            isOpen={openCreateClassModal}
            close={() => setOpenCreateClassModal(false)}
            modalClasses={styles.modalClasses}
            title={t('lessonId.titleAssign')}
            subtitle1={t('lessonId.subtitle1NoClasses')}
            access={() => {
              setOpenCreateClassModal((prev) => !prev);
              setIsCreateClass((prev) => !prev);
            }}
            buttonTextLeft={t('lessonId.cancel')}
            buttonTextRight={t('lessonId.createClass')}
          />
          <CreateClass
            isOpen={isCreateClass}
            close={() => setIsCreateClass((prev) => !prev)}
            isCreateModal={!teacherClassesStore.isEditClassModal}
            shouldAssignLesson
            lessonId={+query.lessonId}
          />
          <AsssignLessonsToClass
            isOpen={showClasses}
            close={() => {
              setShowClasses(false);
              teacherClassesStore.toggleDoneButton(false);
            }}
            headerText={t('lessonId.titleAssign')}
            currentLessonId={+query.lessonId}
          />
          <div className={styles.header}>
            <div className={styles.titleWrapper}>
              <Typography variant="h2" sx={{ lineHeight: { xs: '36px' } }}>
                {lessonStore.lessonData?.name}
              </Typography>
            </div>
            {mainStore.isMobile &&
              (lessonStore.isLoadingLessons === 'false' ? (
                myLesson ? (
                  <div className={styles.infoLessonBlock}>
                    <RatingModule myLesson={myLesson} />
                    <LevelLanguage />
                  </div>
                ) : (
                  <div className={styles.avatarBlock}>
                    <Avatar
                      src={lessonStore.lessonData?.user?.avatarUrl}
                      size="small"
                      alt={lessonStore.lessonData?.user?.name}
                    />
                    <div className={styles.userName}>
                      {lessonStore.lessonData?.user?.name
                        ? lessonStore.lessonData?.user.name
                        : t('lessonId.nameNotFound')}
                    </div>
                    <RatingModule myLesson={myLesson} />
                    <LevelLanguage />
                  </div>
                )
              ) : (
                <InitLoader />
              ))}
            {
              // !(isStudent === asPath) ? (
              <div className={styles.editBlockButton}>
                {showCopyLessonButton && (
                  <Tooltip
                    arrow
                    title={t('lessonId.titleCopy')}
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
                )}
                {myLesson && (
                  <Link href={`${+query.lessonId}/edit`} passHref>
                    <a style={{ display: 'flex' }}>
                      <Tooltip
                        arrow
                        title={t('lessonId.titleEdit')}
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
                )}
                <Tooltip
                  arrow
                  title={t('lessonId.titleCopyLink')}
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
                        `https://${window.location.host}/lessons/${lessonStore.lessonData.id}?shared=true`
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
                {myLesson && (
                  <Tooltip
                    arrow
                    title={t('lessonId.titleDelete')}
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
                {!myLesson && userStore.isAuth && (
                  <Tooltip
                    arrow
                    title={
                      lessonStore.lessonData?.favoriteLessons?.length === 0
                        ? t('lessonId.titleSave')
                        : t('lessonId.titleUnsave')
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
                )}
                <div className={popoverOpen ? styles.toastOnCopyOpen : styles.closeToastOnCopy}>
                  <div className={styles.toastOnCopy}>
                    <span className={styles.toastOnCopyText}>{t('lessonId.linkCopied')}</span>
                  </div>
                </div>
                {userStore.isAuth && (
                  <Button
                    style={{
                      minWidth: 'fit-content',
                    }}
                    sx={{ width: '84px', height: '48px' }}
                    variant={'contained'}
                    size="medium"
                    onClick={checkToAssignLesson}
                  >
                    {t('lessonId.assign')}
                  </Button>
                )}
              </div>
            }
          </div>
          {!mainStore.isMobile &&
            (lessonStore.isLoadingLessons === 'false' ? (
              myLesson ? (
                <div className={styles.infoLessonBlock}>
                  <RatingModule myLesson={myLesson} />
                  <LevelLanguage />
                </div>
              ) : (
                <div className={styles.avatarBlock}>
                  <Avatar
                    src={lessonStore.lessonData?.user?.avatarUrl}
                    size="small"
                    alt={lessonStore.lessonData?.user?.name}
                  />
                  <div className={styles.userName}>
                    {lessonStore.lessonData?.user?.name
                      ? lessonStore.lessonData?.user.name
                      : t('lessonId.nameNotFound')}
                  </div>
                  <RatingModule myLesson={myLesson} />
                  <LevelLanguage />
                </div>
              )
            ) : (
              <InitLoader />
            ))}

          {lessonStore.lessonData?.word?.length > 0 && (
            <div className={styles.wrapper}>
              <div className={styles.titleBlock}>
                <Typography variant="h3" className={styles.lessonStep}>
                  1
                </Typography>
                <Typography variant="h3">{`${t('lessonId.wordsStudy')} (${
                  lessonStore.lessonData?.word?.length
                })`}</Typography>
              </div>

              <div className={styles.pairsBlock}>
                <Typography variant="body2" className={styles.subtitleBlock}>
                  {t('lessonId.studiedWords')}
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
                        {expanded ? t('lessonId.showLess') : t('lessonId.showAll')}
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
                  {teacherClassesStore?.dataForTeacherLesson?.videoGame && (
                    <LessonPercentProgress
                      number={teacherClassesStore?.dataForTeacherLesson?.videoGame}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          {lessonStore.lessonData?.videoGame?.length > 0 && (
            <div style={{ marginTop: 0 }} className={styles.wrapper}>
              <Typography variant={'h5'} sx={{ padding: '16px 0 8px' }}>
                Activities content{' '}
              </Typography>
              <LessonPageActivityView />
            </div>
          )}
          {lessonStore.lessonData?.word?.length > 0 && (
            <div className={styles.wrapper}>
              <div className={styles.titleBlock}>
                <Typography variant="h3" className={styles.lessonStep}>
                  {videoLesson ? 3 : 2}
                </Typography>
                <Typography variant="h3" noWrap={false} ref={gamesRef}>
                  {t('lessonId.chooseWay')}
                </Typography>
              </div>
              <div className={styles.blockGames}>
                {games.map(({ Img, ImgMobile, title, text, path }, index) => {
                  return (
                    <Link key={index} href={`${+query.lessonId}/${path}`}>
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
                          {/* <div className={styles.tick}>
                            {teacherClassesStore?.dataForTeacherLesson &&
                              teacherClassesStore?.dataForTeacherLesson[name] && (
                                <LessonPercentProgress
                                  number={!!teacherClassesStore?.dataForTeacherLesson[name]}
                                />
                              )}
                          </div> */}
                        </div>
                      </a>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <CustomModal
            isOpen={openModal}
            close={closeDeleteModal}
            modalClasses={styles.modalClasses}
            withoutCloseBtn={false}
            title={t('lessonId.titleDelete')}
            subtitle1={t('lessons.subtitle1Delete')}
            access={handleClickDeleteLesson}
            idYesButton={'delete_lesson'}
            buttonTextLeft={t('lessons.cancel')}
            buttonTextRight={t('lessons.delete')}
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

export default observer(Lesson);
