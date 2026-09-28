"""Algorithm x retrieval factorial for CARGO, in the site palette.

Source data: Table IV of the ICTAI 2026 paper (Functional-Secure@1 on the
156-prompt test-equipped subset, Qwen2.5-Coder-1.5B).

    python3 scripts/figures/cargo_factorial.py
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

OUT = Path(__file__).resolve().parents[2] / "public" / "figures"

# (algorithm, SAST only, + R_RAG), top to bottom
ROWS = [
    ("GRPO", 8.6, 35.1),
    ("PPO", 10.5, 36.2),
    ("RLOO", 8.6, 33.7),
    ("RAFT", 7.9, 30.4),
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

    fig, ax = plt.subplots(figsize=(7.2, 3.6))
    fig.patch.set_alpha(0)
    ax.patch.set_alpha(0)

    ys = list(range(len(ROWS)))[::-1]

    for y, (name, base, rag) in zip(ys, ROWS):
        ax.plot(
            [base, rag],
            [y, y],
            "-",
            color=c["neutral"],
            linewidth=2,
            alpha=0.6,
            zorder=2,
        )
        ax.plot(
            [base],
            [y],
            "o",
            color=c["neutral"],
            markersize=8,
            markeredgecolor="none",
            zorder=4,
        )
        ax.plot(
            [rag],
            [y],
            "o",
            color=c["accent"],
            markersize=9,
            markeredgecolor="none",
            zorder=4,
        )
        ax.annotate(
            f"{base:.1f}",
            (base, y),
            textcoords="offset points",
            xytext=(-9, 0),
            ha="right",
            va="center",
            fontsize=8.5,
            color=c["muted"],
            family=FONT_MONO,
        )
        ax.annotate(
            f"{rag:.1f}",
            (rag, y),
            textcoords="offset points",
            xytext=(9, 0),
            ha="left",
            va="center",
            fontsize=8.5,
            color=c["muted"],
            family=FONT_MONO,
        )
        ax.annotate(
            f"+{rag - base:.1f} pp",
            ((base + rag) / 2, y),
            textcoords="offset points",
            xytext=(0, 7),
            ha="center",
            fontsize=8,
            color=c["muted"],
            family=FONT_MONO,
        )

    # Direct labels on the top row stand in for a legend.
    top = ys[0]
    _, base0, rag0 = ROWS[0]
    ax.annotate(
        "SAST only",
        (base0, top),
        textcoords="offset points",
        xytext=(0, 14),
        ha="center",
        fontsize=9,
        color=c["muted"],
        family=FONT_SANS,
    )
    ax.annotate(
        "+ retrieval reward",
        (rag0, top),
        textcoords="offset points",
        xytext=(0, 14),
        ha="center",
        fontsize=9,
        color=c["accent"],
        family=FONT_SANS,
        fontweight="600",
    )

    ax.set_yticks(ys)
    ax.set_yticklabels([r[0] for r in ROWS])
    ax.set_xlabel(
        "Functional-Secure@1 (%)",
        fontsize=9.5,
        color=c["muted"],
        family=FONT_SANS,
        labelpad=8,
    )

    for side in ("top", "right", "left"):
        ax.spines[side].set_visible(False)
    ax.spines["bottom"].set_color(c["rule"])
    ax.spines["bottom"].set_linewidth(0.8)

    ax.tick_params(axis="x", colors=c["muted"], labelsize=8.5, length=3, width=0.8)
    ax.tick_params(axis="y", colors=c["muted"], labelsize=9.5, length=0)
    for lbl in ax.get_xticklabels():
        lbl.set_family(FONT_MONO)
    for lbl in ax.get_yticklabels():
        lbl.set_family(FONT_SANS)

    ax.grid(True, axis="x", color=c["rule"], linewidth=0.5, alpha=0.55)
    ax.set_axisbelow(True)
    ax.set_xlim(0, 42)
    ax.set_ylim(-0.5, len(ROWS) - 0.2)

    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"cargo-factorial-{theme}.svg"
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
