# Hawktress Filing — Cowork Session Instructions
**For: Nathan**
**From: John**
**Purpose: Spin up a cowork session with Claude as your real-time co-pilot while you lodge the trade mark and lock the domains**

---

## What "cowork" gives you

A live Claude Code session where Claude is on standby alongside you while you work in the IP Australia portal and at the domain registrars. You read the screen, Claude tells you exactly what to type. Claude can't click for you — but it eliminates every "wait, what goes here?" moment and re-runs the trademark availability check in real time as the final pre-flight before you click lodge.

End result: trade mark filed and domains locked in one ~2-hour sitting, no second-guessing.

---

## Step 1 — Get cowork running (~5 min, one-time)

### If you've never used Claude Code before

1. On your Mac, install Claude Code from https://claude.com/code (download + drag to Applications)
2. Open it, sign in with your Anthropic account (or create one — same login as claude.ai)
3. Once you're at the prompt, you're ready

### If you already have Claude Code

1. Open Claude Code
2. From the prompt, type: `/setup-cowork`
3. Follow the prompts — it'll walk you through connecting any tools you want Claude to access (you don't need any of them for this session — skip everything except the basics)

---

## Step 2 — Open the working folder

In Claude Code, navigate to the folder where John has prepared the docs:

```
cd ~/claude-test/buildhawk-site/legal
```

(If that path doesn't work on your machine, ask John to share the three docs directly — they're self-contained and you can save them anywhere.)

Then run:

```
ls
```

You should see four files. The three you'll work from are:

- `hawktress-handover-note.md` — read this first
- `hawktress-filing-pack-for-nathan.md` — the filing walkthrough
- `hawktress-domain-defence.md` — the domain/handle lock-down

---

## Step 3 — Start the cowork session

Paste this exact prompt into Claude Code:

```
I'm Nathan from BuildHawk. I'm about to lodge the HAWKTRESS trade mark
with IP Australia and lock domains/handles in parallel. John has prepared
three docs in this folder: hawktress-handover-note.md, hawktress-filing-pack-for-nathan.md,
and hawktress-domain-defence.md.

Read all three. Confirm you understand the plan, then act as my real-time
co-pilot while I work through them. I'll tell you which screen I'm on; you
tell me what to type. Re-run a fresh ATMOSS knockout search on HAWKTRESS
the moment I'm about to click lodge as a final clearance check.

Start by reading the docs and giving me a 5-line summary of what we're doing.
```

Claude will read the docs and confirm the plan. From that point on, just narrate what's on your screen and Claude will tell you what to enter.

---

## Step 4 — Lodge the trade mark (~30–45 min)

1. **Open the IP Australia portal:** https://services.ipaustralia.gov.au
2. **Sign in via myGovID** (have your phone ready)
3. **Have your credit card ready** for the AU$250 fee
4. **Have your monitored email address ready** — examiner correspondence comes here for the next 10 years

Then say to Claude: `I'm signed into the IP Australia portal. Walk me through screen 1.`

Claude will feed you each field's value from the filing pack. Just type what Claude says, screen by screen.

**Right before you click "Pay & lodge":** say `About to click lodge — re-run the ATMOSS search now.` Claude will hit the IP Australia search and confirm no new conflicts have appeared since the original knockout. Only click lodge after Claude confirms clean.

After lodging, screenshot the receipt page (showing application number + filing date) and tell Claude: `Lodged. Application number is [paste the number].` Claude will diary the examination, advertisement, and renewal milestones for you.

---

## Step 5 — Lock domains and handles (~90 min)

You can do this in the same cowork session, or come back to it later.

Tell Claude: `Moving to domain defence. Walk me through it.`

Claude will work down the tier list in `hawktress-domain-defence.md`:
- Confirm availability of each domain at the right registrar
- Tell you what to enter for registrant details (BuildHawk Pty Ltd, ACN 695 023 664, your monitored email)
- Walk you through 2FA, auto-renew, and registry lock setup
- Hand you the social platform URLs in priority order so you can claim each handle

You'll do the typing and clicking. Claude makes sure nothing is missed.

---

## Step 6 — Hand back to John

When you're done, say to Claude: `All done. Generate a handback summary for John.`

Claude will produce a one-page summary with:
- TM application number + filing date
- Domains registered + registrar
- Social handles claimed
- Anything outstanding (e.g. handle conflicts, registrar issues)

Send that summary to John and we close the loop.

---

## If you get stuck

Anywhere in the process, just type into Claude: `I'm stuck on [whatever it is]`. Claude has the full pack as context and can troubleshoot live.

If something genuinely blocks you — e.g. a domain is taken, the IP Australia portal rejects a field, ASIC details don't match — say `Pause. Flag this for John.` and Claude will write up the issue. Send that to me and I'll triage.

---

## What to have on hand before you start

- [ ] Mac with Claude Code installed
- [ ] Phone with myGovID app, identity at Standard or Strong level
- [ ] BuildHawk Pty Ltd authorised-officer status confirmed in RAM (Relationship Authorisation Manager)
- [ ] Credit card with at least AU$500 available (TM $250 + domains ~$250)
- [ ] Monitored email address — for IP Australia AND for domain registrars
- [ ] ~2 hours uninterrupted, OR one ~45-min block for the TM and a separate ~90-min block for domains
- [ ] BuildHawk's current QLD registered office address (or a confirmed Geelong address that you monitor every day)

---

## Why this is worth doing as a cowork session, not solo

Solo, the highest risk is a fat-fingered field that quietly narrows the spec or the wrong picklist term that bumps the fee. Cowork puts a second pair of eyes on every field before you commit, and re-runs the clearance search seconds before lodgement so the priority date locks against the latest possible state of the register.

Same applies to domains — Claude will catch if you accidentally register `hawktress.com` to a personal account instead of BuildHawk, or skip 2FA on a registrar that gets compromised six months later.

Two hours, one session, IP locked.

— John
