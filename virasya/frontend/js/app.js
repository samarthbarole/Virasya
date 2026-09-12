// ============================================
// VIRASYA - Frontend Controller
// ============================================

// 1. Intro Video Handling (Plays only once per browser session)
const intro = document.getElementById("intro");
const video = document.getElementById("introVideo");
const skipBtn = document.getElementById("skipBtn");

function finishIntro() {
  if (!intro) return;
  sessionStorage.setItem("virasya_intro_seen", "true");
  intro.classList.add("hide");
  setTimeout(() => {
    intro.style.display = "none";
  }, 900);
}

if (sessionStorage.getItem("virasya_intro_seen")) {
  if (intro) {
    intro.style.display = "none";
  }
  if (video) {
    try {
      video.pause();
    } catch (e) {}
  }
} else {
  if (video) {
    video.addEventListener("ended", finishIntro);
  }

  if (skipBtn) {
    skipBtn.addEventListener("click", finishIntro);
  }
}

// 2. Client-side Local State DB (Instant responsive fallback)
const localStateDetails = {
  "Maharashtra": {
    name: "Maharashtra",
    image: "https://images.unsplash.com/photo-1600100397608-f010b8e3d4e4?auto=format&fit=crop&w=800&q=80",
    description: "The land of Shivaji Maharaj, vibrant culture, dramatic Western Ghats, and UNESCO heritage ancient rock-cut caves of Ajanta and Ellora.",
    heritage: "Ajanta & Ellora Caves, Gateway of India, Raigad Fort",
    art: "Warli Painting, Paithani Silk Weaving",
    festivals: "Ganesh Chaturthi, Gudi Padwa",
    targetSection: "#heritage"
  },
  "Rajasthan": {
    name: "Rajasthan",
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80",
    description: "The Land of Kings, legendary palaces, golden desert dunes, vibrant folk dances, and grand fortified citadels echoing royal history.",
    heritage: "Amer Fort, Hawa Mahal, Mehrangarh Fort",
    art: "Jaipur Blue Pottery, Bandhani Textiles, Miniature Painting",
    festivals: "Pushkar Camel Fair, Teej, Desert Festival",
    targetSection: "#crafts"
  },
  "Punjab": {
    name: "Punjab",
    image: "https://images.unsplash.com/photo-1561350112-7b1f5f7d7d2a?auto=format&fit=crop&w=800&q=80",
    description: "The Land of Five Rivers, known for its warm hospitality, golden wheat fields, divine Golden Temple, and high-energy Bhangra beats.",
    heritage: "Golden Temple (Sri Harmandir Sahib), Jallianwala Bagh",
    art: "Phulkari Embroidery, Punjabi Jutti Crafts",
    festivals: "Baisakhi, Lohri, Gurpurab",
    targetSection: "#festivals"
  },
  "Uttarakhand": {
    name: "Uttarakhand",
    image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80",
    description: "The Devbhumi (Land of the Gods), nestled in the serene Himalayas with sacred rivers, sacred pilgrimage routes, and pristine valleys.",
    heritage: "Badrinath & Kedarnath Temples, Valley of Flowers",
    art: "Aipan Art, Ringal Bamboo Craft",
    festivals: "Kumbh Mela, Ganga Dussehra, Phool Dei",
    targetSection: "#culture",
    pageUrl: "uttarakhand.html"
  },
  "Jharkhand": {
    name: "Jharkhand",
    image: "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=800&q=80",
    description: "The Land of Forests, blessed with cascading waterfalls, rich tribal traditions, sacred hills, and ancient indigenous folklore.",
    heritage: "Baidyanath Dham, Parasnath Hills, Hundru Falls",
    art: "Sohrai & Khovar Murals, Dokra Metal Casting",
    festivals: "Sarhul, Karam Festival, Tusu Parab",
    targetSection: "#culture"
  }
};

let currentModalTarget = "#map";
let currentModalPageUrl = null;

