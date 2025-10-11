import type { ReadingStatus } from './reading-status';
import type { SortOption, SortOrder } from './sort';

export type Filters = {
  name: string;
  status: ReadingStatus | '';
  favoritesOnly: boolean;
  minScore: number;
  genre: string;
  sortBy: SortOption;
  sortOrder: SortOrder;
};
