---
name: keywords
description: Keyword research for a Google Play app using only observable evidence (app page, competitors, public search, reviews) — grouped by intent and priority with qualitative estimates, never invented volumes.
argument-hint: <google-play-url>
---

# Keyword Research

## Objective
Find relevant keyword opportunities and say where to use them.

## Inputs
`$ARGUMENTS` (Play URL; ask if missing).

## Process
1. Acquire the app data per `${CLAUDE_PLUGIN_ROOT}/references/data-acquisition.md`.
2. Define the real function, user, scenarios.
3. Gather candidate terms from sources listed in `${CLAUDE_PLUGIN_ROOT}/references/keyword-strategy.md`: app text, competitor metadata (use WebSearch to find real competitors and read their listings if accessible), public search results for the phrases users would type, review wording, search suggestions if available. Cite the evidence label for each.
4. Classify (primary, secondary, long-tail, synonyms) and by intent; discard low-relevance terms even if popular.
5. Prioritize qualitatively; mark all ratings as estimates; note presence in competitor metadata and differentiation opportunities.
6. Recommend placement: title / short / long.

## Validation
No search volume, difficulty or ranking numbers. No competitor brand names as keywords. Terms must be truthful for the app.

## Output
Table `| Keyword | Relevância | Intenção | Prioridade | Evidência | Justificativa |`, grouped by intent/priority, followed by placement recommendations and an explicit note that ratings are estimates. Language: the user's.
