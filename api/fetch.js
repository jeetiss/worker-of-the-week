const subWeeks = require("date-fns/subWeeks");
const Octokit = require("@octokit/rest");
const startOfWeek = require("date-fns/startOfWeek");
const endOfWeek = require("date-fns/endOfWeek");
const isAfter = require("date-fns/isAfter");
const isBefore = require("date-fns/isBefore");
const parseIso = require("date-fns/parseIso");

const main = async () => {
  const octokit = new Octokit({
    auth: "token MY_TOKEN"
  });

  const members = await octokit.orgs.listMembers({
    org: "uploadcare"
  });

  const now = new Date();
  const lastFullWeekStart = startOfWeek(subWeeks(now, 1));
  const lastFullWeekEnd = endOfWeek(lastFullWeekStart);

  for (const user of members.data) {
    const events = await octokit.activity.listEventsForUser({
      username: user.login
    });

    const lastWeekEvents = events.data.filter(event => {
      const createdAt = parseIso(event.created_at);

      return (
        isAfter(createdAt, lastFullWeekStart) &&
        isBefore(createdAt, lastFullWeekEnd)
      );
    });

    const total = lastWeekEvents.length;

    console.log(user.login, total)
  }
};

main();
