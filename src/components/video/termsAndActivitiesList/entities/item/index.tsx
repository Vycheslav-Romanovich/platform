import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutline';
import { Typography } from '@mui/material';

import styles from './item.module.scss';

type Props = {
  elementNumber: number;
  text: string;
  subtext: string;
  isCreateLessonMode?: boolean;
  className?: string;
  handleDeleteElement?: () => void;
  handleClickToElement?: () => void;
};

export const Item: React.FC<Props> = ({
  elementNumber,
  isCreateLessonMode = false,
  text,
  subtext,
  className,
  handleDeleteElement,
  handleClickToElement,
}) => {
  return (
    <div className={className}>
      <Typography
        mr="6px"
        variant={'body2'}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {elementNumber}.
      </Typography>

      <div onClick={handleClickToElement} className={styles.wordPair}>
        <Typography variant={'text1'} className={styles.activityName}>
          {text}
        </Typography>
        <Typography variant="body2" color={'var(--L_Grey)'}>
          {subtext}
        </Typography>
      </div>

      {isCreateLessonMode && (
        <DeleteOutlineOutlinedIcon
          classes={{ root: styles.trashIcon }}
          onClick={handleDeleteElement}
        />
      )}
    </div>
  );
};
