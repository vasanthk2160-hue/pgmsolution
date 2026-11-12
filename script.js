const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");
const countNumbers = document.querySelectorAll(".count-number");
const typingSection = document.querySelector(".typing-section");
const typingTexts = document.querySelectorAll(".typing-text");
const serviceGrid = document.querySelector(".service-grid");
const serviceLinks = document.querySelectorAll(".service-card[href]");
const industriesSection = document.querySelector(".industries");
const processSection = document.querySelector(".process");
const techSection = document.querySelector(".tech");
const allowsMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isWebsitesPage = document.body.classList.contains("websites-page");
const isServiceDetailPage = document.body.classList.contains("service-page") || Boolean(document.querySelector(".service-detail-hero"));

if (window.lucide) {
  window.lucide.createIcons();
}

const pageLoaderKey = "pgmPageLoaderActive";
let pageLoader = null;
let loaderNavigationStarted = false;

const getPageLoader = () => {
  if (pageLoader) {
    return pageLoader;
  }

  pageLoader = document.createElement("div");
  pageLoader.className = "page-loader";
  pageLoader.setAttribute("role", "status");
  pageLoader.setAttribute("aria-live", "polite");
  pageLoader.innerHTML = `
    <div class="page-loader-panel">
      <span class="page-loader-logo" aria-hidden="true">
        <img src="assets/pgm-logo.png" alt="">
      </span>
      <span class="page-loader-dots" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
      <span class="page-loader-text">Loading</span>
    </div>
  `;
  document.body.appendChild(pageLoader);

  return pageLoader;
};

const showPageLoader = () => {
  const loader = getPageLoader();
  loader.classList.remove("is-leaving");
  loader.classList.add("is-active");
  document.body.classList.add("is-page-loading");
};

const hidePageLoader = () => {
  if (!pageLoader) {
    return;
  }

  pageLoader.classList.add("is-leaving");
  pageLoader.classList.remove("is-active");
  document.body.classList.remove("is-page-loading");

  setTimeout(() => {
    pageLoader?.classList.remove("is-leaving");
  }, 220);
};

if (sessionStorage.getItem(pageLoaderKey) === "true") {
  sessionStorage.removeItem(pageLoaderKey);
  showPageLoader();
  window.addEventListener("load", () => {
    setTimeout(hidePageLoader, allowsMotion ? 180 : 60);
  });
}

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    loaderNavigationStarted = false;
    hidePageLoader();
  }
});

serviceLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    const target = link.getAttribute("target");
    const href = link.getAttribute("href");

    if (loaderNavigationStarted || isModifiedClick || target === "_blank" || !href || href.startsWith("#")) {
      return;
    }

    event.preventDefault();
    loaderNavigationStarted = true;
    sessionStorage.setItem(pageLoaderKey, "true");
    showPageLoader();

    setTimeout(() => {
      window.location.href = link.href;
    }, allowsMotion ? 260 : 60);
  });
});

if (allowsMotion && !isWebsitesPage && !isServiceDetailPage) {
  const particleCanvas = document.createElement("canvas");
  const particleContext = particleCanvas.getContext("2d");
  const particles = [];
  let particleFrame = null;
  let lastParticleTime = 0;

  particleCanvas.className = "cursor-particle-canvas";
  particleCanvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(particleCanvas);

  const resizeParticleCanvas = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    particleCanvas.width = Math.floor(window.innerWidth * pixelRatio);
    particleCanvas.height = Math.floor(window.innerHeight * pixelRatio);
    particleCanvas.style.width = `${window.innerWidth}px`;
    particleCanvas.style.height = `${window.innerHeight}px`;
    particleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const addCursorParticles = (x, y) => {
    for (let index = 0; index < 7; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.55 + Math.random() * 1.8;
      const size = 2 + Math.random() * 4.5;

      particles.push({
        x: x + (Math.random() - 0.5) * 18,
        y: y + (Math.random() - 0.5) * 18,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        life: 1,
        decay: 0.018 + Math.random() * 0.018,
        hue: 200 + Math.random() * 18
      });
    }

    if (!particleFrame) {
      particleFrame = requestAnimationFrame(drawCursorParticles);
    }
  };

  const drawCursorParticles = () => {
    particleContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.015;
      particle.life -= particle.decay;

      if (particle.life <= 0) {
        particles.splice(index, 1);
        continue;
      }

      particleContext.beginPath();
      particleContext.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
      particleContext.fillStyle = `hsla(${particle.hue}, 86%, 55%, ${particle.life * 0.86})`;
      particleContext.shadowColor = `hsla(${particle.hue}, 90%, 58%, ${particle.life})`;
      particleContext.shadowBlur = 8;
      particleContext.fill();
      particleContext.shadowBlur = 0;
    }

    particleFrame = particles.length ? requestAnimationFrame(drawCursorParticles) : null;
  };

  const handlePointerMove = (event) => {
    const now = performance.now();

    if (now - lastParticleTime < 18) {
      return;
    }

    lastParticleTime = now;
    addCursorParticles(event.clientX, event.clientY);
  };

  resizeParticleCanvas();
  window.addEventListener("resize", resizeParticleCanvas);
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
}

