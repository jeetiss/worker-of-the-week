const get = require("got");
const cheerio = require("cheerio");
const subWeeks = require("date-fns/subWeeks");
const startOfWeek = require("date-fns/startOfWeek");
const endOfWeek = require("date-fns/endOfWeek");
const addHours = require("date-fns/addHours");
const isAfter = require("date-fns/isAfter");
const isBefore = require("date-fns/isBefore");
const parse = require("date-fns/parse");

const lastFullWeekStart = startOfWeek(subWeeks(new Date(), 1));
const lastFullWeekEnd = addHours(endOfWeek(lastFullWeekStart), 1);

const lastWeek = date =>
  isAfter(date, lastFullWeekStart) && isBefore(date, lastFullWeekEnd);

const getUserContributions = async user => {
  const url = `https://www.github.com/${user}`;

  const response = await get(url);

  // Parse github profile page
  const $ = cheerio.load(response.body);
  const count = $("rect")
    .get()
    .slice(-14)
    .reduce((sum, rect) => {
      // Parse contributions value
      const rectElement = $(rect);
      const date = parse(rectElement.data("date"), "yyyy-MM-dd", new Date());

      return sum + (lastWeek(date) ? rectElement.data("count") : 0);
    }, 0);

  return count;
};

const getStars = async () => {
  const response = await get("https://api.github.com/orgs/uploadcare/members");
  const members = JSON.parse(response.body);

  const contributions = await getUserContributions(members[0].login);

  const data = await Promise.all(
    members.map(async member => {
      const strength = await getUserContributions(member.login);

      return {
        strength,
        username: member.login,
        avatar: member.avatar_url
      };
    })
  );

  return data.sort((a, b) => b.strength - a.strength).slice(0, 3);
};

module.exports = {
  getStars
};
