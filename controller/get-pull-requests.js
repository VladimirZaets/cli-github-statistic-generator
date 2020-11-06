const GithubClient = require('~/service/github');
const Writer = require('~/writer');

class GetPullRequests {
    constructor (org = 'adobe', repos = [], state, startDate, endDate, writer) {
        this.org = org;
        this.repos = repos;
        this.state = state;
        this.startDate = startDate;
        this.endDate = endDate;
        this.client = new GithubClient();
        this.writer = (new Writer()).get(writer);
    }

    async execute () {
        const repos = this.repos.length ? this.repos : await this.client.getAllRepos(this.org);
        const result = [];

        for (const repo of repos) {
            const repositoryName = repo.name || repo;
            let allPrs = await this.client.getPRs(this.org, repositoryName, this.state, this.startDate, this.endDate);
            
            result.push({
                repository: repositoryName,
                prsTotal: allPrs.length
            });
        }
        await this.writer.execute(
            // eslint-disable-next-line max-len
            `get-prs-with${this.startDate ? '-from-' + (new Date(this.startDate)).toISOString() : ''}${this.endDate ? '-to-' + (new Date(this.endDate)).getTime() : ''}-state-${this.state || 'all'}-${(new Date().getTime())}`,
            result.sort((first, second) => second.prsTotal - first.prsTotal)
        );
    }
}

module.exports = GetPullRequests;
