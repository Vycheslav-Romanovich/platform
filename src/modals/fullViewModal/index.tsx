import { ReactElement } from 'react';
import { Box, Button, Typography } from '@mui/material';

import styles from './index.module.scss';

import Modal from '~/UI/modal';

type Props = {
  isOpen: boolean;
  title: string;
  children: ReactElement;
  close?: () => void;
  access?: () => void;
  buttonTextLeft?: string;
  buttonTextRight?: string;
  idYesButton?: string;
  revert?: boolean;
};

export const FullViewModal: React.FC<Props> = ({
  isOpen,
  title,
  children,
  close,
  access,
  buttonTextLeft,
  buttonTextRight,
  idYesButton,
  revert,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      close={close}
      wrapperClasses={styles.wrapperClasses}
      modalClasses={styles.modalClasses}
    >
      <Typography variant="h3" sx={{ mb: { xs: '48px', md: '40px' }, textAlign: 'center' }}>
        {title}
      </Typography>

      {children}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '16px', mt: '24px' }}>
        {buttonTextLeft && (
          <Button
            onClick={revert ? access : close}
            sx={{ height: '48px', width: '100%', whiteSpace: 'nowrap', minWidth: 'auto' }}
            variant="outlined"
          >
            {buttonTextLeft}
          </Button>
        )}

        {buttonTextRight && (
          <Button
            id={idYesButton}
            size="large"
            sx={{ width: '100%', whiteSpace: 'nowrap', minWidth: 'auto' }}
            variant="contained"
            onClick={revert ? close : access}
          >
            {buttonTextRight}
          </Button>
        )}
      </Box>
    </Modal>
  );
};
