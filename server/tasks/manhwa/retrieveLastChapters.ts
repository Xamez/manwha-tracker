import { scrapAndUpdateLastChapter } from '~~/server/utils/scraper';

export default defineTask({
  meta: {
    name: 'manhwa:retrieveLastChapters',
    description: 'Update CMS content',
  },
  async run({ payload: _payload, context: _context }) {
    console.log('Retrieving last chapters...');

    const db = useDatabase();
    const response = await db
      .collection('user_manhwas')
      .find({ readingUrl: { $ne: null } }, { projection: { manhwaId: 1, readingUrl: 1 } })
      .toArray();

    for (const doc of response) {
      const { manhwaId, readingUrl } = doc;
      await scrapAndUpdateLastChapter(db, manhwaId, readingUrl, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { result: 'Success' };
  },
});
