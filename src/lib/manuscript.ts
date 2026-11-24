// Manuscript upload rules, shared by the browser form and the upload route.
export const MANUSCRIPT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed",
];
export const MANUSCRIPT_EXTENSIONS = ".pdf,.doc,.docx,.zip";
export const MANUSCRIPT_MAX_BYTES = 20 * 1024 * 1024;

