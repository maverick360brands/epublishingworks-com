import { APIError, type CollectionBeforeChangeHook, type CollectionConfig } from "payload";

/**
 * Without a signed-in editor, an account can only be created for ADMIN_SETUP_EMAIL. That
 * closes the window between a deploy and the owner claiming the first account, when anyone
 * who opened /admin/ could otherwise create it. Signed-in editors add everyone else.
 */
const onlySetupEmailWithoutSignIn: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation !== "create" || req.user) return data;
  const allowed = process.env.ADMIN_SETUP_EMAIL?.trim().toLowerCase();
  const email = String(data?.email ?? "").trim().toLowerCase();
  if (!allowed || email !== allowed) {
    throw new APIError("This account is not allowed. The first account must use the email set in ADMIN_SETUP_EMAIL; after that, editors add new users.", 403, undefined, true);
  }
  return data;
};

// People who can sign in to the admin. Everyone is an editor.
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "email", group: "Admin" },
  hooks: { beforeChange: [onlySetupEmailWithoutSignIn] },
  fields: [{ name: "name", type: "text" }],
};
