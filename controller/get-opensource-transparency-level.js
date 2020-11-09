const GithubClient = require('~/service/github');
const Writer = require('~/writer');
const DateService = require ('~/service/date');

class GetOpensourceTransparencyLevel {
    constructor (org = 'adobe', writer) {
        this.org = org;
        this.client = new GithubClient();
        this.writer = (new Writer().get(writer));
        this.date = new DateService();
    }

    async execute () {
        const repos = await this.client.getAllRepos(this.org);
        const result = {
            public: {
                type: 'public',
                value: 0
            },
            private: {
                type: 'private',
                value: 0
            }
        };

        repos.forEach((repo) => repo.private ? ++result.private.value :++result.public.value);
        await this.writer.execute(
            `opensource-transparency-level-${this.org}-${this.date.now()}`, 
            Object.values(result)
        );
    }
}

module.exports = GetOpensourceTransparencyLevel;
