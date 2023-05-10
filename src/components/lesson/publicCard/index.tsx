import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MoreHoriz } from '@mui/icons-material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import LinkIcon from '@mui/icons-material/Link';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import { IconButton, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import Link from 'next/link';

import VideoLessonIcon from '~/assets/icons/videoLessonIcon.svg';

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
  rating?: number;
  numberWords?: number;
  href?: string;
  lessonOwnerAvatar?: string;
  lessonOwnerName?: string;
  isReceived?: boolean;
  isMyLesson?: boolean;
  coverIndex?: string;
  deleteLesson?: () => void;
  assignToClass?: () => void;
  highlightId?: number;
  showHighlighted?: boolean;
};

export const PublicCard: React.FC<Props> = ({
  id,
  mediaUrl,
  titleLesson,
  level,
  rating,
  numberWords,
  lessonOwnerAvatar,
  lessonOwnerName,
  isReceived,
  isMyLesson,
  coverIndex,
  deleteLesson,
  assignToClass,
  highlightId,
  showHighlighted,
}) => {
  const [serviceId, setServiceId] = useState('');
  const [englishLevel, setEnglishLevel] = useState('');
  const { t } = useTranslation();

  const copyLesson = (event) => {
    event.stopPropagation();
    navigator.clipboard.writeText(`https://${window.location.host}/lessons/${id}?shared=true`);
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
      <Link href={`/lessons/${id}`} passHref>
        <a>
          <div
            className={`${styles.wrapper} ${
              id === highlightId && showHighlighted ? styles.highlight : null
            }`}
          >
            {mediaUrl && (
              <VideoLessonIcon
                style={{
                  position: 'absolute',
                  width: '50px',
                  height: '50px',
                  top: '-4px',
                  right: '-6px',
                  zIndex: 1,
                }}
              />
            )}
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
              alt="lesson"
            />
            <Box sx={{ height: '100%', minHeight: '120px' }}>
              <div className={styles.titleWrapper} data-title={titleLesson}>
                <h3 className={styles.title}>{titleLesson}</h3>
              </div>
              <div className={styles.levelAndRating}>
                {englishLevel}
                {rating && (
                  <div className={styles.starsRating}>
                    <StarIcon sx={{ color: 'var(--Grey_Blue)', width: 20, height: 20 }} />
                    <p className={styles.rating}>{rating.toFixed(1)}</p>
                  </div>
                )}
              </div>

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
          <MenuItem id={'copy_link'} className={styles.link} onClick={copyLesson}>
            <ListItemIcon>
              <LinkIcon />
            </ListItemIcon>
            <Typography variant="text1">{t('publicCard.copyLink')}</Typography>
          </MenuItem>

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

          <MenuItem id={'assign_lesson_to_class'} onClick={assignToClass}>
            <ListItemIcon>
              <PlayCircleOutlineIcon />
            </ListItemIcon>
            <Typography variant="text1">{t('publicCard.startLesson')}</Typography>
          </MenuItem>

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
