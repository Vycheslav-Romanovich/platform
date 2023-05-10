import React, { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { useRouter } from 'next/router';

import { navLinks, navLinksAuth } from '~/constants/routes';
import { userStore } from '~/stores';

export const NavTabs: React.FC = () => {
  const router = useRouter();
  const paths = (userStore.isAuth ? navLinksAuth : navLinks).map((el) => el.path);
  const [value, setValue] = useState(paths.indexOf(router.route));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange}>
      {(userStore.isAuth ? navLinksAuth : navLinks).map(({ path, title }, index) => {
        return (
          <Tab
            key={index}
            disableRipple
            component="a"
            href={path}
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              event.preventDefault();
              router.push(path);
            }}
            label={title}
          />
        );
      })}
    </Tabs>
  );
};
