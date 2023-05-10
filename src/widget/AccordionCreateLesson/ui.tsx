import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { observer } from 'mobx-react';
import Image from 'next/image';

import { ChoosePlan } from '../ChoosePlan';

import { Accordion } from '~/components/accordion';
import { accordionBtn } from '~/constants/routes';
import { FullViewModal } from '~/modals/fullViewModal';
import { userStore } from '~/stores';

type Props = {
  showLock?: boolean;
  size?: 'small' | 'large' | 'medium';
  className?: string;
};

export const AccordionCreateLesson: FC<Props> = observer(
  ({ showLock, size = 'large', className }) => {
    const { t } = useTranslation();
    const [openPopupLimitModal, setOpenPopupLimitModal] = useState<boolean>(false);

    const isLimitReached =
      userStore.user.limits.ownLessonCounter < 1 && !userStore.user.isActivePremium;

    const handleOpenPopupLimit = () => {
      setOpenPopupLimitModal(!openPopupLimitModal);
    };

    return (
      <>
        <FullViewModal
          isOpen={openPopupLimitModal}
          close={handleOpenPopupLimit}
          title={'Switch to another plan to create more than 6 lessons'}
        >
          <ChoosePlan openFromPopup />
        </FullViewModal>

        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isLimitReached && showLock && (
            <Image src="/assets/icons/lock.svg" width="32px" height="32px" alt="lock" />
          )}

          <Accordion
            headerName={t('header.createLesson')}
            itemToMap={accordionBtn}
            className={className}
            size={size}
            nameData="accordionBtn"
            loading={userStore.loadingUserInfo}
            onClick={isLimitReached && handleOpenPopupLimit}
          />
        </Box>
      </>
    );
  }
);
