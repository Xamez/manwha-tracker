<template>
  <div class="flex flex-row gap-10">
    <FilterSidebar class="hidden sm:block" />
    <ManwhaGrid :user-manwhas="userManwhas" />
  </div>
</template>

<script lang="ts" setup>
const m1: UserManwha = {
  id: 1,
  userId: 1,
  status: 'reading',
  score: null,
  lastReadChapter: 5,
  readingUrl: null,
  isFavorite: false,
  startedAt: new Date(),
  lastReadAt: new Date(),
  manwha: {
    id: 1,
    title: "The Dang Clan's Swordmaster Heir Just Wants a Normal Life",
    bannerImage: null,
    coverImage: 'https://cdn.myanimelist.net/images/manga/1/309176.jpg',
    meanScore: null,
    description:
      'The Dang clan of Sacheon, once renowned for its poison and hidden weapons, is now on the path to its demise. That is, until Yeonmyeung Dang, an outcast boy of the clan, awakens by recollecting the memories of his past life as the "god of swords" who devoted his life to mastering the sword. Will the boy be able to protect his family and fulfill his dream of living a normal life?\n\n(Source: Webtoon Entertainment)',
    synonyms: [
      'Becoming the Swordmaster Rank Young Lord of the Sichuan Tang Family',
      'Sacheon Dangga-ui Geomsin-geup Sogaju-ga Doeeotda',
    ],
    genres: ['Action', 'Fantasy', 'Martial Arts', 'Reincarnation'],
    tags: [],
    startDate: null,
  },
};
const m2: UserManwha = {
  id: 2,
  userId: 1,
  status: 'completed',
  score: 10,
  lastReadChapter: 200,
  readingUrl: null,
  isFavorite: true,
  startedAt: new Date('2023-01-01'),
  lastReadAt: new Date('2023-06-01'),
  manwha: {
    id: 2,
    title: 'Solo Leveling',
    bannerImage: 'https://s4.anilist.co/file/anilistcdn/media/manga/banner/105398-4UrEhdqZukrg.jpg',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/222295.jpg',
    meanScore: 85,
    description:
      'In a world where hunters with magical abilities fight deadly monsters to protect humanity, the weakest hunter of all, E-Rank Sung Jin-Woo, finds himself in a perilous situation during a dungeon raid. After narrowly escaping death, he discovers a mysterious system that allows him to level up his abilities beyond their limits. As he embarks on a journey to become the strongest hunter, Jin-Woo must face increasingly dangerous foes and uncover the secrets behind the dungeons and his newfound powers.\n\n(Source: Webtoon Entertainment)',
    synonyms: ['Only I Level Up', 'Na Honjaman Level Up'],
    genres: ['Action', 'Adventure', 'Fantasy'],
    tags: [],
    startDate: new Date(2018, 2, 4), // March 4, 2018
  },
};
const userManwhas = Array.from({ length: 20 }, (_, i) => (i % 2 === 0 ? m1 : m2));
</script>

<style></style>
