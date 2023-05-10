import { useContext, useEffect, useRef, useState } from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { useTranslation } from 'react-i18next';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Snackbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import cn from 'classnames';
import { observer } from 'mobx-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import ArrowNext from '~/assets/icons/arrows/arrowBreadCrumb.svg';
import MobileCards from '~/assets/icons/lesson/mobileCards.svg';
import QuestionSVG from '~/assets/icons/lesson/question.svg';

import styles from './index.module.scss';

import api from '~/api_client/api';
import { InteractiveGames, SnackBarState } from '~/components/interactiveGame';
import { MobileCountWords } from '~/components/lesson/mobileCountWords/mobileCountWords';
import NotLinkSearch from '~/components/lesson/notLinkSearch/NotLinkSearch';
import ListingPageComponent from '~/components/listingPageComponent';
import { ChooseActivityList } from '~/components/player/features/ChooseActivityList/ChooseActivityList';
import { WarningBox } from '~/components/video/termsAndActivitiesList/entities/warningBox';
import { ActivityList } from '~/components/video/termsAndActivitiesList/features/activityList';
import { WordsList } from '~/components/video/termsAndActivitiesList/features/wordsList';
import Video from '~/components/video/Video';
import { ContainerEditWords } from '~/components/сontainerEditWords';
import { ELEMENT_FOR_PAGE } from '~/constants/createVideoPage';
import { sortByDuration } from '~/constants/sortVideos';
import { QueryOptions } from '~/constants/video-lesson-steps';
import { useInput } from '~/customHooks/useValidation';
import { Step } from '~/features/Step';
import { categories } from '~/helpers/categories';
import { secondToHms } from '~/helpers/secondToHm';
import { sendEvent } from '~/helpers/sendToGtm';
import Layout from '~/hocs/layout';
import VideoLessonOnboarding from '~/modals/videoLessonOnboarding';
import {
  lessonStore,
  mainStore,
  openEndedGameStore,
  settingsStore,
  sortStore,
  userStore,
  validationStore,
  videoStore,
} from '~/stores';
import { durationType } from '~/types/api';
import { IListItem, ListItem, VideoGameType } from '~/types/video';
import MuiDialog from '~/UI/muiDialog';
import { SearchInput } from '~/UI/searchInput';

const prodTags = categories.map((m) => m.category);

