const GithubClient = require('~/service/github');
const Writer = require('~/writer');
const DateService = require('~/service/date');

class GetTimeToReact {
    constructor (
        org = 'adobe',
        repos = [],
        state,
        startDate,
        endDate,
        writer
    ) {
        this.org = org;
        this.state = state;
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
            const timelines = {};
            const prs = await this.client.getPRs(
                this.org,
                repositoryName,
                this.state,
                this.startDate,
                this.endDate
            );

            const startEnd = []
            for (const pr of prs) {
                if (!pr.author || pr.author.__typename !== 'User' ) {
                    continue;
                }

                const timeline = await this.client.getPRTimeline(this.org, repositoryName, pr.number);
                const prCreatedAt = (new Date(pr.createdAt)).getTime();
                if (timeline.length) {
                    for (const action of timeline) {
                        const author = action.author || action.actor || {};

                        if (
                            author.__typename === 'User' &&
                            author.login &&
                            author.login !== pr.author.login
                        ) {
                            startEnd.push({
                                start: prCreatedAt,
                                end: (new Date(action.createdAt)).getTime()
                            });
                            break;
                        }
                    }
                } else {
                    startEnd.push({
                        start: prCreatedAt,
                        end: this.date.now()
                    })
                }
            }

            const startEndAvarageCalculated = this.getMinAndMaxAndAvarageReactionTime(startEnd);
            
            result.push({
                repository: repositoryName,
                min: this.date.convertMilisecond(startEndAvarageCalculated.min),
                max: this.date.convertMilisecond(startEndAvarageCalculated.max),
                average: this.date.convertMilisecond(startEndAvarageCalculated.average)
            });
        }

        const stdate = this.startDate ? '-from-' + this.date.format(this.startDate) : ''
        const eddate = this.endDate ? '-to-' + this.date.format(this.endDate) : '';
        await this.writer.execute(
            `time-to-react${stdate}${eddate}-state-${this.state || 'all'}-${this.date.now()}`,
            result
        );
    }

    getMinAndMaxAndAvarageReactionTime (data) {
        const result = {
            min: null,
            max: null,
            average: 0
        }

        data.forEach((item) => {
            const time = item.end - item.start;
            if (!result.min || result.min > time) {
                result.min = time;
            }

            if (!result.max || result.max < time) {
                result.max = time;
            }

            result.average += time;
        });

        result.average = result.average / data.length;

        return result;
    }
}

module.exports = GetTimeToReact;
