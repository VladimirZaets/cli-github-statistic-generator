const GetPullRequests = require('~/controller/get-level-of-interest');

module.exports = (CLI) => {
    CLI.command('get-level-of-interest').alias('gloi')
        .description('Level of interest from community.')
        .option('-R, --repos [repos...]', 'Repositories to collect Pull Requests')
        .option('-SD, --startdate [startdate]', 'Start date month/day/year')
        .option('-ED, --enddate [enddate]', 'End date month/day/year')
        .option('-S, --state [state]', 'State of PRs, open/closed/all, default:all')
        .option('-O, --organization [organization]', 'Organization to collect contributors')
        .option('-W, --writer [writer]', 'Format of resulting file. JSON or CSV')
        .option('-EC, --excludecompany <excludecompany>', 'Exclude company by name')
        .action((source) => (new GetPullRequests(
            source.organization,
            source.repos,
            source.state,
            source['startdate'] && (new Date(source['startdate'])).getTime(),
            source['enddate'] && (new Date(source['enddate'])).getTime(),
            source['excludecompany'],
            source['writer']
        )).execute());
};

