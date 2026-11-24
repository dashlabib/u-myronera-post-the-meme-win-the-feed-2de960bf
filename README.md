# Post the Meme, Win the Feed

[![make.fun](https://make.fun/badge/u-myronera-post-the-meme-win-the-feed-2de960bf.svg)](https://make.fun/bounty/u-myronera-post-the-meme-win-the-feed-2de960bf)
[![Rank](https://make.fun/badge/u-myronera-post-the-meme-win-the-feed-2de960bf/dashlabib/u-myronera-post-the-meme-win-the-feed-2de960bf/rank.svg)](https://make.fun/bounty/u-myronera-post-the-meme-win-the-feed-2de960bf)
[![Reward](https://make.fun/badge/u-myronera-post-the-meme-win-the-feed-2de960bf/dashlabib/u-myronera-post-the-meme-win-the-feed-2de960bf/reward.svg)](https://make.fun/bounty/u-myronera-post-the-meme-win-the-feed-2de960bf)

Entry for the [make.fun](https://make.fun/bounty/u-myronera-post-the-meme-win-the-feed-2de960bf) bounty
**Post the Meme, Win the Feed** — make a meme about make.fun that AI agent
builders would pass on and post it on X tagging `@_myronera`. The post with
the most likes, reposts and quotes takes the top place (score = likes +
reposts + quotes, top 15 share $2). Free to enter.

## The meme

`meme.png` (1080×1080, rendered in this session with PIL) is a two-panel
meme for builders:

- **Panel 1 — ME:** "I'll just enter ONE bounty." — an agent builder, probably.
- **Panel 2 — MY AGENT AT 3AM:** "Top of the leaderboard, $2 richer, already entered 47 more."
- Footer: "agents build bots. win bounties. get paid."

It lands on what make.fun is: agents entering bounties, building bots,
topping a leaderboard, getting paid — the kind of thing a builder sends to
another builder.

## Posting (needs the user's own public X account)

The agent cannot post to X itself. To enter, post `meme.png` from your own
public X account with this text (using the account's play code for this
bounty, code 0):

> ME: "I'll just enter ONE bounty." My agent at 3am: top of the leaderboard, $2 richer, already entered 47 more. @_myronera makefun-caramel-waxwing-bonfire

Then replace the placeholder in `POST.json` with the real post address:

```json
{"url": "https://x.com/<handle>/status/<id>"}
```

Keep the post up and the account public until the results are out. Do not
buy views, followers or engagement, and do not use bots.

**Status: NOT YET POSTED — `POST.json` still holds the placeholder, so the
gate would refuse this entry as it stands. The repo is ready; it becomes
submittable the moment the post is up and `POST.json` names it.**

## How it works

`main.ts` (Node 22, standard library only) copies `POST.json` from the
repository root to `/output/POST.json`, where the gate reads it:

- `loadPost` — reads and parses `POST.json`.
- `validatePost` — checks the url is a real X post address and refuses the
  placeholder.
- `checkMemePresent` — checks `meme.png` is in the repository.
- `copyPost` — copies `POST.json` verbatim to the output directory.
- `main` — loads, validates, then copies (or only verifies with
  `--verify-only`).

Nothing this program writes about the post is scored: the house reads the
post itself through FxTwitter.

## Options

- `--bot-dir <dir>` — repository directory (default: `$MAKEFUN_BOT_DIR` or `/bot`).
- `--output-dir <dir>` — output directory (default: `$MAKEFUN_OUTPUT_DIR` or `/output`).
- `--verify-only` — validate `POST.json` and exit without writing anything.

## Run it

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `main.ts` — the publishing program.
- `POST.json` — the X post address (placeholder until posted).
- `meme.png` — the meme picture, made in this session.
- `LICENSE` — MIT.
