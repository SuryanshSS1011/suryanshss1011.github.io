---
title: "Continuous Retrieval-Grounded Reward Design for Secure Code Generation on Small Language Models (CARGO)"
description: "SAST-only RL stalls on small code models because every early rollout scores the same zero. A continuous retrieval-grounded reward restores the gradient: +26.5 pp Functional-Secure@1 over SAST-only GRPO across 19 CWEs. ICTAI 2026."
date: 2026-09-28T12:00:00
venue: "ICTAI 2026"
tags: ["Research", "Reinforcement Learning", "Code Generation", "Security", "ICTAI 2026"]
---

## The setup

The natural training signal for secure code generation is the verdict of a static analyzer (SAST). CodeQL, Semgrep, Bandit, and Cppcheck are production-grade, language-aware, and free of the biases a learned reward model brings. Code assistants that run in editors and CI pipelines are also increasingly small models, in the 1 to 3 billion parameter range, because latency and on-device budgets rule out anything larger.

Put those two facts together and RL breaks. On a small base policy most early rollouts do not parse. A non-parsing rollout earns zero security reward, so nearly every rollout in a group scores the same zero. That is fatal for group-relative optimizers like GRPO, which normalize each rollout's reward against its group:

$$ A_i = \frac{r_i - \bar r}{\sigma_r + \epsilon} $$

When every $r_i$ is the same, $\sigma_r \to 0$, every advantage collapses toward zero, and so does the gradient. This is not a numerical edge case. It is the normal state of early training, before the policy has learned to compile.

## Measuring the collapse

The trainer was instrumented to log, per step, the within-group reward spread and whether the policy loss was nonzero at all. A nine-configuration sweep then ran on Qwen2.5-Coder-1.5B with a SAST-only reward, varying the algorithm, the gradient weighting, and SFT warm-starting.

The failure signature was universal. Six GRPO variants sat at a zero-variance-group rate of 0.91 ± 0.01, meaning 91% of steps had a group spread below 0.01, and updated the policy on only 7.5% ± 1.2 pp of steps. RLOO did no better at 6.7%. PPO without a value head and RAFT did produce gradients, but neither improved: PPO pushed every completion down, and RAFT self-distilled on an arbitrary top-k because its reward was constant.

The lesson was that no optimizer-side fix would be enough. Removing or flooring the $\sigma_r$ division stops it from amplifying noise, but it does not change a reward distribution that is a point mass. The variance has to be created at the reward source.

## The recipe

CARGO (Continuous Augmented Retrieval-Grounded Objective) has three components.

**1. A continuous retrieval-grounded reward.** For each training prompt, a hybrid BM25 + bge-base retriever pulls the top secure-fix exemplar $e^+$ for the prompt's CWE. The exemplars come from the fix side of CVEfixes and DiverseVul commits, Juliet known-good cases, and authored design pairs for the under-supplied authorization CWEs. The reward is the cosine between the completion and that exemplar, with a copy guard:

$$ R_{\text{RAG}}(y, e^+) = \cos\big(\phi(y), \phi(e^+)\big) \cdot \mathbb{1}\big[\cos(\phi(y), \phi(e^+)) \le 0.95\big] $$

It is deliberately *not* the security decision. That stays with the SAST reward. $R_{\text{RAG}}$ is a dense, per-prompt prior that moves smoothly as the completion moves, so rollouts in the same group stop tying. The 0.95 guard stops the policy from memorizing exemplars.

**2. CWE-aware per-prompt reweighting.** The training pool is imbalanced by about two orders of magnitude across CWEs. A uniform pass would spend the gradient on buffer overflows, XSS, and SQL injection and skip missing authorization entirely. A damped inverse-frequency weight, $w(x) \propto (|C|/n_{c(x)})^{0.5}$, rebalances it.

**3. A σ-floor on the normalizer.** Dividing by $\max(\sigma_r, 0.05)$ instead of $\sigma_r$ bounds the low-variance bias that Dr. GRPO identified, without removing the normalizer.

The per-rollout reward composes these additively with a staged reliability reward from [the earlier LCTES work](/blog/securecoderl/) and a stub penalty:

$$ r_i = 0.3\,R_{\text{sec}} + 0.7\,R_{\text{rel}} + 0.1\,R_{\text{RAG}} - 1.5\cdot\mathbb{1}[\text{stub}] $$

Additive rather than multiplicative, because $R_{\text{sec}} \cdot R_{\text{RAG}}$ would be zero whenever $R_{\text{sec}}$ is uniformly zero, which is exactly the collapse the retrieval term is there to fix. The stub penalty matters too. Without it, the policy learns that an empty function body has no SAST findings.

## The numbers

Evaluation uses 1,582 prompts covering 19 CWEs in Python (557), C (564), and C++ (461), drawn from Juliet 1.3, CyberSecEval, SecCodePLT, CASTLE, SecurityEval, and CWEval. The pool is prompt-level disjoint from training, and a near-duplicate audit found no train/eval pair above 0.43 Levenshtein ratio. Functional-Secure@1 (passes unit tests *and* SAST) is measured on the 156-prompt subset that has unit tests.

