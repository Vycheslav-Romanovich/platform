import React, { ReactNode, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';

import { lessonStore, openEndedGameStore, userStore } from '../stores';

import { InitLoader } from '~/components/initLoader';
import { getAllLanguages } from '~/helpers/languagesActions';
import { sendUserIdToGTM } from '~/helpers/sendToGtm';

type Props = {
  pageProps: any;
  children: ReactNode;
};

const Initialization: React.FC<Props> = ({ pageProps, children }) => {
  const { route, replace, push } = useRouter();
  const { isAuth, user, getAvatar, isInit, setInit, getSyncToken } = userStore;
  const { getLessonData } = lessonStore;

  const redirectFromBlockPage = async () => {
    if (!isAuth && pageProps.protected) {
      await replace('/signup');
    }
  };

  const getLesson = () => {
    //@to-do like on line 59
    const { pathname } = window.location;
    const paths = pathname.split('/');
    const isLessonsPath = paths[1] === 'lessons';
    const isLessonsPathLocalization = paths[2] === 'lessons';
    const isCreateVideoLessonPath =
      paths[1] === 'create-video-lesson' || paths[2] === 'create-video-lesson';

    if (isLessonsPath) {
      const lessonId = +paths[2];
      if (lessonId > 0) {
        getLessonData(lessonId, push);
      }
    }

    if (isLessonsPathLocalization) {
      const lessonId = +paths[3];
      if (lessonId > 0) {
        getLessonData(lessonId, push);
      }
    }

    if (isCreateVideoLessonPath && localStorage.newLessonLocal) {
      const data = JSON.parse(localStorage.newLessonLocal);
      lessonStore.sentenseWithWordData = data.sentenceWithWords;
      openEndedGameStore.gameData = data.videoGame;
      lessonStore.videoGameData = data.videoGame;
      lessonStore.setLesson(data.lesson);
    }
  };

  const getTeacherLessonData = () => {
    const { pathname } = window.location;
    if (pathname.includes('/teacher-classes/')) {
      const paths = pathname.substring(pathname.indexOf('/teacher-classes/') + 17).split('/');
      const classIdPath = +paths[0];
      const teacherLessonIdPath = +paths[1];

      if (teacherLessonIdPath > 0 && classIdPath > 0) {
        lessonStore.getTeacherLessonData(teacherLessonIdPath, classIdPath, push);
      }
    }
  };

  useEffect(() => {
    Promise.all([getAllLanguages()])
      .then(() => {
        getSyncToken(() => setInit(true));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (isAuth && user) {
      sendUserIdToGTM(user.id);
      getAvatar();
    }
  }, [isAuth, user]);

  useEffect(() => {
    if (isInit) {
      redirectFromBlockPage();
    }
  }, [isInit, redirectFromBlockPage, route]);

  useEffect(() => {
    getLesson();
  }, [route]);

  useEffect(() => {
    isAuth && getTeacherLessonData();
  }, [route, isAuth]);

  return <>{pageProps.protected && !isAuth ? <InitLoader position="centerPage" /> : children}</>;
};

export default observer(Initialization);
