import React, { useState } from 'react';

import Image from '../../../../assets/images/level_1.svg';

import OtherPart from '../OtherPart/OtherPart';

import style from './OtherLessons.module.scss';

import MainTitle from '~/games/irregularVerbs/componentsOfTrainer/MainTitle/MainTitle';
import OtherPartBlockIcon from '~/games/irregularVerbs/componentsOfTrainer/OtherPartBlockIcon/OtherPartBlockIcon';
import { partsOfVerbs } from '~/games/irregularVerbs/data/verbs';
import Modal from '~/UI/modal';

const OtherLessons = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={style.otherLessons}>
      <div className={style.title}>Other Lessons</div>
      <div className={style.block}>
        <OtherPartBlockIcon
          title={'Easy'}
          setIsOpenModal={() => setIsOpen(true)}
          image={<Image />}
        />
        <Modal isOpen={isOpen} close={() => setIsOpen(false)} modalClasses={style.modalBody}>
          <div className={style.popup}>
            <MainTitle title={'Other exercises'} />
            <div className={style.chose}>Choose other lesson for this complexity.</div>
          </div>
          <div className={style.wrap}>
            {partsOfVerbs.map((el) => (
              <OtherPart
                key={el.id}
                id={el.id}
                title={'Irregular verbs. Part' + ' ' + el.id}
                textBottom={'All: 20 words'}
                levelText={'Easy'}
                setIsOpenModal={() => setIsOpen(false)}
                image={<Image />}
              />
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default OtherLessons;
