import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@mui/material';

import styles from './InfoCard.module.scss';

type Props = {
  text: string;
  Icon: any;
  onClick: () => void;
};

export const InfoCard: React.FC<Props> = ({ text, Icon, onClick }) => {
  const { t } = useTranslation();
  return (
    <Button variant="text" onClick={onClick} className={styles.wrapper}>
      <Icon width="100%" height="100%" />

      <Typography variant={'body1'}>{t(`interactiveGame.interactiveName.${text}`)}</Typography>
    </Button>
  );
};
