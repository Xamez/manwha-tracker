import type { Manwha } from "$lib/types.ts";

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
