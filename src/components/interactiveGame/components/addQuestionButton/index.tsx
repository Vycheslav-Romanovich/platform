import React from 'react';
import { Button } from '@mui/material';
import { observer } from 'mobx-react';

import { openEndedGameStore, videoStore } from '~/stores';
import { VideoGameType } from '~/types/video';

type AddQuestionButtonType = {
  gameType: VideoGameType;
  textButton: string;
  customStyle: string;
  timeCode?: number;
};

export const AddQuestionButton: React.FC<AddQuestionButtonType> = observer(
  ({ customStyle, textButton, gameType, timeCode }) => {
    const addedQuestionHandler = (gameType: VideoGameType) => {
      const checkedArrayLength = openEndedGameStore.gameData.filter(
        (f) => f.timeCode === Math.floor(videoStore.state.time) && f.gameType === gameType
      ).length;

      if (checkedArrayLength < 10) {
        openEndedGameStore.addNewQuestion(gameType, timeCode);
      } else return false;
    };

    return (
      <Button
        className={customStyle}
        sx={{ height: '48px', color: 'var(--Grey_Blue)' }}
        onClick={() => addedQuestionHandler(gameType)}
      >
        {textButton}
      </Button>
    );
  }
);
