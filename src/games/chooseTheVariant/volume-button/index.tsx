import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import Volume from '../../../assets/icons/vocabulary/volume.svg';

import styles from './volume-button.module.scss';

import { playMachineAudioFragment } from '~/helpers/playMachineAudioFragment';
import { variantStore } from '~/stores';

type Props = {
  word: string;
  addedClasses?: string;
};

export const VolumeButton: React.FC<Props> = observer(({ word, addedClasses }) => {
  const [isActive, setIsActive] = useState(false);
  const buttonClasses = classNames(addedClasses, styles.volumeButton, {
    [styles.active]: isActive,
  });
  const { currentIndexQuestion } = variantStore;

  useEffect(() => {
    window.speechSynthesis.getVoices();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
      playMachineAudioFragment(word).then(() => setIsActive(false));
    }, 700);

    return () => {
      clearTimeout(timer);
    };
  }, [currentIndexQuestion]);

  return (
    <IconButton
      className={buttonClasses}
      onClick={() => {
        setIsActive(true);
        playMachineAudioFragment(word).then(() => setIsActive(false));
      }}
    >
      <Volume />
    </IconButton>
  );
});
