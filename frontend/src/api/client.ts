export async function fetchText(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init);
  return response.text();
}

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init);
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}
