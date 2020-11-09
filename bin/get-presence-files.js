const GetPresenceFiles = require('~/controller/get-presence-files');

module.exports = (CLI) => {
    CLI.command('get-presence-files').alias('gpf')
        .description('Get presence of recommended artifacts.')
        .option('-F, --filenames <filenames...>', 'Files')
        .option('-R, --repos [repos...]', 'Repositories to check')
        .option('-O, --organization [organization]', 'Organization to check')
        .option('-W, --writer [writer]', 'Format of resulting file. JSON or CSV')
        .action((source) =>
            (new GetPresenceFiles(
                source.organization,
                source.filenames,
                source.repos,
                source.writer
            )).execute()
        );
};

