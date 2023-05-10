import React from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LanguageIcon from '@mui/icons-material/Language';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Drawer,
  IconButton,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Logo } from '../logo';

import styles from './index.module.scss';

import { navLinks, navLinksAuth } from '~/constants/routes';
import { interfaceLanguages } from '~/constants/supportedLanguages';
import { PremiumButton } from '~/shared/PremiumButton';
import { userStore } from '~/stores';

type Props = {
  open: boolean;
  toggleDrawer: (isOpen) => void;
};

export const BurgerMenu: React.FC<Props> = ({ open, toggleDrawer }) => {
  const { pathname } = useRouter();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const handleChangeInterfaceLanguage = (code: string) => {
    i18n.changeLanguage(code);
    const found = router.locales.find(
      (locale) => locale === interfaceLanguages.find((element) => element.code === code).code
    );

    if (found != undefined) {
      router.push(router.asPath, router.asPath, { locale: found });
    } else {
      router.push(router.asPath, router.asPath, { locale: 'en' });
    }
  };

  return (
    <Drawer anchor="left" open={open} onClose={() => toggleDrawer(false)}>
      <div className={styles.header}>
        <IconButton onClick={() => toggleDrawer(false)} className={styles.closeBtn}>
          <CloseIcon />
        </IconButton>

        <Logo className={styles.logo} />
      </div>

      <Box className={styles.boxWrapper}>
        {(userStore.isAuth ? navLinksAuth : navLinks).map(({ title, path }, index) => {
          return (
            <Link href={path} key={index}>
              <ListItemButton
                className={`${pathname === path ? styles.active : ' '} ${styles.tab}`}
              >
                <Typography variant="text1" color="dark">
                  {t(`routes.navLinks.${title}`)}
                </Typography>
              </ListItemButton>
            </Link>
          );
        })}
      </Box>

      {userStore.isAuth ? (
        <PremiumButton isPrem={userStore.user.isActivePremium} className={styles.premBtn} />
      ) : null}

      {!userStore.isAuth ? (
        <>
          {/* TODO create a new component "change locale language" in entities folder*/}
          <Accordion classes={{ root: styles.rootAccordion }}>
            <AccordionSummary
              classes={{
                root: styles.rootAccordionSummaryLang,
                content: styles.contentAccordionSummaryLang,
              }}
              expandIcon={<ExpandMoreIcon />}
            >
              <LanguageIcon sx={{ width: '21px', height: '21px' }} />
              <Typography variant="text1" sx={{ marginLeft: '5.5px' }}>
                {i18n.language}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={styles.rootAccordionDetails}>
              {interfaceLanguages.map(({ name, code }, index) => {
                return (
                  <ListItemButton key={index} className={styles.accordionTab}>
                    <ListItemText
                      onClick={() => handleChangeInterfaceLanguage(code)}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: i18n.language === code ? 'var(--M_Blue)' : '',
                          fontWeight: i18n.language === code ? 600 : 400,
                          fontSize: '16px',
                          lineHeight: i18n.language === code ? '20px' : '24px',
                        },
                      }}
                      primary={name}
                    />
                  </ListItemButton>
                );
              })}
            </AccordionDetails>
          </Accordion>
        </>
      ) : null}
    </Drawer>
  );
};
