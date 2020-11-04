const GithubClient = require('~/service/github');
const _lodash = require('lodash');
const JSONWriter = require('~/writer/json');

class GetOutsideContributors {
    constructor (org, repos, employeeTeam) {
        this.org = org || 'adobe';
        this.repos = repos || [];
        this.employeeTeam = employeeTeam || 'all-adobe';
        this.client = new GithubClient();
        this.JSONwriter = new JSONWriter();
    }

    async execute () {
        const members = await this.client.getAllOrgMembers(this.org);
        const repos = await this.client.getAllRepos(this.org);
        const result = [];

        for (const repo of repos) {
            let allContributors = await this.client.getAllContributors(repo);
            allContributors = allContributors.map((contributor) => contributor.login);
            const outsideContributors = _lodash.difference(allContributors, members);
            result.push({
                repository: repo.name,
                outsideContributorsTotal: outsideContributors.length,
                contributorsTotal: allContributors.length,
                outsideContributors,
                contributors: allContributors
            });
        }
        await this.JSONwriter.execute(
            'get-outside-contributors-all-repos',
            result.sort((first, second) => second.outsideContributorsTotal - first.outsideContributorsTotal)
        );
    }
}

module.exports = GetOutsideContributors;
