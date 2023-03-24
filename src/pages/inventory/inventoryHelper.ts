/* eslint-disable quotes */
export const parseExtraFuild = (item: any) => {
  if (typeof item === 'string') {
    return JSON.parse(item.split("'").join('"'));
  }

  return item;
};
