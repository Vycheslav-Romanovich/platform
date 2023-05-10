import { Box, Typography } from '@mui/material';

import { CardTemplate } from '../CardTemplate';
import { opportunitisData } from './config';

import styles from './styles.module.scss';

type Props = {
  titleId?: string;
};

export const NoLimits: React.FC<Props> = ({ titleId }) => {
  return (
    <Box id={titleId} component={'section'} pt="100px">
      <Typography variant="h2" align="center" sx={{ mb: { xs: '32px', sm: '32px' } }}>
        No limits, more opportunities
      </Typography>

      <Box className={styles.cardsWrapper}>
        {opportunitisData.map(({ Icon, title, subtitle }, index) => (
          <CardTemplate
            key={index}
            background={'var(--White)'}
            width={'100%'}
            height={{ xs: 'auto', sm: '100%' }}
            padding={{ xs: '24px 30px', sm: '24px' }}
          >
            <>
              <Icon width="56px" height="56px" />

              <Typography variant="h3" sx={{ mt: '32px', mb: '16px' }}>
                {title}
              </Typography>

              <Typography variant="body2">{subtitle}</Typography>
            </>
          </CardTemplate>
        ))}
      </Box>
    </Box>
  );
};
