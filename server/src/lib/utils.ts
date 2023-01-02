export const serialize = (s: string) => {
  const url = s.replace(/(^\w+:|^)\/\//, "");
  const domain = url.split(".").slice(-2).join(".");
  return domain.replace(/\/$/, "");
};
