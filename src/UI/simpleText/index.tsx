import React from 'react';
import cn from 'classnames';
import { Property } from 'csstype';

import styles from './text.module.scss';

const SimpleText = (props: {
  children: React.ReactNode;
  className?: string;
  textId?: string;
  small?: boolean;
  bold?: boolean;
  link?: boolean;
  align?: Property.TextAlign;
  style?: React.CSSProperties;
}) => {
  const classes = cn(styles.main, {
    [props.className]: !!props.className,
    [styles.small]: props.small,
    [styles.bold]: props.bold,
    [styles.link]: props.link,
  });
  return (
    <div
      className={classes}
      id={props.textId}
      style={props.style ? { ...props.style, textAlign: props.align } : { textAlign: props.align }}
    >
      {props.children}
    </div>
  );
};

export default SimpleText;
