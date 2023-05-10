import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Stack, TextField } from '@mui/material';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import styles from './index.module.scss';

import api from '~/api_client/api';
import { ErrorValidation } from '~/components/error';
import { useInput } from '~/customHooks/useValidation';
import { CustomModal } from '~/modals/customModal';
import { ServerError } from '~/types/api';

export const RestorePassword: React.FC = observer(() => {
  const [emailData, setEmailData] = useState<string>('');
  const [isOpenModal, setOpenModal] = useState(false);
  const [isSend, setSend] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const email = useInput('', { isEmpty: true, isEmail: true });
  const checkValidate = useInput('', { onSubmit: false });
  const { t } = useTranslation();

  const resendStyles = classNames(styles.resend, {
    [styles.isSend]: isSend,
  });

  const onSubmit = () => {
    if (!emailData) {
      checkValidate.onClick();
    }
    api
      .sendPassword(emailData)
      .then(() => {
        setEmailData(emailData);
        setOpenModal(true);
        setSend(true);
        setEmailError(true);
      })
      .catch((err: AxiosError<ServerError>) => {
        setEmailError(false);
        const message = err.response.data.message;
        console.error(message);
      });
  };

  const reSubmit = () => {
    if (emailData) {
      onSubmit();
    }
  };

  const handleClickModal = () => {
    setOpenModal(!isOpenModal);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    email.onChange(event);
    setEmailData(event.target.value);
  };

  return (
    <>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('restorePassword.title')}</h2>

        <p className={styles.subTitle}>{t('restorePassword.subTitle')}</p>

        <div className={styles.inputWrapper}>
          <Stack sx={{ width: '100%' }}>
            <TextField
              label={t('auth.email')}
              name="text"
              type="text"
              color="secondary"
              placeholder={t('auth.placeholderEmail')}
              variant="filled"
              onBlur={email.onBlur}
              onChange={handleInputChange}
            />
          </Stack>
        </div>
        {checkValidate.onSubmit && email.isDirty && email.isEmpty && (
          <ErrorValidation>{t('errorValidation.empty')}</ErrorValidation>
        )}
        {checkValidate.onSubmit && !emailError && !email.isEmpty && (
          <ErrorValidation>{t('errorValidation.findAccount')}</ErrorValidation>
        )}

        <Button
          onClick={onSubmit}
          color="primary"
          variant="contained"
          className={styles.sendButton}
          type="submit"
        >
          {t('restorePassword.send')}
        </Button>

        <div className={styles.resendBlock}>
          <p className={styles.getLetter}>{t('restorePassword.getLetter')}</p>
          <p className={resendStyles} onClick={reSubmit}>
            {t('restorePassword.clickHere')}
          </p>
        </div>
      </div>

      <CustomModal
        isOpen={isOpenModal}
        close={handleClickModal}
        modalClasses={styles.modalClasses}
        withoutCloseBtn={false}
        title={t('restorePassword.letterSent')}
        subtitle1={t('restorePassword.subtitle1')}
        subtitle2={t('restorePassword.subtitle2')}
        access={handleClickModal}
        buttonTextRight={t('restorePassword.buttonText')}
      />
    </>
  );
});
