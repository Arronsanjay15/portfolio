import { useEffect, useRef, useState } from 'react';
import {
  Menu, X, Mail, Linkedin, ExternalLink, Download, Award, GraduationCap,
  Code2, Globe, BarChart3, Sparkles, Wrench, Check, Copy, ArrowUp, ZoomIn,
} from 'lucide-react';
import './App.css';

/* ---------- Content (edit here, not in the markup) ---------- */

const EMAIL = 'arronsanjay15@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/arron-sanjay-732504353/';
const RESUME = '/Arron_Sanjay_Resume.pdf';
const YEAR = new Date().getFullYear();
const HEADLINE = 'I build web apps and turn data into decisions.';
const TICKER = ['React', 'Node.js', 'Express.js', 'MongoDB', 'SQL', 'PHP', 'Python', 'Power BI', 'Excel', 'REST APIs', 'Data cleaning', 'Prompt engineering'];

const NAV = [
  ['projects', 'Projects'],
  ['about', 'About'],
  ['skills', 'Skills'],
  ['education', 'Education'],
  ['contact', 'Contact'],
];

// Add `repo: 'https://github.com/...'` to any project to show a "Source code" link.
const PROJECTS = [
  {
    title: 'FitZone: workout planner and tracker',
    kind: 'Deployed web app',
    blurb: 'Plan, learn, and finish guided workouts, even without a connection.',
    points: [
      'Library of 80 exercises with level-adjusted workout plans',
      '30-day fitness challenge with progress saved on the user’s device',
      'Offline-first and responsive on mobile',
    ],
    tags: ['Web app', 'Offline-first', 'Responsive'],
    img: '/projects/fitzone.png',
    cat: 'web',
    pos: 'top',
    bg: '#0a0c09',
    alt: 'FitZone workout planner interface',
    url: 'fitzonepro-zephyr.vercel.app',
    live: 'https://fitzonepro-zephyr.vercel.app/',
  },
  {
    title: 'Online examination system',
    kind: 'MERN stack',
    blurb: 'Timed exams with separate student and administrator logins.',
    points: [
      'Multiple-choice tests with automatic scoring and instant results',
      'React frontend, Node.js and Express REST APIs',
      'MongoDB stores users, questions, and results',
    ],
    tags: ['React', 'Node.js', 'Express.js', 'MongoDB'],
    img: '/projects/online%20examination.jpeg',
    cat: 'web',
    pos: 'center', // crop position inside the hero stack; try 'top', 'center' or 'bottom'
    bg: '#ffffff',
    alt: 'Online examination system interface',
    url: 'online-exam.local',
  },
  {
    title: 'Lab slot booking system',
    kind: 'Academic project',
    blurb: 'Check which lab slots are free and book one online.',
    points: [
      'Live view of available laboratory slots',
      'Bookings stored in an SQL database',
      'Built with PHP and run locally on XAMPP',
    ],
    tags: ['PHP', 'SQL', 'XAMPP'],
    img: '/projects/lab_booking.png',
    cat: 'web',
    pos: 'top',
    bg: '#f3efe2',
    alt: 'Lab slot booking system interface',
    url: 'lab-booking.local',
  },
  {
    title: 'Student performance analysis',
    kind: 'Data analytics, 2024–2025',
    blurb: 'Turned raw student datasets into charts that support academic decisions.',
    points: [
      'Cleaned and preprocessed data to improve accuracy',
      'Power BI visuals comparing performance across cohorts',
      'Presented findings to support academic decision-making',
    ],
    tags: ['Power BI', 'Data cleaning', 'Data visualization'],
    img: '/projects/student_analysis.png',
    fallback: '/student_analysis.png', // tried automatically if the file sits in public/ instead of public/projects/
    cat: 'data',
    pos: 'top',
    bg: '#ffffff',
    alt: 'Power BI dashboard comparing student performance',
    url: 'student-performance.pbix',
  },
];

