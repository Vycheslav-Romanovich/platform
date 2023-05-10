import styles from '../subtitles.module.scss';

import { InitLoader } from '~/components/initLoader';
import { OneSubtitle } from '~/types/subtitles';
import SimpleText from '~/UI/simpleText';

const GetTranslation: React.FC<{
  subtitle: OneSubtitle;
  second: {
    text: string;
    isHide: boolean;
    loading: boolean;
    isTouched: boolean;
  };
  showSecond: (text: string, curId?: number) => void;
  isCurrent?: boolean;
  style?: React.CSSProperties;
}> = ({ subtitle, second, style, isCurrent, showSecond }) => {
  // useEffect(() => {
  //   if (isCurrent) {
  //     showSecond(subtitle.text, subtitle.id);
  //   }
  // }, [subtitle.text, subtitle.id, isCurrent]);

  return (
    <div style={style} className={styles.second}>
      <SimpleText className={styles.secondText}>{second.text}</SimpleText>
      {second.loading && <InitLoader type="dots" />}
    </div>
  );
};

export default GetTranslation;
