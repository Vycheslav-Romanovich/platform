import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Box,
  Dialog,
  FormControl,
  IconButton,
  Paper,
  TextField,
} from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { v4 as uuidv4 } from 'uuid';

import styles from './index.module.scss';

import { mainStore } from '~/stores';

type Props = {
  value?: string;
  options: Array<string>;
  placeholder: string;
  onChange: (e) => void;
  onSubmit: () => void;
  onReset?: () => void;
  stylesWrapper: string;
  onFocus?: () => void;
  onBlur?: () => void;
  getAllResults?: () => void;
  inputValue: string;
  setInputValue: (event: SyntheticEvent<Element, Event>, value: string) => void;
};

export const AutocompleteDropdown: React.FC<Props> = ({
  value,
  options,
  placeholder,
  onChange,
  onSubmit,
  stylesWrapper,
  onFocus,
  onBlur,
  getAllResults,
  inputValue,
  setInputValue,
}) => {
  const [isOpenMuiDialogMobile, handleCloseDialogMobile] = useState(false);
  const { t } = useTranslation();
  const handleKeyPress: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };
  const CustomPaper = (props) => {
    return (
      <Paper {...props} className={mainStore.isMobile ? styles.dropdownMobile : styles.dropdown} />
    );
  };
  const handleSearch = (e) => {
    e.stopPropagation();
    onSubmit();
  };

  const filterOptions = createFilterOptions({
    limit: 3,
    trim: true,
  });

  const ListboxComponent = (props) => {
    return (
      <>
        <ul {...props} />
        {!(value && props.children.length < 3) ? (
          <div className={styles.viewAllResults} onMouseDown={getAllResults}>
            {t('header.viewAll')}
          </div>
        ) : null}
      </>
    );
  };

  const TextProp = (params) => {
    return (
      <>
        <div className={styles.inputField}>
          <TextField
            fullWidth
            onFocus={onFocus}
            onMouseDown={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            id="input-with-icon-search-and-close"
            variant="outlined"
            type="text"
            onChange={onChange}
            onKeyPress={handleKeyPress}
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <IconButton
                  size="small"
                  sx={{ ml: 1 }}
                  type="button"
                  aria-label="search"
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </IconButton>
              ),
              type: 'text',
            }}
          />
        </div>
        <Box className={styles.box}>
          <IconButton
            type="button"
            aria-label="search"
            onClick={() => handleCloseDialogMobile(true)}
            {...params}
          >
            <SearchIcon sx={{ width: '16px' }} />
          </IconButton>
        </Box>
      </>
    );
  };
  const MuiDialogInput = (params) => {
    const handleKeyPress: React.KeyboardEventHandler = (e) => {
      if (e.key === 'Enter') {
        handleSearch(e);
      }
    };
    const handleSearch = (e) => {
      e.stopPropagation();
      handleCloseDialogMobile(true);
      onSubmit();
    };

    return (
      <TextField
        fullWidth
        placeholder={placeholder}
        id="input-with-icon-search-and-close"
        variant="outlined"
        type="text"
        onChange={onChange}
        onKeyPress={handleKeyPress}
        {...params}
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <IconButton type="button" aria-label="search" onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          ),
          type: 'text',
        }}
      />
    );
  };

  return (
    <FormControl className={stylesWrapper}>
      <Dialog
        fullScreen
        open={isOpenMuiDialogMobile}
        onClose={() => handleCloseDialogMobile(false)}
      >
        <div className={styles.dialogWrapper}>
          <div onClick={() => handleCloseDialogMobile(false)}>
            <ArrowBackIcon />
          </div>

          <FormControl className={styles.dialogInput}>
            <Autocomplete
              freeSolo
              options={options}
              value={value}
              inputValue={inputValue}
              onInputChange={setInputValue}
              PaperComponent={CustomPaper}
              filterOptions={filterOptions}
              ListboxComponent={ListboxComponent}
              renderOption={(props: object, option: string) => (
                <li {...props} key={uuidv4()}>
                  <IconButton
                    type="button"
                    aria-label="search"
                    className={styles.button}
                    onClick={onSubmit}
                  >
                    {inputValue ? <SearchIcon /> : <HistoryIcon />}
                  </IconButton>
                  {option}
                </li>
              )}
              renderInput={(params) => MuiDialogInput(params)}
            />
          </FormControl>
        </div>
      </Dialog>

      <Autocomplete
        size="small"
        freeSolo
        options={options}
        value={value}
        inputValue={inputValue}
        onInputChange={setInputValue}
        PaperComponent={CustomPaper}
        filterOptions={filterOptions}
        ListboxComponent={ListboxComponent}
        renderOption={(props: object, option: string) => (
          <li {...props} key={uuidv4()}>
            <IconButton
              type="button"
              aria-label="search"
              className={styles.button}
              onClick={handleSearch}
            >
              {inputValue ? <SearchIcon /> : <HistoryIcon />}
            </IconButton>
            {option}
          </li>
        )}
        renderInput={(params) => TextProp(params)}
      />
    </FormControl>
  );
};
