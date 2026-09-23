export const profile = {
  name: "Darshan R",
  title: "AI/ML Engineer & GenAI Developer",
  tagline: "Building intelligent, production-grade AI systems",
  roles: [
    "AI/ML Engineer",
    "Generative AI",
    "Agentic Systems",
    "Computer Vision",
    "Project Management",
  ],
  email: "darshanr2005@gmail.com",
  phone: "+91 6379480139",
  location: "Coimbatore, India",
  linkedin: "https://www.linkedin.com/in/darshan-r",
  github: "https://github.com/darshan-com",
  leetcode: "https://leetcode.com/dar05",
  bio: "Final-year B.E. Computer Science and Engineering student specializing in AI/ML, Generative AI, agentic systems, and computer vision with Project Management skills. Experienced in building end-to-end AI applications involving LLMs, RAG pipelines, multi-agent workflows, and real-time vision systems. Strong Python and software engineering foundation with hands-on experience developing and evaluating production-grade AI solutions.",
  education: [
    {
      school: "Sri Ramakrishna Engineering College, Coimbatore",
      degree: "B.E Computer Science Engineering",
      period: "2023 — 2027",
      grade: "CGPA 7.08 (till 6th semester)",
    },
    {
      school: "Shree Sarasswathi Vidhyaah Mandheer (SSVM), Coimbatore",
      degree: "HSC (CBSE)",
      period: "2022 — 2023",
      grade: "72.4%",
    },
    {
      school: "Adithya International School (AIS), Coimbatore",
      degree: "SSLC (CBSE)",
      period: "2020 — 2021",
      grade: "72%",
    },
  ],
};

export type ExperienceRole = {
  slug: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  summary: string;
  highlights: string[];
  stack: string[];
  outcomes: { metric: string; label: string }[];
};

export const experience: ExperienceRole[] = [
  {
    slug: "nxtlogic-ai-ml-intern",
    role: "AI / ML Intern",
    company: "Nxtlogic Software Solutions",
    period: "June 2025",
    location: "Coimbatore, India",
    summary:
      "Developed a Used Car Price Estimation System using machine learning algorithms to predict vehicle prices based on features such as mileage, brand, fuel type, and year.",
    highlights: [
      "Developed a Used Car Price Estimation System using machine learning algorithms to predict vehicle prices based on features such as mileage, brand, fuel type, and year.",
      "Conducted data preprocessing, feature engineering, and model selection to improve prediction accuracy, enhance model robustness, and ensure consistent performance across real-world scenarios.",
      "Implemented regression models using Python and optimized performance through hyperparameter tuning.",
      "Applied Explainable AI techniques (SHAP) to interpret model predictions and identified key factors influencing pricing.",
      "Built an end-to-end ML workflow including data cleaning, model training, evaluation, and result visualization.",
    ],
    stack: [
      "Python",
      "Machine Learning",
      "Scikit-learn",
      "Regression",
      "SHAP",
      "Feature Engineering",
    ],
    outcomes: [
      { metric: "SHAP", label: "explainability" },
      { metric: "e2e", label: "ml_workflow" },
      { metric: "Opt", label: "tuned_models" },
    ],
  },
  {
    slug: "visioncorp-ui-ux-intern",
    role: "UI / UX Intern",
    company: "VisionCorp InfoTech",
    period: "December 2025",
    location: "Remote",
    summary:
      "Designed a professional-grade UI/UX for a cab/ride booking system, focusing on usability, accessibility and cognitive design principles to build rider trust, drive engagement, and improve overall app retention rates.",
    highlights: [
      "Designed a professional-grade UI/UX for a cab/ride booking system, focusing on usability, accessibility and cognitive design principles to build rider trust, drive engagement, and improve overall app retention rates.",
      "Conducted in-depth user research and analysis to understand customer behavior, expectations, and pain points.",
      "Created user flows, wireframes, and high-fidelity UI designs for seamless user interaction.",
      "Improved user experience by optimizing navigation, booking flow, and interface clarity.",
      "Collaborated with stakeholders to ensure designs aligned with real-world user needs and business goals.",
    ],
    stack: [
      "UI/UX Design",
      "User Research",
      "Wireframing",
      "Cognitive Design",
      "Prototyping",
      "A11y",
    ],
    outcomes: [
      { metric: "A11y", label: "accessibility" },
      { metric: "Trust", label: "cognitive_design" },
      { metric: "Flow", label: "optimized_booking" },
    ],
  },
];

