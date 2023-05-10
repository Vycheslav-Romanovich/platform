import styles from './index.module.scss';

type Props = {
  children: React.ReactNode;
};

export const RightBlock: React.FC<Props> = ({ children }) => {
  return <div className={styles.rightBlockWrapper}>{children}</div>;
};
