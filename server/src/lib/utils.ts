export const serialize = (s: string) => {
  const url = s.replace(/(^\w+:|^)\/\//, "");
  return url.split(".").slice(-2).join(".");
};
