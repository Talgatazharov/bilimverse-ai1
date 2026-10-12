# BILIMVERSE AI

## Web direction — current delivery

The user changed the target from mobile app to website and explicitly requested
a private Sites URL. Flutter Web preserves the original Flutter/Dart investment.
Wide screens use website navigation and a map/journal split at 1050px; phones
receive a responsive website. Desktop content grows up to 1440px.

Implemented since Stage 1: animated browser welcome, five-step onboarding,
persisted name/grade/avatar, illustrated interactive world with seven landmarks,
local math mission selection, five tasks followed by five guardian review tasks,
supportive hints, reward screen, stars and idempotent completion. A completed
Golden Bridge mission adds an actual painted bridge to the world.

Routes: /, /onboarding, /world, /kingdom, /mission/:id, /settings and /preview.
go_router uses hash URLs on web, so direct links survive reload on static hosts.
Repository contents are not replaced by a second frontend. The Sites manifest
is .openai/hosting.json; scripts/build-web.mjs produces the static dist/ bundle.
Node package.json is a build adapter, not a JavaScript application dependency.

New folders: features/onboarding, features/home_world, features/subjects,
features/missions. app/router.dart owns routes and transition behavior.
Qyran and avatar are code-native vector art with no missing asset references.

Schema 1 adds optional avatar and onboardingComplete keys with safe defaults
for old saves. First mission completion awards configured task+mission+boss XP;
replays update only the best star result. Settings and rewards commit before
the visible state changes. Per-browser local storage is not multi-device or
multi-tab transactional account storage; a backend remains a later stage.

Remaining: remaining subject content and mini-game formats, true AI services,
auth, parent/teacher modes, generated boss tasks, elaborate chest animations,
full-screen level-up sequence, daily quests and complete achievements. The
current celebration and guardian are functional foundations for those features.
The earlier staged plan below remains the broader roadmap, not a claim that
all items in a stage have shipped.

## Repository audit

The starting project was the stock Flutter counter app (lib/main.dart), one
counter test, Android and Web targets. Dart constraint: ^3.13.4. No AGENTS.md or
Git metadata was found. Existing platform configuration is retained.

## Delivery stages

1. **Foundation (current):** design tokens, bundled Kazakh font, accessible game
   components, Riverpod composition, go_router, models, local repository,
   versioned persistence, configurable XP, settings, sound/speech contracts.
   The launch screen is an explicitly labeled design preview, not Home World.
2. **Enter the world:** 2–3 second skippable portal opening, avatar onboarding,
   animated scrollable world, six subject regions, fog and math kingdom.
3. **Playable vertical slice:** five math challenges, supportive hints, guardian
   boss, full-screen celebration, idempotent reward transaction, XP animation,
   chest, persistent map unlock. Verify restart and replay without double rewards.
4. **Curriculum:** reusable mini-game engine, 45 reviewed questions (math 10,
   Kazakh 10, literature/science/world knowledge/English/digital 5 each), content
   repository, grade-aware content. Do not scatter shallow screens before stage 3.
5. **Companions and worlds:** local tutor/adaptive adventures, pet progression,
   personal village, achievements and supportive daily quests; scanner demo.
6. **Adults:** separate teacher and parent navigation, generator and analytics.
7. **Integration:** Firebase/REST repository, authenticated roles, real AI/OCR/
   speech/audio adapters, accessibility review and device performance profiling.

Each stage: format, flutter analyze, relevant flutter tests, visual review.
Android build/device profiling before delivery of the playable slice.

## Structure and ownership

```text
lib/
  main.dart                       # bootstrap
  app/                            # application, router, provider composition
  config/                         # reward and progression rules
  theme/                          # colors, typography, layout and motion tokens
  models/                         # framework-independent domain objects
  repositories/                   # repository contracts and local adapters
  services/                       # sound and speech contracts
  data/                           # demo seed
  widgets/                        # shared portal/button/progress/status UI
  features/design_preview/        # stage 1 visual harness + settings
```

Add core/, animations/, game/, ai/ when their first concrete responsibility
arrives. Planned features: auth, onboarding, home_world, subjects, missions,
mini_games, ai_tutor, ai_adventure, ai_pet, my_world, achievements, leaderboard,
profile, teacher, parent. Avoid placeholder files with unimplemented screens.

Widgets read providers; controllers call repository interfaces; adapters own
serialization and storage. Replace progressRepositoryProvider to integrate a
backend without rewriting screens. No credentials or remote AI calls in demo.

## Design direction

Kazakh Future Fantasy: night steppe, angular mountain silhouettes, turquoise
portal, warm cream canvas, gold rewards and restrained ornament. Illustrated
map regions will be interactive landmarks rather than a subject card grid.

Noto Sans Regular/Bold is bundled locally with its SIL OFL license. Font source:
https://github.com/notofonts/noto-fonts/tree/main/hinted/ttf/NotoSans
Kazakh sample: Ә Ғ Қ Ң Ө Ұ Ү Һ І / ә ғ қ ң ө ұ ү һ і.

Primary colors: turquoise #126D70, sky #BCE3E7, gold #F3C35C.
Environment: cream #FAF3E3, navy #183B47, sand #E7D6AF, grass #779C60.
Accent: terracotta #B95E43, coral #D97A60, emerald #287957.
Body 15–17, headings 22–36, minimum action target 56 logical pixels.
Use navy on gold/sky/cream; cream on navy/turquoise. Gold is not body text on cream.

Stage 1 portal repaints only its own boundary. Reduced motion uses both system
and persisted preference; animations stop rather than merely slow down. Large
text stays enabled. Sound is deliberately silent until audio assets are added.

## Persistence

SharedPreferencesAsync stores one versioned JSON document. XP, streak, currency,
mission stars (also completed mission IDs), achievements, world unlocks, last
study date and settings round-trip together. Level and pet stage derive from XP
using a configurable 200 XP/level rule: 1250 XP gives level 7 / Explorer.
No separate level value can drift from XP. Future rule changes need a migration.

Missing save seeds Аян / grade 3 / 1250 XP / 6 days / 340 Тұмар once. Invalid or
unsupported saves surface a friendly retry state and remain untouched. Failed
settings writes do not update UI state. SharedPreferences is demo storage;
server-backed transactional rewards belong in the later backend adapter.

## Stage 1 limits

No playable missions, actual AI, authentication, real sounds, cinematic splash,
onboarding, teacher/parent screen or World Map yet. The foundation is not a claim
that the whole platform is complete. No 60 FPS claim until physical-device profiling.
```
flutter run
flutter analyze
flutter test
```
