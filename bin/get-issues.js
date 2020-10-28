const GetIssues = require('~/controller/get-issues');

module.exports = (CLI) => {
    CLI.command('get-issues').alias('gi')
        .description('Get quantity of repository PRs.')
        .option('-R, --repos [repos...]', 'Repositories to collect Pull Requests')
        .option('-SD, --startdate [startdate]', 'Start date month/day/year')
        .option('-ED, --enddate [enddate]', 'End date month/day/year')
        .option('-S, --state [state]', 'State of issues, open/closed/all, default:all')
        .option('-O, --organization [organization]', 'Organization to collect contributors')
        .action((source) => (new GetIssues(
            source.organization,
            source.state,
            source['startdate'] && (new Date(source['startdate'])).getTime(),
            source['enddate'] && (new Date(source['enddate'])).getTime()
        )).execute());
};

