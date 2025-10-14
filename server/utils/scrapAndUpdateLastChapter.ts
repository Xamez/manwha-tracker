import * as cheerio from 'cheerio';
import type { Db } from 'mongodb';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  Referer: 'https://demonicscans.org/',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

export async function scrapLastChapter(url: string): Promise<number | null> {
  try {
    const response = await fetch(url, { headers });
    const html = await response.text();

    const $ = cheerio.load(html);
    const firstLi = $('#chapters-list li').first();
    const link = firstLi.find('a');

    link.find('span').remove();
    const chapterText = link.text().trim();
    const chapterNumber = chapterText.replace('Chapter ', '').trim();

    return parseInt(chapterNumber, 10);
  } catch (error) {
    console.error('Error scraping last chapter:', error);
    return null;
  }
}

export async function scrapAndUpdateLastChapter(
  db: Db,
  manwhaId: number,
  readingUrl: string,
  lastAvailableChapter: number,
): Promise<void> {
  console.log(`Processing manwhaId: ${manwhaId}`);
  const lastChapter = await scrapLastChapter(readingUrl);
  if (lastChapter && lastChapter < lastAvailableChapter) {
    await db
      .collection('manwhas')
      .updateOne({ id: manwhaId }, { $set: { lastAvailableChapter: lastChapter } });
    console.log(`Updated manwhaId ${manwhaId} to chapter ${lastChapter}`);
  } else {
    console.log(`No update needed for manwhaId ${manwhaId}`);
  }
}
