const GithubClient = require('~/service/github');
const Writer = require('~/writer');
const DateService = require('~/service/date');

class GetLevelOfInterest {
    constructor (
        org = 'adobe', 
        repos = [], 
        state, 
        startDate, 
        endDate, 
        excludeCompany = '@adobe', 
        writer
    ) {
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
        const members = await this.client.getAllOrgMembers(this.org);
        const result = {};

        for (const repo of repos) {
            const repositoryName = repo.name || repo;
            const prs = await this.client.getPRs(
                this.org, 
                repositoryName, 
                this.state, 
                this.startDate, 
                this.endDate
            );
            
            result[repositoryName] = {
                repository: repositoryName,
                inside: 0,
                outside: 0
            }

            prs.forEach((pr) => {
                if (pr.author) {
                    members.includes(pr.author.login) ||
                    (pr.author.company && pr.author.company.trim().toLowerCase() === this.excludeCompany) ?
                        ++result[repositoryName].inside :
                        ++result[repositoryName].outside   
                }
            });
        }

        const stdate = this.startDate ? '-from-' + this.date.format(this.startDate) : ''
        const eddate = this.endDate ? '-to-' + this.date.format(this.endDate) : '';
        await this.writer.execute(
            `level-of-interest${stdate}${eddate}-state-${this.state || 'all'}-${this.date.now()}`,
            Object.values(result)
        );
    }
}

module.exports = GetLevelOfInterest;
