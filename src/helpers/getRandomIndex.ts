import { MIN_INDEX } from '../constants/variable';

export const getRandomIndex = (maxIndex: number) => {
  const min = Math.ceil(MIN_INDEX);
  const max = Math.floor(maxIndex);

  return Math.floor(Math.random() * (max - min)) + min;
};
