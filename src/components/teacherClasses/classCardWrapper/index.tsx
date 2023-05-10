import styles from './index.module.scss';

type Props = {
  children: React.ReactNode;
  isModal?: boolean;
};

export const ClassCardWrapper: React.FC<Props> = ({ children, isModal }) => {
  return <div className={isModal ? styles.cardsModalWrapper : styles.cardsWrapper}>{children}</div>;
};
