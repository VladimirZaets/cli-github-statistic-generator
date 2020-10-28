const GetReposWithout = require('~/controller/get-repos-without');

module.exports = (CLI) => {
    CLI.command('get-repos-without-file').alias('grw')
        .description('Get pull requests.')
        .option('-F, --filename <filename>', 'Repositories without file')
        .option('-R, --repos [repos...]', 'Repositories to check')
        .option('-O, --organization [organization]', 'Organization to check')
        .action((source) => (new GetReposWithout(source.organization, source.filename)).execute());
};

