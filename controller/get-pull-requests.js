const GithubClient = require('~/service/github');
const JSONWriter = require('~/writer/json');

class GetPullRequests {
    constructor (org, state, startDate, endDate) {
        this.org = org || 'adobe';
        this.repos = [];
        this.state = state || 'all';
        this.startDate = startDate;
        this.endDate = endDate;
        this.client = new GithubClient();
        this.JSONwriter = new JSONWriter();
    }

    async execute () {
        const repos = await this.client.getAllRepos(this.org);
        const result = [];

        for (const repo of repos) {
            let allPrs = await this.client.getAllPRs(this.org, repo, this.state, 'created', 'desc');
            if (this.startDate) {
                allPrs = allPrs.filter((pr) => (new Date(pr.created_at)).getTime() > this.startDate);
            }
            if (this.endDate) {
                allPrs = allPrs.filter((pr) => (new Date(pr.created_at)).getTime() < this.endDate);
            }
            result.push({
                repository: repo.name,
                prsTotal: allPrs.length
            });
        }
        await this.JSONwriter.execute(
            // eslint-disable-next-line max-len
            `get-prs-with${this.startDate ? '-from-' + (new Date(this.startDate)).toISOString() : ''}${this.endDate ? '-to-' + (new Date(this.endDate)).getTime() : ''}-state-${this.state}`,
            result.sort((first, second) => second.prsTotal - first.prsTotal)
        );
    }
}

module.exports = GetPullRequests;
