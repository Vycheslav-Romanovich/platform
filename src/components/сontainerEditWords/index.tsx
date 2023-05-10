import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react';
import Image from 'next/image';

import ArrowNext from '~/assets/icons/arrows/arrowBreadCrumb.svg';

import { ErrorValidation } from '../error';
import LessonBlock from '../lesson/lessonBlock';
import LessonCoverModal from '../lesson/lessonCoverModal';
import LessonSelectLevel from '../lesson/lessonSelectLevel';

import styles from './index.module.scss';

import { SwitcherFromActivity } from '~/components/video/switcherFromActivity/switcherFromActivity';
import { ActivityBlockByTimeCode } from '~/components/сontainerEditWords/ActivityBlockByTimeCode';
import { Step } from '~/features/Step';
import { VisibleToEveryoneCheckBox } from '~/features/VisibleToEveryoneCheckBox';
import { lessonStore, openEndedGameStore } from '~/stores';
import { AddWordResponse } from '~/types/api';
import { ChoosePlan } from '~/widget/ChoosePlan';

type Props = {
  isVideoLesson: boolean;
  isLoadingBtn: boolean;
  checkValidate: any;
  refContainer: React.MutableRefObject<HTMLDivElement>;
  refCard: React.MutableRefObject<HTMLDivElement>;
  isHideSaveBtn?: boolean;
  saveLesson?: () => void;
  isEdit: boolean;
  isLevelChosen: boolean;
  setFileCover?: (event) => void;
};

