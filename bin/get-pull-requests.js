const GetPullRequests = require('~/controller/get-pull-requests');

module.exports = (CLI) => {
    CLI.command('get-prs').alias('gpr')
        .description('Get pull requests.')
        .option('-R, --repos [repos...]', 'Repositories to collect Pull Requests')
        .option('-SD, --startdate [startdate]', 'Start date month/day/year')
        .option('-ED, --enddate [enddate]', 'End date month/day/year')
        .option('-S, --state [state]', 'State of PRs, open/closed/all, default:all')
        .option('-O, --organization [organization]', 'Organization to collect contributors')
        .action((source) => (new GetPullRequests(
            source.organization,
            source.state,
            source['startdate'] && (new Date(source['startdate'])).getTime(),
            source['enddate'] && (new Date(source['enddate'])).getTime()
        )).execute());
};

