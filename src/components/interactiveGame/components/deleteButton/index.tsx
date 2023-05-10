import { Button } from '@mui/material';

import styles from './questionBlock.module.scss';

type Props = {
  onClick: () => void;
  className?: string;
};

export const DeleteButton: React.FC<Props> = ({ onClick, className }) => {
  return <Button className={`${styles.deleteQuestionBlock} ${className} `} onClick={onClick} />;
};
