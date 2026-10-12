# BILIMVERSE AI — Web

Browser-first Kazakh Future Fantasy learning platform for grades 1–4.
Built with Flutter Web, Riverpod and go_router; deployed as static files to Sites.

## Run locally

```powershell
flutter pub get
flutter run -d chrome
```

## Verify and build

```powershell
flutter analyze
flutter test
node scripts/build-web.mjs
```

Release output is `dist/`. The renderer resources and fonts are bundled locally.
Hash routes allow static hosting without rewrite rules: `/#/world`,
`/#/kingdom`, `/#/onboarding`, `/#/settings`.

## Working demo

- Browser welcome page with a 2.6-second portal opening and immediate navigation.
- Five-step onboarding: name, grade, avatar, Qyran and first world.
- Desktop world map plus travel journal; responsive single-column phone website.
- Illustrated yurt, mountains, river, seven landmarks, clouds, birds and fog.
- Two grade-3 math missions. Each has five questions and five review questions
  from a supportive guardian. Other grades are explicitly labeled as forthcoming.
- Hints, retry without lost health, 1–3 stars, reward screen and level-up notice.
- First completion grants 200 XP and 15 Тұмар; repeat play improves stars without
  duplicating rewards. Golden Bridge completion draws a bridge on the map.
- Local profile/settings/progress survive browser reload on the same origin.
- Reduced motion follows both browser/system and saved preferences.

`/preview` retains the original design-system harness. Platform files for Android
remain in the repository, but browser delivery is the active product target.

## Honest limits

Demo data lives in this browser, not a synchronized account. The private Sites
link controls access to the website; it is not student login. Real AI, voice,
OCR, audio, teacher/parent modes and remaining curricula are not implemented.
The guardian reviews the mission questions; generated boss questions and the
more elaborate chest/level-up sequence remain future work. No performance claim
is made without profiling on the intended devices.

See [implementation plan](docs/IMPLEMENTATION_PLAN.md).
Noto Sans is bundled under the license in `assets/fonts/OFL.txt`.
