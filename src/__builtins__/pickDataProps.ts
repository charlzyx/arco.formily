export const pickDataProps = (props: any = {}) => {
  const results: Record<string, string> = {};

  for (let key in props) {
    if (key.indexOf("data-") > -1) {
      results[key] = props[key];
    }
  }

  return results;
};
