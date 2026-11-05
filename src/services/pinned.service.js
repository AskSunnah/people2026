
import { API_BASE } from "@/config";

export async function getPinnedSections(lang) {
  try {
    const res = await fetch(`${API_BASE}/api/pinned?lang=${lang}`, {
      cache: "no-store",
    });

    if (!res.ok) return { active: false, sections: [] };

    return res.json();
  } catch (error) {
    console.error("Failed to fetch pinned sections:", error);
    return { active: false, sections: [] };
  }
}
