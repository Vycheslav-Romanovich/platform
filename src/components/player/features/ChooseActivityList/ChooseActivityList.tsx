import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';

import { InfoCard } from '../../entities/InfoCard/InfoCard';

import styles from './ChooseActivityList.module.scss';

import { videoInteractiveDesc } from '~/constants/video-lesson-steps';
import { lessonStore, openEndedGameStore, videoStore } from '~/stores';
import { VideoGameType } from '~/types/game';

export const ChooseActivityList: React.FC = () => {
  const { t } = useTranslation();
  const addedQuestionHandler = (dataBaseName: VideoGameType, timeCode: number) => {
    lessonStore.setVideoInteractiveName(dataBaseName);

    const isExistActivity = openEndedGameStore.gameData.some(
      (data) => data.gameType === dataBaseName && data.timeCode === timeCode
    );

    if (!isExistActivity) {
      return openEndedGameStore.addNewQuestion(dataBaseName);
    }

    return;
  };

  return (
    <>
      <Typography
        sx={{
          fontSize: { xs: '16px', sm: '28px' },
          fontWeight: { xs: 400, sm: 600 },
          textAlign: 'center',
          marginBottom: '24px',
        }}
      >
        {t('player.chooseActivity')}
      </Typography>

      <div className={styles.activityContainer}>
        {videoInteractiveDesc.map(({ Picture, dataBaseName }, index) => {
          return (
            <InfoCard
              key={index}
              text={dataBaseName}
              Icon={Picture}
              onClick={() => addedQuestionHandler(dataBaseName, videoStore.state.time)}
            />
          );
        })}
      </div>
    </>
  );
};
