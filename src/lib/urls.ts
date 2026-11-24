import { site } from "./site";

/** Site paths become absolute URLs; URLs that are already absolute (Blob images) stay as they are. */
export const absoluteUrl = (pathOrUrl: string) => (/^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${site.url}${pathOrUrl}`);
