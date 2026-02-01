---
title: "Resurrecting Google Reader for the modern web using Kiro"
---
In this article, I discuss how I Resurrected Google Reader for the modern web using Kiro

TLDR;
Google Reader solved content tracking for the open web, but died when RSS could not keep up with SPAs.
Watcher resurrects the Google Reader experience for the modern web.
Instead of relying on RSS, Watcher creates RSS by monitoring live webpages.
Users define “haunts” using natural language; AI generates selectors and structure.
The UI intentionally mirrors Google Reader’s three-column layout and power-user workflow.
AI + scraping + RSS unlocks a new class of user-controlled web monitoring tools.
Table of Contents
Introduction
Kiro and its features
Spec driven development
Vibe coding
Agent hooks
Steering docs
MCP
Google Reader
Watcher
How we built it
Similarities Between Watcher and Google Reader
Differences Between Watcher and Google Reader
Lessons learnt
Conclusion
Introduction
I was honored to participate in the Kiroween Hackathon on Devpost, an event that challenged participants to build ambitious projects using Kiro, AWS’s newly released AI-native IDE. The hackathon encouraged not just technical execution, but creative re-thinking across four themes: resurrecting dead technologies, stitching together unlikely systems, building flexible foundations, or delivering unforgettable interfaces.

For my submission, I chose Resurrection.

Over a decade ago, Google Reader quietly disappeared from the web. Its shutdown marked more than the loss of a product, it signaled a shift away from user-controlled, open content consumption toward algorithmically curated feeds. Yet the problem Reader solved never went away. In fact, it became harder: the modern web moved to dynamic, JavaScript-heavy applications that no longer expose RSS at all.

This project explores a simple question: What would Google Reader look like if it were rebuilt for today’s web?

The result is Watcher, a system that haunts modern websites, detects meaningful change, and resurrects the RSS model using AI, scraping, and a deliberately nostalgic interface. Kiro made this possible.

Kiro and its features
Kiro is an IDE that AWS released this year. It has several cool features such as:

Spec driven development
Spec-driven development in Kiro places formal specifications at the center of the workflow. Instead of writing code first and documenting later, developers define structured specs that describe intent, constraints, and expected behavior. These specs are then used by the IDE and its agents to guide implementation, validation, and refactoring. This approach reduces ambiguity, improves alignment between stakeholders, and creates a durable source of truth that evolves alongside the codebase. For AI-assisted development, specs act as guardrails, ensuring that generated code remains consistent with the system’s design goals.

To use this mode, I first wrote the PRD (Product Requirements Document) by hand and added it as a spec in Kiro. Kiro then used it to generate the requirements, design and tasks file. I then executed the tasks one by one and checked to ensure that the code generated met my standards and creative vision.

Vibe coding
Vibe coding is Kiro’s term for an exploratory, conversational style of development where developers work at the level of intent rather than syntax. Instead of issuing narrowly scoped prompts, developers express what they are trying to achieve,architecturally or experientially, and allow the IDE to propose implementations that fit the broader context of the project. This mode is particularly effective in early-stage prototyping, where requirements are fluid and rapid iteration is essential. Vibe coding prioritizes flow and momentum while still grounding outputs in the project’s specifications and constraints.

I used vie coding to debug and refine the UI components to my needs. It proved useful in understanding the code generated as well as the cause of errors.

Agent hooks
Agent hooks allow developers to attach AI agents to specific lifecycle events such as file changes, test failures, or deployment steps. These agents can observe state, reason about deltas, and take targeted actions,ranging from suggesting fixes to generating artifacts or alerts. Rather than operating as a monolithic assistant, Kiro’s agents are modular and event-driven, which makes them predictable and composable. This model mirrors how modern systems are built: loosely coupled components reacting to well-defined signals.

I created agent hooks for security, performance and unit testing goals. These ensured that I had the basics covered as I continued to iteratively develop my project.