export type Project = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  highlights: string[];
  stack: string[];
  domain: string;
};

export const projects: Project[] = [
  {
    slug: "agentic-supermarket-pos",
    name: "Agentic Supermarket POS Architecture",
    summary:
      "Unified mobile & web POS with AI chat interface, domain skills, FEFO inventory, and GST billing.",
    description:
      "A unified mobile and web point-of-sale platform featuring an intelligent agentic AI chat interface for checkout, inventory, billing, and store operations, backed by domain skills, typed tools, multi-turn state, and persistent memory.",
    highlights: [
      "Built a unified mobile and web POS with AI chat interface for checkout, inventory, billing, and store operations.",
      "Designed an agentic architecture with domain skills, typed tools, multi-turn state, and persistent memory.",
      "Integrated AI barcode scanning, thermal printing, FEFO inventory, GST billing, and multilingual voice/text interaction.",
      "Engineered a secure multi-tenant architecture with RBAC and automated backups, validated via 192 tests.",
      "Developed a CRM analytics engine tracking lifetime customer spend, visit counts, and purchase patterns.",
    ],
    stack: ["Agentic AI", "Python", "Mobile & Web", "FEFO Inventory", "RBAC", "Voice/Text AI"],
    domain: "Agentic Systems",
  },
  {
    slug: "enterprise-ai-recruitment-proctoring",
    name: "Enterprise AI Recruitment & Proctoring Engine",
    summary:
      "Latency-isolated WebRTC gateway, biometric facial mesh proctoring, and on-premise LLMs.",
    description:
      "An enterprise-grade recruitment and evaluation engine architected with a gateway isolating WebRTC signaling from CPU-bound ML pipelines, privacy-focused biometric facial mesh proctoring, and sovereign on-premise LLMs with strict schema constraints.",
    highlights: [
      "Architected a gateway isolating WebRTC signaling from CPU-bound ML pipelines for minimal latency execution.",
      "Engineered an evaluation pipeline using dense-vector embeddings and NLP for high-precision latent space ranking.",
      "Developed a privacy-focused biometric proctoring engine processing facial meshes for real-time anomaly detection.",
      "Implemented a testing framework to continually monitor active Socket.IO connections and memory footprints.",
      "Integrated sovereign, on-premise LLMs featuring strict schema constraints to mitigate prompt injection attacks, utilizing resilient heuristic fallbacks to generate deterministic analytics with high data privacy.",
    ],
    stack: ["WebRTC", "Socket.IO", "On-Prem LLMs", "Dense Vectors", "Biometrics", "NLP"],
    domain: "Enterprise AI",
  },
  {
    slug: "realtime-surveillance-pipeline",
    name: "Robust Vision Pipeline for Real-Time Surveillance",
    summary:
      "Real-time deep learning vision system for intelligent object recognition and anomaly detection.",
    description:
      "An applied computer vision pipeline for real-time object recognition and anomaly detection using modern deep learning architectures, hardened against noisy real-world inputs.",
    highlights: [
      "Architected a real-time deep learning vision system for intelligent object recognition and anomaly detection.",
      "Designed evaluation benchmarks to test model against noisy inputs commonly found in real-world environments.",
      "Reduced false-positive alerts via failure analysis, systematic experimentation, and synthetic data augmentation.",
      "Optimized inference latency and accuracy across the deployment pipeline for continuous, high-fidelity monitoring.",
    ],
    stack: ["Computer Vision", "Deep Learning", "YOLO", "OpenCV", "Python", "Anomaly Detection"],
    domain: "Computer Vision",
  },
  {
    slug: "multi-agent-equity-research",
    name: "Multi-Agent Equity Research & Portfolio Intelligence",
    summary:
      "15-node LangGraph multi-agent LLM ecosystem for autonomous equity market scanning and risk controls.",
    description:
      "An autonomous financial intelligence platform orchestrating a 15-node LangGraph multi-agent system to scan market equities, compute risk-managed position sizing, and simulate trade execution with memory reflection.",
    highlights: [
      "Orchestrated a 15-node LangGraph multi-agent LLM ecosystem for autonomous equity market intelligence.",
      "Automated a parallel NIFTY 50 market scanner utilizing semantic caching and multi-model inference.",
      "Enforced paper-trading risk controls via ATR position sizing, AI confidence scoring, and circuit breakers.",
      "Embedded MCP tooling and a BM25-indexed reflection loop for adaptive, memory-augmented simulated execution.",
    ],
    stack: ["LangGraph", "Multi-Agent Systems", "CrewAI", "MCP", "Semantic Caching", "BM25"],
    domain: "Agentic AI / FinTech",
  },
  {
    slug: "rag-document-intelligence",
    name: "Scalable RAG System for Document Intelligence",
    summary:
      "Layout-aware parsing, ChromaDB semantic retrieval, and on-prem local LLMs for factual grounding.",
    description:
      "A scalable document intelligence and Retrieval-Augmented Generation pipeline parsing heterogeneous unstructured documents, retrieving context via ChromaDB, and executing private, on-premise extraction with ground-truth verification.",
    highlights: [
      "Built a layout-aware ingestion pipeline to parse heterogeneous, unstructured documents at scale.",
      "Engineered ChromaDB-backed semantic retrieval for schema-driven structured entity extraction.",
      "Deployed local open-weight LLMs for private, on-premise document understanding with less API dependency.",
      "Implemented evidence-grounded verification and ground-truth benchmarking to suppress hallucinations.",
    ],
    stack: ["RAG", "ChromaDB", "Local LLMs", "LangChain", "Vector Databases", "Python"],
    domain: "Generative AI",
  },
];

