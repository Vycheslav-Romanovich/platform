import React from 'react';
import { Button } from '@mui/material';
import Link from 'next/link';

import Constructor from '../../assets/icons/landing/constructor.svg';
import Grammar from '../../assets/icons/landing/grammar.svg';
import Interactive from '../../assets/icons/landing/interactive.svg';
import LaptopMobile from '../../assets/icons/landing/laprtomMobile.svg';
import Simple from '../../assets/icons/landing/simple.svg';
import SimpleGame from '../../assets/icons/landing/simpleGame.svg';
import SimpleLesson from '../../assets/icons/landing/simpleLesson.svg';
import SimpleShare from '../../assets/icons/landing/simpleShare.svg';
import Subtitles from '../../assets/icons/landing/subtitles.svg';

import styles from './index.module.scss';

import { DEMO_VIDEO } from '~/constants/links';

export const LandingAB = () => {
  return (
    <div className={styles.wrapper}>
      <section className={styles.teach}>
        <div className={styles.info}>
          <h2 className={styles.titleAB}>
            English teaching platform Made for teachers by teachers
          </h2>
          <p className={styles.text}>
            eLang is a flexible language platform made to support English teachers.
          </p>
          <Button
            id="learn_more"
            color="primary"
            variant="contained"
            className={styles.primaryBtn}
            href="/signup"
          >
            Registration
          </Button>
          <div className={styles.laptopMobile}>
            <LaptopMobile />
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h3>How it works</h3>
        <p className={styles.text}>Watch demo 1 min</p>

        <div className={styles.iframe}>
          <iframe
            width="1061"
            height="736"
            src={DEMO_VIDEO}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      <section className={styles.startLessons}>
        <h3>It starts with your English lessons</h3>
        <p className={styles.text}>
          Save time preparing with prebuilt templates. Easily make lessons in minute.
        </p>
        <div className={styles.list}>
          <div className={styles.listLeft}>
            <div className={styles.listBlack}>
              <p className={styles.listTitle}>
                Use a video to <br /> create a lesson
              </p>
              <p className={styles.listText}>
                Select and save words words from <br /> subtitles while watching a video.
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
                Captivate students with <br /> materials based on <br /> their interests
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.simple}>
        <div className={styles.simpleLeft}>
          <Simple />
        </div>
        <div className={styles.simpleRight}>
          <h3 className={styles.title}>
            Simple and fun <br /> learning mode
          </h3>
          <p className={styles.text}>
            Students simply open your link and get access to the created lesson. <br />
            <br />
            Students have various options and games to train word sets. From word matches and
            fillwords to listening and letter combining.
          </p>
          <div>
            <SimpleShare />
            <SimpleGame />
            <SimpleLesson />
          </div>
        </div>
        <div className={styles.simpleLeftNone}>
          <Simple />
        </div>
      </section>

      <section className={styles.functions}>
        <h3 className={styles.title}>A bunch of great features to get you started</h3>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Constructor />
            <h4>Lesson constructor</h4>
            <p>Explore thousands of videos and dozens of exercises to make effective lessons.</p>
          </li>
          <li className={styles.item}>
            <Subtitles />
            <h4>Smart subtitles</h4>
            <p>
              Watch videos with subtitles in 2 languages. Translate any word right in a video and
              navigate by phrases.
            </p>
          </li>
          <li className={styles.item}>
            <Interactive />
            <h4>Interactive learning</h4>
            <p>Keep your education diversified and captivating with eLang.</p>
          </li>
        </ul>
      </section>

      <section className={styles.grammar}>
        <div className={styles.grammarLeft}>
          <h3 className={styles.title}>
            The only platform <br /> to master Vocabulary and Grammar
          </h3>
          <p className={styles.text}>
            Language learning requires constant practice. <br />
            That is why we provide a whole library of topics <br />
            and exercises to train.
          </p>
          <Link href={'/library/study'}>
            <Button
              color="primary"
              variant="contained"
              className={styles.primaryBtn}
              href="#howItWorks"
            >
              Try now
            </Button>
          </Link>
        </div>
        <div className={styles.grammarRight}>
          <Grammar />
        </div>
        <Link href={'/library/study'}>
          <Button
            color="primary"
            variant="contained"
            className={styles.primaryBtnNone}
            href="#howItWorks"
          >
            Try now
          </Button>
        </Link>
      </section>

      <section className={styles.reviews}>
        <h3 className={styles.title}>Loved by people</h3>
        <ul className={styles.reviewsList}>
          <li className={styles.reviewsItem}>
            <p className={styles.name}>
              <span className={styles.people1}></span>
              Levente <span>English Teacher</span>
            </p>
            <p className={styles.text}>
              eLang is definitely a good platform for lesson preparation. I needed such an app with
              different exercises for students. Thanks to eLang team!
            </p>
          </li>
          <li className={styles.reviewsItem}>
            <p className={styles.name}>
              <span className={styles.people2}></span>
              Anastasia <span>English Learner</span>
            </p>
            <p className={styles.text}>
              Finally I found a service that offers a LOT of videos with interactive subtitles and
              word games to train. Especially, I like how it works on mobile.
            </p>
          </li>
          <li className={styles.reviewsItem}>
            <p className={styles.name}>
              <span className={styles.people3}></span>
              Sarah <span>Community Tutor</span>
            </p>
            <p className={styles.text}>
              eLang is great for hometasks and remote students. I&apos;m really waiting for a table
              with students&apos; progress :)
            </p>
          </li>
        </ul>
      </section>

      <section className={styles.email}>
        <p className={styles.title}>English teaching starts with preparation</p>
        <p className={styles.text}>
          Create your lessons with eLang for free. Explore thousands of videos and lesson and share
          your own exercises.
        </p>
        <div className={styles.form}>
          <div className={styles.formButton}>
            <Button
              color="info"
              variant="contained"
              href="/signup"
              size="large"
              sx={{ color: '#5C77F2', width: '100%' }}
            >
              Get started
            </Button>
          </div>
          <Button color="info" variant="outlined" href="/library/public" size="large">
            Search popular lessons
          </Button>
        </div>
      </section>
    </div>
  );
};