Steering docs
Steering documents in Kiro are lightweight, high-leverage artifacts that encode architectural principles, design philosophies, and non-functional requirements. They serve as long-lived guidance for both humans and AI agents, shaping decisions without prescribing implementation details. In practice, steering docs help maintain coherence as a project grows, especially when multiple contributors or agents are involved. They are particularly valuable in AI-assisted environments, where consistent direction is necessary to avoid fragmentation and unintended complexity.

I used steering docs to set guardrails for the design and set up. I wanted to try and mimic Google Reader’s UI and functionality as much as possible and this came in handy.

MCP
The Model Context Protocol (MCP) provides a standardized way to supply structured context,such as schemas, APIs, domain models, and external tools,to AI agents. By formalizing how context is shared, MCP reduces hallucinations and increases the reliability of agent outputs. It enables agents to operate with a clear understanding of the system’s boundaries and available capabilities, making them more effective collaborators rather than generic text generators. MCP is a critical enabler for building production-grade, AI-native developer workflows.

Google Reader
Google Reader was a web-based RSS and Atom feed aggregator launched by Google in 2005. At its core, it allowed users to subscribe to content feeds,blogs, news sites, academic journals, forums,and consume updates in a single, unified interface. Rather than visiting dozens of websites individually, users could rely on Google Reader to surface new content as it was published, ordered chronologically and optimized for rapid scanning. Its minimal, text-first interface emphasized efficiency over distraction, enabling power users to process large volumes of information quickly.

Google Reader was important because it embodied an open, decentralized model of the web. It rewarded publishers who exposed structured feeds and gave users direct control over how and where they consumed information, independent of proprietary algorithms. For researchers, journalists, developers, and analysts, it became an indispensable tool for monitoring changes across many sources. It also pioneered interaction patterns,such as keyboard shortcuts, starring, tagging, and sharing,that influenced later content consumption tools.

Despite its loyal user base, Google shut down Reader in 2013, citing declining usage and a strategic shift toward fewer, more focused products. In practice, its closure reflected a broader industry transition away from open syndication toward algorithmically curated social feeds. While platforms like Twitter and Facebook offered scale and engagement, they replaced user intent with opaque ranking systems. The shutdown left a lasting gap for users who valued transparency, control, and signal over noise,a gap that many modern tools, including Watcher, aim to address.

Watcher
Google Reader was one of the most beloved tools on the web: simple, fast, and incredibly efficient at keeping people updated. But as the web shifted to SPAs and dynamic content, most of it without RSS, Reader’s death left a real gap.

Watcher was born from the idea: What if we resurrected Google Reader, but upgraded it to haunt the modern web? Meaning:

It can watch any page, including SPAs
It understands natural language
It detects meaningful changes
And it exposes everything again as RSS, just like the old days
That mix of nostalgia + modern constraints was the spark.
Watcher resurrects the Google Reader experience for the modern web.

GIFWatcher GIF

You can view the deployed website here. Use the below credentials:

Email:

demo@watcher.local
Password:

demo123
It lets users:

Define a haunt by giving a URL + natural language description like: “Tell me when the admissions page says applications are open for 2026.”
Behind the scenes, an LLM generates selectors, keys, and normalization rules.
A headless browser (Playwright) scrapes the target on a schedule.
Watcher tracks key/value state diffs, not raw HTML, and generates structured change events.
Each haunt produces an RSS feed.
The UI is a faithful rebirth of the 3-column Google Reader layout, complete with folders, unread counts, stars, refresh, and keyboard shortcuts.
In short: Watcher turns any webpage, even SPAs, into a live RSS source.

How we built it
Watcher is built as a Django-based system with:

