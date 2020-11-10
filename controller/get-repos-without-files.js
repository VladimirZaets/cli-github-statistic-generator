const GithubClient = require('~/service/github');
const Writer = require('~/writer');
const DateService = require('~/service/date');

class GetReposWithoutFiles {
    constructor (org, files, repos = [], writer) {
        this.org = org || 'adobe';
        this.files = files;
        this.repos = repos;
        this.client = new GithubClient();
        this.writer = (new Writer()).get(writer);
        this.date = new DateService();
    }

    async execute () {
        const repos = this.repos.length ? this.repos : await this.client.getAllRepos(this.org);
        const result = {};

        for (const repo of repos) {
            for (const file of this.files) {
                const repositoryName = repo.name || repo;
                const content = await this.client.getFile(this.org, repositoryName, file);
                if (!content) {
                    if (!result[repositoryName]){
                        result[repositoryName] = {};
                        result[repositoryName]['repository'] = repositoryName;
                        result[repositoryName]['files'] = [];
                    }

                    result[repositoryName]['files'].push(file);
                }
            }
        }
        
        const filenames = this.files.join('-').replace('/', '-')
        await this.writer.execute(
            `repos-without-${filenames}-${this.date.now()}`, 
            Object.values(result)
        );
    }
}

module.exports = GetReposWithoutFiles;
