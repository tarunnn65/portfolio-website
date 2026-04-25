export const profile = {
  name: "Tarunraj Kalyanasundaram",
  title: "CS & Astrophysics Specialist @ UofT",
  tagline: "Low-level systems, astrophysics research, and hardware — built from first principles.",
  bio: "A Dean's List scholar pursuing a double specialization in Computer Science and Astronomy & Physics at the University of Toronto, with a Mathematics minor. My work spans multi-process systems programming in C, low-latency trading engines in Java, quantum computing simulations in Python, and real-time embedded firmware for electric vehicles. Whether I'm designing IPC protocols, modeling the Drake Equation via Monte Carlo methods, or racing an EV I helped build — I'm always engineering at the edge of what's possible.",
  links: {
    github: "https://github.com/tarunnn65",
    linkedin: "https://linkedin.com/in/tarunkalyan",
    email: "mailto:tarunkalyan3690@gmail.com"
  }
};

export const sections = [
  {
    id: "about", label: "About Me", number: "00",
    tagline: "Systems, Physics, and Innovation.",
    description: profile.bio,
    node: { arm: 0, position: 0.05, color: "#fef08a", glowColor: "rgba(254,240,138,0.6)", size: 32 },
    items: []
  },
  {
    id: "projects", label: "Projects", number: "01",
    tagline: "From Pipelines to Quantum Bombs.",
    description: "A selection of technical projects spanning systems programming, low-level game dev, quantum simulation, and predictive analytics.",
    node: { arm: 0, position: 0.52, color: "#5eead4", glowColor: "rgba(94,234,212,0.6)", size: 28 },
    items: [
      {
        label: "Multi-Process Pipeline Engine",
        description: "Built a multi-process pipeline engine in C using fork(), exec(), and Unix pipes. Designed a length-prefixed packet protocol for robust IPC, coordinated concurrent worker processes with backpressure, and implemented graceful fault handling for broken pipes and child crashes.",
        tags: ["C", "Unix IPC", "Concurrency"],
        link: "#"
      },
      {
        label: "Order Matching Engine – Sports Betting Exchange",
        description: "Built a price-time priority order book in Java supporting limit and market orders with partial fills, backed by PostgreSQL. Implemented probabilistic pricing for normalized opposing-outcome odds, database transactions for double-spend prevention, and a Swing UI for live order book visualization.",
        tags: ["Java", "PostgreSQL", "Swing"],
        link: "#"
      },
      {
        label: "Columns – Match-Three Game in Assembly",
        description: "Implemented the arcade game Columns in x86 Assembly: board state, gravity, three-in-a-row detection, and real-time input handling, with manual register and memory management throughout.",
        tags: ["x86 Assembly", "Game Dev", "Low-level"],
        link: "#"
      },
      {
        label: "Quantum Bomb Tester Simulation",
        description: "Simulated the Elitzur–Vaidman bomb tester in Qiskit — an interaction-free measurement that detects a \"bomb\" without triggering it — and verified the predicted detection probability against the analytic result.",
        tags: ["Python", "Qiskit", "Quantum Computing"],
        link: "#"
      },
      {
        label: "Predictive Analytics Chatbot",
        description: "Python-based analytical system modeling correlations between gaming behavior and loneliness using dataset-driven insights. Built a conversational interface layered over statistical models to surface personalized findings.",
        tags: ["Python", "Data Science", "ML"],
        link: "#"
      },
    ]
  },
  {
    id: "experience", label: "Experience", number: "02",
    tagline: "Electric Vehicles, Monte Carlo, and Racing Podiums.",
    description: "Hands-on roles at the intersection of embedded hardware, computational astrophysics, and competitive engineering.",
    node: { arm: 1, position: 0.50, color: "#93c5fd", glowColor: "rgba(147,197,253,0.6)", size: 26 },
    items: [
      {
        label: "Embedded Systems Engineer & Race Driver",
        description: "Placed top 3 of 25+ teams at an international EV competition (Sep 2023 – Mar 2024, Abu Dhabi). Served as primary driver and led pit-stop diagnostics under time pressure. Designed the vehicle's full electrical architecture — battery integration, power distribution, and protection circuitry — and wrote microcontroller firmware for throttle control and live telemetry.",
        tags: ["Embedded Systems", "Power Electronics", "Firmware", "C"],
        link: "#"
      },
      {
        label: "Astrophysics Researcher – Drake Equation Modeling",
        description: "Placed top 3 in a cross-institutional astrophysics competition (Sep 2023 – Apr 2024, Abu Dhabi). Built a Monte Carlo simulation in Python (NumPy, SciPy) over uncertain astrophysical parameters, producing probability distributions over civilization counts. Ran sensitivity analysis to identify which Drake terms drove output uncertainty most strongly.",
        tags: ["Python", "NumPy", "SciPy", "Monte Carlo"],
        link: "#"
      },
    ]
  },
  {
    id: "skills", label: "Skills", number: "03",
    tagline: "From Assembly to Quantum Circuits.",
    description: "A broad toolkit spanning low-level systems, scientific computing, embedded hardware, and core CS fundamentals.",
    node: { arm: 2, position: 0.68, color: "#fca5a5", glowColor: "rgba(252,165,165,0.6)", size: 22 },
    items: [
      { label: "Languages", description: "Python, C, C++, Java, x86 Assembly, SQL", tags: [], link: null },
      { label: "Systems & Backend", description: "Linux/Unix, Git, PostgreSQL, multi-processing, multi-threading, IPC (fork/exec/pipes), memory management", tags: [], link: null },
      { label: "Scientific & ML Libraries", description: "NumPy, SciPy, Matplotlib, Qiskit", tags: [], link: null },
      { label: "Embedded & Hardware", description: "Microcontroller firmware, power electronics, circuit analysis, oscilloscope and multimeter debugging", tags: [], link: null },
      { label: "Concepts", description: "Data structures & algorithms, systems programming, concurrency, statistical modeling, Monte Carlo methods, control systems", tags: [], link: null },
    ]
  },
  {
    id: "education", label: "Education", number: "04",
    tagline: "Computer Science, Astrophysics & Math at UofT.",
    description: "Pursuing a double specialization in CS and Astronomy & Physics with a Mathematics minor at the University of Toronto, St. George.",
    node: { arm: 3, position: 0.55, color: "#c4b5fd", glowColor: "rgba(196,181,253,0.6)", size: 24 },
    items: [
      {
        label: "University of Toronto, St. George",
        description: "B.Sc., Computer Science Specialist; Astronomy & Physics Specialist; Mathematics Minor. Sep 2024 – June 2028. Dean's List Scholar, Faculty of Arts and Science. Coursework includes Software Design, Data Structures, Computer Organization, Linear Algebra, Multivariable Calculus, Quantum Physics, Galaxies & Cosmology, and more.",
        tags: ["Dean's List", "Sep 2024 – Jun 2028"],
        link: "#"
      },
      {
        label: "Awards & Recognition",
        description: "Dean's List Scholar (UofT) · UAE Golden Visa – 10-year residency awarded for academic excellence · Top 3, International Electric Vehicle Competition (25+ teams) · Top 3, Cross-Institutional Astrophysics Competition.",
        tags: ["Awards"],
        link: "#"
      },
    ]
  },
  {
    id: "contact", label: "Contact", number: "05",
    type: "contact",
    tagline: "Initiate communication across the grid.",
    description: "Whether it's about systems engineering, quantum physics, or collaboration on new ventures — I'm always open to connecting.",
    node: { arm: 0, position: 0.78, color: "#fde68a", glowColor: "rgba(253,230,138,0.6)", size: 24 },
    items: [],
    details: [
      { label: "Email", value: "tarunkalyan3690@gmail.com", href: "mailto:tarunkalyan3690@gmail.com" },
      { label: "LinkedIn", value: "linkedin.com/in/tarunkalyan", href: "https://linkedin.com/in/tarunkalyan" },
      { label: "GitHub", value: "tarunnn65.github.io/portfolio", href: "https://tarunnn65.github.io/portfolio" },
      { label: "Phone", value: "+1 (647) 720-7058", href: "tel:+16477207058" },
    ],
    formFields: [
      { name: "name", label: "Name", type: "text", placeholder: "Your name", half: true },
      { name: "email", label: "Email", type: "email", placeholder: "your@email.com", half: true },
      { name: "subject", label: "Subject", type: "text", placeholder: "What's this about?" },
      { name: "message", label: "Message", type: "textarea", placeholder: "Tell me about your project or opportunity..." },
    ]
  }
];
