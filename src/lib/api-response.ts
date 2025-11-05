export function jsonResponse<T>(data: T, init?: number | ResponseInit) {
  return Response.json(data, init);
}

export function errorResponse(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : "Unknown error";
  return Response.json({ error: message }, { status });
}
