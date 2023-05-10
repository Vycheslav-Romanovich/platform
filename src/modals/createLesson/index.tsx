import { FC, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import { Box, Button, TextField, useMediaQuery } from '@mui/material';

import Like from '~/assets/icons/like.svg';

import Modal from '../../UI/modal';

import styles from './index.module.scss';

import { AddLessonResponse } from '~/types/api';

type Props = {
  isOpen: boolean;
  close: () => void;
  newLesson: AddLessonResponse;
  createLesson: string;
  checkToAssignLesson?: () => void;
};

const CreateLesson: FC<Props> = ({ isOpen, close, createLesson, checkToAssignLesson }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const popoverOpen = Boolean(anchorEl);
  const { t } = useTranslation();
  const mdScreenWidth = useMediaQuery('(max-width:767px)');
  const id = popoverOpen ? 'simple-popover' : undefined;

  const openPopover = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setTimeout(() => {
      setAnchorEl(null);
    }, 2000);
  };

  const copyLink = (e) => {
    navigator.clipboard.writeText(createLesson);
    openPopover(e);
  };

  return (
    <Modal isOpen={isOpen} close={() => close()} modalClasses={styles.modal}>
      <div className={styles.innerWrapper}>
        {/*@todo переписать json согласно фигме*/}
        <h2>
          {t('createLessonModal.lessonCreated')} <Like />
        </h2>
        <h2>{t('createLessonModal.share')}</h2>
        <p className={styles.modalDescription}>{t('createLessonModal.copyDescription')}</p>

        <div className={styles.copyLink}>
          <TextField
            classes={{ root: styles.noTopInField }}
            sx={{ top: 0, display: { xs: 'none', md: 'flex' } }}
            type="text"
            disabled
            value={createLesson}
            style={{ width: '100%' }}
          />

          <Button
            onClick={close}
            variant="outlined"
            sx={{ width: '100%', display: { xs: 'flex', md: 'none' } }}
          >
            {t('createLessonModal.done')}
          </Button>

          <Button
            id={'copy_link'}
            variant={mdScreenWidth ? 'contained' : 'outlined'}
            onClick={copyLink}
            sx={{
              minWidth: { xs: 'auto', md: '106px' },
              height: { md: '100%' },
              whiteSpace: 'nowrap',
              padding: { xs: '0 16px', md: '0 32px' },
            }}
            size="medium"
            aria-describedby={id}
          >
            <InsertLinkOutlinedIcon
              sx={{
                width: { xs: '16px', md: '25px' },
                height: { xs: '16px', md: '25px' },
                transform: 'rotate(135deg)',
                color: { xs: 'var(--White)', md: 'var(--Grey)' },
                margin: '0 8px 0 0',
              }}
            />
            {/*@todo переписать json согласно фигме*/}
            {t('createLessonModal.copyLink')}
          </Button>

          <div className={popoverOpen ? styles.tooltipOpen : styles.closeTooltip}>
            <div className={styles.tooltip}>
              <span className={styles.tooltiptext}>{t('createLessonModal.linkCopied')}</span>
            </div>
          </div>
        </div>
        {/*<div className={styles.boxWrapper}>*/}
        {/*  <h2>{newLesson?.name}</h2>*/}
        {/*  <div className={styles.box}>*/}
        {/*    {newLesson?.word?.map((item, index: number) => {*/}
        {/*      return (*/}
        {/*        <div key={index} className={styles.wordPairs}>*/}
        {/*          <span>{++index}</span>*/}
        {/*          <div className={styles.wordPair}>*/}
        {/*            <h3>{item.word}</h3>*/}
        {/*            <h4>{item.translate}</h4>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      );*/}
        {/*    })}*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*<div className={styles.buttons}>*/}
        {/*  <Button onClick={() => close()} variant="outlined" style={{ minWidth: '106px' }}>*/}
        {/*    {t('createLessonModal.done')}*/}
        {/*  </Button>*/}
        {/*</div>*/}
        <Box sx={{ margin: '24px 0' }}>{'or'}</Box>
        <Button
          style={{
            minWidth: 'fit-content',
          }}
          sx={{ width: '100%', height: '48px' }}
          variant={'contained'}
          size="medium"
          onClick={checkToAssignLesson}
        >
          {t('lessonId.assign')}
        </Button>
      </div>
    </Modal>
  );
};
export default CreateLesson;
