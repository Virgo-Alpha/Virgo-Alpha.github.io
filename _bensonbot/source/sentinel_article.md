---
title: "Building “Sentinel”: multi-agent cybersecurity news triage and publishing system on AWS"
---
In this article, I discuss Building “Sentinel”: multi-agent cybersecurity news triage and publishing system on AWS.

TLDR;
I built Sentinel, a serverless, agentic pipeline that turns noisy RSS feeds into actionable cybersecurity intel (dedup, triage, publish).
Deterministic first, agentic later: Step Functions → Lambdas, then flipped a feature flag to Bedrock AgentCore (Strands) without changing contracts.
Reliability by design: SQS buffering, DLQs, idempotency keys, guardrails, and graceful degradation (semantic → heuristic).
Search that scales: OpenSearch Serverless with BM25 + vectors, cached embeddings, clusters for near-dupes.
Secure & observable: Cognito + least privilege, KMS, WAF, VPC endpoints, JSON logs + X-Ray, SLOs & cost alarms.
Table Of Contents
Introduction
Problem statement
My solution
The architecture
Use of Strands
Use of Bedrock
Human in the loop
Challenges and breakthroughs
Key learnings
Future Plans
Conclusion

Introduction
Exploring AWS AI offerings has been on my TODO list for the longest time. I was particularly interested in Strands, Bedrock and Nova Act. Thus, for this AI Engineering month, I decided to take on the challenge to solve a practical problem that I have seen in my industry using these tools, while learning and exploring in the process. I recently earned the AWS Certified Solutions Architect Associate certification and also got access to Kiro so this project allowed me to play the part of a technical PM and apply my system design skills. I hope you learn something that may aid you in your work. Enjoy.

Problem statement
As my company’s CISO, I would like to develop an internal cybersecurity newsletter that collates news from different RSS feeds, filters out those relevant to my organization based on a list of keywords and shares them with fellow employees either via email or published on an internal site. I wanted to be kept abreast of the latest happenings in the industry but I want to automatically share anything that may be relevant so that’s why I expanded my requirements.

My solution
Sentinel is an AWS-native, multi-agent cybersecurity news triage and publishing system that autonomously ingests, processes, and publishes cybersecurity intelligence from RSS feeds and news sources. The system reduces analyst workload by automatically deduplicating content, extracting relevant entities, and intelligently routing items for human review or auto-publication.
For the full code, visit my repository here

Information flow

The architecture
I designed a decoupled, serverless microservices architecture that scales cleanly and kept costs predictable. The core remained a set of Lambda functions behind Step Functions, with EventBridge schedules kicking off ingestion. I routed all content through a buffered pipeline: EventBridge fanned into SQS so bursts of feeds didn’t cascade into failures, and every consumer Lambda processed messages idempotently using a canonical-URL SHA-256 as the key. I attached DLQs at each hop (EventBridge, SQS consumers, Step Functions tasks) and wrote compensation paths so partial successes (e.g., stored raw content but failed dedup) re-queued safely.

My architecture

I modeled storage deliberately. In DynamoDB I used a primary table for articles with GSIs for state#published_at (queues and dashboards), cluster_id#published_at (duplicates), and tags#published_at (topic browsing). I enabled TTL for short-term session memory and configured PITR for recovery. For search, I provisioned OpenSearch Serverless with a BM25 collection for keyword queries and a k-NN vector collection for semantic near-duplicate detection. I cached embeddings by content hash to avoid recomputation and cut latency.

On the agent side, I started with direct orchestration so I could validate the pipeline deterministically. Step Functions called Lambdas (FeedParser → Relevancy → Dedup → Summarize → Guardrail → Decision), and a thin “agent shim” Lambda exposed the same interface I knew I’d use later. When I was ready, I deployed my Strands-defined Ingestor and Analyst Assistant agents to Bedrock AgentCore and flipped a feature flag so Step Functions invoked the agents instead. If AgentCore became unavailable or too slow, the same flag let me fall back instantly to direct Lambda orchestration.

