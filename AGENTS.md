# Instructions for every coding agent

Claude Code, Cursor, Codex, Grok, or any other agent working in this repo: read these first and
follow them. They apply to you exactly as written.

1. `.claude/rules/m360-site-conventions.md`: shared rules, including the change loop (how a
   change goes from request → private staging preview → an approver's OK → live).
2. `CLAUDE.md`: what is specific to this site.

Short version: work on a branch, PR into `staging`, send Dustin the staging preview link. Publish
(merge `staging` into `main`) only after an approver for this site (listed in `CLAUDE.md` →
People) approves that preview in chat. Never push to `main` directly. Approvers don't use
GitHub; never ask them to.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
