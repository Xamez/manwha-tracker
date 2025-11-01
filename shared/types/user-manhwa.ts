import type { ReadingStatus } from './reading-status';
import type { Manhwa } from './manhwa';

export type UserManhwa = {
  id: string;
  userId: string;
  manhwa: Manhwa;
  status: ReadingStatus;
  rating: number | null;
  lastReadChapter: number;
  readingUrl: string | null;
  isFavorite: boolean;
  startedAt: Date;
  updatedAt: Date;
};
