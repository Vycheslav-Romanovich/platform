/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player/youtube';
import CloseIcon from '@mui/icons-material/Close';
import { Button, useMediaQuery } from '@mui/material';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import screenfull from 'screenfull';

import OpenPlayerListIcon from '~/assets/icons/openPlayerListIcon.svg';
import PlayIcon from '~/assets/icons/video_controls/playOverVideo.svg';

import { InteractiveGames } from '../interactiveGame';
import Subtitles from '../subtitles';
import { ChooseActivityList } from './features/ChooseActivityList/ChooseActivityList';
import VideoControls from './videoControls';
import { ViewActivity } from './viewActivity';

import styles from './player.module.scss';

import api from '~/api_client/api';
import FinishExercise from '~/components/finishExercise';
import FullScreenControlPanel from '~/components/player/videoControls/fullScreenControlPanel/fullScreenControlPanel';
import { TermsAndActivitiesList } from '~/components/video/termsAndActivitiesList/termsAndActivitiesList';
import { YOUTUBE_URL } from '~/constants/links';
import { QueryOptions } from '~/constants/video-lesson-steps';
import { secondToHms } from '~/helpers/secondToHm';
import { sendEvent } from '~/helpers/sendToGtm';
import useTimeSync from '~/helpers/useTimeSync';
import videoHotkeys from '~/helpers/videoHotkeys';
import {
  latestVideosStore,
  lessonStore,
  mainStore,
  openEndedGameStore,
  recommendedVideosStore,
  subtitlesStore,
  userStore,
  videoStore,
} from '~/stores';
import BackDrop from '~/UI/backdrop';