| System | Compile@1 | Secure@1\|Compile | Func-Sec@1 |
|---|---|---|---|
| Qwen2.5-Coder-1.5B (base) | 55.7 | 90.2 | 21.8 |
| Qwen2.5-Coder-7B (base) | 56.2 | 89.8 | 23.1 |
| SVEN (CodeGen-2.7B) | 35.3 | 98.4 | 7.7 |
| SecCoder-X (Qwen2.5-Coder-7B) | 56.4 | 93.5 | 23.1 |
| SFT-only (full fine-tune) | 50.5 | 85.4 | 14.7 |
| GRPO + SAST only | 40.2 | 78.8 | 8.6 |
| **CARGO (1.5B)** | **60.1** | **95.4** | **35.1** |

Over SAST-only GRPO that is +19.9 pp Compile@1, +16.6 pp Secure@1|Compile, and +26.5 pp Functional-Secure@1. Across three seeds Func-Sec@1 is 35.1 ± 0.4. On the collapse metric itself, adding $R_{\text{RAG}}$ drops the zero-variance-group rate from 0.91 to 0.05 and lifts the nonzero-loss rate to 94.8%. It was the only configuration in the sweep that trained.

## The result that mattered

The retrieval reward is not a GRPO trick. A 4 × 2 factorial repeats the recipe with and without $R_{\text{RAG}}$ on four algorithms:

| Algorithm | SAST only | + R_RAG | Δ |
|---|---|---|---|
| GRPO | 8.6 | 35.1 | +26.5 |
| PPO (value head) | 10.5 | 36.2 | +25.7 |
| RLOO | 8.6 | 33.7 | +25.1 |
| RAFT | 7.9 | 30.4 | +22.5 |

All four gains fall within 4 pp of each other, and every +R_RAG Wilson interval sits above every SAST-only one. The reward carries the effect, not the estimator. The ordering makes sense too: PPO's value head partly compensates for sparsity, so it starts higher and gains slightly less, while RAFT only uses ranks, so the continuous signal helps it least.

The gains also reproduce off the main model. Qwen2.5-Coder-3B goes from 20.5 to 41.4 Func-Sec@1, and StarCoder2-3B, flagged before evaluation as a likely negative, goes from 7.1 to 26.3.

Three controls say where the gain comes from:

- **Reward-time vs inference-time retrieval.** Prepending the same exemplar to the prompt of the untrained model adds at most 2.5 pp. The security signal travels through the training gradient, not through the retrieved text.
- **CWE-matched vs random retrieval.** Random exemplars score 21.7 against 35.1. A within-CWE adversarial (lowest-ranked) exemplar lands in between at 30.3.
- **Continuous vs binary.** A binary reward that also consults the vulnerable version scores 25.7. It carries the secure-vs-vulnerable direction the cosine lacks, yet early in training it left 36% of groups tied and updated on 64% of steps, against 6% and 94% for the continuous reward. Continuity helps mainly by keeping groups from tying.

## Two negative results worth keeping

**SFT makes it worse.** Supervised fine-tuning on the same training pool strictly degrades the 1.5B base policy on all three metrics (Func-Sec@1 21.8 → 14.7). It holds across LoRA ranks from 16 to 512 and full fine-tuning, while validation loss improves. At this scale, fitting secure-fix substitutions seems to evict compile competence and teach the shape of a substitution rather than the security property. SFT is still useful as an RL initializer, where it cuts the early stub rate from 10–21% to about 1.4%.

**The cosine is a weak security judge.** Offline, the cosine reward scores an exemplar's vulnerable twin between +0.84 and +1.00, because a one-line fix barely moves the embedding. A fix-direction projection, $\phi(e^+) - \phi(e^-)$, separates secure from vulnerable code far better (Juliet AUC 0.96 vs 0.79) and supplies more within-group variance. It is the reward to adopt in the next iteration. No variant transfers a security verdict to novel functions on PrimeVul (AUC ≈ 0.50), which is why the retrieval reward composes with the SAST verdict rather than replacing it.

## The honest framing

- The comparisons were sized for a 15 pp minimum detectable effect. The gains over SAST-only and every +R_RAG gain in the factorial clear it. The gains over the base policy (+4.4, +5.2, +13.3 pp) and the component and retrieval-design differences do not, so those are observed differences, not detected effects.
- The same analyzers supply the training reward and the evaluation metric, so Secure@1|Compile measures security as CodeQL, Semgrep, Bandit, and Cppcheck define it. A vulnerability they miss goes unpenalized.
- Functional-Secure@1 is Python-only, because unit tests exist only for that subset. It does not cover the C/C++ memory-safety CWEs.
- Held-out CWE transfer (CWE-328 weak hash, CWE-798 hard-coded credentials) points the right way, but the intervals at n = 62 and n = 139 are 14 to 22 pp wide.

## What's next

1. Find the SLM/LLM crossover where variance collapse disappears and SAST-only recipes become competitive.
2. Extend the benchmark and training pool to JavaScript and Java.
3. Pair the security signal with an execution-based functional reward beyond the test-equipped subset.
4. Schedule $\lambda_{\text{rag}}$ adaptively against the within-group spread of $R_{\text{sec}}$ alone.

## Links

- [GitHub: SecureCodeRL-RAG](https://github.com/SuryanshSS1011/SecureCodeRL-RAG)
- [Zenodo DOI: 10.5281/zenodo.23008092](https://doi.org/10.5281/zenodo.23008092)
- Prior work: [Scheduled Partial-Credit RL for Reliable Code Generation with Small Language Models (WIP)](/blog/securecoderl/), LCTES 2026

Co-authors: Medhansh Kumar Singla and Suman Saha. Experiments ran on the Penn State ICDS ROAR cluster.