const SKILLS = [
  { id: 'web', icon: Globe, title: 'Web development', items: ['React', 'MERN stack', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'HTML', 'CSS', 'XAMPP'] },
  { id: 'prog', icon: Code2, title: 'Programming', items: ['Python', 'Java', 'C', 'SQL', 'PHP', 'JavaScript'] },
  { id: 'data', icon: BarChart3, title: 'Data analytics', items: ['Power BI', 'Microsoft Excel', 'Data cleaning', 'Data visualization', 'Business reporting'] },
  { id: 'ai', icon: Sparkles, title: 'Generative AI', items: ['Prompt engineering', 'LLM-assisted workflows'] },
  { id: 'tools', icon: Wrench, title: 'Tools', items: ['Vercel', 'Microsoft Word', 'Microsoft PowerPoint'] },
];

// Give every skill a running index so the entrance animation can stagger across all cards.
let skillCount = 0;
const SKILLS_INDEXED = SKILLS.map((g) => ({ ...g, items: g.items.map((name) => ({ name, i: skillCount++ })) }));

// Deterministic "scattered" start position for each chip.
const scatter = (i) => ({
  '--n': i,
  '--dx': `${((i * 53) % 140) - 70}px`,
  '--dy': `${((i * 71) % 100) - 50}px`,
  '--r': `${((i * 29) % 50) - 25}deg`,
});

const FEATURED_CERTS = [
  { name: 'Generative AI Essentials: Using LLMs to Work with Data', by: 'IBM SkillsBuild', when: 'May 2026' },
  { name: 'Data Analytics Job Simulation', by: 'Deloitte via Forage', when: 'May 2026' },
  { name: 'User Interface Design (Elite certification)', by: 'NPTEL, IIT Roorkee', when: 'Jan–Feb 2026' },
];

const MORE_CERTS = [
  { name: 'One Million Prompters (Prompt Engineering)', by: 'Dubai Future Foundation' },
  { name: 'Young Innovators Programme (YIP) 9.0 Recognition', by: 'K-DISC, Government of Kerala' },
  { name: 'MS Office', by: 'Multimedia Academy' },
  { name: '1M1B AI for Sustainability Virtual Internship', by: '1M1B' },
];

const FILTERS = [['all', 'All'], ['web', 'Web apps'], ['data', 'Data']];

// Which projects mention a skill (used by the clickable skill chips).
const matches = (p, term) =>
  term.length > 2 &&
  [p.title, p.kind, p.blurb, ...p.points, ...p.tags].join(' ').toLowerCase().includes(term.toLowerCase());

// Cursor-following highlight on the skill cards.
// Also magnifies the chips closest to the pointer, like a dock.
const spot = (e) => {
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
  if (e.pointerType !== 'mouse') return;
  card.querySelectorAll('.chips li').forEach((li) => {
    const b = li.getBoundingClientRect();
    const d = Math.hypot(e.clientX - (b.left + b.width / 2), e.clientY - (b.top + b.height / 2));
    li.style.setProperty('--mag', (1 + Math.max(0, 1 - d / 110) * 0.28).toFixed(3));
  });
};
const spotOut = (e) => {
  e.currentTarget.querySelectorAll('.chips li').forEach((li) => li.style.removeProperty('--mag'));
};

/* ---------- Small pieces ---------- */

// Screenshot that tries a second path if the first one 404s.
function Shot({ project, ...rest }) {
  const [src, setSrc] = useState(project.img);
  return (
    <img
      src={src}
      alt={project.alt}
      onError={() => { if (project.fallback && src !== project.fallback) setSrc(project.fallback); }}
      {...rest}
    />
  );
}

function Frame({ className = '', url, children }) {
  return (
    <div className={`frame ${className}`}>
      <div className="frame-bar" aria-hidden="true">
        <i /><i /><i />
        <span>{url}</span>
      </div>
      {children}
    </div>
  );
}

