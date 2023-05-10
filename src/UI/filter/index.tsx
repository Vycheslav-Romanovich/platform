import React from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import { Typography } from '@mui/material';

import styles from './modal.module.scss';

type Props = {
  isExpandFilter: boolean;
  setIsExpandFilter: () => void;
};

const Filter: React.FC<Props> = ({ isExpandFilter, setIsExpandFilter }) => {
  return (
    <div onClick={setIsExpandFilter} className={styles.filterContainer}>
      <TuneIcon
        sx={{ color: 'var(--L_Grey)', display: { xs: 'none', md: 'initial', marginRight: '1px' } }}
      />
      <Typography
        sx={{ display: { xs: 'none', md: 'initial' } }}
        color={'var(--L_Grey)'}
        variant="h5"
      >
        {isExpandFilter ? 'Fewer filters' : 'Filters'}
      </Typography>
    </div>
  );
};

export default Filter;