if (allowsMotion && isServiceDetailPage) {
  let webBackgroundFrame = null;

  const updateWebBackground = () => {
    const scroll = window.scrollY;

    webBackgroundFrame = null;
    document.body.style.setProperty("--web-bg-scroll", `${scroll * -0.08}px`);
    document.body.style.setProperty("--web-bg-scroll-soft", `${scroll * 0.056}px`);
    document.body.style.setProperty("--web-bg-scroll-fast", `${scroll * 0.108}px`);
    document.body.style.setProperty("--web-bg-drift", `${scroll * 0.035}px`);
    document.body.style.setProperty("--web-bg-drift-back", `${scroll * -0.035}px`);
    document.body.style.setProperty("--web-bg-drift-wide", `${scroll * 0.07}px`);
    document.body.style.setProperty("--web-bg-drift-wide-back", `${scroll * -0.07}px`);
  };

  const requestWebBackgroundUpdate = () => {
    if (!webBackgroundFrame) {
      webBackgroundFrame = requestAnimationFrame(updateWebBackground);
    }
  };

  updateWebBackground();
  window.addEventListener("scroll", requestWebBackgroundUpdate, { passive: true });
}

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    siteNav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.reset();
  formNote.textContent = "Thank you. Your project request is ready for review.";
});

let statsInView = false;

const animateCount = (element) => {
  const target = Number(element.dataset.target || "0");
  const suffix = element.dataset.suffix || "";
  const duration = 1700;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.max(1, Math.round(target * eased));

    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

const countObserver = new IntersectionObserver(
  (entries) => {
    const isVisible = entries.some((entry) => entry.isIntersecting);

    if (isVisible && !statsInView) {
      statsInView = true;
      countNumbers.forEach(animateCount);
    }

    if (!isVisible) {
      statsInView = false;
      countNumbers.forEach((element) => {
        const suffix = element.dataset.suffix || "";
        element.textContent = `1${suffix}`;
      });
    }
  },
  { threshold: 0.45 }
);

const statsSection = document.querySelector(".hero-stats");

if (statsSection) {
  countObserver.observe(statsSection);
}

const typeText = async (element, text, speed = 4) => {
  element.textContent = "";
  element.classList.add("is-active");

  for (const character of text) {
    element.textContent += character;
    await new Promise((resolve) => setTimeout(resolve, character === " " ? 1 : speed));
  }

  element.classList.remove("is-active");
};

if (typingSection && typingTexts.length) {
  const originalTexts = Array.from(typingTexts, (element) => element.textContent.trim());
  let typingStarted = false;

  typingTexts.forEach((element) => {
    element.style.minHeight = `${element.scrollHeight}px`;
    element.textContent = "";
  });

  const typingObserver = new IntersectionObserver(
    async (entries) => {
      if (typingStarted || !entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      typingStarted = true;
      typingSection.classList.add("is-typing");

      for (const [index, element] of Array.from(typingTexts).entries()) {
        await typeText(element, originalTexts[index], index === 1 ? 3 : 4);
        await new Promise((resolve) => setTimeout(resolve, 24));
      }

      typingSection.classList.remove("is-typing");
      typingObserver.disconnect();
    },
    { threshold: 0.35 }
  );

  typingObserver.observe(typingSection);
}
if (serviceGrid && allowsMotion) {
  serviceGrid.classList.add("is-collapsed");

  const serviceObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      serviceGrid.classList.add("is-spread");
      serviceGrid.classList.remove("is-collapsed");
      serviceObserver.disconnect();
    },
    { threshold: 0.22 }
  );

  serviceObserver.observe(serviceGrid);
}

if (industriesSection && allowsMotion) {
  const industriesObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      industriesSection.classList.add("is-active");
      industriesObserver.disconnect();
    },
    { threshold: 0.25 }
  );

  industriesObserver.observe(industriesSection);
}

if (processSection && allowsMotion) {
  const processObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      processSection.classList.add("is-active");
      processObserver.disconnect();
    },
    { threshold: 0.25 }
  );

  processObserver.observe(processSection);
}

if (techSection && allowsMotion) {
  const techObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      techSection.classList.add("is-active");
      techObserver.disconnect();
    },
    { threshold: 0.25 }
  );

  techObserver.observe(techSection);
}
