const GithubClient = require('~/service/github');
const JSONWriter = require('~/writer/json');

class GetReposWithoutCommits {
    constructor (org) {
        this.org = org || 'adobe';
        this.repos = [];
        this.client = new GithubClient();
        this.JSONwriter = new JSONWriter();
    }

    async execute () {
        const repos = await this.client.getAllRepos(this.org);
        const result = [];

        for (const repo of repos) {
            const content = await this.client.getCommitActivityStats(this.org, repo.name);
            const repoWithoutCommits = content.filter((item) => item.total);
            if (!repoWithoutCommits.length) {
                result.push(repo.name);
            }
        }
        await this.JSONwriter.execute(`get-repos-without-commits`, result);
    }
}

module.exports = GetReposWithoutCommits;
