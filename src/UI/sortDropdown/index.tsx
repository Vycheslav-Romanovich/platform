import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, MenuItem, Select, Typography } from '@mui/material';

type Props = {
  sortValue?: string;
  handleChangeSort?: (event) => void;
  sortOptions?: { lable: string; value: string }[];
  isTeach?: boolean;
};

const SortDropdown: FC<Props> = ({ sortValue, handleChangeSort, sortOptions, isTeach }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        mb: isTeach ? '12px' : '24px',
        mt: isTeach ? '12px' : '32px',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <Select
        id="order"
        value={sortValue}
        variant="standard"
        name="order"
        onChange={handleChangeSort}
        disableUnderline
      >
        {sortOptions.map(({ lable, value }, index) => {
          return (
            <MenuItem key={index} value={value}>
              <Typography variant="button1">{t(`sortLessons.sortByOrder.${lable}`)}</Typography>
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
};

export default SortDropdown;
