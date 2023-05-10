import { Box } from '@mui/material';

type Props = {
  background: string;
  width: string | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
  height: string | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
  children: React.ReactElement;
  padding?: string | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
  shadowBox?: boolean;
};

export const CardTemplate: React.FC<Props> = ({
  background,
  width,
  height,
  children,
  shadowBox,
  padding,
}) => {
  return (
    <Box
      sx={{
        height,
        width,
        position: 'relative',
        background,
        boxShadow: shadowBox ? 'var(--Shadow8px)' : 'none',
        borderRadius: '16px',
        padding,
      }}
    >
      {children}
    </Box>
  );
};
