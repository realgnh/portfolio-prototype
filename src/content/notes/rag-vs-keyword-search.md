---
title: RAG vs. plain keyword search on my course notes
date: 2026-11-18
summary: Placeholder note: a fair comparison, what surprised me, and when I'd still pick keyword search.
tags: AI, evaluation
---

*This is an example note. Replace it with your own write-up.*

I wanted to know whether retrieval-augmented generation actually beats a **plain keyword baseline** on my own course notes, or just sounds better.

## Setup

- 40 questions written before looking at either system's answers
- Keyword search: BM25 over paragraphs
- RAG: the same paragraphs, embedded, top-4 passages passed to a small model

## What I found

1. Keyword search won on exact-term questions ("What is the master theorem?").
2. RAG won on paraphrased questions, but invented details twice.
3. Showing the retrieved passages next to the answer fixed most trust issues.

```python
def score(answer, reference):
    return int(reference.lower() in answer.lower())
```

**Takeaway:** start with the boring baseline, measure, and make the AI show its sources.
