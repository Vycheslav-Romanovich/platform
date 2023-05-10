import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';

import ArrowBack from '~/assets/icons/arrows/arrow.svg';

type Props = {
  hrefBack: string;
  previosPage: string;
  currentPage: string;
};

export const BreadCrumbs: React.FC<Props> = ({ hrefBack, previosPage, currentPage }) => {
  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', mb: '8px' }}>
      <Link href={hrefBack} passHref>
        <Button
          variant="text"
          color="dark"
          component="a"
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&:hover': { backgroundColor: 'transparent' },
          }}
          disableTouchRipple
        >
          <ArrowBack width="28px" height="100%" />
          <Typography variant="body2" ml="16px">
            {previosPage}
          </Typography>
        </Button>
      </Link>

      <Typography variant="body2" mx="16px">
        {'/'}
      </Typography>
      <Typography variant="body2">{currentPage}</Typography>
    </Box>
  );
};
