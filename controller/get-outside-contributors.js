const GithubClient = require('~/service/github');
const _lodash = require('lodash');
const Writer = require('~/writer');

class GetOutsideContributors {
    constructor (org = 'adobe', repos = [], excludeCompany = '@adobe', writer) {
        this.org = org;
        this.repos = repos;
        this.excludeCompany = excludeCompany;
        this.client = new GithubClient();
        this.writer = (new Writer()).get(writer);
    }

    async execute () {
        const members = await this.client.getAllOrgMembers(this.org);
        const repos = this.repos.length ? this.repos : await this.client.getAllRepos(this.org);
        const result = [];

        for (const repo of repos) {
            const repositoryName = repo.name || repo;
            let allContributors = await this.client.getAllContributors(repositoryName, this.org);
            allContributors = allContributors.map((contributor) => contributor.login);
            let outsideContributors = await this.client.getUsers(
                _lodash.difference(allContributors, members)
            );
            outsideContributors = outsideContributors.filter(
                (user) => !user.company || user.company.trim() !== this.excludeCompany
            ).map(user => user.login);
            
            result.push({
                repository: repositoryName,
                outsideContributorsTotal: outsideContributors.length,
                contributorsTotal: allContributors.length,
                outsideContributors,
                contributors: allContributors
            });
        }
        await this.writer.execute(
            `get-outside-contributors-${(new Date()).getTime()}`,
            result.sort((first, second) => second.outsideContributorsTotal - first.outsideContributorsTotal)
        );
    }
}

module.exports = GetOutsideContributors;
