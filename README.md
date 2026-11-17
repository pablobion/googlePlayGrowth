# GooglePlayGrowth

**Optimize. Analyze. Grow.**

Open-source AI-powered ASO optimization plugin for Claude Code. Google Play only (v0.1).

> Not affiliated with, endorsed by or sponsored by Google. "Google Play" is a trademark of Google LLC.

## What it solves
Writing a Google Play listing that ranks and converts needs keyword research, competitor reading and strict policy/character-limit checks. GooglePlayGrowth makes Claude Code do that investigation for your app and propose better title, short description and full description, with the reasoning.

No MCP server, no scraper, no backend, no API key, no sign-up. It uses Claude Code's own web search, fetch, browser and image-reading tools.

## Install
```
/plugin marketplace add <github-user>/googleplaygrowth
/plugin install playgrowth@googleplaygrowth
```
Local development: `claude --plugin-dir ./googleplaygrowth`, then `/reload-plugins`.

## Commands (v0.1 MVP)
| Command | What it does |
|---|---|
| `/playgrowth:audit <url>` | Full ASO audit: diagnosis, heuristic score, competitors, priorities, new metadata, 30-day growth plan |
| `/playgrowth:optimize <url>` | Title (30), short description (80), full description (4000) with counts and justification |
| `/playgrowth:keywords <url>` | Keyword opportunities by intent and priority (qualitative, no invented volumes) |
| `/playgrowth:competitors <url>` | Real direct competitors compared on metadata, positioning and visuals |

Planned (v0.2): `reviews`, `visual-audit`, `strategy`.

Example: `/playgrowth:audit https://play.google.com/store/apps/details?id=com.example.app`

## Limitations — read this
- Google Play pages render with JavaScript; plain page fetch often returns almost nothing. The plugin tries, in order: Claude's native browser tools (built-in browser / Claude in Chrome) if available, then web fetch/search, then asks you to paste your listing text and screenshots. For best results, enable a browser tool.
- Anything not read is reported as "não disponível" — never guessed.
- No search-volume or ranking data. Keyword priorities are qualitative estimates.
- The score is a GooglePlayGrowth heuristic, not an official Google rating or a ranking/installs prediction.
- Nothing is published for you. Review every text before using it. Character limits and policies are in `references/google-play-policies.md` (verified 2026-11-17); Google changes them, so recheck.

## Contributing / License
See [CONTRIBUTING.md](CONTRIBUTING.md). MIT — see [LICENSE](LICENSE).
