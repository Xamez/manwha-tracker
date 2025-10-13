export enum READING_STATUS {
  'plan-to-read' = 'Plan to Read',
  reading = 'Reading',
  'on-hold' = 'On-Hold',
  completed = 'Completed',
  dropped = 'Dropped',
}

export type ReadingStatus = keyof typeof READING_STATUS;

export const READING_STATUS_ORDER: Record<ReadingStatus, number> = {
  'plan-to-read': 0,
  reading: 1,
  'on-hold': 2,
  completed: 3,
  dropped: 4,
};
