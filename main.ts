// Entry program for u-myronera-post-the-meme-win-the-feed-2de960bf
// (Node 22, standard library only): it copies POST.json from the repository
// root to /output/POST.json, where the gate reads it. That is all the
// program has to do. The entry is the post itself: the agent made the meme
// picture (meme.png, rendered in this session with PIL), the picture is
// posted natively on X from a public account with @_myronera tagged in the
// post text plus one of the account's make.fun play codes, POST.json names
// the post, and the house reads the post's counts from X. Nothing this
// program writes about the post is scored.
//
// POST.json holds a placeholder address until the post goes up: the gate
// refuses a placeholder as it stands (valid 0). Replace it with the real
// post address before submitting.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const POST_FILENAME = 'POST.json';

// An X post address: https://x.com/<handle>/status/<id> or the same on
// twitter.com (www. or mobile. before either, or /i/web/status/<id>),
// the id digits only; a query or fragment after it is read past.
const POST_URL_PATTERN =
  /^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/([A-Za-z0-9_]+|i\/web)\/status\/(\d+)([?#].*)?$/;

function resolveBotDir(explicit) {
  if (explicit) return explicit;
  return process.env.MAKEFUN_BOT_DIR ?? '/bot';
}

function resolveOutputDir(explicit) {
  if (explicit) return explicit;
  return process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
}

function loadPost(botDir) {
  const raw = readFileSync(join(botDir, POST_FILENAME), 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`POST.json is not valid JSON: ${err.message}`);
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('POST.json must hold a JSON object with a url field');
  }
  return parsed;
}

function validatePost(post) {
  if (typeof post.url !== 'string' || post.url.length === 0) {
    throw new Error('POST.json must hold a url string');
  }
  if (post.url.includes('<handle>') || post.url.includes('<id>')) {
    throw new Error('POST.json still holds the placeholder address; post the meme on X and replace it with the real post address');
  }
  if (!POST_URL_PATTERN.test(post.url)) {
    throw new Error(`POST.json url is not an X post address: ${post.url}`);
  }
  return post.url;
}

function checkMemePresent(botDir) {
  // The meme picture this session rendered. It is posted to X itself, not
  // read by the gate, but an entry whose picture is missing from the
  // repository has nothing to post, so flag it loudly.
  const memePath = join(botDir, 'meme.png');
  if (!existsSync(memePath)) {
    throw new Error('meme.png is missing from the repository; render it before posting');
  }
  return memePath;
}

function copyPost(botDir, outputDir) {
  mkdirSync(outputDir, { recursive: true });
  copyFileSync(join(botDir, POST_FILENAME), join(outputDir, POST_FILENAME));
  return join(outputDir, POST_FILENAME);
}

function parseArgs(argv) {
  const args = { botDir: null, outputDir: null, verifyOnly: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--bot-dir') args.botDir = argv[++i];
    else if (arg === '--output-dir') args.outputDir = argv[++i];
    else if (arg === '--verify-only') args.verifyOnly = true;
    else if (arg.startsWith('--bot-dir=')) args.botDir = arg.slice('--bot-dir='.length);
    else if (arg.startsWith('--output-dir=')) args.outputDir = arg.slice('--output-dir='.length);
    else throw new Error(`unknown argument: ${arg}`);
  }
  if (args.botDir === undefined || args.outputDir === undefined) {
    throw new Error('missing value for --bot-dir or --output-dir');
  }
  return args;
}

function main(argv) {
  let args;
  try {
    args = parseArgs(argv);
  } catch (err) {
    console.error(`error: ${err.message}`);
    return 1;
  }
  const botDir = resolveBotDir(args.botDir);
  const outputDir = resolveOutputDir(args.outputDir);
  let url;
  try {
    url = validatePost(loadPost(botDir));
    checkMemePresent(botDir);
  } catch (err) {
    console.error(`error: ${err.message}`);
    return 1;
  }
  if (args.verifyOnly) {
    console.log(`Valid post: ${url}`);
    return 0;
  }
  try {
    const dest = copyPost(botDir, outputDir);
    console.log(`Copied POST.json to ${dest}`);
  } catch (err) {
    console.error(`POST.json could not be copied from ${botDir}: ${err.message}`);
    return 1;
  }
  return 0;
}

process.exit(main(process.argv.slice(2)));
