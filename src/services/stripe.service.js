// src/services/stripe.service.js
import { API_BASE } from "@/config";

export async function createCheckoutSession(data) {
  const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    
    body: JSON.stringify({
      ...data,
      origin: window.location.origin, // e.g. https://asksunnah.com
    }),
  });

  const contentType = res.headers.get("content-type");

  if (!res.ok || !contentType?.includes("application/json")) {
    const errorText = await res.text();
    console.error("Checkout session error response:", errorText);
    throw new Error("Failed to create checkout session.");
  }

  return res.json();
}

export async function createPortalSession(customerId) {
  const res = await fetch(`${API_BASE}/api/create-portal-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId }),
  });

  const contentType = res.headers.get("content-type");

  if (!res.ok || !contentType?.includes("application/json")) {
    const errorText = await res.text();
    console.error("Portal session error response:", errorText);
    throw new Error("Failed to create portal session.");
  }

  return res.json();
}

export async function getCheckoutSession(sessionId) {
  const res = await fetch(`${API_BASE}/api/session/${sessionId}`);

  if (!res.ok) {
    throw new Error("Failed to retrieve checkout session.");
  }

  return res.json();
}