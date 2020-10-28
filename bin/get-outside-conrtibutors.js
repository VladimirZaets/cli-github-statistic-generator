const GetOutsideContributorsController = require('~/controller/get-outside-contributors');

module.exports = (CLI) => {
    CLI.command('get-outside-contributors').alias('goc')
        .description('Get quantity of outside contributors.')
        .option('-R, --repos [repos...]', 'Repositories to collect contributors')
        .option('-T, --team [team]', 'Github Employees Team')
        .option('-O, --organization [organization]', 'Organization to collect contributors')
        .action((source) => (new GetOutsideContributorsController(source.organization)).execute());
};

