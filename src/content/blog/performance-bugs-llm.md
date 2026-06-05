---
title: "Fixing performance bugs through LLM explanations"
description: "Training an LLM to explain a performance bug, not just classify it, produces a stronger detection signal. 490-bug dataset, fine-tuned GPT-4o-mini, IEEE AITest 2025."
date: 2026-05-15T12:00:00
tags: ["Research", "LLM", "Software Engineering", "AITest 2025"]
---

## The idea

Most LLM-based bug detectors are trained as classifiers: input code, output a label. The deeper question is whether the *explanation* the model would produce is itself a useful training signal. If you fine-tune a model to produce a natural-language explanation alongside the prediction, does the explanation lift detection accuracy, or does it just look nicer?

For Java performance bugs the answer is yes, by a meaningful margin.

## The dataset

The dataset is the load-bearing contribution. 490 performance bugs extracted from 17 Defects4J projects, organized into a 5-category taxonomy:

- Algorithmic
- Memory
- CPU
- Redundant computation
- I/O

Standard 80/20 train/test split (392 / 98). The extraction scripts and the full reproduction stack are public.

## The result

Fine-tuned GPT-4o-mini against the dataset to produce explanations alongside predictions:

| Metric | Baseline | After fine-tuning |
|---|---|---|
| Detection accuracy | 67.3% | **83.7%** |
| F1 | 64.6% | **82.3%** |

The lift is consistent across the five categories. The explanation isn't decoration; it appears to act as a richer training target than the label alone.

## What's in the repo

- Dataset with per-category splits
- Extraction scripts for Defects4J
- Categorization pipeline
- Explanation-generation pipeline
- Fine-tuning code for GPT-4o-mini
- Evaluation harness with F1, precision, recall per category
- Performance-validation tools (run the fix, measure whether it actually improves performance)
- Project website and conference presentation

## Published at

[IEEE AITest 2025](https://doi.org/10.1109/AITest66680.2025.00020) (7th IEEE International Conference on Artificial Intelligence Testing). 31.6% acceptance rate.

## Links

- [Paper (IEEE Xplore)](https://doi.org/10.1109/AITest66680.2025.00020)
- [Project site](https://suryanshss1011.github.io/Performance-Bugs-LLM)
- [GitHub](https://github.com/SuryanshSS1011/Performance-Bugs-LLM)
- [Zenodo DOI](https://doi.org/10.5281/zenodo.20113202)

This was peer-reviewed work with my advisor Suman Saha. The repo has the most complete documentation of any of my projects; if you want depth, start there.
