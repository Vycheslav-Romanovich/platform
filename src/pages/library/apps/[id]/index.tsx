import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import Arrow from '~/assets/icons/arrows/arrow.svg';
import Logo from '~/assets/images/GameMatchingPairs.svg';

import OtherLessons from '../../../../games/irregularVerbs/componentsOfTrainer/OtherLessons/OtherLessons';
import Trainer from '../../../../games/irregularVerbs/componentsOfTrainer/Trainer/Trainer';
import WantToLeave from '../../../../games/irregularVerbs/componentsOfTrainer/WantToLeave/WantToLeave';
import Layout from '../../../../hocs/layout';

import style from './irregular-verbs.module.scss';

import Hint from '~/games/irregularVerbs/componentsOfTrainer/Hint/Hint';
import { TrainerEnd } from '~/games/irregularVerbs/componentsOfTrainer/TrainerEnd/TrainerEnd';

const IrregularVerbs: NextPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState('trainer');
  const [isHint, setIsHint] = useState(false);
  const [rating, setRating] = useState(0);
  const id = useRouter().query.id;

  useEffect(() => {
    return () => {
      setRating(0);
    };
  }, [id]);
  return (
    <>
      <NextSeo title="Irregular verbs" />

      <Layout
        classNameHeaderWrapper={style.hideHeaderMobile}
        className={style.backgroundAdaptiveMobile}
      >
        <div className={style.arrow}>
          <p className={style.titleBlock}>
            <Arrow onClick={() => setPage('leave')} />
            <p>{t('irregularVerbs.titleBlockPart1') + id + t('irregularVerbs.titleBlockPart2')}</p>
          </p>
        </div>
        <div className={style.block}>
          <div className={style.hideConfetti}>{page === 'finish' && <Confetti />}</div>
          <div className={style.gameSel}>
            {page === 'leave' && <WantToLeave setPage={setPage} />}
            {page === 'finish' && (
              <TrainerEnd logo={<Logo />} count={20} setPage={setPage} url={'/library/study'} />
            )}
            <div className={style.contentWrapper}>
              <div className={style.blockTrainer}>
                {page === 'trainer' && (
                  <Trainer
                    rating={rating}
                    setRating={setRating}
                    setPage={setPage}
                    setIsHint={setIsHint}
                    isHint={isHint}
                  />
                )}
              </div>
            </div>
          </div>
          <OtherLessons />
        </div>
        {page === 'trainer' && (
          <>
            <div className={style.adaptiveHint}>
              <Hint setIsHint={setIsHint} />
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default observer(IrregularVerbs);
