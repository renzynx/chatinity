export const serialize = (s: string) => {
  return s.replace(/(^\w+:|^)\/\//, "");
};
