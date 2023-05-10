import { Item } from '../../entities/item';

import styles from './wordsList.module.scss';

import { lessonStore, videoStore } from '~/stores';

export const WordsList = () => {
  return (
    <>
      {lessonStore?.lessonData?.word?.map((item, index: number) => {
        const handleDelete = () => {
          lessonStore.deleteWordLocal(item.id);
        };

        return (
          <Item
            key={index}
            className={styles.wordPairs}
            elementNumber={++index}
            text={item.word}
            subtext={item.translate}
            isCreateLessonMode={videoStore.state.createLessonMode}
            handleDeleteElement={handleDelete}
          />
        );
      })}
    </>
  );
};
