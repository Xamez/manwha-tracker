import type { Tag } from './tag';

export type Manwha = {
  id: number;
  title: string;
  bannerImage: string | null;
  coverImage: string | null;
  meanScore: number | null;
  description: string;
  synonyms: string[];
  genres: string[];
  tags: Tag[];
  startDate: Date | null;
  // lastAvailableChapter: number; // TODO: this kind of tricky (calculated field but depends on websites from user but is also linked to manwha itself)
};
