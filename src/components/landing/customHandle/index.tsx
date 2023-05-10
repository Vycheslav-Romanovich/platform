import React, { useCallback, useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

import HappyTeacher from '../../../assets/icons/landing/happyTeacher.svg';
import ThankfulStudent from '../../../assets/icons/landing/thankfulStudent.svg';

import styles from './index.module.scss';

export const CustomHandle = ({ ...props }) => {
  const [linePosition, setLinePosition] = useState<number>(0);
  const handlePositionChange = useCallback((position) => {
    const opacitySvg = (position - 50) / 43;
    setLinePosition(opacitySvg);
  }, []);
  return (
    <div className={styles.ImageHandleWrapper}>
      <HappyTeacher className={styles.happyTeacher} />

      <ThankfulStudent
        className={styles.thankfulStudent}
        style={{
          opacity: linePosition,
        }}
      />

      <ReactCompareSlider
        {...props}
        className={styles.compareSlider}
        handle={
          <span style={{ borderRadius: '50px' }}>
            <div className={styles.lineHandle}>
              <div className={styles.triangles} />
            </div>
          </span>
        }
        itemTwo={
          <ReactCompareSliderImage
            src="/images/landing1Pic.png"
            style={{ width: 'auto', height: '90%', objectFit: 'fill' }}
            alt="one"
          />
        }
        itemOne={
          <ReactCompareSliderImage
            src="/images/landing2Pic.png"
            alt="two"
            style={{
              width: 'auto',
              height: '90%',
              transform: 'translateY(5.5%)',
              objectFit: 'fill',
            }}
          />
        }
        onPositionChange={handlePositionChange}
        translate={'yes'}
      />
    </div>
  );
};
