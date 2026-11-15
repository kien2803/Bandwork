# Bandwork — IELTS practice

An MVP IELTS practice web app for learners around band 5.5 aiming for 6.5–7.0.
It prioritises active drills over passive content:

- **Writing** — copy band-7 sample essays (Task 1 & 2) from memory and diff your
  version word-by-word against the original; paraphrase sentences and compare
  with model answers.
- **Reading** — synonym finder (tap the word in the passage the question
  paraphrases) and paraphrase recognition (pick the option that keeps the
  meaning).
- **Listening** — dictation: play a clip, type what you hear, see a highlighted
  diff and an accuracy score.
- **Speaking** — shadowing: play a model answer, record yourself with the
  microphone, replay and compare.
- **Dashboard** — progress: exercises done per module, drills today, recent
  activity, and the "band track" from 5.5 toward 7.0.

## Tech stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui
- SQLite via Prisma (`prisma/dev.db`)
- Web Speech API (`speechSynthesis`) for clip playback — swap `speak()` in
  `src/lib/speech.ts` for `<audio>` elements when real recordings are added
- MediaRecorder API for speaking recordings (stored in-browser only)
- No auth: progress is stored in the `Attempt` table for a single implicit user

## Run it

```bash
npm install
npx prisma db push    # creates prisma/dev.db
npm run db:seed       # loads exercise content
npm run dev           # http://localhost:3000
```

Reset content at any time with `npm run db:seed` (it clears attempts too).

## Project structure

```
prisma/
  schema.prisma        # exercise tables + polymorphic Attempt log
  seed.ts              # 6 essays, 6 paraphrases, 8 synonyms, 8 choices,
                       # 6 dictation clips, 6 shadowing clips
src/
  app/
    page.tsx                     # dashboard
    writing/                     # module list + copy/[id] + paraphrase/[id]
    reading/                     # module list + synonym/[id] + choice/[id]
    listening/                   # module list + dictation/[id]
    speaking/                    # module list + shadowing/[id]
    api/attempts/route.ts        # POST an attempt
  components/
    shell.tsx                    # sidebar + top bar + mobile nav sheet
    band-track.tsx               # signature element: 5.5 → 7.0 progress scale
    panel.tsx                    # tonal panel primitives
    diff-view.tsx                # word-diff renderer
    exercise-list.tsx            # list rows with done/score state
    attempt-history.tsx          # per-exercise attempt log
    practice/                    # the six drill UIs (client components)
    ui/                          # shadcn/ui primitives
  lib/
    db.ts                        # Prisma client
    diff.ts                      # word-level LCS diff + accuracy
    practice.ts                  # progress queries, labels, next-up
    speech.ts                    # Web Speech API wrapper
    attempt.ts                   # client-side attempt recorder
```

## Notes for the next iteration

- Attempts are written via `POST /api/attempts`; the dashboard and each detail
  page read them for progress and history.
- `score` is 0–100 (diff accuracy, or 100/50/0 for right/late-right/revealed).
- To use real audio: add a `audioUrl` field to `DictationClip`/`ShadowingClip`,
  serve files from `/public/audio`, and replace `speak()` calls.
# Bandwork