export const ContainerEditWords: React.FC<Props> = observer(
  ({
    isHideSaveBtn = false,
    isVideoLesson,
    isLoadingBtn,
    saveLesson,
    checkValidate,
    refCard,
    refContainer,
    isEdit,
    isLevelChosen,
    setFileCover,
  }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [coverEdit, setCoverEdit] = useState('');
    const [srcCover, setSrcCover] = useState('');
    const [fileSelected, setFileSelected] = useState<File>();
    const {
      setEnglishLevel,
      deleteWordLocal,
      setTranslation,
      setTranslationHint,
      setLessonName,
      setWord,
    } = lessonStore;

    const changeEnglishLevel = (event) => {
      setEnglishLevel(event.target.value);
    };

    const setName = (event) => {
      setLessonName(event.target.value);
    };

    const closeModalChooseCover = () => {
      setIsOpen(false);
      setFileCover(fileSelected);
    };

    function setSrcCoverFunction() {
      if (localStorage.getItem('newCoverLesson') != undefined) {
        return localStorage.getItem('newCoverLesson');
      } else if (lessonStore.lessonData?.picture?.length > 1) {
        return lessonStore.lessonData?.picture;
      } else {
        return `${process.env.PRODUCT_SERVER_URL}/covers/1.svg`;
      }
    }

    useEffect(() => {
      setSrcCover(setSrcCoverFunction());
    }, [isOpen]);

    useEffect(() => {
      if (isEdit === false) {
        lessonStore.setCover(`${process.env.PRODUCT_SERVER_URL}/covers/1.svg`);
      }
      setSrcCover(setSrcCoverFunction());
    }, []);

    return (
      <div className={styles.lesson}>
        <div className={styles.stickyElements}>
          <div className={styles.stickyContent}>
            {!isVideoLesson && (
              <>
                <div className={styles.breadCrumbsContainer}>
                  <div className={styles.breadCrumbs}>
                    <p className={styles.active}>
                      {isEdit
                        ? t('containerEditWords.editTerms')
                        : t('containerEditWords.enterTerms')}
                    </p>
                    <ArrowNext />
                    <p className={styles.nonActive}>
                      {isEdit ? t('containerEditWords.save') : t('containerEditWords.create')}
                    </p>
                  </div>

                  <Button
                    onClick={saveLesson}
                    variant="contained"
                    classes={{ root: styles.createButtonTop }}
                    disabled={isLoadingBtn}
                  >
                    {isLoadingBtn ? (
                      <>
                        <span>
                          {isEdit
                            ? t('containerEditWords.saving')
                            : t('containerEditWords.creating')}
                        </span>
                        <CircularProgress classes={{ root: styles.loader }} />
                      </>
                    ) : (
                      <span>
                        {isEdit ? t('containerEditWords.save') : t('containerEditWords.create')}
                      </span>
                    )}
                  </Button>
                </div>

                <div className={styles.progressBarDescriptionMobile}>
                  <Step createdBy={'words'} edit={isEdit} nextButtonHandlerClick={saveLesson} />
                </div>
              </>
            )}

            <p className={styles.required}>{t('containerEditWords.required')}</p>
            <Typography variant="h3" sx={{ mb: '24px' }}>
              {t('containerEditWords.nameLesson')}
            </Typography>

            <div className={styles.inputContainer}>
              <Stack sx={{ maxWidth: '528px', flexGrow: '1' }}>
                <TextField
                  id="standard-basic"
                  placeholder={t('containerEditWords.placeholderEnter')}
                  variant="standard"
                  color="secondary"
                  multiline
                  maxRows={2}
                  value={lessonStore.lessonData?.name}
                  inputProps={{ maxLength: 80 }}
                  onChange={setName}
                />
                <FormHelperText sx={{ textAlign: 'end' }}>
                  {lessonStore.lessonData?.name?.length}/80
                </FormHelperText>
              </Stack>

              {/* dropdown choose english level */}
              <div ref={lessonStore?.lessonData?.level ? null : refContainer}>
                <LessonSelectLevel
                  warning={isLevelChosen}
                  levelLanguages={
                    lessonStore?.lessonData?.level ? lessonStore.lessonData.level : ''
                  }
                  handleChangeSelect={changeEnglishLevel}
                />
              </div>

              <div className={styles.errorNameBlock}>
                {checkValidate.onSubmit && !lessonStore.lessonData.name.trim() && (
                  <div className={styles.errorMb} ref={refContainer}>
                    <ErrorValidation>{t('errorValidation.empty')}</ErrorValidation>
                  </div>
                )}
                {checkValidate.onSubmit && lessonStore.lessonData.name.trim().length > 80 && (
                  <div className={styles.errorMb} ref={refContainer}>
                    <ErrorValidation>{t('errorValidation.longEighty')}</ErrorValidation>
                  </div>
                )}
                {checkValidate.onSubmit && lessonStore.lessonData.name.trim().length <= 2 && (
                  <div className={styles.errorMb} ref={refContainer}>
                    <ErrorValidation>{t('errorValidation.moreThree')}</ErrorValidation>
                  </div>
                )}
              </div>
            </div>

            {!isVideoLesson && (
              <div className={styles.checkImg}>
                <div className={styles.defaultCoverContainer}>
                  <div className={styles.defaultCover} onClick={() => setIsOpen(true)}>
                    <Image
                      className={styles.imgLesson}
                      src={srcCover}
                      alt="coverLesson"
                      width={200}
                      height={92}
                    />
                  </div>
                  <div>
                    <p className={styles.text}>{t('containerEditWords.defaultCover')}</p>
                    <Button onClick={() => setIsOpen(true)}>
                      {t('containerEditWords.change')}
                    </Button>
                  </div>
                </div>

                <div className={styles.visibleToEveryoneTerms}>
                  <VisibleToEveryoneCheckBox popupContent={<ChoosePlan openFromPopup />} />
                </div>
              </div>
            )}

            <div className={styles.selectWrapper}>
              <div className={styles.selectTextMobile}>
                <p className={styles.created}>
                  {isVideoLesson
                    ? `${t('containerEditWords.savedWords')} (${
                        lessonStore?.lessonData?.word?.length
                      })`
                    : t('containerEditWords.createdWords')}
                </p>
                <p className={styles.enter}>
                  {isVideoLesson
                    ? t('containerEditWords.checkTerms')
                    : t('containerEditWords.enterWord')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {checkValidate.onSubmit &&
          lessonStore.lessonData?.word?.length <= 2 &&
          lessonStore.lessonData?.videoGame?.length <= 2 && (
            <div className={styles.errorMb} ref={refContainer}>
              <ErrorValidation>{t('errorValidation.lessonError')}</ErrorValidation>
            </div>
          )}

        <div className={styles.lessonWrapper}>
          {isVideoLesson && (
            <div className={styles.switcherActivityContainer}>
              <SwitcherFromActivity
                optionStyles={styles.switcherActivity}
                wordCount={lessonStore?.lessonData?.word?.length}
                activityCount={openEndedGameStore.setTimeCode().length}
              />
              <Box
                sx={{
                  borderBottom: { xs: 0, md: 1 },
                  borderColor: { xs: 0, md: 'divider' },
                  height: 'auto',
                  paddingBottom: { xs: '28px', md: 0 },
                }}
              >
                <VisibleToEveryoneCheckBox popupContent={<ChoosePlan openFromPopup />} />
              </Box>
            </div>
          )}
          <div className={styles.lessonCard}>
            <>
              {lessonStore.variantBox === 'word' &&
                lessonStore.lessonData?.word?.map((wordPair: AddWordResponse, index) => {
                  return (
                    <LessonBlock
                      numberBlock={++index}
                      wordPair={wordPair}
                      key={wordPair.id}
                      deleteItem={() => deleteWordLocal(wordPair.id)}
                      changeHandlerWord={setWord}
                      changeHandlerTranslation={setTranslation}
                      changeHandlerTranslationHint={setTranslationHint}
                      checkValidate={checkValidate.onSubmit}
                      errorRef={refCard}
                    />
                  );
                })}
              {lessonStore.variantBox === 'activity' &&
                openEndedGameStore.setTimeCode().map((dataObject, index) => {
                  return <ActivityBlockByTimeCode dataObject={dataObject} key={index} />;
                })}
              {!isVideoLesson && (
                <div className={styles.createCard} onClick={lessonStore.addNewWord}>
                  <AddIcon className={styles.addOutline} />
                  <p>{t('containerEditWords.addCard')}</p>
                </div>
              )}
            </>
          </div>

          {!isHideSaveBtn && (
            <div className={styles.blockButtonBottom}>
              <Button
                onClick={saveLesson}
                variant="contained"
                sx={{ width: { xs: '100%', md: 'initial' } }}
                disabled={isLoadingBtn}
              >
                {isLoadingBtn ? (
                  <>
                    <span>
                      {isEdit ? t('containerEditWords.saving') : t('containerEditWords.creating')}
                    </span>
                    <CircularProgress classes={{ root: styles.loader }} />
                  </>
                ) : (
                  <span>
                    {isEdit ? t('containerEditWords.save') : t('containerEditWords.create')}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>

        <LessonCoverModal
          isOpen={isOpen}
          closeModalChooseCover={closeModalChooseCover}
          coverEdit={coverEdit}
          setCoverLessons={setCoverEdit}
          setFileSelected={setFileSelected}
          srcCover={setSrcCoverFunction()}
        />
      </div>
    );
  }
);
