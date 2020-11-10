const GithubClient = require('~/service/github');
const Writer = require('~/writer');
const DateService = require('~/service/date');

class GetPresenceFiles {
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
        const reposWithoutFile = {};
        const result = {
            total: repos.length,
            yes: 0,
            no: 0
        };

        for (const repo of repos) {
            let contains = true;
            for (const file of this.files) {
                const repositoryName = repo.name || repo;
                const content = await this.client.getFile(this.org, repositoryName, file);
                if (!content) { contains = false;}
            }
            contains ? ++result.yes : ++result.no;
        }
        
        await this.writer.execute(`presence-files-${this.files.join('-')}-${this.date.now()}`, [result]);
    }
}

module.exports = GetPresenceFiles;
