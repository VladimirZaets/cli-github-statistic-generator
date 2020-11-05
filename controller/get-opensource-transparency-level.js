const GithubClient = require('~/service/github');
const Writer = require('~/writer');

class GetOpensourceTransparencyLevel {
    constructor (org = 'adobe', writer) {
        this.org = org;
        this.client = new GithubClient();
        this.writer = (new Writer().get(writer));
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

        for (const repo of repos) {
            if (repo.private) {
                ++result.private.value 
            } else {
                ++result.public.value
            }
        }
        
        
        
        await this.writer.execute(`get-opensource-transparency-level-${this.org}`, Object.values(result));
    }
}

module.exports = GetOpensourceTransparencyLevel;
