export const profile = {
  name: "Tarunraj Kalyanasundaram",
  title: "CS & Physics Student @ UofT",
  tagline: "Bridging the gap between software, physics, and low-level systems",
  bio: "A passionate and reliable student pursuing a double specialization in Computer Science and Physics at the University of Toronto. With a rigorous background spanning systems programming, embedded hardware, and computational astrophysics, I thrive on building complex, high-performance systems. From low-latency trading engines to electric vehicles and quantum simulations, I am dedicated to exploring the frontiers of technology and physical sciences.",
  links: {
    github: "hhttps://github.com/tarunkalyan", // Updated with likely username
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
    tagline: "Systems, Games, and Quantum Experiments.",
    description: "A summary of key technical highlights from my portfolio of work.",
    node: { arm: 0, position: 0.52, color: "#5eead4", glowColor: "rgba(94,234,212,0.6)", size: 28 },
    items: [
      { label: "Columns Arcade Game", description: "Match-three arcade game implemented in Assembly, featuring low-level memory management and real-time state updates.", tags: ["Assembly", "Game Dev", "Low-level"], link: "#" },
      { label: "Quantum Simulation", description: "Applied quantum computing concepts using Qiskit to simulate and solve problems related to the Elitzur-Vaidman bomb tester.", tags: ["Python", "Qiskit", "Quantum"], link: "#" },
      { label: "Predictive Analytics Chatbot", description: "Python-based analytical system modeling correlations between gaming behavior and loneliness using dataset-driven insights.", tags: ["Python", "Data Science", "ML"], link: "#" },
      { label: "Social Media Platform", description: "Led the design and front-end architecture of a social media platform, focusing on user interaction and high-performance interface structures.", tags: ["React", "UI/UX", "Architecture"], link: "#" },
    ]
  },
  {
    id: "experience", label: "Experience", number: "02",
    tagline: "From Pipeline Engines to Electric Vehicles.",
    description: "Professional and research trajectores across systems engineering and astrophysics.",
    node: { arm: 1, position: 0.50, color: "#93c5fd", glowColor: "rgba(147,197,253,0.6)", size: 26 },
    items: [
      { label: "Systems Software Engineer", description: "Designed a modular multi-process pipeline engine in C with custom IPC and concurrent worker execution.", tags: ["C", "Unix Pipes", "Concurrency"], link: "#" },
      { label: "Low-Latency Trading Engineer", description: "Built a Java matching engine for sports betting with order matching logic and PostgreSQL persistence.", tags: ["Java", "SQL", "Trading Systems"], link: "#" },
      { label: "Embedded Systems Engineer", description: "Led electrical architecture and control logic for an EV team in an international racing competition.", tags: ["Embedded Systems", "Power Electronics", "Control Logic"], link: "#" },
      { label: "Astrophysics Researcher", description: "Developed Python simulations of Drake’s Equation and performed statistical analysis on the Fermi Paradox.", tags: ["Python", "NumPy", "SciPy"], link: "#" },
    ]
  },
  {
    id: "skills", label: "Skills", number: "03",
    tagline: "Tools for the Digital and Physical World.",
    description: "A comprehensive toolkit ranging from low-level assembly to high-level simulation libraries.",
    node: { arm: 2, position: 0.68, color: "#fca5a5", glowColor: "rgba(252,165,165,0.6)", size: 22 },
    items: [
      { label: "Languages", description: "C, C++, Java, Python, Assembly, JavaScript, TypeScript", tags: [], link: null },
      { label: "Systems & Backend", description: "Linux/Unix, Git, PostgreSQL, Concurrency, Multithreading, IPC, File I/O", tags: [], link: null },
      { label: "Scientific & Hardware", description: "NumPy, SciPy, Qiskit, Matplotlib, Microcontrollers, Embedded Systems, Circuit Analysis", tags: [], link: null },
    ]
  },
  {
    id: "education", label: "Education", number: "04",
    tagline: "Academic foundations at UofT.",
    description: "Pursuing double specialist in Computer Science and Physics with a minor in Math.",
    node: { arm: 3, position: 0.55, color: "#c4b5fd", glowColor: "rgba(196,181,253,0.6)", size: 24 },
    items: [
      { label: "University of Toronto", description: "B.S. in CS (Specialist), Astronomy & Physics (Specialist), and Mathematics (Minor).", tags: ["Dean's List", "Sep 2024 - June 2028"], link: "#" },
      { label: "Recognitions", description: "President's Scholarship, UAE Golden Visa, AP Scholar with Distinction.", tags: ["Awards"], link: "#" },
    ]
  },
  {
    id: "contact", label: "Contact", number: "05",
    type: "contact",
    tagline: "Initiate communication across the grid.",
    description: "Whether it's about systems engineering, quantum physics, or collaboration on new ventures—I'm always open to connecting.",
    node: { arm: 0, position: 0.78, color: "#fde68a", glowColor: "rgba(253,230,138,0.6)", size: 24 },
    items: [],
    details: [
      { label: "Email", value: "tarunkalyan3690@gmail.com", href: "mailto:tarunkalyan3690@gmail.com" },
      { label: "LinkedIn", value: "linkedin.com/in/tarunkalyan", href: "https://linkedin.com/in/tarunkalyan" },
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

