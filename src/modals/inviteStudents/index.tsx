import React from 'react';
import { useTranslation } from 'react-i18next';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import { Button, TextField, Typography, useMediaQuery } from '@mui/material';

import Student from '../../assets/images/student-pic.svg';
import TeacherWithStudents from '../../assets/images/teacherWithStudents.svg';

import Modal from '../../UI/modal';

import styles from './index.module.scss';

type Props = {
  isOpen: boolean;
  isInviteAfterCreate: boolean;
  close: () => void;
  linkForInvite: string;
};

const InviteStudents: React.FC<Props> = ({ isOpen, isInviteAfterCreate, close, linkForInvite }) => {
  const { t } = useTranslation();
  const mdMediaQuery = useMediaQuery('(max-width:767px)');
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const popoverOpen = Boolean(anchorEl);
  const id = popoverOpen ? 'simple-popover' : undefined;

  const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setTimeout(() => {
      setAnchorEl(null);
    }, 2000);
  };

  const copyLink = (e) => {
    navigator.clipboard.writeText(linkForInvite);
    openPopover(e);
  };

  return (
    <Modal isOpen={isOpen} close={() => close()} modalClasses={styles.modal}>
      <div className={styles.innerWrapper}>
        {isInviteAfterCreate ? (
          <TeacherWithStudents className={styles.studentWithTeacherPic} />
        ) : (
          <Student className={styles.studentPic} />
        )}
        <div className={styles.textBlock}>
          <Typography
            variant="h4"
            sx={{ textAlign: 'center', maxWidth: { xs: '160px', md: '210px' } }}
          >
            {isInviteAfterCreate
              ? t('inviteStudents.inviteStudentsCreate')
              : t('inviteStudents.inviteStudents')}
          </Typography>
          <Typography
            variant={mdMediaQuery ? 'body2' : 'h5'}
            sx={{ textAlign: 'center', color: 'var(--Grey)', maxWidth: '308px' }}
          >
            {t('inviteStudents.sendLink')}
          </Typography>
        </div>
        <div className={styles.copyLink}>
          <TextField
            type="text"
            disabled
            size="medium"
            value={linkForInvite}
            sx={{
              width: '100%',
              height: '100%',
              border: 0,
              display: { xs: 'none', md: 'flex' },
              backgroundColor: 'var(--L_Blue)',
              borderRadius: '8px',
            }}
          />
          <Button
            id={'copy_link'}
            variant="contained"
            onClick={copyLink}
            sx={{
              minWidth: 'auto',
              padding: '0 16px',
              height: { xs: '36px', md: '48px' },
            }}
            size="large"
            aria-describedby={id}
          >
            <InsertLinkOutlinedIcon
              sx={{
                width: { xs: '16px', md: '25px' },
                height: { xs: '16px', md: '25px' },
                transform: 'rotate(135deg)',
                color: 'var(--White)',
                margin: '0 8px 0 0',
              }}
            />
            <Typography variant="button1" sx={{ whiteSpace: 'nowrap' }}>
              {t('createLessonModal.copyLink')}
            </Typography>
          </Button>
          <div className={popoverOpen ? styles.tooltipOpen : styles.closeTooltip}>
            <div className={styles.tooltip}>
              <span className={styles.tooltiptext}>{t('createLessonModal.linkCopied')}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default InviteStudents;
