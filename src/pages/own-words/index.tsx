import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import Layout from '../../hocs/layout';

import styles from './index.module.scss';

import { ContainerEditWords } from '~/components/сontainerEditWords';
import { useInput } from '~/customHooks/useValidation';
import { sendEvent } from '~/helpers/sendToGtm';
import { lessonStore, mainStore, userStore, validationStore } from '~/stores';

const OwnWords: React.FC = () => {
  const { replace } = useRouter();
  const { t } = useTranslation();
  const checkValidate = useInput('', { onSubmit: false });
  const refContainer = useRef(null);
  const refCard = useRef(null);
  const [saveLessonBtn, setSaveLessonBtn] = useState(false);
  const [isLevelChosen, setIsLevelChosen] = useState<boolean>(false);
  const [fileCover, setFileCover] = useState<File>();

  const scrollToError = () => {
    if (refContainer.current !== null) {
      refContainer.current?.parentElement.parentElement.scrollIntoView();
    } else {
      refCard.current?.scrollIntoView();
    }
  };

  useEffect(() => {
    lessonStore.resetLessonData();
  }, []);

  const checkEnglishLevel = () => {
    !lessonStore.lessonData.level && setIsLevelChosen(true);
    setTimeout(() => {
      setIsLevelChosen(false);
    }, 3000);
  };

  useEffect(() => {
    scrollToError();
  }, [refContainer, validationStore.objValidateSpace, validationStore.objValidate]);

  const createNewLesson = () => {
    const { lessonData } = lessonStore;
    validationStore.validationFields(lessonData.word);
    validationStore.validateSpace(lessonData.word);
    checkValidate.onClick();
    scrollToError();
    checkEnglishLevel();

    if (
      lessonData.name.trim() &&
      lessonData.name.length <= 80 &&
      lessonData.name.length >= 3 &&
      lessonStore.lessonData.level &&
      !validationStore.objValidateSpace.word &&
      !validationStore.objValidateSpace.translate &&
      !validationStore.objValidate.word &&
      !validationStore.objValidate.translate &&
      lessonData?.word?.length > 2
    ) {
      setSaveLessonBtn(true);

      lessonStore
        .createFullLesson(fileCover)
        .then((resp) =>
          sendEvent('words_creation_finish', {
            added_words_amount: resp.word?.length.toString(),
          })
        )
        .finally(() => {
          setSaveLessonBtn(false);
          userStore.getUserInfo();
          if (userStore.user.limits.ownLessonCounter < 1) {
            sendEvent('limit_reached');
          }
          replace('/lessons?q=created');
        });
      lessonStore.setCreateLessonModal(true);
      localStorage.removeItem('newCoverLesson');
    }
    validationStore.clearObjStore();
  };

  useEffect(() => {
    lessonStore.setLesson({
      name: '',
      level: '',
      word: [
        { word: '', translate: '', id: 0 },
        { word: '', translate: '', id: 1 },
        { word: '', translate: '', id: 2 },
      ],
      picture: `${process.env.PRODUCT_SERVER_URL}/covers/1.svg`,
      game: [],
    });
  }, []);

  return (
    <>
      <NextSeo
        title={t('seo.lessonCreation.ownWord.name')}
        description={t('seo.lessonCreation.ownWord.description')}
        additionalMetaTags={[
          { property: 'keywords', content: t('seo.lessonCreation.ownWord.keyWords') },
        ]}
      />

      <Layout style={mainStore.isMobile && mainStore.showNotification ? { paddingTop: 32 } : null}>
        <div className={styles.editLesson}>
          <ContainerEditWords
            isLevelChosen={isLevelChosen}
            isEdit={false}
            isVideoLesson={false}
            isLoadingBtn={saveLessonBtn}
            saveLesson={createNewLesson}
            checkValidate={checkValidate}
            refContainer={refContainer}
            refCard={refCard}
            setFileCover={setFileCover}
          />
        </div>
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

export default observer(OwnWords);
