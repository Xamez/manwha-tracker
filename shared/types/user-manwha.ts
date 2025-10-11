import type { ReadingStatus } from './reading-status';
import type { Manwha } from './manwha';

export type UserManwha = {
  id: string;
  userId: string;
  manwha: Manwha;
  status: ReadingStatus;
  score: number | null;
  lastReadChapter: number;
  readingUrl: string | null;
  isFavorite: boolean;
  startedAt: Date;
  lastReadAt: Date;
};
