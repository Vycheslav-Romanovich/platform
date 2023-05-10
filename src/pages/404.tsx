import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import Image from 'next/image';
import Link from 'next/link';

import Layout from '~/hocs/layout';

const PageNotFound: React.FC = () => {
  const { t } = useTranslation();
  const title = t('404.title');
  const body = t('404.body');

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box maxWidth="600px">
          <Typography align="center" variant="h2">
            {title}
          </Typography>
          <Typography align="center" variant="body1" marginTop="32px">
            {body}
          </Typography>
        </Box>

        <Link href="/" passHref>
          <Button variant="contained" size="large" sx={{ marginTop: '40px' }}>
            {t('404.back')}
          </Button>
        </Link>

        <Box sx={{ marginTop: '64px', userSelect: 'none' }}>
          <Image
            src="/assets/404/not-found.svg"
            width="250px"
            height="250px"
            alt="Not fount image"
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default PageNotFound;
