import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import classNames from 'classnames';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// import NextImg from '~/assets/icons/home_page/next.svg';
// import PrevImg from '~/assets/icons/home_page/prev.svg';
// import st from '../main-slider/main-slider.module.scss';
import styles from './recomended-video-panel.module.scss';

import { recommendedVideosStore, videoStore } from '~/stores';

SwiperCore.use([Navigation]);

const videosCountInRecomended = 6;

const RecomendedVideoItem = (
  video,
  router,
  setVideoId,
  setTranslationSubtitles,
  loader,
  setLoader
) => {
  const { withSubtitles, query } = router.query;

  const videoElem = (video) => {
    return (
      <div key={video.id} className={styles['recomendedPanel_video']}>
        <img
          onClick={!loader && videoClickHandler}
          className={styles['recomendedPanel_video']}
          src={video?.img?.medium?.url || video?.thumbnails?.medium?.url}
          alt="recomended video"
        />
      </div>
    );
  };

  const width = window.innerWidth;

  const videoClickHandler = () => {
    setTranslationSubtitles([]);
    router.push(
      `video?id=${video.id}${withSubtitles ? '&withSubtitles=' + withSubtitles : ''}&query=${query}`
    );
    setVideoId(video.id);
    setLoader(true);
    videoStore.setTime(0);
    videoStore.setInfo({ title: video.title });
  };

  return <>{width < 960 ? <SwiperSlide>{videoElem(video)}</SwiperSlide> : videoElem(video)}</>;
};

const RecomendedVideoPanel = (props: { setTranslationSubtitles: any }) => {
  const { setTranslationSubtitles } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = router.query;
  const [videos, setVideos] = useState([]);
  const [videoId, setVideoId] = useState(id);
  const [loader, setLoader] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const [start, setStart] = useState<boolean>(true);
  const [end, setEnd] = useState<boolean>(false);
  const width = window.innerWidth;
  const checkPosition = (start, end) => {
    setEnd(end);
    setStart(start);
  };
  const nextButtonClasses = classNames(styles.height, {
    // [st.disabled]: end,
  });
  const prevButtonClasses = classNames(styles.height, {
    // [st.disabled]: start,
  });
  useEffect(() => {
    if (loader) {
      setTimeout(() => setLoader(false), 2000);
    }
  }, [loader]);

  useEffect(() => {
    const res = toJS(recommendedVideosStore.videos);
    const recomendedVideos = res
      .map((video) =>
        RecomendedVideoItem(video, router, setVideoId, setTranslationSubtitles, loader, setLoader)
      )
      .filter((video) => video.key !== videoId)
      .slice(0, videosCountInRecomended);
    if (recomendedVideos.length >= videosCountInRecomended) {
      setVideos(recomendedVideos);
    }
  }, [recommendedVideosStore.videos, videoId, loader]);

  return (
    <>
      <div className={styles.recomendedPanel_title}>{t('video.moreVideos')}</div>
      <div className={styles.recomendedPanel}>
        {width < 960 ? (
          <Swiper
            style={{ height: 'fit-content' }}
            // navigation={{
            //   nextEl: st.own_button_next,
            //   prevEl: st.own_button_prev,
            // }}
            breakpoints={{
              482: {
                slidesPerView: 2.6,
                spaceBetween: 0,
              },
              650: {
                slidesPerView: 3.2,
                spaceBetween: 0,
              },
              800: {
                slidesPerView: 4.2,
                spaceBetween: 0,
              },
            }}
            onSwiper={(swiper) => {
              setSwiper(swiper);
            }}
            onSlideChange={(swiper) => {
              if (swiper) {
                checkPosition(swiper.isBeginning, swiper.isEnd);
              }
            }}
          >
            <button
              className={prevButtonClasses}
              onClick={(e) => {
                swiper ? swiper.navigation.onPrevClick(e) : null;
                checkPosition(swiper.isBeginning, swiper.isEnd);
              }}
            >
              <ArrowCircleLeftOutlinedIcon />
            </button>
            <button
              className={nextButtonClasses}
              onClick={(e) => {
                swiper ? swiper.navigation.onNextClick(e) : null;
                checkPosition(swiper.isBeginning, swiper.isEnd);
              }}
            >
              <ArrowCircleRightOutlinedIcon />
            </button>
            {videos}
          </Swiper>
        ) : (
          videos
        )}
      </div>
    </>
  );
};

export default observer(RecomendedVideoPanel);
