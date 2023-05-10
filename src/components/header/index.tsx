import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Button, IconButton, MenuItem, Select } from '@mui/material';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { BurgerMenu } from './burgerMenu';
import { HeaderAvatar } from './headerAvatar';
import { Logo } from './logo';

import styles from './index.module.scss';

import UseDesktopNotification from '~/components/useDesktopNotification/useDesktopNotification';
import { navLinks, navLinksAuth } from '~/constants/routes';
import { interfaceLanguages } from '~/constants/supportedLanguages';
import { PremiumButton } from '~/shared/PremiumButton';
import { lessonStore, userStore } from '~/stores';
import { AutocompleteDropdown } from '~/UI/autocomplete';
import TabBar from '~/UI/tabBar';
import { AccordionCreateLesson } from '~/widget/AccordionCreateLesson';

const Header: React.FC = () => {
  const { push, route, asPath } = useRouter();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isAuthPages = [
    '/login',
    '/signup',
    '/restore-password',
    '/change_password',
    '/choose-account-type',
  ].some((e) => e === route);
  const accordionStyles = classNames('', { [styles.hideAccordion]: !userStore.isAuth });
  const [open, setOpen] = useState<boolean>(false);
  const [showHeaderEl, setShowHeaderEl] = useState<boolean>(true);
  const [openLang, setOpenLang] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [search, setSearch] = useState(null);
  const [searchHistoryLS, setSearchHistoryLS] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };

  const paths = (userStore.isAuth ? navLinksAuth : navLinks).map((el) => el.path);
  const pathsSecond = (userStore.isAuth ? navLinksAuth : navLinks).map((el) => el.activePath);
  const [value, setValue] = useState(paths.indexOf(asPath));
  const [valueSecond] = useState(pathsSecond.indexOf(asPath));

  useEffect(() => {
    const { pathname } = window.location;
    userStore.setUserNotAuthLink(pathname);

    if (value === valueSecond) {
      setValue(paths.indexOf(asPath));
    }
  }, [asPath]);

  useEffect(() => {
    if (localStorage.getItem('searchHistory') === null) {
      return;
    } else {
      const locStorItems = localStorage.getItem('searchHistory');
      setSearchHistoryLS(locStorItems.split(' &=? '));
    }
  }, []);

  useEffect(() => {
    openLang
      ? document.body.classList.add('modal-open')
      : document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [openLang]);

  const onFocusInput = () => {
    setShowHeaderEl(false);
  };

  const searchWrapperStyles = classNames(styles.search, {
    [styles.searchWrapper]: showHeaderEl === false,
  });

  const handleResetSearch = () => {
    setSearchText('');
  };

  const onSubmit = () => {
    push(`/library/public?search=${inputValue}`);
  };

  useEffect(() => {
    setSearch(
      lessonStore?.lessonsPublic?.data?.map((item) => {
        return item.name;
      })
    );
  }, [searchText, inputValue]);

  const handleSubmit = () => {
    onSubmit();
    if (localStorage.getItem('searchHistory') === null) {
      const itemsTOadd = `${inputValue}`;
      searchText != '' && localStorage.setItem('searchHistory', itemsTOadd);
    } else {
      const searchHistory = localStorage.getItem('searchHistory');
      let locStorItems;
      searchHistory.slice(searchHistory.indexOf(' &=? ') + 5) !==
      searchHistory.slice(searchHistory.lastIndexOf(' &=? ') + 5)
        ? (locStorItems = searchHistory.slice(searchHistory.indexOf(' &=? ') + 5))
        : (locStorItems = searchHistory);
      const itemsTOadd = `${locStorItems} &=? ${inputValue}`;
      inputValue != '' &&
        !locStorItems.includes(inputValue) &&
        localStorage.setItem('searchHistory', itemsTOadd);
    }
  };

  const getAllResults = () => {
    onSubmit();
  };

  const handleChangeInterfaceLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
    const found = router.locales.find(
      (locale) =>
        locale === interfaceLanguages.find((element) => element.code === event.target.value).code
    );

    if (found != undefined) {
      router.push(router.asPath, router.asPath, { locale: found });
    } else {
      router.push(router.asPath, router.asPath, { locale: 'en' });
    }
  };

  return (
    <>
      <BurgerMenu open={open} toggleDrawer={toggleDrawer(false)} />

      <div className={styles.header}>
        {isAuthPages && (
          <div className={styles.toolbarAuth}>
            <Logo />
          </div>
        )}

        {!isAuthPages ? (
          <div className={styles.toolbar}>
            <IconButton onClick={toggleDrawer(true)} className={styles.hamburgerMenu}>
              <MenuIcon />
            </IconButton>

            <div slot="start" className={styles.navbar}>
              <Logo />
              {showHeaderEl && (
                <TabBar
                  isHeader
                  data={userStore.isAuth ? navLinksAuth : navLinks}
                  nameData="navLinks"
                  myLesson={userStore.user?.id === lessonStore.lessonData?.userId}
                />
              )}
            </div>

            {userStore.isAuth && showHeaderEl && (
              <AccordionCreateLesson size="medium" className={accordionStyles} />
            )}

            <AutocompleteDropdown
              inputValue={inputValue}
              setInputValue={(event, inputValue) => {
                setInputValue(inputValue);
              }}
              value={searchText}
              options={searchText == '' ? searchHistoryLS : search}
              placeholder={t('header.placeholderFind')}
              onChange={(e) => setSearchText(e.target.value)}
              onReset={handleResetSearch}
              onSubmit={handleSubmit}
              stylesWrapper={searchWrapperStyles}
              onFocus={onFocusInput}
              onBlur={() => setShowHeaderEl(true)}
              getAllResults={getAllResults}
            />

            {showHeaderEl ? (
              userStore.isAuth ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PremiumButton
                    isPrem={userStore.user.isActivePremium}
                    className={styles.premiumBtn}
                  />
                  <HeaderAvatar />
                </Box>
              ) : (
                <div className={styles.auth} slot="end">
                  <div className={styles.btns}>
                    <Link href={`/login?next=${userStore.userNotAuthLink}`} passHref>
                      <Button color="primary" variant="text">
                        {t('header.titleLogin')}
                      </Button>
                    </Link>

                    <Link href={`/signup?next=${userStore.userNotAuthLink}`} passHref>
                      <Button color="primary" variant="contained">
                        {t('header.titleSignup')}
                      </Button>
                    </Link>
                  </div>

                  <div className={styles.lang}>
                    <IconButton onClick={() => setOpenLang(!openLang)}>
                      <LanguageIcon sx={{ width: '21px', height: '21px' }} />
                      <Select
                        open={openLang}
                        className={styles.selectLang}
                        variant="standard"
                        value={i18n.language}
                        onChange={handleChangeInterfaceLanguage}
                        renderValue={(p) => p}
                        disableUnderline
                        MenuProps={{ disableScrollLock: true }}
                      >
                        {interfaceLanguages.map(({ code, name }) => {
                          return (
                            <MenuItem
                              key={code}
                              value={code}
                              sx={{
                                '&.Mui-selected': {
                                  color: 'var(--M_Blue)',
                                },
                              }}
                            >
                              {name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </IconButton>
                  </div>
                </div>
              )
            ) : null}
          </div>
        ) : null}
      </div>
      <UseDesktopNotification />
    </>
  );
};

export default observer(Header);
