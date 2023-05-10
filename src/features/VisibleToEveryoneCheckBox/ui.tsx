import React, { useState } from 'react';
import { Box, Checkbox, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import Image from 'next/image';

import styles from './index.module.scss';

import { FullViewModal } from '~/modals/fullViewModal';
import { lessonStore, userStore } from '~/stores';

type Props = {
  popupContent: React.ReactElement;
};

export const VisibleToEveryoneCheckBox: React.FC<Props> = observer(({ popupContent }) => {
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const isPrem = userStore.user.isActivePremium;

  const togglePlanModalOpen = () => {
    !isPrem && setIsPlanOpen(!isPlanOpen);
    isPrem && lessonStore.setIsPrivateLesson(!lessonStore.lessonData.private);
  };

  return (
    <>
      <FullViewModal
        isOpen={isPlanOpen}
        close={togglePlanModalOpen}
        title={'Switch to another plan to make your lesson private'}
      >
        {popupContent}
      </FullViewModal>

      <Box
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={togglePlanModalOpen}
      >
        {!isPrem && (
          <div className={styles.lockImg}>
            <Image src="/assets/icons/lock.svg" width="32px" height="32px" alt="lock" />
          </div>
        )}

        <Typography variant={'body2'} sx={{ color: 'var(--L_Grey)', whiteSpace: 'nowrap' }}>
          {'Visible to everyone'}
        </Typography>

        <Checkbox checked={!lessonStore?.lessonData?.private} disabled={!isPrem} color="primary" />
      </Box>
    </>
  );
});
