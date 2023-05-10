type Props = {
  children: React.ReactNode;
};

import styles from './index.module.scss';

export const StudentCardWrapper: React.FC<Props> = ({ children }) => {
  return <div className={styles.cardsWrapper}>{children}</div>;
};
