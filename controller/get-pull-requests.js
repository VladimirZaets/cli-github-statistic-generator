const GithubClient = require('~/service/github');
const Writer = require('~/writer');

class GetPullRequests {
    constructor (org = 'adobe', repos = [], state = 'all', startDate, endDate, writer) {
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
            let allPrs = await this.client.getAllPRs(this.org, repositoryName, this.state, 'created', 'desc');
            if (this.startDate) {
                allPrs = allPrs.filter((pr) => (new Date(pr.created_at)).getTime() > this.startDate);
            }
            if (this.endDate) {
                allPrs = allPrs.filter((pr) => (new Date(pr.created_at)).getTime() < this.endDate);
            }
            result.push({
                repository: repositoryName,
                prsTotal: allPrs.length
            });
        }
        await this.writer.execute(
            // eslint-disable-next-line max-len
            `get-prs-with${this.startDate ? '-from-' + (new Date(this.startDate)).toISOString() : ''}${this.endDate ? '-to-' + (new Date(this.endDate)).getTime() : ''}-state-${this.state}-${(new Date().getTime())}`,
            result.sort((first, second) => second.prsTotal - first.prsTotal)
        );
    }
}

module.exports = GetPullRequests;
