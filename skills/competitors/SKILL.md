---
name: competitors
description: Identify real direct competitors of a Google Play app and compare metadata, positioning, features, visuals and reputation to find differentiation opportunities.
argument-hint: <google-play-url>
---

# Competitor Analysis

## Objective
Show how the app is positioned against real, relevant alternatives and where it can differentiate.

## Inputs
`$ARGUMENTS` (Play URL; ask if missing).

## Process
1. Acquire the app's data per `${CLAUDE_PLUGIN_ROOT}/references/data-acquisition.md`.
2. Find candidates: the page's similar apps (if read), WebSearch for the main user-intent phrases, "best apps for <need>" results. Never name an app you have not seen in results; verify each exists (Play URL or official site).
3. Select 3–5 **direct** competitors by product similarity, target user and search intent; do not assume same category = competitor. Explain each choice, and name who was excluded and why when relevant.
4. For each, read what is accessible (title, short/long description, rating, reviews count, icon/screenshots). Mark unavailable fields "não disponível".
5. Compare: title, short, long, recurring terms, value proposition, features, visuals, rating/volume, positioning.
6. Conclude: what competitors do better/worse, frequent terms and promised benefits, differentiation gaps, how the app should position itself. Separate facts from hypotheses with evidence labels.

## Output
Comparison table + findings + recommended positioning statement. Competitors' text is analyzed, never copied into proposed metadata. Language: the user's.
