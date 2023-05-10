import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { Button, Typography } from '@mui/material';
import { observer } from 'mobx-react';

import { AddQuestionButton } from '../interactiveGame/components/addQuestionButton';
import { MultipleChoice } from '../interactiveGame/components/multipleChoice';
import { QuestionBlock } from '../interactiveGame/components/questionBlock';
import { TrueFalseBlock } from '../interactiveGame/components/trueFalseBlock';

import styles from './index.module.scss';

import { MultipleChoiceView } from '~/components/player/viewActivity/multipleChoiceView';
import { OpenEndQuestionView } from '~/components/player/viewActivity/openEndQuestionView';
import { TrueFalseView } from '~/components/player/viewActivity/trueFalseView';
import { secondToHms } from '~/helpers/secondToHm';
import { lessonStore, openEndedGameStore } from '~/stores';
import { VideoGameType } from '~/types/video';

export const ActivityBlockByTimeCode: React.FC<{
  dataObject: { timeCode: number; gameType: VideoGameType };
}> = observer(({ dataObject }) => {
  const titleText = (gameType: VideoGameType) => {
    switch (gameType) {
      case 'multiple_choice':
        return 'Choose the correct option(s)';
      case 'open_end_question':
        return 'Answer the question(s)';
      case 'true_or_false':
        return 'Choose whether the statement \n' + 'is true or false';
    }
  };

  const [editMode, setEditMode] = useState<boolean>(false);
  const { t } = useTranslation();
  let true_or_false_index = 0;
  let multiple_choice_index = 0;
  let open_end_question_index = 0;

  return (
    <div className={styles.step3ActivityContainer}>
      <div className={styles.textBlock}>
        <Typography className={styles.firstElement} variant={'h5'} color={'var(--Blue)'}>
          {secondToHms(dataObject.timeCode)}
        </Typography>
        <Typography className={styles.secondElement} variant={'h3'}>
          {titleText(dataObject.gameType)}
        </Typography>
        {!editMode && (
          <>
            <div className={styles.pencil} onClick={() => setEditMode(true)}>
              <DriveFileRenameOutlineIcon />
            </div>

            {lessonStore.videoGameData.length > 3 && (
              <div
                className={styles.pencil}
                onClick={() =>
                  lessonStore.deleteByGameType(dataObject.gameType, dataObject.timeCode)
                }
              >
                <DeleteIcon />
              </div>
            )}
          </>
        )}
      </div>
      <div className={styles.step3ActivityBox}>
        {openEndedGameStore.gameData
          ?.slice()
          .sort((a, b) => a.gameType.localeCompare(b.gameType))
          .filter((f) => f.timeCode === dataObject.timeCode)
          .map((element, index) => {
            element.gameType === 'true_or_false' && true_or_false_index++;
            element.gameType === 'multiple_choice' && multiple_choice_index++;
            element.gameType === 'open_end_question' && open_end_question_index++;
            return (
              <div key={index}>
                {element.gameType === 'open_end_question' &&
                  (editMode ? (
                    <div className={styles.trueFalseContainer}>
                      <QuestionBlock
                        id={element.id}
                        initialStateQuestion={element.question}
                        index={index}
                        key={index}
                      />
                    </div>
                  ) : (
                    <div style={{ padding: '14px 20px' }}>
                      <OpenEndQuestionView
                        open_end_question_index={open_end_question_index}
                        question={element.question}
                      />
                    </div>
                  ))}
                {element.gameType === 'true_or_false' &&
                  (editMode ? (
                    <div className={styles.trueFalseContainer}>
                      <TrueFalseBlock
                        id={element.id}
                        initialStateQuestion={element.question}
                        index={index + 1}
                        key={index}
                        answer={element.answer}
                      />
                    </div>
                  ) : (
                    <TrueFalseView
                      customStyles={styles.customStyles}
                      true_or_false_index={true_or_false_index}
                      element={element}
                      disable={true}
                    />
                  ))}
                {element.gameType === 'multiple_choice' &&
                  (editMode ? (
                    <div className={styles.trueFalseContainer}>
                      <MultipleChoice
                        id={element.id}
                        initialStateQuestion={element.question}
                        index={index}
                        key={index}
                        answer={element.answer}
                      />
                    </div>
                  ) : (
                    <MultipleChoiceView
                      disable
                      multiple_choice_index={multiple_choice_index}
                      element={element}
                    />
                  ))}
              </div>
            );
          })}
      </div>
      {editMode && (
        <div className={styles.questionButtonBlock}>
          <AddQuestionButton
            timeCode={dataObject.timeCode}
            textButton={t('interactiveGame.textButtonAdd')}
            gameType={dataObject.gameType}
            customStyle={styles.addTrueFalseButton}
          />
          <Button
            variant={'contained'}
            onClick={() => {
              setEditMode(false);
              lessonStore.setVideoGameData();
            }}
          >
            {t('account.save')}
          </Button>
        </div>
      )}
    </div>
  );
});
