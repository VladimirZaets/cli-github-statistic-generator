const GithubClient = require('~/service/github');
const Writer = require('~/writer');
const DateService = require('~/service/date');

class GetPullRequests {
    constructor (org = 'adobe', repos = [], state, startDate, endDate, writer) {
        this.org = org;
        this.repos = repos;
        this.state = state;
        this.startDate = startDate;
        this.endDate = endDate;
        this.client = new GithubClient();
        this.writer = (new Writer()).get(writer);
        this.date = new DateService();
    }

    async execute () {
        const repos = this.repos.length ? this.repos : await this.client.getAllRepos(this.org);
        const result = [];

        for (const repo of repos) {
            const repositoryName = repo.name || repo;
            let prs = await this.client.getPRs(this.org, repositoryName, this.state, this.startDate, this.endDate);
            prs = prs.filter((pr) => pr.author.__typename === 'User')
            
            result.push({
                repository: repositoryName,
                prsTotal: prs.length
            });
        }
        const stdate = this.startDate ? '-from-' + this.date.format(this.startDate) : ''
        const eddate = this.endDate ? '-to-' + this.date.format(this.endDate) : '';
        await this.writer.execute(
            `prs-with${stdate}${eddate}-state-${this.state || 'all'}-${this.date.now()}`,
            result.sort((first, second) => second.prsTotal - first.prsTotal)
        );
    }
}

module.exports = GetPullRequests;
