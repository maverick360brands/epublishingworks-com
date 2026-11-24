import { APIError, type CollectionBeforeDeleteHook } from "payload";

/** Authors can't be deleted while books still list them, which would leave books without an author. */
export const blockAuthorDeleteWithBooks: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const { totalDocs } = await req.payload.count({ collection: "books", where: { authors: { in: [id] } }, req });
  if (totalDocs > 0) throw new APIError("This author still has books. Reassign or delete their books first.", 400, undefined, true);
};
