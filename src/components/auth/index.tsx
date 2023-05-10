import React, { SyntheticEvent, useEffect, useState } from 'react';
import GoogleLogin from 'react-google-login';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Icon,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Google from '../../assets/icons/registration/google.svg';

import api from '../../api_client/api';

import styles from './index.module.scss';

import { ChoiseOfPath } from '~/components/auth/choiseOfPath';
import { ErrorValidation } from '~/components/error';
import { PRIVACY_POLICY } from '~/constants/links';
import { SEND_PULSE_BOOK_ID } from '~/constants/sendPulseBook';
import { useInput } from '~/customHooks/useValidation';
import { SubscriptionPeriod } from '~/features/SubscriptionCard';
import { sendEvent } from '~/helpers/sendToGtm';
import { userStore } from '~/stores';
import { ServerError } from '~/types/api';
import { Errors } from '~/types/validate';

type Props = {
  type: 'login' | 'signup';
};

export const Auth: React.FC<Props> = observer(({ type }) => {
  const isLogin = type === 'login';
  const { push, replace } = useRouter();
  const { t } = useTranslation();
  const [regInfo, setRegInfo] = useState<{ role: 'student' | 'teacher'; language: string }>();
  const [choiceStep, setChoiceStep] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [serverError, setServerError] = useState<Errors>({});
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<SubscriptionPeriod>(null);
  const [nextHref, setNextHref] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const email = useInput('', { isEmpty: true, isEmail: true });
  const password = useInput('', { isEmpty: true, minLength: 6, maxLength: 16 });
  const politics = useInput('', { isChecked: false });
  const checkValidate = useInput('', { onSubmit: false });

  const login = () => {
    setLoading(true);
    api
      .login({ email: email.value, password: password.value })
      .then(({ data }) => {
        userStore.login(data);
        sendEvent('log_in', { method: 'Email' });

        if (nextHref) {
          push(nextHref);
        } else {
          replace('/');
        }
      })
      .catch((err: AxiosError<ServerError>) => {
        const message = err.response?.data.message;
        if (message === 'DOES_NOT_EXIST') {
          setServerError({
            email: "We couldn't find this account.",
          });
        } else if (message === 'WRONG_PASS') {
          setServerError({
            password: 'Please check your password',
          });
        }
      })
      .finally(() => setLoading(false));
  };

  const authEvent = (method: 'Email' | 'Google') => {
    sendEvent('sign_up', { method });
    regInfo.role === 'teacher' && sendEvent('role_teacher_choose');
    regInfo.role === 'student' && sendEvent('role_student_choose');
    sendEvent('native_language_choose', { native_language: regInfo.language });
  };

  const register = () => {
    setLoading(true);
    api
      .register({
        email: email.value,
        password: password.value,
        role: regInfo.role,
        to: regInfo.language,
      })
      .then(({ data }) => {
        authEvent('Email');

        if (data.email) {
          login();

          // post user to sendpulse book
          process.env.APP_ENV === 'production' &&
            api.setInSendPulseBook({
              email: email.value,
              bookId:
                regInfo.role === 'teacher'
                  ? SEND_PULSE_BOOK_ID.TEACHER
                  : SEND_PULSE_BOOK_ID.STUDENT,
            });
        }
      })
      .catch((err: AxiosError<ServerError>) => {
        const message = err.response?.data.message;

        if (message === 'ALREADY_REGISTERED') {
          setServerError({ email: 'User with such email already exists' });
        }
      })
      .finally(() => setLoading(false));
  };

  const handleUserInfo = (role: 'student' | 'teacher', language: string) => {
    setRegInfo({ role, language });
    setChoiceStep(false);
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    isLogin
      ? email.inputValid && password.inputValid
        ? login()
        : null
      : email.inputValid && password.inputValid && politics.inputValid
      ? register()
      : null;
  };

  const googleAuth = async (isLogin: boolean, tokenId: string) => {
    const isLoginCred = {
      appService: 'web',
      accessToken: tokenId,
    };
    const isRegisterCred = {
      appService: 'web',
      accessToken: tokenId,
      role: regInfo?.role,
      to: regInfo?.language,
    };

    let googleOauth;

    try {
      googleOauth = await api.googleOauth(isLogin ? isLoginCred : isRegisterCred);
    } catch (error) {
      console.error(error);

      return setLoading(false);
    }

    const token = googleOauth.data.token as string;
    const userData = await api.info(token);

    userStore.login({ ...userData.data, token });
    isLogin ? sendEvent('log_in', { method: 'Google' }) : authEvent('Google');

    if (userData.data.avatar) {
      userStore.setAvatar(`${userData.data.avatar}`);
    } else {
      api
        .updateAvatar({ avatarUrl: googleOauth.data.avatar })
        .then(() => userStore.setAvatar(googleOauth.data.avatar));
    }

    setLoading(false);
  };

  const responseGoogle = async (response) => {
    try {
      const { tokenId, googleId, profileObj } = response;

      if (response.error === 'idpiframe_initialization_failed') {
        return;
      }

      const userData = await api.getUserInfoByGoogleId(googleId);

      if (!userData.data && !regInfo) {
        push(`/choose-account-type?t=${tokenId}&next=${subscriptionPeriod}`);
      } else {
        // post user to sendpulse book
        if (!userData.data.email && process.env.APP_ENV === 'production') {
          api.setInSendPulseBook({
            email: profileObj.email,
            bookId:
              regInfo.role === 'teacher' ? SEND_PULSE_BOOK_ID.TEACHER : SEND_PULSE_BOOK_ID.STUDENT,
          });
        }

        googleAuth(isLogin, tokenId);

        if (nextHref) {
          push(nextHref);
        } else {
          replace('/');
        }
      }
    } catch (error) {
      if (error.error !== 'popup_closed_by_user') {
        console.error(error);
      }
    }
  };

  // check redirect to next page after reg/login
  useEffect(() => {
    const url = new URL(window.location.href);
    const nextHrefQuery = url.searchParams.get('next');

    if (nextHrefQuery) {
      const period = new URL(window.location.origin + nextHrefQuery).searchParams.get(
        'period'
      ) as SubscriptionPeriod;

      setSubscriptionPeriod(period);
      setNextHref(nextHrefQuery);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className={styles.pageLogin}>
      {!isLogin && choiceStep ? (
        <ChoiseOfPath setUserInfo={handleUserInfo} nextHref={nextHref} />
      ) : (
        <div className={styles.formWrapper}>
          <h2>{isLogin ? t('auth.loginAcc') : t('auth.createAcc')}</h2>

          <GoogleLogin
            clientId={process.env.GOOGLE_CLIENT_ID as string}
            render={(renderProps) => (
              <Button
                color="primary"
                variant="outlined"
                className={styles.loginButton}
                onClick={() => {
                  setLoading(true);
                  renderProps.onClick();
                }}
                size="large"
              >
                <Google />
                <Typography
                  variant="button2"
                  sx={{ fontSize: { lg: '16px' }, ml: '8px', color: 'var(--Blue)' }}
                >
                  {isLogin ? t('auth.loginGoogle') : t('auth.signupGoogle')}
                </Typography>
              </Button>
            )}
            buttonText={isLogin ? t('auth.loginGoogle') : t('auth.signupGoogle')}
            className={styles.loginButton}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy="single_host_origin"
            disabled={isLoading}
          />

          <div className={styles.textWithLine}>
            <hr />
            <Typography noWrap className={styles.line}>
              {t('auth.sigupEmail')}
            </Typography>
            <hr />
          </div>

          <div className={styles.inputWrapper}>
            <Stack sx={{ width: '100%' }}>
              <TextField
                label={t('auth.email')}
                name="email"
                type="text"
                color="secondary"
                placeholder={t('auth.placeholderEmail')}
                variant="filled"
                value={email.value}
                onBlur={email.onBlur}
                onChange={email.onChange}
                disabled={isLoading}
              />
            </Stack>

            {serverError.email && (
              <ErrorValidation>
                {isLogin ? t('errorValidation.findAccount') : t('errorValidation.alreadyExists')}
              </ErrorValidation>
            )}
            {checkValidate.onSubmit && email.isDirty && email.isEmpty && (
              <ErrorValidation>{t('errorValidation.empty')}</ErrorValidation>
            )}
            {checkValidate.onSubmit &&
              (email.isEmpty ||
                (email.isDirty && email.emailError && (
                  <ErrorValidation>{t('errorValidation.emailCorrectly')}</ErrorValidation>
                )))}

            <Box sx={{ position: 'relative' }}>
              <Stack sx={{ width: '100%', mt: '26px' }}>
                <TextField
                  label={t('auth.password')}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  color="secondary"
                  placeholder={t('auth.password')}
                  variant="filled"
                  value={password.value}
                  onBlur={password.onBlur}
                  onChange={password.onChange}
                  disabled={isLoading}
                />
              </Stack>

              <Icon
                className={styles.eyeIcon}
                component={showPassword ? VisibilityIcon : VisibilityOffIcon}
                onClick={() => setShowPassword((prev) => !prev)}
              />
            </Box>

            {serverError.password && (
              <ErrorValidation>{t('errorValidation.checkPassword')}</ErrorValidation>
            )}
            {checkValidate.onSubmit && password.isDirty && password.isEmpty && (
              <ErrorValidation>{t('errorValidation.empty')}</ErrorValidation>
            )}
            {checkValidate.onSubmit &&
              (password.isEmpty ||
                (password.isDirty && password.minLengthError && (
                  <ErrorValidation isLogin={isLogin}>
                    {isLogin ? '' : t('errorValidation.longSix')}
                  </ErrorValidation>
                )))}
            {checkValidate.onSubmit && password.isDirty && password.maxLengthError && (
              <ErrorValidation isLogin={isLogin}>
                {isLogin ? '' : t('errorValidation.longSixteen')}
              </ErrorValidation>
            )}
          </div>

          {isLogin && (
            <Link href={'/restore-password'}>
              <Typography variant="body2" align="right" className={styles.forgotPsw}>
                {t('auth.forgotPassword')}
              </Typography>
            </Link>
          )}

          {isLogin ? null : (
            <>
              <div className={styles.checkboxWrapperSinUp}>
                <Checkbox
                  checked={politics.isChecked}
                  color="primary"
                  onChange={politics.onChecked}
                  onBlur={politics.onBlur}
                />
                <Typography variant="body2">{t('auth.agree')}</Typography>
                <Link href={PRIVACY_POLICY} passHref>
                  <Typography component="a" variant="body2" className={styles.privacyPolicy}>
                    {t('auth.policy')}
                  </Typography>
                </Link>
              </div>
              {checkValidate.onSubmit && !politics.isChecked && (
                <div className={styles.checkPrivacy}>
                  <ErrorValidation>{t('errorValidation.checkPrivacy')}</ErrorValidation>
                </div>
              )}
            </>
          )}

          <Button
            onClick={() => checkValidate.onClick()}
            type="submit"
            color="primary"
            variant="contained"
            className={styles.loginButton}
            size="large"
            disabled={isLoading}
          >
            <Typography
              variant="button2"
              color="var(--White)"
              align="center"
              sx={{ fontSize: { lg: '16px' }, display: 'flex', alignItems: 'center' }}
            >
              {isLoading ? (
                <>
                  {t('choiseOfPath.loading')}
                  <CircularProgress
                    style={{
                      color: 'var(--White)',
                      width: '24px',
                      height: '24px',
                      marginLeft: '8px',
                    }}
                  />
                </>
              ) : isLogin ? (
                t('header.titleLogin')
              ) : (
                t('auth.signup')
              )}
            </Typography>
          </Button>

          <div className={styles.goToAuthPage}>
            <Typography mr="24px" variant="body1">
              {isLogin ? t('auth.notMember') : t('auth.alreadyAccount')}
            </Typography>

            <Link
              href={
                isLogin
                  ? `/signup${nextHref ? `?next=${nextHref}` : ''}`
                  : `/login${nextHref ? `?next=${nextHref}` : ''}`
              }
              passHref
            >
              <Typography variant="body2" component="a">
                {isLogin ? t('auth.signup') : t('header.titleLogin')}
              </Typography>
            </Link>
          </div>
        </div>
      )}
    </form>
  );
});
