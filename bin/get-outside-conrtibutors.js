const GetOutsideContributorsController = require('~/controller/get-outside-contributors');

module.exports = (CLI) => {
    CLI.command('get-outside-contributors').alias('goc')
        .description('Get quantity of outside contributors.')
        .option('-R, --repos [repos...]', 'Repositories to collect contributors')
        .option('-O, --organization <organization>', 'Organization to collect contributors')
        .option('-EC, --excludecompany <excludecompany>', 'Exclude company by name')
        .option('-W, --writer [writer]', 'Format of resulting file. JSON or CSV')
        .action((source) => (
            new GetOutsideContributorsController(
                source.organization, 
                source.repos, 
                source.excludecompany,
                source.writer
            )).execute()
        );
};

