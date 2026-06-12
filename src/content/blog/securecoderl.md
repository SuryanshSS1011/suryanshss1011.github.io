---
title: "Scheduled Partial-Credit RL for Reliable Code Generation with Small Language Models (WIP)"
description: "A reliability-first RL framework for SLM code generation. Partial-credit functional reward, binary-to-partial curriculum, on DeepSeek-Coder-1.3B and APPS+. LCTES 2026."
date: 2026-05-30T12:00:00
tags: ["Research", "Reinforcement Learning", "Code Generation", "LCTES 2026"]
---

## The setup

Small language models (SLMs, under 1.5B parameters) are attractive for embedded and resource-limited development workflows. They run on single-GPU or CPU budgets and adapt without distributed training. The problem is reliability. Under a strict sandboxed judge that compiles and runs every generation against tests, a binary reward (1 if all tests pass, 0 otherwise) collapses every kind of failure into the same zero. Syntax errors, runtime crashes, missing output, partially passing tests: all indistinguishable from the policy's perspective.

When PPO trains against that signal on DeepSeek-Coder-1.3B, the model regresses *below* the supervised fine-tuning baseline. The gradient has nothing to climb.

## The reward

A joint objective with two terms:

$$ R(y) = \alpha \cdot R_{\text{func}}(y) + \beta \cdot R_{\text{sec}}(y), \quad \alpha = 0.6, \; \beta = 0.4 $$

**Functional reward (Table 1 in the paper).** A staged ladder that distinguishes near-miss outcomes:

| Stage | Condition | R_func |
|---|---|---|
| 0 | Syntax error / not parseable | 0.0 |
| 1 | Valid syntax | 0.2 |
| 2 | Executes without crash | 0.4 |
| 3 | Produces any stdout | 0.6 |
| 4 | Passes k of T tests | 0.6 + 0.4 · k/T |

A generation that crashes still earns 0.4. A generation that prints something but fails every test still earns 0.6. The signal is monotonic in the kind of correctness gain a small model can actually make, and PPO has a gradient to follow. The staged design follows potential-based reward shaping (Ng et al. 1999), which preserves the optimal policy under the final task objective.

**Security reward.** Static-analysis-based guardrail against unsafe shortcuts. Define a normalized severity score V from Bandit findings (HIGH = 1.0, MEDIUM = 0.5, LOW excluded since APPS+ requires stdin `input()` usage). Then:

$$ R_{\text{sec}} = \exp(-V) $$

Clean code yields R_sec = 1.0. Higher-severity findings reduce the reward smoothly.

## The numbers

DeepSeek-Coder-1.3B-Instruct, LoRA (r=16, α=32, 6.3M trainable parameters, 0.47% of total). SFT for 3 epochs to initialize PPO. 500 PPO episodes per variant, batch size 2, learning rate 1e-6, KL penalty λ=0.1 against the SFT reference. Single NVIDIA V100 16GB. Evaluation on 100 held-out APPS+ prompts.

Three PPO variants are compared:

- **PPO-simple** — binary reward, initialized from SFT
- **PPO-fresh** — partial credit, initialized from SFT
- **PPO-continue** — partial credit, initialized from the PPO-simple checkpoint

Results on 100 APPS+ prompts (~85 held-out):

| Model | Syntax % | ≥1-pass % | All-pass % | R̄ |
|---|---|---|---|---|
| SFT baseline | 44.0 | 3.0 | 1.0 | 0.40 |
| PPO-simple (binary) | 18.0 | 0.0 | 0.0 | 0.38 |
| PPO-fresh (partial, from SFT) | 27.0 | 2.0 | 0.0 | 0.40 |
| **PPO-continue (partial, from PPO-simple)** | **63.0** | **9.0** | **2.0** | **0.42** |

Bootstrap CIs: ±10% on syntax, ±6% on ≥1-pass.

## The result that mattered

PPO-simple (binary reward) does not just fail to improve, it *degrades* the policy: syntax validity drops from 44% to 18%. Sparse feedback on near-miss programs destabilizes a 1.3B policy that cannot bridge near-misses to correct solutions.

PPO-fresh (partial credit, from SFT) does not surpass PPO-simple within overlapping CIs (27% vs 18%). Partial-credit reward alone does not overcome the instability without an RL warmup phase. This was the surprising result.

PPO-continue (partial credit, warm-started from the PPO-simple checkpoint) is the winner: 63% syntax validity, 9% ≥1-pass, 2% all-pass. A binary-to-partial-credit *schedule* outperforms partial-credit training from scratch, consistent with curriculum learning (Bengio et al. 2009). This is the load-bearing finding.

The interpretation: the binary stage gives the policy a coarse but correct topology of the reward surface. The partial-credit stage then has somewhere to sharpen from. Skip the binary stage and the policy never finds the basin; the partial-credit signal alone is too distracted by intermediate rewards to converge on tests passing.

## The honest framing on security

Across 400 samples (100 prompts × 4 variants), Bandit returned zero MEDIUM or HIGH findings. So R_sec = 1.0 for every variant, and the joint reward R̄ provides almost no differentiation between them. The improvements in this paper are functional, not security-driven.

This is not a failure of the framework. It is a fact about the evaluation set: APPS+ is algorithmic, so vulnerability-eliciting prompts are rare. The security term is built in and waiting; an extended study with security-focused prompts will say more.

## Scale context

For reference, zero-shot baselines on the same stdin-style APPS+ at 7B-class scale:

| Model | Syntax % | Test Pass % | Sec. Clean % |
|---|---|---|---|
| DeepSeek-6.7B | 83.4 | 14.3 | 96.3 |
| CodeLlama-7B | 48.9 | 7.6 | 99.5 |
| StarCoder2-7B | 20.2 | 1.3 | 99.7 |

The scale gap (1.3B SFT at 44% syntax vs DeepSeek-6.7B at 83.4% zero-shot) is exactly the gap the framework is trying to close under the deployment constraint that you don't get a 6.7B model on a single GPU or CPU budget.

## What's next

The paper outlines four directions:

1. Scale to additional model families and a larger held-out evaluation.
2. Security-focused benchmarks that produce meaningful vulnerability signals (so R_sec actually moves).
3. Fine-grained security partial credit, mapping static-analysis findings to a vulnerability taxonomy (e.g., CWE), with staged credit for removing high-severity issues.
4. C code generation for embedded toolchains with C-focused analyzers, evaluated under resource-constrained compilation and execution.

This is where my current research direction is heading: causality-chain CWEs and safe/secure deployment of AI/ML systems are the natural continuation of the security half of the framework.

## Links

- [Paper (ACM DL, DOI 10.1145/3814943.3816167)](https://doi.org/10.1145/3814943.3816167) — LCTES 2026, Boulder, CO
- [GitHub: SecureCodeRL](https://github.com/SuryanshSS1011/SecureCodeRL)
- [Zenodo DOI: 10.5281/zenodo.19999642](https://doi.org/10.5281/zenodo.19999642)
- Patishnock Undergraduate Research Award winner at Penn State (Information Literacy)

Co-author: Suman Saha.
