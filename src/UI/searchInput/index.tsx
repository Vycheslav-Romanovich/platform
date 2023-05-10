import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, IconButton, TextField } from '@mui/material';
import cn from 'classnames';

import styles from './index.module.scss';

type Props = {
  value: string;
  placeholder: string;
  name: string;
  onChange: (e) => void;
  onSubmit: () => void;
  onReset?: () => void;
  size?: 'small' | 'medium';
  icon?: string;
  isErrorLink?: boolean;
  resetFoundItems?: boolean;
  setIsErrorLine?: (isErrorLine: boolean) => void;
  isTeacherClasses?: boolean;
};

export const SearchInput: React.FC<Props> = ({
  value,
  name,
  placeholder,
  onChange,
  resetFoundItems,
  onSubmit,
  onReset,
  size = 'medium',
  icon,
  isErrorLink,
  setIsErrorLine,
  isTeacherClasses,
}) => {
  const handleKeyPress: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    value.trim();
    onSubmit();
  };

  const searchInputClassName = cn(styles.searchInput, {
    [styles.searchInput100]: isTeacherClasses,
  });

  return (
    <Box className={searchInputClassName}>
      <TextField
        fullWidth
        name={name}
        value={value}
        placeholder={placeholder}
        id="input-with-icon-search-and-close"
        variant="outlined"
        type="text"
        onChange={onChange}
        onKeyPress={handleKeyPress}
        size={size}
        error={isErrorLink}
        onBlur={() => (setIsErrorLine ? setIsErrorLine(true) : null)}
        onFocus={() => (setIsErrorLine ? setIsErrorLine(false) : null)}
        InputProps={{
          startAdornment: !icon ? (
            <IconButton type="button" aria-label="search" onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          ) : (
            <IconButton type="button" aria-label="search" onClick={handleSearch}>
              <YouTubeIcon className={styles.youtube} />
            </IconButton>
          ),
          endAdornment: (
            <>
              {(onReset && value) || resetFoundItems ? (
                <IconButton type="button" aria-label="search" onClick={onReset}>
                  <CloseIcon />
                </IconButton>
              ) : null}
            </>
          ),
        }}
      />
    </Box>
  );
};
