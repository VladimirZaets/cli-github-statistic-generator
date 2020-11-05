const GetReposWithoutCommits = require('~/controller/get-repos-without-commits');

module.exports = (CLI) => {
    CLI.command('get-repos-without-commits').alias('grwc')
        .description('Get repository without commits in last year.')
        .option('-R, --repos [repos...]', 'Repositories to check')
        .option('-O, --organization [organization]', 'Organization to check')
        .option('-W, --writer [writer]', 'Format of resulting file. JSON or CSV')
        .action((source) => (
            new GetReposWithoutCommits(
                source.organization, 
                source.repos, 
                source.writer
            )).execute()
        );
};

