import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Tab, Tabs } from '@mui/material';
import cn from 'classnames';
import { observer } from 'mobx-react';

import styles from './switcherFromActivity.module.scss';

import { lessonStore } from '~/stores';

type switcherPropsType = {
  optionStyles?: string;
  wordCount?: number;
  activityCount?: number;
};

export const SwitcherFromActivity: React.FC<switcherPropsType> = observer(
  ({ optionStyles, activityCount, wordCount }) => {
    const handleChange = (event: React.SyntheticEvent, newValue: typeof lessonStore.variantBox) => {
      lessonStore.setVariantBox(newValue);
    };
    const { t } = useTranslation();

    return (
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs
          value={lessonStore.variantBox}
          onChange={handleChange}
          aria-label="basic tabs example"
          classes={{ scroller: cn(optionStyles, styles.switcherWrapper) }}
          sx={{ display: 'flex', justifyContent: 'flex-start' }}
        >
          <Tab
            label={
              <CustomChip
                variantBox={lessonStore.variantBox}
                text={t('switcherFromActivity.Saved terms')}
                wordCount={wordCount}
              />
            }
            value={'word'}
          />
          <Tab
            label={
              <CustomChip
                variantBox={lessonStore.variantBox}
                text={t('switcherFromActivity.Activities')}
                wordCount={activityCount}
              />
            }
            value={'activity'}
          />
        </Tabs>
      </Box>
    );
  }
);

type customChipType = {
  text: 'Saved terms' | 'Activities';
  wordCount: number;
  variantBox: 'word' | 'activity';
};

const CustomChip: React.FC<customChipType> = ({ wordCount, text, variantBox }) => {
  const chipColor = () => {
    switch (variantBox) {
      case 'activity':
        return text === 'Activities' ? 'primary' : 'default';
      case 'word':
        return text === 'Saved terms' ? 'primary' : 'default';
    }
  };
  return (
    <div>
      {text}
      <Chip
        color={chipColor()}
        classes={{ root: styles.rootStyle, labelMedium: styles.chipLabel }}
        sx={{
          width: '20px',
          height: '20px',
        }}
        label={wordCount !== undefined ? wordCount : 0}
      />
    </div>
  );
};
