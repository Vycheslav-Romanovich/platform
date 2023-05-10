import { Box, Button, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import Link from 'next/link';

import { dataCard } from './config';
import { SubscriptionPeriod, SubscriptionType } from './types';

import { CardTemplate } from '~/entities/CardTemplate';
import { PlanTextTemplate } from '~/entities/PlanTextTemplate';
import { userStore } from '~/stores';

type Props = {
  type: SubscriptionType;
  period: SubscriptionPeriod;
  onClick?: () => void;
  openFromPopup?: boolean;
};

export const SubscriptionCard: React.FC<Props> = observer(
  ({ type, period, onClick, openFromPopup }) => {
    const isPremType = type === 'prem';
    const paymentUrl = `/payment?period=${period}`;
    const sighupUrl = `/signup${isPremType ? `?next=${paymentUrl}` : ''}`;
    const nextLink = userStore.isAuth ? paymentUrl : sighupUrl;
    const isActivePremium = userStore.user && userStore.user.isActivePremium;

    return (
      <CardTemplate
        width="330px"
        height={{ xs: 'auto', md: '560px' }}
        background={isPremType ? 'var(--Blue)' : 'var(--White)'}
        shadowBox
        padding={{ xs: '32px 24px', sm: '32px' }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: { xs: '32px', sm: '0' },
          }}
        >
          <PlanTextTemplate
            textColor={isPremType ? 'var(--White)' : 'var(--Black)'}
            textGrayColor={isPremType ? null : 'var(--Grey)'}
            checkColor={isPremType ? 'var(--White)' : 'var(--Blue)'}
            data={dataCard[type][period]}
            isPrem={isPremType}
          />

          {onClick ? (
            <Link href={isActivePremium ? '' : nextLink} passHref>
              <Button
                variant={isPremType ? 'contained' : 'outlined'}
                size="large"
                color={isPremType ? 'info' : 'primary'}
                onClick={onClick}
                disabled={isActivePremium}
              >
                <Typography variant="h5" sx={{ color: 'var(--D_Blue)' }}>
                  {isActivePremium
                    ? 'You have Premium'
                    : openFromPopup
                    ? dataCard[type][period].buttonOpPopup
                    : dataCard[type][period].button}
                </Typography>
              </Button>
            </Link>
          ) : null}
        </Box>
      </CardTemplate>
    );
  }
);
