import MultipleChoice from '../assets/icons/videoInteractive/MultipleChoice.svg';
import OpenEnded from '../assets/icons/videoInteractive/openEnded.svg';
import TrueFalse from '../assets/icons/videoInteractive/trueFalse.svg';

import { VideoGameType } from '~/types/video';

export const QueryOptions = (step: number, asPath: string) => {
  switch (step) {
    case 0:
      return asPath === '/create-video-lesson';
    case 1:
      return asPath === '/create-video-lesson?s=1';
    case 2:
      return asPath === '/create-video-lesson?s=2';
    case 3:
      return asPath !== '/create-video-lesson';
    case 4:
      return asPath !== '/create-video-lesson?s=2';
    default:
      return asPath === '/create-video-lesson';
  }
};

type VideoInteractiveType = {
  interactiveName: string;
  dataBaseName: VideoGameType;
  Picture: any;
};

export const videoInteractiveDesc: VideoInteractiveType[] = [
  {
    interactiveName: 'Open-ended question',
    dataBaseName: 'open_end_question',
    Picture: OpenEnded,
  },
  {
    interactiveName: 'True or False',
    dataBaseName: 'true_or_false',
    Picture: TrueFalse,
  },
  {
    interactiveName: 'Multiple Choice',
    dataBaseName: 'multiple_choice',
    Picture: MultipleChoice,
  },
];
