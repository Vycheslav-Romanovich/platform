import React, { useRef, useState } from 'react';
import { Avatar, Box, Button, Typography, useMediaQuery } from '@mui/material';
import cn from 'classnames';
import Image from 'next/image';

import anastasia from '~/assets/content/reviews/anastasia.png';
import bella from '~/assets/content/reviews/bella.png';
import dean from '~/assets/content/reviews/dean.png';
import ishaan from '~/assets/content/reviews/ishaan.png';
import levente from '~/assets/content/reviews/levente.png';
import sarah from '~/assets/content/reviews/sarah.png';
import endBannerDesk from '~/assets/icons/landing/endBannerDesk.png';
import endBannerMobile from '~/assets/icons/landing/endBannerMobile.png';
import endBannerTablet from '~/assets/icons/landing/endBannerTablet.png';
import howHelp1 from '~/assets/icons/landing/howHelp1.png';
import howHelp2 from '~/assets/icons/landing/howHelp2.png';
import howHelp3 from '~/assets/icons/landing/howHelp3.png';
import AddCard from '~/assets/icons/landing/illustartionAddCard.svg';
import PlayButton from '~/assets/icons/landing/playButton.svg';

import { TrackStudentProgress } from './TrackStudentProgress';

import styles from './index.module.scss';

import { CustomHandle } from '~/components/landing/customHandle';
import { OpenListFAQ } from '~/components/landing/FAQBlock';
import { HowHelpsBlock } from '~/components/landing/helpBlock';
import { gameBlock } from '~/constants/FAQLanding';
import { sendEvent } from '~/helpers/sendToGtm';
import { ChoosePlan } from '~/widget/ChoosePlan';

