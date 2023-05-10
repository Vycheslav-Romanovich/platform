import FillWordStore from './FillWordStore';
import HintTranslationStore from './hintTranslationStore';
import LessonStore from './lessonStore';
import MainStore from './MainStore';
import SettingsStore from './SettingsStore';
import SortStore from './sortStore';
import SubtitlesStore from './SubtitlesStore';
import TeacherClassesStore from './teacherClassesStore';
import UserStore from './UserStore';
import ValidationStore from './validationStore';
import VariantStore from './variantStore';

import { FillInTheBlanksGameStore } from '~/stores/FillInTheBlankGameStore';
import LatestVideosStore from '~/stores/LatestVideosStore';
import { MatchingPairsGameStore } from '~/stores/MatchingPairsGameStore';
import OpenEndedGameStore from '~/stores/openEndedGameStore';
import RecommendedVideosStore from '~/stores/RecomendedVideosStore';
import VideoStore from '~/stores/VideoStore';
import SubscriptionStore from '~/widget/SubscriptionInfo/module/SubscriptionStore';

const settingsStore = new SettingsStore();
const lessonStore = new LessonStore();
const variantStore = new VariantStore();
const userStore = new UserStore();
const recommendedVideosStore = new RecommendedVideosStore();
const subtitlesStore = new SubtitlesStore();
const videoStore = new VideoStore();
const mainStore = new MainStore();
const latestVideosStore = new LatestVideosStore();
const fillWordStore = new FillWordStore();
const matchingPairsGameStore = new MatchingPairsGameStore();
const fillInTheBlankGameStore = new FillInTheBlanksGameStore();
const sortStore = new SortStore();
const validationStore = new ValidationStore();
const hintTranslationStore = new HintTranslationStore();
const openEndedGameStore = new OpenEndedGameStore();
const teacherClassesStore = new TeacherClassesStore();
const subscriptionStore = new SubscriptionStore();

export {
  fillInTheBlankGameStore,
  fillWordStore,
  hintTranslationStore,
  latestVideosStore,
  lessonStore,
  mainStore,
  matchingPairsGameStore,
  openEndedGameStore,
  recommendedVideosStore,
  settingsStore,
  sortStore,
  subscriptionStore,
  subtitlesStore,
  teacherClassesStore,
  userStore,
  validationStore,
  variantStore,
  videoStore,
};
