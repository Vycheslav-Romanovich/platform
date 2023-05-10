import React from 'react';
import { Typography } from '@mui/material';

import { VoiceButton } from './voiceButton';

import styles from './wordPairBlock.module.scss';

type Props = {
  word: string;
  translate: string;
  display: string;
};

export const WordPairBlock: React.FC<Props> = ({ word, translate, display }) => {
  return (
    <div className={styles.pairBlock} style={{ display: display }}>
      <div className={styles.voiceButton}>
        <VoiceButton word={word} />
      </div>
      <div className={styles.wordBlock}>
        <Typography variant="h4" className={styles.word} color={'var(--D_Blue)'}>
          {word}
        </Typography>
        <div className={styles.line} />
        <Typography variant="body1" className={styles.translate} color={'var(--D_Blue)'}>
          {translate}
        </Typography>
      </div>
    </div>
  );
};