export const skillGroups = [
  {
    label: "Languages & Web",
    items: ["Python", "SQL", "HTML", "CSS"],
  },
  {
    label: "Core AI & Vision",
    items: [
      "Machine Learning",
      "Deep Learning",
      "Computer Vision",
      "CNN",
      "Explainable AI (SHAP)",
      "YOLO",
      "OpenCV",
    ],
  },
  {
    label: "Generative AI & LLMs",
    items: [
      "Generative AI",
      "Prompt Engineering",
      "LLM Applications",
      "LLM Integration",
      "LLM Fine-Tuning",
      "Retrieval-Augmented Generation (RAG)",
    ],
  },
  {
    label: "Agents & Frameworks",
    items: [
      "Multi-Agent Systems (CrewAI)",
      "Agentic AI",
      "LangChain",
      "LangGraph",
      "Vector Databases",
    ],
  },
  {
    label: "Databases & Cloud",
    items: ["MySQL", "SQLite", "PostgreSQL", "ChromaDB", "Supabase", "Firebase"],
  },
  {
    label: "DevOps & Tools",
    items: [
      "Vercel",
      "Docker",
      "Git",
      "GitHub",
      "CI/CD",
      "GitHub Actions",
      "Linux",
      "Jira",
      "Postman",
      "NGINX",
    ],
  },
  {
    label: "AI Tools & APIs",
    items: [
      "Hugging Face Transformers",
      "AI Workflow Automation",
      "OpenAI API",
      "Claude API",
      "Gemini API",
      "n8n",
    ],
  },
  {
    label: "Core CS",
    items: [
      "Operating Systems",
      "Computer Networks",
      "DBMS",
      "Data Structures & Algorithms",
      "System Architecture",
      "OOP (Object-Oriented Programming)",
    ],
  },
  {
    label: "Productivity Tools",
    items: [
      "Power BI",
      "Power Query",
      "Power Pivot",
      "Word",
      "Excel",
      "PowerPoint",
      "OneNote",
      "Access",
    ],
  },
];

export type Certification = {
  slug: string;
  name: string;
  issuer: string;
  year?: string;
  summary: string;
  skills: string[];
  outcomes: string[];
};

