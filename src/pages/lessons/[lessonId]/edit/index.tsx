import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { observer } from 'mobx-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import ArrowNext from '~/assets/icons/arrows/arrowBreadCrumb.svg';

import styles from './index.module.scss';

import api from '~/api_client/api';
import { InitLoader } from '~/components/initLoader';
import { WordsList } from '~/components/video/termsAndActivitiesList/features/wordsList';
import Video from '~/components/video/Video';
import { ContainerEditWords } from '~/components/сontainerEditWords';
import { useInput } from '~/customHooks/useValidation';
import { Step } from '~/features/Step';
import Layout from '~/hocs/layout';
import { lessonStore, userStore, validationStore, videoStore } from '~/stores';
import MuiDialog from '~/UI/muiDialog';

const Edit: NextPage = () => {
  const { replace, back } = useRouter();
  const [videoStep, setVideoStep] = useState(0);
  const [serviceId, setServiceId] = useState('');
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [isMyLesson, setIsMyLesson] = useState(false);
  const checkValidate = useInput('', { onSubmit: false });
  const refContainer = useRef(null);
  const refCard = useRef(null);
  const [openMobileCards, setOpenMobileCards] = useState(false);
  const [isLevelChosen, setIsLevelChosen] = useState<boolean>(false);
  const [fileCover, setFileCover] = useState<File>();
  const refUpdateMode = useRef(false);
  const { t } = useTranslation();

  const warningCondition =
    lessonStore.lessonData === null ||
    lessonStore.lessonData.word === undefined ||
    lessonStore.lessonData.word.length < 3;

  const handleMobileCards = () => {
    setOpenMobileCards((prev) => !prev);
  };
  const checkEnglishLevel = () => {
    !lessonStore.lessonData.level && setIsLevelChosen(true);
    setTimeout(() => {
      setIsLevelChosen(false);
    }, 3000);
  };

  const clickVideoNextHandler = () => {
    if (lessonStore.videoGameData.length > 2 || !warningCondition) {
      if (videoStep === 1) {
        saveLesson();
      } else setVideoStep((prevState) => prevState + 1);
    }
  };

  const clickVideoBackHandler = () => {
    switch (videoStep) {
      case 0:
        return back();
      case 1:
        return setVideoStep((prevState) => prevState - 1);
      default:
        return back();
    }
  };

  const scrollToError = () => {
    if (refContainer.current !== null) {
      refContainer.current?.parentElement.parentElement.scrollIntoView();
    } else {
      refCard.current?.scrollIntoView();
    }
  };

  const saveLesson = async () => {
    const { lessonData } = lessonStore;
    validationStore.validationFields(lessonData.word);
    validationStore.validateSpace(lessonData.word);
    checkValidate.onClick();
    scrollToError();
    checkEnglishLevel();
    const wordsLengthValidate = lessonData.mediaUrl
      ? lessonData?.word?.length > 2 || lessonData?.videoGame?.length > 2
      : lessonData?.word?.length > 2;
    if (
      lessonData.name.trim() &&
      lessonData.name &&
      lessonData.name.length <= 80 &&
      lessonData.name.length >= 3 &&
      !validationStore.objValidateSpace.word &&
      !validationStore.objValidateSpace.translate &&
      !validationStore.objValidate.word &&
      lessonData.level &&
      !validationStore.objValidate.translate &&
      wordsLengthValidate
    ) {
      setIsLoadingBtn(true);

      lessonStore.updateFullLesson(fileCover).finally(() => {
        setIsLoadingBtn(false);
        replace('/lessons?q=created');
      });
      localStorage.removeItem('newCoverLesson');
    }

    validationStore.clearObjStore();
  };

  useEffect(() => {
    lessonStore.setSentenseWithWordEditLesson();
    if (lessonStore.isLoadingLessons === 'false') {
      if (lessonStore.lessonData.mediaUrl) {
        const url = new URL(lessonStore.lessonData.mediaUrl);
        setServiceId(url.searchParams.get('v'));
      }
    }
  }, [lessonStore.isLoadingLessons]);

  useEffect(() => {
    scrollToError();
  }, [refContainer, validationStore.objValidateSpace, validationStore.objValidate]);

  useEffect(() => {
    if (refUpdateMode.current === false) {
      lessonStore.setUpdateMode();
      refUpdateMode.current = true;
    }
    videoStore.setCreateLessonMode(true);
    localStorage.removeItem('newCoverLesson');
  }, []);

  useEffect(() => {
    if (
      lessonStore.isLoadingLessons === 'false' &&
      userStore.user.id !== lessonStore.lessonData.userId
    ) {
      setIsMyLesson(false);
      replace(`/lessons/${lessonStore.lessonData.id}`);
    } else if (
      lessonStore.isLoadingLessons === 'false' &&
      userStore.user.id === lessonStore.lessonData.userId
    ) {
      setIsMyLesson(true);
    }
  }, [lessonStore.isLoadingLessons, lessonStore.lessonData.userId, userStore.user.id]);

  return (
    <Layout>
      <NextSeo
        title="Edit lesson"
        description="Edit lesson"
        additionalMetaTags={[{ property: 'keywords', content: 'Edit lesson' }]}
      />
      <MuiDialog isOpen={openMobileCards} handleClose={handleMobileCards} title="Saved terms">
        <WordsList />
      </MuiDialog>

      <div className={styles.editLesson}>
        {!isMyLesson ? (
          <InitLoader position={'centerPage'} />
        ) : lessonStore.lessonData.mediaUrl ? (
          <>
            <div className={styles.stickyVideoContent}>
              <div className={styles.breadCrumbs}>
                <p className={`${styles.create} ${videoStep === 0 && styles.active}`}>
                  {t('createVideoLesson.saveTerms')}
                </p>
                <ArrowNext />
                <p className={`${styles.create} ${videoStep === 1 && styles.active}`}>
                  {t('createVideoLesson.editSave')}
                </p>
              </div>

              <div className={styles.buttonBox}>
                <Button onClick={clickVideoBackHandler} variant={'outlined'}>
                  {t('createVideoLesson.back')}
                </Button>
                <Button onClick={clickVideoNextHandler} variant={'contained'}>
                  {videoStep < 1 ? t('createVideoLesson.next') : t('createVideoLesson.save')}
                </Button>
              </div>
            </div>

            <div className={styles.stepContainer}>
              <Step
                edit
                createdBy={'video'}
                nextButtonHandlerClick={clickVideoNextHandler}
                backButtonHandlerClick={clickVideoBackHandler}
                editVideoStep={videoStep}
              />
            </div>

            <div className={styles.videoWrapper}>
              {videoStep === 0 ? (
                <Video id={serviceId} withSubtitles={true} warningCondition={warningCondition} />
              ) : null}

              {videoStep === 1 && (
                <ContainerEditWords
                  isLevelChosen={false}
                  isEdit
                  isVideoLesson={true}
                  isLoadingBtn={isLoadingBtn}
                  saveLesson={saveLesson}
                  checkValidate={checkValidate}
                  refContainer={refContainer}
                  refCard={refCard}
                  setFileCover={setFileCover}
                />
              )}
            </div>
          </>
        ) : (
          <ContainerEditWords
            isLevelChosen={isLevelChosen}
            isEdit
            isVideoLesson={false}
            isLoadingBtn={isLoadingBtn}
            saveLesson={saveLesson}
            checkValidate={checkValidate}
            refContainer={refContainer}
            refCard={refCard}
            setFileCover={setFileCover}
          />
        )}
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      protected: true,
    },
  };
}

export default observer(Edit);
