import { GetServerSideProps } from 'next';
import { getServerSideSitemap, ISitemapField } from 'next-sitemap';

export const GetPost = async () => {
  const data = await fetch('https://easy4learn.com/api/lessons/public?pageSize=none', {
    method: 'GET',
  });
  const res = await data.json();

  return res;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (process.env.APP_ENV === 'production') {
    const siteUrl = 'https://edu.elang.com/lesson';
    const data = await GetPost();
    const fields: ISitemapField[] = data.data.map((data) => ({
      loc: `${siteUrl}/${data.id}`,
      lastmod: new Date().toISOString(),
    }));

    return getServerSideSitemap(ctx, fields);
  } else {
    return getServerSideSitemap(ctx, []);
  }
};

export default function Site() {
  //console
}
