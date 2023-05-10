import React, { useCallback, useEffect, useRef, useState } from 'react';
import Hammer from 'react-hammerjs';
import { Typography } from '@mui/material';
import cn from 'classnames';
import { observer } from 'mobx-react';

import styles from './seek.module.scss';

import { secondToHms } from '~/helpers/secondToHm';
import { lessonStore, mainStore, openEndedGameStore, videoStore } from '~/stores';

export default observer(function Seek(props: {
  value: number;
  loaded?: number;
  duration: number;
  setValue: (value) => void;
  setSeeking?: (isSeeking: boolean) => void;
  isVertical?: boolean;
  games?: boolean;
  start?: number;
}) {
  const wrapperRef = useRef();
  const [offsetHover, setOffsetHover] = useState<number>(props.value);
  const [showTime, setShowTime] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);
  const [startSeeking, setStartSeeking] = useState<number | false>(false);

  useEffect(() => {
    setPercent((props.value / props.duration) * 100);
    if (
      props.duration !== 1 &&
      props.duration !== 0 &&
      props.duration < +props.value + 1.5 &&
      !props.start
    ) {
      videoStore.setPause(true);
      videoStore.setTime(0);
      videoStore.setOpenEndVideoModal(true);
    }
    if (props.value !== 0 && props.value + 1.5 >= props.duration) {
      videoStore.setRecommended(true);
    }
  }, [props.value, props.duration]);

  const handleTap = (e) => {
    if (props.games) {
      return null;
    }
    if (wrapperRef && wrapperRef.current) {
      const ref: HTMLElement = wrapperRef.current;

      const offset = props.isVertical
        ? (ref.getBoundingClientRect().top + ref.offsetHeight - e.clientY) / ref.offsetHeight
        : ((e.clientX - ref.getBoundingClientRect().left) / ref.offsetWidth) * props.duration;
      if (offset >= 0 && offset <= props.duration) {
        props.setValue(offset + (props.start ?? 0));
        if (!props.isVertical) {
          videoStore.clearAction();
        }
        if (props.setSeeking) {
          props.setSeeking(true);
          props.setSeeking(false);
        }
      }
    }
  };

  const handleMouseMove = (e) => {
    if (wrapperRef && wrapperRef.current) {
      const ref: HTMLElement = wrapperRef.current;
      const offset =
        ((e.clientX - ref.getBoundingClientRect().left) / ref.offsetWidth) * props.duration;
      if (offset >= 0 && offset <= props.duration) {
        setOffsetHover(offset + (props.start ?? 0));
      }
    }
  };

  const handlePanSeek = (e) => {
    if (wrapperRef && wrapperRef.current) {
      const ref: HTMLElement = wrapperRef.current;
      if (startSeeking !== false) {
        const newValue =
          startSeeking +
          (props.isVertical ? -e.deltaY / ref.offsetHeight : e.deltaX / ref.offsetWidth) *
            props.duration;
        if (!props.isVertical) {
          videoStore.clearAction();
        }
        if (newValue >= 0 && newValue <= props.duration) {
          props.setValue(newValue + (props.start ?? 0));
        }
      }
    }
  };

  const classes = {
    seekWrapper: cn(styles.seekWrapper, {
      [styles.vertical]: props.isVertical,
    }),
    timeCode: cn(styles.timeCode, {
      [styles.show]: showTime,
    }),
  };

  const counterIncrement = useCallback(
    (timecode: number) => {
      return openEndedGameStore.templateArray.has(`${timecode}`)
        ? null
        : openEndedGameStore.incrementCounterActivity(timecode);
    },
    [openEndedGameStore.countActivity, openEndedGameStore.templateArray]
  );

  return (
    <div
      className={classes.seekWrapper}
      style={
        props.games && {
          padding: 0,
        }
      }
      onClick={handleTap}
      onMouseOver={() => {
        setShowTime(true);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setShowTime(false);
      }}
    >
      <div
        className={styles.Seek}
        ref={wrapperRef}
        style={
          props.games && {
            height: '4px',
          }
        }
      >
        {props.isVertical ? null : mainStore.isWeb ? (
          <div
            className={classes.timeCode}
            style={{ left: (offsetHover / props.duration) * 100 + '%' }}
          >
            {secondToHms(offsetHover)}
            {/* <TimeArrow className={styles.timeArrow} /> */}
          </div>
        ) : null}
        {props.loaded ? (
          <div
            className={styles.SeekLoaded}
            style={{
              [props.isVertical ? 'top' : 'right']:
                100 - (props.loaded / props.duration) * 100 + '%',
            }}
          />
        ) : (
          ''
        )}
        <div
          className={styles.SeekActive}
          style={{
            [props.isVertical ? 'top' : 'right']: 100 - percent + '%',
          }}
        />
        <Hammer
          direction={props.isVertical ? 'DIRECTION_VERTICAL' : 'DIRECTION_HORIZONTAL'}
          onPanStart={() => {
            props.setSeeking && props.setSeeking(true);
            setStartSeeking(props.value);
          }}
          onPan={handlePanSeek}
          onPanEnd={() => {
            props.setSeeking && props.setSeeking(false);
            setStartSeeking(false);
          }}
        >
          <div
            className={styles.SeekPointer}
            style={{ [props.isVertical ? 'bottom' : 'left']: percent + '%' }}
          >
            {!props.games && <div className={styles.SeekPointer_body} />}
          </div>
        </Hammer>
        {lessonStore.videoGameData
          ?.slice()
          .sort((a, b) => a.timeCode - b.timeCode)
          .map((m) => {
            counterIncrement(m.timeCode);
            return <CircleActivity key={m.id} timecode={m.timeCode} duration={props.duration} />;
          })}
      </div>
    </div>
  );
});

type CirclePropsType = {
  timecode: number;
  duration: number;
};

const CircleActivity: React.FC<CirclePropsType> = ({ timecode, duration }) => {
  const position = `${(timecode * 100) / duration}%`;
  return (
    <div
      className={styles.circleActivityWrapper}
      onClick={(event) => {
        videoStore.setTime(timecode);
        event.stopPropagation();
      }}
      style={{ left: position }}
    >
      <Typography variant={'text3'} color={'var(--D_Blue)'}>
        {openEndedGameStore.templateArray.get(`${timecode}`)}
      </Typography>
    </div>
  );
};
