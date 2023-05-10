/** @type {import('next').NextConfig} */

const path = require('path');
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');

const isProd = process.env.APP_ENV === 'production';
const isLocal = process.env.APP_ENV === 'local';
const SERVER_DEV = 'https://2mymemory.com';
const SERVER_PROD = 'https://easy4learn.com';

const config = {
  env: {
    APP_ENV: process.env.APP_ENV,
    IS_PROD: isProd,
    CURRENT_SITE_URL: isProd ? 'https://edu.elang.com' : isLocal ? 'http://localhost:3001' : 'https://edu-elang-app-development-gm4e3.ondigitalocean.app',
    PRODUCT_SERVER_URL: isProd ? SERVER_PROD : isLocal ? 'http://localhost:3000' : SERVER_DEV,
    PRODUCT_SERVER_RECOMENDED_VIDEO_URL: 'https://subtitles-database.elang.app',
    GOOGLE_CLIENT_ID: isProd
      ? '1012044436399-7jk42ec62r5h8fsgeos6l443e5mjpobo.apps.googleusercontent.com'
      : '1012044436399-aih47nl95nn6ujbh453lds796te040t7.apps.googleusercontent.com',
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  i18n: {
    locales: ['en', 'de', 'ru', 'es', 'zh'],
    defaultLocale: 'en',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }],
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: '/library',
        destination: '/library/public',
        permanent: false,
      },
    ];
  },
  images: {
    domains: ['2mymemory.com', 'easy4learn.com', 'i.ytimg.com'],
  },
};

module.exports = withPlugins([withFonts], config);
