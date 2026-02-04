export function isLocalhostRequest(req: Request) {
  const host =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

export function isHttpsRequest(req: Request) {
  const proto = req.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim().toLowerCase() === "https";
  return req.url.startsWith("https://");
}
