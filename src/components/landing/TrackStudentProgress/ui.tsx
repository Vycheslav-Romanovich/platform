import { Button, Typography } from '@mui/material';
import Image from 'next/image';

import CircleIcon from '~/assets/icons/landing/circle.svg';
import ForeFingerLeftIcon from '~/assets/icons/landing/forefingerLeft.svg';
import ForeFingerRightIcon from '~/assets/icons/landing/forefingerRight.svg';
import LensIcon from '~/assets/icons/landing/lens.svg';
import LigthBulbIcon from '~/assets/icons/landing/lightBulb.svg';
import StarIcon from '~/assets/icons/landing/star.svg';
import WaveLongIcon from '~/assets/icons/landing/waveLong.svg';
import WaveShortIcon from '~/assets/icons/landing/waveShort.svg';

import styles from './styles.module.scss';

import { sendEvent } from '~/helpers/sendToGtm';

type Props = {
  id?: string;
  showButtonCreateLesson?: boolean;
};

export const TrackStudentProgress: React.FC<Props> = ({ id, showButtonCreateLesson }) => {
  const handleClickButtonSignup = () => {
    sendEvent('create_lesson', { text: 'Create a lesson' });
  };

  return (
    <section className={styles.progressContainer} id={id}>
      <div className={styles.gradientBg} />

      <Typography variant={'h2'} sx={{ textAlign: 'center' }}>
        Track students&apos; progress
      </Typography>

      <Typography
        variant={'body2'}
        color={'var(--Grey)'}
        sx={{ marginTop: '16px', textAlign: 'center', maxWidth: '548px' }}
      >
        Create classes to assess how well students have consolidated what they have learned
      </Typography>

      <div className={styles.progress}>
        <div className={styles.progressPic}>
          <div className={styles.decorationWrapperTop}>
            <div style={{ bottom: '30px' }}>
              <WaveLongIcon width="48" height="25" />
            </div>

            <div style={{ top: '30px', right: '10px' }}>
              <StarIcon width="19" height="19" />
            </div>
          </div>

          <Image
            src={'/images/landingPictures/progressPic.png'}
            alt={'picture progress page'}
            width={697}
            height={447}
          />

          <div className={styles.decorationWrapperBottom}>
            <div className={styles.wave} style={{ transform: 'rotate(-38.86deg)' }}>
              <WaveShortIcon width="23" height="16" />
            </div>

            <div style={{ bottom: '30px', right: '10px' }}>
              <CircleIcon width="16" height="16" />
            </div>

            <div style={{ top: '50px', right: '50px' }} className={styles.star}>
              <StarIcon width="21" height="21" />
            </div>
          </div>
        </div>

        <div className={styles.tipsWrapper}>
          <div className={styles.progressTipLeft}>
            <LensIcon width="32" height="32" />
            <Typography variant={'h4'}>Track</Typography>
            <Typography sx={{ maxWidth: '260px' }} variant={'text1'} color={'var(--Grey)'}>
              See which students began or completed their study sessions
            </Typography>
          </div>
          <div className={styles.progressTipRight}>
            <LigthBulbIcon width="32" height="32" />

            <Typography variant={'h4'}>Conclude</Typography>

            <Typography sx={{ maxWidth: '260px' }} variant={'text1'} color={'var(--Grey)'}>
              Learn how students are studying and what material needs review
            </Typography>
          </div>
        </div>
      </div>

      {showButtonCreateLesson && (
        <div className={styles.descriptionContainer}>
          <ForeFingerRightIcon />

          <Button
            variant="contained"
            size="large"
            color="primary"
            href="/signup"
            sx={{ zIndex: 1, padding: '16px', marginTop: '24px' }}
            onClick={handleClickButtonSignup}
          >
            <Typography
              variant={'h5'}
              component={'span'}
              sx={{ textAlign: 'center', fontWeight: 400 }}
            >
              Create a lesson
            </Typography>
          </Button>

          <ForeFingerLeftIcon />
        </div>
      )}
    </section>
  );
};
