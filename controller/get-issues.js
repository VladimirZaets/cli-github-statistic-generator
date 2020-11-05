const GithubClient = require('~/service/github');
const Writer = require('~/writer');

class GetIssues {
    constructor (org = 'adobe', repos = [], state = 'all', startDate, endDate, writer) {
        this.org = org;
        this.state = state;
        this.repos = repos;
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
            let allIssues = await this.client.getAllIssues(this.org, repositoryName, this.state, 'created', 'desc');
            allIssues = allIssues.filter((issue) => !issue['pull_request']);

            if (this.startDate) {
                allIssues = allIssues.filter((issue) => (new Date(issue.created_at)).getTime() > this.startDate);
            }
            if (this.endDate) {
                allIssues = allIssues.filter((issue) => (new Date(issue.created_at)).getTime() < this.endDate);
            }
            result.push({
                repository: repositoryName,
                issuesTotal: allIssues.length,
            });
        }
        await this.writer.execute(
            // eslint-disable-next-line max-len
            `get-issues-with${this.startDate ? '-from-' + new Date(this.startDate).toISOString() : ''}${this.endDate ? '-to-' + new Date(this.endDate).toISOString() : ''}-state-${this.state}-${(new Date()).getTime()}`,
            result.sort((first, second) => second.issuesTotal - first.issuesTotal)
        );
    }
}

module.exports = GetIssues;
