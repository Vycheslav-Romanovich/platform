import { Button } from '@mui/material';
import Link from 'next/link';

import FreeTrial from './assets/free-trial.svg';
import Premium from './assets/premium.svg';

type Props = {
  isPrem: boolean;
  className?: string;
};

export const PremiumButton: React.FC<Props> = ({ isPrem, className }) => {
  return (
    <Link href={isPrem ? '/subscription' : '/subscription-plans'} passHref>
      <Button
        component="a"
        disableRipple
        disableFocusRipple
        startIcon={isPrem ? <Premium /> : <FreeTrial />}
        sx={{ whiteSpace: 'nowrap' }}
        className={className}
      >
        {isPrem ? 'Premium' : 'Free trial'}
      </Button>
    </Link>
  );
};
