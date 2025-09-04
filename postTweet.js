import dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });
import { createTweet, targetArticleUrl } from './generateTweet.ai.js';
import { TwitterApi } from 'twitter-api-v2';
import { addLink } from './firestore.js';

const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
});
async function testAuth() {
    try {
        const me = await client.v2.me();
        console.log('Authenticated as:', me);
    } catch (err) {
        console.error('Auth failed:', err);
    }
}

testAuth();
const rwClient = client.readWrite; // For posting

const postTweet = async (text) => {
    try {
      const response = await rwClient.v2.tweet(text);
      console.log("Tweet posted:", response);
      return response; // ✅ return response if success
    } catch (err) {
      console.error("Error posting tweet:", err);
      return null; // ✅ return null on error
    }
  };
  
  (async () => {
    const tweetText = await createTweet();
    const tweetArticleUrl = targetArticleUrl;
  
    const tweetPostResponse = await postTweet(tweetText);
  
    if (tweetPostResponse) {
      // ✅ Only add link if posting succeeded
      await addLink(tweetArticleUrl);
    } else {
      console.log("Tweet failed, not saving link.");
    }
  })();
  



