/** @type {import('next-sitemap').IConfig} */
const siteUrl = 'https://edu.elang.com';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: [
    '/change_password',
    '/choose-account-type',
    '/account',
    '/restore-password',
    '/create-video-lesson',
    '/own-words',
    '/teachers',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/change_password',
          '/choose-account-type',
          '/account',
          '/restore-password',
          '/create-video-lesson',
          '/own-words',
          '/teachers',
        ],
      },
    ],
    additionalSitemaps: [`${siteUrl}/server-sitemap-index.xml`],
    additionalPaths: async (config) => [await config.transform(config, '/lessons')],
  },
};
