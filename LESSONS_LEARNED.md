# Lessons Learned — MazeBreak Trello

Project retrospective covering technical decisions, surprises, and insights from building the MazeBreak Trello board automation tool and marketing site.

## API Design

### Environment Variable Naming Matters

The Trello documentation refers to credentials as "API Key" and "Token," but the original script used `TRELLO_KEY` while the `.env` file stored it as `TRELLO_API_KEY`. This mismatch caused a silent `undefined` that surfaced as a cryptic 401 "invalid key" error from Trello.

**Lesson:** Match env var names exactly between `.env` and consuming code. When debugging API auth failures, log the credential variable (or its type/length) first — a `undefined` masquerading as a bad key will waste time.

### Idempotency is Non-Negotiable for Automation Scripts

The first version of the setup script created duplicates on every run. The PRODUCTION++ rewrite introduced find-or-create for every resource type — workspace, board, lists, labels, cards, checklists, check items, and comments.

This required querying existing resources before creating, matching by name, color, or content prefix. The pattern adds ~40% more API calls on a fresh run but makes the script safe to re-run indefinitely.

**Lesson:** Any script that provisions infrastructure (whether cloud resources or Trello boards) must be idempotent from day one. Retrofitting idempotency is harder than building it in, because you have to handle the mixed state of "some resources exist, some don't."

### Trello API Rate Limits are Generous but Sequential

Trello's API allows about 100 requests per 10-second window per token. The setup script makes ~150+ API calls (10 cards x multiple checklists, check items, and comments each). Sequential execution stays well within limits because each call takes 200-400ms.

**Lesson:** For moderate-scale automation (under 500 calls), sequential execution with axios is simple and sufficient. Parallelizing Trello API calls adds complexity with minimal time savings because the rate limit, not network latency, is the bottleneck.

## Frontend Architecture

### Zero-Framework Static Sites Still Work

The landing page and docs site are ~1,700 lines and ~1,600 lines of vanilla HTML/CSS/JS respectively. No React, no build step, no bundler, no npm scripts. Vercel serves them as static files from `public/`.

This made deployment trivial (`vercel --prod`), debugging straightforward (view source = production source), and performance excellent (no JS framework overhead, no hydration, no client-side routing).

**Lesson:** For marketing pages and documentation sites, vanilla HTML is a legitimate production choice. The threshold for needing a framework is higher than most developers assume. A framework becomes justified when you need shared state, complex interactivity, or are building a true application — not a content site with some animations.

### Lazy Video Loading Matters More Than You Think

The explainer video (MP4) was initially embedded as a standard `<video>` tag. This caused the browser to preload video metadata and buffer the first few seconds — adding ~2-3MB of unnecessary initial page weight for users who never click play.

The fix: render only a poster image with a play button overlay. On click, dynamically create the `<video>` element, append it, and call `.play()`. Total network cost until interaction: zero bytes of video.

**Lesson:** For below-the-fold video content, lazy loading via click-to-create is the right pattern. The `<video preload="none">` attribute helps but still creates a DOM element and may trigger browser heuristics. Creating the element on demand is the most reliable zero-cost approach.

### CSS `transition: all` Creates Invisible Bugs

The primary CTA button had `transition: all 0.2s`. This seemed fine until the hover state was added — the browser transitioned properties nobody intended to animate, including `color` inherited from parent elements. The result was text that appeared to fade into the background.

**Lesson:** Use specific transition properties (`transition: background 0.2s, transform 0.2s`) instead of `transition: all`. The `all` keyword is convenient during development but creates hard-to-debug visual regressions when inherited properties change.

### Image `width`/`height` Attributes Need CSS `height: auto`

HTML `width` and `height` attributes are important for CLS (Cumulative Layout Shift) prevention — they tell the browser the aspect ratio before the image loads. But without `height: auto` in CSS, the browser can use the HTML `height` as a literal pixel value, stretching images when the container is narrower than the specified width.

**Lesson:** Always pair HTML dimension attributes with CSS `width: 100%; height: auto;` for responsive images. The HTML attributes provide the aspect ratio hint; the CSS ensures the image scales proportionally.

## Deployment

### Vercel `outputDirectory` is Easy to Miss

The site deployed blank on Vercel despite working perfectly locally. The root cause: missing `"outputDirectory": "public"` in `vercel.json`. Vercel defaulted to serving from the repo root, which meant `index.html` (the landing page, living in `public/`) was never found. Instead, Vercel served nothing — no error, just a blank page.

**Lesson:** When a Vercel deployment serves blank pages with no console errors, check `outputDirectory` first. Vercel's zero-config defaults assume your content is at the root. If your files are in a subdirectory, you must explicitly configure it.

### Old Deployments Can Mask New Problems

After fixing a bug, the site still appeared broken because the Vercel deployment was 13 hours old and hadn't auto-deployed. The fix was committed and pushed to GitHub, but without a connected Git integration or manual `vercel --prod`, the live site didn't update.

**Lesson:** Always verify deployment freshness after pushing fixes. Use `vercel inspect <url>` to check when the current production deployment was created. Don't assume a `git push` triggers a new deployment unless you've explicitly configured that pipeline.

## Project Management

### Dependency Encoding in Card Titles Works Surprisingly Well

The `[S0-00]` through `[S0-09]` prefix system was initially a workaround for Trello's lack of native dependency tracking. In practice, it became the primary way team members understood task ordering — more visible and useful than the dependency notes buried in card descriptions.

**Lesson:** Simple, visible conventions (prefixed IDs, color-coded labels) often outperform sophisticated features (custom fields, Power-Up integrations) because they're immediately visible and require zero setup or training.

### Instruction Cards Reduce Questions

The 4 instruction cards (Board Overview, Card Lifecycle, Trello Tips, Dependency Map) in the Instructions list eliminated most onboarding questions. New contributors could read the board itself rather than searching for a separate onboarding document.

**Lesson:** Put usage instructions inside the tool, not in a separate document. People read what's in front of them. An instruction card on a Trello board gets read; a wiki page linked from a README does not.

## Technical SEO and Social Sharing

### OG Image Dimensions Affect How Platforms Display Your Link

The original OG image was 1440x900 (16:9), which looked fine on Twitter/X but was cropped awkwardly on LinkedIn and some messaging apps. Switching to a dedicated 1024x1024 square image ensured consistent rendering across all platforms.

**Lesson:** Create a dedicated OG image at 1024x1024 or 1200x1200 for social sharing. Don't reuse a hero screenshot — it will be cropped differently on every platform. A square image with clear text and branding is the safest choice.

### JSON-LD Structured Data is Low Effort, High Signal

Adding a `SoftwareApplication` JSON-LD block took 5 minutes and provides search engines with explicit metadata about what the project is, who made it, and where to find it. There's no downside and potential upside for search visibility.

**Lesson:** For any project with a public-facing page, add JSON-LD structured data. The `SoftwareApplication` schema is well-suited for developer tools. It's a one-time addition that search engines actively use for rich results.

## Summary

The biggest recurring theme: **explicit is better than implicit**. Explicit env var names prevent auth bugs. Explicit `outputDirectory` prevents blank deployments. Explicit `height: auto` prevents stretched images. Explicit `color` on hover prevents invisible text. Explicit dependency prefixes prevent lost task ordering. Every shortcut that relies on "the default should be fine" eventually becomes a debugging session.
