export enum SORT_OPTIONS {
  lastReadAt = 'Last Read At',
  startedAt = 'Started At',
  score = 'Score',
  title = 'Title',
  meanScore = 'Mean Score',
}
export type SortOption = keyof typeof SORT_OPTIONS;

export enum SORT_ORDERS {
  asc = 'Ascending',
  desc = 'Descending',
}
export type SortOrder = keyof typeof SORT_ORDERS;
