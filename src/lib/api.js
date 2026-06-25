const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

/**
 * Generic API request helper
 * @param {string} endpoint - API route (e.g., '/artworks')
 * @param {object} [options] - Fetch configurations (method, body, headers)
 * @param {object} [params] - Optional query parameters object
 */
export async function apiRequest(endpoint, options = {}, params = null) {
  // 1. Build URL with query parameters if provided
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    if (queryString) url += `?${queryString}`;
  }

  // 2. Set default configuration headers
  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  // 3. Execute request safely
  try {
    const response = await fetch(url, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP error! Status: ${response.status}`);
    }

    return result; // Returns { success: true, data: [...] } from your backend
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// Reusable Endpoint Service Matrix
export const apiService = {
  // Artworks
  getArtworks: (params) => apiRequest("/artworks", { method: "GET" }, params),
  getApprovedArtworks: (params) => apiRequest("/artworks", { method: "GET" }, { ...params, approvedOnly: "true" }),
  createArtwork: (artworkData) => apiRequest("/artworks", { method: "POST", body: artworkData }),
  updateArtwork: (id, artworkData) => apiRequest(`/artworks/${id}`, { method: "PUT", body: artworkData }),
  updateArtworkStatus: (artId, status) => apiRequest("/artworks", { method: "PATCH", body: { status } }, { artId }),
  deleteArtwork: (id) => apiRequest(`/artworks/${id}`, { method: "DELETE" }),
  getUser:(params)=>apiRequest("/user", { method: "GET" }, params),
  // Orders & Sales History
  getMyOrders: (email) => apiRequest("/my-orders", { method: "GET" }, { email }),
  getAllOrders: () => apiRequest("/admin/transactions", { method: "GET" }),
  getSalesHistory: (artistId) => apiRequest("/sales-history", { method: "GET" }, { artistId }),
  
  // Subscriptions & Plans
  getPlans: (planId) => apiRequest("/plans", { method: "GET" }, { planId }),
  createSubscription: (subData) => apiRequest("/subscriptions", { method: "POST", body: subData }),
  
  // Reviews & Feedback
  getReviews: (params) => apiRequest("/reviews", { method: "GET" }, params),
};