export const site = {
  name: "Suryansh Sijwali",
  title: "AI/ML Engineer & Researcher",
  description: "Architecting intelligent systems that solve complex problems — where research meets implementation.",
  url: "https://suryanshss1011.github.io",
  social: {
    github: "https://github.com/SuryanshSS1011",
    linkedin: "https://linkedin.com/in/suryansh-sijwali",
    email: "suryansh.sijwali@gmail.com"
  }
};

export const about = {
  currently: "Causality-aware secure reward design for RL-based C code generation, and risk-bounded capacity provisioning via decision-focused conformal forecasting.",
  upcoming: "LCTES 2026 presentation · June 15 · Boulder, CO.",

  bio: `I'm a Computer Science student at Penn State, passionate about building intelligent systems at the intersection of AI research and practical software engineering.

Currently focused on LLM-powered code analysis, full-stack development, and exploring how AI can solve real-world problems in manufacturing, education, and beyond.`,

  education: {
    degree: "B.S. Computer Science",
    institution: "Penn State University",
    graduation: "Expected May 2027",
    colleges: ["Schreyer Honors College", "College of Engineering", "Eberly College of Science"],
    minors: ["Physics", "Quantum Information Sciences and Engineering", "Computer Engineering", "Computational Cybersecurity"]
  },

  roles: [
    { title: "Founding Engineer", company: "Wynlabs", period: "Jan 2025 – Present" },
    { title: "Software Engineer Intern", company: "Leechy LLC", period: "Jun 2025 – Sep 2025" }
  ],

  interests: ["AI/ML Research", "Full-Stack Development", "Systems Design", "Open Source"]
};

export type ProjectLink = { label: string; url: string };

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
};

