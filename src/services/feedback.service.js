// src/services/feedback.service.js
import { API_BASE } from "@/config";

export async function getAllFeedback(lang = "en") {
  const res = await fetch(`${API_BASE}/api/feedback?lang=${lang}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch feedback");
  }

  return res.json(); // { success, feedbacks }
}

export async function createFeedback(data) {
  const res = await fetch(`${API_BASE}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to submit feedback");
  }

  return res.json();
}