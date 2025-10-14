export enum SORT_OPTIONS {
  status = 'Reading Status',
  unreadChapters = 'Unread Chapters',
  updatedAt = 'Updated At',
  startedAt = 'Started At',
  rating = 'Rating',
  title = 'Title',
  meanScore = 'Mean Score',
}
export type SortOption = keyof typeof SORT_OPTIONS;

export enum SORT_ORDERS {
  asc = 'Ascending',
  desc = 'Descending',
}
export type SortOrder = keyof typeof SORT_ORDERS;
