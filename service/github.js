const Octokit = require('@octokit/rest').Octokit;
const config = require('dotenv').config();
const CacheManager = require('~/cache-manager');
const { graphql } = require("@octokit/graphql");
const format = require('date-fns/format')

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

    async getPRs (org, repo, state, startDate, endDate) {
        const type = state ? `is:${state}` : ''
        const formatPattern = 'yyyy-MM-dd';
        const sdate = startDate ? format(startDate, formatPattern) : '2018-01-01';
        const edate = endDate ? format(endDate, formatPattern) : format(new Date(), formatPattern);
        let cursor = null;
        let hasNextPage = null;
        let after = '';
        let query = '';
        let response = null;
        let result = [];
        do {
            after = cursor ? `after:"${cursor}"` : '';
            query = `{
                search(first: 100, query: "repo:${org}/${repo} is:pr ${type} created:${sdate}..${edate}", type: ISSUE ${after}) {
                    nodes {
                        ... on PullRequest {
                            title
                            url
                            author {
                                login
                            }
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }`

            response = await graphql(query, {headers: {authorization: `token ${config.parsed.GITHUB_TOKEN}`}});
            hasNextPage = response.search.pageInfo.hasNextPage;
            cursor = response.search.pageInfo.endCursor;
            result = [...result, ...response.search.nodes]
        } while (hasNextPage);

        return result;
    }

    async getIssues (org, repo, state, startDate, endDate) {
        const type = state ? `is:${state}` : ''
        const formatPattern = 'yyyy-MM-dd';
        const sdate = startDate ? format(startDate, formatPattern) : '2018-01-01';
        const edate = endDate ? format(endDate, formatPattern) : format(new Date(), formatPattern);
        let cursor = null;
        let hasNextPage = null;
        let after = '';
        let query = '';
        let response = null;
        let result = [];
        do {
            after = cursor ? `after:"${cursor}"` : '';
            query = `{
                search(first: 100, query: "repo:${org}/${repo} is:issue ${type} created:${sdate}..${edate}", type: ISSUE ${after}) {
                    nodes {
                        ... on Issue {
                            title
                            url
                            author {
                                login
                            }
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }`

            response = await graphql(query, {headers: {authorization: `token ${config.parsed.GITHUB_TOKEN}`}});
            hasNextPage = response.search.pageInfo.hasNextPage;
            cursor = response.search.pageInfo.endCursor;
            result = [...result, ...response.search.nodes]
        } while (hasNextPage);

        return result;
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
