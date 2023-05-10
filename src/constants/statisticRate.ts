import Awesome from '../assets/icons/statisticEmoji/Awesome.svg';
import DoBetter from '../assets/icons/statisticEmoji/DoBetter.svg';
import Fantastic from '../assets/icons/statisticEmoji/Fantastic.svg';
import Great from '../assets/icons/statisticEmoji/Great.svg';
import StillLearning from '../assets/icons/statisticEmoji/StillLearning.svg';
import YouRock from '../assets/icons/statisticEmoji/YouRock.svg';

export const getStatisticsEmoji = (
  answerPercent: number
): { title: string; Img; color: string } => {
  if (answerPercent > 50) {
    const random = Math.floor(Math.random() * 4) + 1;
    switch (random) {
      case 1: {
        return {
          title: 'Fantastic!',
          Img: Fantastic,
          color: 'var(--M_Green)',
        };
      }
      case 2: {
        return {
          title: 'Awesome!',
          Img: Awesome,
          color: 'var(--M_Green)',
        };
      }
      case 3: {
        return {
          title: 'Great!',
          Img: Great,
          color: 'var(--M_Green)',
        };
      }
      case 4: {
        return {
          title: 'You rock!',
          Img: YouRock,
          color: 'var(--M_Green)',
        };
      }
    }
  } else {
    const random = Math.floor(Math.random() * 2) + 1;
    switch (random) {
      case 1: {
        return {
          title: 'You can do better!',
          Img: DoBetter,
          color: 'var(--Black)',
        };
      }
      case 2: {
        return {
          title: 'No problem. You’re still learning!',
          Img: StillLearning,
          color: 'var(--Black)',
        };
      }
    }
  }
};
