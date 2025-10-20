import type { Tag } from './tag';

export type Manwha = {
  id: number;
  title: string;
  bannerImage: string | null;
  coverImage: string | null;
  meanScore: number | null;
  description: string;
  alternativeTitles: string[];
  genres: string[];
  tags: Tag[];
  startDate: Date | null;
  lastAvailableChapter: number | null;
};
