import styles from './index.module.scss';

type Props = {
  className?: string;
};

export const Dots: React.FC<Props> = ({ className }) => {
  return (
    <div className={`${styles.spinner} ${className}`}>
      <div className={styles.step1}></div>
      <div className={styles.step2}></div>
      <div className={styles.step3}></div>
    </div>
  );
};
