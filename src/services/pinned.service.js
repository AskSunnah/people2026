// src/services/pinned.service.js
import { API_BASE } from "@/config";


export async function getPinnedSections(lang, { revalidate = 300 } = {}) {
  try {
    const res = await fetch(`${API_BASE}/api/pinned?lang=${lang}`, {
      next: { revalidate },
    });

    if (!res.ok) return { active: false, sections: [] };

    return res.json();
  } catch {
    return { active: false, sections: [] };
  }
}
