import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Button,
  FormControl,
  Icon,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import Layout from '../../hocs/layout';

import styles from './index.module.scss';

import api from '~/api_client/api';
import Avatar from '~/components/avatar';
import { ErrorValidation } from '~/components/error';
import { SEND_PULSE_BOOK_ID } from '~/constants/sendPulseBook';
import { interfaceLanguages, supportedLanguages } from '~/constants/supportedLanguages';
import { useInput } from '~/customHooks/useValidation';
import { sendEvent } from '~/helpers/sendToGtm';
import { CustomModal } from '~/modals/customModal';
import { userStore } from '~/stores';

const Account: NextPage = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [isShowBlockPassword, setShowBlockPassword] = useState(false);
  const [isOpenModal, setOpenModal] = useState({ delete: false, logout: false });
  const [showDataPassword, setShowDataPassword] = useState({
    oldPassword: false,
    newPassword: false,
  });
  const [fields, setFields] = useState({ name: userStore.user.name });
  const [isDisabledButtonSavePass, setDisabledButtonSavePass] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const oldPassword = useInput('', { isEmpty: true, minLength: 6, maxLength: 16 });
  const newPassword = useInput('', { isEmpty: true, minLength: 6, maxLength: 16 });
  const checkValidate = useInput('', { onSubmit: false });

  const isSaveName = userStore.user.name === fields.name;

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, name: event.target.value });
  };

  const handleChangeSelect = async (event) => {
    const userInfo = await api.updateUserTo({ to: event.target.value });
    await sendEvent('native_language_change', { native_language: event.target.value });
    userStore.setUser(userInfo.data.user);
  };

  const handleChangeInterfaceLanguage = (event) => {
    sendEvent('interface_language_change', { interface_language: event.target.value });
    i18n.changeLanguage(event.target.value);
    const found = router.locales.find(
      (locale) =>
        locale === interfaceLanguages.find((element) => element.code === event.target.value).code
    );
    if (found != undefined) {
      router.push('/account', '/account', { locale: found });
    } else {
      router.push('/account', '/account', { locale: 'en' });
    }
  };

  const handleClickShowPasswords = () => {
    setShowBlockPassword(!isShowBlockPassword);
    setFields({ ...fields });
  };

  const handleClickShowOldPass = () => {
    setShowDataPassword({ ...showDataPassword, oldPassword: !showDataPassword.oldPassword });
  };

  const handleClickShowNewPass = () => {
    setShowDataPassword({ ...showDataPassword, newPassword: !showDataPassword.newPassword });
  };

  const handlClickSaveName = async () => {
    const userInfo = await api.updateUser({ name: fields.name });

    setFields({ ...fields, name: fields.name });
    userStore.setUser(userInfo.data.user);
  };

  const handleClickCloseDeleteModal = () => {
    setOpenModal({ ...isOpenModal, delete: false });
  };

  const handleClickCloseLogoutModal = () => {
    setOpenModal({ ...isOpenModal, logout: false });
  };

  const handleClickOpenDeleteModal = () => {
    setOpenModal({ ...isOpenModal, delete: true });
  };

  const handleClickOpenLogoutModal = () => {
    setOpenModal({ ...isOpenModal, logout: true });
  };

  const confirmDesigionDeleteAccount = async () => {
    await userStore.setInit(false);

    if (userStore.user.email && process.env.APP_ENV === 'production') {
      await api.removeFromSendPulseBook({
        email: userStore.user.email,
        bookId: SEND_PULSE_BOOK_ID.TEACHER,
      });
      await api.removeFromSendPulseBook({
        email: userStore.user.email,
        bookId: SEND_PULSE_BOOK_ID.STUDENT,
      });
    }

    await api.deleteAccount();
    await userStore.logout();
    await router.push('/signup');
    await userStore.setInit(true);
  };

  const handleClickLogOut = async () => {
    await userStore.setInit(false);
    await userStore.logout();
    await router.push('/login');
    await userStore.setInit(true);
  };

  const loadImageFromDevice = (event) => {
    (document as Document).getElementById('file-upload').click();

    const file = event.target.files[0];

    if (file.size > 4194304) {
      console.error('TOO_LARGE_AVATAR');
      return;
    }

    api.postNewAvatar(file).then(({ data }) => {
      const avatar = process.env.PRODUCT_SERVER_URL + '/avatars/' + data.name;
      userStore.setAvatar(avatar);
    });

    sendEvent('change_userpic');
  };

  const changePassword = () => {
    checkValidate.onClick();
    if (newPassword.value.length > 5 && newPassword.value.length <= 16) {
      api
        .changePassword(oldPassword.value, newPassword.value)
        .then(() => {
          setIsChanged(true);
        })
        .catch((error) => {
          setIsChanged(false);
          console.error(error);
        });
    }
  };

  const submitForm = async () => {
    sendEvent('change_userpic');
    (document as Document).getElementById('file-upload').click();
  };

  useEffect(() => {
    // active button
    newPassword.value.length > 5
      ? setDisabledButtonSavePass(false)
      : setDisabledButtonSavePass(true);
  }, [oldPassword.value, newPassword.value]);

  return (
    <>
      <NextSeo
        title={t('seo.account.name')}
        description={t('seo.account.description')}
        additionalMetaTags={[{ property: 'keywords', content: t('seo.account.keyWords') }]}
      />

      <Layout>
        <div className={styles.wrapper}>
          <Avatar size="huge" src={userStore.user.avatar} alt={userStore.user.name} />

          <Button
            id={'userpic'}
            className={styles.buttonChangePhoto}
            type="button"
            variant="text"
            onClick={submitForm}
          >
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={loadImageFromDevice}
            />
            <Typography sx={{ textTransform: 'none' }} color="var(--Blue)" variant="body2">
              {t('account.changePhoto')}
            </Typography>
          </Button>

          <div className={styles.inputWrapperFirst}>
            <p className={styles.label}>{t('account.name')}</p>
            <TextField
              sx={{ width: '100%', maxWidth: '392px' }}
              name="name"
              focused
              label={t('account.labelCurName')}
              variant="filled"
              color="secondary"
              type="text"
              value={fields.name}
              onChange={handleChangeName}
            />
            <Button
              id={'username'}
              size="large"
              type="button"
              variant="contained"
              color="primary"
              disabled={isSaveName}
              className={styles.buttonChange}
              onClick={handlClickSaveName}
            >
              {t('account.save')}
            </Button>
          </div>

          <div className={styles.inputWrapper}>
            <p className={styles.label}>{t('account.email')}</p>
            <TextField
              sx={{ width: '100%', maxWidth: '392px' }}
              name="name"
              label={t('account.labelEmail')}
              variant="filled"
              type="text"
              disabled
              value={userStore.user.email}
            />
          </div>

          {!userStore.user.googleId && (
            <>
              <div className={styles.inputWrapper}>
                <p className={styles.label}>{t('account.password')}</p>

                {isShowBlockPassword && (
                  <div className={styles.contentInput}>
                    <div>
                      <TextField
                        sx={{ width: '100%', maxWidth: '392px' }}
                        name="password"
                        focused
                        label={t('account.labelOld')}
                        variant="filled"
                        color="secondary"
                        type={showDataPassword.oldPassword ? 'text' : 'password'}
                        value={oldPassword.value}
                        onChange={oldPassword.onChange}
                        onBlur={oldPassword.onBlur}
                        InputProps={{ disableUnderline: true }}
                      />
                      <Icon
                        className={styles.eyeIcon}
                        component={
                          showDataPassword.oldPassword ? VisibilityIcon : VisibilityOffIcon
                        }
                        onClick={handleClickShowOldPass}
                      />
                    </div>
                    {checkValidate.onSubmit &&
                      !isChanged &&
                      !(oldPassword.value === newPassword.value) && (
                        <ErrorValidation>{t('errorValidation.old')}</ErrorValidation>
                      )}
                  </div>
                )}

                {!isShowBlockPassword && (
                  <>
                    <div className={styles.disabledPass}>
                      <TextField
                        sx={{ width: '100%', maxWidth: '392px' }}
                        label={t('account.password')}
                        variant="filled"
                        color="secondary"
                        value="*****"
                        disabled
                        InputProps={{ disableUnderline: true }}
                      />
                      <VisibilityOffIcon className={styles.eyeIcon} />
                    </div>
                    <Button
                      type="button"
                      variant="outlined"
                      size="large"
                      className={styles.buttonChange}
                      onClick={handleClickShowPasswords}
                      sx={{ textTransform: 'none' }}
                    >
                      {t('account.change')}
                    </Button>
                  </>
                )}
              </div>

              {isShowBlockPassword && (
                <div className={styles.inputWrapper}>
                  <div className={styles.label}></div>

                  <div className={styles.content}>
                    <TextField
                      sx={{ width: '100%', maxWidth: '392px' }}
                      name="password"
                      focused
                      label={t('account.labelNew')}
                      variant="filled"
                      color="secondary"
                      type={showDataPassword.newPassword ? 'text' : 'password'}
                      value={newPassword.value}
                      onChange={newPassword.onChange}
                      onBlur={newPassword.onBlur}
                      InputProps={{ disableUnderline: true }}
                    />
                    <Icon
                      className={styles.eyeIcon}
                      component={showDataPassword.newPassword ? VisibilityIcon : VisibilityOffIcon}
                      onClick={handleClickShowNewPass}
                    />
                    {checkValidate.onSubmit && newPassword.isDirty && newPassword.isEmpty && (
                      <ErrorValidation>{t('errorValidation.empty')}</ErrorValidation>
                    )}
                    {checkValidate.onSubmit &&
                      (newPassword.isEmpty ||
                        (newPassword.isDirty && newPassword.minLengthError && (
                          <ErrorValidation>{t('errorValidation.longSix')}</ErrorValidation>
                        )))}
                    {checkValidate.onSubmit &&
                      newPassword.isDirty &&
                      newPassword.maxLengthError && (
                        <ErrorValidation>{t('errorValidation.longSixteen')}</ErrorValidation>
                      )}
                    {checkValidate.onSubmit && oldPassword.value === newPassword.value && (
                      <ErrorValidation>{t('errorValidation.matchPassword')}</ErrorValidation>
                    )}
                  </div>

                  <Button
                    type="button"
                    size="large"
                    variant="outlined"
                    className={styles.buttonChange}
                    onClick={handleClickShowPasswords}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('account.cancel')}
                  </Button>

                  <Button
                    type="button"
                    size="large"
                    variant="contained"
                    color="primary"
                    disabled={isDisabledButtonSavePass}
                    className={styles.buttonSave}
                    onClick={changePassword}
                  >
                    {t('account.save')}
                  </Button>
                </div>
              )}
            </>
          )}

          <div className={styles.inputWrapper}>
            <p className={styles.label}>{t('account.nativeLang')}</p>
            <FormControl sx={{ width: '100%', maxWidth: 392 }} variant="filled">
              <InputLabel id="native-language-label">{t('account.nativeLang')}</InputLabel>
              <Select
                labelId="native-language-label"
                label={t('account.nativeLang')}
                value={userStore.user.to}
                onChange={handleChangeSelect}
              >
                {supportedLanguages.map(({ name, code }) => {
                  return (
                    <MenuItem key={code} value={code}>
                      {name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>

          <div className={styles.inputWrapper}>
            <p className={styles.label}>{t('account.interfaceLanguage')}</p>
            <FormControl sx={{ width: '100%', maxWidth: 392 }} variant="filled">
              <InputLabel id="native-language-label">{t('account.interfaceLanguage')}</InputLabel>
              <Select
                labelId="native-language-label"
                label={t('account.interfaceLanguage')}
                value={i18n.language}
                onChange={handleChangeInterfaceLanguage}
              >
                {interfaceLanguages.map(({ name, code }) => {
                  return (
                    <MenuItem key={code} value={code}>
                      {name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>

          <Button
            variant="text"
            className={styles.buttonLogOutAccount}
            onClick={handleClickOpenLogoutModal}
          >
            <Typography sx={{ textTransform: 'none' }} color="var(--Blue)" variant="body2">
              {t('headerAvatar.titleLogout')}
            </Typography>
          </Button>

          <Button
            color="error"
            variant="text"
            className={styles.buttonDeleteAccount}
            onClick={handleClickOpenDeleteModal}
          >
            <Typography sx={{ textTransform: 'none' }} color="var(--Red)" variant="body2">
              {t('account.delete')}
            </Typography>
          </Button>
        </div>

        <CustomModal
          idYesButton={'delete_acc'}
          isOpen={isOpenModal.delete}
          close={handleClickCloseDeleteModal}
          modalClasses={styles.modalClasses}
          withoutCloseBtn={false}
          title={t('account.delete')}
          subtitle1={t('account.subtitle1')}
          subtitle2={t('account.subtitle2')}
          subtitle3={t('account.subtitle3')}
          access={confirmDesigionDeleteAccount}
          buttonTextLeft={t('games.no')}
          buttonTextRight={t('games.yes')}
        />

        <CustomModal
          idYesButton={'log_out'}
          isOpen={isOpenModal.logout}
          close={handleClickCloseLogoutModal}
          modalClasses={styles.modalClasses}
          withoutCloseBtn={false}
          title={t('headerAvatar.titleLogout')}
          subtitle1={t('headerAvatar.subtitle1')}
          subtitle2={t('headerAvatar.subtitle2')}
          subtitle3={t('headerAvatar.subtitle3')}
          access={handleClickLogOut}
          buttonTextLeft={t('games.no')}
          buttonTextRight={t('games.yes')}
        />
      </Layout>
    </>
  );
};

export async function getStaticProps() {
  return {
    props: {
      protected: true,
    },
  };
}

export default observer(Account);
