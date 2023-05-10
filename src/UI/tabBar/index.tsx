import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Tab, Tabs } from '@mui/material';
import { useRouter } from 'next/router';

import { teacherClassesStore } from '~/stores';
import lightThemeOptions from '~/theme/lightThemeOptions';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

type Props = {
  data: {
    title: string;
    path: string;
    query?: string;
    activePath?: string;
    addition?: { onClick: (cb: () => void) => void; icon: JSX.Element };
  }[];
  isPrem?: boolean;
  nameData: string;
  isHeader?: boolean;
  myLesson?: boolean;
  isTeach?: boolean;
  getNumberTab?: (tab: number) => void;
};

const TabBar: React.FC<Props> = ({
  data,
  nameData,
  isHeader = false,
  getNumberTab,
  isPrem,
  myLesson,
  isTeach,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [value, setValue] = useState(null);

  const paths = data.map((el) => el.path);
  const pathsSecond = data.map((el) => el.activePath);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    getNumberTab && getNumberTab(newValue);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    path: string,
    onClick: (cb) => void
  ) => {
    event.preventDefault();
    if (isTeach) {
      teacherClassesStore.setMyLessonPath(path);
      path === '/lessons?q=created' ? setValue(0) : setValue(1);
    } else {
      if (onClick) {
        setValue(paths.indexOf(router.asPath));

        return onClick(() => router.push(path));
      }

      router.push(path);
    }
  };

  const calculateValue = () => {
    if (isTeach) {
      if (teacherClassesStore.myLessonPath === '/lessons?q=created') {
        return 0;
      } else {
        return 1;
      }
    } else {
      if (value === -1 && pathsSecond.indexOf(router.asPath) === -1) {
        const arr = paths.map((item) => router.pathname.includes(item));
        if (!myLesson && router.pathname === '/lessons/[lessonId]') {
          return 1;
        }
        if (router.pathname === '/library/apps') {
          return 1;
        }
        return arr.indexOf(true);
      }
      return value === -1 ? pathsSecond.indexOf(router.pathname) : value;
    }
  };

  useEffect(() => {
    setValue(paths.indexOf(router.asPath));
  }, [router.asPath]);

  return (
    <Box sx={{ width: '100%', mb: isHeader ? 0 : isTeach ? 0 : '40px' }}>
      <Box
        sx={{
          height: isHeader ? '100%' : 'auto',
          borderBottom: isHeader ? 0 : 1,
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={calculateValue()}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{ height: isHeader ? '100%' : 'auto' }}
        >
          {data.map(({ title, path, addition }, index) => {
            return (
              <Tab
                sx={{
                  minHeight: 'initial',
                  fontSize: {
                    fontSize: isHeader ? 16 : 20,
                    [lightThemeOptions.breakpoints.down('sm')]: {
                      fontSize: 16,
                    },
                    [lightThemeOptions.breakpoints.down('xs')]: {
                      fontSize: 14,
                    },
                  },
                }}
                key={index}
                component="a"
                href={path}
                label={t(`routes.${nameData}.${title}`)}
                disableRipple
                iconPosition="start"
                icon={!isPrem && addition?.icon && <>{addition?.icon}</>}
                {...a11yProps(index)}
                onClick={(event) => handleClick(event, path, addition?.onClick)}
              />
            );
          })}
        </Tabs>
      </Box>
    </Box>
  );
};

export default memo(TabBar);
