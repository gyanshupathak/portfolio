import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server-only check for a file under `public/`.
 *
 * Components use the result to render their styled fallback straight away
 * instead of requesting a file that is not there yet, which would log a 404
 * in the browser console. Client-side `onError` handling stays in place as a
 * second line of defence for files that exist but fail to decode.
 */
export function mediaExists(publicPath: string): boolean {
  const segments = publicPath.split("/").filter(Boolean);
  return existsSync(path.join(process.cwd(), "public", ...segments));
}
