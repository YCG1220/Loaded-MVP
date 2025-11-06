import { headers } from "next/headers";
import { getEnv } from "./env";

export function assertAdminRequest() {
  const headerStore = headers();
  const secret = headerStore.get("x-admin-secret") ?? headerStore.get("authorization")?.replace("Bearer ", "");
  if (!secret || secret !== getEnv().SESSION_SECRET) {
    throw new Error("Unauthorized admin request");
  }
}
