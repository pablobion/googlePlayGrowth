---
name: optimize
description: Rewrite a Google Play app's title (30 chars), short description (80) and full description (4000) with keyword strategy, policy checks and verified character counts. Use when the user wants better store listing text.
argument-hint: <google-play-url>
---

# Listing Optimization

## Objective
Produce better title, short description and full description than the current ones, grounded in what the app truly does, within official limits.

## Inputs
`$ARGUMENTS` (Play URL; ask if missing). Target market/language: infer from the listing/user; if ambiguous, ask once. Reuse data from an earlier audit/keywords/competitors run in this conversation instead of re-fetching.

## Process
1. Acquire current metadata per `${CLAUDE_PLUGIN_ROOT}/references/data-acquisition.md`. If title or descriptions cannot be read, ask the user to paste them; do not rewrite from guesses.
2. Establish real features and value proposition (evidence only). Ask the user to confirm features if the evidence is thin.
3. Get priority keywords (from earlier results or by running `${CLAUDE_PLUGIN_ROOT}/skills/keywords/SKILL.md` compactly) and the competitive angle (`${CLAUDE_PLUGIN_ROOT}/skills/competitors/SKILL.md`).
4. Write per `${CLAUDE_PLUGIN_ROOT}/references/metadata-guidelines.md`:
   - Title: 3 options (≤30).
   - Short description: 3 options with different angles (≤80).
   - Full description: 1 structured version adapted to the app type (≤4000), plus note of what to confirm.
5. **Validate** each text: count characters exactly (spaces, punctuation, line breaks, emoji), recount after every edit, shorten if over the limit. Check each against `${CLAUDE_PLUGIN_ROOT}/references/google-play-policies.md` (no emoji/caps/promo/rank claims, no banned CTAs in short description, no testimonials, no competitor comparisons, no short-description duplication).
6. Check no feature or promise is invented.

## Output (per field, per `${CLAUDE_PLUGIN_ROOT}/references/report-format.md`)
Versão atual (+count) · Problemas · Nova versão recomendada (+count `N/limit`) · Alternativas · Palavras-chave trabalhadas · Justificativa. Full description in a code block. Finish with: texts are proposals; the user must review and approve before publishing; nothing is changed on Google Play.
