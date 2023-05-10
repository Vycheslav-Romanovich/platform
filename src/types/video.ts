export interface ItemImg {
  url: string;
  height: number;
  width: number;
}

type interest =
  | 'All'
  | 'shorts_video'
  | 'music'
  | 'food'
  | 'tv-series'
  | 'games'
  | 'films'
  | 'popular science'
  | 'sport'
  | 'learn english'
  | 'Cars'
  | 'travelling'
  | 'technology'
  | 'TED'
  | 'animation';

export interface IListItem {
  clicks: number;
  cover: any;
  description: string;
  duration: number;
  interest: interest;
  interestid: number;
  path: number[];
  priority: number;
  serviceId: string;
  thumbnails: {
    high: ItemImg;
    default: ItemImg;
    maxres: ItemImg;
    medium: ItemImg;
    standart: ItemImg;
  };
  title: string;
}

export interface SearchList {
  list: IListItem[];
  loading?: boolean;
  tag?: string;
  loadingMore?: boolean;
  nextPageToken?: string;
  pageInfo?: {
    totalResults: number;
    resultPerPage: number;
  };
}

export interface IVideoItem {
  interest: string;
  id: string;
  serviceId: string;
  title: string;
  thumbnails: {
    medium: {
      url: string;
    };
  };
}

export interface IRecommendedList {
  [tag: string]: IVideoItem[];
}

export interface ResponseVideoType {
  [index: string]: IListItem[];
}

export interface ListItem {
  tag: string;
  priority: number;
  videoList: IListItem[];
}

export interface StatisticType {
  correctAnswer: boolean | string[];
  gameType: VideoGameType;
  timeCode: number;
  id: number | string;
  variant?: OptionType[];
  statisticArray?: number;
  userAnswer: null | boolean | string[];
}

export class VideoGameDto {
  timeCode: number;
  id: string;
  gameType: VideoGameType;
  question: string;
  answer?: VideoGameAnswerType;
}

export type VideoGameType = 'true_or_false' | 'open_end_question' | 'multiple_choice';

export type OptionType = {
  id: string;
  value: string;
};

export type VideoGameAnswerType = { correct: string[] | boolean; option?: OptionType[] };
