"""Cost/overload Pareto frontier for the match-loss-to-cost work, in the site palette.

Source data: results/abilene_pareto_asym/summary.json in SuryanshSS1011/match-loss-to-cost
(DLinear sweep on Abilene; the public repo carries the full ratio sweep for
DLinear and iTransformer, LSTM only at the matched 5:1 cell).

Emits a light and a dark SVG to public/figures/. Text is left as real text
(svg.fonttype = 'none') so it inherits the site's webfonts and stays selectable.
Captions live in the page, not in the image.

    python3 scripts/figures/pareto_frontier.py
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

OUT = Path(__file__).resolve().parents[2] / "public" / "figures"

# (ratio label, over-provisioning cost, overload rate) — DLinear, Abilene, 20 seeds.
POINTS = [
    ("1:1", 987.6e6, 0.0001486),
    ("2:1", 1064.9e6, 0.0000224),
    ("5:1", 1188.1e6, 0.0000080),
    ("10:1", 1315.3e6, 0.0000052),
    ("20:1", 1472.6e6, 0.0000050),
    ("100:1", 1961.8e6, 0.0000007),
]
MSE = (987.6e6, 0.0001486)

FONT_SANS = "Geist, Inter, system-ui, sans-serif"
FONT_MONO = "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"

THEMES = {
    "light": {
        "ink": "#1a1a1a",
        "muted": "#6b6157",
        "rule": "#c9c0b4",
        "accent": "#b4471f",
    },
    "dark": {
        "ink": "#ede7d9",
        "muted": "#a39a8d",
        "rule": "#3e372e",
        "accent": "#d97a4a",
    },
}


def render(theme: str) -> Path:
    c = THEMES[theme]
    plt.rcParams["svg.fonttype"] = "none"

    fig, ax = plt.subplots(figsize=(7.2, 4.05))
    fig.patch.set_alpha(0)
    ax.patch.set_alpha(0)

    xs = [p[1] for p in POINTS]
    ys = [p[2] for p in POINTS]

    ax.set_yscale("log")

    # Frontier: the swept training ratios.
    ax.plot(xs, ys, "-", color=c["accent"], linewidth=1.6, zorder=3, alpha=0.9)
    ax.plot(
        xs, ys, "o", color=c["accent"], markersize=6, markeredgecolor="none", zorder=4
    )

    # MSE baseline. It coincides with the 1:1 point by construction
    # (alpha = beta = 1 recovers MSE), so it is drawn as a hollow ring around it
    # and labelled once, together with that point, rather than twice.
    ax.plot(
        [MSE[0]],
        [MSE[1]],
        "o",
        markerfacecolor="none",
        markeredgecolor=c["muted"],
        markeredgewidth=1.6,
        markersize=14,
        zorder=5,
    )

    # Point labels. The frontier decreases monotonically left to right, so the
    # region up-and-right of any point is guaranteed clear of the curve — both
    # the incoming segment (up-left) and the outgoing one (down-right) fall
    # away from it. Labelling every point in that one direction is what keeps
    # text off the line; the previous per-point offsets pointed in three
    # different directions and two of them aimed straight into it.
    LABEL_OFFSET = (10, 9)
    labels = {
        "1:1": "1:1 · MSE baseline",
        "2:1": "2:1",
        "5:1": "5:1",
        "10:1": "10:1",
        "20:1": "20:1",
        "100:1": "100:1",
    }
    for key, x, y in POINTS:
        # The ring around 1:1 is larger than the plain markers, so its label
        # clears the ring rather than the marker.
        dx, dy = (16, 11) if key == "1:1" else LABEL_OFFSET
        ax.annotate(
            labels[key],
            (x, y),
            textcoords="offset points",
            xytext=(dx, dy),
            fontsize=8.5,
            color=c["muted"],
            family=FONT_MONO,
            zorder=6,
        )

    # Bottom-left. With a decreasing curve running from the top-left corner to
    # the bottom-right, that corner is the one large region no data occupies —
    # and it is where the note is pointing anyway.
    ax.annotate(
        "lower-left is better",
        (0.015, 0.05),
        xycoords="axes fraction",
        ha="left",
        fontsize=8.5,
        color=c["muted"],
        family=FONT_SANS,
        style="italic",
    )

    ax.set_xlabel(
        "Mean over-provisioning cost",
        fontsize=9.5,
        color=c["muted"],
        family=FONT_SANS,
        labelpad=8,
    )
    ax.set_ylabel(
        "Mean overload rate",
        fontsize=9.5,
        color=c["muted"],
        family=FONT_SANS,
        labelpad=8,
    )

    ax.xaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v / 1e9:.1f}B"))
    ax.yaxis.set_major_formatter(
        FuncFormatter(lambda v, _: f"{v * 100:g}%" if v > 0 else "0")
    )

    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color(c["rule"])
        ax.spines[side].set_linewidth(0.8)

    ax.tick_params(colors=c["muted"], labelsize=8.5, length=3, width=0.8)
    for lbl in ax.get_xticklabels() + ax.get_yticklabels():
        lbl.set_family(FONT_MONO)

    ax.grid(True, which="major", color=c["rule"], linewidth=0.5, alpha=0.55)
    ax.set_axisbelow(True)

    ax.set_xlim(0.90e9, 2.18e9)

    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"pareto-frontier-{theme}.svg"
    fig.savefig(path, format="svg", bbox_inches="tight", transparent=True)
    plt.close(fig)

    # matplotlib quotes the whole stack as one family name ('A, B, C'), which a
    # browser reads as a single face and so never reaches the fallbacks. Unquote
    # so the CSS font stack resolves normally.
    svg = path.read_text()
    for stack in (FONT_SANS, FONT_MONO):
        svg = svg.replace(f"font-family: '{stack}'", f"font-family: {stack}")
    path.write_text(svg)
    return path


if __name__ == "__main__":
    for theme in THEMES:
        print("wrote", render(theme))
