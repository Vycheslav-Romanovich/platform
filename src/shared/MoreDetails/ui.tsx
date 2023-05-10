import { Box, Button } from '@mui/material';

import ArrowBottom from './assets/arrow.svg';

type Props = {
  ancor: string;
};

export const MoreDeatails: React.FC<Props> = ({ ancor }) => {
  return (
    <Box display="flex" justifyContent="center" mt="26px">
      <Button
        component="a"
        disableRipple
        disableFocusRipple
        href={`#${ancor}`}
        startIcon={<ArrowBottom />}
      >
        More details
      </Button>
    </Box>
  );
};
