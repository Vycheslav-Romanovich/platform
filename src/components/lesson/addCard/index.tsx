import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material';
import { observer } from 'mobx-react';
import Image from 'next/image';

import styles from './index.module.scss';

type Props = {
  addText: string;
  addItemAction: () => void;
  showLock?: boolean;
};

const AddCard: React.FC<Props> = ({ addText, addItemAction, showLock }) => {
  return (
    <div className={styles.createCard} onClick={addItemAction}>
      <AddIcon className={styles.addOutline} />

      <Typography variant="h4" color={'var(--Grey_Blue)'}>
        {addText}
      </Typography>

      {showLock && <Image src="/assets/icons/lock.svg" width="32px" height="32px" alt="lock" />}
    </div>
  );
};

export default observer(AddCard);
