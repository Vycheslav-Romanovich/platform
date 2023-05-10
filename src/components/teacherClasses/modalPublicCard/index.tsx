import { FC, memo, useEffect, useState } from 'react';
import { MoreHoriz } from '@mui/icons-material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutline';
import DoneIcon from '@mui/icons-material/Done';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Button, IconButton, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';

import styles from './index.module.scss';

import Avatar from '~/components/avatar';
import { sortByEnglishLevel } from '~/constants/sortLessons';
import { lessonStore } from '~/stores';
import { DropDownMenu } from '~/UI/dropDownMenu';

type Props = {
  id: number;
  titleLesson: string;
  mediaUrl?: string;
  level?: string;
  numberWords?: number;
  href?: string;
  lessonOwnerAvatar?: string;
  lessonOwnerName?: string;
  isReceived?: boolean;
  isMyLesson?: boolean;
  coverIndex?: string;
  deleteLesson?: () => void;
  highlightId?: number;
  showHighlighted?: boolean;
  isTeacherClass?: boolean;
  addTeacherLesson?: () => void;
  teacherClassesArr?: boolean;
};

const ModalPublicCard: FC<Props> = ({
  id,
  mediaUrl,
  titleLesson,
  level,
  numberWords,
  lessonOwnerAvatar,
  lessonOwnerName,
  isReceived,
  isMyLesson,
  coverIndex,
  deleteLesson,
  highlightId,
  showHighlighted,
  isTeacherClass,
  addTeacherLesson,
  teacherClassesArr,
}) => {
  const [serviceId, setServiceId] = useState('');
  const [englishLevel, setEnglishLevel] = useState('');

  const goToLesson = (event) => {
    event.stopPropagation();
    lessonStore.setScrollToGames(true);
  };

  useEffect(() => {
    if (mediaUrl) {
      const url = new URL(mediaUrl);
      setServiceId(url.searchParams.get('v'));
    }
  }, [mediaUrl]);

  useEffect(() => {
    Object.values(sortByEnglishLevel).forEach((el) => {
      if (el.value === level) {
        setEnglishLevel(el.lable);
      }
    });
  }, [level]);

  return (
    <Box sx={{ position: 'relative' }}>
      {isTeacherClass &&
        (teacherClassesArr ? (
          <Button
            disabled
            variant="contained"
            startIcon={<DoneIcon />}
            style={{
              position: 'absolute',
              right: '20px',
              bottom: '66px',
              height: '28px',
            }}
          >
            Assigned
          </Button>
        ) : (
          <Button
            color="primary"
            style={{
              position: 'absolute',
              right: '20px',
              bottom: '66px',
              height: '28px',
              zIndex: '999',
            }}
            variant="contained"
            onClick={addTeacherLesson}
          >
            Assign
          </Button>
        ))}

      <div
        className={`${styles.wrapper} ${
          id === highlightId && showHighlighted ? styles.highlight : null
        }`}
      >
        <Image
          className={styles.img}
          width={352}
          height={162}
          src={
            mediaUrl
              ? `https://i.ytimg.com/vi/${serviceId}/hqdefault.jpg`
              : coverIndex != null && coverIndex.length > 1
              ? coverIndex
              : `${process.env.PRODUCT_SERVER_URL}/covers/1.svg`
          }
          alt="lessonCover"
        />
        <Box>
          <div className={styles.titleWrapper} data-title={titleLesson}>
            <h3 className={styles.title}>{titleLesson}</h3>
          </div>
          <p className={styles.level}>{englishLevel}</p>

          <div className={styles.userWrapper}>
            <p className={styles.numberWords}>{numberWords} words</p>

            {lessonOwnerName && (
              <div className={styles.nameWrapper}>
                <Avatar src={lessonOwnerAvatar} size="small" alt={lessonOwnerName} />
                <p className={styles.nameUser}>{lessonOwnerName}</p>
              </div>
            )}
          </div>
        </Box>
      </div>

      {isReceived ? (
        <IconButton
          aria-label="delete received lesson"
          sx={{ position: 'absolute', bottom: '94px', right: '8px' }}
          onClick={deleteLesson}
        >
          <DeleteOutlineOutlinedIcon color="error" />
        </IconButton>
      ) : isMyLesson ? (
        <DropDownMenu
          sx={{ position: 'absolute', bottom: '94px', right: '8px' }}
          buttonEl={
            <IconButton>
              <MoreHoriz color="primary" />
            </IconButton>
          }
        >
          <MenuItem onClick={() => lessonStore.getLessonData(id)}>
            <ListItemIcon>
              <DriveFileRenameOutlineIcon />
            </ListItemIcon>
            <Typography variant="text1">Edit</Typography>
          </MenuItem>

          <MenuItem id={'start_lesson'} onClick={goToLesson}>
            <ListItemIcon>
              <PlayCircleOutlineIcon />
            </ListItemIcon>
            <Typography variant="text1">Start the lesson</Typography>
          </MenuItem>

          <MenuItem onClick={deleteLesson}>
            <ListItemIcon>
              <DeleteOutlineOutlinedIcon />
            </ListItemIcon>
            <Typography variant="text1">Delete</Typography>
          </MenuItem>
        </DropDownMenu>
      ) : null}
    </Box>
  );
};

export default memo(ModalPublicCard);