I treated configuration and behavior as data. I moved feed lists, keyword taxonomies, similarity thresholds, guardrail strictness, and rollout switches into SSM Parameter Store, and I read them at runtime. I kept a small but explicit flags matrix: enable_agents (direct vs AgentCore), enable_opensearch (heuristic vs semantic dedup), enable_amplify (backend-only vs full stack), enable_guardrails_strict, and enable_digest_email. This let me ship incrementally without redeploys.

For Bedrock usage, I separated concerns. I used LLM calls to score relevance to my taxonomy and extract entities (CVE IDs, threat actors, malware, vendors/products) with confidences and rationales. I generated two summaries per item (executive two-liner and analyst card) and enforced a reflection checklist so outputs consistently included who/what/impact/source. I produced embeddings for semantic search and dedup, and I versioned prompts and model IDs in SSM, logging token usage per call. Every LLM output passed a JSON-Schema validation step; failures, PII findings, or suspicious CVE formats triggered Human Escalation automatically. I also kept a small “golden set” of seeded dupes and fake CVEs to regression-test prompts and thresholds.

Security and networking were explicit. I authenticated users through Cognito user and identity pools and authorized them with group roles (Analyst/Admin) mapped to least-privilege IAM policies. I stored secrets in Secrets Manager (and encrypted everything with KMS) and placed WAF in front of Amplify/API Gateway, with usage plans and rate limits. I used Gateway VPC endpoints for S3 and DynamoDB and added interface endpoints selectively (Bedrock/OpenSearch) where the security benefit outweighed their per-hour cost. I documented a PII policy: I kept raw HTML in a restricted S3 prefix, stored normalized/redacted text separately, applied tight access controls, and retained artifacts only as long as needed.

Cognito and Amplify architecture

Observability and operations were top priority. I standardized on structured JSON logs with correlation IDs flowing from EventBridge through Step Functions, Lambdas, and agent tool calls, and I enabled X-Ray tracing end-to-end. I tracked SLOs and KPIs—duplicate detection precision, auto-publish precision, p95 latency per stage, and cost per article—and I wired CloudWatch alarms to anomalies and DLQs. I added daily and monthly cost monitors, and I wrote short runbooks for common incidents (OpenSearch throttling, SES sandbox, token bursts).

I also covered reliability and data protection. I enabled DynamoDB PITR, S3 versioning, and OpenSearch snapshots, and I documented RPO/RTO targets (≤15 minutes for metadata, ≤24 hours for search if I restored from snapshots). In a degraded state, I allowed the system to bypass semantic dedup and fall back to heuristic matching so ingestion never fully stalled.

On the product and API side, I clarified contracts. I exposed clean endpoints with pagination, filters, and error schemas. For exports, I generated XLSX in a worker pattern that wrote to S3 and returned pre-signed URLs, so large batches didn’t hit Lambda memory/timeouts. In the Amplify app I added a chat UI for natural-language queries with citations, a review queue with decision traces, and threaded commentary. I hardened the NL interface against prompt injection by allow-listing data sources, stripping HTML/JS from prompts, and refusing unsafe actions.

Finally, I shipped it as code. I organized Terraform into modules with remote state and environment isolation, hashed Lambda artifacts for deterministic deploys, and used canary releases for riskier changes. I tagged everything for cost allocation and preserved a full audit trail—who approved or rejected, which prompt/version ran, and the exact tool call sequence and parameters—for a defined retention window. The result read well in a demo and behaved like production: buffered, idempotent, observable, secure, and ready to toggle between deterministic pipelines and fully agentic orchestration.

Use of Strands
I used Strands as the authoring/orchestration layer to define two agents—Ingestor Agent and Analyst Assistant Agent—including their roles, instructions, and the tool bindings to my Lambda “tools” (FeedParser, RelevancyEvaluator, DedupTool, GuardrailTool, StorageTool, HumanEscalation, Notifier, QueryKB, etc.).

