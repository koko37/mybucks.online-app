export const truncate = (str, len = 12) =>
  str.slice(0, (len >> 1) + 2) + "..." + str.slice((len >> 1) * -1);
