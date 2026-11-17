---
name: audit
description: Full ASO growth audit of a Google Play app from its public URL — metadata, reputation, competitors, score, prioritized recommendations, proposed new metadata and an organic growth plan. Use when the user asks to analyze, audit or improve the ASO/store listing of an Android app.
argument-hint: <google-play-url>
---

# ASO Growth Audit

## Objective
Understand the app, diagnose its Google Play listing and deliver a prioritized, evidence-backed plan plus proposed metadata. This skill orchestrates the others.

## When to use
User wants an analysis or ASO improvement of an app. Input: `$ARGUMENTS` (Play URL or package id). If missing, ask for the URL and stop.

## Process
1. **Acquire data** following `${CLAUDE_PLUGIN_ROOT}/references/data-acquisition.md` (cascade; evidence labels; never invent). Collect: name, developer, category, short/long description, rating, review count, icon, screenshots, visible reviews, similar apps.
2. **Understand the app**: purpose, value proposition, target user, real features, differentiators. Facts only from evidence; list doubts as questions.
3. **Metadata analysis** against `${CLAUDE_PLUGIN_ROOT}/references/metadata-guidelines.md` and `${CLAUDE_PLUGIN_ROOT}/references/google-play-policies.md`: keyword use, clarity, repetition, structure, policy violations, limits.
4. **Visuals** (only if icon/screenshots were actually seen): clarity, order, text on images, consistency. Otherwise mark não avaliada.
5. **Reputation**: rating, volume, recurring praise/complaints from reviews actually read. Otherwise say none were available.
6. **Competition**: follow the `competitors` skill process (`${CLAUDE_PLUGIN_ROOT}/skills/competitors/SKILL.md`) in compact form, 3–5 verified direct competitors.
7. **Keywords**: follow `${CLAUDE_PLUGIN_ROOT}/skills/keywords/SKILL.md` in compact form (top terms only).
8. **Score** per `${CLAUDE_PLUGIN_ROOT}/references/scoring.md` (dimensions, caps, disclaimer).
9. **Propose metadata**: follow `${CLAUDE_PLUGIN_ROOT}/skills/optimize/SKILL.md` (counts and policy checks mandatory).
10. **Prioritize** actions by impact, effort and evidence confidence; add a 30-day organic growth plan with experiments the user can run in Play Console (store listing experiments).

## Validation
- Every finding carries an evidence label; unread fields say "não disponível".
- No invented competitors, reviews, volumes, features.
- Proposed texts within limits (counted) and policy-clean.
- Score not shown without caps and open critical issues.
- No promises of rankings or installs. Nothing is published; the user reviews and approves.

## Output
Use `${CLAUDE_PLUGIN_ROOT}/references/report-format.md` (audit report). Language: the user's.
