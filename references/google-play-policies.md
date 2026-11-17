# Google Play listing limits and metadata policy

Verified against official Google pages on **2026-11-17**. Google updates policies often (the policy hub announced an update dated 2026-10-29). Before relying on any rule, re-check the source; if it disagrees with this file, the source wins and this file must be updated.

## Character limits

| Field | Limit | Source |
|---|---|---|
| App title | 30 | https://support.google.com/googleplay/android-developer/answer/9898842 |
| Short description | 80 | https://support.google.com/googleplay/android-developer/answer/9866151 |
| Full description | 4,000 | https://support.google.com/googleplay/android-developer/answer/13393723 |
| Graphic alt text | 140 | answer/9866151 |

Developer-name limit: not confirmed from official pages. Do not state one.

## Graphic requirements (answer/9866151)
- Icon: 32-bit PNG with alpha, 512x512 px, max 1024 KB.
- Feature graphic: JPEG or 24-bit PNG (no alpha), 1024x500 px, required.
- Screenshots: min 2, max 8 per device type; JPEG or 24-bit PNG (no alpha); each side 320–3840 px, long side at most 2x the short side.
- Eligible for recommendation surfaces (apps): at least 4 screenshots, 1080 px min, 16:9 or 9:16.
- Tagline text must not take more than 20% of an image.
- Localize graphics that contain text, per language.

## Metadata policy (answer/9898842, answer/13393723)
Title, icon and developer name:
- No emojis, emoticons or repeated special characters.
- No ALL CAPS unless part of the brand name.
- No ranking/performance claims ("#1", "Best of Play", "Top", "Popular", award icons).
- No price/promo text ("Free", "No Ads", "10% off", "Sale").
- No reference to Google Play programs ("Editor's Choice", "New").

Short description:
- No special characters, line breaks, emojis, symbols (★ ☆), repeated punctuation, emphasis caps.
- Avoid "Best", "#1", "Top", "New", "Discount", "Sale", "Million Downloads".
- Avoid install calls to action: "download now", "install now", "play now", "try now".

Descriptions (all):
- No repetitive or unrelated keywords (keyword stuffing); no special characters/caps to manipulate ranking.
- No unattributed or anonymous user testimonials.
- Do not repeat the short description inside the full description.
- Do not compare the app to other apps.
- Keep listing suitable for a general audience.
- Policy applies to every translation.

## Localization / custom listings (answer/9867158)
- Up to 50 custom store listings; can customize name, icon, descriptions, graphics.
- Custom listings are not auto-translated; add translations for target-country languages.

## Implication for GooglePlayGrowth
"Encourage installation" must be done through benefit-led copy, not banned CTAs in the short description. Every generated title/short/long text must be checked against this file before delivery.
