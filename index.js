const {ETwitterStreamEvent} = require("twitter-api-v2");
const {TwitterApi} = require('twitter-api-v2');
require('dotenv').config()

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

// const keywords = ['solana', 'avalanche', 'bitcoin', 'ethereum'];
const keywords = process.env.TWITTER_KEYWORDS.split(',');

(async () => {
    try {
        console.log(`Streaming Tweets for keywords: ${keywords.join(', ')}`);
        const rules = await client.v2.streamRules();
        if (rules.data && rules.data.length) {
            await client.v2.updateStreamRules({
                delete: {ids: rules.data.map(rule => rule.id)},
            });
        }

        await client.v2.updateStreamRules({
            add: keywords.map((keyword) => {
                return {'value': keyword}
            }),
        });

        const stream = await client.v2.searchStream({
            'tweet.fields': ['author_id', 'lang', 'text', 'created_at'],
            'user.fields': ['name', 'username'],
            expansions: ['author_id'],
        });

        stream.autoReconnect = true;

        stream.on(ETwitterStreamEvent.Data, async tweet => {
            console.log('-'.repeat(150));
            console.log(tweet.data.created_at);
            console.log('-'.repeat(150));
            console.log(tweet.data.text);
            console.log('-'.repeat(150));

            if (tweet.data.text.indexOf('solana') > 0) {
                // incr counter label solana
            }
        });
    } catch (e) {
        console.error(e);
    }
})()
