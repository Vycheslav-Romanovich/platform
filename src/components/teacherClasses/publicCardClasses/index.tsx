import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MoreHoriz } from '@mui/icons-material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutline';
import DoneIcon from '@mui/icons-material/Done';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
// import LinkIcon from '@mui/icons-material/Link';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Button, IconButton, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './index.module.scss';

import Avatar from '~/components/avatar';
import { sortByEnglishLevel } from '~/constants/sortLessons';
import { lessonStore } from '~/stores';
import { DropDownMenu } from '~/UI/dropDownMenu';

type Props = {
  id: number;
  classId?: number;
  teacherLessonId?: number;
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
  isAssigned?: boolean;
  addTeacherLesson?: () => void;
  isTeacher?: boolean;
  isTeacherLesson?: boolean;
  viewProgress: () => void;
};

export const PublicCardClasses: FC<Props> = ({
  id,
  classId,
  teacherLessonId,
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
  isAssigned,
  addTeacherLesson,
  isTeacher,
  isTeacherLesson,
  viewProgress,
}) => {
  const { query } = useRouter();
  const [serviceId, setServiceId] = useState('');
  const [englishLevel, setEnglishLevel] = useState('');
  const { t } = useTranslation();

  const goToLesson = (event) => {
    event.stopPropagation();
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
        (isAssigned ? (
          <Button
            color="primary"
            disabled
            className={styles.assignButton}
            variant="outlined"
            startIcon={<DoneIcon />}
          >
            {t('publicCard.assigned')}
          </Button>
        ) : (
          <Button
            color="primary"
            className={styles.assignButton}
            style={{ position: 'absolute', right: '20px', bottom: '90px' }}
            variant="contained"
            onClick={addTeacherLesson}
          >
            {t('publicCard.assign')}
          </Button>
        ))}
      <Link href={`/teacher-classes/${query.classId}/${teacherLessonId}`} passHref>
        <a>
          <div
            className={`${styles.wrapper} ${
              id === highlightId && showHighlighted ? styles.highlight : null
            }`}
          >
            <Image
              className={styles.img}
              src={
                mediaUrl
                  ? `https://i.ytimg.com/vi/${serviceId}/hqdefault.jpg`
                  : coverIndex != null && coverIndex.length > 1
                  ? coverIndex
                  : `${process.env.PRODUCT_SERVER_URL}/covers/1.svg`
              }
              width={352}
              height={162}
              alt="lesson-cover"
            />
            <Box sx={{ minHeight: '120px' }}>
              <div className={styles.titleWrapper} data-title={titleLesson}>
                <h3 className={styles.title}>{titleLesson}</h3>
              </div>
              <p className={styles.level}>{englishLevel}</p>

              <div className={styles.userWrapper}>
                <p className={styles.numberWords}>
                  {numberWords} {t('publicCard.words')}
                </p>

                {lessonOwnerName && (
                  <div className={styles.nameWrapper}>
                    <Avatar src={lessonOwnerAvatar} size="small" alt={lessonOwnerName} />
                    <p className={styles.nameUser}>{lessonOwnerName}</p>
                  </div>
                )}
              </div>
            </Box>
          </div>
        </a>
      </Link>

      {isTeacherLesson ? (
        isTeacher && (
          <DropDownMenu
            sx={{ position: 'absolute', bottom: '94px', right: '8px' }}
            buttonEl={
              <IconButton>
                <MoreHoriz color="primary" />
              </IconButton>
            }
          >
            <Link href={`/teacher-classes/${classId}?q=progress`} passHref>
              <MenuItem id={'start_lesson'} onClick={viewProgress}>
                <a href={`/teacher-classes/${classId}?q=progress`} className={styles.link}>
                  <ListItemIcon>
                    <LeaderboardOutlinedIcon />
                  </ListItemIcon>
                  <Typography variant="text1">{t('publicCard.viewProgress')}</Typography>
                </a>
              </MenuItem>
            </Link>

            <MenuItem onClick={deleteLesson}>
              <ListItemIcon>
                <DeleteOutlineOutlinedIcon />
              </ListItemIcon>
              <Typography variant="text1">{t('publicCard.deleteClass')}</Typography>
            </MenuItem>
          </DropDownMenu>
        )
      ) : isReceived ? (
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
          <Link href={`/lessons/${id}/edit`} passHref>
            <MenuItem onClick={() => lessonStore.getLessonData(id)}>
              <a href={`/lessons/${id}/edit`} className={styles.link}>
                <ListItemIcon>
                  <DriveFileRenameOutlineIcon />
                </ListItemIcon>
                <Typography variant="text1">{t('publicCard.edit')}</Typography>
              </a>
            </MenuItem>
          </Link>

          <Link
            href={
              isTeacherClass
                ? isTeacher
                  ? `/lessons/${id}?q=teacher`
                  : `/lessons/${id}?q=student`
                : `/lessons/${id}`
            }
            passHref
          >
            <MenuItem id={'start_lesson'} onClick={goToLesson}>
              <a
                href={
                  isTeacherClass
                    ? isTeacher
                      ? `/lessons/${id}?q=teacher`
                      : `/lessons/${id}?q=student`
                    : `/lessons/${id}`
                }
                className={styles.link}
              >
                <ListItemIcon>
                  <PlayCircleOutlineIcon />
                </ListItemIcon>
                <Typography variant="text1">{t('publicCard.startLesson')}</Typography>
              </a>
            </MenuItem>
          </Link>

          <MenuItem onClick={deleteLesson}>
            <ListItemIcon>
              <DeleteOutlineOutlinedIcon />
            </ListItemIcon>
            <Typography variant="text1">{t('publicCard.delete')}</Typography>
          </MenuItem>
        </DropDownMenu>
      ) : null}
    </Box>
  );
};
