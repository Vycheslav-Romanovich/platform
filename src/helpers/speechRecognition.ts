export const speechRecognition = (lang: string) => {
  const speechRecognition = typeof window !== 'undefined' && window.webkitSpeechRecognition;
  if (speechRecognition == undefined) {
    return undefined;
  }
  const recognition = new speechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 3;
  recognition.lang = lang;
  return recognition;
};
