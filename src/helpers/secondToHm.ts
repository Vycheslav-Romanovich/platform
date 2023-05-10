export const secondToHms = (d: number) => {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);
  return (h ? ('0' + h).slice(-2) + ':' : '') + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
};
