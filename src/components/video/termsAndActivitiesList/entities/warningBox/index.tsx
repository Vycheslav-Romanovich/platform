import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import InfoSquare from '~/assets/icons/infoSquare.svg';

import styles from './warningBox.module.scss';

import { subtitlesStore } from '~/stores';

type Props = {
  type: 'word' | 'activity';
};

export const WarningBox: React.FC<Props> = observer(({ type }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.notEnoughWords}>
      <InfoSquare className={styles.infoSquare} />

      <div style={{ marginTop: '6px' }}>
        {type === 'word' &&
          (subtitlesStore.isExist
            ? t('textForTermsAndActivities.saveTerms')
            : t('textForTermsAndActivities.notAutoSub'))}

        {type === 'activity' && t('textForTermsAndActivities.customize')}
      </div>
    </div>
  );
});
