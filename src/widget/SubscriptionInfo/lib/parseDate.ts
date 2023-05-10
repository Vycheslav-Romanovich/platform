export const parseDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const d = new Date(+date);

  return d.toLocaleString('en-US', options);
};
