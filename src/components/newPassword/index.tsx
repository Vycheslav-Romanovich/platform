import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Button, Icon, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import styles from './index.module.scss';

import api from '~/api_client/api';
import { ErrorValidation } from '~/components/error';
import { useInput } from '~/customHooks/useValidation';
import { CustomModal } from '~/modals/customModal';

export const NewPassword: React.FC = () => {
  const { query, push } = useRouter();
  const { t } = useTranslation();
  const token = query.token as string;

  const [isChanged, setIsChanged] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [showPasswordData, setShowPasswordData] = useState({
    first: false,
    second: false,
  });
  const newPassword = useInput('', { isEmpty: true, minLength: 6, maxLength: 16 });
  const confirmPassword = useInput('', { isEmpty: true });
  const checkValidate = useInput('', { onSubmit: false });

  const changePassword = () => {
    if (newPassword.value || confirmPassword.value) {
      checkValidate.onClick();
    }
    if (newPassword.value.length > 5 && newPassword.value.length <= 16) {
      api
        .sendReqChangePassword(newPassword.value, token)
        .then(() => {
          setIsChanged(true);
        })
        .catch((error) => {
          setIsChanged(false);
          console.error(error);
        })
        .finally(() => {
          setOpenModal(true);
        });
    }
  };

  const handleClickModal = () => {
    push('/login');
  };

  const handleClickPasswordFirst = () => {
    setShowPasswordData({ ...showPasswordData, first: !showPasswordData.first });
  };

  const handleClickPasswordSecond = () => {
    setShowPasswordData({ ...showPasswordData, second: !showPasswordData.second });
  };

  return (
    <>
      <CustomModal
        isOpen={isOpenModal}
        close={handleClickModal}
        modalClasses={styles.modalClasses}
        withoutCloseBtn={false}
        title={isChanged ? t('newPassword.titleTrue') : t('newPassword.titleFalse')}
        subtitle1={isChanged ? t('newPassword.subtitle1True') : t('newPassword.subtitle1False')}
        access={handleClickModal}
        buttonTextRight={t('newPassword.titleLogin')}
      />

      <Box width="100%" maxWidth="392px">
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: '28px' }, marginBottom: { xs: '16px', lg: '24px' } }}
        >
          {t('newPassword.reset')}
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: '24px' }}>
          {t('newPassword.enter')}
        </Typography>

        <div className={styles.inputWrapper}>
          <Stack sx={{ width: '100%' }}>
            <TextField
              label={t('newPassword.newPassword')}
              name="New password"
              type={showPasswordData.first ? 'text' : 'password'}
              color="secondary"
              variant="filled"
              value={newPassword.value}
              onBlur={newPassword.onBlur}
              onChange={newPassword.onChange}
            />
          </Stack>

          <Icon
            className={styles.eyeIcon}
            component={showPasswordData.first ? VisibilityIcon : VisibilityOffIcon}
            onClick={handleClickPasswordFirst}
          />
        </div>

        {checkValidate.onSubmit && newPassword.minLengthError && (
          <ErrorValidation>{t('errorValidation.longSix')}</ErrorValidation>
        )}

        {checkValidate.onSubmit && newPassword.maxLengthError && (
          <ErrorValidation>{t('errorValidation.longSixteen')}</ErrorValidation>
        )}

        <Box className={styles.inputWrapper}>
          <Stack sx={{ width: '100%' }}>
            <TextField
              label={t('newPassword.confirmNewPassword')}
              name="Confirm new password"
              type={showPasswordData.second ? 'text' : 'password'}
              color="secondary"
              variant="filled"
              value={confirmPassword.value}
              onBlur={confirmPassword.onBlur}
              onChange={confirmPassword.onChange}
            />
          </Stack>

          <Icon
            className={styles.eyeIcon}
            component={showPasswordData.second ? VisibilityIcon : VisibilityOffIcon}
            onClick={handleClickPasswordSecond}
          />
        </Box>

        {checkValidate.onSubmit && !(newPassword.value === confirmPassword.value) && (
          <ErrorValidation>{t('errorValidation.matchNotPassword')}</ErrorValidation>
        )}

        <Button
          onClick={changePassword}
          color="primary"
          size="large"
          variant="contained"
          type="submit"
          sx={{ width: '100%', marginTop: '32px' }}
        >
          <Typography variant="button1">{t('newPassword.confirm')}</Typography>
        </Button>
      </Box>
    </>
  );
};
