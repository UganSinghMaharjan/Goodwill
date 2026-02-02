const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`[API] Fetching: ${url}`);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      console.error(`[API] Error ${response.status} from ${url}:`, text);
      throw new Error(`API ${response.status}: ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(`[API] Request timed out for ${endpoint}`);
      throw new Error("Request timed out");
    }
    console.error(`[API] FAILED for ${endpoint}:`, error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
