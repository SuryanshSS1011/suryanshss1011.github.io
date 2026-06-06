---
title: "Match Your Loss to Your Cost: Asymmetric Losses and Conformal Capacity Bands for Backbone Traffic Forecasting"
description: "Backbone operators care about SLA violations and over-provisioning, not RMSE. A drop-in cost-aware loss and a conformal wrapper that cut realized cost up to +76% on Abilene at equal forecast accuracy. Submitted to CNSM 2026 (June 1, 2026)."
date: 2026-05-28T12:00:00
tags: ["Research", "Time Series", "Conformal Prediction", "Networks"]
---

## The objective mismatch

A backbone operator pays an asymmetric cost. Under-provisioning a link risks an SLA violation when demand exceeds capacity. Over-provisioning wastes capital and energy. These costs are rarely equal, and an SLA breach is typically far more expensive than a unit of idle headroom. Yet the traffic forecasters that feed capacity decisions are almost universally trained on symmetric accuracy losses (RMSE, MAE).

DOTE (NSDI '23) diagnosed this for traffic engineering: the metric the model optimizes is not the metric the operator pays. The consequence is measurable. A forecaster more accurate by RMSE can be *more* expensive to provision from. Two forecasters that tie on RMSE can differ several-fold in operational cost.

This paper closes that gap with two drop-in components: a cost-aware loss, and a conformal calibration layer. The architecture is held fixed across loss variants, so the contribution is unambiguously the loss and the calibration. Both plug into any existing forecaster unchanged.

## Three findings

Evaluated on Abilene, GÉANT, and CESNET-TimeSeries24 with an LSTM backbone over 20 seeds:

### 1. Match your loss to your cost

The operator-cost heatmap (training ratio × operator ratio) is diagonal-dominant: the best training α tracks the operator's α. Per-dataset cusp-linear best-vs-MSE peaks:

| Dataset | Best win vs MSE | Bootstrap 95% CI |
|---|---|---|
| Abilene | +76.2% at 100:1 | [+71.2, +80.8] |
| GÉANT | +75.4% at 100:1 | (all cells significant) |
| CESNET | +53.9% at 100:1 | (all cells significant) |

The rule is a one-line recipe with no new hyperparameters: train at the operator's own α:β. The Pareto frontier (overload rate vs over-provisioning cost) shows MSE sits above-right of the frontier, so every asymmetric operating point dominates it.

### 2. The loss formulation matters, not just its ratio

A squared asymmetric surrogate (αmax(y−ŷ,0)² + βmax(ŷ−y,0)²) *collapses* on heavy-tailed traffic. On GÉANT, where per-link loads span five orders of magnitude, MSE beats squared-asymmetric at every operator from 1:1 through 20:1. The only nominal squared-asym win (+29.8% at 100:1) is not statistically significant.

The cusp-linear (L1) surrogate is robust on the same data: +62.7% to +75.4% at every operator, all significant.

This is principled, not just empirical. The theory of consistent scoring rules (Gneiting 2011) says the asymmetric linear loss is the canonical consistent scoring rule for the conditional τ-quantile of the load distribution, with τ = α/(α+β). That is exactly the quantity a peak-with-margin capacity rule needs. The squared asymmetric loss is not consistent for any quantile; its Bayes-optimal forecast is a weighted conditional mean whose deviation from the mean grows with the local error variance (Christoffersen and Diebold 1997). On heavy-tailed traffic that amplifies into the collapse measured on GÉANT.

The safe deployment recipe: use cusp-linear, match α to the operator's cost ratio.

### 3. ACI gives an online SLA-coverage guarantee, CQR does not (always)

Split CQR assumes exchangeability between calibration and test windows. Streaming traffic is not exchangeable, so CQR under-covers on bursty links. Adaptive Conformal Inference (ACI) adjusts the band width online and gives an asymptotic coverage guarantee under arbitrary drift.

Empirical coverage at three target levels (LSTM, 20 seeds):

| Dataset | Target | CQR coverage | ACI coverage |
|---|---|---|---|
| Abilene | 0.95 | 0.886 | **0.947** |
| Abilene | 0.90 | 0.844 | **0.895** |
| GÉANT | 0.95 | **0.951** | 0.938 |
| GÉANT | 0.90 | **0.911** | 0.878 |
| CESNET | 0.95 | 0.949 | **0.947** |
| CESNET | 0.90 | 0.871 | **0.893** |

Across the full table, ACI's across-seed coverage standard deviation is 30 to 200× smaller than CQR's. ACI converges to a deterministic online operating point; CQR inherits calibration-set sampling noise.

The operational consequence is more interesting than the raw coverage numbers. At the 0.95 target:

- **Cost winner is dataset-dependent.** ACI is 7.6% cheaper on GÉANT. CQR is 30.8% cheaper on Abilene and 47.4% cheaper on CESNET.
- **Overload winner is uniformly ACI.** Overload rate is 3.8× lower on CESNET, 9.1× lower on GÉANT, and **155× lower on Abilene**.

For an operator whose SLA penalty is one-sided, ACI is the SLA-conservative choice. CQR is the cost-aggressive one.

## Cross-architecture verification

A natural reviewer concern: is the L1 win an LSTM artifact? The matched-cell win at operator α:β = 5:1, prediction-level cost:

| Architecture | Dataset | win vs MSE | 95% CI |
|---|---|---|---|
| LSTM | Abilene | +50.6% | [+43.6, +56.4] |
| LSTM | GÉANT | +63.9% | [+38.0, +80.8] |
| LSTM | CESNET | +5.5% | [+4.2, +6.5] |
| DLinear | Abilene | +30.2% | [+25.4, +35.2] |
| DLinear | GÉANT | **+96.7%** | [+95.9, +97.3] |
| DLinear | CESNET | +17.6% | [+17.3, +17.9] |
| iTransformer | Abilene | +28.3% | [+25.4, +31.2] |
| iTransformer | GÉANT | +78.9% | [+71.2, +84.6] |
| iTransformer | CESNET | +18.9% | [+18.5, +19.4] |

The diagonal-dominant pattern reproduces on both non-LSTM architectures across the full 6×6 operator-vs-training matrix. The DLinear gain on GÉANT is the largest anywhere because DLinear's MSE baseline is the most exposed to the heavy-tailed cost-aggregation problem, and the cusp-linear loss largely removes that exposure. The smallest gain is on Abilene, where the link-load distribution is light-tailed enough that MSE is already close to cost-optimal.

Two takeaways. The recipe is not LSTM-specific. The magnitude of the gain is dataset-driven (heavy-tail wins are large, light-tail wins are modest) rather than architecture-driven.

## Equivalence to a pinball-trained baseline

The cusp-linear surrogate is, up to a constant factor α+β, the pinball loss at quantile τ = α/(α+β). Under Adam's adaptive gradient normalization the two losses produce statistically indistinguishable forecasts: matched-cell Wilcoxon p-values of 0.60, 0.45, 0.35 on the three datasets. So the contribution is *not* a separately-named baseline against quantile regression. It is the operationalization of the cost-aware quantile recipe end-to-end: cost-aware training, calibrated SLA coverage, on three real backbones, across multiple architectures.

## Sanity checks

The paper runs four checks against over-reading the result:

1. **Symmetric corner recovers MSE.** Setting α=β=1 in the squared surrogate *is* MSE algebraically, so the 1:1 training cell and the MSE baseline should be indistinguishable. They are.
2. **Over-asymmetric training is bidirectionally costly.** A 100:1-trained model evaluated against a 1:1 operator is +98% worse than MSE on Abilene and +1715% worse on GÉANT. Match the ratio, do not just crank α.
3. **Identity-forecast oracle test.** A unit test feeds synthetic sinusoidal traffic with ŷ=y through the capacity layer and checks the returned overload, utilization, and asymmetric cost equal the oracle values to floating-point tolerance.
4. **Train-only normalization verified seed-by-seed.** A separate test confirms that persisted normalization statistics match the recomputed train-only statistics on all 20 seeds across all three datasets. This rules out a class of train-time leakage that would otherwise silently inflate every coverage number.

## Significance and protocol

- 20 seeds per cell. Paired-bootstrap CIs (2000 resamples) on win-percentage vs the seed-matched MSE baseline.
- Holm-corrected paired Wilcoxon test per operator.
- Nemenyi critical-difference diagrams across operator settings. On GÉANT under the cusp-linear loss, MSE is isolated at the worst rank, beyond the critical difference from the best asymmetric ratios.
- 20 seeds was chosen because the Wilcoxon signed-rank test cannot clear Holm correction with fewer than ~8 seeds regardless of effect size.

## Deployment cost

The cost-aware loss adds *no* training overhead over the MSE baseline (the cusp-linear surrogate is, if anything, a single arithmetic operation simpler than squared MSE). The conformal layer is pointwise on the existing forecast. Per-seed wall-clock on a consumer laptop (Apple Silicon, MPS):

| Architecture | Abilene | GÉANT | CESNET |
|---|---|---|---|
| LSTM | ~10s | ~12s | ~40s |
| DLinear | ~25s | ~42s | ~30s |
| iTransformer | ~20s | ~22s | ~25s |
| DCRNN | ~120s | ~45s | ~50s |

The lightest architectures finish in sub-minute time per seed. The recipe scales *down* to constrained hardware, which makes it deployable on commodity infrastructure where transformer-class models are impractical and operators cannot reasonably train hyperscaler-class models per link.

## Honest limitations

- **When the cusp-linear recipe might fail.** If over-provisioning carries a hard absolute ceiling (a power budget, a regulatory cap), the operator's true cost is closer to a hinge with a barrier than to the linear α:β surrogate. Asymmetric Huber is the natural next step. If the link-load distribution is so concentrated that a single very large link dominates regardless of normalization (extreme east-west skew on a hyperscaler backbone), the L1 robustness story does not necessarily transfer. We do not see this on our three datasets but cannot rule it out.
- **Distribution shift beyond ACI's regime.** ACI guarantees average coverage under arbitrary drift, but the test windows are within-day splits of a single contiguous trace. Large non-stationary shocks (fiber cut, multi-month seasonality, cross-region capacity rebalancing) are not represented in the three datasets at the granularity sampled. The parameter-free DtACI variant is the natural extension.
- **Capacity model is simple.** Peak-with-margin rule and a single held-out calibration split. Time-varying capacity, joint routing-and-capacity co-design, link-level cost heterogeneity, and online recalibration cadence are orthogonal extensions that compose naturally with the loss and the conformal layer because both operate pointwise on the forecast.

## What's next

The paper explicitly outlines: a regret bound linking conformal miscoverage to realized operational cost (rather than just to coverage), asymmetric Huber for operators with hard over-provisioning ceilings, cross-topology generalization across the Topology Zoo subgraph family, and extending the conformal layer evaluation to non-LSTM backbones.

## Links

- Submitted to CNSM 2026 on June 1, 2026
- [GitHub: match-loss-to-cost](https://github.com/SuryanshSS1011/match-loss-to-cost) — code, configs, seed lists, trained checkpoints
- [HuggingFace dataset: per-seed predictions](https://huggingface.co/datasets/SuryanshSS1011/match-loss-to-cost-predictions) — 3,500+ per-seed forecast .npz files (every table and figure reproducible without retraining)
- [HuggingFace: model checkpoints](https://huggingface.co/SuryanshSS1011/match-loss-to-cost-checkpoints)
