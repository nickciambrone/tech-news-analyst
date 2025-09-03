import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs/promises";
/**
 * Scrape TechCrunch homepage for article links
 */
export async function scrapeTechCrunchHome() {
  const { data: html } = await axios.get("https://techcrunch.com/", {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const $ = cheerio.load(html);
  const links = new Set();

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    if (/^https:\/\/techcrunch\.com\/\d{4}\/\d{2}\/\d{2}\/.+/.test(href)) {
      links.add(href.split("?")[0]); // strip tracking/query params
    }
  });

  return [...links];
}
scrapeTechCrunchHome()
/**
 * Scrape an individual TechCrunch article for story text
 */
async function scrapeArticle(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const $ = cheerio.load(html);

    const storyDiv = $(".entry-content.wp-block-post-content");
    const paragraphs = [];

    storyDiv.find("p").each((_, p) => {
      const text = $(p).text().trim();
      if (text) paragraphs.push(text);
    });

    return { url, story: paragraphs };
  } catch (err) {
    console.error(`Error fetching article ${url}:`, err.message);
    return { url, story: [] };
  }
}

/**
 * Main
 */

export const fetchArticles = async () => {
  const articleLinks = await scrapeTechCrunchHome();
  console.log(`Found ${articleLinks.length} articles.`);

  // Fetch all articles in parallel
  const allStories = await Promise.all(
    articleLinks.map((link) => scrapeArticle(link))
  );
  
  // Save to JSON
  await fs.writeFile("techcrunch_stories.json", JSON.stringify(allStories, null, 2));
  console.log(`Saved ${allStories.length} articles to techcrunch_stories.json`);
  return allStories;
};
