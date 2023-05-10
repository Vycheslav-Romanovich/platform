import React, { FC } from 'react';
import { Typography } from '@mui/material';

type Props = {
  title: string;
};

export const FirstLetterAvatar: FC<Props> = ({ title }) => {
  return (
    <Typography
      variant={'h2'}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--D_Blue) !important',
        backgroundColor: 'var(--Sky)',
        width: '100%',
        height: '100%',
      }}
    >
      {title ? title[0].toUpperCase() : ''}
    </Typography>
  );
};
