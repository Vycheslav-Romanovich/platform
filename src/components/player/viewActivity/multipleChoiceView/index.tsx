import React from 'react';
import { Checkbox, Typography } from '@mui/material';
import { observer } from 'mobx-react';

import styles from './multipleChoiceView.module.scss';

import { lessonStore } from '~/stores';
import { VideoGameDto } from '~/types/video';

type MultipleChoiceViewType = {
  multiple_choice_index: number;
  element: VideoGameDto;
  disable?: boolean;
  checkRightAnswerMode?: boolean;
  buttonMode?: (
    answer: string | boolean,
    element: VideoGameDto
  ) => 'var(--Grey_Blue)' | 'var(--M_Blue)' | 'var(--White)' | 'var(--M_Green)' | 'var(--M_Pink)';
};

export const MultipleChoiceView: React.FC<MultipleChoiceViewType> = observer(
  ({ multiple_choice_index, disable, checkRightAnswerMode, element, buttonMode }) => {
    return (
      <div className={styles.multipleChooseBlock}>
        <Typography variant={'h5'} color={'var(--Grey)'}>
          {multiple_choice_index}. {element.question}
        </Typography>
        {element.answer.option.map((options, index) => {
          const highlightText =
            lessonStore.checkAnswer.chooseOptionAnswer.some((el) => el === options.id) ||
            (element.answer.correct as string[]).some((el) => el === options.id);
          const onChangeHandler = () => {
            return disable
              ? null
              : lessonStore.checkAnswer.chooseOptionAnswer.some((el) => el === options.id)
              ? lessonStore.deleteCheckMultipleChoose(options.id, element.id)
              : lessonStore.setCheckMultipleChoose(options.id, element.id);
          };

          const optionColor = buttonMode
            ? checkRightAnswerMode && highlightText
              ? buttonMode(options.id, element)
              : 'var(--Grey)'
            : (element.answer.correct as string[]).some((m) => m === options.id)
            ? 'var(--M_Green)'
            : 'var(--Grey)';
          return (
            <div key={index} className={styles.optionBlock}>
              <Checkbox
                disableRipple
                checked={lessonStore.checkAnswer.chooseOptionAnswer.some((el) => el === options.id)}
                onClick={onChangeHandler}
                sx={{
                  color: optionColor,
                  '&.Mui-checked': {
                    color: optionColor,
                  },
                }}
              />
              <Typography variant={'body1'} color={optionColor}>
                {options.value}
              </Typography>
            </div>
          );
        })}
      </div>
    );
  }
);
