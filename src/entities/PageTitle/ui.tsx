import React, { ReactElement } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';

type Props = {
  title: string;
  children: ReactElement;
  childrenTearTitle?: ReactElement;
  center?: boolean;
  maxWidth?: string;
};

export const PageTitle: React.FC<Props> = ({
  title,
  children,
  childrenTearTitle,
  center,
  maxWidth = 'initial',
}) => {
  const isMobile = useMediaQuery('(max-width:767px)');

  return (
    <Box sx={{ pb: '112px', maxWidth }}>
      <Box sx={{ display: 'flex', justifyContent: center ? 'center' : 'space-between' }}>
        <Typography variant={isMobile ? 'h1' : 'h2'} sx={{ pb: { md: '40px', xs: '24px' } }}>
          {title}
        </Typography>

        {childrenTearTitle}
      </Box>

      {children}
    </Box>
  );
};
