import type { Manwha, ManwhaStatus } from "$lib/types.ts";

export async function incrementManwhaChapter(
  manwhaId: string,
  manwha: Manwha,
): Promise<boolean> {
  try {
    const response = await fetch(`/api/manwhas/${manwhaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: manwha.title,
        note: manwha.note,
        link: manwha.link,
        currentChapter: manwha.currentChapter + 1,
        status: manwha.status,
        rating: manwha.rating,
        startDate: manwha.startDate,
        endDate: manwha.endDate,
      }),
    });

    if (response.ok) {
      return true;
    } else {
      const errorData = await response.json();
      alert(
        "Failed to increment chapter: " +
          (errorData.error || "Unknown error"),
      );
      return false;
    }
  } catch (error) {
    console.error("Increment error:", error);
    alert("Network error occurred while incrementing chapter");
    return false;
  }
}

export type StatusFilter = "all" | ManwhaStatus;

export function filterManwhas(
  manwhas: Manwha[],
  statusFilter: StatusFilter,
  searchQuery: string,
): Manwha[] {
  return manwhas.filter((manwha) => {
    const statusMatch = statusFilter === "all" ||
      manwha.status === statusFilter;

    const searchLower = searchQuery.toLowerCase();
    const searchMatch = searchQuery === "" ||
      manwha.title.toLowerCase().includes(searchLower) ||
      (manwha.note?.toLowerCase().includes(searchLower) ?? false);

    return statusMatch && searchMatch;
  });
}

export function sortManwhasByLastUpdate(manwhas: Manwha[]): Manwha[] {
  return [...manwhas].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });
}