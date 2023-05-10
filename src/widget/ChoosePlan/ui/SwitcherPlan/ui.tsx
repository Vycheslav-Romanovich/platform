import { Button, Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';

import Save40Desktop from '../../assets/save40Desktop.svg';
import Save40Mobile from '../../assets/save40Mobile.svg';

import { SubscriptionPeriod } from '~/features/SubscriptionCard';

type Props = {
  period: SubscriptionPeriod;
  handleClickToPeriod: (period: SubscriptionPeriod) => void;
};

export const SwitcherPlan: React.FC<Props> = ({ period, handleClickToPeriod }) => {
  const isMobileSize = useMediaQuery('(max-width:767px)');
  const isYearlyPeriod = period === 'yearly';

  const changePeriodToYearly = () => {
    handleClickToPeriod('yearly');
  };

  const changePeriodToMonthly = () => {
    handleClickToPeriod('monthly');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: {
          xs: '16px',
          sm: '24px',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'var(--White)',
          borderRadius: '24px',
          padding: '1px',
          width: 'fit-content',
        }}
      >
        {isMobileSize ? (
          <Save40Mobile
            width="80px"
            height="80px"
            style={{ position: 'absolute', top: '-60px', left: '-42px', userSelect: 'none' }}
          />
        ) : (
          <Save40Desktop
            width="140px"
            height="140px"
            style={{ position: 'absolute', top: '-46px', left: '-144px', userSelect: 'none' }}
          />
        )}

        <Button
          size="large"
          variant={'contained'}
          color={isYearlyPeriod ? 'dark' : 'info'}
          sx={{ borderRadius: '24px', width: '108px' }}
          onClick={changePeriodToYearly}
        >
          <Typography variant={isYearlyPeriod ? 'h6' : 'body3'}>Yearly</Typography>
        </Button>

        <Button
          size="large"
          variant={'contained'}
          color={!isYearlyPeriod ? 'dark' : 'info'}
          sx={{ borderRadius: '24px', width: '128px' }}
          onClick={changePeriodToMonthly}
        >
          <Typography variant={!isYearlyPeriod ? 'h6' : 'body3'}>Monthly</Typography>
        </Button>
      </Box>
    </Box>
  );
};
