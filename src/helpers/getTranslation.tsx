import React from 'react';
import { observer } from 'mobx-react';

import styles from '~/components/subtitles/subtitles.module.scss';

import { InitLoader } from '~/components/initLoader';
import { OneSubtitle } from '~/types/subtitles';

const hideBtn = <div className={styles.hideBtn} />;

export const GetTranslation = observer(function GetTranslation(props: {
  second: any;
  subtitle: OneSubtitle;
  isCurrent?: boolean;
  style?: React.CSSProperties;
  onClickAdded?: () => void;
}) {
  // const [pauseState, setPauseState] = useState<boolean>(false)
  // useEffect(()=> {
  //   if (pauseState) {
  //     props.second.isHide && subtitlesStore.setFingerSubtitle(true);
  //     props.second.isHide && videoStore.setPause(true, "toggleTrue");
  //   }
  //   else if (!pauseState) {
  //     props.second.isHide && subtitlesStore.setFingerSubtitle(false);
  //     props.second.isHide &&
  //     // videoStore.state.isPause &&
  //         // videoStore.setPause(false)
  //      setTimeout(() => videoStore.setPause(false, "toggleEnd"), 250);
  //   }
  // }, [pauseState, props.second])
  // const toggleStart = function () {
  //   setPauseState(true)
  //   // props.second.isHide && subtitlesStore.setFingerSubtitle(true);
  //   // props.second.isHide &&
  //   // !videoStore.state.isPause && videoStore.setPause(true, "toggleTrue");
  //   // ReactGA.event({
  //   //   category: "Video",
  //   //   action: "VdClickOnPhrase",
  //   //   label: `${videoStore.info.title}, ${settingsStore.fromLang}, ${settingsStore.toLang}`,
  //   // });
  // };
  // const toggleEnd = function () {
  //   setPauseState(false)
  //   // props.second.isHide && subtitlesStore.setFingerSubtitle(false);
  //   // props.second.isHide &&
  //   //   videoStore.state.isPause &&
  //   //   setTimeout(() => videoStore.setPause(false, "toggleEnd"), 250);
  // };
  return (
    <div
      //   onTouchStartCapture={toggleStart}
      //
      // // onTouchStart={toggleStart}
      // onTouchEnd={toggleEnd}
      style={props.style}
      className={styles.second}
    >
      {/*subtitlesStore.openSubtitle &&*/}
      {!props.second.isHide && <div className={styles.secondText}>{props.second.text}</div>}
      {((props.second.isHide && !props.second.isTouched) || !props.isCurrent) && hideBtn}
      {props.second.loading && <InitLoader type="dots" />}
    </div>
  );
});
