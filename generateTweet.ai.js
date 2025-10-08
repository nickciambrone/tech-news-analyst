// lib/openai.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });

import { fetchArticles } from './scrapeTechCrunch.js';
import { getArticleForTweet } from './filterTechCrunch.ai.js';
import OpenAI from 'openai';


const getTarget = async () => {
  const targetUrl = await getArticleForTweet();

  const techCrunchArticles = await fetchArticles();

  const targetArticle = techCrunchArticles.find(obj => obj.url === targetUrl);
  return targetArticle;
}



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const targetArticle = await getTarget();
export const targetArticleUrl = targetArticle['url'];
console.log("Target article URL for tweet:", targetArticleUrl);
console.log("Target article for tweet:", targetArticle);
export const createTweet = async () => {

  const chatResponse = await openai.responses.create({
    model: "gpt-5",
    input: `Your task: Read the article that I provide for you, and respond with a tweet that I can post to my twitter/X account. 
Details: 
1. My twitter bio is: “High-quality analysis of tech, finance, and the trends shaping tomorrow”. So you need to assume that role. The tweet needs to be insightful and original.  
2. Make it casual and EXTREMELY human-like. It needs to be IMPOSSIBLE to tell that it was written by ai.
3. Don’t be afraid to think outside of the box (the box being the content in the article). If you can utilize your knowledge on other things to come up with an original, insightful take - that is great. 
4. Give context - don't just dive in, the reader needs to know what your talking about
5. Most important. Be captivating. The tweet needs to suck in people's attention, and analyze it in an almost dumbed-down way so that it is enjoyable to read for people who arent super technical. 
6. Show some personality. You need to sound like a real person.
7. Don't use short choppy fucking sentences. Talk like a human being would. Don't use tildas, and don't overuse hyphens. And stop using the fucking word "moat".
8. Include hashtags (#AI, #TechInvesting, etc.) to tap into trending conversations and boost discoverability. 
9. Very important. You should NOT be using short sentences, this needs to be a thoughtful analysis. 
10. Also most important, at the same time, it should appeal to someone who knows nothing about technology. I WANT YOU TO LITERALLY FUCKING EXPLAIN IT LIKE YOU ARE TALKING TO 13 YEAR OLD. 
11. Do not quote anything from this prompt in the tweet. like don't say anything about it being for a 13 year old for example. there should be no text from this prompt in the tweet
12. make sure it is <280 characters. this is very important. 
Article: ${JSON.stringify(targetArticle)}
`,
  });

  console.log(chatResponse.output_text);
  return chatResponse.output_text;
}








