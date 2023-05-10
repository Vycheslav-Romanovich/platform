import React from 'react';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';

import styles from './styles.module.scss';

export const SubscriptionAlert: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:767px)');
  const router = useRouter();

  const handleClickRedirect = () => {
    router.push('/subscription-plans');
  };

  return (
    <div className={styles.cancelSubscriptionContainer}>
      <Typography
        variant={'h4'}
        sx={{
          color: 'var(--L_Grey)',
        }}
      >
        You don&apos;t have subscription.
      </Typography>

      <Typography
        variant={isMobile ? 'text3' : 'body3'}
        sx={{
          color: 'var(--L_Grey)',
        }}
      >
        Please, redirect to subscription plans.
      </Typography>

      <Box mt="30px">
        <Button variant="contained" onClick={handleClickRedirect} size="medium">
          <Typography variant={isMobile ? 'button2' : 'button1'}>Subscription plans</Typography>
        </Button>
      </Box>
    </div>
  );
};
