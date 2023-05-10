export const requestFullScreen = (element: any) => {
  const requestMethod =
    element.requestFullScreen ||
    element.webkitRequestFullScreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullScreen;
  if (requestMethod) {
    requestMethod.call(element);
  }
};

export const exitFullScreen = (element: any) => {
  const requestMethod =
    element.exitFullscreen ||
    element.cancelFullScreen ||
    element.webkitCancelFullScreen ||
    element.mozCancelFullScreen;
  if (requestMethod) {
    requestMethod.call(element);
  }
};

export const isFullScreened = (element: any) => {
  if (typeof document !== 'undefined') {
    const fElement =
      element.fullscreenElement ||
      element.webkitFullscreenElement ||
      element.mozFullScreenElement ||
      element.webkitCurrentFullScreenElement;

    return fElement !== null;
  }
};
