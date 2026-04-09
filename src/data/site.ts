export const site = {
  name: "Suryansh Sijwali",
  title: "Software Engineer & AI Researcher",
  description: "Architecting intelligent systems that solve complex problems — where research meets implementation.",
  url: "https://suryanshss1011.github.io",
  social: {
    github: "https://github.com/SuryanshSS1011",
    linkedin: "https://linkedin.com/in/suryansh-sijwali",
    email: "suryansh.sijwali@gmail.com"
  }
};

export const about = {
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

export const projects = [
  {
    title: "SecureCodeRL",
    description: "RL framework guiding LLMs toward generating code that satisfies both functional correctness and security constraints.",
    tags: ["Research", "RL", "Security"],
    url: "https://arxiv.org/",
    github: "https://github.com/SuryanshSS1011/SecureCodeRL",
    current: true
  },
  {
    title: "Intelligent Document Retrieval System",
    description: "Hybrid RAG pipeline combining FAISS dense retrieval and BM25, with mandatory citation grounding and evaluation benchmarks.",
    tags: ["RAG", "NLP", "FastAPI"],
    url: "https://github.com/SuryanshSS1011/document-retrieval",
    github: "https://github.com/SuryanshSS1011/document-retrieval",
    current: true
  },
  {
    title: "LLM Performance Bug Detection",
    description: "Research achieving 83.7% accuracy in detecting Java performance bugs using LLM-powered frameworks. Published at IEEE AITest 2025.",
    tags: ["Research", "LLM", "Java"],
    url: "/blog/llm-performance-bug-detection",
    github: "https://github.com/SuryanshSS1011/Performance-Bugs-LLM",
    current: false
  },
  {
    title: "OpenScholar Hub",
    description: "Research collaboration platform for networking, data sharing, and project management.",
    tags: ["Full-Stack", "Research"],
    url: "https://open-scholar-hub.vercel.app/",
    github: "https://github.com/SuryanshSS1011/OpenScholarHub",
    current: false
  },
  {
    title: "VeriChain",
    description: "Decentralized platform for issuing and verifying academic credentials on blockchain using Solidity and Polygon.",
    tags: ["Blockchain", "Web3"],
    url: "https://verichain-sage.vercel.app/",
    github: "https://github.com/SuryanshSS1011/VeriChain",
    current: false
  },
  {
    title: "CollegeNotesOrg",
    description: "GitHub organization for standardized academic notes with noteparser Python library for multi-format conversion.",
    tags: ["Python", "Education"],
    url: "https://github.com/CollegeNotesOrg",
    current: false
  }
];
