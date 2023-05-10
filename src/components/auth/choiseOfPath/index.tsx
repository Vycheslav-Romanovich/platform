import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, CircularProgress, FormHelperText } from '@mui/material';
import Typography from '@mui/material/Typography';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Student from '~/assets/icons/auth/student.svg';
import Teacher from '~/assets/icons/auth/teacher.svg';

import styles from './index.module.scss';

import api from '~/api_client/api';
import { SelectLanguage } from '~/components/selectLanguage';
import { SEND_PULSE_BOOK_ID } from '~/constants/sendPulseBook';
import { SubscriptionPeriod } from '~/features/SubscriptionCard';
import { sendEvent } from '~/helpers/sendToGtm';
import { userStore } from '~/stores';

type Props = {
  nextHref?: string;
  isGoogleReg?: boolean;
  setUserInfo?: (role: 'student' | 'teacher', language: string) => void;
};

export const ChoiseOfPath: React.FC<Props> = ({ setUserInfo, isGoogleReg, nextHref }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [userRoleAndLang, setUserRoleAndLang] = useState<{
    role: 'student' | 'teacher';
    to: string;
  }>({
    role: 'teacher',
    to: '',
  });
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);

  const wrapper = classNames('', {
    [styles.wrapper]: isGoogleReg,
  });

  const changeLanguage = (event) => {
    setUserRoleAndLang({ ...userRoleAndLang, to: event.target.value });
    setError(false);
  };

  const changeRole = (role: 'student' | 'teacher') => {
    setUserRoleAndLang({ ...userRoleAndLang, role });
  };

  const register = async () => {
    try {
      setLoading(true);
      const id_token = router.query.t as string;
      const nextHrefQuery = router.query.next as string;
      const isRegisterCred = {
        appService: 'web',
        accessToken: id_token,
        ...userRoleAndLang,
      };

      const googleOauth = await api.googleOauth(isRegisterCred);
      const token = googleOauth.data.token as string;
      const userData = await api.info(token);

      userStore.login({ ...userData.data, token });

      // post user to sendpulse book
      process.env.APP_ENV === 'production' &&
        api.setInSendPulseBook({
          email: userData.data.email,
          bookId:
            userRoleAndLang.role === 'teacher'
              ? SEND_PULSE_BOOK_ID.TEACHER
              : SEND_PULSE_BOOK_ID.STUDENT,
        });

      sendEvent('sign_up', { method: 'Google' }),
        userRoleAndLang.role === 'teacher' && sendEvent('role_teacher_choose'),
        userRoleAndLang.role === 'student' && sendEvent('role_student_choose'),
        sendEvent('native_language_choose', { native_language: userRoleAndLang.to });

      if (userData.data.avatar) {
        userStore.setAvatar(`${userData.data.avatar}`);
      } else {
        await api
          .updateAvatar({ avatarUrl: googleOauth.data.avatar })
          .then(() => userStore.setAvatar(googleOauth.data.avatar))
          .catch((e) => {
            console.error(e);
          });
      }

      if (nextHrefQuery !== 'null') {
        router.push(nextHrefQuery);
      } else {
        router.replace('/');
      }
      setLoading(false);
    } catch (error) {
      if (error.error !== 'popup_closed_by_user') {
        console.error(error);
      }
    }
  };

  const handleClickNextButton = () => {
    if (userRoleAndLang.to !== '') {
      if (isGoogleReg) {
        register();
      } else {
        setUserInfo(userRoleAndLang.role, userRoleAndLang.to);
      }
    } else {
      setError(true);
    }
  };

  return (
    <div className={wrapper}>
      <Typography variant={'h2'} className={styles.call}>
        {t('choiseOfPath.lets')}{' '}
      </Typography>

      <Typography variant={'body1'} className={styles.about}>
        {t('choiseOfPath.tell')}
      </Typography>

      <Typography variant={'h4'} className={styles.choose}>
        {t('choiseOfPath.choose')}
      </Typography>

      <div className={styles.iconAvatarContainer}>
        <div
          onClick={() => changeRole('teacher')}
          className={`${styles.avatarBlock} ${userRoleAndLang.role === 'teacher' && styles.active}`}
        >
          <Teacher />
          {t('choiseOfPath.teacher')}
        </div>

        <div
          onClick={() => changeRole('student')}
          className={`${styles.avatarBlock} ${userRoleAndLang.role === 'student' && styles.active}`}
        >
          <Student />
          {t('choiseOfPath.student')}
        </div>
      </div>

      <Typography variant={'h4'} className={styles.chooseRole}>
        {userRoleAndLang.role === 'teacher' ? t('choiseOfPath.teach') : t('choiseOfPath.learn')}
      </Typography>

      <Typography variant={'h4'} className={styles.teach}>
        {t('choiseOfPath.english')}
      </Typography>

      <Typography variant={'h4'} className={styles.native}>
        {t('choiseOfPath.nativeLanguage')}
      </Typography>

      <div style={{ marginTop: 16 }}>
        <SelectLanguage
          error={error}
          language={userRoleAndLang.to}
          handleChangeSelect={changeLanguage}
          disabled={isLoading}
        />
        {error && <FormHelperText error>{t('choiseOfPath.errorLang')}</FormHelperText>}
      </div>

      <Button
        onClick={handleClickNextButton}
        className={styles.nextButton}
        fullWidth
        variant={'contained'}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span>{t('choiseOfPath.loading')}</span>
            <CircularProgress
              style={{ color: 'var(--White)', width: '24px', height: '24px', marginLeft: '8px' }}
            />
          </>
        ) : (
          <span>{isGoogleReg ? t('choiseOfPath.signUp') : t('choiseOfPath.next')}</span>
        )}
      </Button>

      {!isGoogleReg && (
        <div className={styles.goToAuthPage}>
          <Typography mr="24px" variant="body2">
            {t('choiseOfPath.already')}
          </Typography>

          <Link href={`/login${nextHref ? `?next=${nextHref}` : ''}`} passHref>
            <Typography variant="body2" component="a">
              {t('choiseOfPath.logIn')}
            </Typography>
          </Link>
        </div>
      )}
    </div>
  );
};
