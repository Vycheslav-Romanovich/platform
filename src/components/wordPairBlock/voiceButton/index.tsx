import React, { useEffect, useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { IconButton } from '@mui/material';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import styles from './voiceButton.module.scss';

import { playMachineAudioFragment } from '~/helpers/playMachineAudioFragment';

type Props = {
  word: string;
  addedClasses?: string;
};

export const VoiceButton: React.FC<Props> = observer(({ word, addedClasses }) => {
  const [isActive, setIsActive] = useState(false);
  const buttonClasses = classNames(addedClasses, styles.voiceButton, {
    [styles.active]: isActive,
  });
  useEffect(() => {
    window.speechSynthesis.getVoices();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <IconButton
      className={buttonClasses}
      onClick={() => {
        setIsActive(true);
        playMachineAudioFragment(word).then(() => setIsActive(false));
      }}
    >
      <VolumeUpIcon />
    </IconButton>
  );
});
