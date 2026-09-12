import React, { useEffect, useRef, useState, useCallback } from "react";
import "./ArtStudio.css";

const MODES = ["Kolam", "Mandala", "Rangoli"];

const COLORS = [
  { name: "Royal Gold", hex: "#D4AF37" },
  { name: "Sindoor Crimson", hex: "#E63946" },
  { name: "Terracotta Saffron", hex: "#F4A261" },
  { name: "Haldi Yellow", hex: "#E9C46A" },
  { name: "Peacock Teal", hex: "#2A9D8F" },
  { name: "Ocean Blue", hex: "#457B9D" },
  { name: "Krishna Violet", hex: "#9B5DE5" },
  { name: "Rice White", hex: "#FFFFFF" },
  { name: "Geru Red", hex: "#B83A24" },
  { name: "Tulsi Green", hex: "#55A630" },
  { name: "Sky Azure", hex: "#48CAE4" },
  { name: "Kohl Charcoal", hex: "#1F1C18" },
];

const BRUSH_STYLES = [
  { id: "smooth", name: "Smooth Fine", icon: "✏️" },
  { id: "powder", name: "Rice Powder", icon: "✨" },
  { id: "glow", name: "Diya Glow", icon: "🪔" },
  { id: "chisel", name: "Calligraphy", icon: "✒️" },
  { id: "eraser", name: "Eraser", icon: "🧹" },
];

const THEMES = [
  { id: "dark", name: "Cosmic Charcoal", bg: "#0c0b09", guide: "rgba(212, 175, 55, 0.35)", dot: "#FFFFFF" },
  { id: "geru", name: "Sacred Clay (Geru)", bg: "#231109", guide: "rgba(255, 230, 180, 0.35)", dot: "#FFF5EA" },
  { id: "granite", name: "Temple Granite", bg: "#161819", guide: "rgba(212, 175, 55, 0.3)", dot: "#E0E0E0" },
  { id: "parchment", name: "Palm Leaf", bg: "#f3ebd7", guide: "rgba(100, 50, 20, 0.35)", dot: "#5a2d0c" },
];

