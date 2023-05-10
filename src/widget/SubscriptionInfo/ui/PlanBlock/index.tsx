import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';

import { parseDate } from '../../lib/parseDate';

import styles from './styles.module.scss';

type Props = {
  subscriptionType: string;
  expirationDate: string;
  price: string;
  currencyCode: string;
  isSubscriptionFinished: boolean;
};

export const PlanBlock: React.FC<Props> = ({
  subscriptionType,
  expirationDate,
  price,
  currencyCode,
  isSubscriptionFinished,
}) => {
  const isMobile = useMediaQuery('(max-width:767px)');

  return (
    <div className={styles.planInfo}>
      <div>
        <Typography variant={isMobile ? 'body2' : 'body1'} component={'span'}>
          Frequency:
        </Typography>
        &ensp;
        <Typography variant={isMobile ? 'body2' : 'body1'} component={'span'}>
          {subscriptionType}
        </Typography>
      </div>

      {isSubscriptionFinished ? (
        <Box sx={{ backgroundColor: 'var(--Silver)', padding: '16px 26px', borderRadius: '6px' }}>
          <Typography variant={isMobile ? 'body2' : 'body1'} component={'span'}>
            The subscription has been cancelled. Premium will be replaced by the Free plan at the
            end of the paid period
          </Typography>
          &ensp;
          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            component={'span'}
            sx={{ fontWeight: 600 }}
          >
            {parseDate(expirationDate)}
          </Typography>
        </Box>
      ) : (
        <>
          <div>
            <Typography variant={isMobile ? 'body2' : 'body1'} component={'span'}>
              Next billing date:
            </Typography>
            &ensp;
            <Typography variant={isMobile ? 'body2' : 'body1'} component={'span'}>
              {parseDate(expirationDate)}
            </Typography>
          </div>

          <div>
            <Typography variant={isMobile ? 'body2' : 'body1'} component={'span'}>
              Amount:
            </Typography>
            &ensp;
            <Typography variant={isMobile ? 'body2' : 'body1'} component={'span'}>
              {`${price} ${currencyCode}`}
            </Typography>
          </div>
        </>
      )}
    </div>
  );
};