// 3. State Spotlight Modal & Navigator
async function go(state, directRedirect = false) {
  // If user clicked direct navigation to state page
  if (state.toLowerCase() === "uttarakhand" && directRedirect) {
    window.location.href = "uttarakhand.html";
    return;
  }

  let data = localStateDetails[state];

  // Attempt to fetch from backend API if available
  if (typeof VirasyaAPI !== 'undefined') {
    const apiData = await VirasyaAPI.getStateById(state);
    if (apiData) data = apiData;
  }

  const modal = document.getElementById("stateModal");

  if (data && modal) {
    document.getElementById("modalStateName").innerText = data.name;
    document.getElementById("modalStateImg").src = data.image;
    document.getElementById("modalStateDesc").innerText = data.description;
    document.getElementById("modalStateHeritage").innerText = data.heritage;
    document.getElementById("modalStateArt").innerText = data.art;
    document.getElementById("modalStateFestivals").innerText = data.festivals;
    currentModalTarget = data.targetSection || "#map";
    currentModalPageUrl = data.pageUrl || null;

    const actionBtn = document.querySelector(".modal-action-btn");
    if (actionBtn) {
      if (data.pageUrl) {
        actionBtn.innerHTML = `Explore ${data.name} Page <i class="fa-solid fa-arrow-right"></i>`;
      } else {
        actionBtn.innerHTML = `Explore Section <i class="fa-solid fa-arrow-right"></i>`;
      }
    }

    modal.classList.add("active");
  } else {
    if (data && data.pageUrl) {
      window.location.href = data.pageUrl;
      return;
    }
    const fallbackTarget = data ? data.targetSection : "#map";
    const element = document.querySelector(fallbackTarget);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
}

function closeStateModal() {
  const modal = document.getElementById("stateModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

function exploreSectionFromModal() {
  if (currentModalPageUrl) {
    window.location.href = currentModalPageUrl;
    return;
  }

  closeStateModal();
  setTimeout(() => {
    const elem = document.querySelector(currentModalTarget);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  }, 200);
}

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  const modal = document.getElementById("stateModal");
  if (e.target === modal) {
    closeStateModal();
  }
});

// Close modal on Escape
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeStateModal();
  }
});

// 4. Culture Category Filter
function filterCulture(category, event) {
  const tabs = document.querySelectorAll(".culture-tab");
  const cards = document.querySelectorAll(".culture-card");

  tabs.forEach((tab) => tab.classList.remove("active"));
  
  if (event && event.currentTarget) {
    event.currentTarget.classList.add("active");
  }

  cards.forEach((card) => {
    if (category === "all") {
      card.classList.remove("culture-hidden");
    } else {
      const cardCategory = card.getAttribute("data-category");
      if (cardCategory === category) {
        card.classList.remove("culture-hidden");
      } else {
        card.classList.add("culture-hidden");
      }
    }
  });
}

// 5. Search Bar and Select Dropdown Functionality
document.addEventListener("DOMContentLoaded", () => {
  const stateSelect = document.getElementById("stateSelect");
  const stateSearch = document.getElementById("stateSearch");
  const searchBtn = document.getElementById("searchBtn");

  function scrollToState(stateName) {
    if (!stateName || stateName === "All") return;
    const clean = stateName.trim().toLowerCase();

    // If Uttarakhand, direct redirect to uttarakhand.html
    if (clean === "uttarakhand") {
      window.location.href = "uttarakhand.html";
      return;
    }

    // Check if matched state in db
    for (const key in localStateDetails) {
      if (key.toLowerCase() === clean) {
        go(key);
        return;
      }
    }

    // Try finding direct hotspot pin on map
    const hotspot = document.querySelector(`.map-hotspot.${clean}-spot`);
    if (hotspot) {
      const mapCard = document.querySelector(".map-card");
      if (mapCard) {
        mapCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      hotspot.style.transform = "translate(-50%, -50%) scale(2.2)";
      hotspot.style.boxShadow = "0 0 30px #f28c16, 0 0 0 4px #ffffff";
      setTimeout(() => {
        hotspot.style.transform = "";
        hotspot.style.boxShadow = "";
      }, 2500);
      return;
    }

    // Scroll to map section as fallback
    const mapSection = document.getElementById("map");
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  if (stateSelect) {
    stateSelect.addEventListener("change", (e) => {
      scrollToState(e.target.value);
    });
  }

  if (searchBtn && stateSearch) {
    searchBtn.addEventListener("click", () => {
      scrollToState(stateSearch.value);
    });

    stateSearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        scrollToState(stateSearch.value);
      }
    });
  }
});

