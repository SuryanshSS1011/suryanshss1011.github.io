export const site = {
  name: "Suryansh Sijwali",
  // Subtitle pairs affiliation with focus for instant identity. Renders italic.
  subtitle: "Honors undergraduate in Computer Science & Engineering at Penn State",
  // Real publication credits only. Renders as a small muted line under the subtitle.
  credentials: "IEEE AITest 2025 · LCTES 2026 · ICTAI 2026 · Patishnock Undergraduate Research Award",
  // Editorial closing line. Renders after the status block as its own moment.
  closingLine: "Driven by a passion for research, engineering, and open science.",
  // og:description, used for social unfurls when no per-page override is set.
  description: "Suryansh Sijwali, honors undergraduate in Computer Science & Engineering at Penn State. My work centers on AI/ML systems and static analysis, and their safe, secure, and reliable deployment. IEEE AITest 2025, LCTES 2026, ICTAI 2026.",
  // Kept for backwards compatibility with any code that imports site.title.
  title: "Research, engineering, and open science",
  url: "https://suryanshss1011.github.io",
  social: {
    github: "https://github.com/SuryanshSS1011",
    linkedin: "https://linkedin.com/in/suryansh-sijwali",
    email: "suryansh.sijwali@gmail.com",
    orcid: "https://orcid.org/0009-0005-7739-1657",
    scholar: "https://scholar.google.com/citations?user=aEkJyD0AAAAJ&hl=en"
  }
};

export const about = {
  currently: "Causality-aware RL and alignment problems.",

  // One line, at the foot of the home page. The old two-paragraph bio said
  // "passionate about building intelligent systems at the intersection of" and
  // was the weakest copy on the site; the work above it now does that job.
  openSource: "Astral, Infer, Hugging Face, PyTorch.",

  education: {
    degree: "B.S. Computer Science",
    institution: "Penn State University",
    graduation: "Expected May 2027",
    colleges: ["Schreyer Honors College", "College of Engineering", "Eberly College of Science"],
    minors: ["Mathematics", "Computer Engineering", "Computational Cybersecurity"]
  },

  interests: ["AI/ML Research", "Full-Stack Development", "Systems Design", "Open Source"]
};

export type ProjectLink = { label: string; url: string };

export type ProjectImage = { src: string; alt: string };

/**
 * A figure earns a card; everything else is a row. Two kinds, because research
 * and builds show different things and flattening them into one treatment makes
 * a measured result read as decoration.
 *
 * `figure`   — an argument. A plot that makes a claim, framed, with a caption in
 *              the register of a paper figure.
 * `artifact` — the thing itself. A screenshot or diagram, bleeding to the card
 *              edge with no frame, and one line of orientation rather than a claim.
 *
 * Both take an optional `srcDark`; without one, the image sits on a light paper
 * ground in both themes so a figure drawn for white paper never floats on black.
 * Regenerate the plots with `scripts/figures/*.py`.
 *
 * A card figure must be legible at 700px with no zooming. Architecture diagrams
 * and dense heatmaps fail that test and belong in the writeup instead.
 */
export type ProjectFigure =
  | { kind: 'figure'; src: string; srcDark?: string; alt: string; caption: string }
  | { kind: 'artifact'; src: string; srcDark?: string; alt: string; note?: string };

export type Project = {
  title: string;
  role: string;
  // Short venue or context for the index-row rail ("LCTES 2026", "Open source").
  // Falls back to `badge` when absent. Keep it to two or three words.
  venue?: string;
  period?: string;
  badge?: string;
  // One plain sentence: what this is, readable by someone outside the subfield.
  // Everything that needs jargon goes in `highlights`, which only the detail
  // pages render.
  summary: string;
  highlights: string[];
  stack: string[];
  links: ProjectLink[];
  sourceNote?: string;
  current: boolean;
  category: 'research' | 'engineering';
  // Surfaced on the home index. Keep this list short — the home page is an
  // index, not a portfolio dump.
  featured?: boolean;
  image?: ProjectImage;
  figure?: ProjectFigure;
};

