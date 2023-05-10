import React, { FC, useEffect, useState } from 'react';
import { MoreHoriz } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutline';
import DoneIcon from '@mui/icons-material/Done';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Button, IconButton, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { observer } from 'mobx-react';
import Image from 'next/image';
import Link from 'next/link';

import styles from './index.module.scss';

import Avatar from '~/components/avatar';
import { sortByEnglishLevel } from '~/constants/sortLessons';
import { FirstLetterAvatar } from '~/entities/FirstLetterAvatar';
import { DropDownMenu } from '~/UI/dropDownMenu';

type Props = {
  id: number;
  titleLesson?: string;
  mediaUrl?: string;
  level?: string;
  studentCount?: number | string;
  href?: string;
  lessonOwnerAvatar?: string;
  lessonOwnerName?: string;
  avatarUrl?: string;
  deleteClass?: () => void;
  inviteStudents?: () => void;
  highlightId?: number;
  showHighlighted?: boolean;
  editClass?: () => void;
  assignLesson?: (id: any) => void;
  isModal?: boolean;
  checkForClassOwner?: boolean;
  askToRemoveStudent?: () => void;
  assignedLessonsArr?: boolean;
};

export const ClassCard: FC<Props> = observer(
  ({
    id,
    mediaUrl,
    titleLesson,
    level,
    studentCount,
    lessonOwnerAvatar,
    lessonOwnerName,
    avatarUrl,
    deleteClass,
    highlightId,
    showHighlighted,
    inviteStudents,
    editClass,
    isModal,
    assignLesson,
    checkForClassOwner,
    askToRemoveStudent,
    assignedLessonsArr,
  }) => {
    const [serviceId, setServiceId] = useState('');
    const [englishLevel, setEnglishLevel] = useState('');

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
        <Link href={`/teacher-classes/${id}`} passHref>
          <a>
            <div
              className={`${styles.wrapper} ${
                id === highlightId && showHighlighted ? styles.highlight : null
              }`}
            >
              <div className={styles.imgContainer}>
                {avatarUrl ? (
                  <Image
                    width={'88px'}
                    height={'86px'}
                    className={styles.img}
                    src={avatarUrl}
                    alt="classCover"
                  />
                ) : (
                  titleLesson && <FirstLetterAvatar title={titleLesson} />
                )}
              </div>

              <Box className={styles.nameBlockWrapper}>
                <h3 className={styles.title}>{titleLesson}</h3>
                {!checkForClassOwner ? (
                  <>
                    <span className={styles.numberWords}>{studentCount} students</span>
                    <span className={styles.level}>{englishLevel}</span>
                  </>
                ) : (
                  <div className={styles.nameWrapper}>
                    <Avatar src={lessonOwnerAvatar} size="small" alt={lessonOwnerName} />
                    <span>{lessonOwnerName}</span>
                  </div>
                )}
              </Box>
            </div>
          </a>
        </Link>

        {isModal ? (
          !assignedLessonsArr ? (
            <Button
              onClick={assignLesson}
              sx={{ position: 'absolute', bottom: '45px', right: '32px' }}
              variant="contained"
              size="large"
            >
              Assign
            </Button>
          ) : (
            <Button
              disabled
              variant="contained"
              startIcon={<DoneIcon />}
              style={{
                position: 'absolute',
                bottom: '45px',
                right: '32px',
              }}
              size="large"
            >
              Assigned
            </Button>
          )
        ) : !checkForClassOwner ? (
          <DropDownMenu
            sx={{ position: 'absolute', bottom: '45px', right: '32px', cursor: 'pointer' }}
            buttonEl={
              <IconButton>
                <MoreHoriz color="primary" />
              </IconButton>
            }
          >
            <MenuItem onClick={editClass}>
              <ListItemIcon>
                <DriveFileRenameOutlineIcon />
              </ListItemIcon>
              <Typography variant="text1">Edit</Typography>
            </MenuItem>

            <Link href={`/teacher-classes/${id}?q=students`} passHref>
              <MenuItem id={'invite_students'} className={styles.link} onClick={inviteStudents}>
                <a href={`/teacher-classes/${id}`} className={styles.link}>
                  <ListItemIcon>
                    <PersonAddAlt1Icon />
                  </ListItemIcon>
                  <Typography variant="text1">Invite students</Typography>
                </a>
              </MenuItem>
            </Link>

            <MenuItem id={'assign_lesson'} onClick={assignLesson}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <Typography variant="text1">Assign a lesson from Library</Typography>
            </MenuItem>

            <MenuItem onClick={deleteClass}>
              <ListItemIcon>
                <DeleteOutlineOutlinedIcon />
              </ListItemIcon>
              <Typography variant="text1">Delete</Typography>
            </MenuItem>
          </DropDownMenu>
        ) : (
          <LogoutIcon
            sx={{ position: 'absolute', bottom: '45px', right: '32px', cursor: 'pointer' }}
            onClick={askToRemoveStudent}
          />
        )}
      </Box>
    );
  }
);
