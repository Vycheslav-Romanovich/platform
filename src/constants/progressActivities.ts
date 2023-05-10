import CheckPronunciationMobile from '../assets/exampleGames/mobile/check-pronunciation-mobile.svg';
import ChooseTheVariantMobile from '../assets/exampleGames/mobile/choose-the-variant-mobile.svg';
import FillInTheBlankMobile from '../assets/exampleGames/mobile/fill-in-the-blank-mobile.svg';
import FillWordsMobile from '../assets/exampleGames/mobile/fillwords-mobile.svg';
import MatchingPairsMobile from '../assets/exampleGames/mobile/matching-pairs-mobile.svg';
import OverallRating from '../assets/exampleGames/mobile/overallRating.svg';
import VideoQuiz from '../assets/exampleGames/mobile/videoQuiz.svg';

export const progressActivities = [
  {
    id: 1,
    name: 'Overall result',
    Picture: OverallRating,
    withDropdown: true,
  },
  {
    id: 2,
    name: 'Video quiz',
    Picture: VideoQuiz,
    withDropdown: false,
  },
  {
    id: 3,
    name: 'Choose the variant',
    Picture: ChooseTheVariantMobile,
    withDropdown: false,
  },
  {
    id: 4,
    name: 'Fillwords',
    Picture: FillWordsMobile,
    withDropdown: false,
  },
  {
    id: 5,
    name: 'Matching pairs',
    Picture: MatchingPairsMobile,
    withDropdown: false,
  },
  {
    id: 6,
    name: 'Fill in the blank',
    Picture: FillInTheBlankMobile,
    withDropdown: false,
  },
  {
    id: 7,
    name: 'Check pronunciation',
    Picture: CheckPronunciationMobile,
    withDropdown: false,
  },
];

export const progressActivitiesData = [
  {
    id: 1,
    name: 'overAllResult',
  },
  {
    id: 2,
    name: 'videoGame',
  },
  {
    id: 3,
    name: 'chooseVariant',
  },
  {
    id: 4,
    name: 'fillWords',
  },
  {
    id: 5,
    name: 'matchingPairs',
  },
  {
    id: 6,
    name: 'fillBlank',
  },
  {
    id: 7,
    name: 'speechTrainin',
  },
];
export const progressActivitiesDataWithNullData = [
  {
    overAllResult: null,
    videoGame: null,
    chooseVariant: null,
    fillWords: null,
    matchingPairs: null,
    fillBlank: null,
    speechTraining: null,
  },
];

export const progressActivitiesDataWithNullDataClass = [
  {
    overAllResult: null,
    videoGame: null,
    chooseVariant: null,
    fillWords: null,
    matchingPairs: null,
    fillBlank: null,
    speechTrainin: null,
  },
];
