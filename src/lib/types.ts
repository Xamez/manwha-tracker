export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedUser {
  userId: string;
  username: string;
  email: string;
}

export type ManwhaStatus =
  | "reading"
  | "abandoned"
  | "to-continue"
  | "completed";

export const VALID_MANWHA_STATUSES: ManwhaStatus[] = [
  "reading",
  "abandoned",
  "to-continue",
  "completed",
];

export interface Manwha {
  _id?: string;
  userId: string;
  title: string;
  note?: string;
  link?: string;
  currentChapter: number;
  lastReadAt: Date;
  startDate: Date;
  endDate?: Date;
  status: ManwhaStatus;
  rating?: number;
  tags?: string[];
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddManwhaRequest {
  title?: string;
  note?: string;
  link?: string;
  currentChapter: number;
  status: ManwhaStatus;
  rating?: number;
  startDate: string;
  endDate?: string;
}

export interface UpdateManwhaRequest extends AddManwhaRequest {}

export interface ManwhaStats {
  total: number;
  reading: number;
  completed: number;
  toContinue: number;
  abandoned: number;
  totalChaptersRead: number;
  estimatedReadingHours: number;
}

export function isValidManwhaStatus(status: string): status is ManwhaStatus {
  return VALID_MANWHA_STATUSES.includes(status as ManwhaStatus);
}

export function formatManwhaStatus(status: ManwhaStatus): string {
  switch (status) {
    case "to-continue":
      return "To Continue";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export function getManwhaStatusColor(status: ManwhaStatus): string {
  switch (status) {
    case "reading":
      return "bg-green-900/30 text-green-400 border-green-700";
    case "completed":
      return "bg-blue-900/30 text-blue-400 border-blue-700";
    case "to-continue":
      return "bg-yellow-900/30 text-yellow-400 border-yellow-700";
    case "abandoned":
      return "bg-red-900/30 text-red-400 border-red-700";
    default:
      return "bg-gray-800/30 text-gray-400 border-gray-600";
  }
}
