const GithubClient = require('~/service/github');
const Writer = require('~/writer');

class GetReposWithoutFiles {
    constructor (org, files, repos = [], writer) {
        this.org = org || 'adobe';
        this.files = files;
        this.repos = repos;
        this.client = new GithubClient();
        this.writer = (new Writer()).get(writer);
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
        await this.writer.execute(
            `get-repos-without-${this.files.join('-')}-${(new Date()).getTime()}`, 
            Object.values(result)
        );
    }
}

module.exports = GetReposWithoutFiles;