/**
 * Ordered most-recent first. Order is by recency, never by whether an item has
 * a figure — a row sitting above a card is correct, and keeps card-vs-row
 * reading as "this one has something to show" rather than "this one matters more".
 */
export const projects: Project[] = [
  {
    title: "Exhibit A",
    role: "Evidence engine for AI code review",
    venue: "Open source",
    badge: "Building",
    summary:
      "An AI code reviewer that may only report a bug when it can hand you a test that fails on the broken code and passes on the fix, and stays silent when it cannot.",
    highlights: [
      "One rule, enforced by construction rather than by a confidence threshold: no runnable proof, no comment. A deterministic, model-free flip check is the sole judge of what counts as evidence.",
      "Two modes on one evidence engine. Detective reproduces a bug from a stack trace; Prosecutor reviews a pull request and comments only when a flip is proven.",
      "Every proof is an execution-validated fail-to-pass test tied to a commit, so each one doubles as a contamination-free benchmark instance for AI4SE research."
    ],
    stack: ["Python", "pytest", "Git", "LLM tool use"],
    links: [
      { label: "Project site", url: "https://suryanshss1011.github.io/Exhibit-A/" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/Exhibit-A" }
    ],
    current: true,
    category: "engineering",
    featured: true
  },
  {
    title: "Tollgate",
    role: "Cost-aware edge inspection agent",
    venue: "Open source",
    badge: "Shipped",
    summary:
      "An industrial inspection agent that sends a frame to the cloud based on what a mistake would cost, not on how confident the model happens to feel.",
    highlights: [
      "One inequality yields three properties at once. Routing on cost rather than confidence gives privacy (only a cropped region ever leaves the device), offline tolerance (queue and reconcile), and cloud economy from the same decision.",
      "Measured on real MVTec data across six categories: 0.988 accuracy at 57% of cloud-only spend, against 0.992 at full spend and 0.951 running purely local.",
      "Six-category robustness 0.969 ± 0.015, and a backbone ablation moves the hybrid result by only -0.024 to +0.023 — the router absorbs local-model variance. 168 tests green."
    ],
    stack: ["Python", "ONNX", "DINOv2", "qwen3-vl-plus", "MCP", "Docker", "Alibaba Cloud", "SQLite"],
    links: [
      { label: "Project site", url: "https://suryanshss1011.github.io/edge-inspection-agent/" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/edge-inspection-agent" }
    ],
    figure: {
      kind: 'figure',
      src: "/figures/tollgate-tradeoff-light.svg",
      srcDark: "/figures/tollgate-tradeoff-dark.svg",
      alt: "Accuracy against cloud spend for three routing modes. Local-only reaches 0.951 accuracy at zero cloud spend, the hybrid router 0.988 at 57% of cloud-only spend, and cloud-only 0.992 at full spend.",
      caption: "Accuracy vs cloud spend on MVTec, six categories. Routing by cost keeps 99.6% of cloud-only accuracy for 57% of the spend."
    },
    current: true,
    category: "engineering",
    featured: true
  },
  {
    title: "Warren",
    role: "In active development for Mind the Product's World Product Day 2026",
    venue: "Open source",
    badge: "Building",
    summary:
      "Turns a Wikipedia rabbit hole into a shareable map, where the path you actually clicked stays bright and every other link fades into context.",
    highlights: [
      "Spine-and-focus graph principle: the clicked path is a thick animated edge, neighbours dim, distant nodes fade. Sidesteps the Obsidian/Roam-style hairball at 200+ nodes.",
      "Reads inside the map: clicking a node opens a floating burrow card anchored to it, so the map never leaves the screen.",
      "Reverse-engineered from the share card inward — the artifact is designed first (the Spotify Wrapped lesson), then the experience fills it."
    ],
    stack: ["Next.js 16", "TypeScript", "Tailwind v4", "Supabase", "Claude Haiku 4.5", "react-force-graph-2d", "@vercel/og", "Wikimedia REST"],
    links: [
      { label: "Try it", url: "https://wikiwarren.vercel.app" },
      { label: "Read the writeup", url: "/blog/warren/" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/Warren" }
    ],
    current: true,
    category: "engineering",
    featured: true
  },
  {
    title: "Continuous Retrieval-Grounded Reward Design for Secure Code Generation on Small Language Models (CARGO)",
    role: "ICTAI 2026",
    venue: "ICTAI 2026",
    badge: "Accepted",
    summary:
      "Small code models trained on security-scanner verdicts stall because nearly every early attempt scores the same zero, so this also scores each attempt against a retrieved secure fix to give training something to climb.",
    highlights: [
      "SAST-only GRPO on Qwen2.5-Coder-1.5B updates the policy on fewer than 9% of steps: rollouts that fail to parse all score zero and the group-relative advantage collapses. A copy-guarded cosine reward against a CWE-retrieved secure fix lifts that to 94.8%.",
      "Over SAST-only GRPO on 1,582 prompts across 19 CWEs in Python, C, and C++: +19.9 pp Compile@1, +16.6 pp Secure@1|Compile, +26.5 pp Functional-Secure@1.",
      "Not tied to one optimizer: the retrieval reward lifts GRPO, PPO, RLOO, and RAFT by 22.5 to 26.5 pp, and reproduces on Qwen2.5-Coder-3B (+20.9) and StarCoder2-3B (+19.2)."
    ],
    stack: ["Python", "PyTorch", "PEFT (LoRA)", "GRPO / PPO / RLOO / RAFT", "CodeQL", "Semgrep", "Bandit", "Cppcheck", "BM25 + bge-base", "Qwen2.5-Coder"],
    links: [
      { label: "Read the writeup", url: "/blog/cargo/" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/SecureCodeRL-RAG" }
    ],
    figure: {
      kind: 'figure',
      src: "/figures/cargo-factorial-light.svg",
      srcDark: "/figures/cargo-factorial-dark.svg",
      alt: "Functional-Secure@1 for four RL algorithms with and without the retrieval reward. GRPO rises from 8.6 to 35.1, PPO from 10.5 to 36.2, RLOO from 8.6 to 33.7, and RAFT from 7.9 to 30.4.",
      caption: "Functional-Secure@1 on the 156-prompt test-equipped subset (Qwen2.5-Coder-1.5B). All four gains fall within 4 pp of each other, so the reward, not the estimator, carries the effect."
    },
    current: false,
    category: "research",
    featured: true
  },
  {
    title: "Match Your Loss to Your Cost: Asymmetric Losses and Conformal Capacity Bands for Backbone Traffic Forecasting",
    role: "Cost-aware backbone traffic forecasting",
    badge: "Working paper",
    summary:
      "A network operator pays far more for a capacity shortfall than for spare headroom, so this trains the traffic forecaster on that real cost instead of on RMSE.",
    highlights: [
      "Cusp-linear loss matched to operator ratio: +76% Abilene, +75% GÉANT, +54% CESNET vs MSE at top operator asymmetry. L1 is the canonical consistent scoring rule for the τ-quantile (Gneiting 2011); squared asymmetric collapses on heavy-tailed GÉANT.",
      "Cross-architecture: the matched 5:1 win reproduces on DLinear (+30 to +97%) and iTransformer (+28 to +79%) across Abilene/GÉANT/CESNET.",
      "ACI vs split CQR: overload rate 155× lower on Abilene, 9.1× lower on GÉANT, 3.8× lower on CESNET. ACI's across-seed coverage variance is 30 to 200× smaller."
    ],
    stack: ["Python", "PyTorch", "statsmodels", "NumPy", "Pandas", "scikit-learn"],
    links: [
      { label: "Read the writeup", url: "/blog/match-loss-to-cost/" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/match-loss-to-cost" }
    ],
    figure: {
      kind: 'figure',
      src: "/figures/pareto-frontier-light.svg",
      srcDark: "/figures/pareto-frontier-dark.svg",
      alt: "Mean overload rate against mean over-provisioning cost on Abilene as the training ratio is swept from 1:1 to 100:1. Overload falls by more than two orders of magnitude as cost rises, and the 1:1 point coincides with the MSE baseline.",
      caption: "Sweeping the training ratio on Abilene (DLinear, 20 seeds). The 1:1 point lands on the MSE baseline exactly, since α = β = 1 recovers MSE."
    },
    current: false,
    category: "research",
    featured: true
  },
  {
    title: "Scheduled Partial-Credit RL for Reliable Code Generation with Small Language Models (WIP)",
    role: "LCTES 2026",
    venue: "LCTES 2026",
    badge: "Published",
    summary:
      "Handing a small model from binary rewards to partial credit partway through training lifts its syntax-valid output from 18% to 63%.",
    highlights: [
      "On DeepSeek-Coder-1.3B over 100 APPS+ prompts: SFT 44% syntax / 3% ≥1-pass. Binary-reward PPO degrades to 18% / 0%. Partial-credit from scratch reaches 27% / 2%.",
      "The binary-to-partial-credit schedule (PPO-continue) wins: 63% syntax, 9% ≥1-pass, 2% all-pass on a single attempt. Curriculum on the reward matters more than the reward shape alone.",
      "LoRA r=16 (6.3M trainable params, 0.47%), single V100 16GB, Bandit-graded R_sec. Security null on APPS+ (algorithmic); CWE-mapped partial credit is the next step."
    ],
    stack: ["Python", "PyTorch", "TRL (PPO)", "PEFT (LoRA)", "Bandit", "DeepSeek-Coder-1.3B", "APPS+"],
    links: [
      { label: "Read the writeup", url: "/blog/securecoderl/" },
      { label: "Paper (ACM DL)", url: "https://doi.org/10.1145/3814943.3816167" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/SecureCodeRL" }
    ],
    current: false,
    category: "research",
    featured: true
  },
  {
    title: "Wynlabs",
    role: "Founding Engineer",
    venue: "Startup",
    period: "Jan 2025 – Mar 2026",
    badge: "Industry",
    summary:
      "Founding engineer on an industrial copilot, running multi-agent workflows over live plant-floor SCADA, PLC, and MQTT data.",
    highlights: [
      "Multi-agent workflows on per-deployment knowledge graphs (2k to 5k nodes), orchestrated through LangChain.",
      "Shipped 15+ client POCs end-to-end, embedded with manufacturing teams.",
      "Built FastAPI services and a provisioning CLI for Dockerized pipelines on AWS and Kubernetes."
    ],
    stack: ["Python", "FastAPI", "LangChain", "Docker", "Kubernetes", "AWS", "SCADA/PLC/MQTT", "TypeScript"],
    links: [
      { label: "wynlabs.ai", url: "https://wynlabs.ai" }
    ],
    sourceNote: "Source code is private (commercial product).",
    current: false,
    category: "engineering",
    featured: true
  },
  {
    title: "Knowledge Retrieval System for Technical Documents",
    role: "Penn State Learning Factory · Morgan Advanced Materials",
    venue: "Capstone",
    badge: "Sponsored",
    summary:
      "A document assistant for a materials manufacturer that refuses to answer at all when it cannot cite the source it drew from.",
    highlights: [
      "Citation enforcement blocks ungrounded outputs before the user sees them. That policy is what makes the system safe on regulated content.",
      "Hybrid retrieval: FAISS + BM25 fused via Reciprocal Rank Fusion, then a cross-encoder reranker.",
      "FastAPI + SSE backend, Chainlit chat UI, evaluation harness for Recall@K, nDCG@K, MRR, and latency."
    ],
    stack: ["Python", "FAISS", "BM25", "cross-encoder reranking", "FastAPI", "Chainlit", "SSE", "Docker"],
    links: [
      { label: "Read the writeup", url: "/blog/morgan-rag/" },
      { label: "Learning Factory showcase", url: "https://sites.psu.edu/lfshowcasesp26/2026/04/29/knowledge-retrieval-system-for-technical-documents/" }
    ],
    sourceNote: "Repository is private (academic capstone).",
    current: false,
    category: "engineering"
  },
  {
    title: "TruthCast",
    role: "Solana Track Winner · HackPSU Spring 2026",
    venue: "HackPSU 2026",
    badge: "Winner",
    summary:
      "A fact-checker where AI agents argue both sides of a claim, and the verdict is written to a public ledger so it cannot be quietly edited later.",
    highlights: [
      "Decomposes claims via HiSS, retrieves with Gemini + google_search, weights by MBFC source credibility (~4,000 domains).",
      "Pro/con debate fires only when inter-agent agreement falls below 80%. Emits one of 7 verdicts (TRUE through UNVERIFIABLE), not a boolean.",
      "Writes verdicts to a Solana memo for permanent provenance. Voice summary via ElevenLabs TTS."
    ],
    stack: ["Next.js 14", "TypeScript", "Gemini 2.0 Flash", "Solana (devnet)", "ElevenLabs TTS", "Turso/SQLite", "MBFC dataset"],
    links: [
      { label: "Live demo", url: "https://truth-cast-web.vercel.app" },
      { label: "Read the writeup", url: "/blog/truthcast/" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/TruthCast" }
    ],
    current: false,
    category: "engineering"
  },
  {
    title: "Shift",
    role: "Climate Change Track Winner · GDG @ Penn State Solution Challenge",
    venue: "Solution Challenge",
    badge: "Winner",
    summary:
      "One personalised climate action a day, with the energy and carbon cost of every AI call it makes shown openly rather than hidden.",
    highlights: [
      "Daily actions tailored to commute, diet, live grid carbon intensity, and weather, drawn from EPA + DEFRA emissions data and 190 curated actions.",
      "Chrome extension and Eco-LLM dashboard track energy (Wh), carbon (gCO2), and water (mL) per Gemini prompt. Semantic caching serves repeat queries at zero added inference cost.",
      "Typical carbon ROI 10,000:1. Projected 12,000 tonnes of CO2 removed per year at 100k DAU."
    ],
    stack: ["Next.js 14 (PWA)", "TypeScript", "Tailwind", "Groq (Llama 3.3-70B)", "Gemini", "Supabase", "Upstash Vector", "EcoLogits"],
    links: [
      { label: "Live demo", url: "https://useshift.vercel.app" },
      { label: "Read the writeup", url: "/blog/shift/" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/Shift" }
    ],
    current: false,
    category: "engineering"
  },
  {
    title: "Fixing Performance Bugs Through LLM Explanations",
    role: "IEEE AITest 2025",
    venue: "IEEE AITest 2025",
    badge: "Published",
    summary:
      "Training a model on written explanations of Java performance bugs, rather than on labels alone, raises detection accuracy from 67% to 84%.",
    highlights: [
      "Curated dataset of 490 performance bugs across 17 Defects4J projects, with a 5-category taxonomy (algorithmic, memory, CPU, redundant, I/O).",
      "Fine-tuned GPT-4o-mini to produce explanations alongside predictions. Detection accuracy 67.3% → 83.7%, F1 64.6% → 82.3%.",
      "Full reproduction stack public: extraction, categorization, fine-tuning, evaluation harness."
    ],
    stack: ["Python", "GPT-4o-mini fine-tuning", "Defects4J", "Java", "OpenAI API"],
    links: [
      { label: "Read the writeup", url: "/blog/performance-bugs-llm/" },
      { label: "Paper (IEEE)", url: "https://doi.org/10.1109/AITest66680.2025.00020" },
      { label: "Project site", url: "https://suryanshss1011.github.io/Performance-Bugs-LLM" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/Performance-Bugs-LLM" }
    ],
    current: false,
    category: "research"
  }
];
