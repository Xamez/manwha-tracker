export enum READING_STATUS {
  reading = 'Reading',
  completed = 'Completed',
  'on-hold' = 'On-Hold',
  dropped = 'Dropped',
  'plan-to-read' = 'Plan to Read',
}

export type ReadingStatus = keyof typeof READING_STATUS;
