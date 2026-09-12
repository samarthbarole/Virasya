/**
 * VIRASYA HERITAGE SIMULATOR & MANDALA ART STUDIO ENGINE
 * Comprehensive Indian Living Traditions Interactive Suite
 * High-DPI Multi-Layer Canvas, Polar Radial Symmetry, Vector Tracing,
 * Sacred Geometric Shapes, Web Audio Synthesizer & Folk Sequencer.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. STATE & CONSTANTS
  // =========================================================================

  const STATE = {
    // Mode: 'freehand' | 'trace' | 'shapes'
    mode: 'freehand',
    folkStyle: 'Mandala', // 'Kolam' | 'Mandala' | 'Rangoli' | 'Warli' | 'Madhubani' | 'Aipan'
    
    // Drawing Tool: 'brush' | 'eraser' | 'stamp'
    tool: 'brush',
    brushStyle: 'round', // 'round' | 'caligraphy' | 'dotted' | 'powder' | 'glow' | 'gold_dust' | 'eraser' | 'stamp'
    
    // Geometry & Symmetry
    sectors: 8,
    mirror: true,
    showGrid: true,
    
    // Stroke Appearance
    color: '#f5a623',
    strokeWidth: 4,
    opacity: 1.0,
    glow: false,
    rainbow: false,
    rainbowHue: 0,
    theme: 'geru',
    canvasBg: '#231109',
    
    // Tracing Layer State
    traceOpacity: 0.38,
    traceVisible: true,
    traceInverted: false,
    activeTemplateId: 'lotus',
    customTraceImg: null,
    
    // Shapes & Stamps State
    activeShapeId: 'lotusPetal',
    shapeScale: 1.0,
    shapeRotation: 0, // degrees
    selectedMotif: 'diya',
    
    // Zoom State
    zoom: 1.0,
    
    // Canvas dimensions
    size: 860,
    dpr: Math.max(window.devicePixelRatio || 1, 2)
  };

  // Curated Color Palettes
  const PALETTES = {
    gold: [
      { name: "Sacred Gold", hex: "#f5a623" },
      { name: "Pure Gold", hex: "#ffd700" },
      { name: "Amber Gold", hex: "#ffb300" },
      { name: "Royal Gold", hex: "#d4af37" },
      { name: "Deep Saffron", hex: "#ff8f00" },
      { name: "Sunray Cream", hex: "#ffe082" }
    ],
    peacock: [
      { name: "Peacock Cyan", hex: "#00d2ff" },
      { name: "Emerald", hex: "#00e676" },
      { name: "Teal Turquoise", hex: "#1de9b6" },
      { name: "Ocean Blue", hex: "#00b0ff" },
      { name: "Krishna Violet", hex: "#7c4dff" },
      { name: "Deep Indigo", hex: "#651fff" }
    ],
    festival: [
      { name: "Sindoor Crimson", hex: "#ff1744" },
      { name: "Gulal Pink", hex: "#f50057" },
      { name: "Lotus Rose", hex: "#ff4081" },
      { name: "Terracotta Saffron", hex: "#ff9100" },
      { name: "Haldi Yellow", hex: "#ffea00" },
      { name: "Parrot Green", hex: "#76ff03" }
    ],
    monochrome: [
      { name: "Rice White", hex: "#ffffff" },
      { name: "Chalk Cream", hex: "#e0e0e0" },
      { name: "Silver Ash", hex: "#9e9e9e" },
      { name: "Slate Grey", hex: "#616161" },
      { name: "Charcoal", hex: "#424242" },
      { name: "Kohl Black", hex: "#212121" }
    ]
  };

  // Canvas Surface Themes
  const THEMES = {
    geru: { name: "Sacred Clay (Geru)", bg: "#231109", guide: "rgba(255, 230, 180, 0.25)", dot: "#FFF5EA" },
    dark: { name: "Dark Studio", bg: "#11131a", guide: "rgba(255, 255, 255, 0.12)", dot: "#FFFFFF" },
    obsidian: { name: "Obsidian Black", bg: "#07080c", guide: "rgba(212, 175, 55, 0.3)", dot: "#FFD700" },
    ivory: { name: "Ivory Paper", bg: "#f7f5ee", guide: "rgba(74, 29, 8, 0.22)", dot: "#4A1D08" },
    midnight: { name: "Midnight Indigo", bg: "#121b28", guide: "rgba(0, 210, 255, 0.25)", dot: "#80D8FF" },
    granite: { name: "Temple Granite", bg: "#161819", guide: "rgba(212, 175, 55, 0.28)", dot: "#E0E0E0" },
    parchment: { name: "Palm Leaf Parchment", bg: "#f3ebd7", guide: "rgba(100, 50, 20, 0.28)", dot: "#5A2D0C" }
  };

  // Predefined High-Precision Vector Mandala Templates for Tracing
  const TEMPLATES = [
    {
      id: 'lotus',
      name: 'Sacred Lotus',
      desc: 'Concentric 12-petal radiating lotus with bindu rings',
      draw: (ctx, cx, cy, R) => {
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.08, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.16, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.32, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.60, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.88, 0, Math.PI * 2);
        ctx.stroke();

        drawRadialPetals(ctx, cx, cy, 8, R * 0.16, R * 0.32, 0.55);
        drawRadialPetals(ctx, cx, cy, 16, R * 0.32, R * 0.60, 0.45);
        drawRadialPetals(ctx, cx, cy, 24, R * 0.60, R * 0.88, 0.4);
      }
    },
    {
      id: 'chakra',
      name: 'Solar Chakra',
      desc: 'Geometric sunburst & radiant solar spires',
      draw: (ctx, cx, cy, R) => {
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.12, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.28, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.48, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.72, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.92, 0, Math.PI * 2);
        ctx.stroke();

        drawStarPolygon(ctx, cx, cy, 12, R * 0.48, R * 0.72);
        drawStarPolygon(ctx, cx, cy, 24, R * 0.72, R * 0.92);
        drawRadialPetals(ctx, cx, cy, 12, R * 0.12, R * 0.28, 0.6);
      }
    },
    {
      id: 'celestial',
      name: 'Celestial Star',
      desc: 'Sacred octagram and cosmic diamond lattices',
      draw: (ctx, cx, cy, R) => {
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.1, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.25, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.52, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.85, 0, Math.PI * 2);
        ctx.stroke();

        drawIntersectingSquares(ctx, cx, cy, R * 0.52);
        drawRadialPetals(ctx, cx, cy, 16, R * 0.52, R * 0.85, 0.48);
        drawStarPolygon(ctx, cx, cy, 16, R * 0.25, R * 0.52);
      }
    },
    {
      id: 'peacock',
      name: 'Peacock Blossom',
      desc: 'Flourishing feathers & ornate teardrops',
      draw: (ctx, cx, cy, R) => {
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.14, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.35, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.65, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.9, 0, Math.PI * 2);
        ctx.stroke();

        drawRadialPetals(ctx, cx, cy, 8, R * 0.14, R * 0.35, 0.7);
        drawRadialPetals(ctx, cx, cy, 16, R * 0.35, R * 0.65, 0.6);
        drawPeacockFeathers(ctx, cx, cy, 16, R * 0.65, R * 0.9);
      }
    },
    {
      id: 'zenyantra',
      name: 'Zen Yantra',
      desc: 'Harmonic interlocking triangles & sacred rings',
      draw: (ctx, cx, cy, R) => {
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.18, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.42, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.68, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.92, 0, Math.PI * 2);
        ctx.stroke();

        drawYantraTriangles(ctx, cx, cy, R * 0.42);
        drawRadialPetals(ctx, cx, cy, 16, R * 0.42, R * 0.68, 0.45);
        drawRadialPetals(ctx, cx, cy, 24, R * 0.68, R * 0.92, 0.35);
      }
    },
    {
      id: 'spiral',
      name: 'Cosmic Vortex',
      desc: 'Whirling spiral arms & Fibonacci curves',
      draw: (ctx, cx, cy, R) => {
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.08, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.9, 0, Math.PI * 2);
        ctx.stroke();

        drawRadialSpirals(ctx, cx, cy, 12, R * 0.9);
        drawRadialPetals(ctx, cx, cy, 12, R * 0.3, R * 0.65, 0.5);
      }
    }
  ];

  // Provided Sacred Mandala Stamp Shapes
  const SHAPES = [
    {
      id: 'lotusPetal',
      name: 'Lotus Petal',
      draw: (ctx, scale) => {
        const s = scale * 0.8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-25 * s, -40 * s, -20 * s, -90 * s, 0, -120 * s);
        ctx.bezierCurveTo(20 * s, -90 * s, 25 * s, -40 * s, 0, 0);
        ctx.stroke();
      }
    },
    {
      id: 'pointedPetal',
      name: 'Pointed Crown',
      draw: (ctx, scale) => {
        const s = scale * 0.8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-30 * s, -60 * s);
        ctx.lineTo(0, -125 * s);
        ctx.lineTo(30 * s, -60 * s);
        ctx.closePath();
        ctx.stroke();
      }
    },
    {
      id: 'teardrop',
      name: 'Sacred Teardrop',
      draw: (ctx, scale) => {
        const s = scale * 0.75;
        ctx.beginPath();
        ctx.arc(0, -50 * s, 30 * s, 0, Math.PI);
        ctx.lineTo(0, -120 * s);
        ctx.closePath();
        ctx.stroke();
      }
    },
    {
      id: 'paisley',
      name: 'Kalka / Paisley',
      draw: (ctx, scale) => {
        const s = scale * 0.75;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-40 * s, -30 * s, -40 * s, -90 * s, 0, -110 * s);
        ctx.bezierCurveTo(30 * s, -125 * s, 45 * s, -80 * s, 25 * s, -60 * s);
        ctx.bezierCurveTo(10 * s, -45 * s, 25 * s, -20 * s, 0, 0);
        ctx.stroke();
      }
    },
    {
      id: 'sacredDiamond',
      name: 'Diamond Lattice',
      draw: (ctx, scale) => {
        const s = scale * 0.75;
        ctx.beginPath();
        ctx.moveTo(0, -10 * s);
        ctx.lineTo(-30 * s, -65 * s);
        ctx.lineTo(0, -120 * s);
        ctx.lineTo(30 * s, -65 * s);
        ctx.closePath();
        ctx.moveTo(0, -30 * s);
        ctx.lineTo(-18 * s, -65 * s);
        ctx.lineTo(0, -100 * s);
        ctx.lineTo(18 * s, -65 * s);
        ctx.closePath();
        ctx.stroke();
      }
    },
    {
      id: 'crescentMoon',
      name: 'Crescent Moon',
      draw: (ctx, scale) => {
        const s = scale * 0.7;
        ctx.beginPath();
        ctx.arc(0, -65 * s, 40 * s, 0.4 * Math.PI, 1.6 * Math.PI, false);
        ctx.arc(15 * s, -65 * s, 32 * s, 1.5 * Math.PI, 0.5 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
      }
    },
    {
      id: 'binduRosette',
      name: 'Concentric Ring',
      draw: (ctx, scale) => {
        const s = scale * 0.65;
        ctx.beginPath();
        ctx.arc(0, -60 * s, 35 * s, 0, Math.PI * 2);
        ctx.arc(0, -60 * s, 20 * s, 0, Math.PI * 2);
        ctx.arc(0, -60 * s, 6 * s, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
    {
      id: 'sunRay',
      name: 'Sun Trident',
      draw: (ctx, scale) => {
        const s = scale * 0.75;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -130 * s);
        ctx.moveTo(0, -70 * s);
        ctx.lineTo(-25 * s, -110 * s);
        ctx.moveTo(0, -70 * s);
        ctx.lineTo(25 * s, -110 * s);
        ctx.stroke();
      }
    },
    {
      id: 'spiralVortex',
      name: 'Aura Spiral',
      draw: (ctx, scale) => {
        const s = scale * 0.75;
        ctx.beginPath();
        let r = 2 * s;
        let a = 0;
        ctx.moveTo(0, -50 * s);
        for (let i = 0; i < 40; i++) {
          a += 0.25;
          r += 1.3 * s;
          const x = Math.cos(a) * r;
          const y = -50 * s + Math.sin(a) * r;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  ];

  // Helper Vector Geometry Functions
  function drawRadialPetals(ctx, cx, cy, count, rInner, rOuter, fullness) {
    const step = (Math.PI * 2) / count;
    const width = (rOuter - rInner) * fullness;
    for (let i = 0; i < count; i++) {
      const angle = i * step;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -rInner);
      ctx.bezierCurveTo(-width, -rInner - (rOuter - rInner) * 0.35, -width, -rOuter + (rOuter - rInner) * 0.15, 0, -rOuter);
      ctx.bezierCurveTo(width, -rOuter + (rOuter - rInner) * 0.15, width, -rInner - (rOuter - rInner) * 0.35, 0, -rInner);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawStarPolygon(ctx, cx, cy, points, rInner, rOuter) {
    const step = Math.PI / points;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = (i % 2 === 0) ? rOuter : rInner;
      const a = i * step - Math.PI / 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  function drawIntersectingSquares(ctx, cx, cy, r) {
    for (let k = 0; k < 2; k++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(k * (Math.PI / 4));
      ctx.strokeRect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4);
      ctx.restore();
    }
  }

  function drawPeacockFeathers(ctx, cx, cy, count, rInner, rOuter) {
    const step = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      const angle = i * step;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -rInner);
      ctx.lineTo(0, -rOuter);
      ctx.arc(0, -rOuter + 22, 14, 0, Math.PI * 2);
      ctx.arc(0, -rOuter + 22, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawYantraTriangles(ctx, cx, cy, r) {
    const angles = [0, Math.PI, 0, Math.PI];
    const rads = [r, r * 0.88, r * 0.76, r * 0.64];
    for (let i = 0; i < 4; i++) {
      drawEquilateralTriangle(ctx, cx, cy, rads[i], angles[i]);
    }
  }

  function drawEquilateralTriangle(ctx, cx, cy, r, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = (i * 2 * Math.PI) / 3 - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  function drawRadialSpirals(ctx, cx, cy, count, maxR) {
    const step = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(i * step);
      ctx.beginPath();
      for (let t = 0; t <= 1; t += 0.05) {
        const r = t * maxR;
        const a = t * 1.5;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  // Sacred Folk Motif Stencils
  function drawMotifStamp(ctx, x, y, size, color, motifType) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const s = size * 3.5;

    if (motifType === "diya") {
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.5, 0.1 * Math.PI, 0.9 * Math.PI, false);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.1);
      ctx.quadraticCurveTo(s * 0.25, -s * 0.45, 0, -s * 0.7);
      ctx.quadraticCurveTo(-s * 0.25, -s * 0.45, 0, -s * 0.1);
      ctx.fillStyle = "#FF9F1C";
      ctx.fill();
      ctx.stroke();
    } else if (motifType === "lotus") {
      for (let i = -2; i <= 2; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 8);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(s * 0.2, -s * 0.5, 0, -s * 0.75);
        ctx.quadraticCurveTo(-s * 0.2, -s * 0.5, 0, 0);
        ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.2, 0, Math.PI);
      ctx.stroke();
    } else if (motifType === "peacock") {
      ctx.beginPath();
      ctx.arc(0, -s * 0.3, s * 0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.1);
      ctx.quadraticCurveTo(s * 0.4, s * 0.2, 0, s * 0.6);
      ctx.quadraticCurveTo(-s * 0.4, s * 0.2, 0, -s * 0.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.15, -s * 0.3);
      ctx.lineTo(s * 0.35, -s * 0.35);
      ctx.stroke();
    } else if (motifType === "om") {
      ctx.font = `bold ${s * 1.1}px 'Cinzel', serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ॐ", 0, 0);
    } else if (motifType === "trishul") {
      ctx.beginPath();
      ctx.moveTo(0, s * 0.7);
      ctx.lineTo(0, -s * 0.7);
      ctx.moveTo(-s * 0.4, -s * 0.4);
      ctx.quadraticCurveTo(0, -s * 0.2, s * 0.4, -s * 0.4);
      ctx.moveTo(-s * 0.4, -s * 0.4);
      ctx.lineTo(-s * 0.4, -s * 0.65);
      ctx.moveTo(s * 0.4, -s * 0.4);
      ctx.lineTo(s * 0.4, -s * 0.65);
      ctx.stroke();
    } else if (motifType === "gaja") {
      ctx.beginPath();
      ctx.arc(0, -s * 0.2, s * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, -s * 0.2);
      ctx.quadraticCurveTo(-s * 0.6, 0, -s * 0.4, s * 0.4);
      ctx.stroke();
    } else if (motifType === "surya") {
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 4);
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.35);
        ctx.lineTo(0, -s * 0.65);
        ctx.stroke();
        ctx.restore();
      }
    } else if (motifType === "warli_dancer") {
      ctx.beginPath();
      ctx.arc(0, -s * 0.45, s * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, -s * 0.3);
      ctx.lineTo(s * 0.3, -s * 0.3);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, s * 0.3);
      ctx.lineTo(s * 0.3, s * 0.3);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-s * 0.35, s * 0.55);
      ctx.moveTo(0, 0);
      ctx.lineTo(s * 0.35, s * 0.55);
      ctx.moveTo(0, -s * 0.25);
      ctx.lineTo(-s * 0.45, -s * 0.1);
      ctx.moveTo(0, -s * 0.25);
      ctx.lineTo(s * 0.45, -s * 0.1);
      ctx.stroke();
    }

    ctx.restore();
  }

  // =========================================================================
  // 2. WEB AUDIO SYNTHESIS ENGINE
  // =========================================================================

  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function synthPercussion(type) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === "dha") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);
      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(380, now);
      osc2.frequency.exponentialRampToValueAtTime(260, now + 0.12);
      gain2.gain.setValueAtTime(0.6, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.15);
    } else if (type === "ge") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
      gain.gain.setValueAtTime(1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === "na" || type === "ta") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.2);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "tin") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(290, now + 0.3);
      gain.gain.setValueAtTime(0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "dholak") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.28);
      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } else if (type === "damru") {
      for (let i = 0; i < 2; i++) {
        const offset = i * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now + offset);
        osc.frequency.exponentialRampToValueAtTime(110, now + offset + 0.06);
        gain.gain.setValueAtTime(0.5, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.08);
      }
    } else if (type === "ghungroo") {
      const freqs = [1800, 2200, 2800, 3400];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f + Math.random() * 80, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + idx * 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35 + idx * 0.05);
      });
    } else if (type === "khartal") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === "bell") {
      const partials = [432, 864, 1296, 1728, 2160];
      partials.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now);
        const volume = 0.35 / (idx + 1);
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5 - idx * 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.6);
      });
    }
  }

  // Ambient Raag Yaman Drone Synth (Tanpura + Sitar Plucks)
  class AmbientRaagSynth {
    constructor() {
      this.isPlaying = false;
      this.nodes = [];
      this.interval = null;
    }

    toggle() {
      if (this.isPlaying) this.stop();
      else this.start();
      return this.isPlaying;
    }

    start() {
      const ctx = getAudioContext();
      if (!ctx) return;
      this.stop();

      const rootFreq = 136.1; // Sacred OM / C#
      const freqs = [rootFreq * 0.5, rootFreq, rootFreq * 1.5, rootFreq * 2];

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f + (idx % 2 === 0 ? 0.3 : -0.3), ctx.currentTime);
        gain.gain.setValueAtTime(0.06 / (idx + 1), ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        this.nodes.push(osc, gain);
      });

      this.interval = setInterval(() => {
        if (!this.isPlaying) return;
        const now = ctx.currentTime;
        const scale = [rootFreq * 1.5, rootFreq * 1.8, rootFreq * 2, rootFreq * 2.25, rootFreq * 2.67];
        const randomNote = scale[Math.floor(Math.random() * scale.length)];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(randomNote, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.3);
      }, 1600);

      this.isPlaying = true;
    }

    stop() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      this.nodes.forEach((n) => {
        try {
          if (n.stop) n.stop();
          if (n.disconnect) n.disconnect();
        } catch (e) {}
      });
      this.nodes = [];
      this.isPlaying = false;
    }
  }

  const raagSynth = new AmbientRaagSynth();

  // =========================================================================
  // 3. UNIFIED MANDALA ART STUDIO ENGINE
  // =========================================================================

  class VirasyaMandalaStudio {
    constructor() {
      // DOM Elements
      this.artCanvas = null;
      this.traceCanvas = null;
      this.gridCanvas = null;
      this.previewCanvas = null;
      this.canvasContainer = null;

      // 2D Contexts
      this.artCtx = null;
      this.traceCtx = null;
      this.gridCtx = null;
      this.previewCtx = null;

      // Drawing state
      this.isDrawing = false;
      this.lastPos = { x: 0, y: 0 };

      // History
      this.undoStack = [];
      this.redoStack = [];
      this.maxStates = 30;

      // Generative flow
      this.isAutoFlowing = false;
      this.autoFlowInterval = null;

      this.initialized = false;
    }

    init() {
      this.artCanvas = document.getElementById('artCanvas');
      this.traceCanvas = document.getElementById('traceCanvas');
      this.gridCanvas = document.getElementById('gridCanvas');
      this.previewCanvas = document.getElementById('previewCanvas');
      this.canvasContainer = document.getElementById('canvasContainer');

      if (!this.artCanvas || !this.traceCanvas || !this.gridCanvas || !this.previewCanvas) return;

      this.artCtx = this.artCanvas.getContext('2d');
      this.traceCtx = this.traceCanvas.getContext('2d');
      this.gridCtx = this.gridCanvas.getContext('2d');
      this.previewCtx = this.previewCanvas.getContext('2d');

      const { size, dpr } = STATE;
      [this.artCanvas, this.traceCanvas, this.gridCanvas, this.previewCanvas].forEach(c => {
        c.width = size * dpr;
        c.height = size * dpr;
      });

      [this.artCtx, this.traceCtx, this.gridCtx, this.previewCtx].forEach(ctx => {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      });

      this.renderTemplateList();
      this.renderShapesGrid();
      this.renderColorPalettes();
      this.bindEvents();
      this.setCanvasBackground(STATE.canvasBg);
      this.renderGrid();
      this.renderTraceGuide();
      this.saveHistoryState();
      this.initialized = true;
    }

    bindEvents() {
      const art = this.artCanvas;
      
      art.addEventListener('pointerdown', (e) => this.onPointerDown(e));
      window.addEventListener('pointermove', (e) => this.onPointerMove(e));
      window.addEventListener('pointerup', () => this.onPointerUp());
      window.addEventListener('pointercancel', () => this.onPointerUp());

      // Keyboard Shortcuts
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) this.redo();
          else this.undo();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
          e.preventDefault();
          this.redo();
        } else if (e.key.toLowerCase() === 'b') {
          this.selectTool('brush');
        } else if (e.key.toLowerCase() === 'e') {
          this.selectTool('eraser');
        } else if (e.key.toLowerCase() === 's') {
          this.selectTool('stamp');
        }
      });
    }

    getCanvasPoint(e) {
      const rect = this.artCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const scale = STATE.size / rect.width;
      return {
        x: (clientX - rect.left) * scale,
        y: (clientY - rect.top) * scale
      };
    }

    onPointerDown(e) {
      const pt = this.getCanvasPoint(e);
      this.lastPos = pt;

      if (STATE.tool === 'stamp') {
        this.saveHistoryState();
        if (STATE.mode === 'shapes') {
          this.stampRadialGeometricShape(pt.x, pt.y);
        } else {
          this.stampRadialMotif(pt.x, pt.y);
        }
        return;
      }

      this.isDrawing = true;
      this.saveHistoryState();
      this.drawSymmetricStroke(pt.x, pt.y, pt.x, pt.y);
    }

    onPointerMove(e) {
      const pt = this.getCanvasPoint(e);

      if (STATE.tool === 'stamp') {
        this.renderStampPreview(pt.x, pt.y);
        return;
      }

      if (!this.isDrawing) {
        this.renderBrushCursor(pt.x, pt.y);
        return;
      }

      this.drawSymmetricStroke(this.lastPos.x, this.lastPos.y, pt.x, pt.y);
      this.lastPos = pt;
    }

    onPointerUp() {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.previewCtx.clearRect(0, 0, STATE.size, STATE.size);
      }
    }

    // --- Symmetry Drawing Engine ---
    drawSymmetricStroke(x1, y1, x2, y2) {
      const ctx = this.artCtx;
      const cx = STATE.size / 2;
      const cy = STATE.size / 2;
      const sectors = STATE.sectors;
      const step = (Math.PI * 2) / sectors;

      ctx.save();

      if (STATE.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = STATE.opacity;

        if (STATE.rainbow) {
          STATE.rainbowHue = (STATE.rainbowHue + 2) % 360;
          ctx.strokeStyle = `hsl(${STATE.rainbowHue}, 100%, 60%)`;
        } else {
          ctx.strokeStyle = STATE.color;
        }

        if (STATE.glow || STATE.brushStyle === 'glow') {
          ctx.shadowBlur = STATE.strokeWidth * 3.5;
          ctx.shadowColor = ctx.strokeStyle;
        } else {
          ctx.shadowBlur = 0;
        }
      }

      ctx.lineWidth = STATE.strokeWidth;
      const isCaligraphy = STATE.brushStyle === 'caligraphy';

      const dx1 = x1 - cx;
      const dy1 = y1 - cy;
      const dx2 = x2 - cx;
      const dy2 = y2 - cy;

      const r1 = Math.hypot(dx1, dy1);
      const theta1 = Math.atan2(dy1, dx1);
      const r2 = Math.hypot(dx2, dy2);
      const theta2 = Math.atan2(dy2, dx2);

      for (let i = 0; i < sectors; i++) {
        const offsetAngle = i * step;

        const a1 = theta1 + offsetAngle;
        const a2 = theta2 + offsetAngle;

        ctx.beginPath();
        if (isCaligraphy) {
          ctx.lineWidth = Math.max(1, STATE.strokeWidth * Math.abs(Math.sin(a1)) + 1);
        } else if (STATE.brushStyle === 'dotted') {
          ctx.arc(cx + Math.cos(a2) * r2, cy + Math.sin(a2) * r2, STATE.strokeWidth / 2, 0, Math.PI * 2);
          ctx.fillStyle = ctx.strokeStyle;
          ctx.fill();
          continue;
        } else if (STATE.brushStyle === 'gold_dust' && STATE.tool !== 'eraser') {
          for (let g = 0; g < 3; g++) {
            const ox = (Math.random() - 0.5) * STATE.strokeWidth * 3;
            const oy = (Math.random() - 0.5) * STATE.strokeWidth * 3;
            ctx.fillStyle = Math.random() > 0.4 ? "#FFD700" : "#FFF8DC";
            ctx.beginPath();
            ctx.arc(cx + Math.cos(a2) * r2 + ox, cy + Math.sin(a2) * r2 + oy, Math.random() * (STATE.strokeWidth * 0.4) + 1, 0, Math.PI * 2);
            ctx.fill();
          }
          continue;
        }

        ctx.moveTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
        ctx.lineTo(cx + Math.cos(a2) * r2, cy + Math.sin(a2) * r2);
        ctx.stroke();

        // Bilateral Mirror Reflection
        if (STATE.mirror) {
          const ma1 = -theta1 + offsetAngle;
          const ma2 = -theta2 + offsetAngle;

          ctx.beginPath();
          if (isCaligraphy) {
            ctx.lineWidth = Math.max(1, STATE.strokeWidth * Math.abs(Math.sin(ma1)) + 1);
          }
          ctx.moveTo(cx + Math.cos(ma1) * r1, cy + Math.sin(ma1) * r1);
          ctx.lineTo(cx + Math.cos(ma2) * r2, cy + Math.sin(ma2) * r2);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    // --- Shape Radial Stamping Engine ---
    stampRadialGeometricShape(x, y) {
      const cx = STATE.size / 2;
      const cy = STATE.size / 2;
      const sectors = STATE.sectors;
      const step = (Math.PI * 2) / sectors;

      const dx = x - cx;
      const dy = y - cy;
      const r = Math.hypot(dx, dy);
      const baseAngle = Math.atan2(dy, dx);

      const shape = SHAPES.find(s => s.id === STATE.activeShapeId) || SHAPES[0];
      const customRad = (STATE.shapeRotation * Math.PI) / 180;

      this.artCtx.save();
      this.artCtx.strokeStyle = STATE.color;
      this.artCtx.fillStyle = STATE.color;
      this.artCtx.lineWidth = STATE.strokeWidth;
      this.artCtx.globalAlpha = STATE.opacity;

      if (STATE.glow) {
        this.artCtx.shadowBlur = STATE.strokeWidth * 3;
        this.artCtx.shadowColor = STATE.color;
      }

      for (let i = 0; i < sectors; i++) {
        const angle = baseAngle + i * step;
        const posX = cx + Math.cos(angle) * r;
        const posY = cy + Math.sin(angle) * r;

        this.artCtx.save();
        this.artCtx.translate(posX, posY);
        this.artCtx.rotate(angle + Math.PI / 2 + customRad);
        shape.draw(this.artCtx, STATE.shapeScale);
        this.artCtx.restore();

        if (STATE.mirror) {
          const mAngle = -baseAngle + i * step;
          const mPosX = cx + Math.cos(mAngle) * r;
          const mPosY = cy + Math.sin(mAngle) * r;

          this.artCtx.save();
          this.artCtx.translate(mPosX, mPosY);
          this.artCtx.scale(-1, 1);
          this.artCtx.rotate(-(mAngle + Math.PI / 2 + customRad));
          shape.draw(this.artCtx, STATE.shapeScale);
          this.artCtx.restore();
        }
      }

      this.artCtx.restore();
    }

    stampRadialMotif(x, y) {
      const cx = STATE.size / 2;
      const cy = STATE.size / 2;
      const sectors = STATE.sectors;
      const step = (Math.PI * 2) / sectors;

      const dx = x - cx;
      const dy = y - cy;
      const r = Math.hypot(dx, dy);
      const baseAngle = Math.atan2(dy, dx);

      for (let i = 0; i < sectors; i++) {
        const theta = baseAngle + step * i;
        const targetX = cx + Math.cos(theta) * r;
        const targetY = cy + Math.sin(theta) * r;
        drawMotifStamp(this.artCtx, targetX, targetY, STATE.strokeWidth * 1.5, STATE.color, STATE.selectedMotif);

        if (STATE.mirror) {
          const mirrorTheta = -baseAngle + step * i;
          const mirrorX = cx + Math.cos(mirrorTheta) * r;
          const mirrorY = cy + Math.sin(mirrorTheta) * r;
          drawMotifStamp(this.artCtx, mirrorX, mirrorY, STATE.strokeWidth * 1.5, STATE.color, STATE.selectedMotif);
        }
      }
    }

    // --- Live Cursor & Shape Stamp Preview ---
    renderStampPreview(x, y) {
      this.previewCtx.clearRect(0, 0, STATE.size, STATE.size);
      const cx = STATE.size / 2;
      const cy = STATE.size / 2;
      const sectors = STATE.sectors;
      const step = (Math.PI * 2) / sectors;

      const dx = x - cx;
      const dy = y - cy;
      const r = Math.hypot(dx, dy);
      const baseAngle = Math.atan2(dy, dx);

      this.previewCtx.save();
      this.previewCtx.strokeStyle = 'rgba(245, 166, 35, 0.75)';
      this.previewCtx.fillStyle = 'rgba(245, 166, 35, 0.2)';
      this.previewCtx.lineWidth = 1.5;
      this.previewCtx.setLineDash([3, 3]);

      if (STATE.mode === 'shapes') {
        const shape = SHAPES.find(s => s.id === STATE.activeShapeId) || SHAPES[0];
        const customRad = (STATE.shapeRotation * Math.PI) / 180;

        for (let i = 0; i < sectors; i++) {
          const angle = baseAngle + i * step;
          const posX = cx + Math.cos(angle) * r;
          const posY = cy + Math.sin(angle) * r;

          this.previewCtx.save();
          this.previewCtx.translate(posX, posY);
          this.previewCtx.rotate(angle + Math.PI / 2 + customRad);
          shape.draw(this.previewCtx, STATE.shapeScale);
          this.previewCtx.restore();

          if (STATE.mirror) {
            const mAngle = -baseAngle + i * step;
            const mPosX = cx + Math.cos(mAngle) * r;
            const mPosY = cy + Math.sin(mAngle) * r;

            this.previewCtx.save();
            this.previewCtx.translate(mPosX, mPosY);
            this.previewCtx.scale(-1, 1);
            this.previewCtx.rotate(-(mAngle + Math.PI / 2 + customRad));
            shape.draw(this.previewCtx, STATE.shapeScale);
            this.previewCtx.restore();
          }
        }
      } else {
        for (let i = 0; i < sectors; i++) {
          const theta = baseAngle + step * i;
          const targetX = cx + Math.cos(theta) * r;
          const targetY = cy + Math.sin(theta) * r;
          drawMotifStamp(this.previewCtx, targetX, targetY, STATE.strokeWidth * 1.5, "rgba(245, 166, 35, 0.6)", STATE.selectedMotif);
        }
      }

      this.previewCtx.restore();
    }

    renderBrushCursor(x, y) {
      this.previewCtx.clearRect(0, 0, STATE.size, STATE.size);
      this.previewCtx.save();
      this.previewCtx.strokeStyle = STATE.tool === 'eraser' ? 'rgba(255, 100, 100, 0.8)' : 'rgba(245, 166, 35, 0.8)';
      this.previewCtx.lineWidth = 1.2;
      this.previewCtx.beginPath();
      this.previewCtx.arc(x, y, Math.max(3, STATE.strokeWidth / 2), 0, Math.PI * 2);
      this.previewCtx.stroke();
      this.previewCtx.restore();
    }

    // --- Symmetry Guidelines Grid ---
    renderGrid() {
      const { size } = STATE;
      this.gridCtx.clearRect(0, 0, size, size);
      if (!STATE.showGrid) return;

      const cx = size / 2;
      const cy = size / 2;
      const maxR = size / 2 - 12;
      const sectors = STATE.sectors;

      this.gridCtx.save();
      this.gridCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      this.gridCtx.lineWidth = 1;

      if (STATE.folkStyle === 'Kolam') {
        // Dot Matrix Grid
        const gridSize = 9;
        const step = size / (gridSize + 2);
        const startX = cx - ((gridSize - 1) / 2) * step;
        const startY = cy - ((gridSize - 1) / 2) * step;

        this.gridCtx.setLineDash([4, 4]);
        this.gridCtx.beginPath();
        this.gridCtx.moveTo(cx - 4 * step, cy);
        this.gridCtx.lineTo(cx + 4 * step, cy);
        this.gridCtx.moveTo(cx, cy - 4 * step);
        this.gridCtx.lineTo(cx, cy + 4 * step);
        this.gridCtx.stroke();

        this.gridCtx.setLineDash([]);
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const x = startX + col * step;
            const y = startY + row * step;
            const dist = Math.abs(col - 4) + Math.abs(row - 4);
            if (dist <= 5) {
              this.gridCtx.fillStyle = '#FFF5EA';
              this.gridCtx.beginPath();
              this.gridCtx.arc(x, y, 3, 0, Math.PI * 2);
              this.gridCtx.fill();
            }
          }
        }
      } else {
        // Concentric Rings
        const rings = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.0];
        rings.forEach(fraction => {
          this.gridCtx.beginPath();
          this.gridCtx.arc(cx, cy, maxR * fraction, 0, Math.PI * 2);
          this.gridCtx.stroke();
        });

        // Radial Sector Lines
        for (let i = 0; i < sectors; i++) {
          const angle = (i * 2 * Math.PI) / sectors;
          this.gridCtx.beginPath();
          this.gridCtx.moveTo(cx, cy);
          this.gridCtx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
          this.gridCtx.stroke();
        }

        // Center Bindu
        this.gridCtx.fillStyle = '#f5a623';
        this.gridCtx.beginPath();
        this.gridCtx.arc(cx, cy, 3.5, 0, Math.PI * 2);
        this.gridCtx.fill();
      }

      this.gridCtx.restore();
    }

    // --- Tracing Guide Renderer ---
    renderTraceGuide() {
      const { size } = STATE;
      this.traceCtx.clearRect(0, 0, size, size);

      if (!STATE.traceVisible) {
        this.traceCanvas.style.display = 'none';
        return;
      }
      this.traceCanvas.style.display = 'block';
      this.traceCanvas.style.opacity = STATE.traceOpacity;

      const cx = size / 2;
      const cy = size / 2;
      const R = size / 2 - 25;

      this.traceCtx.save();
      this.traceCtx.lineWidth = 1.8;
      this.traceCtx.strokeStyle = STATE.traceInverted ? 'rgba(0, 210, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)';
      this.traceCtx.fillStyle = 'transparent';

      if (STATE.customTraceImg) {
        const img = STATE.customTraceImg;
        const scale = Math.min((size * 0.88) / img.width, (size * 0.88) / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        this.traceCtx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
      } else {
        const t = TEMPLATES.find(x => x.id === STATE.activeTemplateId) || TEMPLATES[0];
        if (t && t.draw) {
          t.draw(this.traceCtx, cx, cy, R);
        }
      }

      this.traceCtx.restore();
    }

    // --- State & UI Updates ---
    setMode(mode) {
      STATE.mode = mode;
      
      const tabFreehand = document.getElementById('tabFreehand');
      const tabTrace = document.getElementById('tabTrace');
      const tabShapes = document.getElementById('tabShapes');

      if (tabFreehand) tabFreehand.classList.toggle('active', mode === 'freehand');
      if (tabTrace) tabTrace.classList.toggle('active', mode === 'trace');
      if (tabShapes) tabShapes.classList.toggle('active', mode === 'shapes');

      // Update sidebar sections
      const modeConfigSec = document.getElementById('modeConfigSection');
      const traceSec = document.getElementById('traceControlsSection');
      const shapesSec = document.getElementById('shapesControlsSection');
      const banner = document.getElementById('modeBannerText');
      const title = document.getElementById('sidebarSectionTitle');

      if (mode === 'freehand') {
        if (modeConfigSec) modeConfigSec.style.display = 'block';
        if (traceSec) traceSec.style.display = 'none';
        if (shapesSec) shapesSec.style.display = 'none';
        if (title) title.textContent = "Freehand Brush Settings";
        if (banner) banner.textContent = "Draw freely on the blank canvas. Your strokes are reflected in all radial sectors in real time.";
        this.selectTool('brush');
      } else if (mode === 'trace') {
        if (modeConfigSec) modeConfigSec.style.display = 'block';
        if (traceSec) traceSec.style.display = 'block';
        if (shapesSec) shapesSec.style.display = 'none';
        if (title) title.textContent = "Tracing & Guide Settings";
        if (banner) banner.textContent = "Trace over sacred geometric mandala templates or upload your own reference outline.";
        this.renderTraceGuide();
      } else if (mode === 'shapes') {
        if (modeConfigSec) modeConfigSec.style.display = 'none';
        if (traceSec) traceSec.style.display = 'none';
        if (shapesSec) shapesSec.style.display = 'block';
        if (title) title.textContent = "Radial Shape Stamps";
        if (banner) banner.textContent = "Select a sacred geometric motif or shape stamp. Click anywhere to stamp with radial symmetry.";
        this.selectTool('stamp');
      }
    }

    setFolkStyle(styleName) {
      STATE.folkStyle = styleName;
      document.querySelectorAll('.studio-mode-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.mode === styleName);
      });

      const desc = document.getElementById('inPageModeDesc');
      if (styleName === 'Kolam') {
        STATE.sectors = 4;
        STATE.brushStyle = 'powder';
        this.setColor('#FFFFFF');
        if (desc) desc.textContent = "☸️ Dot Matrix (Pulli Kolam) • Sacred Geometric Sikku Loops";
      } else if (styleName === 'Mandala') {
        STATE.sectors = 12;
        STATE.brushStyle = 'round';
        this.setColor('#f5a623');
        if (desc) desc.textContent = "🌸 Radial Mandala • Cosmic Balance & Concentric Guide Rings";
      } else if (styleName === 'Rangoli') {
        STATE.sectors = 8;
        STATE.mirror = true;
        STATE.brushStyle = 'glow';
        this.setColor('#ff1744');
        if (desc) desc.textContent = "✨ Festive Rangoli • Auspicious Floral Geometry & Mirror Reflection";
      } else if (styleName === 'Warli') {
        STATE.sectors = 2;
        STATE.brushStyle = 'round';
        this.setColor('#FFFFFF');
        if (desc) desc.textContent = "🏹 Warli Tribal Art • Sacred Stick Figures & Circle Dance";
      } else if (styleName === 'Madhubani') {
        STATE.sectors = 4;
        STATE.brushStyle = 'caligraphy';
        this.setColor('#ff1744');
        if (desc) desc.textContent = "🦚 Madhubani / Mithila • Double Line Motifs & Floral Borders";
      } else if (styleName === 'Aipan') {
        STATE.sectors = 8;
        STATE.brushStyle = 'powder';
        this.setColor('#FFFFFF');
        if (desc) desc.textContent = "🏔️ Aipan Art • Uttarakhand Sacred Chauki & Geru Ochre";
      }

      this.updateSymmetryUI();
      this.renderGrid();
    }

    selectTool(tool) {
      STATE.tool = tool;
      const toolBrush = document.getElementById('toolBrush');
      const toolEraser = document.getElementById('toolEraser');
      const toolStamp = document.getElementById('toolStamp');

      if (toolBrush) toolBrush.classList.toggle('active', tool === 'brush');
      if (toolEraser) toolEraser.classList.toggle('active', tool === 'eraser');
      if (toolStamp) toolStamp.classList.toggle('active', tool === 'stamp');
      this.previewCtx.clearRect(0, 0, STATE.size, STATE.size);
    }

    setBrushTexture(style) {
      STATE.brushStyle = style;
      document.querySelectorAll('.brush-card').forEach(card => card.classList.remove('active'));
      const activeCard = document.getElementById(`bStyle${style.charAt(0).toUpperCase() + style.slice(1)}`);
      if (activeCard) activeCard.classList.add('active');
    }

    setSectors(count) {
      STATE.sectors = Math.max(2, Math.min(64, parseInt(count, 10)));
      this.updateSymmetryUI();
      this.renderGrid();
    }

    adjustSectors(delta) {
      this.setSectors(STATE.sectors + delta);
    }

    updateSymmetryUI() {
      const badge = document.getElementById('sectorCountVal');
      if (badge) badge.textContent = STATE.sectors;

      document.querySelectorAll('.preset-chip').forEach(chip => {
        chip.classList.toggle('active', parseInt(chip.textContent, 10) === STATE.sectors);
      });
    }

    setColor(hex) {
      STATE.color = hex;
      const swatch = document.getElementById('activeColorSwatch');
      const picker = document.getElementById('nativeColorPicker');
      if (swatch) swatch.style.backgroundColor = hex;
      if (picker) picker.value = hex;

      document.querySelectorAll('.color-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.color === hex);
      });
    }

    setStrokeWidth(val) {
      STATE.strokeWidth = parseInt(val, 10);
      const label = document.getElementById('valStrokeWidth');
      if (label) label.textContent = `${STATE.strokeWidth} px`;
    }

    setOpacity(val) {
      STATE.opacity = parseInt(val, 10) / 100;
      const label = document.getElementById('valOpacity');
      if (label) label.textContent = `${val}%`;
    }

    toggleGlow() {
      STATE.glow = !STATE.glow;
      const btn = document.getElementById('btnGlow');
      if (btn) btn.classList.toggle('active', STATE.glow);
    }

    toggleRainbow() {
      STATE.rainbow = !STATE.rainbow;
      const btn = document.getElementById('btnRainbow');
      if (btn) btn.classList.toggle('active', STATE.rainbow);
    }

    setCanvasBackground(hex, textColor) {
      STATE.canvasBg = hex;
      if (this.canvasContainer) {
        this.canvasContainer.style.backgroundColor = hex;
      }
      document.querySelectorAll('.preset-bg-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.bg === hex);
      });
    }

    // --- Trace Controls ---
    setTraceOpacity(val) {
      STATE.traceOpacity = parseInt(val, 10) / 100;
      const label = document.getElementById('valTraceOpacity');
      if (label) label.textContent = `${val}%`;
      if (this.traceCanvas) this.traceCanvas.style.opacity = STATE.traceOpacity;
    }

    toggleTraceVisibility() {
      STATE.traceVisible = !STATE.traceVisible;
      const btnText = document.getElementById('btnTraceToggleText');
      if (btnText) btnText.textContent = STATE.traceVisible ? 'Hide Guide' : 'Show Guide';
      this.renderTraceGuide();
    }

    invertTraceColor() {
      STATE.traceInverted = !STATE.traceInverted;
      this.renderTraceGuide();
    }

    selectTemplate(templateId) {
      STATE.activeTemplateId = templateId;
      STATE.customTraceImg = null;
      document.querySelectorAll('.template-card').forEach(c => {
        c.classList.toggle('active', c.dataset.template === templateId);
      });
      this.renderTraceGuide();
    }

    handleCustomUpload(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          STATE.customTraceImg = img;
          this.renderTraceGuide();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }

    // --- Shapes Controls ---
    selectShape(shapeId) {
      STATE.activeShapeId = shapeId;
      this.selectTool('stamp');
      
      const dropdown = document.getElementById('shapeSelectDropdown');
      if (dropdown) dropdown.value = shapeId;

      const badge = document.getElementById('activeShapeBadge');
      const found = SHAPES.find(s => s.id === shapeId);
      if (badge && found) badge.textContent = found.name;

      document.querySelectorAll('.shape-card').forEach(c => {
        c.classList.toggle('active', c.dataset.shape === shapeId);
      });
    }

    setShapeScale(val) {
      STATE.shapeScale = parseInt(val, 10) / 100;
      const label = document.getElementById('valShapeScale');
      if (label) label.textContent = `${val}%`;
    }

    setShapeRotation(val) {
      STATE.shapeRotation = parseInt(val, 10);
      const label = document.getElementById('valShapeRotation');
      if (label) label.textContent = `${val}°`;
    }

    // --- Zoom Controls ---
    zoomIn() {
      STATE.zoom = Math.min(2.5, STATE.zoom + 0.2);
      this.applyZoom();
    }

    zoomOut() {
      STATE.zoom = Math.max(0.6, STATE.zoom - 0.2);
      this.applyZoom();
    }

    resetZoom() {
      STATE.zoom = 1.0;
      this.applyZoom();
    }

    applyZoom() {
      if (this.canvasContainer) {
        this.canvasContainer.style.transform = `scale(${STATE.zoom})`;
      }
    }

    // --- History Stack ---
    saveHistoryState() {
      const imgData = this.artCtx.getImageData(0, 0, this.artCanvas.width, this.artCanvas.height);
      this.undoStack.push(imgData);
      if (this.undoStack.length > this.maxStates) this.undoStack.shift();
      this.redoStack = [];
      this.updateHistoryButtons();
    }

    undo() {
      if (this.undoStack.length <= 1) return;
      const current = this.undoStack.pop();
      this.redoStack.push(current);
      const prev = this.undoStack[this.undoStack.length - 1];
      this.artCtx.putImageData(prev, 0, 0);
      this.updateHistoryButtons();
    }

    redo() {
      if (this.redoStack.length === 0) return;
      const next = this.redoStack.pop();
      this.undoStack.push(next);
      this.artCtx.putImageData(next, 0, 0);
      this.updateHistoryButtons();
    }

    updateHistoryButtons() {
      const btnUndo = document.getElementById('btnUndo');
      const btnRedo = document.getElementById('btnRedo');
      if (btnUndo) btnUndo.disabled = this.undoStack.length <= 1;
      if (btnRedo) btnRedo.disabled = this.redoStack.length === 0;
    }

    clearCanvas() {
      if (confirm('Clear the canvas? Your mandala artwork will be reset.')) {
        this.saveHistoryState();
        this.artCtx.clearRect(0, 0, this.artCanvas.width, this.artCanvas.height);
      }
    }

    // --- Dynamic DOM Generation ---
    renderTemplateList() {
      const grid = document.getElementById('templateGrid');
      if (!grid) return;

      const TEMPLATE_SVGS = {
        lotus: `<circle cx="100" cy="100" r="85" stroke="#f5a623" stroke-width="2" fill="none" /><circle cx="100" cy="100" r="55" stroke="rgba(245,166,35,0.6)" stroke-width="1.5" fill="none" /><circle cx="100" cy="100" r="25" stroke="#f5a623" stroke-width="1.5" fill="none" /><path d="M100 45 C90 70 90 85 100 100 C110 85 110 70 100 45 Z" fill="rgba(245,166,35,0.3)" stroke="#f5a623" stroke-width="1.5"/><path d="M100 155 C90 130 90 115 100 100 C110 115 110 130 100 155 Z" fill="rgba(245,166,35,0.3)" stroke="#f5a623" stroke-width="1.5"/><path d="M45 100 C70 90 85 90 100 100 C85 110 70 110 45 100 Z" fill="rgba(245,166,35,0.3)" stroke="#f5a623" stroke-width="1.5"/><path d="M155 100 C130 90 115 90 100 100 C115 110 130 110 155 100 Z" fill="rgba(245,166,35,0.3)" stroke="#f5a623" stroke-width="1.5"/>`,
        chakra: `<circle cx="100" cy="100" r="85" stroke="#f5a623" stroke-width="2" fill="none" /><circle cx="100" cy="100" r="45" stroke="#00d2ff" stroke-width="1.5" fill="none" /><polygon points="100,15 108,45 125,25 122,55 145,42 132,68 158,62 138,82 165,88 138,100 165,112 138,118 158,138 132,132 145,158 122,145 125,175 108,155 100,185 92,155 75,175 78,145 55,158 68,132 42,138 62,118 35,112 62,100 35,88 62,82 42,62 68,68 55,42 78,55 75,25 92,45" fill="rgba(245,166,35,0.2)" stroke="#f5a623" stroke-width="1.5"/>`,
        celestial: `<circle cx="100" cy="100" r="85" stroke="#f5a623" stroke-width="2" fill="none" /><rect x="40" y="40" width="120" height="120" fill="none" stroke="#00d2ff" stroke-width="1.5" /><rect x="40" y="40" width="120" height="120" transform="rotate(45 100 100)" fill="none" stroke="#f5a623" stroke-width="1.5" /><circle cx="100" cy="100" r="20" fill="#f5a623" />`,
        peacock: `<circle cx="100" cy="100" r="85" stroke="#f5a623" stroke-width="2" fill="none" /><circle cx="100" cy="100" r="60" stroke="#00d2ff" stroke-width="1.5" fill="none" /><circle cx="100" cy="40" r="14" fill="rgba(0,210,255,0.3)" stroke="#00d2ff" stroke-width="2"/><circle cx="100" cy="160" r="14" fill="rgba(0,210,255,0.3)" stroke="#00d2ff" stroke-width="2"/><circle cx="40" cy="100" r="14" fill="rgba(0,210,255,0.3)" stroke="#00d2ff" stroke-width="2"/><circle cx="160" cy="100" r="14" fill="rgba(0,210,255,0.3)" stroke="#00d2ff" stroke-width="2"/>`,
        zenyantra: `<circle cx="100" cy="100" r="85" stroke="#f5a623" stroke-width="2" fill="none" /><polygon points="100,25 160,135 40,135" fill="none" stroke="#f5a623" stroke-width="2"/><polygon points="100,175 160,65 40,65" fill="none" stroke="#00d2ff" stroke-width="2"/><circle cx="100" cy="100" r="12" fill="#f5a623"/>`,
        spiral: `<circle cx="100" cy="100" r="85" stroke="#f5a623" stroke-width="2" fill="none" /><path d="M100,100 A15,15 0 0,1 115,100 A30,30 0 0,1 85,100 A45,45 0 0,1 145,100 A60,60 0 0,1 55,100 A75,75 0 0,1 175,100" fill="none" stroke="#f5a623" stroke-width="2.5" stroke-linecap="round"/>`
      };

      grid.innerHTML = TEMPLATES.map(t => `
        <div class="template-card ${t.id === STATE.activeTemplateId ? 'active' : ''}" 
             data-template="${t.id}" 
             onclick="window.selectMandalaTemplate('${t.id}')">
          <div class="template-preview">
            <svg viewBox="0 0 200 200">
              ${TEMPLATE_SVGS[t.id] || '<circle cx="100" cy="100" r="80" stroke="#f5a623" stroke-width="2" fill="none"/>'}
            </svg>
          </div>
          <div class="template-info">
            <h4>${t.name}</h4>
            <p>${t.desc}</p>
          </div>
        </div>
      `).join('');
    }

    renderShapesGrid() {
      const grid = document.getElementById('shapesGrid');
      if (!grid) return;

      const SHAPE_SVGS = {
        lotusPetal: `<path d="M 0 0 C -22 -35 -18 -80 0 -105 C 18 -80 22 -35 0 0 Z" fill="rgba(245,166,35,0.2)" stroke="#f5a623" stroke-width="3" stroke-linejoin="round" />`,
        pointedPetal: `<polygon points="0,0 -26,-50 0,-110 26,-50" fill="rgba(245,166,35,0.2)" stroke="#f5a623" stroke-width="3" stroke-linejoin="round" />`,
        teardrop: `<path d="M 0 -45 A 24 24 0 0 1 0 3 L 0 -105 Z" fill="rgba(245,166,35,0.2)" stroke="#f5a623" stroke-width="3" stroke-linejoin="round" />`,
        paisley: `<path d="M 0 0 C -35 -25 -35 -75 0 -95 C 26 -105 38 -65 22 -50 C 10 -40 22 -15 0 0 Z" fill="rgba(245,166,35,0.2)" stroke="#f5a623" stroke-width="3" stroke-linejoin="round" />`,
        sacredDiamond: `<polygon points="0,-10 -26,-55 0,-105 26,-55" fill="rgba(245,166,35,0.2)" stroke="#f5a623" stroke-width="3" stroke-linejoin="round" /><polygon points="0,-28 -15,-55 0,-85 15,-55" fill="none" stroke="#f5a623" stroke-width="2" />`,
        crescentMoon: `<path d="M -18 -55 A 32 32 0 0 0 25 -20 A 25 25 0 0 1 -18 -55 Z" fill="rgba(245,166,35,0.2)" stroke="#f5a623" stroke-width="3" stroke-linejoin="round" />`,
        binduRosette: `<circle cx="0" cy="-55" r="30" fill="none" stroke="#f5a623" stroke-width="2.5" /><circle cx="0" cy="-55" r="18" fill="none" stroke="#f5a623" stroke-width="2.5" /><circle cx="0" cy="-55" r="5" fill="#f5a623" />`,
        sunRay: `<line x1="0" y1="0" x2="0" y2="-110" stroke="#f5a623" stroke-width="3" stroke-linecap="round"/><line x1="0" y1="-55" x2="-22" y2="-90" stroke="#f5a623" stroke-width="3" stroke-linecap="round"/><line x1="0" y1="-55" x2="22" y2="-90" stroke="#f5a623" stroke-width="3" stroke-linecap="round"/>`,
        spiralVortex: `<path d="M 0 -35 A 8 8 0 0 1 8 -43 A 16 16 0 0 1 0 -27 A 24 24 0 0 1 -24 -43 A 32 32 0 0 1 0 -11" fill="none" stroke="#f5a623" stroke-width="3" stroke-linecap="round"/>`
      };

      grid.innerHTML = SHAPES.map(s => `
        <div class="shape-card ${s.id === STATE.activeShapeId ? 'active' : ''}" 
             data-shape="${s.id}" 
             title="${s.name}"
             onclick="window.selectMandalaShape('${s.id}')">
          <svg viewBox="-50 -130 100 145" style="width: 32px; height: 32px; overflow: visible;">
            ${SHAPE_SVGS[s.id] || '<circle cx="0" cy="-50" r="25" stroke="#f5a623" stroke-width="3" fill="none" />'}
          </svg>
          <span style="font-size: 0.65rem; font-weight: 600; color: var(--text-muted);">${s.name}</span>
        </div>
      `).join('');
    }

    renderColorPalettes() {
      const container = document.getElementById('curatedPalettesContainer');
      if (!container) return;

      container.innerHTML = Object.entries(PALETTES).map(([key, list]) => `
        <div class="palette-group">
          <div class="palette-name">${key.toUpperCase()} PALETTE</div>
          <div class="color-grid">
            ${list.map(c => `
              <div class="color-dot ${c.hex === STATE.color ? 'active' : ''}" 
                   style="background:${c.hex};" 
                   data-color="${c.hex}" 
                   title="${c.name}"
                   onclick="window.selectStudioColor('${c.hex}')">
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }

    // --- Sacred Generative Flow Auto-Draw ---
    startGenerativeFlow() {
      if (this.isAutoFlowing) {
        this.stopGenerativeFlow();
        return;
      }

      this.isAutoFlowing = true;
      const genBtn = document.getElementById('inPageGenFlowBtn');
      if (genBtn) genBtn.innerHTML = `⏸ Pause Sacred Flow`;

      const cx = STATE.size / 2;
      const cy = STATE.size / 2;
      let t = 0;
      const maxT = 600;

      const a = 180 + Math.random() * 80;
      const k = Math.floor(Math.random() * 5) + 3;

      this.autoFlowInterval = setInterval(() => {
        if (!this.isAutoFlowing || t >= maxT) {
          this.stopGenerativeFlow();
          return;
        }

        const theta1 = (t * Math.PI) / 60;
        const theta2 = ((t + 1) * Math.PI) / 60;

        const r1 = a * Math.sin(k * theta1) + 40;
        const r2 = a * Math.sin(k * theta2) + 40;

        this.drawSymmetricStroke(
          cx + r1 * Math.cos(theta1),
          cy + r1 * Math.sin(theta1),
          cx + r2 * Math.cos(theta2),
          cy + r2 * Math.sin(theta2)
        );
        t++;
      }, 25);
    }

    stopGenerativeFlow() {
      if (this.autoFlowInterval) {
        clearInterval(this.autoFlowInterval);
        this.autoFlowInterval = null;
      }
      this.isAutoFlowing = false;
      const genBtn = document.getElementById('inPageGenFlowBtn');
      if (genBtn) genBtn.innerHTML = `✨ Auto-Draw Sacred Flow`;
      this.saveHistoryState();
    }

    // --- Export Artwork ---
    exportArtwork(format) {
      const art = this.artCanvas;
      if (!art) return;

      if (format === 'png-transparent') {
        const link = document.createElement('a');
        link.download = `virasya_mandala_transparent_${Date.now()}.png`;
        link.href = art.toDataURL('image/png');
        link.click();
      } else if (format === 'png-with-bg') {
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = art.width;
        exportCanvas.height = art.height;
        const ctx = exportCanvas.getContext('2d');

        ctx.fillStyle = STATE.canvasBg;
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        ctx.drawImage(art, 0, 0);

        const link = document.createElement('a');
        link.download = `virasya_mandala_art_${Date.now()}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
      } else if (format === 'png-framed') {
        const exportCanvas = document.createElement('canvas');
        const pad = 80;
        exportCanvas.width = art.width + pad * 2;
        exportCanvas.height = art.height + pad * 2 + 60;
        const ctx = exportCanvas.getContext('2d');

        // Dark Studio background
        ctx.fillStyle = "#0c0d12";
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

        // Golden Frame Borders
        ctx.strokeStyle = "#f5a623";
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, exportCanvas.width - 40, exportCanvas.height - 40);

        ctx.lineWidth = 1.5;
        ctx.strokeRect(28, 28, exportCanvas.width - 56, exportCanvas.height - 56);

        // Canvas Backdrop Tone
        ctx.fillStyle = STATE.canvasBg;
        ctx.fillRect(pad, pad, art.width, art.height);
        ctx.drawImage(art, pad, pad);

        // Virasya Gold Watermark Seal
        ctx.fillStyle = "#f5a623";
        ctx.font = "bold 24px 'Cinzel', serif";
        ctx.textAlign = "center";
        ctx.fillText("✦ VIRASYA HERITAGE MANDALA STUDIO ✦", exportCanvas.width / 2, exportCanvas.height - 35);

        const link = document.createElement('a');
        link.download = `virasya_framed_mandala_${Date.now()}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
      } else if (format === 'svg') {
        // Generate Scalable Vector SVG
        const imgUrl = art.toDataURL('image/png');
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STATE.size} ${STATE.size}" width="${STATE.size}" height="${STATE.size}">
  <rect width="100%" height="100%" fill="${STATE.canvasBg}"/>
  <image href="${imgUrl}" width="${STATE.size}" height="${STATE.size}"/>
</svg>`;
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `virasya_mandala_vector_${Date.now()}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }

      window.closeExportModal();
    }
  }

  // =========================================================================
  // 4. FOLK RHYTHM SEQUENCER & PANORAMA EXPLORER
  // =========================================================================

  class FolkRhythmsSequencer {
    constructor() {
      this.steps = 16;
      this.currentStep = 0;
      this.bpm = 110;
      this.isPlaying = false;
      this.timer = null;

      this.tracks = [
        { id: "dha", name: "DHA (Bayan)", pattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] },
        { id: "na", name: "NA (Dayan)", pattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0] },
        { id: "dholak", name: "DHOLAK", pattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0] },
        { id: "ghungroo", name: "GHUNGROO", pattern: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1] }
      ];

      this.presets = {
        teentaal: [
          [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
          [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
          [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
        ],
        keherwa: [
          [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
          [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
          [1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1],
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
        ],
        bhangra: [
          [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
          [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        garba: [
          [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
          [0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
          [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
        ]
      };
    }

    init() {
      this.renderSequencer();
    }

    renderSequencer() {
      const container = document.getElementById("inPageSequencerGrid");
      if (!container) return;

      container.innerHTML = this.tracks
        .map(
          (t, trackIdx) => `
        <div class="seq-track-row">
          <span class="seq-track-label">${t.name}</span>
          <div class="seq-steps-wrap">
            ${t.pattern
              .map(
                (step, stepIdx) => `
              <button class="seq-step-btn ${step ? "active" : ""}" 
                      id="stepBtn_${trackIdx}_${stepIdx}"
                      onclick="window.toggleSeqStep(${trackIdx}, ${stepIdx})">
              </button>
            `
              )
              .join("")}
          </div>
        </div>
      `
        )
        .join("");
    }

    toggleStep(trackIdx, stepIdx) {
      if (this.tracks[trackIdx]) {
        this.tracks[trackIdx].pattern[stepIdx] = this.tracks[trackIdx].pattern[stepIdx] ? 0 : 1;
        const btn = document.getElementById(`stepBtn_${trackIdx}_${stepIdx}`);
        if (btn) btn.classList.toggle("active", this.tracks[trackIdx].pattern[stepIdx] === 1);
      }
    }

    applyPreset(presetKey) {
      const matrix = this.presets[presetKey];
      if (!matrix) return;
      this.tracks.forEach((t, idx) => {
        if (matrix[idx]) t.pattern = [...matrix[idx]];
      });
      this.renderSequencer();
    }

    togglePlay() {
      if (this.isPlaying) this.stop();
      else this.play();
      return this.isPlaying;
    }

    play() {
      this.isPlaying = true;
      const playBtn = document.getElementById("inPageSeqPlayBtn");
      if (playBtn) playBtn.innerHTML = `<i class="fa-solid fa-pause"></i> Pause Loop`;

      const stepTimeMs = (60 / this.bpm / 4) * 1000;
      this.timer = setInterval(() => {
        this.advanceStep();
      }, stepTimeMs);
    }

    stop() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.isPlaying = false;
      this.currentStep = 0;
      this.clearStepHighlights();
      const playBtn = document.getElementById("inPageSeqPlayBtn");
      if (playBtn) playBtn.innerHTML = `<i class="fa-solid fa-play"></i> Play Beat Loop`;
    }

    advanceStep() {
      this.clearStepHighlights();
      const step = this.currentStep;

      this.tracks.forEach((t, trackIdx) => {
        if (t.pattern[step] === 1) {
          synthPercussion(t.id);
        }
        const btn = document.getElementById(`stepBtn_${trackIdx}_${step}`);
        if (btn) btn.classList.add("current");
      });

      this.currentStep = (this.currentStep + 1) % this.steps;
    }

    clearStepHighlights() {
      document.querySelectorAll(".seq-step-btn.current").forEach((b) => b.classList.remove("current"));
    }

    setBpm(newBpm) {
      this.bpm = parseInt(newBpm, 10) || 110;
      const badge = document.getElementById("inPageBpmBadge");
      if (badge) badge.textContent = `${this.bpm} BPM`;
      if (this.isPlaying) {
        this.stop();
        this.play();
      }
    }
  }

  class Monument360Explorer {
    constructor() {
      this.monuments = {
        konark: {
          title: "Konark Sun Temple (Odisha)",
          image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80",
          desc: "13th-century Kalinga chariot temple carved with 24 colossal stone wheels functioning as precise astronomical sundials.",
          narration: "Welcome to the Konark Sun Temple in Odisha. Conceived as a colossal chariot of the Sun God Surya, its twenty-four exquisitely carved stone wheels act as ancient astronomical sundials predicting time to the exact minute."
        },
        taj: {
          title: "Taj Mahal & Mughal Symmetries (Agra)",
          image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80",
          desc: "Pure Makrana white marble dome engineered with 4-fold Charbagh bilateral geometric symmetry and precious stone Pietra Dura inlay.",
          narration: "Behold the Taj Mahal, an architectural jewel of pure Makrana white marble. Built with immaculate bilateral symmetry, its gardens and reflecting pools echo sacred geometry and paradise."
        },
        hampi: {
          title: "Hampi Vijayanagara Stone Chariot (Karnataka)",
          image: "https://images.unsplash.com/photo-1600100397608-f010b8e3d4e4?auto=format&fit=crop&w=1600&q=80",
          desc: "Monolithic granite shrine situated within the 14th-century capital city of Vijayanagara on the banks of Tungabhadra river.",
          narration: "You stand before the legendary stone chariot of Hampi, dedicated to Garuda inside the Vittala temple complex. Carved from solid granite blocks, this stands as a testament to the Vijayanagara Empire."
        },
        ajanta: {
          title: "Ajanta & Ellora Caves (Maharashtra)",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80",
          desc: "Ancient 2nd-century BCE rock-cut Buddhist caves featuring world-famous fresco paintings and Kailash monolithic rock temple.",
          narration: "Step inside the ancient Ajanta and Ellora Caves, carved meticulously out of solid basalt cliff face over eight centuries, preserving exquisite Buddhist mural masterpieces."
        }
      };

      this.currentKey = "konark";
      this.offsetX = 0;
      this.isDragging = false;
      this.startX = 0;
    }

    init() {
      const container = document.getElementById("panoramaBox");
      if (!container) return;

      container.addEventListener("mousedown", (e) => this.startDrag(e));
      window.addEventListener("mousemove", (e) => this.onDrag(e));
      window.addEventListener("mouseup", () => this.stopDrag());

      container.addEventListener("touchstart", (e) => this.startDrag(e.touches[0]));
      window.addEventListener("touchmove", (e) => this.onDrag(e.touches[0]));
      window.addEventListener("touchend", () => this.stopDrag());

      this.loadMonument("konark");
    }

    startDrag(e) {
      this.isDragging = true;
      this.startX = e.clientX;
    }

    onDrag(e) {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.startX;
      this.startX = e.clientX;
      this.offsetX += deltaX * 0.4;

      const img = document.getElementById("panoBgImg");
      if (img) {
        img.style.transform = `scale(1.25) translateX(${this.offsetX}px)`;
      }
    }

    stopDrag() {
      this.isDragging = false;
    }

    loadMonument(key) {
      const mon = this.monuments[key];
      if (!mon) return;
      this.currentKey = key;
      this.offsetX = 0;

      const titleElem = document.getElementById("panoTitleBadge");
      const descElem = document.getElementById("panoDescText");
      const imgElem = document.getElementById("panoBgImg");

      if (titleElem) titleElem.textContent = mon.title;
      if (descElem) descElem.textContent = mon.desc;
      if (imgElem) {
        imgElem.src = mon.image;
        imgElem.style.transform = `scale(1.25) translateX(0px)`;
      }
    }

    narrateGuide() {
      if (!window.speechSynthesis) {
        alert("Audio Guide speech synthesis is supported on this browser!");
        return;
      }
      window.speechSynthesis.cancel();
      const mon = this.monuments[this.currentKey];
      if (!mon) return;

      const utterance = new SpeechSynthesisUtterance(mon.narration);
      utterance.pitch = 1.0;
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find((v) => v.lang.includes("en-IN") || v.name.includes("India"));
      if (indianVoice) utterance.voice = indianVoice;

      window.speechSynthesis.speak(utterance);
    }
  }

  class DevbhoomiAarti {
    constructor() {
      this.aartiRounds = 0;
      this.isDraggingDiya = false;
      this.lastAngle = 0;
      this.totalAngle = 0;
    }

    init() {
      const diyaWheel = document.getElementById("aartiDiyaWheel");
      if (!diyaWheel) return;

      const getAngle = (e, rect) => {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return Math.atan2(clientY - cy, clientX - cx);
      };

      const onStart = (e) => {
        this.isDraggingDiya = true;
        const rect = diyaWheel.getBoundingClientRect();
        this.lastAngle = getAngle(e, rect);
      };

      const onMove = (e) => {
        if (!this.isDraggingDiya) return;
        const rect = diyaWheel.getBoundingClientRect();
        const currentAngle = getAngle(e, rect);
        let diff = currentAngle - this.lastAngle;

        if (diff > Math.PI) diff -= Math.PI * 2;
        if (diff < -Math.PI) diff += Math.PI * 2;

        this.totalAngle += diff;
        this.lastAngle = currentAngle;

        const deg = (this.totalAngle * 180) / Math.PI;
        diyaWheel.style.transform = `rotate(${deg}deg)`;

        if (Math.abs(this.totalAngle) >= Math.PI * 2) {
          this.totalAngle = 0;
          this.aartiRounds++;
          synthPercussion("ghungroo");
          const counterBadge = document.getElementById("aartiCounterBadge");
          if (counterBadge) {
            counterBadge.textContent = `${this.aartiRounds} Rounds Completed ✦`;
          }
        }
      };

      const onEnd = () => {
        this.isDraggingDiya = false;
      };

      diyaWheel.addEventListener("mousedown", onStart);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onEnd);

      diyaWheel.addEventListener("touchstart", onStart, { passive: false });
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onEnd);
    }

    ringTempleBell() {
      synthPercussion("bell");
      const bellElem = document.querySelector(".aarti-bell-container");
      if (bellElem) {
        bellElem.classList.add("ringing");
        setTimeout(() => {
          bellElem.classList.remove("ringing");
        }, 1200);
      }
    }

    setWeather(mode) {
      const stage = document.querySelector(".aarti-stage-wrap");
      const pills = document.querySelectorAll(".weather-pill");
      pills.forEach((p) => p.classList.toggle("active", p.dataset.weather === mode));

      if (!stage) return;
      if (mode === "sunrise") {
        stage.style.background = "linear-gradient(180deg, #4a1d08 0%, #b83a24 50%, #f4a261 100%)";
      } else if (mode === "mist") {
        stage.style.background = "linear-gradient(180deg, #1b263b 0%, #415a77 60%, #778da9 100%)";
      } else if (mode === "snow") {
        stage.style.background = "linear-gradient(180deg, #0d1b2a 0%, #1b263b 50%, #e0e1dd 100%)";
      } else {
        stage.style.background = "linear-gradient(180deg, #1b0c05 0%, #301306 100%)";
      }
    }
  }

  // =========================================================================
  // 5. GLOBAL INITIALIZATION & WINDOW BINDINGS
  // =========================================================================

  let studio = null;
  let rhythmsSequencer = null;
  let monumentExplorer = null;
  let devbhoomiAarti = null;

  document.addEventListener('DOMContentLoaded', () => {
    studio = new VirasyaMandalaStudio();
    studio.init();

    rhythmsSequencer = new FolkRhythmsSequencer();
    rhythmsSequencer.init();

    monumentExplorer = new Monument360Explorer();
    monumentExplorer.init();

    devbhoomiAarti = new DevbhoomiAarti();
    devbhoomiAarti.init();
  });

  // Global Tab Switcher
  window.switchSimulatorTab = function (tabKey, event) {
    document.querySelectorAll(".sim-nav-tab").forEach((btn) => btn.classList.remove("active"));
    if (event && event.currentTarget) event.currentTarget.classList.add("active");

    const panels = {
      artStudio: "simViewArtStudio",
      canvas: "simViewArtStudio",
      rhythms: "simViewRhythms",
      monuments: "simViewMonuments",
      devbhoomi: "simViewDevbhoomi"
    };

    document.querySelectorAll(".sim-view-panel").forEach((panel) => panel.classList.remove("active"));

    const targetId = panels[tabKey] || "simViewArtStudio";
    const activePanel = document.getElementById(targetId);
    if (activePanel) activePanel.classList.add("active");
  };

  // Studio Mode & Tools
  window.switchStudioMode = function (mode) {
    if (studio) studio.setMode(mode);
  };

  window.setStudioMode = function (folkStyle, event) {
    if (studio) studio.setFolkStyle(folkStyle);
  };

  window.selectDrawTool = function (tool) {
    if (studio) studio.selectTool(tool);
  };

  window.setBrushStyle = function (style) {
    if (studio) studio.setBrushTexture(style);
  };

  window.setSectors = function (count) {
    if (studio) studio.setSectors(count);
  };

  window.adjustSectors = function (delta) {
    if (studio) studio.adjustSectors(delta);
  };

  window.toggleMirror = function (val) {
    STATE.mirror = !!val;
  };

  window.toggleGrid = function (val) {
    STATE.showGrid = !!val;
    if (studio) studio.renderGrid();
  };

  window.updateCustomColor = function (hex) {
    if (studio) studio.setColor(hex);
  };

  window.selectPaletteColor = function (hex) {
    if (studio) studio.setColor(hex);
  };

  window.selectStudioColor = function (hex) {
    if (studio) studio.setColor(hex);
  };

  window.updateStrokeWidth = function (val) {
    if (studio) studio.setStrokeWidth(val);
  };

  window.updateOpacity = function (val) {
    if (studio) studio.setOpacity(val);
  };

  window.toggleGlowMode = function () {
    if (studio) studio.toggleGlow();
  };

  window.toggleRainbowMode = function () {
    if (studio) studio.toggleRainbow();
  };

  window.setCanvasBackground = function (hex, textCol) {
    if (studio) studio.setCanvasBackground(hex, textCol);
  };

  window.undo = function () {
    if (studio) studio.undo();
  };

  window.redo = function () {
    if (studio) studio.redo();
  };

  window.clearCanvasPrompt = function () {
    if (studio) studio.clearCanvas();
  };

  window.selectMandalaTemplate = function (templateId) {
    if (studio) studio.selectTemplate(templateId);
  };

  window.updateTraceOpacity = function (val) {
    if (studio) studio.setTraceOpacity(val);
  };

  window.toggleTraceVisibility = function () {
    if (studio) studio.toggleTraceVisibility();
  };

  window.invertTraceColor = function () {
    if (studio) studio.invertTraceColor();
  };

  window.handleCustomImageUpload = function (e) {
    if (studio) studio.handleCustomUpload(e);
  };

  window.selectMandalaShape = function (shapeId) {
    if (studio) studio.selectShape(shapeId);
  };

  window.updateShapeScale = function (val) {
    if (studio) studio.setShapeScale(val);
  };

  window.updateShapeRotation = function (val) {
    if (studio) studio.setShapeRotation(val);
  };

  window.selectMotifStamp = function (motifKey) {
    STATE.selectedMotif = motifKey;
    if (studio) studio.selectTool('stamp');
    document.querySelectorAll('.stamp-btn').forEach(btn => btn.classList.remove('active'));
    const b = document.getElementById(`motif_${motifKey}`);
    if (b) b.classList.add('active');
  };

  window.zoomIn = function () {
    if (studio) studio.zoomIn();
  };

  window.zoomOut = function () {
    if (studio) studio.zoomOut();
  };

  window.resetZoom = function () {
    if (studio) studio.resetZoom();
  };

  window.toggleRaagDrone = function () {
    const isPlaying = raagSynth.toggle();
    const bar = document.getElementById("inPageRaagBar");
    const btn = document.getElementById("inPageRaagBtn");
    if (bar) bar.classList.toggle("playing", isPlaying);
    if (btn) btn.innerHTML = isPlaying ? `<i class="fa-solid fa-volume-high"></i> Pause Raag` : `<i class="fa-solid fa-play"></i> Play Raag Drone`;
  };

  window.toggleGenerativeFlow = function () {
    if (studio) studio.startGenerativeFlow();
  };

  window.loadStudioTemplate = function (type) {
    if (!studio) return;
    studio.artCtx.clearRect(0, 0, studio.artCanvas.width, studio.artCanvas.height);
    const cx = STATE.size / 2;
    const cy = STATE.size / 2;

    if (type === 'lotus') {
      studio.setFolkStyle('Mandala');
      studio.setColor('#f5a623');
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        studio.drawSymmetricStroke(cx, cy, cx + Math.cos(a) * 160, cy + Math.sin(a) * 160);
      }
      drawMotifStamp(studio.artCtx, cx, cy, 28, "#FF9F1C", "lotus");
    } else if (type === 'sikku') {
      studio.setFolkStyle('Kolam');
      studio.setColor('#FFFFFF');
      const step = 60;
      for (let r = 1; r <= 3; r++) {
        studio.artCtx.strokeStyle = "#FFFFFF";
        studio.artCtx.lineWidth = 4;
        studio.artCtx.beginPath();
        studio.artCtx.arc(cx, cy, r * step, 0, Math.PI * 2);
        studio.artCtx.stroke();
      }
    } else if (type === 'rangoli') {
      studio.setFolkStyle('Rangoli');
      studio.setColor('#ff1744');
      drawMotifStamp(studio.artCtx, cx, cy, 32, "#ff1744", "surya");
    }
    studio.saveHistoryState();
  };

  // Modal & Exports
  window.openExportModal = function () {
    const modal = document.getElementById('exportModal');
    if (modal) modal.classList.add('open');
  };

  window.closeExportModal = function () {
    const modal = document.getElementById('exportModal');
    if (modal) modal.classList.remove('open');
  };

  window.exportArtwork = function (format) {
    if (studio) studio.exportArtwork(format);
  };

  // Sequencer & Monument Exports
  window.playFolkNote = function (type, event) {
    synthPercussion(type);
    if (event && event.currentTarget) {
      const btn = event.currentTarget;
      btn.classList.add("hit");
      setTimeout(() => btn.classList.remove("hit"), 180);
    }
  };

  window.toggleSeqPlay = function () {
    return rhythmsSequencer.togglePlay();
  };

  window.toggleSeqStep = function (trackIdx, stepIdx) {
    rhythmsSequencer.toggleStep(trackIdx, stepIdx);
  };

  window.onSeqPresetChange = function (presetKey) {
    rhythmsSequencer.applyPreset(presetKey);
  };

  window.onSeqBpmChange = function (val) {
    rhythmsSequencer.setBpm(val);
  };

  window.loadMonument360 = function (key) {
    monumentExplorer.loadMonument(key);
  };

  window.narrateMonument = function () {
    monumentExplorer.narrateGuide();
  };

  window.ringTempleBell = function () {
    devbhoomiAarti.ringTempleBell();
  };

  window.setDevbhoomiWeather = function (mode) {
    devbhoomiAarti.setWeather(mode);
  };

})();
