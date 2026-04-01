const API_BASE_URL = "https://backend-for-salaon.onrender.com/api"

/**
 * Standard fetch helper that includes authorization headers for admin requests
 * and standardizes JSON error formats.
 */
export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem("leela_admin_token")

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // Try to parse JSON response. Some responses (like 204 or plain text) might not be JSON.
  let data
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized: clear token
      localStorage.removeItem("leela_admin_token")
      sessionStorage.removeItem("leela_admin_auth") // legacy cleanup
    }

    // Fallback error format if backend doesn't send defined error shapes
    const errorMsg = typeof data === 'object' && data.reason
      ? data.reason
      : (typeof data === 'object' && data.message
        ? data.message
        : "An unexpected error occurred.")

    const errorCode = typeof data === 'object' && data.code ? data.code : "SERVER_ERROR"
    const errorField = typeof data === 'object' && data.field ? data.field : "general"

    throw { status: response.status, message: errorMsg, code: errorCode, field: errorField }
  }

  return data
}
