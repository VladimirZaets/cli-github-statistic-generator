const GithubClient = require('~/service/github');
const JSONWriter = require('~/writer/json');

class GetIssues {
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
            let allIssues = await this.client.getAllIssues(this.org, repo, this.state, 'created', 'desc');
            allIssues = allIssues.filter((issue) => !issue['pull_request']);

            if (this.startDate) {
                allIssues = allIssues.filter((issue) => (new Date(issue.created_at)).getTime() > this.startDate);
            }
            if (this.endDate) {
                allIssues = allIssues.filter((issue) => (new Date(issue.created_at)).getTime() < this.endDate);
            }
            result.push({
                repository: repo.name,
                issuesTotal: allIssues.length,
            });
        }
        await this.JSONwriter.execute(
            // eslint-disable-next-line max-len
            `get-issues-with${this.startDate ? '-from-' + new Date(this.startDate).toISOString() : ''}${this.endDate ? '-to-' + new Date(this.endDate).toISOString() : ''}-state-${this.state}`,
            result.sort((first, second) => second.issuesTotal - first.issuesTotal)
        );
    }
}

module.exports = GetIssues;