Strands packages those definitions and deploys them to Bedrock AgentCore so they can run at scale with standardized tool I/O, built-in observability, and clean A2A (agent-to-agent) patterns. In short: Strands is where I declare what each agent knows and which tools it can call; AgentCore is where they run.

I was using feature flags in my deployment to allow easy rollback as well as phased deployment of the features. Here is how my agents worked before and after deployment to Agentcore:

Before AgentCore (direct orchestration): Step Functions call my Lambdas directly in a deterministic pipeline (fetch → normalize → evaluate relevance/entities → dedupe → summarize/guardrail → decide publish/review/drop). This let me validate logic, data models, and infra without introducing another moving part. The “agent shim” simply proxied to those Lambdas so the Step Functions contract never changes.

After AgentCore (agentic orchestration): I flipped a flag and Step Functions (or API Gateway for chat) invokes the Strands-defined agents on Bedrock AgentCore. The Ingestor Agent plans and chooses which Lambda tools to call (ReAct + reflection), applies guardrails, clusters duplicates, and returns a triage decision; the Analyst Assistant Agent serves NL queries from Amplify, pulling from DynamoDB/OpenSearch, posting commentary, and even coordinating with the Ingestor via A2A for duplicate context. Functionally it’s the same tools, but now the agent decides when/why to call them.

Use of Bedrock
Bedrock underpins every intelligent step:

Reasoning + tool use (Agents): Both Strands-defined agents run on Bedrock AgentCore to plan, call tools, and maintain context (ReAct + reflection).

Relevance & entity extraction: LLM calls score relevance to your topic taxonomy and extract structured entities (CVEs, actors, malware, vendors, products), emitting JSON with confidence and rationale.

Summarization with reflection: The agent (or a summarizer tool) produces an executive 2-liner and an analyst card; a reflection checklist enforces “who/what/impact/source” and validates entity formatting.

Embeddings for semantic dedup/search: Bedrock embeddings vectorize normalized content; OpenSearch Serverless k-NN handles near-duplicate detection and semantic retrieval.

Guardrails support: While PII and schema checks run in Lambda, the LLM is steered to reduce sensationalism and format errors; suspect outputs route to review.

Conversational NL queries: The Analyst Assistant uses Bedrock to interpret questions, translate to DynamoDB/OpenSearch queries, and generate cited answers (and optionally initiate exports).

Bedrock infra architecture diagram

Human in the loop
When the Ingestor Agent (or the direct pipeline pre-AgentCore) isn’t fully confident—e.g., borderline relevance, suspected hallucinated CVE, PII detection—it escalates to review. Those items land in the Amplify review queue where an analyst can:

open the decision trace (what tools were called and why),
approve/reject or edit tags/summaries,
leave threaded commentary (stored in DynamoDB),
and provide thumbs up/down feedback that is logged for continuous improvement.
Approved items publish immediately; rejected items are archived with rationale for future training/tuning. The Analyst Assistant Agent also helps humans explore dup clusters, ask trend questions, and post comments via Natural Language.

Dashboard

