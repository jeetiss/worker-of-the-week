const { getStars } = require("./fetch");

module.exports = async (req, res) => {
  const stars = await getStars();

  res.json(stars);
};
