import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';

import styles from './viewActivity.module.scss';

import { MultipleChoiceView } from '~/components/player/viewActivity/multipleChoiceView';
import { OpenEndQuestionView } from '~/components/player/viewActivity/openEndQuestionView';
import { TrueFalseView } from '~/components/player/viewActivity/trueFalseView';
import { getStatisticsEmoji } from '~/constants/statisticRate';
import { videoInteractiveDesc } from '~/constants/video-lesson-steps';
import { lessonStore, openEndedGameStore, teacherClassesStore, videoStore } from '~/stores';

type ViewActivityType = {
  timeCode: number;
  setOpenModal: (value: boolean) => void;
};

export const ViewActivity: React.FC<ViewActivityType> = observer(({ timeCode, setOpenModal }) => {
  let true_or_false_index = 0;
  let multiple_choice_index = 0;
  let open_end_question_index = 0;

  const { t } = useTranslation();
  const { asPath, query } = useRouter();

  const onlyOpenEndQuestion = useMemo(
    () =>
      lessonStore.lessonData.videoGame.some(
        (s) =>
          s.timeCode === timeCode &&
          s.gameType !== 'multiple_choice' &&
          s.gameType !== 'true_or_false' &&
          s.gameType === 'open_end_question'
      ),
    [timeCode]
  );

  const [checkRightAnswerMode, setCheckRightAnswerMode] = useState<boolean>(false);

  const buttonMode = (answer: string | boolean, element) => {
    switch (checkRightAnswerMode) {
      case false:
        return backgroundButton(answer, element)
          ? 'var(--Grey_Blue)'
          : typeof answer === 'string'
          ? 'var(--M_Blue)'
          : 'var(--White)';
      case true:
        return checkRightAnswer(answer, element);
    }
  };

  const backgroundButton = (buttonType: boolean | string, element) => {
    if (typeof buttonType === 'boolean') {
      return lessonStore.checkAnswer.trueFalseAnswer.some(
        (som) => som.id === element.id && som.answer === buttonType
      );
    }
    if (typeof buttonType === 'string') {
      lessonStore.checkAnswer.chooseOptionAnswer.some((el) => el === buttonType);
    }
  };

  const checkRightAnswer = (answer: string | boolean, element) => {
    if (element.gameType === 'true_or_false') {
      return backgroundButton(answer as boolean, element)
        ? (element.answer.correct as boolean) === answer
          ? 'var(--M_Green)'
          : 'var(--M_Pink)'
        : null;
    }
    if (element.gameType === 'multiple_choice') {
      return (element.answer.correct as string[]).some((someEl) => someEl === answer)
        ? 'var(--M_Green)'
        : 'var(--M_Pink)';
    }
  };

  const procentActivity = (timeCode: number) => {
    onlyOpenEndQuestion
      ? lessonStore.setProcentToClassActivity(
          Math.floor(100 / openEndedGameStore.countActivity),
          timeCode
        )
      : lessonStore.setProcentToClassActivity(
          Math.floor(lessonStore.timeCodeStatisticPercent / openEndedGameStore.countActivity),
          timeCode
        );
  };

  const clickDownButtonHandler = (timeCode: number) => {
    checkRightAnswerMode || onlyOpenEndQuestion
      ? (setOpenModal(false), videoStore.setPause(false), lessonStore.resetCheckAnswer())
      : (setCheckRightAnswerMode(true),
        setDisableButton(true),
        lessonStore.getStatisticForVideoActivity(timeCode));
    procentActivity(timeCode);
    if (+query.classId > 0 && +query.teacherLessonId > 0) {
      teacherClassesStore.updateStatisticsEdu({
        ...lessonStore.allLessonActivities,
        teacherLessonId: +query.teacherLessonId,
        classId: +query.classId,
        videoGame: lessonStore.procentToClassActivity,
      });
    }
  };

  const [disableButton, setDisableButton] = useState<boolean>(false);

  useEffect(() => {
    let timer;
    checkRightAnswerMode &&
      (timer = setTimeout(() => {
        setDisableButton(false);
        lessonStore.resetTimeCodeStatisticPercent();
      }, 1000));
    return () => timer;
  }, [checkRightAnswerMode]);

  const { title, Img, color } = getStatisticsEmoji(lessonStore.timeCodeStatisticPercent);

  return (
    <Box className={styles.viewActivityContainer} onClick={(event) => event.stopPropagation()}>
      {videoInteractiveDesc.map((item, index) => {
        return (
          <div key={index}>
            {item.dataBaseName === 'open_end_question' && (
              <>
                {lessonStore.returnVideoGameData(timeCode, 'open_end_question')?.length > 0 && (
                  <Typography variant={'h4'} textAlign={'center'}>
                    {t('interactiveGame.answerQuestion')}
                  </Typography>
                )}
                {lessonStore.returnVideoGameData(timeCode, 'open_end_question')?.length > 0 && (
                  <div className={styles.openEndContainer}>
                    {lessonStore
                      .returnVideoGameData(timeCode, 'open_end_question')
                      ?.map((element, index) => {
                        element.gameType === 'open_end_question' && open_end_question_index++;
                        return (
                          <OpenEndQuestionView
                            key={index}
                            open_end_question_index={open_end_question_index}
                            question={element.question}
                          />
                        );
                      })}
                  </div>
                )}
              </>
            )}
            {item.dataBaseName === 'true_or_false' && (
              <div>
                {lessonStore.returnVideoGameData(timeCode, 'true_or_false')?.length > 0 && (
                  <Typography variant={'h4'} textAlign={'center'}>
                    {t('interactiveGame.chooseWhether')}
                  </Typography>
                )}
                {lessonStore
                  .returnVideoGameData(timeCode, 'true_or_false')
                  ?.map((element, index) => {
                    element.gameType === 'true_or_false' && true_or_false_index++;
                    const buttonMode = (answer: string | boolean) => {
                      switch (checkRightAnswerMode) {
                        case false:
                          return backgroundButton(answer)
                            ? 'var(--Silver)'
                            : typeof answer === 'string'
                            ? 'var(--M_Blue)'
                            : 'var(--White)';
                        case true:
                          return checkRightAnswer(answer);
                      }
                    };
                    const backgroundButton = (buttonType: boolean | string) => {
                      if (typeof buttonType === 'boolean') {
                        return lessonStore.checkAnswer.trueFalseAnswer.some(
                          (som) => som.id === element.id && som.answer === buttonType
                        );
                      }
                      if (typeof buttonType === 'string') {
                        lessonStore.checkAnswer.chooseOptionAnswer.some((el) => el === buttonType);
                      }
                    };
                    const checkRightAnswer = (answer: string | boolean) => {
                      if (element.gameType === 'true_or_false') {
                        return backgroundButton(answer as boolean)
                          ? (element.answer.correct as boolean) === answer
                            ? 'var(--M_Green)'
                            : 'var(--M_Pink)'
                          : 'transparent';
                      }
                      if (element.gameType === 'multiple_choice') {
                        return (element.answer.correct as string[]).some(
                          (someEl) => someEl === answer
                        )
                          ? 'var(--M_Green)'
                          : 'var(--M_Pink)';
                      }
                    };
                    return (
                      <TrueFalseView
                        checkRightAnswerMode={checkRightAnswerMode}
                        key={index}
                        true_or_false_index={true_or_false_index}
                        element={element}
                        buttonMode={buttonMode}
                      />
                    );
                  })}
              </div>
            )}
            {item.dataBaseName === 'multiple_choice' && (
              <div>
                {lessonStore.returnVideoGameData(timeCode, 'multiple_choice')?.length > 0 && (
                  <Typography variant={'h4'} textAlign={'center'}>
                    {t('interactiveGame.chooseCorrect')}
                  </Typography>
                )}
                {lessonStore
                  .returnVideoGameData(timeCode, 'multiple_choice')
                  ?.map((element, index) => {
                    element.gameType === 'multiple_choice' && multiple_choice_index++;

                    return (
                      <MultipleChoiceView
                        checkRightAnswerMode={checkRightAnswerMode}
                        key={index}
                        multiple_choice_index={multiple_choice_index}
                        element={element}
                        buttonMode={buttonMode}
                      />
                    );
                  })}
              </div>
            )}
          </div>
        );
      })}
      <div className={styles.downButtonBlock}>
        <div className={styles.statisticMessageBlock}>
          {checkRightAnswerMode && !disableButton && !onlyOpenEndQuestion && (
            <>
              <Img width={'32px'} height={'32px'} />
              <Typography color={color} variant={'h4'}>
                {title}
              </Typography>
            </>
          )}
        </div>
        <Button
          variant={'contained'}
          disableRipple
          disabled={disableButton}
          className={styles.downButton}
          onClick={() => clickDownButtonHandler(videoStore.state.time)}
        >
          {checkRightAnswerMode || onlyOpenEndQuestion
            ? t('interactiveGame.continueWatching')
            : t('interactiveGame.checkAnswers')}
        </Button>
      </div>
    </Box>
  );
});
