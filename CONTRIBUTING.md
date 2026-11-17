# Contributing

- Skills live in `skills/<name>/SKILL.md`; shared rules in `references/`. Put a rule in one place and link to it; do not duplicate.
- Do not add an MCP server, scraper, backend, required API key or paid-service dependency.
- Policy/limit changes must cite the official Google URL and update the verification date in `references/google-play-policies.md`.
- Never add instructions that allow inventing data (volumes, competitors, reviews, features).
- Test: `claude plugin validate . --strict`, then `claude --plugin-dir .` in a clean session and run each command on a real app, checking counts by hand.
