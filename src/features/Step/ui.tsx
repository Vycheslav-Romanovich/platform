import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@mui/material';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import ArrowBack from '../../assets/icons/arrows/arrowBack.svg';

import style from './index.module.scss';

type PropsStepType = {
  createdBy: 'words' | 'video';
  edit?: boolean;
  nextButtonHandlerClick: () => void;
  isVideoSearched?: boolean;
  editVideoStep?: number;
  backButtonHandlerClick?: () => void;
  arrowBackVideoHandler?: () => void;
};

export const Step: FC<PropsStepType> = ({
  backButtonHandlerClick,
  isVideoSearched,
  createdBy,
  nextButtonHandlerClick,
  arrowBackVideoHandler,
  editVideoStep,
  edit,
}) => {
  const { back, asPath } = useRouter();
  const { t } = useTranslation();

  const [lessonStep, setLessonStep] = useState<number>(1);

  const wrapperClasses = classNames(style.wrapper, {
    [style.wrapperChange]: lessonStep === 1 && createdBy === 'video' && !edit,
    [style.wrapperVideo]: lessonStep === 2 && createdBy === 'video' && !edit,
  });

  const isArrowShow = isVideoSearched && lessonStep === 1 && createdBy === 'video';
  const isButtonShow = (lessonStep !== 1 && createdBy === 'video') || createdBy === 'words' || edit;

  const finishButton = edit ? t('containerEditWords.save') : t('step.create');

  let stepPathArray;

  if (createdBy === 'words') {
    stepPathArray = ['/own-words'];
  } else {
    stepPathArray = edit
      ? new Array(2)
      : ['/create-video-lesson', '/create-video-lesson?s=1', '/create-video-lesson?s=2'];
  }

  const backClickHandler = () => {
    backButtonHandlerClick ? backButtonHandlerClick() : back();
  };

  const chooseDescription = () => {
    switch (lessonStep) {
      case 1: {
        if (edit) {
          return createdBy === 'words' ? t('containerEditWords.enterTerms') : t('step.saveTerms');
        } else {
          return createdBy === 'words' ? t('containerEditWords.enterTerms') : t('step.choose');
        }
      }
      case 2:
        return edit ? t('step.editAndSave') : t('step.save');
      case 3:
        return t('step.name');
    }
  };

  useEffect(() => {
    switch (createdBy) {
      case 'video': {
        if (edit) {
          setLessonStep(editVideoStep + 1);
        } else {
          setLessonStep(stepPathArray.indexOf(asPath) + 1);
        }
        break;
      }
      case 'words': {
        if (edit) {
          setLessonStep(1);
        } else {
          setLessonStep(stepPathArray.indexOf(asPath) + 1);
        }
        break;
      }
      default:
        setLessonStep(stepPathArray.indexOf(asPath) + 1);
    }
  }, [asPath, editVideoStep]);

  return (
    <div className={wrapperClasses}>
      {isArrowShow && (
        <div onClick={arrowBackVideoHandler} className={style.arrowVideo}>
          <ArrowBack />
          <div className={style.video}>{t('step.videos')}</div>
        </div>
      )}

      {lessonStep === 1 && <div className={style.emptyButton}></div>}

      {isButtonShow && lessonStep !== 1 && (
        <Button variant={'outlined'} onClick={backClickHandler}>
          {t('step.back')}
        </Button>
      )}

      <div className={style.choose}>
        <div className={style.stepOf}>
          <Typography variant="body3" color={'var(--Grey)'}>
            {t('step.step')}
            {lessonStep}
            {t('step.of')}
            {stepPathArray.length}
          </Typography>
        </div>

        <Typography variant="h4" textAlign={'center'}>
          {chooseDescription()}
        </Typography>
      </div>

      {!isButtonShow && <div className={style.emptyButton}></div>}

      {isButtonShow && (
        <Button
          id={lessonStep === 3 ? 'create' : 'false'}
          onClick={nextButtonHandlerClick}
          variant={'contained'}
        >
          {lessonStep === stepPathArray.length ? finishButton : t('step.next')}
        </Button>
      )}
    </div>
  );
};
