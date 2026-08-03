"""Accuracy vs cloud-cost tradeoff for Tollgate, in the site palette.

Source data: the results table in SuryanshSS1011/edge-inspection-agent README
(MVTec industrial data, six categories).

    python3 scripts/figures/tollgate_tradeoff.py
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

OUT = Path(__file__).resolve().parents[2] / "public" / "figures"

# (label, cloud cost as share of cloud-only, accuracy, is_ours)
POINTS = [
    ("Local-only", 0.00, 0.951, False),
    ("Hybrid", 0.57, 0.988, True),
    ("Cloud-only", 1.00, 0.992, False),
]

FONT_SANS = "Geist, Inter, system-ui, sans-serif"
FONT_MONO = "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"

THEMES = {
    "light": {
        "muted": "#6b6157",
        "rule": "#c9c0b4",
        "accent": "#b4471f",
        "neutral": "#9a9086",
    },
    "dark": {
        "muted": "#a39a8d",
        "rule": "#3e372e",
        "accent": "#d97a4a",
        "neutral": "#6f665b",
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

    ax.plot(xs, ys, "-", color=c["neutral"], linewidth=1.2, alpha=0.7, zorder=2)

    for label, x, y, ours in POINTS:
        ax.plot(
            [x],
            [y],
            "o",
            color=c["accent"] if ours else c["neutral"],
            markersize=9 if ours else 6,
            markeredgecolor="none",
            zorder=4,
        )
        dy = 15 if ours else -20
        ax.annotate(
            label,
            (x, y),
            textcoords="offset points",
            xytext=(0, dy),
            ha="center",
            fontsize=9.5,
            color=c["accent"] if ours else c["muted"],
            family=FONT_SANS,
            fontweight="600" if ours else "normal",
            zorder=6,
        )
        ax.annotate(
            f"{y:.3f}",
            (x, y),
            textcoords="offset points",
            xytext=(0, dy + (13 if ours else -13)),
            ha="center",
            fontsize=8.5,
            color=c["muted"],
            family=FONT_MONO,
            zorder=6,
        )

    # The whole argument, stated once in the gap between hybrid and cloud-only.
    ax.annotate(
        "43% less cloud spend,\n0.004 accuracy given up",
        (0.785, 0.990),
        textcoords="offset points",
        xytext=(0, -46),
        ha="center",
        fontsize=8.5,
        color=c["muted"],
        family=FONT_SANS,
        style="italic",
        zorder=6,
    )

    ax.set_xlabel(
        "Cloud spend, share of cloud-only",
        fontsize=9.5,
        color=c["muted"],
        family=FONT_SANS,
        labelpad=8,
    )
    ax.set_ylabel(
        "Accuracy", fontsize=9.5, color=c["muted"], family=FONT_SANS, labelpad=8
    )

    ax.xaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v * 100:.0f}%"))
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v:.2f}"))

    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color(c["rule"])
        ax.spines[side].set_linewidth(0.8)

    ax.tick_params(colors=c["muted"], labelsize=8.5, length=3, width=0.8)
    for lbl in ax.get_xticklabels() + ax.get_yticklabels():
        lbl.set_family(FONT_MONO)

    ax.grid(True, axis="y", color=c["rule"], linewidth=0.5, alpha=0.55)
    ax.set_axisbelow(True)
    ax.set_xlim(-0.09, 1.12)
    ax.set_ylim(0.940, 1.001)

    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"tollgate-tradeoff-{theme}.svg"
    fig.savefig(path, format="svg", bbox_inches="tight", transparent=True)
    plt.close(fig)

    svg = path.read_text()
    for stack in (FONT_SANS, FONT_MONO):
        svg = svg.replace(f"font-family: '{stack}'", f"font-family: {stack}")
    path.write_text(svg)
    return path


if __name__ == "__main__":
    for theme in THEMES:
        print("wrote", render(theme))
