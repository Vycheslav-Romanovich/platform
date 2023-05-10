import CheckPronunciation from '../assets/exampleGames/check-pronunciation.svg';
import ChooseTheVariant from '../assets/exampleGames/choose-the-variant.svg';
import FillInTheBlank from '../assets/exampleGames/fill-in-the-blank.svg';
import FillWords from '../assets/exampleGames/fillwords.svg';
import MatchingPairs from '../assets/exampleGames/matchingPairs.svg';
import CheckPronunciationMobile from '../assets/exampleGames/mobile/check-pronunciation-mobile.svg';
import ChooseTheVariantMobile from '../assets/exampleGames/mobile/choose-the-variant-mobile.svg';
import FillInTheBlankMobile from '../assets/exampleGames/mobile/fill-in-the-blank-mobile.svg';
import FillWordsMobile from '../assets/exampleGames/mobile/fillwords-mobile.svg';
import MatchingPairsMobile from '../assets/exampleGames/mobile/matching-pairs-mobile.svg';

export const gameBlock = [
  {
    Img: ChooseTheVariant,
    ImgMobile: ChooseTheVariantMobile,
    title: 'Choose the variant',
    text: 'textChooseTheVariant',
    path: 'choose-the-variant',
    withVideo: false,
    name: 'chooseVariant',
    countLetterWord: 0,
    copy: false,
  },
  {
    Img: MatchingPairs,
    ImgMobile: MatchingPairsMobile,
    title: 'Matching pairs',
    text: 'textMatchingPairs',
    path: 'matching-pairs',
    withVideo: false,
    name: 'matchingPairs',
    countLetterWord: 0,
    copy: false,
  },
  {
    Img: FillWords,
    ImgMobile: FillWordsMobile,
    title: 'Fillwords',
    text: 'textFillwords',
    path: 'fillwords',
    withVideo: false,
    name: 'fillWords',
    countLetterWord: 26,
    copy: false,
  },
  {
    Img: FillInTheBlank,
    ImgMobile: FillInTheBlankMobile,
    title: 'Fill in the blank',
    text: 'textFillInTheBlank',
    path: 'fill-in-the-blank-game',
    withVideo: true,
    name: 'fillBlank',
    countLetterWord: 0,
    copy: false,
  },
  {
    Img: CheckPronunciation,
    ImgMobile: CheckPronunciationMobile,
    title: 'Check pronunciation',
    text: 'textCheckPronunciation',
    path: 'speech-training',
    withVideo: false,
    name: 'speechTraining',
    countLetterWord: 0,
    copy: true,
  },
  {
    Img: CheckPronunciation,
    ImgMobile: CheckPronunciationMobile,
    title: 'Check pronunciation',
    text: 'textCheckPronunciation',
    path: 'speech-training-video',
    withVideo: true,
    name: 'speechTraining',
    countLetterWord: 0,
    copy: false,
  },
];

export const gameType = {
  choose_the_variant: 'choose_the_variant',
  matching_pairs: 'matching_pairs',
  fillwords: 'fillwords',
  fill_blank: 'fill_blank',
  speech_training: 'speech_training',
};
