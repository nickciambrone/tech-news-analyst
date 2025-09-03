import { scrapeTechCrunchHome } from './scrapeTechCrunch.js';

// lib/openai.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });
import OpenAI from 'openai';

export const getArticleForTweet = async () => {

  let techCrunchArticles = await scrapeTechCrunchHome();

  const today = new Date();
  const todayFormatted = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10).replace(/-/g, '/');

  techCrunchArticles = techCrunchArticles.filter(link => link.includes(todayFormatted) || link.includes(yesterday));

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const chatResponse = await openai.responses.create({
    model: "gpt-5",
    input: `I am a tech guy with a twitter account. I like analyzing news and trends in tech: ai, fintech, cloud, crypto, startups, and the financial side of tech companies. 
      I am going to provide you a list of article links, your task is to provide me with the article link that would be most interesting to me based on what I just told you. 
      IMPORTANT: You must answer with a string of just the article link. No other text. If no articles would be interesting to me, reply with "none"
      Here are the links: ${techCrunchArticles.join(", ")}`,
  });

  console.log('filter output text: ', chatResponse.output_text);

  return chatResponse.output_text;


}

