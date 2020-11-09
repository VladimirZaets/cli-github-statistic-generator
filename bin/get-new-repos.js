const GetIssues = require('~/controller/get-new-repos');

module.exports = (CLI) => {
    CLI.command('get-new-repos').alias('gnr')
        .description('New open sourced projects.')
        .option('-R, --repos [repos...]', 'Repositories to collect Pull Requests')
        .option('-SD, --startdate [startdate]', 'Start date month/day/year')
        .option('-ED, --enddate [enddate]', 'End date month/day/year')
        .option('-O, --organization [organization]', 'Organization to collect contributors')
        .option('-W, --writer [writer]', 'Format of resulting file. JSON or CSV')
        .action((source) => (new GetIssues(
            source.organization,
            source.repos,
            source.state,
            source['startdate'] && (new Date(source['startdate'])).getTime(),
            source['enddate'] && (new Date(source['enddate'])).getTime(),
            source['writer']
        )).execute());
};

