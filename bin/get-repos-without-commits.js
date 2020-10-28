const GetReposWithoutCommits = require('~/controller/get-repos-without-commits');

module.exports = (CLI) => {
    CLI.command('get-repos-without-commits').alias('grwc')
        .description('Get repository without commits in last year.')
        .option('-R, --repos [repos...]', 'Repositories to check')
        .option('-O, --organization [organization]', 'Organization to check')
        .action((source) => (new GetReposWithoutCommits(source.organization)).execute());
};

