export const sendUserIdToGTM = (userId: number) => {
  window.dataLayer &&
    userId &&
    window.dataLayer.push({
      userId: userId,
    });
};

export const sendEvent = (eventName: string, eventParams?: { [key: string]: string }) => {
  window.dataLayer &&
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
    });
};

export const sendHotkeyToGTM = (e) => {
  window.dataLayer && window.dataLayer.push({ event: 'Hotkey', key: e.key, which: e.keyCode });
};