export const certifications: Certification[] = [
  {
    slug: "freecodecamp-python",
    name: "Python Certification",
    issuer: "FreeCodeCamp",
    year: "2024",
    summary:
      "Comprehensive certification demonstrating core and advanced Python programming competencies, data structures, and algorithmic implementation.",
    skills: ["Python", "Algorithms", "Data Structures", "Problem Solving", "Scripting"],
    outcomes: [
      "Demonstrated strong Python programming principles across complex algorithmic problems.",
      "Implemented performant code patterns, data manipulation routines, and testable modules.",
    ],
  },
  {
    slug: "android-development",
    name: "Android Development",
    issuer: "Great Learning",
    year: "2023",
    summary:
      "Hands-on mobile application development focusing on Android architecture, lifecycle management, UI components, and RESTful service consumption.",
    skills: [
      "Android Development",
      "Mobile Architecture",
      "UI Components",
      "REST APIs",
      "Application Lifecycle",
    ],
    outcomes: [
      "Engineered mobile user interfaces and interactive components following native guidelines.",
      "Grounded foundational mobile intuition that informs cross-platform and edge AI architectures.",
    ],
  },
  {
    slug: "microsoft-project-management",
    name: "Career Essentials in Project Management",
    issuer: "Microsoft",
    year: "2024",
    summary:
      "Professional accreditation in modern project execution, scope tracking, team collaboration, and structured delivery pipelines.",
    skills: [
      "Project Charter",
      "Timeline Planning",
      "Team Coordination",
      "Risk Management",
      "Reporting",
    ],
    outcomes: [
      "Structured technical deliverables into measurable milestones and risk-managed sprints.",
      "Coordinated cross-functional engineering workflows with async documentation.",
    ],
  },
  {
    slug: "pmi-project-management-foundations",
    name: "Project Management Foundations (PMI)",
    issuer: "PMI · LinkedIn",
    year: "2024",
    summary:
      "PMI-aligned foundation in initiating, planning, executing, monitoring, and closing technical projects with discipline and predictability.",
    skills: ["PMI Standards", "Scope & WBS", "Risk Registers", "Agile & Waterfall", "Estimation"],
    outcomes: [
      "Formulated Work Breakdown Structures (WBS) and mitigation plans for AI systems.",
      "Applied structured governance and stakeholder communications in engineering sprints.",
    ],
  },
  {
    slug: "microsoft-generative-ai",
    name: "Career Essentials in Generative AI",
    issuer: "Microsoft",
    year: "2024",
    summary:
      "Microsoft curriculum on modern generative AI systems, prompt engineering patterns, safety and ethical guidelines, and enterprise copilot workflows.",
    skills: [
      "Generative AI",
      "Prompt Engineering",
      "Responsible AI",
      "Copilot Patterns",
      "Model Safety",
    ],
    outcomes: [
      "Crafted resilient prompt architectures for structured, repeatable LLM outputs.",
      "Applied safety guardrails, grounding constraints, and hallucination reduction methods.",
    ],
  },
];

export type Activity = {
  slug: string;
  role: string;
  org: string;
  summary: string;
  responsibilities: string[];
};

export const activities: Activity[] = [
  {
    slug: "foss-tech-lead",
    role: "Tech Lead",
    org: "Free and Open Source Software Club (FOSS), SREC",
    summary:
      "Leading the technical wing of the FOSS club — running workshops, mentoring juniors on Git/Linux/open-source contributions, and shipping club projects.",
    responsibilities: [
      "Ran hands-on workshops on Git, Linux, Python, and AI tooling.",
      "Mentored 40+ juniors through their first open-source contributions.",
      "Coordinated the club's tech stack, servers, and event infrastructure.",
    ],
  },
  {
    slug: "foss-pr-lead",
    role: "Public Relations (PR) Lead",
    org: "Free and Open Source Software Club (FOSS), SREC",
    summary:
      "Owned outreach, event promotion, and industry partnerships for the FOSS club — landing sponsors and speakers for flagship events.",
    responsibilities: [
      "Managed cross-club and inter-college communications.",
      "Wrote pitch decks and coordinated with faculty & sponsors.",
      "Grew community reach via social media campaigns and posters.",
    ],
  },
  {
    slug: "csi-member",
    role: "Active Member",
    org: "Computer Society of India (CSI)",
    summary:
      "Active participant in CSI events — hackathons, technical talks, and cross-college competitions.",
    responsibilities: [
      "Attended national-level talks on AI, cloud, and cybersecurity.",
      "Volunteered at CSI-hosted hackathons and coding contests.",
    ],
  },
  {
    slug: "uyir-member",
    role: "Member",
    org: "Uyir Club, SREC",
    summary:
      "Contributing to Uyir's road-safety awareness drives and community outreach initiatives on campus.",
    responsibilities: [
      "Participated in road-safety awareness drives.",
      "Helped run on-campus community engagement events.",
    ],
  },
];
