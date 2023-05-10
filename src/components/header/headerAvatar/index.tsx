import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Email, Logout, Policy, Settings } from '@mui/icons-material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Divider, IconButton, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './index.module.scss';

import Avatar from '~/components/avatar';
import { more, PRIVACY_POLICY } from '~/constants/links';
import { sendEvent } from '~/helpers/sendToGtm';
import { CustomModal } from '~/modals/customModal';
import { userStore } from '~/stores';
import { DropDownMenu } from '~/UI/dropDownMenu';

export const HeaderAvatar: React.FC = observer(() => {
  const { push } = useRouter();
  const { t } = useTranslation();
  const { user, logout, setInit } = userStore;

  const [isOpenModalLogout, setOpenModalLogout] = useState(false);

  const handleClickCloseModal = () => {
    setOpenModalLogout(false);
  };

  const handleClickOpenModal = () => {
    setOpenModalLogout(true);
  };

  const handleClickLogOut = async () => {
    await setInit(false);
    await logout();
    await push('/');
    await setInit(true);
  };

  const handleClickLeaveFeedback = () => {
    sendEvent('leave_feedback');
  };

  return (
    <>
      <CustomModal
        isOpen={isOpenModalLogout}
        close={handleClickCloseModal}
        modalClasses={styles.modalClasses}
        withoutCloseBtn={false}
        title={t('headerAvatar.titleLogout')}
        idYesButton={'log_out'}
        subtitle1={t('headerAvatar.subtitle1')}
        subtitle2={t('headerAvatar.subtitle2')}
        subtitle3={t('headerAvatar.subtitle3')}
        access={handleClickLogOut}
        buttonTextLeft={t('games.no')}
        buttonTextRight={t('games.yes')}
      />

      <DropDownMenu
        buttonEl={
          <IconButton size="small" sx={{ ml: 2 }}>
            <Avatar alt={user.name} src={user.avatar} />
          </IconButton>
        }
      >
        <MenuItem>
          <Link href="/account" passHref>
            <a className={styles.link}>
              <Avatar alt={user.name} src={user.avatar} />

              <div className={styles.userInfo}>
                <Typography variant="h4" className={styles.threeDots}>
                  {user.name}
                </Typography>
                <Typography variant="body2" className={styles.threeDots}>
                  {user.email}
                </Typography>
              </div>
            </a>
          </Link>
        </MenuItem>
        <Divider />

        <Link href="/account" passHref>
          <MenuItem>
            <a href={'/account'} className={styles.link}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              {t('headerAvatar.settings')}
            </a>
          </MenuItem>
        </Link>

        <Link
          href={
            userStore.isAuth && userStore.user.isActivePremium
              ? '/subscription'
              : '/subscription-plans'
          }
          passHref
        >
          <MenuItem>
            <a
              href={
                userStore.isAuth && userStore.user.isActivePremium
                  ? '/subscription'
                  : '/subscription-plans'
              }
              className={styles.link}
            >
              <ListItemIcon>
                <CreditCardIcon fontSize="small" />
              </ListItemIcon>
              Subscription
            </a>
          </MenuItem>
        </Link>

        <Link href={PRIVACY_POLICY} passHref>
          <a href={PRIVACY_POLICY} className={styles.link} target="_blank" rel="noreferrer">
            <MenuItem sx={{ width: '100%' }}>
              <ListItemIcon>
                <Policy fontSize="small" />
              </ListItemIcon>
              {t('headerAvatar.policy')}
            </MenuItem>
          </a>
        </Link>

        <Link href={more.leaveFeedback} passHref>
          <a
            href={more.leaveFeedback}
            className={styles.link}
            target="_blank"
            rel="noreferrer"
            onClick={handleClickLeaveFeedback}
          >
            <MenuItem sx={{ width: '100%' }}>
              <ListItemIcon>
                <Email fontSize="small" />
              </ListItemIcon>
              {t('headerAvatar.feedback')}
            </MenuItem>
          </a>
        </Link>

        <MenuItem onClick={handleClickOpenModal}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t('headerAvatar.titleLogout')}
        </MenuItem>
      </DropDownMenu>
    </>
  );
});
