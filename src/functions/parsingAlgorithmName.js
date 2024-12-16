export const parsingAlgorithmName = (name) => {
  name = name[0].toUpperCase() + name.slice(1);
  if (name.includes("afety")) {
    return name
      .split("_")
      .map((el, index) => (index === 1 ? el + ":" : el))
      .join(" ");
  } else {
    return name.split("_").join(" ");
  }
};
