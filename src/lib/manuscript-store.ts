// Server-side only: the private manuscripts store. The browser form imports src/lib/manuscript.ts
// (file types and size), never this file, so the token reader stays out of client code.
/**
 * Manuscripts go to their own private Blob store, not the public one that serves covers. A file
 * can only be read through /api/manuscript/file/, by an editor signed in to the admin. Vercel sets
 * this token when that store is connected to the project with the env prefix MANUSCRIPTS.
 */
export const manuscriptToken = () => process.env.MANUSCRIPTS_READ_WRITE_TOKEN ?? "";
export const manuscriptUploadsEnabled = () => Boolean(manuscriptToken());

const NAME = /^manuscripts\/[A-Za-z0-9._-]+$/;
/** A path the download route may serve: a file directly under manuscripts/. */
export const isManuscriptPath = (path: string) => NAME.test(path) && !path.includes("..");

const PRIVATE_URL = /^https:\/\/[a-z0-9-]+\.private\.blob\.vercel-storage\.com\/(manuscripts\/[^/?#]+)$/;
/** The file's path in the private store, from the URL the browser upload returned; "" for anything else. */
export function manuscriptPath(url: string): string {
  const path = PRIVATE_URL.exec(url)?.[1] ?? "";
  return isManuscriptPath(path) ? path : "";
}

/** Where the submission email links: the editor-only download route on the host the form was sent from. */
export const manuscriptLink = (origin: string, path: string) => `${origin}/api/manuscript/file/?path=${encodeURIComponent(path)}`;
