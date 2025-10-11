import type { ReadingStatus } from './reading-status';
import type { SortOption, SortOrder } from './sort';

export type Filters = {
  name: string;
  status: ReadingStatus | '';
  favoritesOnly: boolean;
  minRating: number;
  genre: string;
  sortBy: SortOption;
  sortOrder: SortOrder;
};
