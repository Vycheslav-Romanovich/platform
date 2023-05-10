import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    dark: Palette['primary'];
    darkGray: Palette['primary'];
    lightBlue: Palette['primary'];
  }

  interface PaletteOptions {
    dark?: PaletteOptions['primary'];
    darkGray?: PaletteOptions['primary'];
    lightBlue?: PaletteOptions['primary'];
  }

  interface TypographyVariants {
    body0: React.CSSProperties;
    body3: React.CSSProperties;
    text: React.CSSProperties;
    game: React.CSSProperties;
    h5m: React.CSSProperties;
    button0: React.CSSProperties;
    button1: React.CSSProperties;
    button2: React.CSSProperties;
    text1: React.CSSProperties;
    text2: React.CSSProperties;
    text3: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    body0?: React.CSSProperties;
    body3?: React.CSSProperties;
    text?: React.CSSProperties;
    game?: React.CSSProperties;
    text1?: React.CSSProperties;
    text2?: React.CSSProperties;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    dark: true;
    darkGray: true;
    lightBlue: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body0: true;
    body3: true;
    text: true;
    game: true;
    h5m: true;
    button0: true;
    button1: true;
    button2: true;
    text1: true;
    text2: true;
    text3: true;
    button: false;
    subtitle1: false;
    subtitle2: false;
  }
}

const lightThemeOptions = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  palette: {
    dark: {
      main: '#131c32',
      dark: '#131c32',
      contrastText: '#fff',
    },
    lightBlue: {
      main: '#F3F5FF',
    },
    darkGray: {
      main: '#353d52',
    },
    primary: {
      light: '#8CA0FF',
      main: '#6B85FF',
      dark: '#5C77F2',
    },
    secondary: {
      light: '#F3F5FF',
      main: '#7B839D',
      dark: '#131c32',
    },
    info: {
      main: '#ffffff',
      dark: '#ffffff',
      contrastText: '#535869',
    },
  },
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    fontSize: 16,
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '16px',
          lineHeight: '24px',
          color: '#353d52',
          padding: '16px',
          boxShadow: 'none !important',
          '&:hover': {
            backgroundColor: '#E2E7FF',
            color: '#131C32',
            boxShadow: 'none !important',
          },
          '&:active': {
            backgroundColor: '#E2E7FF',
            color: '#131C32',
            fontWeight: '600',
            boxShadow: 'none !important',
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          boxShadow: 'none !important',
          '&:hover': {
            boxShadow: 'none !important',
          },
          '&:active': {
            boxShadow: 'none !important',
          },
        },
        padding: {
          paddingTop: '0px',
          paddingBottom: '0px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          color: '#131c32',
          textTransform: 'none',
          '&:hover': {
            color: '#6B85FF',
            opacity: 1,
          },
          '&.Mui-selected': {
            color: '#6B85FF',
            fontWeight: 500,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        scroller: {
          display: 'flex',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: '100% !important',
          height: '100% !important',
          marginLeft: '0px !important',
          marginRight: '0px !important',
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: '16px',
        },
      },
      variants: [
        {
          props: { size: 'small' },
          style: {
            height: '36px',
          },
        },
        {
          props: { size: 'medium' },
          style: {
            height: '48px',
          },
        },
      ],
    },
    MuiInput: {
      styleOverrides: {
        input: {
          '&:focus': { backgroundColor: 'inherit' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
          },
          borderRadius: '8px',
          fontWeight: 400,
          textTransform: 'none',
        },
      },
      variants: [
        {
          props: { size: 'small' },
          style: {
            height: '28px',
          },
        },
        {
          props: { size: 'medium' },
          style: {
            height: '36px',
          },
        },
        {
          props: { size: 'large' },
          style: {
            height: '48px',
          },
        },
        {
          props: { variant: 'contained' },
          style: {
            '&.Mui-disabled': {
              background: '#F3F5FF',
              color: '#B6C1E5',
            },
          },
        },
      ],
    },
    MuiAutocomplete: {
      styleOverrides: {
        input: {
          padding: '0 !important',
        },
        inputRoot: {
          padding: '0px !important',
          borderRadius: '8px',
          top: 0,
        },
        endAdornment: {
          position: 'relative',
          top: 0,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          paddingBottom: '0',
        },
      },
      variants: [
        {
          props: { variant: 'filled' },
          style: {
            '&.MuiFilledInput-root': {
              backgroundColor: '#F3F5FF',
            },
            '&.MuiFilledInput-root:hover': {
              backgroundColor: '#F3F5FF',
            },
            '&.MuiFilledInput-root:after': {
              backgroundColor: '#F3F5FF',
              borderBottom: 'none',
            },
            '&.MuiFilledInput-root:before': {
              borderBottom: '1px solid #B6C1E6',
            },
            '&.MuiFilledInput-root.Mui-focused': {
              backgroundColor: '#F3F5FF',
            },
            '&.MuiFilledInput-root.Mui-disabled': {
              backgroundColor: '#F3F5FF',
            },
            '&.MuiFilledInput-root.Mui-disabled:before': {
              borderBottomStyle: 'solid',
            },
          },
        },
      ],
    },
    MuiInputLabel: {
      variants: [
        {
          props: { variant: 'outlined' },
          style: {
            top: '5px',
          },
        },
        {
          props: { variant: 'standard' },
          style: {
            top: '5px',
            marginTop: '4px',
          },
        },
      ],
      defaultProps: {
        sx: {
          color: '#7b839d',
          fontSize: '16px',
          '& .MuiFilledInput-input:focus': {
            fontSize: '12px',
          },
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        sx: {
          top: '3px',
          fontSize: '16px',
          '& .MuiFilledInput-input:focus': {
            fontSize: '12px',
          },
        },
      },
    },
    MuiSelect: {
      variants: [
        {
          props: { size: 'small' },
          style: {
            height: '36px',
            fontSize: '16px',
            '& .MuiFilledInput-input:focus': {
              fontSize: '12px',
            },
          },
        },
        {
          props: { size: 'medium' },
          style: {
            height: '48px',
            fontSize: '16px',
            '& .MuiFilledInput-input:focus': {
              fontSize: '12px',
            },
          },
        },
        {
          props: { variant: 'filled' },
          style: {
            backgroundColor: '#F3F5FF',
            '&:before': {
              borderBottom: '1px solid #B6C1E6',
            },
            '&:hover': {
              backgroundColor: '#F3F5FF',
            },
            '& .MuiFilledInput-input:focus': {
              backgroundColor: '#ffffff0d',
            },
          },
        },
      ],
    },
  },
});

