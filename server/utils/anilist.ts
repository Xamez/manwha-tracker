export async function fetchAniListDetails(id: number) {
  const graphqlQuery = `
    query($id: Int)  {
      Media(id: $id)  {
        id
        title {
          english
        }
        bannerImage
        description
        coverImage {
          large
        }
        synonyms
        genres
        meanScore
        tags {
          name
          description
        }
        startDate {
          year
          month
          day
        }
      }
    }
  `;

  const variables = {
    id,
  };

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables,
      }),
    });

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Failed to fetch from AniList API',
      });
    }

    const data = await response.json();

    if (data.errors) {
      throw createError({ statusCode: 500, statusMessage: 'AniList API returned errors' });
    }

    const media = data.data.Media;

    let startDate: Date | null = null;
    if (media.startDate?.year) {
      const year = media.startDate.year;
      const month = media.startDate.month || 1;
      const day = media.startDate.day || 1;
      startDate = new Date(year, month - 1, day);
    }

    return {
      id: media.id,
      title: media.title?.english || '',
      bannerImage: media.bannerImage,
      coverImage: media.coverImage?.large,
      meanScore: media.meanScore,
      description: media.description || '',
      synonyms: media.synonyms || [],
      genres: media.genres || [],
      tags: media.tags || [],
      startDate,
    };
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch manga details' });
  }
}
