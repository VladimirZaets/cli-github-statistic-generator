const GetReposWithoutFiles = require('~/controller/get-repos-without-files');

module.exports = (CLI) => {
    CLI.command('get-repos-without-file').alias('grwf')
        .description('Get repository without files.')
        .option('-F, --filenames <filenames...>', 'Repositories without files')
        .option('-R, --repos [repos...]', 'Repositories to check')
        .option('-O, --organization [organization]', 'Organization to check')
        .option('-W, --writer [writer]', 'Format of resulting file. JSON or CSV')
        .action((source) => 
            (new GetReposWithoutFiles(
                source.organization, 
                source.filenames, 
                source.repos,
                source.writer
            )).execute()
        );
};