lightThemeOptions.typography.h1 = {
  fontWeight: 600,
  fontSize: '61px',
  lineHeight: '76px',
  color: 'var(--Black)',
  [lightThemeOptions.breakpoints.down('md')]: {
    fontWeight: 600,
    fontSize: '28px',
    lineHeight: '36px',
  },
};

lightThemeOptions.typography.h2 = {
  fontWeight: 600,
  fontSize: '36px',
  lineHeight: '44px',
  color: 'var(--Black)',
  [lightThemeOptions.breakpoints.down('md')]: {
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '28px',
  },
};

lightThemeOptions.typography.h3 = {
  fontWeight: 600,
  fontSize: '28px',
  lineHeight: '36px',
  color: 'var(--Black)',
  [lightThemeOptions.breakpoints.down('md')]: {
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '24px',
  },
};

lightThemeOptions.typography.h4 = {
  fontWeight: 600,
  fontSize: '20px',
  lineHeight: '28px',
  color: 'var(--Black)',
  [lightThemeOptions.breakpoints.down('md')]: {
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '20px',
  },
};

lightThemeOptions.typography.h5 = {
  fontWeight: 600,
  fontSize: '16px',
  lineHeight: '24px',
};

lightThemeOptions.typography.h6 = {
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: '24px',
};

lightThemeOptions.typography.body0 = {
  fontWeight: 500,
  fontSize: '20px',
  lineHeight: '28px',
  color: 'var(--Black)',
};

lightThemeOptions.typography.body1 = {
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '24px',
  color: 'var(--Black)',
};

lightThemeOptions.typography.body2 = {
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '20px',
  color: 'var(--Black)',
};

lightThemeOptions.typography.body3 = {
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '20px',
  color: 'var(--Black)',
  [lightThemeOptions.breakpoints.down('md')]: {
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '16px',
  },
};

lightThemeOptions.typography.button0 = {
  fontWeight: 400,
  fontSize: '18px',
  lineHeight: '24px',
  color: 'var(--Black)',
};

lightThemeOptions.typography.button1 = {
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '20px',
};

lightThemeOptions.typography.button2 = {
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '16px',
  color: 'var(--Black)',
};

lightThemeOptions.typography.text1 = {
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '24px',
  color: 'var(--Black)',
};

lightThemeOptions.typography.text2 = {
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '10px',
  color: 'var(--Black)',
};

lightThemeOptions.typography.text3 = {
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '15px',
  color: 'var(--Black)',
};

lightThemeOptions.typography.game = {
  fontWeight: 455,
  fontSize: '18px',
  lineHeight: '30px',
  textAlign: 'left',
  width: '50%',
  color: 'var(--Black)',
  [lightThemeOptions.breakpoints.down('md')]: {
    width: '312px',
  },
};

lightThemeOptions.typography.h5m = {
  fontWeight: 600,
  fontSize: '12px',
  lineHeight: '18px',
  color: 'var(--Black)',
};

export default lightThemeOptions;
