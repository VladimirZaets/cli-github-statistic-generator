const Octokit = require('@octokit/rest').Octokit;
const config = require('dotenv').config();
const CacheManager = require('~/cache-manager');

class Github {
    constructor () {
        this.cacheManager = new CacheManager();
        this.client = new Octokit({
            auth: config.parsed.GITHUB_TOKEN
        });
    }
    async getAllRepos (organization, force = false) {
        console.log(`Getting repositories list`);
        const key = 'all-repos';

        console.log(1);
        if (!force && this.cacheManager.isExist(key)) {
            return this.cacheManager.get(key);
        }

        const perPage = 100;
        let i = 0;
        let repos = [];
        let temporary;
        do {
            temporary = await this.client.repos.listForOrg({
                org: organization,
                per_page: perPage,
                page: ++i,
            }).then((res) => {
                return res['data'] || {};
            }).catch((error) => {
                console.log('Error occurred during getting repositories: ' + error);
                throw error;
            });

            repos = [...repos, ...temporary];
        } while (temporary.length === perPage);

        const result = repos.filter((repo) => repo.archived === false && repo.fork === false);
        this.cacheManager.set(key, result);
        return result;
    }

    async getUsers(logins) {
        console.log(`Getting users`);
        const result = [];
        for (const username of logins) {
            result.push(
                await this.client.users.getByUsername({username}).then((res) => res.data || {})
            )
        }
        
        return result;
    }

    async getAllContributors (repository, org) {
        console.log(`Getting contributors list`);
        const perPage = 100;
        let i = 0;
        let repos = [];
        let temporary;
        do {
            temporary = await this.client.repos.listContributors({
                owner: org,
                repo: repository,
                per_page: perPage,
                page: ++i
            }).then((res) => {
                return res['data'] || [];
            }).catch((error) => {
                console.log('Error occurred during getting contributors: ' + error);
                throw error;
            });

            repos = [...repos, ...temporary];
        } while (temporary.length === perPage);

        return repos;
    }
    async getAllTeamMembers (org, team) {
        console.log(`Getting team members list`);
        let i = 0;
        const perPage = 100;
        let members = [];
        let temporary;
        do {
            temporary = await this.client.teams.listMembersInOrg({
                org: org,
                team_slug: team,
                per_page: perPage,
                page: ++i
            }).then((res) => {
                return res['data'] || {};
            }).catch((error) => {
                console.log('Error occurred during getting team members list: ' + error);
                throw error;
            });

            members = [...members, ...temporary];
        } while (temporary.length === perPage);

        return members.map((member) => member.login);
    }

    async getAllOrgMembers (org, force = false) {
        console.log(`Getting team members list`);
        const key = `${org}-members`;

        if (!force && this.cacheManager.isExist(key)) {
            return this.cacheManager.get(key);
        }

        let i = 0;
        const perPage = 100;
        let members = [];
        let temporary;
        do {
            temporary = await this.client.orgs.listMembers({
                org: org,
                per_page: perPage,
                page: ++i
            }).then((res) => {
                return res['data'] || {};
            }).catch((error) => {
                console.log('Error occurred during getting team members list: ' + error);
                throw error;
            });

            members = [...members, ...temporary];
        } while (temporary.length === perPage);

        const result = members.map((member) => member.login);
        this.cacheManager.set(key, result);
        return result;
    }
    async getAllPRs (org, repo, state, sort, direction) {
        console.log(`Getting PRs list`);
        let i = 0;
        const perPage = 100;
        let prs = [];
        let temporary;
        do {
            temporary = await this.client.pulls.list({
                owner: org,
                repo: repo,
                per_page: perPage,
                state,
                sort,
                direction,
                page: ++i
            }).then((res) => {
                return res['data'] || {};
            }).catch((error) => {
                console.log('Error occurred during getting prs list: ' + error);
                throw error;
            });

            prs = [...prs, ...temporary];
        } while (temporary.length === perPage);

        return prs;
    }
    async getAllIssues (org, repo, state, sort, direction) {
        console.log(`Getting Issues list`);
        const perPage = 100;
        let i = 0;
        let issues = [];
        let temporary;
        do {
            temporary = await this.client.issues.listForRepo({
                owner: org,
                repo: repo,
                per_page: perPage,
                state,
                sort,
                direction,
                page: ++i
            }).then((res) => {
                return res['data'] || {};
            }).catch((error) => {
                console.log('Error occurred during getting prs list: ' + error);
                throw error;
            });

            issues = [...issues, ...temporary];
        } while (temporary.length === perPage);

        return issues;
    }
    async getFile (org, repo, file) {
        return await this.client.repos.getContent({
            owner: org,
            path: file,
            repo,
        }).then((res) => {
            return res['data'] || {};
        }).catch((error) => {

        });
    }
    async getCommitActivityStats(org, repo) {
        return await this.client.repos.getCommitActivityStats({
            owner: org,
            repo,
        }).then((res) => {
            return res['data'] || {};
        }).catch((error) => {

        });
    }
}

module.exports = Github;
