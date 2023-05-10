import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import Image from 'next/image';

import styles from './index.module.scss';

import { lessonsImages } from '~/constants/lessonsImages';
import { lessonStore } from '~/stores';
import Modal from '~/UI/modal';

type Props = {
  isOpen: boolean;
  coverEdit: string;
  closeModalChooseCover: () => void;
  setCoverLessons: (event) => void;
  setFileSelected: (event) => void;
  srcCover: string;
};

const LessonCoverModal: FC<Props> = ({
  isOpen,
  coverEdit,
  closeModalChooseCover,
  setCoverLessons,
  setFileSelected,
  srcCover,
}) => {
  const { t } = useTranslation();
  const [defaultCoverSrc, setDefaultCoverSrc] = useState(srcCover);

  const handleDone = () => {
    if (coverEdit !== '') {
      localStorage.removeItem('newCoverLesson');
      setFileSelected(null);
      lessonStore.setCover(coverEdit.toString());
    }
    closeModalChooseCover();
  };

  const submitForm = () => {
    (document as Document).getElementById('file-upload').click();
    setCoverLessons('');
  };

  const loadImageFromDevice = (event) => {
    (document as Document).getElementById('file-upload').click();

    const file = event.target.files[0];

    if (file.size > 4194304) {
      console.error('TOO_LARGE_COVER');
      return;
    }
    setFileSelected(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      localStorage.setItem('newCoverLesson', reader.result.toString());
      setDefaultCoverSrc(reader.result.toString());
      event.target.value = null;
    };
  };

  const clickImage = (src: string) => {
    setDefaultCoverSrc(src);
    setCoverLessons(src);
    setFileSelected(null);
  };

  return (
    <Modal isOpen={isOpen} close={closeModalChooseCover} modalClasses={styles.modalBody}>
      <p className={styles.modalText}>{t('lessonCoverModal.defaultCover')}</p>
      <Image
        className={styles.imgLesson}
        src={defaultCoverSrc}
        alt="Item1"
        width={200}
        height={92}
      />
      <p className={styles.modalTextChoose}>{t('lessonCoverModal.chooseCover')}</p>
      <div className={styles.imgWrapper}>
        {lessonsImages.map((element) => (
          <div
            className={coverEdit === element.src ? styles.coverChoosed : styles.coverImages}
            onClick={() => clickImage(element.src)}
            key={element.id}
          >
            <Image
              className={styles.imgLesson}
              src={element.src}
              alt="coverImages"
              width={200}
              height={92}
            />
          </div>
        ))}
        <div className={styles.imgLessonUpload} onClick={submitForm}>
          <Image src={'/assets/icons/mini-picture.svg'} alt="coverIcon" width={200} height={92} />
          Upload image
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={loadImageFromDevice}
          />
        </div>
      </div>
      <div className={styles.blockButtonBottom}>
        <Button onClick={handleDone} variant="contained" classes={{ root: styles.saveButtonCover }}>
          {t('lessonCoverModal.done')}
        </Button>
      </div>
    </Modal>
  );
};

export default LessonCoverModal;
