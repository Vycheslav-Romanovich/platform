import { durationType, OrderType } from '~/types/api';
import { VideoGameType } from '~/types/video';

export const sortByDuration: { label: string; value: durationType }[] = [
  { label: 'All', value: 'any' },
  { label: 'less than 4 min', value: 'short' },
  { label: '4 to 20 min', value: 'medium' },
  { label: 'Over 20 min', value: 'long' },
];

export const sortByOrder: { label: string; value: OrderType }[] = [
  { label: 'Upload date', value: 'date' },
  { label: 'Relevance', value: 'relevance' },
  { label: 'View count', value: 'viewCount' },
  { label: 'Rating', value: 'rating' },
];

export const videoActivityName = new Map<VideoGameType, string>([
  ['true_or_false', 'True or False'],
  ['open_end_question', 'Open-ended question'],
  ['multiple_choice', 'Multiple choice'],
]);
