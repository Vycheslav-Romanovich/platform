import React from 'react';
import { useTranslation } from 'react-i18next';

import Facebook from '../../assets/icons/social/facebook.svg';
import Instagram from '../../assets/icons/social/instagram.svg';
import Linkedin from '../../assets/icons/social/linkedin.svg';
import TikTok from '../../assets/icons/social/tikTok.svg';
import YouTube from '../../assets/icons/social/youTube.svg';

import { Logo } from '../header/logo';

import styles from './index.module.scss';

import { eLangProducts, more, social } from '~/constants/links';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerWrapper}>
        <div className={styles.footerLogo}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <ul className={styles.footerSocial}>
            <li>
              <a href={social.youtube} target="_blank" rel="noreferrer">
                <YouTube />
              </a>
            </li>
            <li>
              <a href={social.instagram} target="_blank" rel="noreferrer">
                <Instagram />
              </a>
            </li>
            <li>
              <a href={social.facebook} target="_blank" rel="noreferrer">
                <Facebook />
              </a>
            </li>
            <li>
              <a href={social.tiktok} target="_blank" rel="noreferrer">
                <TikTok />
              </a>
            </li>
            <li>
              <a href={social.linkedin} target="_blank" rel="noreferrer">
                <Linkedin />
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.footerLink}>
          <div className={styles.footerMore}>
            <p className={styles.title}> {t('footer.more')}</p>
            <ul>
              {/* <li>
                  <a className={styles.text} href="#">
                    FAQ
                  </a>
                </li> */}
              <li>
                <a className={styles.text} href={' library'}>
                  {t('footer.titleLibrary')}
                </a>
              </li>
              <li>
                <a
                  className={styles.text}
                  href={more.englishLevelTest}
                  target={'_blank'}
                  rel="noreferrer"
                >
                  {t('footer.titleTest')}
                </a>
              </li>
              <li>
                <a
                  className={styles.text}
                  href={more.leaveFeedback}
                  target={'_blank'}
                  rel="noreferrer"
                >
                  {t('footer.feedback')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className={styles.title}>{t('footer.titleProducts')}</p>
            <ul>
              <li>
                <a className={styles.text} href={eLangProducts.extension}>
                  {t('footer.extension')}
                </a>
              </li>
              <li>
                <a className={styles.text} href={eLangProducts.ETV}>
                  {t('footer.app')}
                </a>
              </li>
              <li>
                <a className={styles.text} href={eLangProducts.worldGames}>
                  {t('footer.games')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <ul className={styles.footerSocialNone}>
          <li>
            <a href={social.youtube} target="_blank" rel="noreferrer">
              <YouTube />
            </a>
          </li>
          <li>
            <a href={social.instagram} target="_blank" rel="noreferrer">
              <Instagram />
            </a>
          </li>
          <li>
            <a href={social.facebook} target="_blank" rel="noreferrer">
              <Facebook />
            </a>
          </li>
          <li>
            <a href={social.tiktok} target="_blank" rel="noreferrer">
              <TikTok />
            </a>
          </li>
          <li>
            <a href={social.linkedin} target="_blank" rel="noreferrer">
              <Linkedin />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
