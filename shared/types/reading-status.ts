export enum READING_STATUS {
  'plan-to-read' = 'Plan to Read',
  reading = 'Reading',
  'on-hold' = 'On-Hold',
  completed = 'Completed',
  dropped = 'Dropped',
}

export type ReadingStatus = keyof typeof READING_STATUS;

// TODO: experiment more with colors later and maybe re-add
// export const READING_STATUS_COLORS: Record<ReadingStatus, string> = {
//   'plan-to-read': '#9ca3af',
//   reading: '#704eff',
//   'on-hold': '#f59e0b',
//   completed: '#059669',
//   dropped: '#ef4444',
// };

export const READING_STATUS_ORDER: Record<ReadingStatus, number> = {
  'plan-to-read': 0,
  reading: 1,
  'on-hold': 2,
  completed: 3,
  dropped: 4,
};
