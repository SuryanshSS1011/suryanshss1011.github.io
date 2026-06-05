---
title: "A citation-grounded RAG for technical documents at Morgan Advanced Materials"
description: "Capstone build for the Penn State Learning Factory, sponsored by Morgan Advanced Materials. Offline RAG that refuses to answer without a citation."
date: 2026-05-10T12:00:00
tags: ["Engineering", "RAG", "Capstone"]
---

## The two problems

Morgan Advanced Materials, like a lot of legacy manufacturers, has two parallel knowledge problems:

1. Engineers lose time hunting through internal technical documents for specifications, procedures, and historical decisions.
2. When experienced staff depart, the institutional knowledge in their heads departs with them, and the documents they wrote are scattered.

A RAG system can address both, but only if it is trustworthy on regulated, internal content. That meant the design constraint was non-obvious: the system should refuse to answer when it can't cite a source, rather than confabulate.

## What was built

An offline, citation-grounded RAG deployed on a local GPU workstation at the sponsor's office (so no document data leaves the building):

- **Hybrid retrieval.** FAISS dense vector search fused with BM25 via Reciprocal Rank Fusion, then a cross-encoder reranker for precision on top.
- **Ingestion pipeline.** Handles the document formats Morgan actually uses (not just PDFs in a single happy path), produces searchable embeddings, runs as a separate component from retrieval.
- **Citation enforcement.** Every AI-generated response carries citations to source documents. Responses that fail the grounding check are blocked before reaching the user. That is the policy that makes the system safe to deploy.
- **API + UI.** FastAPI REST backend with Server-Sent Events for token-by-token streaming. Chainlit interface for chat-style interaction. Both run on the local GPU workstation.
- **Evaluation harness.** Recall@K, nDCG@K, MRR, and per-model latency benchmarks across retrieval configurations so we could tune the hybrid weights against Morgan's actual document set, not against MS MARCO.

## Why "refuses to answer" is the load-bearing decision

The temptation in an RAG demo is to always have an answer. On regulated internal content the user's trust collapses the first time the system invents a paragraph that sounds authoritative. So the cost of being silent on an ungrounded query is much lower than the cost of being wrong. The blocking step on missing citations is a UX downgrade in 5% of queries that prevents a credibility downgrade across all of them.

## Stack

Python, FAISS, BM25, cross-encoder reranking, FastAPI, Chainlit, SSE, Docker.

## Where it ran

Local GPU workstation at Morgan's office. Featured at the Penn State Learning Factory Showcase.

## Links

- [Learning Factory showcase](https://sites.psu.edu/lfshowcasesp26/2026/04/29/knowledge-retrieval-system-for-technical-documents/)

Repository is private (academic capstone).