// 6. Simulator Modal Controller
function openSimulatorModal(e) {
  if (e) e.preventDefault();
  const simModal = document.getElementById("simulatorModal");
  if (simModal) {
    simModal.classList.add("active");
  }
}

function closeSimulatorModal() {
  const simModal = document.getElementById("simulatorModal");
  if (simModal) {
    simModal.classList.remove("active");
  }
}

function launchSimulation(type) {
  closeSimulatorModal();
  if (type === 'devbhoomi') {
    window.location.href = 'simulator.html?tab=devbhoomi';
    return;
  }
  if (type === 'canvas') {
    window.location.href = 'simulator.html?tab=artStudio';
    return;
  }
  if (type === 'rhythms') {
    window.location.href = 'simulator.html?tab=rhythms';
    return;
  }
  if (type === 'monuments') {
    window.location.href = 'simulator.html?tab=monuments';
    return;
  }
  window.location.href = 'simulator.html';
}

// Close simulator modal on outside click
window.addEventListener("click", (e) => {
  const simModal = document.getElementById("simulatorModal");
  if (e.target === simModal) {
    closeSimulatorModal();
  }
});

// =========================================================
// 7. INDEX PAGE ANIMATIONS & INTERACTIVE MOTION SUITE
// =========================================================

// --- A. Scroll Reveal Observer ---
function initScrollReveals() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (!revealElements.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("revealed"));
  }
}

// --- B. Ambient Golden Sparks / Fireflies Particle Canvas ---
function initHeroSparks() {
  const canvas = document.getElementById("heroSparksCanvas");
  if (!canvas || !canvas.parentElement) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  let mouse = { x: width / 2, y: height / 2, active: false };

  window.addEventListener("resize", () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  const heroBanner = document.getElementById("home");
  if (heroBanner) {
    heroBanner.addEventListener("mousemove", (e) => {
      const rect = heroBanner.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    heroBanner.addEventListener("mouseleave", () => {
      mouse.active = false;
    });
  }

  const particleCount = window.innerWidth < 768 ? 25 : 50;
  const particles = [];

  class Spark {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.radius = Math.random() * 2.2 + 1;
      this.baseAlpha = Math.random() * 0.55 + 0.2;
      this.alpha = this.baseAlpha;
      this.vy = -(Math.random() * 0.6 + 0.3);
      this.vx = (Math.random() - 0.5) * 0.35;
      this.sinFreq = Math.random() * 0.02 + 0.01;
      this.sinAmp = Math.random() * 0.8 + 0.2;
      this.time = Math.random() * 100;
      this.hue = Math.random() > 0.35 ? 42 : 36;
    }

    update() {
      this.time++;
      this.y += this.vy;
      this.x += this.vx + Math.sin(this.time * this.sinFreq) * this.sinAmp;

      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) {
          const force = (110 - dist) / 110;
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
        }
      }

      this.alpha = this.baseAlpha * (0.6 + 0.4 * Math.sin(this.time * 0.05));

      if (this.y < -10 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 95%, 65%, ${this.alpha})`;
      ctx.shadowBlur = this.radius * 4;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, 0.75)`;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Spark());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

// --- C. Navbar Scroll Glassmorphism & Back-to-Top Button ---
function initScrollInteractions() {
  const navbar = document.querySelector(".navbar");
  const backToTopBtn = document.getElementById("backToTopBtn");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  }, { passive: true });
}

// --- D. 3D Magnetic Card Tilt Interaction ---
function init3DCardTilt() {
  if (window.matchMedia("(hover: none)").matches) return;

  const tiltCards = document.querySelectorAll(".culture-card, .card, .sim-card");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// Auto-run animations on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initScrollReveals();
  initHeroSparks();
  initScrollInteractions();
  init3DCardTilt();
});
