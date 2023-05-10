import React, { useEffect } from 'react';
// eslint-disable-next-line import/named
import { CacheProvider, EmotionCache } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import '../i18n';

import Initialization from '../hocs/initialization';

import '../styles/globals.scss';
import '../styles/theme.scss';
/* Reset CSS custom styles */
import '../styles/reset.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import createEmotionCache from '~/helpers/createEmotionCache';
import lightThemeOptions from '~/theme/lightThemeOptions';

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const MyApp: React.FunctionComponent<MyAppProps> = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      import('react-facebook-pixel')
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.init('1285933275498989');
          ReactPixel.pageView();

          router.events.on('routeChangeComplete', () => {
            ReactPixel.pageView();
          });
        });
    }
  }, [router.events]);

  return (
    <>
      <Script
        id="gtag-base"
        async
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-K5Q6KPD');`,
        }}
      />
      <Initialization pageProps={pageProps}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={lightThemeOptions}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </CacheProvider>
      </Initialization>
    </>
  );
};

export default MyApp;
