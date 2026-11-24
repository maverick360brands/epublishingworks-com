import type { Access } from "payload";

/** Signed-in editors only. Public pages read through the Local API on the server instead. */
export const signedIn: Access = ({ req }) => Boolean(req.user);
