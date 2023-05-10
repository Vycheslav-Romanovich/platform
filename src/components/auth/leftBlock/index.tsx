import { useTranslation } from 'react-i18next';

import styles from './index.module.scss';

export const LeftBlock: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.leftBlockWrapper}>
      <div className={styles.blockWrapper}>
        <h2>{t('leftBlock.platform')}</h2>
        <h3>{t('leftBlock.change')}</h3>
      </div>
    </div>
  );
};