/* Drifting data points that link up, and reach toward the cursor. Pauses off screen. */
function HeroField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const hero = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: -9999, y: -9999 };
    let w = 0, h = 0, raf = 0, nodes = [], visible = true;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (reduce) continue;
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168, 180, 150, 0.65)';
        ctx.fill();
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.strokeStyle = `rgba(138, 152, 122, ${(1 - d / 120) * 0.35})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 170) {
          ctx.strokeStyle = `rgba(227, 199, 122, ${(1 - dm / 170) * 0.75})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    const build = () => {
      const r = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(80, Math.round((w * h) / 18000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.3 + 0.7,
      }));
      cancelAnimationFrame(raf);
      draw();
    };

    const move = (e) => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      hero.style.setProperty('--hx', `${mouse.x}px`);
      hero.style.setProperty('--hy', `${mouse.y}px`);
    };
    const leave = () => { mouse.x = -9999; mouse.y = -9999; };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
    });
    const ro = new ResizeObserver(build);

    build();
    io.observe(hero);
    ro.observe(hero);
    hero.addEventListener('pointermove', move);
    hero.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
    };
  }, []);

  return <canvas className="hero-field" ref={ref} aria-hidden="true" />;
}

/* ---------- App ---------- */

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', message: '' });
  const [filter, setFilter] = useState('all');
  const [tech, setTech] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const topRef = useRef(null);
  const bentoRef = useRef(null);
  const [skillsIn, setSkillsIn] = useState(false);
  const closeRef = useRef(null);

  const visible = PROJECTS.filter((p) =>
    tech ? matches(p, tech) : filter === 'all' || p.cat === filter,
  );

  const barRef = useRef(null);
  const navRef = useRef(null);
  const stackRef = useRef(null);

  // Scroll progress + nav background. Writes straight to the DOM, so no re-renders.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${ratio})`;
      if (navRef.current) navRef.current.classList.toggle('is-scrolled', window.scrollY > 24);
      if (topRef.current) topRef.current.classList.toggle('is-visible', window.scrollY > 700);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Highlight the nav link of the section in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    NAV.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Start the skills entrance once the grid is on screen.
  useEffect(() => {
    const el = bentoRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSkillsIn(true); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Escape closes the mobile menu and the screenshot viewer.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setLightbox(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // While the viewer is open: lock page scroll and move focus to its close button.
  useEffect(() => {
    if (!lightbox) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, [lightbox]);

  const tilt = (e) => {
    const el = stackRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-y * 12).toFixed(2)}deg`);
  };
  const untilt = () => {
    const el = stackRef.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  };

  const magnet = (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.32).toFixed(1)}px`;
  };
  const unmagnet = (e) => { e.currentTarget.style.translate = ''; };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const pickTech = (skill) => {
    if (tech === skill) { setTech(null); return; }
    setTech(skill);
    document.getElementById('projects')?.scrollIntoView();
  };

  const sendDraft = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
    const body = encodeURIComponent(form.message);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="site">
      <a className="skip-link" href="#projects">Skip to projects</a>
      <div className="progress" ref={barRef} aria-hidden="true" />

      {/* Navigation */}
      <nav className="nav" ref={navRef} aria-label="Main">
        <div className="wrap nav-inner">
          <a href="#home" className="brand" onClick={() => setMenuOpen(false)}>Arron Sanjay</a>
          <button
            className="nav-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className={active === id ? 'is-active' : ''}
                aria-current={active === id ? 'true' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <a className="nav-resume" href={RESUME} target="_blank" rel="noopener noreferrer">Resume</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header id="home" className="hero">
        <HeroField />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="status rise" style={{ '--d': '0ms' }}>
              <span className="status-dot" aria-hidden="true" />
              Open to internships and entry-level roles
            </p>
            <h1 className="hero-title" aria-label={HEADLINE}>
              {HEADLINE.split(' ').map((word, i) => (
                <span className="word" key={i} aria-hidden="true">
                  <span style={{ '--i': i }}>{word}</span>
                </span>
              ))}
            </h1>
            <p className="hero-intro rise" style={{ '--d': '750ms' }}>
              I’m Arron Sanjay, an MCA student working across full-stack development and data analytics:
              MERN apps on one side, Power BI reports on the other.
            </p>
            <div className="hero-actions rise" style={{ '--d': '880ms' }}>
              <a href="#projects" className="btn btn-primary magnetic" onPointerMove={magnet} onPointerLeave={unmagnet}>
                See my projects
              </a>
              <a href={RESUME} className="btn btn-line magnetic" target="_blank" rel="noopener noreferrer"
                onPointerMove={magnet} onPointerLeave={unmagnet}>
                <Download size={18} /> Open resume
              </a>
            </div>
          </div>

          <div className="hero-visual" onPointerMove={tilt} onPointerLeave={untilt}>
            <div className="stack" ref={stackRef}>
              <div className="stack-inner">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`layer layer-${'abcd'[i]}`}>
                    <Frame className="rise" url={PROJECTS[i].url}>
                      <Shot project={PROJECTS[i]} style={{ background: PROJECTS[i].bg }} />
                    </Frame>
                  </div>
                ))}

                <div className="float-card float-live" aria-hidden="true">
                  <div className="card-in rise" style={{ '--d': '1100ms' }}>
                    <span className="status-dot" /> Live on Vercel
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ticker" aria-hidden="true">
          <ul className="ticker-track">
            {[...TICKER, ...TICKER].map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      </header>

      {/* Projects */}
      <section id="projects" className="section on-paper">
        <div className="wrap">
          <div className="section-head">
            <h2>Projects</h2>
            <p>Four things I’ve built, from a deployed app to coursework with real data.</p>
          </div>

          <div className="filters" role="group" aria-label="Filter projects">
            {FILTERS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                className="filter-btn"
                aria-pressed={!tech && filter === id}
                onClick={() => { setTech(null); setFilter(id); }}
              >
                {label}
              </button>
            ))}
            {tech && (
              <button type="button" className="tech-pill" onClick={() => setTech(null)} aria-label={`Clear filter: ${tech}`}>
                Using {tech} <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="projects" key={`${filter}-${tech}`}>
            {visible.map((p, i) => (
              <article key={p.title} className={`project ${i === 0 ? 'project-lead' : ''}`}>
                <div className="project-text">
                  <p className="project-kind">{p.kind}</p>
                  <h3>{p.title}</h3>
                  <p className="project-blurb">{p.blurb}</p>
                  <ul className="project-points">
                    {p.points.map((pt) => <li key={pt}>{pt}</li>)}
                  </ul>
                  <ul className="tags" aria-label="Technologies">
                    {p.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  {(p.live || p.repo) && (
                    <div className="project-links">
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-link">
                          View live site <ExternalLink size={15} />
                        </a>
                      )}
                      {p.repo && (
                        <a href={p.repo} target="_blank" rel="noopener noreferrer" className="text-link">
                          Source code <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="project-shot">
                  <Frame url={p.url}>
                    <button type="button" className="shot-btn" onClick={() => setLightbox(p)}
                      aria-label={`View full-size screenshot: ${p.title}`}>
                      <Shot project={p} loading="lazy" />
                      <span className="shot-zoom" aria-hidden="true"><ZoomIn size={15} /> View full size</span>
                    </button>
                  </Frame>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section on-bone">
        <div className="wrap about-grid">
          <div>
            <h2>About me</h2>
            <p className="prose">
              I’m an MCA student who likes building things people can use. On the web side that means the MERN stack,
              PHP, and SQL. On the data side it means cleaning messy datasets and turning them into clear reports
              with Power BI and Excel.
            </p>
            <p className="prose">
              I pair the two on purpose: building the feature, then asking what the data says about it.
              I’m always picking up something new and putting it into a project.
            </p>
          </div>
          <dl className="facts">
            <div><dt>Studying</dt><dd>MCA, Kristu Jyoti College of Management and Technology</dd></div>
            <div><dt>Looking for</dt><dd>Internships and entry-level roles in software development or data analytics</dd></div>
            <div><dt>Main tools</dt><dd>React, Node.js, MongoDB, SQL, Power BI</dd></div>
            <div><dt>Languages</dt><dd>Malayalam (native), English and Hindi (proficient), French (beginner)</dd></div>
          </dl>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section on-moss">
        <div className="wrap">
          <div className="section-head">
            <h2>Skills</h2>
            <p>What I use day to day. Select a skill with a number to see the projects that use it.</p>
          </div>
          <div className={`bento ${skillsIn ? 'go' : 'pre'}`} ref={bentoRef}>
            {SKILLS_INDEXED.map(({ id, icon: Icon, title, items }, ci) => (
              <div key={id} className={`bento-card bento-${id}`} style={{ '--c': ci }} onPointerMove={spot} onPointerLeave={spotOut}>
                <h3><Icon size={20} aria-hidden="true" /> {title}</h3>
                <ul className="chips">
                  {items.map(({ name: s, i: gi }) => {
                    const n = PROJECTS.filter((p) => matches(p, s)).length;
                    return n ? (
                      <li key={s} className="chip-wrap" style={scatter(gi)}>
                        <button type="button" className={`chip-btn ${tech === s ? 'is-on' : ''}`}
                          aria-pressed={tech === s} onClick={() => pickTech(s)}
                          title={`Used in ${n} project${n > 1 ? 's' : ''}`}>
                          {s}<b>{n}</b>
                        </button>
                      </li>
                    ) : (
                      <li key={s} style={scatter(gi)}>{s}</li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="section on-paper">
        <div className="wrap edu-grid">
          <div>
            <h2>Education</h2>
            <ol className="timeline">
              <li>
                <p className="timeline-when">In progress</p>
                <h3>Master of Computer Applications (MCA)</h3>
                <p>Kristu Jyoti College of Management and Technology, Mahatma Gandhi University</p>
              </li>
              <li>
                <p className="timeline-when">2025</p>
                <h3>Bachelor of Commerce, Computer Applications</h3>
                <p>Kristu Jyoti College of Management and Technology, Mahatma Gandhi University</p>
              </li>
            </ol>
          </div>

          <div>
            <h2>Certifications</h2>
            <ul className="certs">
              {FEATURED_CERTS.map((c) => (
                <li key={c.name}>
                  <Award size={20} aria-hidden="true" />
                  <div>
                    <h3>{c.name}</h3>
                    <p>{c.by}, {c.when}</p>
                  </div>
                </li>
              ))}
            </ul>
            <details className="more-certs">
              <summary>
                <GraduationCap size={18} aria-hidden="true" /> {MORE_CERTS.length} more certifications
              </summary>
              <ul>
                {MORE_CERTS.map((c) => (
                  <li key={c.name}><strong>{c.name}</strong>{c.by !== '1M1B' && <span>, {c.by}</span>}</li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section on-moss contact">
        <div className="wrap contact-grid">
          <div>
            <h2>Hiring for an internship or a junior role?</h2>
            <p className="prose">
              I’m looking for opportunities in software development or data analytics.
              Send a note and I’ll reply.
            </p>
            <div className="contact-actions">
              <button type="button" className="btn btn-primary" onClick={copyEmail}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Email copied' : EMAIL}
              </button>
              <a className="btn btn-line" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                <Linkedin size={18} /> LinkedIn
              </a>
            </div>
            <p className="sr-only" aria-live="polite">{copied ? 'Email address copied to clipboard' : ''}</p>
          </div>

          <form className="form" onSubmit={sendDraft}>
            <label>
              Your name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
              />
            </label>
            <label>
              Message
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>
            <button type="submit" className="btn btn-primary">
              <Mail size={18} /> Open email draft
            </button>
            <p className="form-note">This opens a draft in your email app. Nothing is sent until you press send.</p>
          </form>
        </div>
      </section>

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={lightbox.title}
          onClick={(e) => e.target === e.currentTarget && setLightbox(null)}>
          <button ref={closeRef} type="button" className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close viewer">
            <X size={22} />
          </button>
          <figure className="lightbox-card">
            <Shot key={lightbox.title} project={lightbox} />
            <figcaption className="lightbox-cap">
              <span>{lightbox.title}</span>
              {lightbox.live && (
                <a href={lightbox.live} target="_blank" rel="noopener noreferrer" className="lightbox-link">
                  View live site <ExternalLink size={14} />
                </a>
              )}
            </figcaption>
          </figure>
        </div>
      )}

      <button ref={topRef} type="button" className="to-top" aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0 })}>
        <ArrowUp size={20} />
      </button>

      <footer className="footer">
        <div className="wrap footer-inner">
          <p>Arron Sanjay</p>
          <p>© {YEAR}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;