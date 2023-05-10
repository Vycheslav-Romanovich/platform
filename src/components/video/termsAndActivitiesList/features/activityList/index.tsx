import cn from 'classnames';

import { Item } from '../../entities/item';

import styles from './activityList.module.scss';

import { videoActivityName } from '~/constants/sortVideos';
import { secondToHms } from '~/helpers/secondToHm';
import { lessonStore, videoStore } from '~/stores';
import { VideoGameDto } from '~/types/video';

type Props = {
  videoInteractiveName: string;
  timeCode: number;
};

export const ActivityList: React.FC<Props> = ({ videoInteractiveName, timeCode }) => {
  const handleClickToElement = (item) => {
    if (videoStore.state.loaded > 0) {
      videoStore.setTime(item.timeCode);
      lessonStore.setOpenVideoActivityScreen(true);
      lessonStore.setVideoInteractiveName(item.gameType);
      videoStore.setPause(true);
    }
  };

  const handleDeleteElement = (item) => {
    lessonStore.deleteByGameType(item.gameType, item.timeCode);
  };

  const callback = (acc, activityObject) => {
    const checkedValue = `${activityObject.timeCode} ${activityObject.gameType}`;
    if (acc.map[checkedValue]) return acc; // ничего не делаем, возвращаем уже собранное
    acc.map[checkedValue] = true; // помечаем таймкод, как обработанный
    acc.timeCode.push(activityObject); // добавляем объект в массив
    return acc; // возвращаем собранное
  };

  const initData = {
    map: {}, // здесь будут отмечаться обработанные таймкоды
    timeCode: [] as VideoGameDto[], // здесь конечный массив уникальных таймкодов
  };

  const uniqueResponse = lessonStore.videoGameData
    ?.reduce(callback, initData)
    .timeCode?.slice()
    .sort((a, b) => a.timeCode - b.timeCode);

  return (
    <>
      {uniqueResponse.map((item, index: number) => {
        const activityClasses = cn(styles.wordPairs, {
          [styles.activeActivity]:
            videoInteractiveName === item.gameType && timeCode === item.timeCode,
        });

        return (
          <Item
            key={index}
            className={activityClasses}
            elementNumber={++index}
            text={videoActivityName.get(item.gameType)}
            subtext={secondToHms(item.timeCode)}
            isCreateLessonMode={videoStore.state.createLessonMode}
            handleDeleteElement={() => handleDeleteElement(item)}
            handleClickToElement={() => handleClickToElement(item)}
          />
        );
      })}
    </>
  );
};
