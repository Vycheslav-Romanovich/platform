import * as React from 'react';
import { useTranslation } from 'react-i18next';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import CircleIcon from '@mui/icons-material/Circle';
import { Box, Typography } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';

import MainDesktop from '~/assets/content/mainHome.jpg';
import MainMobile from '~/assets/content/mainHomeMobile.jpg';
import TestDesktop from '~/assets/content/testHome.jpg';
import TestMobile from '~/assets/content/testHomeMobile.jpg';
import TrackDesktop from '~/assets/content/trackHome.jpg';
import TrackMobile from '~/assets/content/trackHomeMobile.jpg';

import { Accordion } from '../../accordion';

import styles from './sliderBanner.module.scss';

import { eLangTest } from '~/constants/links';
import { accordionBtn } from '~/constants/routes';
import { mainStore, userStore } from '~/stores';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
  {
    imgPath: mainStore.isMobile ? MainMobile : MainDesktop,
    label: 'Main',
  },
  {
    imgPath: mainStore.isMobile ? TestMobile : TestDesktop,
    label: 'Test',
  },
  {
    imgPath: mainStore.isMobile ? TrackMobile : TrackDesktop,
    label: 'Track',
  },
];

const themeCustomIcon = createTheme({
  components: {
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          position: 'relative',
          bottom: '25px',
          height: 'unset',
          backgroundColor: 'transparent',
          marginRight: mainStore.isMobile && '5px',
          justifyContent: mainStore.isMobile && 'flex-end',
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          color: 'var(--White) !important',
          opacity: 0.5,
          padding: '0px 10px !important',
          minWidth: 'unset !important',
          maxWidth: '10px !important',
          '&.Mui-selected': {
            color: 'var(--White) !important',
            opacity: 1,
          },
        },
      },
    },
  },
});

function SliderBanner() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState(0);
  const icons = Array.from({ length: images.length }, (_, index) => ({
    key: index,
    icon: <CircleIcon style={{ height: '10px', width: '10px' }} />,
  }));

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Box sx={{ flexGrow: 1 }} position="relative">
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        interval={4000}
      >
        {images.map((step, index) => (
          <div key={index}>
            {Math.abs(activeStep - index) <= 3 ? (
              <Box
                component="img"
                sx={{
                  display: 'block',
                  position: 'relative',
                  overflow: 'hidden',
                  width: '100%',
                }}
                src={step.imgPath.src}
                alt={step.label}
              />
            ) : null}
            {step.label === 'Test' ? (
              <Button
                variant="contained"
                size="large"
                className={styles.primaryBtn}
                href={eLangTest}
                target="_blank"
                sx={{ zIndex: 1 }}
              >
                <Typography
                  variant={'h5'}
                  className={styles.buttonText}
                  component={'span'}
                  sx={{ textAlign: 'center' }}
                >
                  {t('header.titleTest')}
                </Typography>
              </Button>
            ) : (
              <Accordion
                headerName={t('header.createLesson')}
                itemToMap={accordionBtn}
                className={styles.accordionStyles}
                nameData="accordionBtn"
              />
            )}
            {step.label === 'Track' && (
              <Button
                variant="contained"
                size="large"
                className={styles.trackBtn}
                onClick={() =>
                  userStore.user.role === 'teacher'
                    ? router.push('/teacher-classes?create=true')
                    : router.push('/teacher-classes')
                }
                sx={{ zIndex: 1 }}
              >
                {t('header.createClass')}
              </Button>
            )}
          </div>
        ))}
      </AutoPlaySwipeableViews>

      <ThemeProvider theme={themeCustomIcon}>
        <BottomNavigation
          showLabels
          value={activeStep}
          onChange={(event, newValue) => {
            setActiveStep(newValue);
          }}
        >
          {icons.map((step) => {
            return <BottomNavigationAction icon={step.icon} key={step.key} />;
          })}
        </BottomNavigation>
      </ThemeProvider>
    </Box>
  );
}

export default SliderBanner;
