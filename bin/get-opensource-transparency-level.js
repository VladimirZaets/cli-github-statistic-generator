const GetOpensourceTransparencyLevel = require('~/controller/get-opensource-transparency-level');

module.exports = (CLI) => {
    CLI.command('get-opensource-transparency-level').alias('gotl')
        .description('Get opensource transparency level.')
        .option('-O, --organization <organization>', 'Organization to collect contributors')
        .option('-W, --writer [writer]', 'Format of resulting file. JSON or CSV')
        .action((source) => (
            new GetOpensourceTransparencyLevel(source.organization, source.writer)).execute()
        );
};

