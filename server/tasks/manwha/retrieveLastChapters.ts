import { scrapAndUpdateLastChapter } from '~~/server/utils/scrapAndUpdateLastChapter';

export default defineTask({
  meta: {
    name: 'manwha:retrieveLastChapters',
    description: 'Update CMS content',
  },
  async run({ payload: _payload, context: _context }) {
    console.log('Retrieving last chapters...');

    const db = useDatabase();
    const response = await db
      .collection('user_manwhas')
      .find({ readingUrl: { $ne: null } }, { projection: { manwhaId: 1, readingUrl: 1 } })
      .toArray();

    for (const doc of response) {
      const { manwhaId, readingUrl } = doc;
      await scrapAndUpdateLastChapter(db, manwhaId, readingUrl, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { result: 'Success' };
  },
});