Spec-driven functional requirements covering scraping, diffing, RSS construction, and a Reader-style UI.
Playwright for SPA rendering and key extraction.
Celery for periodic haunting and change detection.
A fully modeled haunt configuration, derived via LLM from natural language.
Structured state tracking, storing only key/value diffs and summaries.
RSS feed generation for both private and public haunts.
A Google Reader–inspired front-end, implemented to feel as close as possible to the original.
Kiro powered the development loop, particularly around specs, architecture constraints, steering for UI generation, and consistency between backend and frontend layers.

You can find the code base on github

Similarities Between Watcher and Google Reader
Feed-Oriented Information Consumption Both Watcher and Google Reader organize information in a feed-like format that lets users see updates from multiple sources in a unified view.
RSS Integration and Support Both systems can work with RSS sources: Google Reader was built around RSS/Atom feed aggregation, while Watcher supports adding RSS cybersecurity sources into its monitoring.
Three-Panel Interface and Navigation Watcher’s interface intentionally draws on the three-panel layout that was characteristic of Google Reader, navigation pane, feed list, and content view.
Unread/Read Tracking Both platforms include mechanisms to mark items as read or unread, enabling users to track what they have and have not seen.
Keyboard Shortcuts and Power User Features Google Reader popularized keyboard shortcuts (J/K/M/S) and Watcher includes similar navigation controls inspired by Reader.
Subscription Model for Content Google Reader let users subscribe to feeds; Watcher lets users subscribe to monitoring configurations (“haunts”) and view updates similarly.
Differences Between Watcher and Google Reader
Dimension	Google Reader	Watcher
Primary Purpose	General-purpose RSS/Atom feed aggregator for web content and news.	Website change monitoring and alerting with AI-assisted context.
Core Functionality	Aggregates syndicated feeds and surfaces updates for reading.	Continuously monitors pages (including SPAs) and detects meaningful changes.
AI Integration	None; designed as a human-driven feed reader.	Uses AI to interpret change relevance and generate selectors from natural language.
Update Detection Mechanism	Pulls standardized feed entries as published by websites.	Uses headless browsers (e.g., Playwright) to detect changes beyond RSS.
Notification Types	In-app unread counts and keyword search; limited alerts.	Email alerts and structured summaries when defined conditions trigger.
User Interaction Model	Users subscribe to feeds and consume published entries.	Users define what to monitor (“haunts”); the system proactively watches for changes.
Social Features	Experimental sharing features (later removed).	Public haunts and subscriptions to other users’ monitoring configurations.
Scope of Content	Limited to content explicitly exposed via RSS/Atom.	Can monitor arbitrary webpages, including dynamic and JavaScript-rendered content.
Historical Status	Discontinued in 2013.	Actively developed and deployable.
Lessons learnt
LLMs work exceptionally well when guided by tight specs + steering documents.
The web’s move to SPAs made RSS impossible, but not undetectable.
State diffs matter more than raw HTML when building meaningful alerts.
Nostalgia is a powerful design force, porting old UX patterns into modern stacks teaches discipline.
Combining AI + scraping + RSS can create genuinely new value.
Conclusion
Watcher began as an exercise in nostalgia, but it ended as a statement about the modern web. While RSS disappeared not because it was flawed, but because the web outgrew it, the underlying need, to know when something meaningfully changes, never went away.

By combining AI-driven interpretation, structured state diffing, and headless browser scraping, Watcher turns even the most dynamic SPA into a first-class, queryable feed. In doing so, it restores user intent, transparency, and control, values that defined tools like Google Reader but are largely absent today.

Kiro proved to be more than an IDE in this process. Its emphasis on specs, steering documents, and agent-driven workflows enabled a level of architectural consistency that would have been difficult to maintain in an AI-assisted build. Rather than fighting the model, the system was shaped by constraints.

The broader lesson is this: AI does not replace structure, it amplifies it. When paired with clear specs, thoughtful design, and a respect for proven UX patterns, it enables entirely new classes of systems.

Watcher is one such system. A resurrection, not of a product, but of an idea: that the web should work for its users, not the other way around.
