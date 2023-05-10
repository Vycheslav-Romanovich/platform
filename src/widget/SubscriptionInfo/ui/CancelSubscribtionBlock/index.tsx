import React, { useState } from 'react';
import { Button, Typography, useMediaQuery } from '@mui/material';

import { subscriptionStore } from '../../module';

import styles from './styles.module.scss';

import { CustomModal } from '~/modals/customModal';
import { userStore } from '~/stores';

export const CancelSubscribtionBlock: React.FC = () => {
  const [isOpenModal, setOpenModal] = useState(false);

  const isMobile = useMediaQuery('(max-width:767px)');

  const handleOpenModal = () => {
    setOpenModal(!isOpenModal);
  };

  const handleConfirmDesigionCancelSub = () => {
    subscriptionStore.finishSubscription(userStore.user.id, userStore.user.token);
    subscriptionStore.getSubscription(userStore.user.id, userStore.user.token);
  };

  return (
    <>
      {!subscriptionStore.subscriptionInfo.isSubscriptionFinished ? (
        <>
          <CustomModal
            idYesButton={'delete_sub'}
            isOpen={isOpenModal}
            close={handleOpenModal}
            withoutCloseBtn={false}
            title={'Cancel subscription?'}
            subtitle1={
              'All future payments will be cancelled and the Premium will be replaced by the Free plan when the current subscription expires. '
            }
            access={handleConfirmDesigionCancelSub}
            buttonTextRight={'Cancel  subscription'}
            buttonTextLeft={'Cancel'}
          />

          <div className={styles.cancelSubscriptionContainer}>
            <div>
              <Button
                variant="text"
                disableTouchRipple
                onClick={handleOpenModal}
                sx={{
                  height: { md: '48px', xs: '16px' },
                  borderRadius: 0,
                  padding: 0,
                  '&:hover': { backgroundColor: 'transparent' },
                }}
              >
                <Typography
                  variant={isMobile ? 'button2' : 'button1'}
                  sx={{
                    color: 'var(--Pink)',
                  }}
                >
                  Cancel subscription
                </Typography>
              </Button>
            </div>

            <Typography
              variant={isMobile ? 'text3' : 'body3'}
              sx={{
                color: 'var(--L_Grey)',
              }}
            >
              All future payments will be canceled and your plan will downgrade to the free version
              of eLang at the end of your current subscription period.
            </Typography>
          </div>
        </>
      ) : null}
    </>
  );
};
