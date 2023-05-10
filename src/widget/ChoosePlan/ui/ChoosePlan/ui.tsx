import { useState } from 'react';
import { Box } from '@mui/system';

import { SwitcherPlan } from '../SwitcherPlan';

import { SubscriptionCard, SubscriptionPeriod } from '~/features/SubscriptionCard';
import { sendEvent } from '~/helpers/sendToGtm';
import { MoreDeatails } from '~/shared/MoreDetails';

type Props = {
  showFreePlanButton?: boolean;
  ancor?: string;
  openFromPopup?: boolean;
};

export const ChoosePlan: React.FC<Props> = ({ ancor, showFreePlanButton, openFromPopup }) => {
  const [period, setPeriod] = useState<SubscriptionPeriod>('yearly');

  const changePeriodToYearly = (period: SubscriptionPeriod) => {
    setPeriod(period);
  };

  const handleClickFreePlan = () => {
    sendEvent('choose_free_plan');
  };
  const handleClickPremPlan = () => {
    sendEvent('choose_premium_plan', { plan: period });
  };

  return (
    <Box>
      <Box>
        <SwitcherPlan period={period} handleClickToPeriod={changePeriodToYearly} />

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: '16px', sm: '40px' },
          }}
        >
          <SubscriptionCard
            type="free"
            period={period}
            onClick={showFreePlanButton ? handleClickFreePlan : null}
            openFromPopup={openFromPopup}
          />
          <SubscriptionCard
            type="prem"
            period={period}
            onClick={handleClickPremPlan}
            openFromPopup={openFromPopup}
          />
        </Box>
      </Box>

      {ancor && <MoreDeatails ancor={ancor} />}
    </Box>
  );
};
