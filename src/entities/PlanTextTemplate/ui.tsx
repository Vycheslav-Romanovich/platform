import { Box, Typography, useMediaQuery } from '@mui/material';

import CheckIcon from './assets/check.svg';

import type { CardDataTextItems } from '~/features/SubscriptionCard';

type Props = {
  textColor: string;
  textGrayColor: string;
  checkColor: string;
  data: CardDataTextItems;
  isPrem: boolean;
};

export const PlanTextTemplate: React.FC<Props> = ({
  textColor,
  textGrayColor,
  checkColor,
  data,
  isPrem,
}) => {
  const isMobile = useMediaQuery('(max-width:767px)');

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant={isMobile ? 'h3' : 'h4'} sx={{ color: textColor, mb: '16px' }}>
        {data.title}
      </Typography>

      <Box sx={{ mb: { xs: '10px', sm: '16px' } }}>
        <Typography variant="h2" component="span" sx={{ color: textColor }}>
          {data.price}
        </Typography>

        <Typography
          variant={isMobile ? 'text2' : 'body3'}
          component="span"
          sx={{ color: textGrayColor ?? textColor }}
        >
          {data.month}
        </Typography>
      </Box>

      <Typography
        variant="h5"
        sx={{ color: textGrayColor ?? textColor, mb: { xs: '24px', sm: '32px' } }}
      >
        {data.subtitle}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.features.map((element, index) => (
          <Box key={index} sx={{ display: 'flex', whiteSpace: 'break-spaces' }}>
            <CheckIcon
              style={{
                display: 'inline-block',
                flexShrink: 0,
                color: checkColor,
                userSelect: 'none',
                marginTop: '4px',
                marginRight: '22px',
              }}
            />
            {index < 2 && isPrem ? (
              <Typography variant={isMobile ? 'text1' : 'body2'} sx={{ color: textColor }}>
                <span style={{ color: 'var(--M_Yellow)' }}>{element.substring(0, 9)}</span>
                {element.slice(9)}
              </Typography>
            ) : (
              <Typography variant={isMobile ? 'text1' : 'body2'} sx={{ color: textColor }}>
                {element}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
