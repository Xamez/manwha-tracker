import type { ReadingStatus } from './reading-status';
import type { SortOption, SortOrder } from './sort';

export type Filters = {
  name: string;
  statuses: ReadingStatus[];
  favoritesOnly: boolean;
  unratedOnly: boolean;
  minRating: number;
  sortBy: SortOption;
  sortOrder: SortOrder;
};

export const FILTERS_STORAGE_KEY = 'manhwa-filters';

export const DEFAULT_FILTERS: Filters = {
  name: '',
  statuses: [],
  favoritesOnly: false,
  unratedOnly: false,
  minRating: 0,
  sortBy: 'unreadChapters',
  sortOrder: 'desc',
};
