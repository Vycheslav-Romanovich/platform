import React from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, Select, styled } from '@mui/material';
import InputBase from '@mui/material/InputBase';

import styles from './index.module.scss';

import { supportedLanguages } from '~/constants/supportedLanguages';

type Props = {
  language: string;
  handleChangeSelect: (event) => void;
  error?: boolean;
  disabled?: boolean;
};

export const SelectLanguage: React.FC<Props> = ({
  handleChangeSelect,
  error,
  language,
  disabled,
}) => {
  const BootstrapInput = styled(InputBase)(() => ({
    '& .MuiInputBase-input': {
      borderRadius: 8,
      position: 'relative',
      border: error ? '1px solid var(--Pink)' : '1px solid var(--Grey_Blue)',
      fontSize: 16,
      padding: '10px 16px',
    },
  }));
  const { t } = useTranslation();

  return (
    <Select
      className={styles.select}
      value={language}
      displayEmpty
      renderValue={language !== '' ? undefined : () => <div>{t('auth.chooseLanguage')}</div>}
      onChange={handleChangeSelect}
      input={<BootstrapInput />}
      disabled={disabled ?? false}
    >
      {supportedLanguages.map(({ name, code }) => {
        return (
          <MenuItem key={code} value={code}>
            {name}
          </MenuItem>
        );
      })}
    </Select>
  );
};
