const GithubClient = require('~/service/github');
const Writer = require('~/writer');
const DateService = require('~/service/date');

class GetTimeToReact {
    constructor (
        org = 'adobe',
        repos = [],
        state,
        startDate,
        endDate,
        writer
    ) {
        this.org = org;
        this.state = state;
        this.repos = repos;
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
            const issues = await this.client.getIssues(
                this.org,
                repositoryName,
                this.state,
                this.startDate,
                this.endDate
            );

            result.push({
                repository: repositoryName,
                issuesTotal: issues.length,
            });
        }

        const stdate = this.startDate ? '-from-' + this.date.format(this.startDate) : ''
        const eddate = this.endDate ? '-to-' + this.date.format(this.endDate) : '';
        await this.writer.execute(
            `issues-with${stdate}${eddate}-state-${this.state || 'all'}-${this.date.now()}`,
            result.sort((first, second) => second.issuesTotal - first.issuesTotal)
        );
    }
}

module.exports = GetTimeToReact;
