const GithubClient = require('~/service/github');
const Writer = require('~/writer');

class GetReposWithoutCommits {
    constructor (org = 'adobe', repos = [], writer) {
        this.org = org;
        this.repos = repos;
        this.client = new GithubClient();
        this.writer = (new Writer()).get(writer);
    }

    async execute () {
        const repos = this.repos.length ? this.repos : await this.client.getAllRepos(this.org);
        const result = [];

        for (const repo of repos) {
            const repositoryName = repo.name || repo;
            const content = await this.client.getCommitActivityStats(this.org, repositoryName);
            const repoWithoutCommits = content.filter((item) => item.total);
            if (!repoWithoutCommits.length) {
                result.push({
                    repository: repositoryName
                });
            }
        }
        await this.writer.execute(`get-repos-without-commits-${(new Date().getTime())}`, result);
    }
}

module.exports = GetReposWithoutCommits;
