const GithubClient = require('~/service/github');
const JSONWriter = require('~/writer/json');

class GetReposWithout {
    constructor (org, file) {
        this.org = org || 'adobe';
        this.repos = [];
        this.file = file;
        this.client = new GithubClient();
        this.JSONwriter = new JSONWriter();
    }

    async execute () {
        const repos = await this.client.getAllRepos(this.org);
        const result = [];

        for (const repo of repos) {
            const content = await this.client.getFile(this.org, repo.name, this.file);
            if (!content) {
                result.push(repo.name);
            }
        }
        await this.JSONwriter.execute(`get-repos-without-${this.file}`, result);
    }
}

module.exports = GetReposWithout;
