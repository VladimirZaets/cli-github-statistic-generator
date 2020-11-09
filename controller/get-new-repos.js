const GithubClient = require('~/service/github');
const Writer = require('~/writer');
const DateService = require('~/service/date');

class GetNewRepos {
    constructor (org = 'adobe', repos = [], state, startDate, endDate, writer) {
        console.log(writer);
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
        const result = {};

        for (const repo of repos) {
            const repositoryName = repo.name || repo;
            const createdAt = this.date.format(new Date(repo['created_at']), 'MMM yy');
            
            if (!result[createdAt]) {
                result[createdAt] = {
                    month: createdAt,
                    value: 0
                }
            }
            
            ++result[createdAt].value;
        }

        const stdate = this.startDate ? '-from-' + this.date.format(this.startDate) : ''
        const eddate = this.endDate ? '-to-' + this.date.format(this.endDate) : '';
        await this.writer.execute(
            `new-repos${stdate}${eddate}-state-${this.state || 'all'}-${this.date.now()}`,
            Object.values(result)
        );
    }
}

module.exports = GetNewRepos;
