import Twitter from 'twitter';

class TwitterService {
    tweet(text, media) {
        let client = createClient();

        if (media) {
            return client.post('media/upload', {
                media: media
            }).then(media => client.post('statuses/update', {
                status: text,
                media_ids: media.media_id_string
            }));
        }
        else {
            return client.post('statuses/update', {
                status: text
            });
        }
    }
};

function createClient() {
    return new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });
}

export default new TwitterService();