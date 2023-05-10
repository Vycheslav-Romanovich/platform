export const playMachineAudioFragment = async (text: string) => {
  return new Promise((resolve, reject) => {
    const synth = window.speechSynthesis;
    if (text !== '') {
      const utterThis = new SpeechSynthesisUtterance(text);
      utterThis.onend = function (event) {
        resolve(event);
      };
      utterThis.onerror = function (event) {
        reject(event);
      };

      /*const Mozilla = navigator.userAgent.toLowerCase().includes('firefox');
      const Safari = navigator.userAgent.toLowerCase().includes('mac');
      const IosSafari =
        navigator.userAgent.toLowerCase().includes('mac') &&
        navigator.userAgent.toLowerCase().includes('mobile');

      const voices = synth.getVoices();
      const voiceForChrome = 'Microsoft David - English (United States)';
      const voiceForFirefox = 'Microsoft David Desktop - English (United States)';
      const voiceForSafari = 'Fred';
      const voiceForIosSafari = 'Daniel';
      const voiceToSet = Mozilla
        ? voiceForFirefox
        : IosSafari
        ? voiceForIosSafari
        : Safari
        ? voiceForSafari
        : voiceForChrome;*/
      const voices = synth.getVoices();
      const voiceToSet = voices.find((voice) => voice.lang.includes('en')).name;

      utterThis.voice = voices.find((voice) => {
        return voice.name === voiceToSet;
      });

      utterThis.pitch = 0.9;
      utterThis.rate = 0.8;
      synth.speak(utterThis);
    }
  });
};
