import React from 'react';
import { Typography } from '@mui/material';
import Image from 'next/image';

import { paymentMethodNamesData } from './config';

import styles from './styles.module.scss';

type Props = {
  paymentMethodName: string;
  creditCardLast4: string;
};

export const PaymentMethodBlock: React.FC<Props> = ({ creditCardLast4, paymentMethodName }) => {
  return (
    <div className={styles.paymentInfo}>
      <Image
        src={paymentMethodNamesData[paymentMethodName]}
        width="37px"
        height="12px"
        className={styles.paymentMethodImg}
        alt={paymentMethodName}
      />

      <Typography variant="body1">{`XXXX-XXXX-XXXX-${creditCardLast4}`}</Typography>
    </div>
  );
};
