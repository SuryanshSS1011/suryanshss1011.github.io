export const site = {
  name: "Suryansh Sijwali",
  title: "AI/ML Engineer & Researcher",
  description: "Penn State CS. RL for reliable code generation, decision-aware ML for networks, citation-grounded retrieval. Research that ships and systems that get used.",
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
  currently: "Causality-aware secure reward design for RL-based C code generation.",
  submitted: "Match Your Loss to Your Cost · CNSM 2026 (June 1)",
  upcoming: "LCTES 2026 presentation · June 16 · Boulder, CO.",

  bio: `I'm a Computer Science student at Penn State, passionate about building intelligent systems at the intersection of AI research and practical software engineering.

Currently focused on LLM-powered code analysis, full-stack development, and exploring how AI can solve real-world problems in manufacturing, education, and beyond.`,

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

export type ProjectFigure =
  | { type: 'reward-ladder'; rows: { label: string; value: string; fill: number }[] }
  | {
      type: 'result-bars';
      caption?: string;
      rows: { label: string; valueDisplay: string; fill: number; delta?: string }[];
    };

export type Project = {
  title: string;
  role: string;
  period?: string;
  badge?: string;
  summary: string;
  highlights: string[];
  stack: string[];
  links: ProjectLink[];
  sourceNote?: string;
  current: boolean;
  category: 'research' | 'engineering';
  image?: ProjectImage;
  figure?: ProjectFigure;
};

export const projects: Project[] = [
  {
    title: "Warren",
    role: "In active development for Mind the Product's World Product Day 2026",
    badge: "Building",
    summary:
      "Turn your Wikipedia rabbit hole into a beautiful, shareable map. Your actual clicked path becomes a bright animated spine; all other links sit as faint context so the graph never becomes a hairball.",
    highlights: [
      "Spine-and-focus graph principle: clicked path is a thick animated edge, neighbors dim, distant nodes fade. Sidesteps the Obsidian/Roam-style hairball at 200+ nodes.",
      "Reads inside the map: clicking a node opens a floating burrow card anchored to the node, so the map never leaves the screen.",
      "Reverse-engineered from the share card inward: the artifact is designed first (Spotify Wrapped lesson), then the experience fills it."
    ],
    stack: ["Next.js 16", "TypeScript", "Tailwind v4", "Supabase", "Claude Haiku 4.5", "react-force-graph-2d", "@vercel/og", "Wikimedia REST"],
    links: [
      { label: "Read the writeup", url: "/blog/warren/" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/Warren" }
    ],
    current: true,
    category: "engineering"
  },
  {
    title: "Wynlabs",
    role: "Founding Engineer · Jan 2025 – Mar 2026",
    badge: "Industry / Startup",
    summary:
      "Founding engineer on an industrial copilot platform. Multi-agent AI workflows over live SCADA, PLC, MQTT, and SQL Server data on the plant floor.",
    highlights: [
      "Multi-agent workflows on per-deployment knowledge graphs (2k to 5k nodes), orchestrated through LangChain.",
      "Shipped 15+ client POCs end-to-end, embedded with manufacturing teams.",
      "Built FastAPI services + a provisioning CLI for Dockerized pipelines on AWS and Kubernetes."
    ],
    stack: ["Python", "FastAPI", "LangChain", "Docker", "Kubernetes", "AWS", "SCADA/PLC/MQTT", "TypeScript"],
    links: [
      { label: "wynlabs.ai", url: "https://wynlabs.ai" }
    ],
    sourceNote: "Source code is private (commercial product).",
    current: false,
    category: "engineering"
  },
  {
    title: "Scheduled Partial-Credit RL for Reliable Code Generation with Small Language Models",
    role: "LCTES 2026 (WIP) · Patishnock Award",
    badge: "WIP · Accepted",
    summary:
      "Reliability-first RL for small language models in code generation. Joint reward R = 0.6·R_func + 0.4·R_sec with a five-stage partial-credit functional ladder.",
    highlights: [
      "On DeepSeek-Coder-1.3B over 100 APPS+ prompts: SFT 44% syntax / 3% ≥1-pass. Binary-reward PPO degrades to 18% / 0%. Partial-credit from scratch reaches 27% / 2%.",
      "Binary-to-partial-credit schedule (PPO-continue) wins: 63% syntax, 9% ≥1-pass, 2% all-pass (single attempt). Curriculum learning the schedule matters more than the reward shape alone.",
      "LoRA r=16 (6.3M trainable params, 0.47%), single V100 16GB, Bandit-graded R_sec. Security null on APPS+ (algorithmic); CWE-mapped partial credit is the next step."
    ],
    stack: ["Python", "PyTorch", "TRL (PPO)", "PEFT (LoRA)", "Bandit", "DeepSeek-Coder-1.3B", "APPS+"],
    links: [
      { label: "Read the writeup", url: "/blog/securecoderl/" },
      { label: "Paper (arXiv:2601.01184)", url: "https://arxiv.org/abs/2601.01184" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/SecureCodeRL" }
    ],
    figure: {
      type: 'reward-ladder',
      rows: [
        { label: "syntax error", value: "0.0", fill: 8 },
        { label: "valid syntax", value: "0.2", fill: 24 },
        { label: "runs, no crash", value: "0.4", fill: 42 },
        { label: "produces output", value: "0.6", fill: 60 },
        { label: "passes k of T", value: "0.6 + 0.4·k/T", fill: 92 }
      ]
    },
    current: false,
    category: "research"
  },
  {
    title: "Match Your Loss to Your Cost",
    role: "CNSM 2026 Submission",
    badge: "Submitted",
    summary:
      "Decision-aware traffic forecasting for backbone capacity planning. Asymmetric losses and conformal capacity bands trained against operator cost, not RMSE. Three real backbones, 20 seeds, paired-bootstrap CIs.",
    highlights: [
      "Cusp-linear loss matched to operator ratio: +76% Abilene, +75% GÉANT, +54% CESNET vs MSE at top operator asymmetry. L1 is the canonical consistent scoring rule for the τ-quantile (Gneiting 2011); squared asymmetric collapses on heavy-tailed GÉANT.",
      "Cross-architecture: matched 5:1 win reproduces on DLinear (+30 to +97%) and iTransformer (+28 to +79%) across Abilene/GÉANT/CESNET.",
      "ACI vs split CQR: overload rate 155× lower on Abilene, 9.1× lower on GÉANT, 3.8× lower on CESNET. ACI's across-seed coverage variance is 30 to 200× smaller."
    ],
    stack: ["Python", "PyTorch", "statsmodels", "NumPy", "Pandas", "scikit-learn"],
    links: [
      { label: "Read the writeup", url: "/blog/match-loss-to-cost/" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/match-loss-to-cost" }
    ],
    figure: {
      type: 'result-bars',
      caption: "Operator-cost reduction vs MSE-trained LSTM, cusp-linear loss at top operator asymmetry",
      rows: [
        { label: "Abilene", valueDisplay: "+76%", fill: 76 },
        { label: "GÉANT",   valueDisplay: "+75%", fill: 75 },
        { label: "CESNET",  valueDisplay: "+54%", fill: 54 }
      ]
    },
    current: false,
    category: "research"
  },
  {
    title: "Knowledge Retrieval System for Technical Documents",
    role: "Penn State Learning Factory · Morgan Advanced Materials",
    badge: "Capstone",
    summary:
      "Offline, citation-grounded RAG for technical documents. Refuses to answer when it can't cite a source. Deployed on a local GPU workstation at the sponsor's office.",
    highlights: [
      "Citation enforcement blocks ungrounded outputs before the user sees them. That is the policy that makes the system safe on regulated content.",
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
    badge: "Hackathon Winner",
    summary:
      "Multi-agent fact-checking pipeline with adversarial debate, source-credibility weighting, and on-chain provenance via Solana memos on devnet.",
    highlights: [
      "Decomposes claims via HiSS, retrieves with Gemini + google_search, weights by MBFC source credibility (~4,000 domains).",
      "Pro/con debate fires only when inter-agent agreement falls below 80%. Emits one of 7 verdicts (TRUE through UNVERIFIABLE), not a boolean.",
      "Writes verdicts to a Solana memo for permanent provenance. Voice summary via ElevenLabs TTS."
    ],
    stack: ["Next.js 14", "TypeScript", "Gemini 2.0 Flash", "Solana (devnet)", "ElevenLabs TTS", "Turso/SQLite", "MBFC dataset"],
    links: [
      { label: "Read the writeup", url: "/blog/truthcast/" },
      { label: "Live demo", url: "https://truth-cast-web.vercel.app" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/TruthCast" }
    ],
    current: false,
    category: "engineering"
  },
  {
    title: "Shift",
    role: "Climate Change Track Winner · GDG @ Penn State Solution Challenge",
    badge: "Hackathon Winner",
    summary:
      "One AI-personalized sustainability action per day, with radical transparency about the carbon cost of every inference. Built in 12 hours.",
    highlights: [
      "Daily actions tailored to commute, diet, live grid carbon intensity, and weather, drawn from EPA + DEFRA emissions data and 190 curated actions.",
      "Chrome extension and Eco-LLM dashboard track energy (Wh), carbon (gCO2), and water (mL) per Gemini prompt. Semantic caching serves repeat queries at zero added inference cost.",
      "Typical carbon ROI 10,000:1. Projected 12,000 tonnes of CO2 removed per year at 100k DAU."
    ],
    stack: ["Next.js 14 (PWA)", "TypeScript", "Tailwind", "Groq (Llama 3.3-70B)", "Gemini", "Supabase", "Upstash Vector", "EcoLogits"],
    links: [
      { label: "Read the writeup", url: "/blog/shift/" },
      { label: "Live demo", url: "https://useshift.vercel.app" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/Shift" }
    ],
    current: false,
    category: "engineering"
  },
  {
    title: "Fixing Performance Bugs Through LLM Explanations",
    role: "IEEE AITest 2025",
    badge: "Published",
    summary:
      "Using LLM explanations as a training signal (not just labels) to detect Java performance bugs. Peer-reviewed at IEEE AITest 2025.",
    highlights: [
      "Curated dataset of 490 performance bugs across 17 Defects4J projects, 5-category taxonomy (algorithmic, memory, CPU, redundant, I/O).",
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
    figure: {
      type: 'result-bars',
      caption: "Detection on 490-bug test set after fine-tuning GPT-4o-mini with explanations",
      rows: [
        { label: "Accuracy", valueDisplay: "83.7%", fill: 83.7, delta: "+16.4pp vs 67.3% baseline" },
        { label: "F1",       valueDisplay: "82.3%", fill: 82.3, delta: "+17.7pp vs 64.6% baseline" }
      ]
    },
    current: false,
    category: "research"
  }
];
