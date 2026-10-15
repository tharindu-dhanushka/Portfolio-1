import { useEffect, useMemo, useRef, useState } from "react";
import {
  creativeCategories,
  creativeWork,
  profile,
  projects,
  skills,
} from "./data/portfolio.js";
import ShaderBackground from "./components/ShaderBackground.jsx";

const navigation = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Creative Portfolio", "#creative"],
  ["Contact", "#contact"],
];

function SocialLink({ href, children, label }) {
  if (!href) return null;
  return (
    <a className="social-link" href={href} target="_blank" rel="noreferrer" aria-label={label}>
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("portfolio-theme") === "light" ? "light" : "dark",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const sections = navigation
      .map(([, href]) => document.querySelector(href))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label={`${profile.name} — home`}>
        TD<span>.</span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span>{menuOpen ? "Close" : "Menu"}</span>
        <span className={`menu-icon ${menuOpen ? "is-open" : ""}`} aria-hidden="true">
          <i />
          <i />
        </span>
      </button>
      <nav
        id="main-navigation"
        className={`main-navigation ${menuOpen ? "is-open" : ""}`}
        aria-label="Main navigation"
      >
        {navigation.map(([label, href]) => (
          <a
            key={href}
            href={href}
            aria-current={activeSection === href.slice(1) ? "location" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
        <button
          className="theme-toggle"
          type="button"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          aria-pressed={theme === "light"}
          onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
        >
          <span aria-hidden="true">{theme === "dark" ? "☼" : "☾"}</span>
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </nav>
    </header>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}

function ProjectCard({ project, index }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="project-card">
      <div className={`project-visual project-visual-${index + 1}`}>
        {project.image && !imageFailed ? (
          <img
            src={project.image}
            alt={project.imageAlt}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="visual-placeholder">
            <span className="placeholder-kicker">PROJECT {String(index + 1).padStart(2, "0")}</span>
            <span className="placeholder-title">{project.name}</span>
            <span className="placeholder-note">Screenshot can be added here</span>
          </div>
        )}
      </div>
      <div className="project-content">
        <div className="project-title-row">
          <h3>{project.name}</h3>
          <span className="project-arrow" aria-hidden="true">↗</span>
        </div>
        <p className="project-description">{project.description}</p>
        <div className="tag-list" aria-label="Technologies">
          {project.technologies.map((technology) => <span className="tag" key={technology}>{technology}</span>)}
        </div>
        <p className="project-status">{project.status}</p>
        <div className="project-links">
          {project.repository ? (
            <a href={project.repository} target="_blank" rel="noreferrer">GitHub repository ↗</a>
          ) : (
            <span className="link-placeholder">Repository link to add</span>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer">Live demo ↗</a>
          )}
        </div>
      </div>
    </article>
  );
}

function CreativeCard({ work, index, onSelect }) {
  const [assetFailed, setAssetFailed] = useState(false);
  const hasAsset = work.asset && !assetFailed;

  return (
    <button
      className={`creative-card creative-card-${index + 1}`}
      type="button"
      onClick={() => onSelect(assetFailed ? { ...work, asset: "" } : work)}
      aria-label={`Preview ${work.title}`}
    >
      <span className="creative-art">
        {hasAsset ? (
          work.type === "video" ? (
            <video
              src={work.asset}
              muted
              preload="metadata"
              aria-label={`${work.title} preview`}
              onError={() => setAssetFailed(true)}
            />
          ) : (
            <img
              src={work.asset}
              alt={work.title}
              loading="lazy"
              onError={() => setAssetFailed(true)}
            />
          )
        ) : (
          <span className="creative-placeholder">
            <span className="creative-mark" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span>{work.placeholder}</span>
            <small>PLACEHOLDER · REPLACE WITH YOUR WORK</small>
          </span>
        )}
      </span>
      <span className="creative-caption">
        <span><strong>{work.title}</strong><small>{work.category}</small></span>
        <span aria-hidden="true">↗</span>
      </span>
    </button>
  );
}

function CreativeGallery() {
  const [category, setCategory] = useState("All");
  const [selectedWork, setSelectedWork] = useState(null);
  const [previewAssetFailed, setPreviewAssetFailed] = useState(false);
  const closeButtonRef = useRef(null);
  const previewTriggerRef = useRef(null);
  const filteredWork = useMemo(
    () => creativeWork.filter((work) => category === "All" || work.category === category),
    [category],
  );

  useEffect(() => {
    if (!selectedWork) return undefined;
    setPreviewAssetFailed(false);
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedWork(null);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = document.querySelector(".lightbox")?.querySelectorAll(
        'button:not([disabled]), a[href], video[controls]',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previewTriggerRef.current?.isConnected) previewTriggerRef.current.focus();
    };
  }, [selectedWork]);

  return (
    <>
      <div className="filter-list" role="group" aria-label="Filter creative work">
        {creativeCategories.map((item) => (
          <button
            className={`filter-button ${category === item ? "is-active" : ""}`}
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="creative-grid">
        {filteredWork.map((work, index) => (
          <CreativeCard
            key={work.category}
            work={work}
            index={index}
            onSelect={(selected) => {
              previewTriggerRef.current = document.activeElement;
              setSelectedWork(selected);
            }}
          />
        ))}
      </div>
      {selectedWork && (
        <div
          className="lightbox-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedWork(null);
          }}
        >
          <section
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
          >
            <button
              className="lightbox-close"
              type="button"
              aria-label="Close preview"
              ref={closeButtonRef}
              onClick={() => setSelectedWork(null)}
            >
              Close <span aria-hidden="true">×</span>
            </button>
            <div className="lightbox-art">
              {selectedWork.asset && !previewAssetFailed ? (
                selectedWork.type === "video" ? (
                  <video
                    src={selectedWork.asset}
                    controls
                    autoPlay
                    aria-label={selectedWork.title}
                    onError={() => setPreviewAssetFailed(true)}
                  />
                ) : (
                  <img
                    src={selectedWork.asset}
                    alt={selectedWork.title}
                    onError={() => setPreviewAssetFailed(true)}
                  />
                )
              ) : (
                <p>{selectedWork.placeholder}<br /><small>Your real work will appear here when added.</small></p>
              )}
            </div>
            <div className="lightbox-info">
              <p className="eyebrow">{selectedWork.category}</p>
              <h3 id="lightbox-title">{selectedWork.title}</h3>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <a className="footer-name" href="#home">{profile.name}<span>.</span></a>
      <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      <div className="footer-socials">
        <SocialLink href={profile.github} label="GitHub">GitHub</SocialLink>
        <SocialLink href={profile.linkedin} label="LinkedIn">LinkedIn</SocialLink>
      </div>
    </footer>
  );
}

export default function App() {
  const [showTop, setShowTop] = useState(false);
  const emailHref = profile.email ? `mailto:${profile.email}` : "";

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 650);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="ambient-background" aria-hidden="true">
        <ShaderBackground />
      </div>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span className="availability-dot" /> BASED IN SRI LANKA</p>
            <h1 id="hero-title">Building useful<br />things with <em>purpose.</em></h1>
            <p className="hero-intro">
              I’m <strong>{profile.name}</strong> — an IT undergraduate, aspiring software developer, and digital creator.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">Explore my work <span aria-hidden="true">↘</span></a>
              <a className="button button-secondary" href="#contact">Contact me <span aria-hidden="true">↗</span></a>
            </div>
            <div className="hero-socials">
              <SocialLink href={profile.github} label="GitHub">GitHub</SocialLink>
              <SocialLink href={profile.linkedin} label="LinkedIn">LinkedIn</SocialLink>
              {!profile.github && !profile.linkedin && <span className="social-placeholder">Social links can be added in portfolio.js</span>}
            </div>
          </div>
          <div className="hero-art" aria-label="Decorative abstract portfolio artwork">
            <div className="hero-art-grid" />
            <span className="art-orbit orbit-one" />
            <span className="art-orbit orbit-two" />
            <span className="art-core">
              <img
                src={profile.image}
                alt={`Portrait of ${profile.name}`}
                onError={(event) => {
                  event.currentTarget.hidden = true;
                  event.currentTarget.nextElementSibling.hidden = false;
                }}
              />
              <span className="art-core-fallback" hidden>TD<span>.</span></span>
            </span>
            <span className="art-label art-label-top">SOFTWARE<br />&amp; IDEAS</span>
            <span className="art-label art-label-bottom">CREATIVE PRACTICE<br />01 — 05</span>
            <span className="art-coordinate">BSC IT<br />UNDERGRADUATE</span>
          </div>
          <a className="scroll-cue" href="#about"><span /> SCROLL TO EXPLORE</a>
          <span className="hero-index">STUDENT PORTFOLIO / 01</span>
        </section>

        <section className="section about-section" id="about">
          <div className="section-number">01 / ABOUT</div>
          <div className="about-layout">
            <SectionHeading eyebrow="A LITTLE ABOUT ME" title={<>Curiosity, with<br /><em>a practical side.</em></>} />
            <div className="about-copy">
              <p>{profile.about}</p>
              <p>{profile.learning}</p>
              <div className="education-note">
                <span className="education-icon" aria-hidden="true">↗</span>
                <div><span className="micro-label">CURRENTLY STUDYING</span><strong>BSc in Information Technology</strong><span>{profile.location}</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section skills-section" id="skills">
          <div className="section-number">02 / CAPABILITIES</div>
          <SectionHeading
            eyebrow="WHAT I’M LEARNING & USING"
            title={<>A growing set<br /><em>of tools.</em></>}
            description="Skills I’m actively exploring through coursework and personal projects."
          />
          <div className="skills-grid">
            {skills.map((group, index) => (
              <article className="skill-card" key={group.title}>
                <span className="skill-index">0{index + 1}</span>
                <h3>{group.title}</h3>
                <div className="tag-list">
                  {group.items.map((skill) => <span className="tag" key={skill}>{skill}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section projects-section" id="projects">
          <div className="section-number">03 / SELECTED WORK</div>
          <div className="section-topline">
            <SectionHeading
              eyebrow="SOFTWARE PROJECTS"
              title={<>Ideas in<br /><em>progress.</em></>}
              description="A selection of academic and personal projects. Details and links are being updated."
            />
            <span className="count-label">0{projects.length} PROJECTS</span>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => <ProjectCard project={project} index={index} key={project.name} />)}
          </div>
        </section>

        <section className="section creative-section" id="creative">
          <div className="section-number">04 / VISUAL WORK</div>
          <div className="section-topline">
            <SectionHeading
              eyebrow="CREATIVE PORTFOLIO"
              title={<>Made with a<br /><em>visual eye.</em></>}
              description="Graphic design, social posts, event visuals, video editing, and digital content."
            />
            <p className="gallery-hint">Select any card to preview <span aria-hidden="true">↘</span></p>
          </div>
          <CreativeGallery />
        </section>

        <section className="contact-section" id="contact">
          <div className="section-number">05 / GET IN TOUCH</div>
          <div className="contact-content">
            <p className="eyebrow">HAVE A PROJECT OR OPPORTUNITY?</p>
            <h2>Let’s make<br /><em>something useful.</em></h2>
            <p className="contact-intro">I’m open to conversations about internships, collaborations, and freelance inquiries.</p>
            {emailHref ? (
              <a className="button button-primary contact-button" href={emailHref}>Write me an email <span aria-hidden="true">↗</span></a>
            ) : (
              <p className="contact-placeholder">Add your email address in <code>src/data/portfolio.js</code> to enable direct contact.</p>
            )}
            <div className="contact-links">
              <SocialLink href={profile.github} label="GitHub">GitHub</SocialLink>
              <SocialLink href={profile.linkedin} label="LinkedIn">LinkedIn</SocialLink>
              <SocialLink href={profile.instagram} label="Instagram">Instagram</SocialLink>
            </div>
          </div>
          <div className="contact-side-note">GOOD THINGS<br />START WITH A HELLO.</div>
        </section>
      </main>
      <Footer />
      {showTop && <a className="back-to-top" href="#home" aria-label="Back to top">↑</a>}
    </>
  );
}
