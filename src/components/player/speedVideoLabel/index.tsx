import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import styles from './speedVideoLabel.module.scss';

import { videoStore } from '~/stores';

export default observer(function SpeedVideoLabel() {
  const [text, setText] = useState<string>(null);
  const speedVideoClasses = classNames(styles.speed, { [styles.show]: !!text });

  useEffect(() => {
    const mode = videoStore.actionMode;
    if (mode === 'slow repeat') {
      setText('slow');
    } else if (mode === 'repeat') {
      setText('repeat');
      // } else if (mode === "translateOn") {
      //   setText(translText.translateOn);
      // } else if (mode === "translateOff") {
      //   setText(translText.translateOff);
    } else if (mode === null) {
      setText(null);
    }
  }, [videoStore.actionMode]);

  return <div className={speedVideoClasses}>{text}</div>;
});
