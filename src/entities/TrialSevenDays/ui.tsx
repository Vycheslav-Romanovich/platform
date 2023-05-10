import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';

import { userStore } from '~/stores';

type Props = {
  titleId?: string;
};

export const TrialSevenDays: React.FC<Props> = ({ titleId }) => {
  const paymentUrl = '/payment?period=yearly';
  const sighupUrl = '/signup';
  const nextLink = userStore.isAuth ? paymentUrl : sighupUrl;
  const isActivePremium = userStore.user && userStore.user.isActivePremium;

  return (
    <Box id={titleId} component="section" pt="100px">
      <Box sx={{ mb: '8px' }} textAlign="center">
        <Typography variant="h2" color="var(--D_Blue)">
          Free 14-days <span style={{ color: 'var(--Black)' }}>trial</span>
        </Typography>
        <Typography variant="h2">then $35.99/year</Typography>
      </Box>

      <Typography variant="body2" textAlign="center" mb="24px">
        That&apos;s like $2.99/month 🔥
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Link href={isActivePremium ? '' : nextLink} passHref>
          <Button variant="contained" size="large">
            Start free trial
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
