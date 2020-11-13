const GithubClient = require('~/service/github');
const _lodash = require('lodash');
const Writer = require('~/writer');
const DateService = require('~/service/date');
const adobeEmployees = require('~/static/adobe-employees.json');

class GetOutsideContributors {
    constructor (org = 'adobe', repos = [], excludeCompany = '@adobe', writer) {
        this.org = org;
        this.repos = repos;
        this.excludeCompany = excludeCompany;
        this.client = new GithubClient();
        this.writer = (new Writer()).get(writer);
        this.date = new DateService();
    }

    async execute () {
        const repos = this.repos.length ? this.repos : await this.client.getAllRepos(this.org);
        const result = [];

        for (const repo of repos) {
            const repositoryName = repo.name || repo;
            let contributors = await this.client.getAllContributors(repositoryName, this.org);
            contributors = contributors.map((contributor) => contributor.login);
            let outsideContributors = await this.client.getUsers(_lodash.difference(contributors, adobeEmployees));
            outsideContributors = outsideContributors.filter(
                (user) => !user.company || user.company.trim().toLowerCase() !== this.excludeCompany.toLowerCase()
            ).map(user => user.login);
            
            result.push({
                repository: repositoryName,
                outsideContributorsTotal: outsideContributors.length,
                contributorsTotal: contributors.length,
                outsideContributors,
                contributors: contributors
            });
        }
        
        await this.writer.execute(
            `outside-contributors-${this.date.now()}`,
            result.sort((first, second) => second.outsideContributorsTotal - first.outsideContributorsTotal)
        );
    }
}

module.exports = GetOutsideContributors;
