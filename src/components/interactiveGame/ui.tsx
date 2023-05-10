import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Snackbar, Typography } from '@mui/material';
import { observer } from 'mobx-react';

import { AddQuestionButton } from './components/addQuestionButton';
import { MultipleChoice } from './components/multipleChoice';
import { QuestionBlock } from './components/questionBlock';
import { TitleWithInfo } from './components/titleWithInfo/titleWithInfo';
import { TrueFalseBlock } from './components/trueFalseBlock';

import styles from './interactiveGame.module.scss';

import { lessonStore, openEndedGameStore, videoStore } from '~/stores';
import { VideoGameType } from '~/types/video';

export interface SnackBarType {
  vertical: 'top' | 'bottom';
  horizontal: 'center' | 'right' | 'left';
}

export interface SnackBarState extends SnackBarType {
  open: boolean;
  message?: string;
}

export type Props = {
  isMobile: boolean;
};

export const InteractiveGames: React.FC<Props> = observer(({ isMobile }) => {
  const { t } = useTranslation();
  const [state, setState] = useState<SnackBarState>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: t('interactiveGame.messageEnterStatemet'),
  });
  const { vertical, horizontal, open, message } = state;
  let lengthArray = 0;

  const checkNoTrueOption = openEndedGameStore.gameData //проверяет есть ли чекбокс на Option в multiple choice
    .filter((f) => f.gameType === 'multiple_choice')
    .some((someElement) => (someElement.answer.correct as string[]).length === 0);
  const checkNoQuestion = openEndedGameStore.gameData.some(
    //проверяет есть ли пустые поля с вопросами
    (someElement) => someElement.question.length === 0
  );

  const closeHandler = () => {
    lessonStore.setVideoInteractiveName(null);
    openEndedGameStore.removeEmptyQuestion();
  };

  const saveHandler = (gameType: VideoGameType) => {
    lessonStore.setVariantBox('activity');
    if (checkNoTrueOption || checkNoQuestion) {
      switch (gameType) {
        case 'multiple_choice':
          return setState({
            open: true,
            horizontal: 'center',
            vertical: 'top',
            message: t('interactiveGame.messageMark'),
          });
        case 'open_end_question':
          return setState({
            open: true,
            horizontal: 'center',
            vertical: 'top',
            message: t('interactiveGame.messageEnter'),
          });
        case 'true_or_false':
          return setState({
            open: true,
            horizontal: 'center',
            vertical: 'top',
            message: t('interactiveGame.messageEnterStatemet'),
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

  const handleClick = (newState: SnackBarType) => {
    setState({ open: true, ...newState });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  // const [showButton, setShowButton] = useState<boolean>(true);
  // const checkedArrayLength = openEndedGameStore.gameData.filter(
  //   (f) =>
  //     f.timeCode === Math.floor(videoStore.state.time) &&
  //     f.gameType === lessonStore.videoInteractiveName
  // ).length;
  // useEffect(() => {
  //   if (checkedArrayLength > 9) {
  //     setShowButton(false);
  //   } else setShowButton(true);
  // }, [checkedArrayLength]);

  return (
    <>
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

      {lessonStore.videoInteractiveName === 'open_end_question' && (
        <>
          {!isMobile && (
            <TitleWithInfo
              title={'Open ended questions'}
              infoText={t('interactiveGame.textTypeQuestion')}
            />
          )}

          <div className={styles.questionWrapper}>
            {openEndedGameStore.gameData
              .filter(
                (f) =>
                  f.gameType === 'open_end_question' &&
                  f.timeCode === Math.floor(videoStore.state.time)
              )
              .map(({ id, question }, index) => {
                return (
                  <QuestionBlock
                    id={id}
                    initialStateQuestion={question}
                    index={index}
                    key={index}
                  />
                );
              })}
          </div>
        </>
      )}

      {lessonStore.videoInteractiveName === 'true_or_false' && (
        <>
          {!isMobile && (
            <TitleWithInfo
              title={'True or false'}
              infoText={t('interactiveGame.textTypeStatement')}
            />
          )}

          <div className={styles.questionWrapper} style={{ gap: 0, alignItems: 'center' }}>
            <Typography textAlign={'left'} width={'100%'} variant={'h4'}>
              {t('interactiveGame.statements')}
            </Typography>

            {openEndedGameStore.gameData
              .filter((f) => f.gameType === 'true_or_false')
              .map(({ id, question, timeCode, answer }, index) => {
                timeCode === Math.floor(videoStore.state.time) && lengthArray++;
                return (
                  timeCode === Math.floor(videoStore.state.time) && (
                    <TrueFalseBlock
                      id={id}
                      initialStateQuestion={question}
                      index={lengthArray}
                      key={index}
                      answer={answer}
                    />
                  )
                );
              })}
          </div>
        </>
      )}

      {lessonStore.videoInteractiveName === 'multiple_choice' && (
        <>
          {!isMobile && (
            <TitleWithInfo title={'Multiple choice'} infoText={t('interactiveGame.textTypeMark')} />
          )}

          <div className={styles.questionWrapper} style={{ alignItems: 'center' }}>
            {openEndedGameStore.gameData
              .filter((f) => f.gameType === 'multiple_choice')
              .map(({ id, question, timeCode, answer }, index) => {
                return (
                  timeCode === Math.floor(videoStore.state.time) && (
                    <MultipleChoice
                      id={id}
                      initialStateQuestion={question}
                      index={index}
                      key={index}
                      answer={answer}
                      openSnackBar={() => handleClick({ horizontal: 'center', vertical: 'top' })}
                    />
                  )
                );
              })}
          </div>
        </>
      )}

      <AddQuestionButton
        customStyle={styles.addQuestionButton}
        textButton={
          lessonStore.videoInteractiveName === 'true_or_false'
            ? t('interactiveGame.textButtonAddStatement')
            : t('interactiveGame.textButtonAdd')
        }
        gameType={lessonStore.videoInteractiveName}
      />

      {!isMobile && (
        <>
          <div className={styles.buttonBlock}>
            <Button onClick={closeHandler} className={styles.button} variant={'outlined'}>
              {t('lessons.cancel')}
            </Button>

            <Button
              className={styles.button}
              variant={'contained'}
              onClick={() => saveHandler(lessonStore.videoInteractiveName)}
            >
              {t('lessons.done')}
            </Button>
          </div>
        </>
      )}
    </>
  );
});