Challenges and breakthroughs
Bursty feeds & reliability: Initial direct triggers caused cascading failures under load. Introducing SQS between stages, DLQs, and idempotency via URL hash stabilized the pipeline.
Near-duplicate detection: Title/URL heuristics weren’t enough. Pairing Bedrock embeddings with OpenSearch k-NN and clustering solved syndicated/rewritten stories; caching by content hash cut cost/latency.
Guardrails that matter: Early LLM runs occasionally hallucinated CVEs and included stray PII. A JSON Schema validator, PII filters, and a reflection checklist reduced errors and routed edge cases to review.
Agent flipover: Moving from Step Functions → Lambdas to AgentCore risked churn. A thin agent shim and a simple feature flag delivered a zero-drama cutover (and instant fallback).
Exports at scale: XLSX generation hit Lambda limits. Switching to an async export worker that writes to S3 and returns a pre-signed URL made large reports reliable.
Cost visibility: Token use and vector storage spiked during spikes. Adding token budgets, embedding caching, and cost per article metrics made FinOps actionable.
Kiro hooks in practice: Instrumenting prompts and tool calls with Kiro hooks gave clean traceability for demos and debugging.
Key learnings
Ship boring first: A deterministic pipeline (without agents) is the best baseline for correctness, tests, and rollbacks.
Agents as an overlay: Treat agents as pluggable orchestrators over stable tools; keep I/O contracts tight and versioned.
Feature flags are product features: enable_agents, enable_opensearch, guardrail levels, and digests let you canary safely and roll back instantly.
Reliability is a graph problem: Backpressure, retries, DLQs, and idempotency must be end-to-end, not per function.
Measure what you promise: SLOs (dup precision, auto-publish precision, p95 latency, cost/article) drive better architectural choices than gut feel.
Security posture is layered: Cognito authZ + least privilege, KMS everywhere, WAF, Secrets Manager rotation, and clear PII retention policies matter in real orgs.
Search is product, not plumbing: Hybrid BM25 + vectors, synonyms, and recency boosts directly impact analyst happiness.
Small golden datasets pay off: A handful of labeled dupes, fake CVEs, and PII cases catch regressions early and keep prompts honest.
Future Plans
Enrichment & intel quality: Integrate KEV/EPSS/NVD lookups, vendor advisories, and STIX/TAXII feeds; auto-normalize vendors/products; add IOC extraction and de-dup across entities, not just articles.
Evaluation & guardrails maturity: Build a small gold dataset (true dupes, fake CVEs, PII cases) and run scheduled evals; add prompt A/B testing, drift detection for embeddings, and policy-as-code for guardrails.
Agentic depth: Introduce planning memory (per-topic context), multi-turn self-verification (“second opinion” model), and a research sub-agent to cross-source claims before auto-publish.
Human workflow & governance: Add SLAs/priority queues, multi-approver rules for high-impact stories, granular roles/permissions, and full audit export (JSONL) to S3 for compliance.
Product UX: Faceted search (tags/entities/time/source), cluster views for dup families, inline diff of similar articles, saved queries, and per-team digests; async XLSX/CSV with presets.
Search relevance: OpenSearch synonyms for vendor/product aliases, recency boosting, hybrid BM25+vector reranking, and feedback-driven learning-to-rank.
Cost & FinOps: Track cost per processed article and per published item; autoscale OpenSearch collections; cache embeddings by hash; token budgets per source; nightly right-sizing reports.
Multi-tenancy & data boundaries: Partition DynamoDB/OpenSearch by tenant (PK prefix), isolate KMS keys, and add per-tenant throttles/quotas for fairness.
Platform & delivery: Canary deploys for Lambdas/agents, blue-green for Step Functions, schema registry + contract tests for tool I/O, and one-click backfill/replay tooling.
Security posture: Secrets Manager rotation, WAF rules for bot mitigation, DLP on raw S3 prefixes with automated quarantine, SBOM/supply-chain scanning, and optional private CA for mTLS between services.
Integrations: Slack/Teams notifications with approve/reject actions, Jira/ServiceNow ticket hooks for critical items, and webhooks for downstream dashboards.
Conclusion
Sentinel proved that you can take a messy, high-volume RSS firehose and ship a reliable, secure, and explainable pipeline that analysts actually want to use. The key was sequencing: build a buffered, idempotent backbone; define clear tool contracts; then layer on agentic behavior for planning and tool use. With Strands + Bedrock AgentCore, I kept autonomy where it helps (reasoning, tool selection) and guardrails where it counts (schemas, PII checks, human review). From here, the roadmap is about depth, not breadth: richer enrichment (KEV/EPSS/NVD), stronger evaluation loops, hybrid search relevance, and governance (SLAs, multi-approver flows). The system is already production-shaped—now it’s about making it smarter, cheaper, and harder to break.
