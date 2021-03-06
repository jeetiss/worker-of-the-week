const get = require("got");
const cheerio = require("cheerio");
const subWeeks = require("date-fns/subWeeks");
const startOfWeek = require("date-fns/startOfWeek");
const endOfWeek = require("date-fns/endOfWeek");
const isAfter = require("date-fns/isAfter");
const subHours = require("date-fns/subHours");
const isBefore = require("date-fns/isBefore");
const parse = require("date-fns/parse");

const lastFullWeekStart = startOfWeek(subWeeks(new Date(), 1));
const lastFullWeekEnd = endOfWeek(lastFullWeekStart);

const lastWeek = date =>
  isAfter(date, subHours(lastFullWeekStart, 1)) &&
  isBefore(date, lastFullWeekEnd);

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
      const date = parse(rectElement.data("date") + " +00", "yyyy-MM-dd x", 0);

      return sum + (lastWeek(date) ? rectElement.data("count") : 0);
    }, 0);

  return count;
};

const getStars = async () => {
  const response = await get("https://api.github.com/orgs/uploadcare/members");
  const members = JSON.parse(response.body);

  const data = await Promise.all(
    members
      .filter(member => member.type === "User")
      .map(async member => {
        const strength = await getUserContributions(member.login);

        return {
          strength,
          username: member.login,
          avatar: member.avatar_url,
          url: member.html_url
        };
      })
  );

  return data.sort((a, b) => b.strength - a.strength);
};

module.exports = {
  getStars
};
