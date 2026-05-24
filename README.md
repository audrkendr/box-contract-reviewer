# Box Developer Experience Audit

**The project:** I built an AI contract reviewer on top of the Box API from scratch using Next.js, TypeScript, the full OAuth flow, file downloads, PDF extraction, and an LLM layer on top. During the process I made note of what went well and what could be made smoother.

Link to demo snaphot on [Box](https://app.box.com/s/hw6kw69uz704qzd98r0pe04c5zzw9lqj)

---

## What's already working well

- **The Developer Console is polished.** The [Create Your Application](https://developer.box.com/guides/getting-started/first-application) and [Developer Tokens](https://developer.box.com/guides/authentication/tokens/developer-tokens) guides are straightforward, so going from signing up to my first API call was painless. One-click dev token generation made connecting to Box's API easy.
- **The TypeScript SDK is useful.** Autocomplete works, type errors catch mistakes early, and method naming is consistent.
- **The Files and Metadata APIs are well-suited to AI use cases.** The clean pagination, detailed metadata, and organized folder structure is solid infrastructure for the kind of retrieval systems developers are building right now.

---

## Areas to build on

### 1. An AI/RAG entry point

Box's content model maps to what AI engineers need: structured document storage, rich metadata, reliable retrieval.
However, connective features such as a LangChain integration, LlamaIndex loader, or chunking/embedding guide do not exist yet.
Publishing a Box document loader for either framework would connect Box to developers building RAG pipelines. A full RAG quickstart (Box → text extraction → embeddings → vector store) could be the most-linked Box developer content in the AI community, probably within weeks of publication.

### 2. A Next.js App Router quickstart

Next.js is the most common modern React framework, and building on Box with it has some specific considerations not covered in the docs right now, including stream handling, route handlers, ESM package compatibility.
A focused quickstart (dev token → first file download → metadata fetch → stream handling) could get a developer to a working app in 30 minutes.

### 3. A PDF text extraction guide — _impact: 5/5_

There's no recommended path for PDF text extraction in Node.js, and both popular libraries (pdf-parse, pdfjs-dist) require non-obvious workarounds in modern Next.js environments. This was the most time-consuming obstacle in this project.
A guide that picks a library, shows the code, and explains the Next.js-specific edge cases would save every developer building a document AI app hours of debugging.

### 4. An OAuth lifecycle guide — _impact: 4/5_

The OAuth flow itself is well-documented in the abstract, but areas like token storage strategy, refresh handling, the natural dev token → OAuth progression isn't covered. Refresh token handling isn't mentioned until developers hit it in production. A guide that walks through the full lifecycle would meaningfully close the gap between "works on my machine" and "works in production."

### 5. TypeScript examples throughout the docs — _impact: 4/5_

The [sample code library](https://developer.box.com/sample-code) is heavily JavaScript-focused, which is worth revisiting. There are only two TypeScript examples in the whole catalogue. Given that the TypeScript SDK is genuinely one of Box's strengths, it's an easy win to add more TS samples in the docs too.

---

## What I'd ship in 90 days

1. **Next.js App Router quickstart**
   a step-by-step guide covering dev token setup, downloading files, reading metadata, and the stream handling quirk that catches most people out. Quick to write and immediately useful to anyone starting a modern JavaScript project.
2. **PDF text extraction guide**
   a straightforward recommendation of which library to use, how to set it up, and the Next.js-specific gotchas to watch out for. Would have saved several hours during this build alone.
3. **AI/RAG quickstart**
   a working example that takes you from Box storage all the way through to a queryable vector index, with real code at each step - the kind of content the AI developer community tends to share widely.
4. **LangChain / LlamaIndex integration**
   a Box document loader for the two frameworks most AI developers are already using. Gets Box into the ecosystem where those conversations are happening.
5. **OAuth lifecycle guide**
   a walkthrough of token storage, refresh handling, and how to graduate from a dev token to a production-ready auth setup without getting caught out by the gaps in between.

---

## Final Thoughts

Box has a solid developer experience with its clean API, well-typed SDK, and fast onboarding.
What's missing is the content and tooling that connects it to how AI developers are currently building, and that's exactly the work I'd want to own.

---
