import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { LoadingButton } from '@mui/lab';
import { Menu, MenuItem } from '@mui/material';
import Link from 'next/link';

type Props = {
  headerName: string;
  nameData: string;
  itemToMap?: { name: string; path: string }[];
  actionsToMap?: { name: string; action: () => void }[];
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  classNameWrapper?: string;
  size?: 'small' | 'medium' | 'large';
};

export const Accordion: React.FC<Props> = ({
  itemToMap,
  headerName,
  nameData,
  loading = false,
  className,
  size = 'medium',
  actionsToMap,
  classNameWrapper,
  onClick,
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classNameWrapper}>
      <LoadingButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"
        loading={loading}
        loadingPosition="end"
        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        className={className}
        size={size}
      >
        {headerName}
      </LoadingButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ mt: 1 }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {itemToMap?.map(({ name, path }, index) => {
          return (
            <Link href={path} key={index}>
              <a>
                <MenuItem onClick={handleClose}>{t(`routes.${nameData}.${name}`)}</MenuItem>
              </a>
            </Link>
          );
        })}
        {actionsToMap?.map(({ name, action }, index) => {
          return (
            <div key={index}>
              <MenuItem
                onClick={() => {
                  action();
                  handleClose();
                }}
              >
                {name}
              </MenuItem>
            </div>
          );
        })}
      </Menu>
    </div>
  );
};
