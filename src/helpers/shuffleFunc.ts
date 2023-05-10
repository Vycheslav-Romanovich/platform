export const shuffleFunc = (translations: string[]) => {
  for (let i = translations.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [translations[i], translations[j]] = [translations[j], translations[i]];
  }
  return translations;
};
