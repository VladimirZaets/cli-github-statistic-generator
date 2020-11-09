const GetPullRequests = require('~/controller/get-open-processed-prs');

module.exports = (CLI) => {
    CLI.command('get-open-processed-prs').alias('goppr')
        .description('Open vs Processed Pull Requests')
        .option('-R, --repos [repos...]', 'Repositories to collect Pull Requests')
        .option('-SD, --startdate [startdate]', 'Start date month/day/year')
        .option('-ED, --enddate [enddate]', 'End date month/day/year')
        .option('-O, --organization [organization]', 'Organization to collect contributors')
        .option('-W, --writer [writer]', 'Format of resulting file. JSON or CSV')
        .action((source) => (new GetPullRequests(
            source.organization,
            source.repos,
            source['startdate'] && (new Date(source['startdate'])).getTime(),
            source['enddate'] && (new Date(source['enddate'])).getTime(),
            source['writer']
        )).execute());
};

