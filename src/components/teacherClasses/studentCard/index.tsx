import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutline';
// import DoneIcon from '@mui/icons-material/Done';
import RemoveIcon from '@mui/icons-material/Remove';
import { ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { observer } from 'mobx-react';
import Image from 'next/image';

import styles from './index.module.scss';

import Avatar from '~/components/avatar';
import {
  progressActivitiesData,
  progressActivitiesDataWithNullData,
} from '~/constants/progressActivities';
import { teacherClassesStore } from '~/stores';
import { ILessonStatisticsData } from '~/types/teacherClass';

type Props = {
  studentName: string;
  mediaUrl?: string;
  href?: string;
  lessonOwnerAvatar?: string;
  lessonOwnerName?: string;
  isStudentProgress?: boolean;
  coverIndex?: string;
  deleteStudent?: () => void;
  isProgress?: boolean;
  isTeacher?: boolean;
  dataToMap?: Array<ILessonStatisticsData>;
};

export const StudentCard: FC<Props> = observer(
  ({
    mediaUrl,
    studentName,
    lessonOwnerAvatar,
    lessonOwnerName,
    isStudentProgress,
    coverIndex,
    deleteStudent,
    isProgress,
    isTeacher,
    dataToMap,
  }) => {
    const [serviceId, setServiceId] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
      if (mediaUrl) {
        const url = new URL(mediaUrl);
        setServiceId(url.searchParams.get('v'));
      }
    }, [mediaUrl]);

    const resultToDisplay = (data) => {
      if (data !== 0 && !data) {
        return <RemoveIcon />;
      } else {
        return `${data} %`;
      }
    };

    return (
      <Box sx={{ position: 'relative' }}>
        <div className={styles.studentCardWrapper}>
          <div className={styles.studentBlock}>
            {isStudentProgress ? (
              <Image
                className={styles.img}
                src={
                  mediaUrl
                    ? `https://i.ytimg.com/vi/${serviceId}/hqdefault.jpg`
                    : `/assets/lessonImg/${coverIndex ? coverIndex : 1}.svg`
                }
                height={'86px'}
                width={'86px'}
                alt="lesson"
              />
            ) : (
              <Avatar src={lessonOwnerAvatar} size="small" alt={lessonOwnerName} />
            )}
            <Box className={styles.nameBlockWrapper}>
              <span className={styles.title}>{studentName}</span>
              {isTeacher && <span className={styles.teacherTag}>Teacher</span>}
            </Box>
          </div>

          {isProgress &&
            dataToMap &&
            (dataToMap.length > 0
              ? dataToMap.map((item) => {
                  return (
                    <div key={item.id} className={styles.progressData}>
                      {progressActivitiesData.map((itemInner, indexInner) => {
                        return (
                          <div key={indexInner}>
                            <div className={styles.progressDat}>
                              {itemInner.name === 'overAllResult'
                                ? teacherClassesStore.setLessonPercentProgress(item, true)
                                : resultToDisplay(item[progressActivitiesData[indexInner].name])}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              : progressActivitiesDataWithNullData.map((item, index) => {
                  return (
                    <div key={index} className={styles.progressData}>
                      {progressActivitiesData.map((itemInner, indexInner) => {
                        return (
                          <div key={indexInner}>
                            <div className={styles.progressDat}>
                              {resultToDisplay(item[progressActivitiesData[indexInner].name])}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }))}
          {!isProgress && teacherClassesStore.isTeacherClass && (
            <MenuItem onClick={deleteStudent}>
              <ListItemIcon>
                <DeleteOutlineOutlinedIcon />
              </ListItemIcon>
              <Typography variant="text1">{t('lessons.delete')}</Typography>
            </MenuItem>
          )}
        </div>
      </Box>
    );
  }
);
