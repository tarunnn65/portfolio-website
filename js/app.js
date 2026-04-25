import { profile, sections } from './data.js?v=3';

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════
function gaussRng() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

const SVG = { github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`, linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`, email: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>` };

// Abstract fluid math
const ARMS = 4;
const TOTAL_WIND = Math.PI * 3.5;
function armAngle(arm, t) { return (arm / ARMS) * Math.PI * 2 + t * TOTAL_WIND; }
function armRadius(t) { return 45 + Math.pow(t, 1.2) * 550; }

// ═══════════════════════════════════════════════════
// GALAXY PORTFOLIO v5 — Flying Nodes
// ═══════════════════════════════════════════════════
class GalaxyPortfolio {
  constructor() {
    this.canvas = document.getElementById('galaxy-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container = document.getElementById('galaxy-container');
    this.nodesLayer = document.getElementById('nodes-layer');

    // Low-frequency static texture buffer
    this.glowCanvas = document.createElement('canvas');
    this.glowCanvas.width = 1600; this.glowCanvas.height = 1600;
    this.glowCtx = this.glowCanvas.getContext('2d', { alpha: true });

    this.time = 0; this.rotation = 0; this.scale = 1; this.cx = 0; this.cy = 0;
    this.mouseX = 0; this.mouseY = 0; this.targetMouseX = 0; this.targetMouseY = 0;
    this.isGalaxy = true;
    this._hidden = false; this._lastT = 0;

    this.bgStars = [];
    this.heroStars = [];
    this.accretionTrails = [];
    this.shootingStars = [];
    this.lastShoot = 0; this.lastShower = 0;

    // Node & section tracking
    this.nodeEls = new Map();
    this.nodePositions = new Map();
    this.sectionEls = new Map();
    this.homePositions = new Map();
    this.activeSection = null;

    this.init();
  }

  init() {
    this.resize();
    this.generateParticles();
    this.renderPainterlyBackground();
    this.buildIdentityCard();
    this.buildSections();
    this.createNodes();
    this.setupSectionReveal();
    this.attachEvents();
    window.addEventListener('scroll', () => {
      if (this._hidden) this.animate(performance.now());
    });
    window.addEventListener('resize', () => { this.resize(); this.generateBgStars(); });
    window.addEventListener('mousemove', e => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    document.addEventListener('visibilitychange', () => { this._hidden = document.hidden; if (!this._hidden) this._lastT = 0; });
    requestAnimationFrame(t => this.animate(t));
  }

  resize() {
    this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight;
    this.cx = this.canvas.width / 2; this.cy = this.canvas.height / 2;
    this.scale = Math.max(0.25, Math.min(1.2, (Math.min(this.cx, this.cy) - 20) / 480));
  }

  // ═══════════════════════════════════════════════════
  // PARTICLE GENERATION (preserved from v4)
  // ═══════════════════════════════════════════════════
  generateParticles() {
    this.generateBgStars();

    this.heroStars = [];
    for (let a = 0; a < ARMS; a++) {
      for (let i = 0; i < 35; i++) {
        const t = Math.pow(Math.random(), 1.5);
        const theta = armAngle(a, t);
        const r = armRadius(t);
        const spread = 15 + t * 45;
        const pt = this.offsetPoint(r, theta, spread);
        this.heroStars.push({
          x: pt.x, y: pt.y,
          size: Math.random() * 1.8 + 0.8,
          flare: Math.random() > 0.8,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.5,
          color: Math.random() > 0.6 ? '#fca5a5' : (Math.random() > 0.5 ? '#93c5fd' : '#fff')
        });
      }
    }

    this.accretionTrails = [];
    for (let i = 0; i < 85; i++) {
      const t = Math.random();
      const rOuter = 20 + t * 45;
      const angle = Math.random() * Math.PI * 2;
      this.accretionTrails.push({
        angle,
        rX: rOuter,
        rY: rOuter * 0.25,
        speed: (1.5 + (1 - t) * 4) * (Math.random() > 0.5 ? 1 : -1),
        length: 0.15 + Math.random() * 0.35,
        width: 1 + Math.random() * 2,
        color: t < 0.2 ? `rgba(255,100,50,${0.2 + Math.random() * 0.3})` : `rgba(255,200,150,${0.1 + Math.random() * 0.2})`
      });
    }
  }

  offsetPoint(r, theta, spread) {
    const g = gaussRng() * spread;
    const perp = theta + Math.PI / 2;
    return { x: r * Math.cos(theta) + g * Math.cos(perp), y: r * Math.sin(theta) + g * Math.sin(perp) };
  }

  generateBgStars() {
    this.bgStars = [];
    const w = this.canvas.width + 400, h = this.canvas.height + 400;
    for (let i = 0; i < 800; i++) {
      this.bgStars.push({
        x: Math.random() * w - 200, y: Math.random() * h - 200,
        size: Math.random() * 1.2 + 0.2,
        opacity: Math.random() * 0.4 + 0.05,
        layer: Math.floor(Math.random() * 4)
      });
    }
  }

  // ═══════════════════════════════════════════════════
  // PAINTERLY RENDER ENGINE (preserved from v4)
  // ═══════════════════════════════════════════════════
  renderPainterlyBackground() {
    const gc = this.glowCtx, C = 800;
    gc.clearRect(0, 0, 1600, 1600);
    gc.globalCompositeOperation = 'screen';
    this.drawRadial(gc, C, C, 400, 'rgba(30,20,70,0.15)', 'transparent');
    this.drawRadial(gc, C, C, 150, 'rgba(255,150,50,0.12)', 'transparent');
    this.drawRadial(gc, C, C, 80, 'rgba(255,220,180,0.2)', 'transparent');

    for (let a = 0; a < ARMS; a++) {
      const isPinkArm = a % 2 === 0;
      for (let i = 0; i < 150; i++) {
        const t = i / 150;
        const theta = armAngle(a, t);
        const r = armRadius(t);
        const cloudSize = 35 + t * 120;
        const pt = this.offsetPoint(r, theta, 15 + t * 30);
        let colorStr;
        const alpha = 0.015 + (1 - t) * 0.03;
        if (t < 0.2) colorStr = `rgba(255, 180, 100, ${alpha * 1.5})`;
        else if (isPinkArm) colorStr = `rgba(220, 80, 150, ${alpha})`;
        else colorStr = `rgba(80, 160, 255, ${alpha})`;
        this.drawRadial(gc, C + pt.x, C + pt.y, cloudSize, colorStr, 'transparent');
      }
    }

    for (let i = 0; i < 60; i++) {
      const a = Math.floor(Math.random() * ARMS);
      const t = 0.1 + Math.random() * 0.8;
      const pt = this.offsetPoint(armRadius(t), armAngle(a, t), 20 + t * 50);
      const isDark = Math.random() > 0.7;
      gc.globalCompositeOperation = isDark ? 'destination-out' : 'screen';
      const color = isDark ? `rgba(0,0,0,${0.1 + Math.random() * 0.2})` : `rgba(255,120,200,${0.02 + Math.random() * 0.04})`;
      this.drawRadial(gc, C + pt.x, C + pt.y, 40 + Math.random() * 60, color, 'transparent');
    }
  }

  drawRadial(ctx, x, y, r, c1, c2) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  spiralPos(arm, t) {
    const theta = armAngle(arm, t) + this.rotation;
    const r = armRadius(t);
    return { x: this.cx + r * this.scale * Math.cos(theta), y: this.cy + r * this.scale * Math.sin(theta) };
  }

  // ═══════════════════════════════════════════════════
  // BUILD SECTIONS — Full-page editorial layouts
  // ═══════════════════════════════════════════════════
  buildSections() {
    const container = document.getElementById('sections-container');

    sections.forEach((sec) => {
      const section = document.createElement('section');
      section.className = 'portfolio-section';
      section.id = `section-${sec.id}`;

      // Section glow overlay
      const glow = document.createElement('div');
      glow.className = 'section-glow';
      glow.style.background = sec.node.glowColor.replace('0.6', '1');
      section.appendChild(glow);

      // Content wrapper
      const content = document.createElement('div');
      content.className = 'section-content';

      if (sec.type === 'contact') {
        content.innerHTML = this.buildContactHTML(sec);
      } else {
        content.innerHTML = this.buildSectionHTML(sec);
      }

      section.appendChild(content);
      container.appendChild(section);
      this.sectionEls.set(sec.id, section);
    });

    // Wire up contact form — real EmailJS integration
    // Setup: sign up at emailjs.com → create a service linked to your Gmail
    //        → create a template with variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
    //        → replace the three placeholders below with your actual IDs
    const EMAILJS_PUBLIC_KEY = 'wVzN-JU3sOAOLbcEP';   // e.g. 'user_abc123'
    const EMAILJS_SERVICE_ID = 'service_nkd9eqm';   // e.g. 'service_gmail'
    const EMAILJS_TEMPLATE_ID = 'service_nkd9eq';  // e.g. 'template_portfolio'

    if (typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('.contact-submit');

        // Guard: warn if not yet configured
        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
          btn.innerHTML = '<span class="contact-submit-text">⚠ EmailJS not configured yet</span>';
          setTimeout(() => {
            btn.innerHTML = '<span class="contact-submit-text">Send Message <span class="arrow">&rarr;</span></span>';
          }, 3000);
          return;
        }

        // Show loading state
        btn.disabled = true;
        btn.innerHTML = '<span class="contact-submit-text">Sending…</span>';

        const templateParams = {
          from_name: form.querySelector('[name="name"]').value,
          from_email: form.querySelector('[name="email"]').value,
          subject: form.querySelector('[name="subject"]').value,
          message: form.querySelector('[name="message"]').value,
          to_email: 'tarunkalyan3690@gmail.com',
        };

        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
          btn.classList.add('sent');
          btn.innerHTML = '<span class="contact-submit-text">Message Sent ✓</span>';
          form.reset();
          setTimeout(() => {
            btn.classList.remove('sent');
            btn.disabled = false;
            btn.innerHTML = '<span class="contact-submit-text">Send Message <span class="arrow">&rarr;</span></span>';
          }, 4000);
        } catch (err) {
          console.error('EmailJS error:', err);
          btn.innerHTML = '<span class="contact-submit-text">Failed — try emailing directly</span>';
          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<span class="contact-submit-text">Send Message <span class="arrow">&rarr;</span></span>';
          }, 4000);
        }
      });
    }
  }

  buildSectionHTML(sec) {
    const itemsHtml = sec.items.map(item => {
      const tagsHtml = item.tags && item.tags.length > 0
        ? `<div class="section-item-tags">${item.tags.map(t => `<span class="section-tag">${t}</span>`).join('')}</div>`
        : '';
      return `
        <div class="section-item">
          <div class="section-item-header">
            <strong>${item.label}</strong>
            ${tagsHtml}
          </div>
          ${item.description ? `<p>${item.description}</p>` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="section-header">
        <div class="section-header-top">
          <h2 class="section-heading">${sec.label}</h2>
          <span class="section-number">${sec.number}</span>
        </div>
        <p class="section-tagline">${sec.tagline}</p>
        <p class="section-desc">${sec.description}</p>
      </div>
      <div class="section-items">${itemsHtml}</div>
    `;
  }

  buildContactHTML(sec) {
    const detailsHtml = (sec.details || []).map(d => `
      <a class="contact-detail-row" href="${d.href}" ${d.href.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
        <span class="contact-detail-label">${d.label}</span>
        <span class="contact-detail-value">${d.value}</span>
      </a>
    `).join('');

    let formHtml = '';
    const halfFields = (sec.formFields || []).filter(f => f.half);
    const fullFields = (sec.formFields || []).filter(f => !f.half);

    if (halfFields.length) {
      formHtml += '<div class="contact-form-row">';
      halfFields.forEach(f => {
        formHtml += `
          <div class="contact-field">
            <label for="contact-${f.name}">${f.label}</label>
            <input type="${f.type}" id="contact-${f.name}" name="${f.name}" placeholder="${f.placeholder}" required />
          </div>
        `;
      });
      formHtml += '</div>';
    }

    fullFields.forEach(f => {
      formHtml += `<div class="contact-field">
        <label for="contact-${f.name}">${f.label}</label>
        ${f.type === 'textarea'
          ? `<textarea id="contact-${f.name}" name="${f.name}" placeholder="${f.placeholder}" required></textarea>`
          : `<input type="${f.type}" id="contact-${f.name}" name="${f.name}" placeholder="${f.placeholder}" required />`
        }
      </div>`;
    });

    return `
      <div class="section-header">
        <div class="section-header-top">
          <h2 class="section-heading">${sec.label}</h2>
          <span class="section-number">${sec.number}</span>
        </div>
        <p class="section-tagline">${sec.tagline}</p>
        <p class="section-desc">${sec.description}</p>
      </div>
      <div class="contact-grid">
        <div class="contact-details">${detailsHtml}</div>
        <form class="contact-form" id="contact-form">
          ${formHtml}
          <button type="submit" class="contact-submit">
            <span class="contact-submit-text">Send Message <span class="arrow">&rarr;</span></span>
          </button>
        </form>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════
  // CREATE NODES — Simplified flying dots
  // ═══════════════════════════════════════════════════
  createNodes() {
    sections.forEach((sec, i) => {
      const el = document.createElement('div');
      el.className = 'galaxy-node';
      el.id = `node-${sec.id}`;
      el.style.setProperty('--node-color', sec.node.color);
      el.style.setProperty('--node-glow', sec.node.glowColor);

      el.innerHTML = `
        <div class="node-dot"></div>
        <div class="node-orbit-path"></div>
        <div class="node-ring"></div>
        <span class="node-label">${sec.label}</span>
      `;

      this.nodesLayer.appendChild(el);
      this.nodeEls.set(sec.id, el);

      // Initialize position at galaxy spiral coordinate
      const pos = this.spiralPos(sec.node.arm, sec.node.position);
      this.nodePositions.set(sec.id, { x: pos.x, y: pos.y });

      // Staggered entrance
      setTimeout(() => el.classList.add('entered'), 800 + i * 200);
    });
  }

  // ═══════════════════════════════════════════════════
  // SECTION REVEAL — IntersectionObserver for fade-in
  // ═══════════════════════════════════════════════════
  setupSectionReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.15 });

    this.sectionEls.forEach(el => observer.observe(el));
  }

  // ═══════════════════════════════════════════════════
  // NODE FLIGHT — Core scroll-driven animation
  // ═══════════════════════════════════════════════════
  updateNodesFlight(time) {
    // 1. Determine which section is most visible (closest center to viewport center)
    const vpCenter = window.innerHeight / 2;
    let newActive = null;
    let minDist = Infinity;

    this.sectionEls.forEach((el, id) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - vpCenter);
        if (dist < minDist) {
          minDist = dist;
          newActive = id;
        }
      }
    });

    // Only activate if section is reasonably close to center
    if (minDist > window.innerHeight * 0.8) newActive = null;

    // Update active section
    if (newActive !== this.activeSection) {
      if (this.activeSection) {
        const prev = this.sectionEls.get(this.activeSection);
        if (prev) prev.classList.remove('active');
      }
      this.activeSection = newActive;
      if (this.activeSection) {
        const next = this.sectionEls.get(this.activeSection);
        if (next) next.classList.add('active');
      }
    }

    // 2. Galaxy/UI fade based on scroll
    const scrollY = window.scrollY || 0;
    const heroH = window.innerHeight;
    const scrollP = Math.min(1, Math.max(0, scrollY / heroH));

    // Galaxy dims but never fully disappears
    this.canvas.style.opacity = Math.max(0.1, 1 - scrollP * 0.88);
    this.canvas.style.transform = `scale(${1 + scrollP * 0.15})`;

    // Black hole fades out
    const bh = document.getElementById('black-hole-target');
    if (bh) bh.style.opacity = Math.max(0, 1 - scrollP * 2.5);

    // Scroll prompt
    const prompt = document.getElementById('scroll-prompt');
    if (prompt) prompt.style.opacity = scrollP > 0.08 ? 0 : 1;

    // Track whether we're in the sections area 
    const inSections = scrollP > 0.3;

    // Identity card fully fades when scrolled into sections
    const idCard = document.getElementById('identity-card');
    if (idCard) {
      idCard.classList.toggle('hidden-in-sections', inSections);
    }

    const totalNodes = sections.length;
    const spacing = Math.min(120, window.innerHeight / (totalNodes + 1));
    const listStartY = window.innerHeight / 2 - ((totalNodes - 1) * spacing) / 2;
    // On small screens, put it closer to the right edge
    const rightSideX = window.innerWidth - (window.innerWidth < 768 ? 40 : 150);

    // 3. Compute and lerp node positions
    sections.forEach((sec, i) => {
      const el = this.nodeEls.get(sec.id);
      const pos = this.nodePositions.get(sec.id);
      if (!el || !pos) return;

      // Galaxy position
      const galaxyPos = this.spiralPos(sec.node.arm, sec.node.position);
      const bobX = Math.sin(time * 1.5 + i * 1.2) * 5;
      const bobY = Math.cos(time * 1.8 + i) * 4;
      const galaxyX = galaxyPos.x + bobX;
      const galaxyY = galaxyPos.y + bobY;

      // Right sidebar list position
      const listX = rightSideX + bobX;
      const listY = listStartY + i * spacing + bobY;

      // Interpolate home target based on scroll
      const transitionP = Math.min(1, scrollY / (window.innerHeight * 0.8));
      const homeX = galaxyX + (listX - galaxyX) * transitionP;
      const homeY = galaxyY + (listY - galaxyY) * transitionP;

      // Save the nominal resting position to draw the unbroken spine line
      this.homePositions.set(sec.id, { x: homeX, y: homeY });

      let targetX, targetY;
      let scale = 1;

      // Ensure About Me node forms precisely out of the black hole when scrolling
      const rawScrollY = window.scrollY || 0;
      if (sec.id === 'about') {
        scale = Math.min(1, Math.max(0, rawScrollY / (window.innerHeight * 0.2)));
      }

      const isDocked = sec.id === this.activeSection;

      if (isDocked) {
        // Dock target: section's top-left "life corner" with floating motion
        const sectionEl = this.sectionEls.get(sec.id);
        if (sectionEl) {
          const rect = sectionEl.getBoundingClientRect();
          // Position relative to the viewport based on the section's rect
          const isMobile = window.innerWidth < 768;
          const insetX = isMobile ? 30 : 80;
          const insetY = isMobile ? 80 : 100;
          targetX = rect.left + insetX + Math.sin(time * 2) * 6;
          targetY = Math.min(Math.max(rect.top + insetY, 80), window.innerHeight - 80) + Math.cos(time * 2.5) * 6;
        } else {
          targetX = homeX;
          targetY = homeY;
        }
      } else {
        // Special cinematic transition strictly for the About Me node on landing:
        // Instead of flying to the right spine, interpolating its target directly
        // from the Black Hole to the left docking area.
        if (sec.id === 'about' && rawScrollY < window.innerHeight) {
          const t = Math.min(1, Math.max(0, rawScrollY / window.innerHeight));
          const easeT = t * t * (3 - 2 * t); // Smoothstep easing
          const dockedX = window.innerWidth * 0.15;
          const dockedY = window.innerHeight * 0.5;

          targetX = galaxyX + (dockedX - galaxyX) * easeT;
          // Add a beautiful ballistic arc so it flies "up then down"
          const arcHeight = window.innerHeight * 0.35;
          targetY = galaxyY + (dockedY - galaxyY) * easeT - Math.sin(easeT * Math.PI) * arcHeight;

          scale = Math.max(scale, easeT * 1.8);
        } else {
          targetX = homeX;
          targetY = homeY;
        }
      }

      // Smooth lerp
      const speed = isDocked ? 0.08 : 0.04;
      pos.x += (targetX - pos.x) * speed;
      pos.y += (targetY - pos.y) * speed;

      // Apply position, scale, and opacity
      el.style.transform = `translate(${pos.x - 20}px, ${pos.y - 20}px) scale(${scale})`;
      // Also apply opacity scaled so the About Me node completely disappears into the black hole!
      el.style.opacity = scale;

      // Toggle docked visual state
      el.classList.toggle('node-docked', isDocked);

      // Add a CSS class for non-active nodes when in sections area
      el.classList.toggle('node-dimmed', !isDocked && inSections);

      // Update orbiting ring
      const ring = el.querySelector('.node-ring');
      if (ring) {
        const orbitRadius = isDocked ? 18 : 32;
        const orbitSpeed = isDocked ? 3 : 2;
        const orbitT = (time * orbitSpeed + i * 1.3) % (Math.PI * 2);
        ring.style.transform = `translate(-50%, -50%) translate(${Math.cos(orbitT) * orbitRadius}px, ${Math.sin(orbitT) * orbitRadius}px)`;
      }
    });
  }

  // ═══════════════════════════════════════════════════
  // DRAW TETHERS — Center galaxy connections
  // ═══════════════════════════════════════════════════
  drawNodeTethers(scrollP) {
    if (scrollP > 0.9) return; // Completely invisible in deep sections

    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 1 - scrollP; // Fade out as we scroll down

    const rawScrollY = window.scrollY || 0;
    const aboutScale = Math.min(1, Math.max(0, rawScrollY / (window.innerHeight * 0.2)));

    sections.forEach(sec => {
      // If this is the About node, scale its tether's opacity the same way we scale its size
      // so it doesn't draw a disconnected stray line on the start screen.
      if (sec.id === 'about' && aboutScale < 0.05) return;

      const pos = this.nodePositions.get(sec.id);
      if (!pos) return;

      ctx.beginPath();

      const sx = this.cx, sy = this.cy;
      const ex = pos.x, ey = pos.y;

      // Arc logic
      const dx = ex - sx, dy = ey - sy;
      const cpX = sx + dx * 0.3 + dy * 0.2;
      const cpY = sy + dy * 0.3 - dx * 0.15;

      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(cpX, cpY, ex, ey);

      // Colored tether
      const grad = ctx.createLinearGradient(sx, sy, ex, ey);
      grad.addColorStop(0, 'rgba(255,255,255,0.0)');

      // Apply the aboutScale opacity to the glowing ends of the tether so it cleanly fades in
      let baseAlpha2 = 0.2;
      let baseAlpha4 = 0.4;
      if (sec.id === 'about') {
        baseAlpha2 *= aboutScale;
        baseAlpha4 *= aboutScale;
      }

      grad.addColorStop(0.3, sec.node.glowColor.replace('0.6', baseAlpha2.toString()));
      grad.addColorStop(1, sec.node.glowColor.replace('0.6', baseAlpha4.toString()));

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 8]);
      ctx.lineDashOffset = -this.time * 20;
      ctx.stroke();
    });

    ctx.restore();
  }

  // ═══════════════════════════════════════════════════
  // MAIN DRAW — Galaxy rendering (preserved from v4)
  // ═══════════════════════════════════════════════════
  draw(time) {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    const sc = this.scale, rot = this.rotation;

    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    const px = this.mouseX * 15, py = this.mouseY * 15;

    ctx.clearRect(0, 0, w, h);

    for (const s of this.bgStars) {
      const p = (s.layer + 1) * 0.2;
      ctx.beginPath(); ctx.arc(s.x + px * p, s.y + py * p, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,210,255,${s.opacity + Math.sin(time + s.x) * 0.1})`;
      ctx.fill();
    }

    this.drawMeteors(time);

    if (!this.isGalaxy) return;

    ctx.save();
    ctx.translate(this.cx, this.cy);
    ctx.rotate(rot);
    ctx.scale(sc, sc);

    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(this.glowCanvas, -800, -800);

    this.drawFluidAccretion(time, false);

    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2);
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, 22);
    gr.addColorStop(0, '#000'); gr.addColorStop(0.7, '#000'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gr; ctx.fill();

    ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,200,180,${0.6 + Math.sin(time * 2) * 0.2})`;
    ctx.lineWidth = 1.5; ctx.stroke();

    ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(200,150,255,${0.3 + Math.sin(time * 3) * 0.1})`;
    ctx.lineWidth = 0.5; ctx.stroke();

    // Compute scrollP for tether logic
    const scrollY = window.scrollY || 0;
    const scrollP = Math.min(1, Math.max(0, scrollY / window.innerHeight));

    ctx.globalCompositeOperation = 'screen';
    this.drawFluidAccretion(time, true);

    ctx.globalCompositeOperation = 'source-over';
    for (const hs of this.heroStars) {
      const pulse = 0.4 + Math.pow(Math.sin(time * hs.speed + hs.phase) * 0.5 + 0.5, 2);
      ctx.beginPath(); ctx.arc(hs.x, hs.y, hs.size * pulse, 0, Math.PI * 2);
      ctx.fillStyle = hs.color; ctx.fill();
      if (hs.flare && pulse > 0.7) {
        const fl = hs.size * 5 * pulse;
        ctx.save();
        ctx.translate(hs.x, hs.y);
        ctx.rotate(-rot);
        ctx.beginPath();
        ctx.moveTo(-fl, 0); ctx.lineTo(fl, 0);
        ctx.moveTo(0, -fl); ctx.lineTo(0, fl);
        ctx.strokeStyle = `rgba(255,255,255,${(pulse - 0.7) * 2})`;
        ctx.lineWidth = 0.3;
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();

    // Draw tether from galaxy center to the active docked node
    this.drawNodeTethers(scrollP);
  }

  drawFluidAccretion(time, drawFront) {
    const ctx = this.ctx;
    for (const t of this.accretionTrails) {
      const currAngle = t.angle + time * t.speed;
      const y = t.rY * Math.sin(currAngle);
      if (drawFront ? y < 0 : y >= 0) continue;
      ctx.beginPath();
      for (let a = 0; a <= t.length; a += 0.05) {
        const ang = currAngle - (t.speed > 0 ? a : -a);
        const px = t.rX * Math.cos(ang);
        const py = t.rY * Math.sin(ang);
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = t.color;
      ctx.lineWidth = t.width;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }

  drawMeteors(time) {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    if (time - this.lastShoot > 4.5) {
      const ang = Math.PI / 4 + (Math.random() - 0.5) * 0.7;
      this.shootingStars.push({ x: Math.random() * w * 0.5 + w * 0.1, y: Math.random() * h * 0.25, vx: Math.cos(ang) * 9, vy: Math.sin(ang) * 9, life: 1, decay: 0.012, len: 40 + Math.random() * 60, delay: 0 });
      this.lastShoot = time;
    }
    if (time - this.lastShower > 12) {
      const ox = Math.random() * w * 0.5 + w * 0.15, oy = Math.random() * h * 0.25;
      const baseAng = Math.PI / 4 + (Math.random() - 0.5) * 0.35;
      const cnt = 6 + Math.floor(Math.random() * 8);
      for (let i = 0; i < cnt; i++) {
        const ang = baseAng + (Math.random() - 0.5) * 0.35, spd = 6 + Math.random() * 7;
        this.shootingStars.push({ x: ox + (Math.random() - 0.5) * 45, y: oy + (Math.random() - 0.5) * 30, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, life: 1, decay: 0.008 + Math.random() * 0.01, len: 40 + Math.random() * 70, delay: i * 0.08 });
      }
      this.lastShower = time;
    }
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];
      if (ss.delay > 0) { ss.delay -= 0.016; continue; }
      ss.x += ss.vx; ss.y += ss.vy; ss.life -= ss.decay;
      if (ss.life <= 0) { this.shootingStars.splice(i, 1); continue; }
      const tx = ss.x - ss.vx * ss.len * 0.12, ty = ss.y - ss.vy * ss.len * 0.12;
      const g = ctx.createLinearGradient(tx, ty, ss.x, ss.y);
      g.addColorStop(0, 'transparent'); g.addColorStop(1, `rgba(255,200,220,${ss.life * 0.8})`);
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ss.x, ss.y); ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${ss.life})`; ctx.fill();
    }
  }

  // ═══════════════════════════════════════════════════
  // IDENTITY & EVENTS
  // ═══════════════════════════════════════════════════
  buildIdentityCard() {
    document.getElementById('identity-name').textContent = profile.name;
    document.getElementById('identity-title').textContent = profile.title;
    document.getElementById('identity-tagline').textContent = profile.tagline;
    const el = document.querySelector('.social-links');
    if (el) {
      el.innerHTML = '';
      Object.entries(profile.links).forEach(([k, url]) => {
        const a = document.createElement('a');
        a.href = url; a.target = k !== 'email' ? '_blank' : '_self';
        a.rel = 'noopener noreferrer'; a.innerHTML = SVG[k] || '';
        a.setAttribute('aria-label', k); el.appendChild(a);
      });
    }
    const footer = document.getElementById('site-footer');
    if (footer) footer.querySelector('span').innerHTML = `&copy; ${new Date().getFullYear()} ${profile.name}`;
  }

  attachEvents() {
    // Click node to scroll to its section
    this.nodeEls.forEach((el, id) => {
      el.addEventListener('click', () => {
        const section = this.sectionEls.get(id);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    // Make the Black Hole clickable to serve as the About Me node trigger on the main screen!
    window.addEventListener('click', (e) => {
      const rawScrollY = window.scrollY || 0;
      // Only active when we haven't scrolled away from the galaxy
      if (rawScrollY < window.innerHeight * 0.2) {
        // Calculate distance from center (the black hole)
        const dist = Math.hypot(e.clientX - this.cx, e.clientY - this.cy);
        if (dist < 100) { // Large forgiving click radius for the black hole
          const aboutSection = this.sectionEls.get('about');
          if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  // ═══════════════════════════════════════════════════
  // ANIMATION LOOP
  // ═══════════════════════════════════════════════════
  animate(ts) {
    const t = ts / 1000, dt = this._lastT === 0 ? 0.016 : Math.min(t - this._lastT, 0.1);
    this._lastT = t;

    if (!this._hidden) {
      this.time = t;
      this.rotation += dt * 0.03;
      this.draw(t);
      this.updateNodesFlight(t);
    }
    requestAnimationFrame(ts2 => this.animate(ts2));
  }
}

new GalaxyPortfolio();
