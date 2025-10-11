import type { ReadingStatus } from './reading-status';
import type { SortOption, SortOrder } from './sort';

export type Filters = {
  name: string;
  status: ReadingStatus | '';
  favoritesOnly: boolean;
  unratedOnly: boolean;
  minRating: number;
  sortBy: SortOption;
  sortOrder: SortOrder;
};
