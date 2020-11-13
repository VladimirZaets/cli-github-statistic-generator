const GithubClient = require('~/service/github');
const _lodash = require('lodash');
const Writer = require('~/writer');
const DateService = require('~/service/date');
const employeesEncrypted = require('~/static/employees.json');
const CryproService = require('~/service/crypto');
const config = require('dotenv').config();

class GetOutsideContributors {
    constructor (org = 'adobe', repos = [], excludeCompany = '@adobe', writer) {
        this.org = org;
        this.repos = repos;
        this.excludeCompany = excludeCompany;
        this.client = new GithubClient();
        this.writer = (new Writer()).get(writer);
        this.date = new DateService();
        this.crypto = new CryproService();
        this.employees = this.crypto.decryptJSON(employeesEncrypted, config.parsed.SECRET);
    }

    async execute () {
        const repos = this.repos.length ? this.repos : await this.client.getAllRepos(this.org);
        const result = [];

        for (const repo of repos) {
            const repositoryName = repo.name || repo;
            let contributors = await this.client.getAllContributors(repositoryName, this.org);
            contributors = contributors.map((contributor) => contributor.login);
            let outsideContributors = await this.client.getUsers(_lodash.difference(contributors, this.employees));
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