const CreateVideoLesson: NextPage = () => {
  const [videosData, setVideosData] = useState<IListItem[]>([]);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [searchText, setSearchText] = useState<string>('');
  const [videoId, setVideoId] = useState<string | null>(localStorage.getItem('videoId'));
  const [openOnboarding, setOpenOnboarding] = useState(false);
  const [isOpenMobileCards, setIsOpenMobileCards] = useState(false);
  const [isOpenMobileActivity, setIsOpenMobileActivity] = useState(false);
  const [modalPosition, setModalPosition] = useState(0);
  const [isSaveLessonBtn, setSaveLessonBtn] = useState(false);
  const checkValidate = useInput('', { onSubmit: false });
  const refContainer = useRef(null);
  const refCard = useRef(null);
  const [isItemForLink, setIsItemForLink] = useState(false);
  const [isErrorLink, setIsErrorLink] = useState(false);
  const [isItemForLinkFlag, setIsItemForLinkFlag] = useState(false);
  const { push, asPath, back, replace } = useRouter();
  const { t } = useTranslation();
  const [isLevelChosen, setIsLevelChosen] = useState<boolean>(false);
  const [state, setState] = useState<SnackBarState>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: 'Add at least 3 terms or 3 activities to create a lesson',
  });
  const { vertical, horizontal, open, message } = state;
  const isSmSize = useMediaQuery('(max-width:639px)');
  const [resultVideos, setResultVideos] = useState<IListItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const lastIndexItem = currentPage * ELEMENT_FOR_PAGE;
  const firstIndexItem = lastIndexItem - ELEMENT_FOR_PAGE;
  const [pageQTY, setPageQTY] = useState<number>(0);

  const warningCondition =
    lessonStore.lessonData === null ||
    lessonStore.lessonData.word === undefined ||
    lessonStore.lessonData.word.length < 3;
  const checkForVideoOnboarding = +localStorage.getItem('isVideoOnboarding');

  const getAllVideos = (list: ListItem[]) => {
    const arrayList = [];
    list.map((category) => category.videoList.map((video) => arrayList.push(video)));
    setVideosData(arrayList.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    setResultVideos(videosData);
  }, [videosData]);

  function styleScrollbars(elmt) {
    const stylesheet = `
      ::-webkit-scrollbar {
        width: 0px;
      }
      ::-webkit-scrollbar-track {
        background: #fff;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 1rem;
        background: #666677;
        border: 4px solid #666677;
      }
      ::-webkit-scrollbar-thumb:hover {
      }
    `;

    const styleElmt = elmt?.shadowRoot.querySelector('style');

    if (styleElmt) {
      styleElmt.append(stylesheet);
    } else {
      const barStyle = document.createElement('style');
      barStyle.append(stylesheet);
      elmt?.shadowRoot.appendChild(barStyle);
    }
  }

  const sortDataItem = (duration: number, sorting: durationType) => {
    switch (sorting) {
      case 'any':
        return true;
      case 'short':
        return duration < 241;
      case 'medium':
        return duration > 241 && duration < 1201;
      case 'long':
        return duration > 1201;
      default:
        return false;
    }
  };
  const checkEnglishLevel = () => {
    !lessonStore.lessonData.level && setIsLevelChosen(true);
    setTimeout(() => {
      setIsLevelChosen(false);
    }, 3000);
  };

  const pushFoundVideosData = () => {
    const videos = videoStore.foundVideos?.items.map(({ id, contentDetails, snippet }) => ({
      serviceId: id.videoId || id,
      duration: contentDetails.duration,
      title: snippet.title,
      thumbnails: snippet.thumbnails,
    }));
    setCurrentPage(1);
    setResultVideos(videos);
  };

  const handleChangePagination = (_, page) => setCurrentPage(page);

  const handleChangeSortDuration = (event) => {
    const value = event.target.value as durationType;
    sortStore.setSortDuration(value);
    videoStore.foundVideos?.items &&
      videoStore.setVideosResult(searchText).then(() => {
        sendEvent('search_video', { search_request: searchText });
      });
  };

  // function for sorting, don't remove

  // const handleChangeOrder = (event) => {
  //   const value = event.target.value as OrderType;
  //   sortStore.setSortOrder(value);
  //   videoStore.foundVideos?.items &&
  //     videoStore.setVideosResult(searchText).then(() => {
  //       sendEvent('search_video', { search_request: searchText });
  //     });
  //   setCounter(0);
  // };

  function LeftArrow() {
    const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

    return !isFirstItemVisible ? (
      <button
        className={styles.scrollButtonLeft}
        disabled={isFirstItemVisible}
        onClick={() => scrollPrev()}
      >
        <ArrowBackIosRoundedIcon style={{ width: '25px', height: '25px' }} />
      </button>
    ) : (
      <></>
    );
  }

  const scrollToError = () => {
    if (refContainer.current !== null) {
      refContainer.current?.parentElement.parentElement.scrollIntoView();
    } else {
      refCard.current?.scrollIntoView();
    }
  };

  const nextButtonHandlerClick = async () => {
    if (!warningCondition || openEndedGameStore.templateArray.size > 2) {
      if (QueryOptions(1, asPath) || QueryOptions(0, asPath)) {
        push('/create-video-lesson?s=2');
      }
      if (QueryOptions(2, asPath)) {
        const { lessonData } = lessonStore;
        validationStore.validationFields(lessonData.word);
        validationStore.validateSpace(lessonData.word);
        checkValidate.onClick();
        checkEnglishLevel();
        scrollToError();

        if (
          lessonData.name.trim() &&
          lessonData.name &&
          lessonData.name.length <= 80 &&
          lessonData.name.length >= 3 &&
          !validationStore.objValidateSpace.word &&
          !validationStore.objValidateSpace.translate &&
          !validationStore.objValidate.word &&
          lessonStore.lessonData.level &&
          !validationStore.objValidate.translate
        ) {
          setSaveLessonBtn(true);
          lessonStore.createFullLesson().finally(() => {
            setSaveLessonBtn(false);
            localStorage.removeItem('videoLessonId');
            lessonStore.setCreateLessonModal(true);
            sendEvent('video_creation_finish', {
              added_words_amount: lessonStore?.lessonData?.word?.length.toString() || '0',
              level: lessonStore.lessonData.level,
            });

            // for check limit by created lessons
            userStore.getUserInfo();
            if (userStore.user.limits.ownLessonCounter < 1) {
              sendEvent('limit_reached');
            }
            replace(`/lessons?q=created`);
          });
        }

        validationStore.clearObjStore();
      }
    } else {
      setState({
        ...state,
        open: true,
        message: 'Add at least 3 terms or 3 activities to create a lesson',
      });
    }
    validationStore.clearObjStore();
  };

  const listingClickHandler = (id) => {
    setVideoId(id);
    lessonStore.setMediaUrl(id);
    push('/create-video-lesson?s=1');
  };

  function RightArrow() {
    const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

    return !isLastItemVisible ? (
      <button
        className={styles.scrollButtonRight}
        disabled={isLastItemVisible}
        onClick={() => scrollNext()}
      >
        <ArrowForwardIosRoundedIcon style={{ width: '25px', height: '25px' }} />
      </button>
    ) : (
      <></>
    );
  }

  const handleSearchSubmit = () => {
    setIsItemForLink(false);
    setIsItemForLinkFlag(true);
    const regExp = new RegExp(
      '(?:https?:\\/\\/)?(?:www\\.)?youtu\\.?be(?:\\.com)?\\/?.*(?:watch|embed)?(?:.*v=|v\\/|\\/)([\\w\\-_]+)\\&?'
    );
    if (regExp.test(searchText) && searchText.split('=')[1]) {
      setIsItemForLink(true);
      videoStore.setVideosResultById(searchText.split('=')[1]).then(() => {
        sendEvent('search_video', { search_request: searchText.split('=')[1] });
      });
    } else if (regExp.test(searchText) && !searchText.split('=')[1]) {
      setIsItemForLink(true);
      videoStore.setVideosResultById(searchText.split('/')[3]).then(() => {
        sendEvent('search_video', { search_request: searchText.split('/')[3] });
      });
    } else {
      videoStore.setVideosResult(searchText).then(() => {
        sendEvent('search_video', { search_request: searchText });
      });
    }
  };

  useEffect(() => {
    videoStore.foundVideos?.items && pushFoundVideosData();
  }, [videoStore.foundVideos?.items]);

  useEffect(() => {
    if (settingsStore.listTagsVideos.length > 0 && settingsStore.firstRenderVideo) {
      getAllVideos(settingsStore.listTagsVideos);
      settingsStore.setFirstRenderVideo(false);
    }
  }, [settingsStore.listTagsVideos]);

  const closeOnboarding = () => {
    setOpenOnboarding(true);
    localStorage.setItem('isVideoOnboarding', '1');
  };

  const checkForMediaUrls = lessonStore.lessons
    .map((item) => {
      return item.mediaUrl;
    })
    .some((item) => item !== null);

  const handleMobileCards = () => {
    setIsOpenMobileCards((prev) => !prev);
    videoStore.setPause();
  };

  const handleMobileActivity = () => {
    setIsOpenMobileActivity((prev) => !prev);
    videoStore.setPause();
  };

  const handleClickAddActivityMobile = () => {
    lessonStore.setOpenVideoActivityScreen(!lessonStore.showVideoActivityScreen);
    videoStore.setPause();
  };

  const handleCloseDividerActivityMobile = () => {
    lessonStore.setOpenVideoActivityScreen(!lessonStore.showVideoActivityScreen);
    lessonStore.setVideoInteractiveName(null);
    openEndedGameStore.removeEmptyQuestion();
  };

  const handleBackByActivity = () => {
    lessonStore.setVideoInteractiveName(null);
    openEndedGameStore.removeEmptyQuestion();
  };

  const arrowBackVideoHandler = () => {
    videoStore.foundVideos = true;
    setIsItemForLinkFlag(false);
    setSearchText('');
  };

  const searchReset = () => {
    videoStore.videoSearchReset();
    setSearchText('');
    setActiveTag('All');
    setCurrentPage(1);
    setResultVideos(videosData);
  };

  useEffect(() => {
    settingsStore.listTagsVideos.length !== 0
      ? getAllVideos(settingsStore.listTagsVideos)
      : api.getAllVideosWithInterests().then((resp) => {
          const videosByTag = [];
          for (const listPropertyName in resp) {
            if (prodTags.includes(listPropertyName)) {
              const findCategory = categories.find((f) => f.category === listPropertyName);
              videosByTag.push({
                tag: listPropertyName,
                priority: findCategory ? findCategory.priority : 15,
                videoList: resp[listPropertyName],
              });
            }
          }
          settingsStore.setListTagsVideos(videosByTag);
          const arrayss = [];
          videosByTag.map((m) => {
            return m.videoList.map((l) => arrayss.push(l));
          });
          setVideosData(arrayss.sort(() => Math.random() - 0.5));
          setResultVideos(videosData);
        });
  }, []);

  useEffect(() => {
    const videoLessonIdLS = localStorage.getItem('videoLessonId');
    videoLessonIdLS !== null && lessonStore.getLessonDataLite(+videoLessonIdLS);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    if (activeTag !== 'All') {
      setResultVideos(
        videosData.filter(
          (video) =>
            video.interest === activeTag && sortDataItem(video.duration, sortStore.sortDuration)
        )
      );
    } else {
      setResultVideos(
        videosData.filter((fi) => {
          return sortDataItem(fi.duration, sortStore.sortDuration);
        })
      );
    }
  }, [activeTag, sortStore.sortDuration]);

  useEffect(() => {
    const myContent = document.querySelector('#my-content');
    styleScrollbars(myContent);
    asPath.includes('s=1')
      ? videoStore.setCreateLessonMode(true)
      : videoStore.setCreateLessonMode(false);
  }, [asPath]);

  useEffect(() => {
    const target = document.getElementById('slider-subtitles-wrapper');
    const bodyRect = target?.getBoundingClientRect();

    setModalPosition(bodyRect?.top);
  }, [asPath]);

  useEffect(() => {
    if (QueryOptions(0, asPath)) {
      lessonStore.resetLessonDataAndSentenseWithWordData();
      openEndedGameStore.resetData();
    }
    videoId !== null && lessonStore.setMediaUrl(videoId);
  }, [asPath]);

  useEffect(() => {
    if (!videoStore.foundVideosItems) {
      setIsErrorLink(true);
    } else {
      setIsErrorLink(false);
    }
  }, [videoStore.foundVideosItems]);

  useEffect(() => {
    setPageQTY(Math.ceil(resultVideos?.length / ELEMENT_FOR_PAGE));
  }, [resultVideos]);

  const breadCrumbClasses = (step: number) => {
    if (asPath.includes('s=1') && step === 0) {
      return cn(styles.descriptionBlock, {
        [styles.activeStep]: QueryOptions(step, asPath),
      });
    } else if (asPath.includes('s=2') && step <= 1) {
      return cn(styles.descriptionBlock, {
        [styles.activeStep]: QueryOptions(step, asPath),
      });
    } else {
      return cn(styles.descriptionBlockDefault, {
        [styles.activeStep]: QueryOptions(step, asPath),
      });
    }
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const headerWrapperClasses = cn({
    [styles.videoPageHeader]: QueryOptions(1, asPath),
    [styles.customHeader]: QueryOptions(3, asPath),
  });

  const progressBlockClasses = cn(styles.progressBlock, {
    [styles.progressBlockVideoPage]: QueryOptions(1, asPath),
  });

  const videoGameActivity = {
    true_or_false: 'True or False',
    open_end_question: 'Open ended questions',
    multiple_choice: 'Multiple choice',
  };

  const activityTitle = lessonStore.videoInteractiveName
    ? videoGameActivity[lessonStore.videoInteractiveName]
    : `${t('player.addActivity')} ${secondToHms(videoStore.state.time)}`;

  const checkNoTrueOption = openEndedGameStore.gameData //проверяет есть ли чекбокс на Option в multiple choice
    .filter((f) => f.gameType === 'multiple_choice')
    .some((someElement) => (someElement.answer.correct as string[]).length === 0);
  const checkNoQuestion = openEndedGameStore.gameData.some(
    //проверяет есть ли пустые поля с вопросами
    (someElement) => someElement.question.length === 0
  );

  const saveHandler = (gameType: VideoGameType) => {
    lessonStore.setVariantBox('activity');
    if (checkNoTrueOption || checkNoQuestion) {
      switch (gameType) {
        case 'multiple_choice':
          return setState({
            open: true,
            horizontal: 'center',
            vertical: 'top',
            message: 'Mark the correct answers by ticking them.',
          });
        case 'open_end_question':
          return setState({
            open: true,
            horizontal: 'center',
            vertical: 'top',
            message: 'Enter a question or delete an unnecessary one.',
          });
        case 'true_or_false':
          return setState({
            open: true,
            horizontal: 'center',
            vertical: 'top',
            message: 'Enter a statement or delete an unnecessary one.',
          });
      }
    } else {
      lessonStore.setVideoGameData();
      lessonStore.saveNewLessonToLocal();
      lessonStore.setVideoInteractiveName(null);
      lessonStore.setOpenVideoActivityScreen(false);
      openEndedGameStore.setSaveNotification(true);
    }
  };

  const buttons = [
    {
      onClick: handleMobileCards,
      icon: <MobileCards />,
      count:
        lessonStore.lessonData === null || lessonStore.lessonData.word === undefined
          ? 0
          : lessonStore.lessonData.word.length,
    },
    {
      onClick: handleMobileActivity,
      icon: <QuestionSVG />,
      count: openEndedGameStore.gameData === null ? 0 : openEndedGameStore.gameData.length,
    },
  ];

  useEffect(() => {
    if (!isSmSize) {
      setIsOpenMobileActivity(false);
      setIsOpenMobileCards(false);
    }
  }, [isSmSize]);

  return (
    <>
      <NextSeo
        title={t(`seo.lessonCreation.createVideoLesson.${asPath}.name`)}
        description={t(`seo.lessonCreation.createVideoLesson.${asPath}.description`)}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: t(`seo.lessonCreation.createVideoLesson.${asPath}.keyWords`),
          },
        ]}
      />

      <Layout
        className={QueryOptions(3, asPath) ? styles.customLayout : ''}
        style={mainStore.isMobile && mainStore.showNotification ? { paddingTop: 40 } : null}
        classNameContent={styles.flexLayout}
        classNameHeaderWrapper={headerWrapperClasses}
        mobile={QueryOptions(1, asPath)}
      >
        <MuiDialog isOpen={isOpenMobileCards} handleClose={handleMobileCards} title="Saved terms">
          <WordsList />

          {openEndedGameStore.templateArray.size < 3 && warningCondition && (
            <WarningBox type={'word'} />
          )}
        </MuiDialog>

        <MuiDialog
          isOpen={isOpenMobileActivity}
          handleClose={handleMobileActivity}
          title="Activities"
        >
          <ActivityList
            videoInteractiveName={lessonStore.videoInteractiveName}
            timeCode={videoStore.state.time}
          />

          {openEndedGameStore.templateArray.size < 3 && warningCondition && (
            <WarningBox type={'activity'} />
          )}
        </MuiDialog>

        <MuiDialog
          isOpen={isSmSize && lessonStore.showVideoActivityScreen}
          handleClose={
            lessonStore.videoInteractiveName
              ? handleCloseDividerActivityMobile
              : handleClickAddActivityMobile
          }
          title={activityTitle}
          settingBottomBtn={{ variant: 'outlined' }}
          bottomButons={
            lessonStore.videoInteractiveName ? (
              <Box sx={{ display: 'flex', width: '100%', gap: '24px' }}>
                <Button
                  color="primary"
                  variant="outlined"
                  size="large"
                  sx={{ width: '100%' }}
                  onClick={handleBackByActivity}
                >
                  {t('account.cancel')}
                </Button>

                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  sx={{ width: '100%' }}
                  onClick={() => saveHandler(lessonStore.videoInteractiveName)}
                >
                  {t('account.save')}
                </Button>
              </Box>
            ) : null
          }
        >
          {lessonStore.videoInteractiveName ? (
            <InteractiveGames isMobile={isSmSize} />
          ) : (
            <ChooseActivityList />
          )}
        </MuiDialog>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          sx={{
            top: '100px !important',
            boxShadow: '0px 8px 16px rgba(92, 119, 242, 0.15)',
            backgroundColor: 'var(--L_Red)',
          }}
          autoHideDuration={2000}
          onClose={handleClose}
          key={vertical + horizontal}
          message={message}
        >
          <Alert
            onClose={handleClose}
            severity="error"
            sx={{ width: '100%', backgroundColor: 'var(--L_Red)' }}
          >
            {message}
          </Alert>
        </Snackbar>

        {QueryOptions(1, asPath) && !checkForMediaUrls && checkForVideoOnboarding !== 1 && (
          <VideoLessonOnboarding
            isOpen={!openOnboarding}
            close={closeOnboarding}
            modalPosition={modalPosition}
          />
        )}

        <div className={progressBlockClasses}>
          <div className={styles.progressBarWrapper}>
            <div className={styles.progressBarDescription}>
              <span
                onClick={() =>
                  (asPath.includes('s=1') || asPath.includes('s=2')) && push('/create-video-lesson')
                }
                className={breadCrumbClasses(0)}
              >
                {t('createVideoLesson.chooseVideo')}
              </span>

              <ArrowNext
                className={`${styles.svgArrow} ${QueryOptions(4, asPath) && styles.active}`}
              />

              <span
                onClick={() => asPath.includes('s=2') && push('/create-video-lesson?s=1')}
                className={breadCrumbClasses(1)}
              >
                {t('createVideoLesson.saveTerms')}
              </span>

              <ArrowNext
                className={`${styles.svgArrow} ${QueryOptions(3, asPath) && styles.active}`}
              />

              <span className={breadCrumbClasses(2)}>{t('createVideoLesson.nameCreate')}</span>
            </div>

            <div className={styles.progressBarDescriptionMobile}>
              <Step
                createdBy={'video'}
                nextButtonHandlerClick={nextButtonHandlerClick}
                arrowBackVideoHandler={arrowBackVideoHandler}
                isVideoSearched={videoStore.foundVideos?.items}
              />
              {QueryOptions(1, asPath) && <MobileCountWords itemData={buttons} />}
            </div>

            {QueryOptions(3, asPath) && (
              <div className={styles.buttonWrapper}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    back();
                  }}
                  disabled={isSaveLessonBtn || lessonStore.showVideoActivityScreen === true}
                >
                  {t('createVideoLesson.back')}
                </Button>

                <Button
                  id={QueryOptions(2, asPath) ? 'create' : 'non-id'}
                  variant="contained"
                  onClick={nextButtonHandlerClick}
                  disabled={isSaveLessonBtn || lessonStore.showVideoActivityScreen === true}
                >
                  {QueryOptions(2, asPath) ? (
                    isSaveLessonBtn ? (
                      <>
                        <span>{t('containerEditWords.creating')}</span>
                        <CircularProgress classes={{ root: styles.loader }} />
                      </>
                    ) : (
                      <span>{t('step.create')}</span>
                    )
                  ) : (
                    t('createVideoLesson.next')
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {QueryOptions(0, asPath) && (
          <>
            <div className={styles.videoContent}>
              <div className={styles.searchContainer}>
                <div className={styles.viewDesktop}>
                  <SearchInput
                    value={searchText}
                    placeholder={t('createVideoLesson.placeholderYouTube')}
                    onReset={searchReset}
                    name={'Search'}
                    resetFoundItems={!!videoStore.foundVideos?.items}
                    onChange={(e) => setSearchText(e.target.value)}
                    onSubmit={handleSearchSubmit}
                    icon={'youtube'}
                    isErrorLink={isErrorLink}
                  />
                </div>
                <div className={styles.sortBlock}>
                  {/* TODO: add other fields for sorting */}

                  {/* {videoStore.foundVideos?.items && (
                  <Box sx={{ width: '160px' }}>
                    <FormControl fullWidth>
                      <InputLabel id="created-label">{t('createVideoLesson.sortBy')}</InputLabel>
                      <Select
                        labelId="created-label2"
                        id="duration"
                        label={t('createVideoLesson.sortBy')}
                        onClick={(e) => e.stopPropagation()}
                        value={sortStore.sortSearchOrder}
                        variant="outlined"
                        onChange={handleChangeOrder}
                        name="Sort by"
                      >
                        {sortByOrder.map(({ label, value }, index) => {
                          return (
                            <MenuItem key={index} value={value}>
                              <Typography variant="button1">{t(`sortByOrder.${label}`)}</Typography>
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                )} */}

                  <Box sx={{ width: '160px' }}>
                    <FormControl fullWidth>
                      <InputLabel id="created-label">{t('createVideoLesson.duration')}</InputLabel>
                      <Select
                        labelId="created-label"
                        id="duration"
                        label={t('createVideoLesson.duration')}
                        onClick={(e) => e.stopPropagation()}
                        value={sortStore.sortDuration}
                        variant="outlined"
                        onChange={handleChangeSortDuration}
                        name="Duration"
                      >
                        {sortByDuration.map(({ label, value }, index) => {
                          return (
                            <MenuItem key={index} value={value}>
                              <Typography variant="button1">
                                {t(`sortByDuration.${label}`)}
                              </Typography>
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                </div>
              </div>

              {isItemForLinkFlag && isItemForLink && !videoStore.foundVideosItems && (
                <span className={styles.notSubtitles}>{t('createVideoLesson.autoGenerated')}</span>
              )}

              {isItemForLinkFlag && isItemForLink && !videoStore.foundVideosItems && (
                <NotLinkSearch />
              )}

              {isItemForLinkFlag && !isItemForLink && !videoStore.foundVideosItems && (
                <div>
                  <h2 className={styles.nothingFound}>{t('createVideoLesson.notFound')}</h2>
                  <h3 className={styles.tryDiff}>{t('createVideoLesson.tryAnother')}</h3>
                </div>
              )}

              {!videoStore.foundVideos?.items && (
                <ScrollMenu
                  wrapperClassName={styles.wrapperScrollBlock}
                  scrollContainerClassName={styles.tagScrollerBlock}
                  LeftArrow={LeftArrow}
                  RightArrow={RightArrow}
                >
                  {categories.map(({ category, name }, i) => {
                    return (
                      <Chip
                        label={t(`videoCategories.${Object.keys(name)}`)}
                        id={category}
                        className={`${styles.tagBlock} 
                ${activeTag === category ? styles.active : {}}`}
                        key={i}
                        onClick={() => {
                          setActiveTag(category);
                        }}
                      />
                    );
                  })}
                </ScrollMenu>
              )}

              <div className={styles.content}>
                {resultVideos &&
                  resultVideos.slice(firstIndexItem, lastIndexItem).map((item) => {
                    return (
                      <ListingPageComponent
                        key={item.serviceId}
                        duration={item.duration}
                        title={item.title}
                        thumbnailsURL={item.thumbnails?.high?.url}
                        listingClickHandler={() => listingClickHandler(item.serviceId)}
                      />
                    );
                  })}
              </div>
              <Pagination
                page={currentPage}
                count={pageQTY}
                color="primary"
                boundaryCount={1}
                shape="rounded"
                onChange={handleChangePagination}
                className={styles.pagination}
              />
            </div>
          </>
        )}
        {QueryOptions(1, asPath) && (
          <div className={styles.videoWrapperBox}>
            <Video id={videoId} withSubtitles warningCondition={warningCondition} />
          </div>
        )}

        {QueryOptions(2, asPath) && (
          <ContainerEditWords
            isLevelChosen={isLevelChosen}
            isEdit={false}
            saveLesson={nextButtonHandlerClick}
            isHideSaveBtn={false}
            isVideoLesson={true}
            isLoadingBtn={isSaveLessonBtn}
            checkValidate={checkValidate}
            refContainer={refContainer}
            refCard={refCard}
          />
        )}
      </Layout>
    </>
  );
};

export async function getStaticProps() {
  return {
    props: {
      protected: true,
    },
  };
}

export default observer(CreateVideoLesson);