export default observer(function Player(props: {
  interval?: Array<number>;
  games?: boolean;
  handleArrowBackClick?: () => void;
  togglePlayCont?: boolean;
  id: string | null;
  withSubtitles: boolean;
  modal?: boolean;
  wordBan?: boolean;
  warningCondition?: boolean;
  noActivity?: boolean;
}) {
  const isXsSize = useMediaQuery('(max-width:440px)');
  const isSmSize = useMediaQuery('(max-width:639px)');
  const [subtitlesLoading, setSubtitlesLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showTermsList, setShowTermsList] = useState<boolean>(false);
  const [timeLasting, setTimeLasting] = useState<number[] | null>(null);
  const playerCallback = useCallback((node) => {
    videoStore.setPlayerRef(node);
  }, []);
  const [translationSubtitles, setTranslationSubtitles] = useState<
    { translation: string; isTouched: boolean }[]
  >([]);
  const router = useRouter();
  const { t } = useTranslation();
  const time = Number(router.query.time);
  const descriptionClasses = cn(styles.descriptionBlock, {
    [styles.descriptionBlockOpen]: showTermsList,
  });
  useTimeSync();

  useEffect(() => {
    if (props.interval) {
      videoStore.setTime(props.interval[0]);
    } else {
      videoStore.setTime(0);
    }
  }, [props.interval]);

  const convertListItems = (items) =>
    items.map((item) => {
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        duration: item.duration,
        img: item.snippet.thumbnails,
        color: null,
      };
    });

  useEffect(() => {
    router.query.Start
      ? (setTimeLasting([+router.query.Start, +router.query.Stop]),
        videoStore.setShortVideo(true),
        videoStore.setShortStart(+router.query.Start))
      : setTimeLasting(null);
    if (time) {
      videoStore.setTime(time);
    }
    if (latestVideosStore.latestVideoId === props.id) {
      videoStore.setTime(latestVideosStore.latestVideoTime);
    }

    return () => {
      const time = Math.round(videoStore.state.time);
      const latestVideoId = Array.isArray(props.id) ? props.id.join() : props.id;
      latestVideosStore.setLatestVideoId(latestVideoId);
      latestVideosStore.setLatestVideoTime(time);
      latestVideosStore.setEpisodeEndTime(null);
    };
  }, []);

  // get recommended videos by user click
  useEffect(() => {
    api
      .searchVideosByInterest(1)
      .then((resp) => {
        const videos = convertListItems(resp.items);
        recommendedVideosStore.set(videos);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const setCreateMode = () => {
    videoStore.setPause();
    setOpenModal(true);
  };

  const [createActivityDisabled, setCreateActivityDisabled] = useState<boolean>(false);

  useEffect(() => {
    const checkedTime = lessonStore.lessonData?.videoGame?.some((someElement) => {
      return someElement.timeCode === Math.round(videoStore.state.time);
    });
    openEndedGameStore.gameData.some((someElement) => {
      return (
        someElement.timeCode + 4 > Math.round(videoStore.state.time) &&
        someElement.timeCode - 3 < Math.round(videoStore.state.time)
      );
    })
      ? setCreateActivityDisabled(true)
      : setCreateActivityDisabled(false);
    Math.round(videoStore.state.time) === 0 && setCreateActivityDisabled(true);
    !videoStore.state.isPause && lessonStore.setOpenVideoActivityScreen(false);
    if (checkedTime) {
      !videoStore.state.createLessonMode && !props.noActivity && setCreateMode();
    }
  }, [videoStore.state.time, props.noActivity, lessonStore.showVideoActivityScreen]);

  useEffect(() => {
    const time = videoStore.state.time;
    const { episodeEndTime } = latestVideosStore;
    if (episodeEndTime && time > episodeEndTime) {
      videoStore.setPause(true);
      latestVideosStore.setEpisodeEndTime(null);
    }
  }, [videoStore.state.time]);

  useEffect(() => {
    subtitlesStore.setFastSubtitleReady(false);
    videoHotkeys.add();
    return () => {
      videoHotkeys.remove();
      videoStore.reset();
    };
  }, []);

  useEffect(() => {
    if (props.id && typeof props.id === 'string') {
      setSubtitlesLoading(true);
      subtitlesStore.setTranslateSubtitle(null);

      if (props.withSubtitles) {
        api
          .newLibralySubtitles(props.id)
          .then(subtitlesStore.setSubtitles)
          .then(() => {
            const curLangSubtitles = subtitlesStore.subtitles.find(
              (subtitles) => subtitles.lang.indexOf(userStore.user?.from || 'en') !== -1
            );
            const curLangTranslate = subtitlesStore.subtitles.find(
              (e) => e.lang.indexOf(userStore.user?.to || 'ru') !== -1
            );

            if (curLangTranslate) {
              subtitlesStore.setTranslateSubtitle(curLangTranslate);
            } else {
              const halfSubs = Math.floor(curLangSubtitles.subtitles.length / 2);
              api.newLibralySubTranslate(props.id, 0, halfSubs).then((resp) => {
                subtitlesStore.addSubtitles(resp);
                subtitlesStore.setTranslateSubtitle(resp);
              });
            }

            subtitlesStore.setFastSubtitleReady(true);
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            setSubtitlesLoading(false);
          });
      } else {
        api
          .subtitles(props.id)
          .then(subtitlesStore.setSubtitles)
          .then((subtitlesResp) => {
            const curLangSubtitles = subtitlesResp.find(
              (e) => e.lang.indexOf(userStore.user?.from || 'en') !== -1
            );
            if (curLangSubtitles) {
              subtitlesStore.setCurrentSubtitlesId(curLangSubtitles.id);
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            setSubtitlesLoading(false);
          });
      }
    }
    return () => {
      subtitlesStore.clear();
      lessonStore.setOpenVideoActivityScreen(false);
    };
  }, []);

  useEffect(() => {
    const curLangSubtitles = subtitlesStore.subtitles.find(
      (subtitles) =>
        subtitles.lang.indexOf(userStore.user?.from ? userStore.user?.from : 'en') !== -1
    );
    if (
      subtitlesStore.currentSubtitleId &&
      subtitlesStore.translateSubtitle &&
      subtitlesStore.currentSubtitleId > Math.floor(curLangSubtitles.subtitles.length / 2 - 5)
    ) {
      const halfSubs = Math.floor(curLangSubtitles.subtitles.length / 2);

      if (!subtitlesStore.translateSubtitle.subtitles[halfSubs]) {
        api
          .newLibralySubTranslate(props.id, halfSubs, curLangSubtitles.subtitles.length)
          .then((resp) => {
            subtitlesStore.pushTranslateSubtitlePack(resp.subtitles);
          });
      }
    }
  }, [subtitlesStore.currentSubtitleId]);

  useEffect(() => {
    const urls = new URL(window.location.href);
    urls.searchParams.delete('newLesson');
    const title = videoStore.info.title;
    lessonStore.setCurrentLesson({
      url: videoStore.info.url,
      mediaUrl: YOUTUBE_URL + props.id,
      name: title,
    });
  }, [videoStore.info.title]);

  //VVVVVV full screen logic starts here

  const [trigger, setTrigger] = useState(false);
  const [showFSControlPanel, setShowFSControlPanel] = useState(false);
  const [isPlatformIos, setIsPlatformIos] = useState<boolean>();
  const fullScreenRef = useRef(null);
  const controlsRef = useRef(null);
  let timer;

  const toggleFullScreen = () => {
    screenfull.toggle(fullScreenRef.current);
  };

  const closeCreateVideoActivityScreen = () => {
    lessonStore.setOpenVideoActivityScreen(!lessonStore.showVideoActivityScreen);
    lessonStore.setVideoInteractiveName(null);
    openEndedGameStore.removeEmptyQuestion();
  };

  const handleClickOpenDialogActivity = () => {
    if (videoStore.state.loaded > 0) {
      sendEvent('add_activity');
      videoStore.setPause(true);
      lessonStore.setOpenVideoActivityScreen(true);
    }
  };

  const handleMouseMove = () => {
    clearTimeout(timer);
    controlsRef.current.style.visibility = 'visible';
    setShowFSControlPanel(true);
    setTrigger(!trigger);
  };

  useEffect(() => {
    setIsPlatformIos(
      ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
        navigator.platform
      )
    );
    if (screenfull.onchange) {
      screenfull.onchange(() => {
        videoStore.setIsScreenFull();
      });
    }
  }, []);

  useEffect(() => {
    timer = setTimeout(() => {
      if (videoStore.state.isPause || !videoStore.isFullScreen) {
        return;
      }
      controlsRef.current.style.visibility = 'hidden';
      setShowFSControlPanel(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [trigger]);

  const activityWrapperContainer = cn(styles.activityWrapper, {
    [styles.fullScreenActivityWrapper]: videoStore.isFullScreen,
  });

  const fullscreenBackdrop = cn(styles.fullscreenBackdrop, {
    [styles.displayNone]: !videoStore.isFullScreen,
  });

  const closeBackdrop = () => {
    lessonStore.setVideoInteractiveName(null);
    lessonStore.setOpenVideoActivityScreen(false);
    openEndedGameStore.removeEmptyQuestion();
  };

  const lengthStatisticArray = lessonStore?.statisticLessonData?.filter(
    (f) => f.userAnswer !== null
  ).length;

  const statisticSum =
    lessonStore?.statisticLessonData.reduce(
      (add, acc) => add + (typeof acc.statisticArray === 'number' ? acc.statisticArray : 0),
      0
    ) / lessonStore.statisticLessonData.length;

  const playerStyle = cn(styles.player, {
    [styles.playerInVideoPage]: QueryOptions(1, router.asPath),
    [styles.playerInEditPage]: router.asPath.includes('edit'),
    [styles.modalPlayer]: props.modal,
  });

  const containerClasses = cn(styles.intGameContainer, {
    [styles.intGameContainerFullScreen]: videoStore.isFullScreen,
  });

  return (
    <>
      <div
        id="full-screen-tooltips-container"
        ref={fullScreenRef}
        className={playerStyle}
        onMouseMove={openModal ? null : handleMouseMove}
        style={!showFSControlPanel && !openModal ? { cursor: 'none' } : null}
      >
        <div onClick={videoStore.togglePause} className={styles.playerWrapper} id="player">
          {lessonStore.showVideoActivityScreen && videoStore.isFullScreen && (
            <div className={fullscreenBackdrop} onClick={closeBackdrop} />
          )}

          {videoStore.state.createLessonMode &&
          videoStore.state.isPause &&
          lessonStore.showVideoActivityScreen &&
          !isSmSize ? (
            <div
              className={activityWrapperContainer}
              onClick={(e) => lessonStore.showVideoActivityScreen && e.stopPropagation()}
            >
              {lessonStore.videoInteractiveName ? (
                <div className={containerClasses}>
                  <InteractiveGames isMobile={isSmSize} />
                </div>
              ) : (
                <div onClick={(e) => e.stopPropagation()} className={styles.videoInteractiveScreen}>
                  <div className={styles.relativeBlock}>
                    <ChooseActivityList />
                  </div>
                </div>
              )}

              <CloseIcon
                onClick={closeCreateVideoActivityScreen}
                sx={{ position: 'absolute', right: '20px', top: '20px', zIndex: 1000 }}
              />
            </div>
          ) : null}

          <ReactPlayer
            url={YOUTUBE_URL + props.id}
            ref={playerCallback}
            className={`${styles.reactPlayer} ${
              mainStore.isInAppInstagram ? '' : styles.block_content
            }`}
            width="100%"
            height="100%"
            playing={!videoStore.state.isPause}
            volume={videoStore.state.volume}
            muted={videoStore.state.muted}
            playbackRate={videoStore.state.speed}
            progressInterval={videoStore.progressInterval}
            onProgress={(e) => {
              if (!videoStore.state.seeking) {
                if (props.interval) {
                  if (e.playedSeconds > props.interval[1]) {
                    videoStore.setPause();
                    videoStore.setTime(props.interval[0]);
                  }
                }
                videoStore.setProgress(+e.playedSeconds.toFixed(3), +e.loadedSeconds.toFixed(3));
              }
            }}
            onStart={() => {
              if (props.interval) {
                videoStore.setTime(props.interval[0]);
              }
            }}
            onDuration={(e) => videoStore.setDuration(e)}
            onReady={(e) => {
              videoStore.setIsReady(true);
              videoStore.setPause(false);
              try {
                // @ts-ignore
                const title = e.player.player.player.getVideoData().title;
                const url = e.props.id + '';
                videoStore.setInfo({
                  title: title || videoStore.info.title,
                  url,
                });
                if (router.pathname === '/lessons/[lessonId]/edit') {
                  lessonStore.setLessonName(lessonStore.lessonData.name);
                } else {
                  lessonStore.setLessonName(title);
                }
              } catch (err) {
                console.error(err);
              }
            }}
            onPlay={() => {
              videoStore.setPause(false);
            }}
            onPause={() => {
              videoStore.setPause();
            }}
            config={{
              //@ts-ignore
              youtube: {
                playerVars: {
                  showinfo: 0,
                  cc_load_policy: 0,
                  iv_load_policy: 3,
                  controls: 0,
                  modestbranding: 1,
                  rel: 0,
                },
              },
            }}
          />
          {openModal && !props.noActivity && (
            <>
              <BackDrop
                zIndex={99}
                backdropClass={styles.backDropClasses}
                onClick={() => {
                  setOpenModal(false);
                }}
              />
              <ViewActivity
                setOpenModal={setOpenModal}
                timeCode={Math.round(videoStore.state.time)}
              />
            </>
          )}
          {!props.noActivity &&
            videoStore.state.openEndModal &&
            !videoStore.state.createLessonMode && (
              <FinishExercise
                allExercise={lessonStore.statisticLessonData.length}
                doneExercise={lengthStatisticArray}
                donePercent={statisticSum}
                title={t('player.titleVideoExercise')}
                congratulationTitle={t('player.congratulationTitleVideo')}
              />
            )}
          {videoStore.isFullScreen && (
            <div
              className={styles.listWrapper}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div
                className={styles.listIcon}
                onClick={() => {
                  setShowTermsList((prevState) => !prevState);
                }}
              >
                <OpenPlayerListIcon />
              </div>
              <div className={descriptionClasses}>
                <TermsAndActivitiesList warningCondition={props.warningCondition} />
              </div>
            </div>
          )}
          <PlayIcon
            className={`${styles.pause} ${
              videoStore.state.isPause && !videoStore.state.seeking ? styles.show : ''
            }`}
          />

          <div
            className={`${styles.recomendedPanelWrapper} ${
              videoStore.state.isPause && !videoStore.state.seeking ? styles.show : ''
            }`}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </div>
        </div>

        {/* desktop Subs */}
        {!isXsSize && (
          <div
            className={styles.subtitles}
            onMouseDown={() => videoStore.setPause(true)}
            onTouchStart={() => videoStore.setPause(true)}
          >
            {!props.togglePlayCont && (
              <Subtitles
                wordBan={props.wordBan}
                loading={subtitlesLoading}
                translationSubtitles={translationSubtitles}
                setTranslationSubtitles={setTranslationSubtitles}
              />
            )}
          </div>
        )}

        <div
          ref={controlsRef}
          className={props.togglePlayCont ? styles.controlsInGames : styles.controls}
        >
          {props.togglePlayCont ? null : (
            <VideoControls
              toggleFullScreen={toggleFullScreen}
              games={props.games}
              isPlatformIos={isPlatformIos}
            />
          )}
          {videoStore.state.createLessonMode && (
            <Button
              onClick={handleClickOpenDialogActivity}
              className={styles.addActivityButton}
              variant={'contained'}
              disabled={createActivityDisabled}
            >
              {t('player.addActivity')} {secondToHms(videoStore.state.time)}
            </Button>
          )}
        </div>

        {showFSControlPanel && videoStore.isFullScreen && <FullScreenControlPanel />}

        {/* mobile Subs */}
        {isXsSize && (
          <div
            onMouseDown={() => videoStore.setPause(true)}
            onTouchStart={() => videoStore.setPause(true)}
          >
            <Subtitles
              wordBan={props.wordBan}
              loading={subtitlesLoading}
              translationSubtitles={translationSubtitles}
              setTranslationSubtitles={setTranslationSubtitles}
            />
          </div>
        )}
      </div>
    </>
  );
});