export default function ArtStudio({ onClose }) {
  const canvasRef = useRef(null);
  const guideCanvasRef = useRef(null);

  const [mode, setMode] = useState("Kolam");
  const [symmetry, setSymmetry] = useState(8);
  const [mirror, setMirror] = useState(true);
  const [color, setColor] = useState("#D4AF37");
  const [brushSize, setBrushSize] = useState(4);
  const [brushStyle, setBrushStyle] = useState("smooth");
  const [showGuides, setShowGuides] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const lastPosRef = useRef({ x: 0, y: 0 });

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  // Helper to get drawing canvas
  const getCanvas = () => canvasRef.current;
  const getGuideCanvas = () => guideCanvasRef.current;

  // Push snapshot to history stack
  const saveSnapshot = useCallback(() => {
    const canvas = getCanvas();
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();
    setHistory((prev) => {
      const upToCurrent = prev.slice(0, historyStep + 1);
      const newStack = [...upToCurrent, dataUrl];
      if (newStack.length > 30) newStack.shift();
      return newStack;
    });
    setHistoryStep((prev) => Math.min(prev + 1, 29));
  }, [historyStep]);

  // Redraw Guides Overlay Canvas
  const drawGuides = useCallback(() => {
    const guideCanvas = getGuideCanvas();
    if (!guideCanvas) return;

    const ctx = guideCanvas.getContext("2d");
    const width = guideCanvas.width;
    const height = guideCanvas.height;

    ctx.clearRect(0, 0, width, height);

    if (!showGuides) return;

    const cx = width / 2;
    const cy = height / 2;
    const guideColor = currentTheme.guide;
    const dotColor = currentTheme.dot;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = guideColor;

    if (mode === "Mandala") {
      // Concentric circles
      const maxR = Math.min(cx, cy) - 20;
      const rings = 6;
      for (let i = 1; i <= rings; i++) {
        const r = (maxR / rings) * i;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Radial ray lines
      const totalSlices = symmetry;
      for (let i = 0; i < totalSlices; i++) {
        const angle = (Math.PI * 2 / totalSlices) * i;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
        ctx.stroke();
      }

      // Center bindu dot
      ctx.setLineDash([]);
      ctx.fillStyle = "#D4AF37";
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (mode === "Kolam") {
      // Traditional Pulli Kolam Dot Matrix (9x9 grid)
      const gridSize = 9;
      const step = Math.min(width, height) / (gridSize + 2);
      const startX = cx - ((gridSize - 1) / 2) * step;
      const startY = cy - ((gridSize - 1) / 2) * step;

      // Faint alignment diagonals
      ctx.beginPath();
      ctx.moveTo(cx - 4 * step, cy);
      ctx.lineTo(cx + 4 * step, cy);
      ctx.moveTo(cx, cy - 4 * step);
      ctx.lineTo(cx, cy + 4 * step);
      ctx.stroke();

      // Render dots
      ctx.setLineDash([]);
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const x = startX + col * step;
          const y = startY + row * step;

          // Brahma Mudi diamond boundary check or square grid
          const distFromCenter = Math.abs(col - 4) + Math.abs(row - 4);
          if (distFromCenter <= 5) {
            ctx.fillStyle = dotColor;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();

            // Tiny outer gold halo
            ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
    } else if (mode === "Rangoli") {
      // 8-Fold Rangoli Petal & Star Geometry
      const maxR = Math.min(cx, cy) - 25;
      const rings = [maxR * 0.35, maxR * 0.65, maxR];

      rings.forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 8-fold axes
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
        ctx.stroke();
      }

      // Outer 8-petal boundary arcs
      const petalAngle = (Math.PI * 2) / 8;
      for (let i = 0; i < 8; i++) {
        const a1 = petalAngle * i;
        const a2 = petalAngle * (i + 1);
        const midA = (a1 + a2) / 2;
        const px1 = cx + Math.cos(a1) * (maxR * 0.65);
        const py1 = cy + Math.sin(a1) * (maxR * 0.65);
        const px2 = cx + Math.cos(a2) * (maxR * 0.65);
        const py2 = cy + Math.sin(a2) * (maxR * 0.65);
        const cxPetal = cx + Math.cos(midA) * maxR;
        const cyPetal = cy + Math.sin(midA) * maxR;

        ctx.beginPath();
        ctx.moveTo(px1, py1);
        ctx.quadraticCurveTo(cxPetal, cyPetal, px2, py2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }, [showGuides, mode, symmetry, currentTheme]);

  // Initial Canvas Setup and Background
  const resetCanvasBg = useCallback(
    (targetBg) => {
      const canvas = getCanvas();
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = targetBg || currentTheme.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    [currentTheme.bg]
  );

  // Initialize canvases on mount or theme change
  useEffect(() => {
    const canvas = getCanvas();
    const guideCanvas = getGuideCanvas();
    if (!canvas || !guideCanvas) return;

    // Fixed internal resolution for high crispness
    const size = 900;
    canvas.width = size;
    canvas.height = size;
    guideCanvas.width = size;
    guideCanvas.height = size;

    resetCanvasBg();
    drawGuides();

    // Initial snapshot
    const initialData = canvas.toDataURL();
    setHistory([initialData]);
    setHistoryStep(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update guides when settings change
  useEffect(() => {
    drawGuides();
  }, [drawGuides]);

  // Adjust default symmetry per mode
  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "Kolam") {
      setSymmetry(4);
      setBrushStyle("powder");
      setColor("#FFFFFF");
    } else if (newMode === "Mandala") {
      setSymmetry(8);
      setBrushStyle("smooth");
      setColor("#D4AF37");
    } else if (newMode === "Rangoli") {
      setSymmetry(8);
      setMirror(true);
      setBrushStyle("glow");
      setColor("#E63946");
    }
  };

  // Clear Canvas
  const clearCanvas = () => {
    resetCanvasBg();
    drawGuides();
    saveSnapshot();
  };

  // Undo
  const undo = () => {
    if (historyStep <= 0) return;
    const targetStep = historyStep - 1;
    const targetData = history[targetStep];
    const canvas = getCanvas();
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistoryStep(targetStep);
    };
    img.src = targetData;
  };

  // Redo
  const redo = () => {
    if (historyStep >= history.length - 1) return;
    const targetStep = historyStep + 1;
    const targetData = history[targetStep];
    const canvas = getCanvas();
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistoryStep(targetStep);
    };
    img.src = targetData;
  };

  // Export Artwork (With or without guides & watermark)
  const exportArtwork = (includeWatermark = true) => {
    const canvas = getCanvas();
    if (!canvas) return;

    // Create export canvas for high-res compositing
    const expCanvas = document.createElement("canvas");
    expCanvas.width = canvas.width;
    expCanvas.height = canvas.height;
    const expCtx = expCanvas.getContext("2d");

    // Draw main artwork
    expCtx.drawImage(canvas, 0, 0);

    if (includeWatermark) {
      // Golden border frame
      expCtx.strokeStyle = "rgba(212, 175, 55, 0.75)";
      expCtx.lineWidth = 12;
      expCtx.strokeRect(16, 16, expCanvas.width - 32, expCanvas.height - 32);

      expCtx.strokeStyle = "rgba(212, 175, 55, 0.4)";
      expCtx.lineWidth = 2;
      expCtx.strokeRect(26, 26, expCanvas.width - 52, expCanvas.height - 52);

      // Virasya Badge Watermark
      expCtx.fillStyle = "#D4AF37";
      expCtx.font = "bold 20px 'Cinzel', serif, Georgia";
      expCtx.textAlign = "center";
      expCtx.fillText(`VIRASYA • ${mode.toUpperCase()} STUDIO`, expCanvas.width / 2, expCanvas.height - 40);

      expCtx.font = "italic 13px 'Playfair Display', serif";
      expCtx.fillStyle = "rgba(255, 255, 255, 0.7)";
      expCtx.fillText("Sacred Indian Heritage Art Simulator", expCanvas.width / 2, expCanvas.height - 22);
    }

    const link = document.createElement("a");
    link.download = `virasya-${mode.toLowerCase()}-${Date.now()}.png`;
    link.href = expCanvas.toDataURL("image/png");
    link.click();
  };

  // Pre-loaded Starter Patterns
  const loadTemplate = (templateName) => {
    const canvas = getCanvas();
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    resetCanvasBg();

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    if (templateName === "lotus") {
      setMode("Mandala");
      setSymmetry(8);
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#D4AF37";
      ctx.shadowBlur = 10;

      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.bezierCurveTo(45, -130, 60, -220, 0, -280);
        ctx.bezierCurveTo(-60, -220, -45, -130, 0, -60);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -160, 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, 50, 0, Math.PI * 2);
      ctx.stroke();
    } else if (templateName === "sikku") {
      setMode("Kolam");
      setSymmetry(4);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";

      // 4-Quadrant Sikku loops weaving around dots
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(80, -20, 120, -120);
        ctx.quadraticCurveTo(80, -220, 0, -180);
        ctx.quadraticCurveTo(-80, -220, -120, -120);
        ctx.quadraticCurveTo(-80, -20, 0, 0);
        ctx.stroke();
        ctx.restore();
      }
    } else if (templateName === "rangoli") {
      setMode("Rangoli");
      setSymmetry(8);
      ctx.strokeStyle = "#E63946";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#E63946";
      ctx.shadowBlur = 12;

      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -40);
        ctx.lineTo(40, -120);
        ctx.lineTo(0, -240);
        ctx.lineTo(-40, -120);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
    saveSnapshot();
  };

  // Convert mouse/touch event coordinates to canvas space
  const getCanvasCoords = (e) => {
    const canvas = getCanvas();
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Symmetrical Stroke Rendering Function
  const renderSymmetricalSegment = (p1, p2) => {
    const canvas = getCanvas();
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const dx1 = p1.x - cx;
    const dy1 = p1.y - cy;
    const dx2 = p2.x - cx;
    const dy2 = p2.y - cy;

    ctx.save();

    // Configure Brush Engine
    if (brushStyle === "eraser") {
      ctx.strokeStyle = currentTheme.bg;
      ctx.lineWidth = brushSize * 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = 0;
    } else if (brushStyle === "glow") {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = color;
      ctx.shadowBlur = brushSize * 2.8;
    } else if (brushStyle === "powder") {
      // Rice flour chalky aesthetic
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
      ctx.shadowBlur = 4;
    } else if (brushStyle === "chisel") {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize * 1.5;
      ctx.lineCap = "square";
      ctx.shadowBlur = 0;
    } else {
      // Smooth default
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = 0;
    }

    const totalAngles = mode === "Kolam" ? Math.max(1, symmetry) : symmetry;
    const angleStep = (Math.PI * 2) / totalAngles;

    for (let i = 0; i < totalAngles; i++) {
      const theta = angleStep * i;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);

      // 1. Direct rotation
      const x1 = cx + (dx1 * cos - dy1 * sin);
      const y1 = cy + (dx1 * sin + dy1 * cos);
      const x2 = cx + (dx2 * cos - dy2 * sin);
      const y2 = cy + (dx2 * sin + dy2 * cos);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // 2. Bilateral Mirror reflection (if active or Rangoli mode)
      if (mirror || mode === "Rangoli") {
        const mx1 = cx + (dx1 * cos + dy1 * sin);
        const my1 = cy - (dx1 * sin - dy1 * cos);
        const mx2 = cx + (dx2 * cos + dy2 * sin);
        const my2 = cy - (dx2 * sin - dy2 * cos);

        ctx.beginPath();
        ctx.moveTo(mx1, my1);
        ctx.lineTo(mx2, my2);
        ctx.stroke();
      }
    }

    ctx.restore();
  };

  // Pointer event handlers
  const handlePointerDown = (e) => {
    e.preventDefault();
    const pos = getCanvasCoords(e);
    lastPosRef.current = pos;
    setIsDrawing(true);

    // Draw single point / dot
    renderSymmetricalSegment(pos, { x: pos.x + 0.1, y: pos.y + 0.1 });
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const currentPos = getCanvasCoords(e);
    renderSymmetricalSegment(lastPosRef.current, currentPos);
    lastPosRef.current = currentPos;
  };

  const handlePointerUp = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    saveSnapshot();
  };

  return (
    <div className="art-studio-container">
      {/* Top Studio Bar */}
      <header className="art-studio-header">
        <div className="art-studio-brand">
          <div className="brand-badge">V</div>
          <div>
            <h2 className="studio-title">VIRASYA ART STUDIO</h2>
            <p className="studio-subtitle">Indian Sacred Symmetry & Folk Art Simulator</p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mode-tabs">
          {MODES.map((m) => (
            <button
              key={m}
              className={`mode-tab ${mode === m ? "active" : ""}`}
              onClick={() => handleModeChange(m)}
            >
              <span className="mode-icon">
                {m === "Kolam" ? "☸️" : m === "Mandala" ? "🌸" : "✨"}
              </span>
              <span className="mode-label">{m} Mode</span>
            </button>
          ))}
        </div>

        {/* Actions (Undo, Redo, Clear, Close) */}
        <div className="header-actions">
          <button
            className="action-icon-btn"
            onClick={undo}
            disabled={historyStep <= 0}
            title="Undo (Ctrl+Z)"
          >
            ↩ Undo
          </button>
          <button
            className="action-icon-btn"
            onClick={redo}
            disabled={historyStep >= history.length - 1}
            title="Redo (Ctrl+Y)"
          >
            ↪ Redo
          </button>
          <button className="action-icon-btn danger" onClick={clearCanvas} title="Clear Canvas">
            🗑 Clear
          </button>
          {onClose && (
            <button className="close-btn" onClick={onClose} title="Close Studio">
              &times;
            </button>
          )}
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div className="art-studio-workspace">
        {/* Left Toolbar */}
        <aside className="art-studio-sidebar left">
          {/* Symmetrical Axes */}
          <div className="control-group">
            <label className="group-label">
              <span>Symmetry Points:</span>
              <strong className="value-badge">{symmetry}x</strong>
            </label>
            <div className="symmetry-presets">
              {[2, 4, 6, 8, 12, 16].map((num) => (
                <button
                  key={num}
                  className={`chip-btn ${symmetry === num ? "active" : ""}`}
                  onClick={() => setSymmetry(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            <input
              type="range"
              min="2"
              max="24"
              step="2"
              value={symmetry}
              onChange={(e) => setSymmetry(parseInt(e.target.value, 10))}
              className="studio-slider"
            />
          </div>

          {/* Mirror Symmetry Toggle */}
          <div className="control-group">
            <label className="checkbox-control">
              <input
                type="checkbox"
                checked={mirror}
                onChange={(e) => setMirror(e.target.checked)}
              />
              <span>🪞 Bilateral Mirror Reflection</span>
            </label>
          </div>

          {/* Brush Styles */}
          <div className="control-group">
            <label className="group-label">Brush Technique</label>
            <div className="brush-grid">
              {BRUSH_STYLES.map((b) => (
                <button
                  key={b.id}
                  className={`brush-chip ${brushStyle === b.id ? "active" : ""}`}
                  onClick={() => setBrushStyle(b.id)}
                >
                  <span className="b-icon">{b.icon}</span>
                  <span className="b-name">{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brush Size */}
          <div className="control-group">
            <label className="group-label">
              <span>Stroke Size:</span>
              <strong className="value-badge">{brushSize}px</strong>
            </label>
            <input
              type="range"
              min="1"
              max="40"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
              className="studio-slider"
            />
          </div>

          {/* Canvas Background Theme */}
          <div className="control-group">
            <label className="group-label">Canvas Surface</label>
            <div className="theme-chips">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`theme-chip ${theme === t.id ? "active" : ""}`}
                  onClick={() => {
                    setTheme(t.id);
                    resetCanvasBg(t.bg);
                  }}
                >
                  <span className="theme-color-dot" style={{ background: t.bg }} />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Canvas Area */}
        <main className="art-canvas-viewport">
          <div className="canvas-wrapper">
            {/* Main Drawing Canvas */}
            <canvas
              ref={canvasRef}
              className="drawing-canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />

            {/* Non-destructive Overlay Guide Canvas */}
            <canvas ref={guideCanvasRef} className="guide-canvas-overlay" />
          </div>

          {/* Canvas Bottom Mini-Bar */}
          <div className="canvas-bottom-bar">
            <label className="checkbox-control">
              <input
                type="checkbox"
                checked={showGuides}
                onChange={(e) => setShowGuides(e.target.checked)}
              />
              <span>📐 Show Symmetry Guides</span>
            </label>

            <span className="mode-desc-tag">
              {mode === "Kolam" && "☸️ Dot Matrix (Pulli Kolam) • Sacred Geometric Loops"}
              {mode === "Mandala" && "🌸 Radial Mandala • Cosmic Equilibrium & Meditation"}
              {mode === "Rangoli" && "✨ Festive Rangoli • Auspicious Doorway & Floral Petals"}
            </span>
          </div>
        </main>

        {/* Right Toolbar */}
        <aside className="art-studio-sidebar right">
          {/* Indian Heritage Color Palette */}
          <div className="control-group">
            <label className="group-label">Indian Heritage Colors</label>
            <div className="color-palette-grid">
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  className={`color-swatch ${color === c.hex ? "active" : ""}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setColor(c.hex)}
                  title={c.name}
                />
              ))}
            </div>

            {/* Custom Color Input */}
            <div className="custom-color-picker">
              <input
                type="color"
                id="customColor"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="color-input-native"
              />
              <label htmlFor="customColor" className="custom-color-label">
                <span className="custom-preview" style={{ background: color }} />
                <span>Custom Tint: <strong>{color.toUpperCase()}</strong></span>
              </label>
            </div>
          </div>

          {/* Sacred Templates */}
          <div className="control-group">
            <label className="group-label">Starter Templates</label>
            <div className="template-buttons">
              <button className="template-btn" onClick={() => loadTemplate("lotus")}>
                🌸 Lotus Bloom Mandala
              </button>
              <button className="template-btn" onClick={() => loadTemplate("sikku")}>
                ☸️ Sikku Kolam Knot
              </button>
              <button className="template-btn" onClick={() => loadTemplate("rangoli")}>
                🪔 Diwali Star Rangoli
              </button>
            </div>
          </div>

          {/* Export Center */}
          <div className="control-group export-section">
            <label className="group-label">Save & Share</label>
            <button
              className="export-btn primary"
              onClick={() => exportArtwork(true)}
            >
              📥 Export Artwork (PNG)
            </button>
            <button
              className="export-btn secondary"
              onClick={() => exportArtwork(false)}
            >
              🖼 Save Pure Image
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