export const Landing = () => {
  const videoRef = useRef(null);
  const [pause, setPause] = useState<boolean>(true);
  const handleVideoButton = () => {
    setPause((prevState) => !prevState);
  };
  const handleVideoPlay = () => {
    videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
  };

  const buttonClasses = cn(styles.playVideoButton, {
    [styles.hideVideoButton]: !pause,
  });

  const isXsSize = useMediaQuery('(max-width: 440px)');
  const isMdSize = useMediaQuery('(max-width:767px)');
  const isLgSize = useMediaQuery('(max-width: 1023px)');

  const handleClickGoToLibrary = () => {
    sendEvent('try_now');
  };

  const handleClickGetStarted = () => {
    sendEvent('get_started_click');
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.teach}>
        <div className={styles.gradientBg} />
        <div className={styles.info}>
          <Typography
            variant={'h1'}
            color={'var(--White)'}
            sx={{ textAlign: 'center', maxWidth: '880px' }}
          >
            Ultimate English lessons preparation
          </Typography>

          <Typography
            variant={'text1'}
            component={'p'}
            color={'var(--White)'}
            sx={{ textAlign: 'center', maxWidth: '537px', paddingTop: '16px' }}
          >
            eLang is a flexible platform to support English teachers. Create vocabulary and video
            lessons in minutes, not in hours.
          </Typography>

          <Button
            variant="contained"
            size="large"
            className={styles.primaryBtn}
            href="/signup"
            sx={{ zIndex: 1, padding: '0 16px' }}
            onClick={handleClickGetStarted}
          >
            <Typography
              variant={'h5'}
              component={'span'}
              color="var(--Black)"
              sx={{ textAlign: 'center' }}
            >
              Get started 🚀
            </Typography>
          </Button>
        </div>
        <CustomHandle />
      </section>

      <section className={styles.howHelps}>
        <Typography
          variant={'h2'}
          color={'var(--Black)'}
          sx={{ textAlign: 'center', maxWidth: '597' }}
        >
          How eLang helps ESL teachers
        </Typography>
        <div className={styles.helpBlockWrapper}>
          <HowHelpsBlock
            image={howHelp1}
            title={'Ready-made lessons'}
            subtitle={'You can find the best ready-made lessons in the Library'}
          />
          <HowHelpsBlock
            image={howHelp2}
            title={'Activities in videos'}
            subtitle={
              'Open-ended, multiple choice and true-or-false questions right inside the video'
            }
          />
          <HowHelpsBlock
            image={howHelp3}
            title={'Auto-generated exercises'}
            subtitle={'Create lessons in 3 quick easy steps with auto-generated exercises'}
          />
        </div>
      </section>

      <TrackStudentProgress showButtonCreateLesson />

      <section className={styles.startLessons}>
        <Typography variant={'h2'} sx={{ maxWidth: '572px', textAlign: 'center' }}>
          Convenient and free lesson management
        </Typography>
        <Typography
          variant={'body1'}
          component={'p'}
          sx={{ maxWidth: '473px', marginTop: '16px', textAlign: 'center' }}
        >
          Save your time and money with dozens of prebuilt templates. Access public library of
          exercises
        </Typography>
        <div className={styles.list}>
          <div className={styles.listLeft}>
            <div className={styles.listBlack}>
              <p className={styles.listTitle}>
                Use a video to <br /> create a lesson
              </p>
              <p className={styles.listText}>
                Select and save terms from <br /> subtitles while watching a video.
              </p>
            </div>
            <div className={styles.listBlueNone}>
              <p className={styles.listTitle}>
                Сreate your own <br /> word sets
              </p>
              <p className={styles.listText}>
                Type words and their translations <br /> when preparing a lesson.
              </p>
            </div>
            <div className={styles.listGrey}>
              <p className={styles.listTitle}>
                Share lessons <br /> with others
              </p>
              <p className={styles.listText}>
                Сopy the link after you create <br /> a lesson to send to others.
              </p>
            </div>
          </div>
          <div className={styles.listRight}>
            <div className={styles.listBlue}>
              <p className={styles.listTitle}>
                Сreate your own <br /> word sets
              </p>
              <p className={styles.listText}>
                Type words and their translations <br /> when preparing a lesson.
              </p>
              <AddCard />
            </div>

            <div className={styles.listGreyNone}>
              <p className={styles.listTitle}>
                Share lessons <br /> with others
              </p>
              <p className={styles.listText}>
                Сopy the link after you create <br /> a lesson to send to others.
              </p>
            </div>
            <div className={styles.listBorder}>
              <p>
                Adjust learning English <br /> to the interests of students
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.library}>
        <div className={styles.gradientBg} />

        <div className={styles.descriptionBlock}>
          <Typography maxWidth={{ md: '100%', lg: '450px' }} variant={'h2'} color={'var(--White)'}>
            Library of lessons with videos and games
          </Typography>

          <Typography
            maxWidth={{ md: '90%', lg: '370px' }}
            marginTop={'16px'}
            variant={'body2'}
            color={'var(--White)'}
          >
            Language learning requires constant practice. That is why we provide a whole library of
            topics and exercises to train.
          </Typography>

          <Button
            color="dark"
            variant="contained"
            id={'try_now'}
            size="large"
            className={styles.primaryBtn}
            href="/library"
            sx={{ zIndex: 1, padding: '0 16px' }}
            onClick={handleClickGoToLibrary}
          >
            <Typography
              variant={'h5'}
              component={'span'}
              color="var(--Black)"
              sx={{ textAlign: 'center' }}
            >
              Go to Library
            </Typography>
          </Button>
        </div>

        {!isLgSize ? (
          <Image
            className={styles.libraryPic}
            src="/images/landingPictures/libraryPagePic.png"
            alt="picture library games page"
            width={678}
            height={457}
          />
        ) : (
          <Image
            className={styles.libraryPicTablet}
            src="/images/landingPictures/libraryPagePicTablet.png"
            alt="picture library games page"
            width={411}
            height={421}
          />
        )}
      </section>

      <section className={styles.FAQBlock}>
        <Typography variant={'h2'} textAlign={'center'}>
          Frequently asked questions
        </Typography>
        {gameBlock.map((FAQElement, index) => {
          return (
            <OpenListFAQ
              key={index}
              title={FAQElement.question}
              descriptionText={FAQElement.answer}
              numberQuestion={index + 1}
            />
          );
        })}
      </section>

      <section className={styles.howItWorks}>
        <Typography variant={'h2'}>How it works</Typography>
        <Typography variant={'text1'} component={'p'} sx={{ marginTop: { xs: '8px', md: '16px' } }}>
          Watch a 3-minute demo
        </Typography>

        <div className={styles.iframe}>
          <video
            ref={videoRef}
            style={{ width: '100%', borderRadius: '16px' }}
            src="videoLanding.mp4"
            onPlay={handleVideoButton}
            onPause={handleVideoButton}
            controls
          >
            Your browser does not support the video tag.
          </video>
          <button className={buttonClasses} onClick={handleVideoPlay}>
            <PlayButton />
          </button>
        </div>
      </section>

      <section className={styles.reviewsBlock}>
        <Typography variant={'h2'} sx={{ textAlign: 'center' }}>
          Loved by people
        </Typography>
        <div className={styles.reviews}>
          <div className={styles.block1Wrapper}>
            <div className={styles.block1}>
              <div className={styles.avatarBlock}>
                <div>
                  <Avatar alt="Levente avatar" src={levente.src} sx={{ width: 56, height: 56 }} />
                </div>
                <Typography variant={'h4'} component={'p'}>
                  Levente
                </Typography>
                <Typography variant={'body1'} component={'p'}>
                  English Teacher
                </Typography>
              </div>
              <Typography variant={'body1'} component={'p'} maxWidth={'328px'}>
                eLang is definitely a good platform for lesson preparation. I needed such an app
                with different exercises for students. Thanks to eLang team!
              </Typography>
            </div>
            <div className={styles.block1}>
              <div className={styles.avatarBlock}>
                <div>
                  <Avatar alt="Bella avatar" src={bella.src} sx={{ width: 56, heigth: 56 }} />
                </div>
                <Typography variant={'h4'} component={'p'}>
                  Bella
                </Typography>
                <Typography variant={'body1'} component={'p'}>
                  English Teacher
                </Typography>
              </div>
              <Typography variant={'body1'} component={'p'} maxWidth={'328px'}>
                One of my students came across this platform and offered me to try, because I am
                fond of videos with subtitles. So far, this is the only service where I can create
                exercises with videos - I like it a lot!
              </Typography>
            </div>
          </div>
          <div className={styles.block1Wrapper}>
            <div className={styles.block1}>
              <div className={styles.avatarBlock}>
                <div>
                  <Avatar
                    alt="Anastasia avatar"
                    src={anastasia.src}
                    sx={{ width: 56, heigth: 56 }}
                  />
                </div>
                <Typography variant={'h4'} component={'p'}>
                  Anastasia
                </Typography>
                <Typography variant={'body1'} component={'p'}>
                  English Learner
                </Typography>
              </div>
              <Typography variant={'body1'} component={'p'} maxWidth={'328px'}>
                Finally I found a service that offers a LOT of videos with interactive subtitles and
                word games to train. Especially, I like how it works on mobile.
              </Typography>
            </div>
            <div className={styles.block1}>
              <div className={styles.avatarBlock}>
                <div>
                  <Avatar alt="Ishaan avatar" src={ishaan.src} sx={{ width: 56, heigth: 56 }} />
                </div>
                <Typography variant={'h4'} component={'p'}>
                  Ishaan
                </Typography>
                <Typography variant={'body1'} component={'p'}>
                  English Learner
                </Typography>
              </div>
              <Typography variant={'body1'} component={'p'} maxWidth={'328px'}>
                It is 1 year as I study English. And I found eLang. It has so many games to play and
                videos to watch. I like it very much! It helps me remember new words very good.
              </Typography>
            </div>
          </div>
          <div className={styles.block1Wrapper}>
            <div className={styles.block1}>
              <div className={styles.avatarBlock}>
                <div>
                  <Avatar alt="Sarah avatar" src={sarah.src} sx={{ width: 56, heigth: 56 }} />
                </div>
                <Typography variant={'h4'} component={'p'}>
                  Sarah
                </Typography>
                <Typography variant={'body1'} component={'p'}>
                  Community Tutor
                </Typography>
              </div>
              <Typography variant={'body1'} component={'p'} maxWidth={'328px'}>
                eLang is great for hometasks and remote students. I&apos;m really waiting for a
                table with students&apos; progress :)
              </Typography>
            </div>
            <div className={styles.block1}>
              <div className={styles.avatarBlock}>
                <div>
                  <Avatar alt="Dean avatar" src={dean.src} sx={{ width: 56, heigth: 56 }} />
                </div>
                <Typography variant={'h4'} component={'p'}>
                  Dean
                </Typography>
                <Typography variant={'body1'} component={'p'}>
                  ESL Teacher
                </Typography>
              </div>
              <Typography variant={'body1'} component={'p'} maxWidth={'328px'}>
                I would call eLang a versatile assistant in English teaching. I personally adopted
                it for hometasks and ice-breakers. The platform serves me really well and I am
                looking forward to testing some features I recommended to the support team.
              </Typography>
            </div>
          </div>
        </div>
      </section>

      <Box
        sx={{
          mt: '120px',
          backgroundColor: 'var(--L_Blue)',
          borderRadius: { xs: 0, md: '16px' },
          py: '72px',
        }}
        component="section"
      >
        <Typography
          variant={isMdSize ? 'h1' : 'h2'}
          align="center"
          sx={{ mb: { xs: '40px', sm: '24px' } }}
        >
          Start free 14-days trial
        </Typography>

        <ChoosePlan showFreePlanButton />
      </Box>

      <section className={styles.endBanner}>
        {isXsSize && <Image src={endBannerMobile} width={272} alt="end banner image" />}
        <div className={styles.descriptionContainer}>
          <Typography variant={'h2'} color={'var(--White)'}>
            Interested in improving your workflow?
          </Typography>
          <Typography
            variant={'body2'}
            maxWidth={'370px'}
            marginTop={'16px'}
            color={'var(--White)'}
          >
            Create your lessons with eLang for free. Explore thousands of videos and lesson and
            share.
          </Typography>
          <Button
            variant="contained"
            size="large"
            className={styles.primaryBtn}
            href="/signup"
            sx={{ zIndex: 1, padding: '0 16px' }}
            onClick={handleClickGetStarted}
          >
            <Typography
              variant={'h5'}
              component={'span'}
              color="var(--Black)"
              sx={{ textAlign: 'center' }}
            >
              Get started 🚀
            </Typography>
          </Button>
        </div>
        {!isLgSize && <Image src={endBannerDesk} width={624} height={386} alt="end banner image" />}
        {isLgSize && !isXsSize && (
          <Image width={215} src={endBannerTablet} alt="end banner image" />
        )}
      </section>
    </div>
  );
};
