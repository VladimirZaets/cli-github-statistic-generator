const GithubClient = require('~/service/github');
const Writer = require('~/writer');
const DateService = require('~/service/date');

class GetOpenProcessedPrs {
    constructor (org = 'adobe', repos = [], startDate, endDate, writer) {
        this.org = org;
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
            let openPrs = await this.client.getPRs(this.org, repositoryName, 'open', this.startDate, this.endDate);
            let closedPrs = await this.client.getPRs(this.org, repositoryName, 'closed', this.startDate, this.endDate);
            let mergedPrs = await this.client.getPRs(this.org, repositoryName, 'merged', this.startDate, this.endDate);
            
            result.push({
                repository: repositoryName,
                merged: mergedPrs.length,
                closed: closedPrs.length,
                open: openPrs.length
            });
        }

        const stdate = this.startDate ? '-from-' + this.date.format(this.startDate) : ''
        const eddate = this.endDate ? '-to-' + this.date.format(this.endDate) : '';
        await this.writer.execute(`open-processed-prs${stdate}${eddate}-${this.date.now()}`, result);
    }
}

module.exports = GetOpenProcessedPrs;
