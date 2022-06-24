export const imageFormat = (link) => {
  const regex = new RegExp(".(jpeg|jpg|png|gif|webp)$", "i");
  return regex.test(link);
};