export const projects: Project[] = [
  {
    title: "Wynlabs",
    role: "Founding Engineer",
    badge: "Industry / Startup",
    summary:
      "Cross-institutional AI software platform building an industrial copilot for manufacturing. Multi-agent workflows run over live plant-floor data.",
    highlights: [
      "Shipped 15+ client POCs end-to-end. Embedded with manufacturing teams on tight timelines to scope, build, and deploy AI workflows on live industrial data.",
      "Architected multi-agent workflows backed by 2k to 5k node knowledge graphs per deployment. They power KPI prediction and time-series analytics over SCADA, PLC, MQTT, and SQL Server data, orchestrated through LangChain.",
      "Built FastAPI services and a provisioning CLI for Dockerized pipelines on AWS and Kubernetes. Grafana reports generate automatically via API-triggered workflows.",
      "Maintained a shared frontend NPM package to standardize UI components across client apps."
    ],
    stack: ["Python", "FastAPI", "LangChain", "Docker", "Kubernetes", "AWS", "Grafana", "SCADA/PLC/MQTT", "SQL Server", "TypeScript"],
    links: [{ label: "wynlabs.ai", url: "https://wynlabs.ai" }],
    sourceNote: "Source code is private (commercial product).",
    current: true,
    category: "engineering"
  },
  {
    title: "SecureCodeRL",
    role: "LCTES 2026 (WIP) · Patishnock Award Winner",
    badge: "WIP — Accepted",
    summary:
      "RL framework that trains LLMs to generate code which is both functionally correct and free of common security weaknesses, optimizing a combined reward against test outcomes and Bandit static analysis.",
    highlights: [
      "Combined reward R = 0.6 × R_func + 0.4 × R_sec, with R_func graded on a five-stage partial-credit ladder (syntax valid, runs, produces output, tests pass) to avoid the sparse-reward trap that breaks binary-reward PPO on code.",
      "Two-stage pipeline: LoRA-based SFT on DeepSeek-Coder-1.3B over the APPS+ stdin dataset (3,588 problems), followed by PPO with Bandit as the security signal.",
      "Accepted as a work-in-progress paper at the 27th ACM SIGPLAN/SIGBED LCTES 2026, co-located with PLDI 2026 in Boulder, Colorado.",
      "Interim findings: partial-credit PPO lifted syntax validity from 45% (SFT baseline) to 60% and was the only configuration to achieve a non-zero test pass rate, while keeping security compliance at 100% throughout training.",
      "Recognized at the Penn State Undergraduate Exhibition with the University Libraries' John Sr. and Kimlyn Patishnock Undergraduate Research Award for Excellence in Information Literacy.",
      "Indexed on EmergentMind as a canonical reference for partial-credit functional reward in code generation."
    ],
    stack: ["Python", "PyTorch", "TRL (PPO)", "PEFT (LoRA)", "Bandit", "DeepSeek-Coder-1.3B", "APPS+"],
    links: [
      { label: "Paper (arXiv:2601.01184)", url: "https://arxiv.org/abs/2601.01184" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/basic-rl-feedback-workflow" }
    ],
    current: true,
    category: "research"
  },
  {
    title: "ML for Network Traffic Prediction and Capacity Planning",
    role: "Interim Results",
    badge: "WIP",
    summary:
      "End-to-end simulation pipeline that generates synthetic backbone traffic, trains two competing forecasting models (SARIMA per-link and a joint LSTM), and quantifies how forecasting quality propagates into real capacity-planning decisions like link utilization and overload rates.",
    highlights: [
      "Generated synthetic traffic over a 12-node backbone topology at 5-minute resolution for 14 days, with a 6-hour seasonal pattern matched by the SARIMA seasonal order.",
      "Trained a SARIMA(2,1,2)(1,0,1,72) baseline per link and a joint LSTM forecaster on a 72-step (6-hour) input window, then ran 5-seed experiments for variance analysis.",
      "Interim findings: LSTM cuts RMSE by 35% (16.5 vs 25.3), MAPE by 45% (26% vs 47%), and overload rate by 69% (10.6% vs 34.6%) versus SARIMA, with much lower seed-to-seed variance.",
      "Drafted an IEEE-format methodology and results writeup checked into the repo at report/paper.pdf, updated as the project progresses."
    ],
    stack: ["Python", "PyTorch", "statsmodels", "NumPy", "Pandas", "NetworkX", "scikit-learn", "matplotlib", "LaTeX"],
    links: [
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/ML-for-Network-Traffic-Prediction-and-Capacity-Planning" }
    ],
    current: true,
    category: "research"
  },
  {
    title: "Intelligent Document Retrieval System",
    role: "Penn State Learning Factory · Morgan Advanced Systems",
    badge: "Capstone",
    summary:
      "Team capstone through the Penn State Learning Factory, sponsored by Morgan Advanced Systems. An offline-capable, citation-grounded RAG platform for document-heavy enterprise use cases. Combines lexical and dense retrieval with cross-encoder reranking, exposed through a FastAPI backend and a Chainlit chat interface.",
    highlights: [
      "Built a hybrid retrieval pipeline fusing FAISS dense search with BM25 via Reciprocal Rank Fusion, then reranked with a cross-encoder for precision.",
      "Enforced mandatory citation grounding and validation on every AI-generated response, blocking ungrounded outputs before they reach the user.",
      "Exposed a FastAPI REST backend with SSE streaming for token-by-token responses, wired to a Chainlit interface for chat-style interaction.",
      "Designed a retrieval evaluation framework tracking Recall@K, nDCG@K, MRR, and per-model latency benchmarks across configurations."
    ],
    stack: ["Python", "FAISS", "BM25", "cross-encoder reranking", "FastAPI", "Chainlit", "SSE", "Docker"],
    links: [],
    sourceNote: "Repository is private (academic capstone).",
    current: false,
    category: "engineering"
  },
  {
    title: "TruthCast",
    role: "Solana Track Winner · HackPSU Spring 2026",
    badge: "Hackathon Winner",
    summary:
      "Fully autonomous fact-checking system that decomposes a claim into atomic sub-claims, retrieves and weights evidence, runs adversarial debate when sources disagree, then writes the final verdict to an immutable Solana ledger and produces a natural voice summary.",
    highlights: [
      "Decomposes claims using the HiSS method, then retrieves grounded evidence via Gemini with google_search and scores ~4,000 sources using the MBFC credibility dataset.",
      "Triggers adversarial pro/con debate whenever inter-agent agreement falls below 80%, producing a 7-label verdict (TRUE through CONFLICTING and UNVERIFIABLE) instead of a flat true or false.",
      "Writes every verdict as a Solana memo on devnet so the result is permanent and tamper-evident, then generates a voice summary via ElevenLabs TTS.",
      "Streams pipeline progress in real time over SSE, with a Turso (libSQL) hybrid database for serverless deployment and SQLite for local development."
    ],
    stack: ["Next.js 14", "TypeScript", "Gemini 2.0 Flash", "Solana (devnet)", "ElevenLabs TTS", "Turso/SQLite", "MBFC dataset", "Sentry"],
    links: [
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
      "AI-personalized sustainability app that delivers one tailored micro-action per day while being radically transparent about the carbon cost of every AI inference it runs. Built in 12 hours with a small team.",
    highlights: [
      "Onboards users in 90 seconds and serves daily actions tailored to commute distance, diet pattern, the city's live grid carbon intensity, and current weather, drawing on EPA and DEFRA emissions data.",
      "Scored a curated knowledge base of 190 actions and structured them around behavioral science frameworks (Fogg's B=MAP, Tiny Habits) with points, streaks, and SDG tracking.",
      "Built a Chrome extension and Eco-LLM dashboard that monitor energy (Wh), carbon (gCO2), and water (mL) per Gemini prompt, with semantic caching to serve similar queries at zero additional inference cost.",
      "At a hypothetical 100,000 daily users, the app's projected impact is around 12,000 tonnes of CO2 removed per year, with a typical carbon ROI of 10,000:1 or higher."
    ],
    stack: ["Next.js 14 (PWA)", "TypeScript", "Tailwind", "shadcn/ui", "Groq (Llama 3.3-70B)", "Gemini", "Supabase", "Upstash Redis", "Upstash Vector", "EcoLogits", "Climatiq", "Electricity Maps"],
    links: [
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
      "Code, dataset, and models from a peer-reviewed paper on using LLM explanations to detect and fix Java performance bugs. Accepted to the 7th IEEE International Conference on Artificial Intelligence Testing (AITest 2025) with a 31.6% acceptance rate.",
    highlights: [
      "Curated a dataset of 490 performance bugs across 17 Defects4J projects, organized into a 5-category taxonomy (algorithmic, memory, CPU, redundant computation, I/O) with an 80/20 train/test split.",
      "Fine-tuned GPT-4o-mini on the curated set to produce explanations alongside predictions, lifting detection accuracy from 67.3% (base) to 83.7% (fine-tuned) and F1 from 64.6% to 82.3%.",
      "Released the full reproduction stack: extraction scripts for Defects4J, fine-tuning scripts, evaluation harness, and a CLI for running the detector on arbitrary Java files.",
      "Shipped an interactive project site and conference presentation alongside the code."
    ],
    stack: ["Python", "GPT-4o-mini fine-tuning", "Defects4J", "Java", "OpenAI API", "HTML", "Shell"],
    links: [
      { label: "Paper (IEEE)", url: "https://doi.org/10.1109/AITest66680.2025.00020" },
      { label: "Project site", url: "https://suryanshss1011.github.io/Performance-Bugs-LLM" },
      { label: "GitHub", url: "https://github.com/SuryanshSS1011/Performance-Bugs-LLM" }
    ],
    current: false,
    category: "research"
  }
];
