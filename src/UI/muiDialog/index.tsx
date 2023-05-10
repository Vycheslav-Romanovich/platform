import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Button, IconButton, Slide, Typography, useMediaQuery } from '@mui/material';
import Dialog from '@mui/material/Dialog';

import styles from './index.module.scss';

const Transition = React.forwardRef(function Transition(
  props: any & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  title: string;
  settingBottomBtn?: { variant: 'text' | 'contained' | 'outlined' };
  handleBack?: () => void;
  bottomButons?: React.ReactNode;
};

const MuiDialog: React.FC<Props> = ({
  isOpen,
  handleClose,
  handleBack,
  children,
  title,
  bottomButons,
  settingBottomBtn = {
    variant: 'contained',
  },
}) => {
  const isKeyboardHeight = useMediaQuery('(max-height:520px)');

  return (
    <Dialog fullScreen open={isOpen} onClose={handleClose} TransitionComponent={Transition}>
      <div className={styles.boxWrapper}>
        <IconButton onClick={handleClose} sx={{ position: 'absolute', right: '10px' }}>
          <CloseIcon />
        </IconButton>

        {handleBack && (
          <IconButton onClick={handleBack} sx={{ position: 'absolute', left: 0 }}>
            <KeyboardBackspaceIcon />
          </IconButton>
        )}

        <Typography variant={'h2'} sx={{ width: '100%', textAlign: 'center', mt: '8px' }}>
          {title}
        </Typography>

        <div className={styles.box}>{children}</div>

        {!isKeyboardHeight &&
          (bottomButons ? (
            <>{bottomButons}</>
          ) : (
            <Button
              color="primary"
              variant={settingBottomBtn.variant}
              size="large"
              sx={{ width: '100%' }}
              onClick={handleClose}
            >
              Back to video
            </Button>
          ))}
      </div>
    </Dialog>
  );
};

export default MuiDialog;
