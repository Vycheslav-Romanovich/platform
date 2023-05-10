export const toClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then();
};
