const $ = (id) => document.getElementById(id);

const app = {
  width: 1080,
  height: 648,
  zoom: 1,
  tool: "select",
  shape: "line",
  primary: "#000000",
  secondary: "#ffffff",
  activeColor: "primary",
  size: 6,
  opacity: 1,
  brushType: "round",
  fillMode: "none",
  outlineMode: "stroke",
  textFont: "Calibri",
  textSize: 26,
  textBold: true,
  textItalic: false,
  textUnderline: false,
  textStrike: false,
  textAlign: "left",
  textBgFill: false,
  textDrag: null,
  textBoxClipboard: null,
  layers: [],
  activeLayer: 0,
  undo: [],
  redo: [],
  drawing: false,
  dragStart: null,
  lastPoint: null,
  previewPoint: null,
  pointerInsideCanvas: false,
  selection: null,
  selectionMode: "rect",
  selectionDrag: null,
  lassoPoints: [],
  floatingSelection: null,
  canvasResize: null,
  clipboard: null,
  transparentBg: false,
  showGrid: false,
  dirty: false
};

const els = {
  composite: $("compositeCanvas"),
  overlay: $("overlayCanvas"),
  shell: $("canvasShell"),
  stage: $("stageWrap"),
  textEditor: $("textEditor"),
  fileInput: $("fileInput"),
  projectInput: $("projectInput"),
  palette: $("palette"),
  layerList: $("layerList"),
  layersPanel: $("layersPanel"),
  brushPreview: $("brushPreview"),
  textToolbar: $("textToolbar")
};

const ctx = els.composite.getContext("2d", { willReadFrequently: true });
const octx = els.overlay.getContext("2d", { willReadFrequently: true });

const palette = [
  "#000000", "#737373", "#9b002d", "#ed1c24", "#ff7f27", "#fff200", "#22b14c", "#00a2e8", "#3f48cc", "#a349a4",
  "#ffffff", "#c8c8c8", "#b97a57", "#ffaec9", "#ffc90e", "#efe4b0", "#b5e61d", "#99d9ea", "#7092be", "#c8bfe7",
  "#7f7f7f", "#bcbcbc", "#880015", "#ff6961", "#ffb347", "#fdfd96", "#77dd77", "#5dade2", "#7868e6", "#c27ba0",
  "#f4f4f4", "#d8d8d8", "#a0a0a0", "#6f6f6f", "#444444", "#2a2a2a", "#d0ece7", "#fadbd8", "#fdebd0", "#d6eaf8"
];

const shapes = [
  ["line", "/"], ["curve", "~"], ["ellipse", "O"], ["rect", "□"], ["roundrect", "▢"], ["triangle", "△"], ["righttri", "◺"],
  ["diamond", "◇"], ["pentagon", "⬟"], ["hexagon", "⬢"], ["arrowR", "→"], ["arrowL", "←"], ["arrowU", "↑"], ["arrowD", "↓"],
  ["star4", "✦"], ["star5", "☆"], ["star6", "✶"], ["callout", "▱"], ["bubble", "☏"], ["heart", "♡"]
];

function makeCanvas(w = app.width, h = app.height) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

function newLayer(name = `?덉씠??${app.layers.length + 1}`, fillWhite = false) {
  const canvas = makeCanvas();
  const layerCtx = canvas.getContext("2d", { willReadFrequently: true });
  if (fillWhite) {
    layerCtx.fillStyle = "#fff";
    layerCtx.fillRect(0, 0, canvas.width, canvas.height);
  }
  return { name, canvas, visible: true, opacity: 1 };
}

function init() {
  app.layers = [newLayer("諛곌꼍", true)];
  app.activeLayer = 0;
  buildPalette();
  buildShapes();
  bindUI();
  setTool("select");
  saveState();
  render();
  updateAll();
}

function buildPalette() {
  els.palette.innerHTML = "";
  palette.forEach((color) => {
    const swatch = document.createElement("button");
    swatch.className = "swatch";
    swatch.style.background = color;
    swatch.title = color;
    swatch.addEventListener("click", (event) => setColor(color, event.button === 2 || app.activeColor === "secondary"));
    swatch.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      setColor(color, true);
    });
    els.palette.appendChild(swatch);
  });
}

function buildShapes() {
  const grid = $("shapeGrid");
  shapes.forEach(([name, glyph]) => {
    const btn = document.createElement("button");
    btn.className = "shape-btn";
    btn.dataset.shape = name;
    btn.textContent = glyph;
    btn.title = name;
    btn.addEventListener("click", () => {
      app.shape = name;
      setTool("shape");
      updateToolButtons();
    });
    grid.appendChild(btn);
  });
}

function bindUI() {
  document.querySelectorAll(".tool, .large-tool[data-tool]").forEach((btn) => {
    btn.addEventListener("click", () => setTool(btn.dataset.tool));
  });

  $("primaryColorBtn").addEventListener("click", () => { app.activeColor = "primary"; updateColorButtons(); });
  $("secondaryColorBtn").addEventListener("click", () => { app.activeColor = "secondary"; updateColorButtons(); });
  $("customColor").addEventListener("input", (e) => setColor(e.target.value, app.activeColor === "secondary"));

  syncRange("sizeInput", "sideSize", (value) => { app.size = Number(value); refreshBrushPreview(); });
  syncRange("opacityInput", "sideOpacity", (value) => { app.opacity = Number(value) / 100; refreshBrushPreview(); });
  $("brushType").addEventListener("change", (e) => { app.brushType = e.target.value; });
  bindTextToolbar();
  $("fillMode").addEventListener("change", (e) => { app.fillMode = e.target.value; });
  $("outlineMode").addEventListener("change", (e) => { app.outlineMode = e.target.value; });
  $("layerOpacity").addEventListener("input", (e) => {
    currentLayer().opacity = Number(e.target.value) / 100;
    render();
    renderLayers();
  });

  els.overlay.addEventListener("pointerdown", pointerDown);
  els.overlay.addEventListener("pointerenter", pointerEnter);
  els.overlay.addEventListener("pointermove", pointerMove);
  els.overlay.addEventListener("pointerup", pointerUp);
  els.overlay.addEventListener("pointerleave", pointerLeave);
  els.overlay.addEventListener("contextmenu", (e) => e.preventDefault());
  document.querySelectorAll(".resize-handles [data-handle]").forEach((handle) => {
    handle.addEventListener("pointerdown", startCanvasResize);
  });
  window.addEventListener("pointermove", moveCanvasResize);
  window.addEventListener("pointerup", endCanvasResize);

  $("undoBtn").addEventListener("click", undo);
  $("redoBtn").addEventListener("click", redo);
  $("clearBtn").addEventListener("click", clearLayer);
  $("cropBtn").addEventListener("click", cropToSelection);
  $("resizeBtn").addEventListener("click", openResize);
  $("applyResizeBtn").addEventListener("click", applyResize);
  $("rotateLeftBtn").addEventListener("click", () => rotateCanvas(-90));
  $("rotateRightBtn").addEventListener("click", () => rotateCanvas(90));
  $("flipHBtn").addEventListener("click", () => flipCanvas("h"));
  $("flipVBtn").addEventListener("click", () => flipCanvas("v"));
  $("removeBgBtn").addEventListener("click", removeBackground);
  $("aiBtn").addEventListener("click", () => $("aiDialog").showModal());
  $("softenBtn").addEventListener("click", () => filterImage("soften"));
  $("sharpenBtn").addEventListener("click", () => filterImage("sharpen"));
  $("pixelateBtn").addEventListener("click", () => filterImage("pixelate"));

  $("layersBtn").addEventListener("click", () => els.layersPanel.classList.toggle("hidden"));
  $("closeLayersBtn").addEventListener("click", () => els.layersPanel.classList.add("hidden"));
  $("addLayerBtn").addEventListener("click", addLayer);
  $("duplicateLayerBtn").addEventListener("click", duplicateLayer);
  $("deleteLayerBtn").addEventListener("click", deleteLayer);
  $("mergeLayerBtn").addEventListener("click", mergeLayerDown);

  bindMenus();
  bindFileActions();
  bindZoom();
  bindKeyboard();
}

function syncRange(a, b, cb) {
  const one = $(a);
  const two = $(b);
  const handler = (e) => {
    one.value = e.target.value;
    two.value = e.target.value;
    cb(e.target.value);
  };
  one.addEventListener("input", handler);
  two.addEventListener("input", handler);
}

function bindTextToolbar() {
  $("textFont").addEventListener("change", (event) => {
    app.textFont = event.target.value;
    updateTextEditorStyle();
  });
  $("textSize").addEventListener("input", (event) => {
    app.textSize = clamp(Number(event.target.value) || app.textSize, 1, 300);
    updateTextEditorStyle();
  });
  $("textBold").addEventListener("click", () => toggleTextFormat("textBold"));
  $("textItalic").addEventListener("click", () => toggleTextFormat("textItalic"));
  $("textUnderline").addEventListener("click", () => toggleTextFormat("textUnderline"));
  $("textStrike").addEventListener("click", () => toggleTextFormat("textStrike"));
  $("textAlignLeft").addEventListener("click", () => setTextAlign("left"));
  $("textAlignCenter").addEventListener("click", () => setTextAlign("center"));
  $("textAlignRight").addEventListener("click", () => setTextAlign("right"));
  $("textBgFill").addEventListener("change", (event) => {
    app.textBgFill = event.target.checked;
    updateTextEditorStyle();
  });
}

function toggleTextFormat(key) {
  app[key] = !app[key];
  updateTextToolbar();
  updateTextEditorStyle();
}

function setTextAlign(value) {
  app.textAlign = value;
  updateTextToolbar();
  updateTextEditorStyle();
}

function updateTextToolbar() {
  $("textFont").value = app.textFont;
  $("textSize").value = `${app.textSize}`;
  $("textBold").classList.toggle("active", app.textBold);
  $("textItalic").classList.toggle("active", app.textItalic);
  $("textUnderline").classList.toggle("active", app.textUnderline);
  $("textStrike").classList.toggle("active", app.textStrike);
  $("textAlignLeft").classList.toggle("active", app.textAlign === "left");
  $("textAlignCenter").classList.toggle("active", app.textAlign === "center");
  $("textAlignRight").classList.toggle("active", app.textAlign === "right");
  $("textBgFill").checked = app.textBgFill;
}

function bindMenus() {
  const pairs = [
    ["fileMenuBtn", "fileMenu"],
    ["editMenuBtn", "editMenu"],
    ["viewMenuBtn", "viewMenu"]
  ];
  pairs.forEach(([btnId, menuId]) => {
    $(btnId).addEventListener("click", (event) => {
      closeMenus(menuId);
      const menu = $(menuId);
      const rect = event.currentTarget.getBoundingClientRect();
      menu.style.left = `${rect.left}px`;
      menu.style.top = `${rect.bottom + 4}px`;
      menu.classList.toggle("open");
    });
  });
  document.querySelectorAll(".large-tool[data-tool='select']").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      setTool("select");
      closeMenus("selectMenu");
      const menu = $("selectMenu");
      const rect = event.currentTarget.getBoundingClientRect();
      menu.style.left = `${rect.left}px`;
      menu.style.top = `${rect.bottom + 6}px`;
      menu.classList.toggle("open");
    });
  });
  $("brushMenuBtn").addEventListener("click", (event) => {
    setTool("brush");
    closeMenus("brushMenu");
    const menu = $("brushMenu");
    const rect = event.currentTarget.getBoundingClientRect();
    menu.style.left = `${rect.left}px`;
    menu.style.top = `${rect.bottom + 6}px`;
    menu.classList.toggle("open");
  });
  document.querySelectorAll("#brushMenu [data-brush]").forEach((button) => {
    button.addEventListener("click", () => {
      setBrushType(button.dataset.brush);
      closeMenus();
    });
  });
  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".dropdown") && !event.target.closest(".menubar") && !event.target.closest(".large-tool[data-tool='select']") && !event.target.closest("#brushMenuBtn")) closeMenus();
  });
}

function closeMenus(except) {
  document.querySelectorAll(".dropdown").forEach((menu) => {
    if (menu.id !== except) menu.classList.remove("open");
  });
}

function bindFileActions() {
  $("openBtn").addEventListener("click", () => els.fileInput.click());
  $("openFileMenuBtn").addEventListener("click", () => els.fileInput.click());
  $("importImageBtn").addEventListener("click", () => els.fileInput.click());
  $("saveBtn").addEventListener("click", () => saveImage("png"));
  $("savePngBtn").addEventListener("click", () => saveImage("png"));
  $("saveJpegBtn").addEventListener("click", () => saveImage("jpeg"));
  $("saveWebpBtn").addEventListener("click", () => saveImage("webp"));
  $("saveProjectBtn").addEventListener("click", saveProject);
  $("openProjectBtn").addEventListener("click", () => els.projectInput.click());
  $("newFileBtn").addEventListener("click", newFile);
  els.fileInput.addEventListener("change", openImage);
  els.projectInput.addEventListener("change", openProject);

  $("copyBtn").addEventListener("click", copySelection);
  $("pasteBtn").addEventListener("click", pasteSelection);
  $("cutBtn").addEventListener("click", cutSelection);
  $("selectAllBtn").addEventListener("click", selectAll);
  $("rectSelectBtn").addEventListener("click", () => { app.selectionMode = "rect"; setTool("select"); closeMenus(); });
  $("freeSelectBtn").addEventListener("click", () => { app.selectionMode = "free"; setTool("select"); closeMenus(); });
  $("selectAllMenuBtn").addEventListener("click", () => { selectAll(); closeMenus(); });
  $("transparentSelectionBtn").addEventListener("click", () => { app.transparentSelection = !app.transparentSelection; closeMenus(); });
  $("deleteSelectionBtn").addEventListener("click", () => { clearSelection(); closeMenus(); });
  $("invertBtn").addEventListener("click", () => filterImage("invert"));
  $("grayscaleBtn").addEventListener("click", () => filterImage("grayscale"));
  $("toggleGridBtn").addEventListener("click", toggleGrid);
  $("toggleTransparentBtn").addEventListener("click", toggleTransparent);
  $("actualSizeBtn").addEventListener("click", () => setZoom(100));
  $("fullscreenBtn").addEventListener("click", () => document.documentElement.requestFullscreen?.());
  $("helpBtn").addEventListener("click", () => alert("??洹몃┝?? Ctrl+Z/Y, Ctrl+C/V/X, Delete, Shift濡??뺣퉬???꾪삎, ?고겢由?? ??2瑜??ъ슜?⑸땲??"));
  $("settingsBtn").addEventListener("click", () => els.shell.classList.toggle("pixelated"));
}

function bindZoom() {
  $("zoomSlider").addEventListener("input", (e) => setZoom(Number(e.target.value)));
  $("zoomSelect").addEventListener("change", (e) => setZoom(parseInt(e.target.value, 10)));
  $("zoomInBtn").addEventListener("click", () => setZoom(Math.min(400, Math.round(app.zoom * 100) + 25)));
  $("zoomOutBtn").addEventListener("click", () => setZoom(Math.max(25, Math.round(app.zoom * 100) - 25)));
  $("fitBtn").addEventListener("click", fitZoom);
}

function bindKeyboard() {
  document.addEventListener("keydown", (event) => {
    if (event.target === els.textEditor) return;
    const key = event.key.toLowerCase();
    if (event.ctrlKey && key === "z") { event.preventDefault(); undo(); }
    if (event.ctrlKey && key === "y") { event.preventDefault(); redo(); }
    if (event.ctrlKey && key === "s") { event.preventDefault(); saveImage("png"); }
    if (event.ctrlKey && key === "o") { event.preventDefault(); els.fileInput.click(); }
    if (event.ctrlKey && key === "c") { event.preventDefault(); copySelection(); }
    if (event.ctrlKey && key === "x") { event.preventDefault(); cutSelection(); }
    if (event.ctrlKey && key === "v") { event.preventDefault(); pasteSelection(); }
    if (event.key === "Delete") clearSelection();
    if (["p", "b", "e", "f", "t", "i", "s"].includes(key) && !event.ctrlKey) {
      const map = { p: "pencil", b: "brush", e: "eraser", f: "fill", t: "text", i: "eyedropper", s: "select" };
      setTool(map[key]);
    }
  });
}

function currentLayer() {
  return app.layers[app.activeLayer];
}

function currentCtx() {
  return currentLayer().canvas.getContext("2d", { willReadFrequently: true });
}

function setTool(tool) {
  commitText();
  app.tool = tool;
  updateToolButtons();
  updateTextToolUI();
  updateOverlayCursor(app.previewPoint);
  refreshBrushPreview();
}

function updateToolButtons() {
  document.querySelectorAll(".tool, .large-tool[data-tool]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tool === app.tool);
  });
  document.querySelectorAll(".shape-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.shape === app.shape && app.tool === "shape");
  });
  document.querySelectorAll("#brushMenu [data-brush]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.brush === app.brushType);
  });
}

function setBrushType(type) {
  app.brushType = type;
  if ($("brushType")) $("brushType").value = type;
  setTool("brush");
  updateToolButtons();
  refreshBrushPreview();
}

function updateTextToolUI() {
  els.textToolbar.classList.toggle("open", app.tool === "text");
  updateTextToolbar();
}

function setColor(color, secondary = false) {
  if (secondary) app.secondary = color;
  else app.primary = color;
  $("customColor").value = color;
  updateColorButtons();
  updateTextEditorStyle();
  refreshBrushPreview();
}

function getDrawColor(event) {
  return event && event.button === 2 ? app.secondary : app.primary;
}

function updateColorButtons() {
  $("primaryColorBtn").style.background = app.primary;
  $("secondaryColorBtn").style.background = app.secondary;
  $("primaryColorBtn").classList.toggle("selected", app.activeColor === "primary");
  $("secondaryColorBtn").classList.toggle("selected", app.activeColor === "secondary");
}

function pointerPos(event) {
  const rect = els.overlay.getBoundingClientRect();
  return {
    x: clamp(Math.round((event.clientX - rect.left) / app.zoom), 0, app.width),
    y: clamp(Math.round((event.clientY - rect.top) / app.zoom), 0, app.height)
  };
}

function pointerPosUnclamped(event) {
  const rect = els.overlay.getBoundingClientRect();
  return {
    x: Math.round((event.clientX - rect.left) / app.zoom),
    y: Math.round((event.clientY - rect.top) / app.zoom)
  };
}

function pointerEnter(event) {
  app.pointerInsideCanvas = true;
  app.previewPoint = pointerPos(event);
  refreshBrushPreview();
}

function pointerLeave(event) {
  app.pointerInsideCanvas = false;
  hideBrushPreview();
  pointerUp(event);
}

function brushPreviewTool() {
  return ["pencil", "brush", "eraser"].includes(app.tool);
}

function refreshBrushPreview() {
  if (!brushPreviewTool() || !app.pointerInsideCanvas || app.drawing || !app.previewPoint) {
    hideBrushPreview();
    return;
  }
  const size = Math.max(1, app.size);
  const preview = els.brushPreview;
  preview.style.display = "block";
  preview.style.width = `${size}px`;
  preview.style.height = `${size}px`;
  preview.style.transform = `translate(${app.previewPoint.x - size / 2}px, ${app.previewPoint.y - size / 2}px)`;
  preview.style.opacity = "1";
  if (app.tool === "eraser") {
    preview.style.background = "rgba(255,255,255,0.85)";
    preview.style.borderColor = "rgba(17,24,39,0.55)";
    preview.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.9), 0 0 0 2px rgba(17,24,39,0.25)";
  } else {
    const color = hexToRgba(app.primary, app.opacity);
    preview.style.background = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${app.opacity})`;
    preview.style.borderColor = "rgba(255,255,255,0.9)";
    preview.style.boxShadow = "0 0 0 1px rgba(0,0,0,0.22)";
  }
}

function hideBrushPreview() {
  if (els.brushPreview) els.brushPreview.style.display = "none";
}

function pointerDown(event) {
  els.overlay.setPointerCapture(event.pointerId);
  const pos = pointerPos(event);
  hideBrushPreview();
  app.drawing = true;
  app.dragStart = pos;
  app.lastPoint = pos;
  app.drawColor = getDrawColor(event);

  if (app.tool === "select") {
    const handle = hitFloatingHandle(pos);
    if (handle) {
      app.selectionDrag = {
        type: "resize",
        handle,
        startX: pos.x,
        startY: pos.y,
        original: { ...app.floatingSelection }
      };
      return;
    }
    if (hitFloatingSelection(pos)) {
      app.selectionDrag = {
        type: "move",
        offsetX: pos.x - app.floatingSelection.x,
        offsetY: pos.y - app.floatingSelection.y
      };
      return;
    }
    commitFloatingSelection();
    if (app.selectionMode === "free") {
      app.lassoPoints = [pos];
    }
  } else {
    commitFloatingSelection();
  }

  if (app.tool === "fill") {
    saveState();
    floodFill(pos.x, pos.y, hexToRgba(app.drawColor, app.opacity));
    finishChange();
    return;
  }
  if (app.tool === "eyedropper") {
    pickColor(pos, event.button === 2);
    app.drawing = false;
    return;
  }
  if (app.tool === "magnifier") {
    setZoom(event.button === 2 ? Math.max(25, app.zoom * 100 - 25) : Math.min(400, app.zoom * 100 + 25));
    app.drawing = false;
    return;
  }
  if (app.tool === "text") {
    return;
  }
  if (["pencil", "brush", "eraser"].includes(app.tool)) {
    saveState();
    drawPoint(pos, event);
  }
}

function pointerMove(event) {
  const pos = pointerPos(event);
  app.pointerInsideCanvas = true;
  app.previewPoint = pos;
  $("pointerStatus").textContent = `${pos.x}, ${pos.y}px`;
  updateOverlayCursor(pos);
  if (!app.drawing) {
    refreshBrushPreview();
    return;
  }

  clearOverlay();
  if (app.selectionDrag?.type === "resize") {
    resizeFloatingSelection(pos);
  } else if (app.selectionDrag?.type === "move") {
    moveFloatingSelection(pos);
  } else if (["pencil", "brush", "eraser"].includes(app.tool)) {
    drawStroke(app.lastPoint, pos, event);
    app.lastPoint = pos;
    render();
  } else if (app.tool === "select") {
    if (app.selectionMode === "free") {
      app.lassoPoints.push(pos);
      drawLasso(app.lassoPoints);
    } else {
      app.selection = normalizeRect(app.dragStart, pos);
      drawSelection(app.selection);
    }
    updateSelectionStatus();
  } else if (app.tool === "shape") {
    const rect = normalizeRect(app.dragStart, constrainPoint(pos, event.shiftKey));
    drawShape(octx, app.shape, rect, true);
  } else if (app.tool === "text") {
    app.selection = normalizeRect(app.dragStart, pos);
    drawTextBoxPreview(app.selection);
  }
}

function pointerUp(event) {
  if (!app.drawing) return;
  app.drawing = false;
  const pos = pointerPos(event);

  if (app.selectionDrag?.type === "resize") {
    app.selectionDrag = null;
    drawSelection(app.selection, true);
    updateSelectionStatus();
  } else if (app.selectionDrag?.type === "move") {
    app.selectionDrag = null;
    drawSelection(app.selection, true);
    updateSelectionStatus();
  } else if (["pencil", "brush", "eraser"].includes(app.tool)) {
    finishChange();
  } else if (app.tool === "shape") {
    saveState();
    const rect = normalizeRect(app.dragStart, constrainPoint(pos, event.shiftKey));
    clearOverlay();
    createFloatingShape(rect);
  } else if (app.tool === "text") {
    clearOverlay();
    let rect = normalizeRect(app.dragStart, pos);
    if (rect.w < 8 || rect.h < 8) rect = { x: pos.x, y: pos.y, w: 460, h: 116 };
    openTextEditor(rect);
  } else if (app.tool === "select") {
    clearOverlay();
    if (app.selectionMode === "free") {
      app.lassoPoints.push(pos);
      app.selection = selectionFromLasso(app.lassoPoints);
    } else {
      app.selection = normalizeRect(app.dragStart, pos);
    }
    if (app.selection && (app.selection.w < 2 || app.selection.h < 2)) app.selection = null;
    if (app.selection) {
      createFloatingSelectionFromSelection(app.selection);
    } else {
      drawSelection(app.selection);
      updateSelectionStatus();
    }
  }
  refreshBrushPreview();
}

function drawPoint(pos, event) {
  drawStroke(pos, { x: pos.x + 0.1, y: pos.y + 0.1 }, event);
}

function drawStroke(from, to, event) {
  const layerCtx = currentCtx();
  layerCtx.save();
  layerCtx.globalAlpha = app.tool === "eraser" ? 1 : app.opacity;
  layerCtx.lineCap = ["flat", "calligraphy", "calligraphyPen"].includes(app.brushType) ? "butt" : "round";
  layerCtx.lineJoin = "round";
  layerCtx.lineWidth = app.size;

  if (app.tool === "eraser") {
    layerCtx.globalCompositeOperation = app.transparentBg ? "destination-out" : "source-over";
    layerCtx.strokeStyle = app.transparentBg ? "rgba(0,0,0,1)" : app.secondary;
  } else {
    layerCtx.globalCompositeOperation = "source-over";
    layerCtx.strokeStyle = getBrushPattern(layerCtx, app.drawColor);
  }

  if (app.brushType === "spray" && app.tool !== "pencil" && app.tool !== "eraser") {
    spray(layerCtx, to, app.drawColor);
  } else if (app.brushType === "airbrush" && app.tool !== "pencil" && app.tool !== "eraser") {
    airbrush(layerCtx, to, app.drawColor);
  } else if (app.brushType === "oil" && app.tool !== "pencil" && app.tool !== "eraser") {
    texturedStroke(layerCtx, from, to, app.drawColor, { strands: 7, jitter: app.size * 0.16, alpha: 0.18, width: 0.35 });
  } else if (app.brushType === "crayon" && app.tool !== "pencil" && app.tool !== "eraser") {
    texturedStroke(layerCtx, from, to, app.drawColor, { strands: 11, jitter: app.size * 0.26, alpha: 0.12, width: 0.18, gaps: true });
  } else if (app.brushType === "pencil" && app.tool !== "eraser") {
    texturedStroke(layerCtx, from, to, app.drawColor, { strands: 5, jitter: app.size * 0.12, alpha: 0.2, width: 0.12, gaps: true });
  } else if (app.brushType === "watercolor" && app.tool !== "pencil" && app.tool !== "eraser") {
    watercolorStroke(layerCtx, from, to, app.drawColor);
  } else {
    layerCtx.beginPath();
    layerCtx.moveTo(from.x, from.y);
    if (app.brushType === "calligraphy" || app.brushType === "calligraphyPen") {
      layerCtx.lineWidth = Math.max(1, app.size * (app.brushType === "calligraphyPen" ? 0.82 : 0.58));
      layerCtx.translate(to.x, to.y);
      layerCtx.rotate(-0.72);
      layerCtx.translate(-to.x, -to.y);
    }
    layerCtx.lineTo(to.x, to.y);
    layerCtx.stroke();
  }
  layerCtx.restore();
}

function getBrushPattern(layerCtx, color) {
  if (app.brushType !== "marker") return color;
  const gradient = layerCtx.createLinearGradient(0, 0, app.size * 3, app.size * 3);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, rgbaString(color, 0.38));
  return gradient;
}

function drawSegment(ctx, from, to) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

function texturedStroke(ctx, from, to, color, options) {
  const strands = options.strands;
  const normal = segmentNormal(from, to);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  for (let i = 0; i < strands; i += 1) {
    if (options.gaps && Math.random() < 0.22) continue;
    const offset = (Math.random() - 0.5) * app.size;
    const jitter = options.jitter;
    ctx.globalAlpha = app.opacity * (options.alpha + Math.random() * options.alpha);
    ctx.lineWidth = Math.max(1, app.size * options.width * (0.45 + Math.random()));
    drawSegment(ctx, {
      x: from.x + normal.x * offset + (Math.random() - 0.5) * jitter,
      y: from.y + normal.y * offset + (Math.random() - 0.5) * jitter
    }, {
      x: to.x + normal.x * offset + (Math.random() - 0.5) * jitter,
      y: to.y + normal.y * offset + (Math.random() - 0.5) * jitter
    });
  }
  ctx.restore();
}

function watercolorStroke(ctx, from, to, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.globalAlpha = app.opacity * 0.22;
  for (let i = 0; i < 5; i += 1) {
    ctx.lineWidth = app.size * (1.1 + i * 0.18);
    ctx.globalAlpha = app.opacity * (0.08 + i * 0.025);
    drawSegment(ctx, from, to);
  }
  ctx.restore();
}

function airbrush(ctx, pos, color) {
  const dots = Math.max(20, app.size * 3);
  ctx.fillStyle = color;
  for (let i = 0; i < dots; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * app.size * 1.4;
    ctx.globalAlpha = app.opacity * 0.18 * Math.random();
    ctx.beginPath();
    ctx.arc(pos.x + Math.cos(angle) * radius, pos.y + Math.sin(angle) * radius, Math.max(0.7, app.size * 0.025), 0, Math.PI * 2);
    ctx.fill();
  }
}

function segmentNormal(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: -dy / length, y: dx / length };
}

function spray(layerCtx, pos, color) {
  const dots = Math.max(12, app.size * 2);
  layerCtx.fillStyle = color;
  for (let i = 0; i < dots; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * app.size;
    layerCtx.globalAlpha = app.opacity * Math.random();
    layerCtx.fillRect(pos.x + Math.cos(angle) * radius, pos.y + Math.sin(angle) * radius, 1, 1);
  }
}

function drawShape(targetCtx, shape, rect, preview) {
  targetCtx.save();
  targetCtx.lineWidth = app.size;
  targetCtx.lineJoin = "round";
  targetCtx.lineCap = "round";
  targetCtx.globalAlpha = app.opacity;
  targetCtx.strokeStyle = app.primary;
  targetCtx.fillStyle = app.secondary;
  if (preview) targetCtx.setLineDash([6, 4]);
  targetCtx.beginPath();
  pathShape(targetCtx, shape, rect);
  if (app.fillMode === "fill") targetCtx.fill();
  if (app.outlineMode !== "none") targetCtx.stroke();
  targetCtx.restore();
}

function pathShape(c, shape, r) {
  const x = r.x, y = r.y, w = r.w, h = r.h;
  const cx = x + w / 2, cy = y + h / 2;
  if (shape === "line") { c.moveTo(x, y); c.lineTo(x + w, y + h); return; }
  if (shape === "curve") { c.moveTo(x, y + h); c.bezierCurveTo(x + w * 0.2, y, x + w * 0.8, y + h, x + w, y); return; }
  if (shape === "ellipse") { c.ellipse(cx, cy, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2); return; }
  if (shape === "rect") { c.rect(x, y, w, h); return; }
  if (shape === "roundrect") { roundRect(c, x, y, w, h, Math.min(Math.abs(w), Math.abs(h)) * 0.18); return; }
  if (shape === "triangle") return polygon(c, [[cx, y], [x + w, y + h], [x, y + h]]);
  if (shape === "righttri") return polygon(c, [[x, y], [x + w, y + h], [x, y + h]]);
  if (shape === "diamond") return polygon(c, [[cx, y], [x + w, cy], [cx, y + h], [x, cy]]);
  if (shape === "pentagon") return regularPolygon(c, cx, cy, Math.min(Math.abs(w), Math.abs(h)) / 2, 5, -Math.PI / 2);
  if (shape === "hexagon") return regularPolygon(c, cx, cy, Math.min(Math.abs(w), Math.abs(h)) / 2, 6, Math.PI / 6);
  if (shape === "star4") return star(c, cx, cy, Math.min(Math.abs(w), Math.abs(h)) / 2, 4);
  if (shape === "star5") return star(c, cx, cy, Math.min(Math.abs(w), Math.abs(h)) / 2, 5);
  if (shape === "star6") return star(c, cx, cy, Math.min(Math.abs(w), Math.abs(h)) / 2, 6);
  if (shape.startsWith("arrow")) return arrow(c, shape, r);
  if (shape === "callout") return polygon(c, [[x, y], [x + w, y], [x + w, y + h * 0.72], [x + w * 0.62, y + h * 0.72], [x + w * 0.44, y + h], [x + w * 0.44, y + h * 0.72], [x, y + h * 0.72]]);
  if (shape === "bubble") { c.ellipse(cx, cy, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2); c.moveTo(x + w * 0.35, y + h * 0.82); c.lineTo(x + w * 0.18, y + h); c.lineTo(x + w * 0.5, y + h * 0.88); return; }
  if (shape === "heart") return heart(c, x, y, w, h);
}

function roundRect(c, x, y, w, h, radius) {
  const r = Math.min(radius, Math.abs(w) / 2, Math.abs(h) / 2);
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function polygon(c, points) {
  points.forEach(([x, y], index) => index ? c.lineTo(x, y) : c.moveTo(x, y));
  c.closePath();
}

function regularPolygon(c, cx, cy, radius, sides, rotation) {
  const pts = [];
  for (let i = 0; i < sides; i += 1) pts.push([cx + Math.cos(rotation + i * Math.PI * 2 / sides) * radius, cy + Math.sin(rotation + i * Math.PI * 2 / sides) * radius]);
  polygon(c, pts);
}

function star(c, cx, cy, radius, points) {
  const pts = [];
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 ? radius * 0.42 : radius;
    const a = -Math.PI / 2 + i * Math.PI / points;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  polygon(c, pts);
}

function arrow(c, shape, r) {
  const x = r.x, y = r.y, w = r.w, h = r.h;
  if (shape === "arrowR") return polygon(c, [[x, y + h * 0.35], [x + w * 0.62, y + h * 0.35], [x + w * 0.62, y], [x + w, y + h / 2], [x + w * 0.62, y + h], [x + w * 0.62, y + h * 0.65], [x, y + h * 0.65]]);
  if (shape === "arrowL") return polygon(c, [[x + w, y + h * 0.35], [x + w * 0.38, y + h * 0.35], [x + w * 0.38, y], [x, y + h / 2], [x + w * 0.38, y + h], [x + w * 0.38, y + h * 0.65], [x + w, y + h * 0.65]]);
  if (shape === "arrowU") return polygon(c, [[x + w * 0.35, y + h], [x + w * 0.35, y + h * 0.38], [x, y + h * 0.38], [x + w / 2, y], [x + w, y + h * 0.38], [x + w * 0.65, y + h * 0.38], [x + w * 0.65, y + h]]);
  return polygon(c, [[x + w * 0.35, y], [x + w * 0.35, y + h * 0.62], [x, y + h * 0.62], [x + w / 2, y + h], [x + w, y + h * 0.62], [x + w * 0.65, y + h * 0.62], [x + w * 0.65, y]]);
}

function heart(c, x, y, w, h) {
  c.moveTo(x + w / 2, y + h);
  c.bezierCurveTo(x - w * 0.05, y + h * 0.58, x, y + h * 0.15, x + w * 0.28, y + h * 0.15);
  c.bezierCurveTo(x + w * 0.42, y + h * 0.15, x + w * 0.5, y + h * 0.3, x + w / 2, y + h * 0.36);
  c.bezierCurveTo(x + w * 0.5, y + h * 0.3, x + w * 0.58, y + h * 0.15, x + w * 0.72, y + h * 0.15);
  c.bezierCurveTo(x + w, y + h * 0.15, x + w * 1.05, y + h * 0.58, x + w / 2, y + h);
}

function render() {
  ctx.clearRect(0, 0, app.width, app.height);
  if (!app.transparentBg) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, app.width, app.height);
  }
  app.layers.forEach((layer) => {
    if (!layer.visible) return;
    ctx.save();
    ctx.globalAlpha = layer.opacity;
    ctx.drawImage(layer.canvas, 0, 0);
    ctx.restore();
  });
  if (app.floatingSelection) {
    ctx.drawImage(app.floatingSelection.canvas, app.floatingSelection.x, app.floatingSelection.y, app.floatingSelection.w, app.floatingSelection.h);
  }
  if (app.selection) drawSelection(app.selection, !!app.floatingSelection);
}

function clearOverlay() {
  octx.clearRect(0, 0, app.width, app.height);
}

function drawSelection(rect, floating = false) {
  clearOverlay();
  if (!rect) return;
  octx.save();
  if (floating) {
    const shapeObject = app.floatingSelection?.kind === "shape";
    const lassoObject = app.floatingSelection?.path?.length;
    if (!shapeObject) {
      octx.fillStyle = "rgba(0, 103, 192, 0.08)";
      if (lassoObject) {
        traceSelectionPath(octx, rect, 0.5, 0.5);
        octx.closePath();
        octx.fill();
      } else {
        octx.fillRect(rect.x + 0.5, rect.y + 0.5, rect.w, rect.h);
      }
    }
    octx.strokeStyle = shapeObject ? "#111" : "#0067c0";
    octx.lineWidth = shapeObject ? 1 : 2;
    octx.setLineDash(shapeObject || lassoObject ? [6, 4] : []);
    if (lassoObject) {
      traceSelectionPath(octx, rect, 0.5, 0.5);
      octx.closePath();
      octx.stroke();
    } else {
      octx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.w, rect.h);
    }
    drawSelectionHandles(rect, shapeObject ? "#111" : "#0067c0");
  } else {
    octx.strokeStyle = "#111";
    octx.lineWidth = 1;
    octx.setLineDash([6, 4]);
    if (rect.path?.length) {
      traceSelectionPath(octx, rect, 0.5, 0.5);
      octx.closePath();
      octx.stroke();
    } else {
      octx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.w, rect.h);
    }
  }
  octx.restore();
}

function drawLasso(points) {
  clearOverlay();
  if (!points.length) return;
  octx.save();
  octx.strokeStyle = "#111";
  octx.lineWidth = 1;
  octx.setLineDash([6, 4]);
  octx.beginPath();
  octx.moveTo(points[0].x + 0.5, points[0].y + 0.5);
  points.slice(1).forEach((point) => octx.lineTo(point.x + 0.5, point.y + 0.5));
  octx.stroke();
  octx.restore();
}

function selectionFromLasso(points) {
  if (points.length < 3) return null;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const x = clamp(Math.min(...xs), 0, app.width);
  const y = clamp(Math.min(...ys), 0, app.height);
  const maxX = clamp(Math.max(...xs), 0, app.width);
  const maxY = clamp(Math.max(...ys), 0, app.height);
  return { x, y, w: maxX - x, h: maxY - y, path: points.map((point) => ({ x: point.x - x, y: point.y - y })) };
}

function traceSelectionPath(ctx, selection, offsetX = 0, offsetY = 0) {
  const scaleX = selection.pathBaseW ? selection.w / selection.pathBaseW : 1;
  const scaleY = selection.pathBaseH ? selection.h / selection.pathBaseH : 1;
  ctx.beginPath();
  ctx.moveTo(selection.x + selection.path[0].x * scaleX + offsetX, selection.y + selection.path[0].y * scaleY + offsetY);
  selection.path.slice(1).forEach((point) => {
    ctx.lineTo(selection.x + point.x * scaleX + offsetX, selection.y + point.y * scaleY + offsetY);
  });
}

function traceLocalSelectionPath(ctx, selection) {
  ctx.beginPath();
  ctx.moveTo(selection.path[0].x, selection.path[0].y);
  selection.path.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
}

function drawSelectionHandles(rect, stroke = "#0067c0") {
  const size = Math.max(6, Math.round(7 / app.zoom));
  const half = size / 2;
  const points = [
    [rect.x, rect.y],
    [rect.x + rect.w / 2, rect.y],
    [rect.x + rect.w, rect.y],
    [rect.x, rect.y + rect.h / 2],
    [rect.x + rect.w, rect.y + rect.h / 2],
    [rect.x, rect.y + rect.h],
    [rect.x + rect.w / 2, rect.y + rect.h],
    [rect.x + rect.w, rect.y + rect.h]
  ];
  octx.save();
  octx.setLineDash([]);
  octx.fillStyle = "#fff";
  octx.strokeStyle = stroke;
  octx.lineWidth = 1;
  points.forEach(([x, y]) => {
    octx.fillRect(x - half, y - half, size, size);
    octx.strokeRect(x - half + 0.5, y - half + 0.5, size, size);
  });
  octx.restore();
}

function updateOverlayCursor(pos) {
  if (brushPreviewTool()) {
    els.overlay.style.cursor = "none";
    return;
  }
  const handle = hitFloatingHandle(pos);
  if (handle) {
    const cursors = { n: "ns-resize", s: "ns-resize", e: "ew-resize", w: "ew-resize", nw: "nwse-resize", se: "nwse-resize", ne: "nesw-resize", sw: "nesw-resize" };
    els.overlay.style.cursor = cursors[handle] || "grab";
    return;
  }
  if (app.tool === "select" && hitFloatingSelection(pos)) {
    els.overlay.style.cursor = app.drawing ? "grabbing" : "grab";
    return;
  }
  els.overlay.style.cursor = app.tool === "select" ? "crosshair" : "crosshair";
}

function hitFloatingSelection(pos) {
  const floating = app.floatingSelection;
  if (!floating) return false;
  const inBounds = pos.x >= floating.x && pos.x <= floating.x + floating.w && pos.y >= floating.y && pos.y <= floating.y + floating.h;
  if (!inBounds) return false;
  if (!floating.path?.length) return true;
  return pointInFloatingPath(pos, floating);
}

function pointInFloatingPath(pos, floating) {
  const scaleX = floating.pathBaseW ? floating.w / floating.pathBaseW : 1;
  const scaleY = floating.pathBaseH ? floating.h / floating.pathBaseH : 1;
  const x = pos.x - floating.x;
  const y = pos.y - floating.y;
  let inside = false;
  const points = floating.path;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const xi = points[i].x * scaleX;
    const yi = points[i].y * scaleY;
    const xj = points[j].x * scaleX;
    const yj = points[j].y * scaleY;
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function floatingHandlePoints(floating = app.floatingSelection) {
  if (!floating) return [];
  const x = floating.x;
  const y = floating.y;
  const w = floating.w;
  const h = floating.h;
  return [
    ["nw", x, y], ["n", x + w / 2, y], ["ne", x + w, y],
    ["w", x, y + h / 2], ["e", x + w, y + h / 2],
    ["sw", x, y + h], ["s", x + w / 2, y + h], ["se", x + w, y + h]
  ];
}

function hitFloatingHandle(pos) {
  if (!app.floatingSelection) return null;
  const radius = Math.max(8, 8 / app.zoom);
  const hit = floatingHandlePoints().find(([, x, y]) => Math.abs(pos.x - x) <= radius && Math.abs(pos.y - y) <= radius);
  return hit ? hit[0] : null;
}

function moveFloatingSelection(pos) {
  const floating = app.floatingSelection;
  if (!floating || !app.selectionDrag) return;
  floating.x = clamp(pos.x - app.selectionDrag.offsetX, 0, Math.max(0, app.width - floating.w));
  floating.y = clamp(pos.y - app.selectionDrag.offsetY, 0, Math.max(0, app.height - floating.h));
  app.selection = selectionRectFromFloating(floating);
  render();
  updateSelectionStatus();
}

function resizeFloatingSelection(pos) {
  const drag = app.selectionDrag;
  const floating = app.floatingSelection;
  if (!drag || !floating) return;
  const original = drag.original;
  const dx = pos.x - drag.startX;
  const dy = pos.y - drag.startY;
  let x = original.x;
  let y = original.y;
  let w = original.w;
  let h = original.h;

  if (drag.handle.includes("e")) w = original.w + dx;
  if (drag.handle.includes("s")) h = original.h + dy;
  if (drag.handle.includes("w")) { x = original.x + dx; w = original.w - dx; }
  if (drag.handle.includes("n")) { y = original.y + dy; h = original.h - dy; }

  w = Math.max(8, w);
  h = Math.max(8, h);
  x = clamp(x, 0, Math.max(0, app.width - w));
  y = clamp(y, 0, Math.max(0, app.height - h));

  floating.x = Math.round(x);
  floating.y = Math.round(y);
  floating.w = Math.round(w);
  floating.h = Math.round(h);
  app.selection = selectionRectFromFloating(floating);
  render();
  updateSelectionStatus();
}

function selectionRectFromFloating(floating) {
  return {
    x: floating.x,
    y: floating.y,
    w: floating.w,
    h: floating.h,
    path: floating.path || null,
    pathBaseW: floating.pathBaseW,
    pathBaseH: floating.pathBaseH
  };
}

function createFloatingSelectionFromSelection(selection) {
  saveState();
  const temp = makeCanvas(selection.w, selection.h);
  const tempCtx = temp.getContext("2d");
  if (selection.path?.length) {
    tempCtx.save();
    traceLocalSelectionPath(tempCtx, selection);
    tempCtx.closePath();
    tempCtx.clip();
    tempCtx.drawImage(els.composite, selection.x, selection.y, selection.w, selection.h, 0, 0, selection.w, selection.h);
    tempCtx.restore();
    const layerCtx = currentCtx();
    layerCtx.save();
    traceSelectionPath(layerCtx, selection);
    layerCtx.closePath();
    layerCtx.clip();
    layerCtx.clearRect(selection.x, selection.y, selection.w, selection.h);
    layerCtx.restore();
  } else {
    tempCtx.drawImage(els.composite, selection.x, selection.y, selection.w, selection.h, 0, 0, selection.w, selection.h);
    currentCtx().clearRect(selection.x, selection.y, selection.w, selection.h);
  }
  app.floatingSelection = {
    canvas: temp,
    x: selection.x,
    y: selection.y,
    w: selection.w,
    h: selection.h,
    path: selection.path ? selection.path.map((point) => ({ ...point })) : null,
    pathBaseW: selection.path ? selection.w : null,
    pathBaseH: selection.path ? selection.h : null,
    kind: "selection"
  };
  app.selection = selectionRectFromFloating(app.floatingSelection);
  app.tool = "select";
  app.dirty = true;
  render();
  updateAll();
}

function commitFloatingSelection() {
  if (!app.floatingSelection) return;
  const floating = app.floatingSelection;
  currentCtx().drawImage(floating.canvas, floating.x, floating.y, floating.w, floating.h);
  app.floatingSelection = null;
  app.selectionDrag = null;
  app.selection = null;
  render();
}

function createFloatingShape(rect) {
  if (rect.w < 2 || rect.h < 2) return;
  const pad = Math.max(6, app.size + 4);
  const temp = makeCanvas(Math.ceil(rect.w + pad * 2), Math.ceil(rect.h + pad * 2));
  const tempCtx = temp.getContext("2d");
  const localRect = { x: pad, y: pad, w: rect.w, h: rect.h };
  drawShape(tempCtx, app.shape, localRect, false);
  app.floatingSelection = {
    canvas: temp,
    x: Math.round(rect.x - pad),
    y: Math.round(rect.y - pad),
    w: temp.width,
    h: temp.height,
    kind: "shape"
  };
  app.selection = { x: app.floatingSelection.x, y: app.floatingSelection.y, w: temp.width, h: temp.height };
  app.tool = "select";
  app.dirty = true;
  render();
  updateAll();
}

function normalizeRect(a, b) {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return { x, y, w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) };
}

function constrainPoint(pos, square) {
  if (!square) return pos;
  const dx = pos.x - app.dragStart.x;
  const dy = pos.y - app.dragStart.y;
  const size = Math.min(Math.abs(dx), Math.abs(dy));
  return { x: app.dragStart.x + Math.sign(dx || 1) * size, y: app.dragStart.y + Math.sign(dy || 1) * size };
}

function floodFill(x, y, fill) {
  const layerCtx = currentCtx();
  const image = layerCtx.getImageData(0, 0, app.width, app.height);
  const data = image.data;
  const idx = (y * app.width + x) * 4;
  const target = [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
  if (colorDistance(target, fill) < 2) return;
  const stack = [[x, y]];
  const visited = new Uint8Array(app.width * app.height);
  const tolerance = 24;
  while (stack.length) {
    const [px, py] = stack.pop();
    if (px < 0 || py < 0 || px >= app.width || py >= app.height) continue;
    const p = py * app.width + px;
    if (visited[p]) continue;
    const i = p * 4;
    if (colorDistance([data[i], data[i + 1], data[i + 2], data[i + 3]], target) > tolerance) continue;
    visited[p] = 1;
    data[i] = fill[0]; data[i + 1] = fill[1]; data[i + 2] = fill[2]; data[i + 3] = fill[3];
    stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
  }
  layerCtx.putImageData(image, 0, 0);
}

function pickColor(pos, secondary) {
  render();
  const pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data;
  setColor(rgbToHex(pixel[0], pixel[1], pixel[2]), secondary);
}

function drawTextBoxPreview(rect) {
  clearOverlay();
  if (!rect || rect.w < 2 || rect.h < 2) return;
  octx.save();
  octx.strokeStyle = "#111";
  octx.lineWidth = 1;
  octx.setLineDash([6, 4]);
  octx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.w, rect.h);
  drawSelectionHandles(rect, "#111");
  octx.restore();
}

function openTextEditor(rect) {
  commitText();
  app.selection = rect;
  drawTextBoxPreview(rect);
  els.textEditor.style.display = "block";
  els.textEditor.style.left = `${rect.x}px`;
  els.textEditor.style.top = `${rect.y}px`;
  els.textEditor.style.width = `${rect.w}px`;
  els.textEditor.style.height = `${rect.h}px`;
  els.textEditor.value = "";
  updateTextEditorStyle();
  els.textEditor.focus();
}

function textEditorRect() {
  const rect = els.textEditor.getBoundingClientRect();
  const shellRect = els.shell.getBoundingClientRect();
  return {
    x: (rect.left - shellRect.left) / app.zoom,
    y: (rect.top - shellRect.top) / app.zoom,
    w: rect.width / app.zoom,
    h: rect.height / app.zoom
  };
}

function textFormatSnapshot() {
  return {
    textFont: app.textFont,
    textSize: app.textSize,
    textBold: app.textBold,
    textItalic: app.textItalic,
    textUnderline: app.textUnderline,
    textStrike: app.textStrike,
    textAlign: app.textAlign,
    textBgFill: app.textBgFill,
    primary: app.primary,
    secondary: app.secondary,
    opacity: app.opacity
  };
}

function applyTextFormatSnapshot(snapshot) {
  Object.assign(app, snapshot);
  updateTextToolbar();
  updateColorButtons();
  updateTextEditorStyle();
}

function copyTextBox() {
  if (els.textEditor.style.display !== "block") return;
  app.textBoxClipboard = {
    rect: textEditorRect(),
    value: els.textEditor.value,
    format: textFormatSnapshot()
  };
}

function pasteTextBox() {
  if (!app.textBoxClipboard) return;
  const source = app.textBoxClipboard;
  const rect = {
    x: clamp(source.rect.x + 24, 0, Math.max(0, app.width - source.rect.w)),
    y: clamp(source.rect.y + 24, 0, Math.max(0, app.height - source.rect.h)),
    w: source.rect.w,
    h: source.rect.h
  };
  commitText();
  applyTextFormatSnapshot(source.format);
  openTextEditor(rect);
  els.textEditor.value = source.value;
  updateTextEditorStyle();
}

function textFontString() {
  const style = app.textItalic ? "italic" : "normal";
  const weight = app.textBold ? "700" : "400";
  return `${style} ${weight} ${app.textSize}px "${app.textFont}", "Malgun Gothic", sans-serif`;
}

function updateTextEditorStyle() {
  if (!els.textEditor) return;
  els.textEditor.style.font = textFontString();
  els.textEditor.style.color = app.primary;
  els.textEditor.style.textAlign = app.textAlign;
  els.textEditor.style.textDecoration = [
    app.textUnderline ? "underline" : "",
    app.textStrike ? "line-through" : ""
  ].filter(Boolean).join(" ") || "none";
  els.textEditor.style.background = app.textBgFill ? app.secondary : "transparent";
}

function textEditorBorderHit(event) {
  if (els.textEditor.style.display !== "block") return false;
  const rect = els.textEditor.getBoundingClientRect();
  const edge = 10;
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const nearLeft = x <= edge;
  const nearRight = rect.width - x <= edge;
  const nearTop = y <= edge;
  const nearBottom = rect.height - y <= edge;
  const nativeResizeCorner = nearRight && nearBottom;
  return !nativeResizeCorner && (nearLeft || nearRight || nearTop || nearBottom);
}

function startTextBoxMove(event) {
  if (!textEditorBorderHit(event)) return;
  event.preventDefault();
  els.textEditor.focus();
  const left = parseFloat(els.textEditor.style.left) || 0;
  const top = parseFloat(els.textEditor.style.top) || 0;
  app.textDrag = {
    startX: event.clientX,
    startY: event.clientY,
    left,
    top
  };
  els.textEditor.setPointerCapture?.(event.pointerId);
}

function moveTextBox(event) {
  if (!app.textDrag) {
    els.textEditor.style.cursor = textEditorBorderHit(event) ? "move" : "text";
    return;
  }
  const dx = (event.clientX - app.textDrag.startX) / app.zoom;
  const dy = (event.clientY - app.textDrag.startY) / app.zoom;
  const width = els.textEditor.offsetWidth / app.zoom;
  const height = els.textEditor.offsetHeight / app.zoom;
  const x = clamp(app.textDrag.left + dx, 0, Math.max(0, app.width - width));
  const y = clamp(app.textDrag.top + dy, 0, Math.max(0, app.height - height));
  els.textEditor.style.left = `${x}px`;
  els.textEditor.style.top = `${y}px`;
  app.selection = { x, y, w: width, h: height };
  drawTextBoxPreview(app.selection);
}

function syncTextSelectionFromEditor() {
  if (els.textEditor.style.display !== "block") return;
  app.selection = textEditorRect();
  drawTextBoxPreview(app.selection);
}

function endTextBoxMove() {
  app.textDrag = null;
  els.textEditor.style.cursor = "text";
  syncTextSelectionFromEditor();
}

function commitText() {
  if (els.textEditor.style.display !== "block" || !els.textEditor.value.trim()) {
    els.textEditor.style.display = "none";
    clearOverlay();
    app.selection = null;
    return;
  }
  saveState();
  const rect = els.textEditor.getBoundingClientRect();
  const shellRect = els.shell.getBoundingClientRect();
  const x = (rect.left - shellRect.left) / app.zoom;
  const y = (rect.top - shellRect.top) / app.zoom;
  const w = rect.width / app.zoom;
  const h = rect.height / app.zoom;
  const layerCtx = currentCtx();
  layerCtx.save();
  layerCtx.globalAlpha = app.opacity;
  if (app.textBgFill) {
    layerCtx.fillStyle = app.secondary;
    layerCtx.fillRect(x, y, w, h);
  }
  layerCtx.fillStyle = app.primary;
  layerCtx.font = textFontString();
  layerCtx.textBaseline = "top";
  layerCtx.textAlign = app.textAlign;
  const pad = 8;
  const lineHeight = app.textSize * 1.25;
  const textX = app.textAlign === "center" ? x + w / 2 : app.textAlign === "right" ? x + w - pad : x + pad;
  els.textEditor.value.split("\n").forEach((line, index) => {
    const lineY = y + pad + index * lineHeight;
    layerCtx.fillText(line, textX, lineY);
    drawTextDecorations(layerCtx, line, textX, lineY, w - pad * 2);
  });
  layerCtx.restore();
  els.textEditor.style.display = "none";
  clearOverlay();
  app.selection = null;
  finishChange();
}

function drawTextDecorations(layerCtx, line, textX, lineY, maxWidth) {
  if (!app.textUnderline && !app.textStrike) return;
  const metrics = layerCtx.measureText(line);
  const textWidth = Math.min(metrics.width, maxWidth);
  let startX = textX;
  if (app.textAlign === "center") startX = textX - textWidth / 2;
  if (app.textAlign === "right") startX = textX - textWidth;
  layerCtx.save();
  layerCtx.strokeStyle = app.primary;
  layerCtx.lineWidth = Math.max(1, app.textSize / 18);
  if (app.textUnderline) {
    const y = lineY + app.textSize + 2;
    layerCtx.beginPath();
    layerCtx.moveTo(startX, y);
    layerCtx.lineTo(startX + textWidth, y);
    layerCtx.stroke();
  }
  if (app.textStrike) {
    const y = lineY + app.textSize * 0.56;
    layerCtx.beginPath();
    layerCtx.moveTo(startX, y);
    layerCtx.lineTo(startX + textWidth, y);
    layerCtx.stroke();
  }
  layerCtx.restore();
}

els.textEditor.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c" && els.textEditor.selectionStart === els.textEditor.selectionEnd) {
    event.preventDefault();
    copyTextBox();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "x" && els.textEditor.selectionStart === els.textEditor.selectionEnd) {
    event.preventDefault();
    copyTextBox();
    els.textEditor.value = "";
    els.textEditor.style.display = "none";
    clearOverlay();
    app.selection = null;
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v" && app.textBoxClipboard && els.textEditor.selectionStart === els.textEditor.selectionEnd) {
    event.preventDefault();
    pasteTextBox();
    return;
  }
  if (event.key === "Escape") {
    els.textEditor.style.display = "none";
    clearOverlay();
    app.selection = null;
  }
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    commitText();
  }
});

els.textEditor.addEventListener("pointerdown", startTextBoxMove);
els.textEditor.addEventListener("pointermove", moveTextBox);
els.textEditor.addEventListener("pointerup", endTextBoxMove);
els.textEditor.addEventListener("pointerleave", () => {
  if (!app.textDrag) els.textEditor.style.cursor = "text";
});

function copySelection() {
  if (!app.selection && !app.floatingSelection) return;
  const source = app.floatingSelection || app.selection;
  const temp = makeCanvas(source.w, source.h);
  if (app.floatingSelection) {
    temp.getContext("2d").drawImage(app.floatingSelection.canvas, 0, 0, source.w, source.h);
  } else {
    const tctx = temp.getContext("2d");
    if (source.path?.length) {
      tctx.save();
      tctx.beginPath();
      tctx.moveTo(source.path[0].x, source.path[0].y);
      source.path.slice(1).forEach((point) => tctx.lineTo(point.x, point.y));
      tctx.closePath();
      tctx.clip();
      tctx.drawImage(els.composite, source.x, source.y, source.w, source.h, 0, 0, source.w, source.h);
      tctx.restore();
    } else {
      tctx.drawImage(els.composite, source.x, source.y, source.w, source.h, 0, 0, source.w, source.h);
    }
  }
  app.clipboard = temp;
}

function cutSelection() {
  if (!app.selection) return;
  copySelection();
  clearSelection();
}

function pasteSelection() {
  if (!app.clipboard) return;
  commitFloatingSelection();
  saveState();
  const temp = makeCanvas(app.clipboard.width, app.clipboard.height);
  temp.getContext("2d").drawImage(app.clipboard, 0, 0);
  app.floatingSelection = { canvas: temp, x: 24, y: 24, w: temp.width, h: temp.height };
  app.selection = { x: 24, y: 24, w: temp.width, h: temp.height };
  app.tool = "select";
  app.dirty = true;
  render();
  updateAll();
}

function clearSelection() {
  if (!app.selection && !app.floatingSelection) return;
  saveState();
  if (app.floatingSelection) {
    app.floatingSelection = null;
  } else {
    const ctx = currentCtx();
    if (app.selection.path?.length) {
      ctx.save();
      traceSelectionPath(ctx, app.selection);
      ctx.closePath();
      ctx.clip();
      ctx.clearRect(app.selection.x, app.selection.y, app.selection.w, app.selection.h);
      ctx.restore();
    } else {
      ctx.clearRect(app.selection.x, app.selection.y, app.selection.w, app.selection.h);
    }
  }
  app.selection = null;
  finishChange();
}

function selectAll() {
  app.selection = { x: 0, y: 0, w: app.width, h: app.height };
  drawSelection(app.selection);
  updateSelectionStatus();
}

function cropToSelection() {
  if (!app.selection) return;
  saveState();
  const { x, y, w, h } = app.selection;
  app.layers.forEach((layer) => {
    const temp = makeCanvas(w, h);
    temp.getContext("2d").drawImage(layer.canvas, x, y, w, h, 0, 0, w, h);
    layer.canvas = temp;
  });
  resizeDocument(w, h, false);
  app.selection = null;
  finishChange();
}

function clearLayer() {
  saveState();
  currentCtx().clearRect(0, 0, app.width, app.height);
  if (app.activeLayer === 0 && !app.transparentBg) {
    currentCtx().fillStyle = "#fff";
    currentCtx().fillRect(0, 0, app.width, app.height);
  }
  finishChange();
}

function openResize() {
  $("resizeWidth").value = app.width;
  $("resizeHeight").value = app.height;
  $("resizeDialog").showModal();
}

function applyResize() {
  const w = Math.max(1, Number($("resizeWidth").value));
  const h = Math.max(1, Number($("resizeHeight").value));
  saveState();
  resizeDocument(w, h, $("resizeImageToo").checked);
  finishChange();
}

function resizeDocument(w, h, scaleImage) {
  app.layers.forEach((layer) => {
    const old = layer.canvas;
    const next = makeCanvas(w, h);
    const nctx = next.getContext("2d");
    if (scaleImage) nctx.drawImage(old, 0, 0, w, h);
    else nctx.drawImage(old, 0, 0);
    layer.canvas = next;
  });
  app.width = w;
  app.height = h;
  [els.composite, els.overlay].forEach((canvas) => { canvas.width = w; canvas.height = h; });
  els.shell.style.width = `${w}px`;
  els.shell.style.height = `${h}px`;
  updateCanvasStatus();
  render();
}

function startCanvasResize(event) {
  event.preventDefault();
  event.stopPropagation();
  commitText();
  commitFloatingSelection();
  saveState();
  const handle = event.currentTarget.dataset.handle;
  const start = pointerPosUnclamped(event);
  app.canvasResize = {
    handle,
    start,
    clientX: event.clientX,
    clientY: event.clientY,
    width: app.width,
    height: app.height,
    layers: app.layers.map((layer) => {
      const copy = makeCanvas(app.width, app.height);
      copy.getContext("2d").drawImage(layer.canvas, 0, 0);
      return { layer, canvas: copy };
    })
  };
  event.currentTarget.setPointerCapture?.(event.pointerId);
}

function moveCanvasResize(event) {
  if (!app.canvasResize) return;
  const dx = (event.clientX - app.canvasResize.clientX) / app.zoom;
  const dy = (event.clientY - app.canvasResize.clientY) / app.zoom;
  const next = calculateCanvasResize(app.canvasResize.handle, dx, dy);
  applyCanvasResize(next.w, next.h, next.offsetX, next.offsetY);
}

function endCanvasResize() {
  if (!app.canvasResize) return;
  app.canvasResize = null;
  finishChange();
}

function calculateCanvasResize(handle, dx, dy) {
  const minSize = 32;
  let w = app.canvasResize.width;
  let h = app.canvasResize.height;
  let offsetX = 0;
  let offsetY = 0;

  if (handle.includes("e")) w = app.canvasResize.width + dx;
  if (handle.includes("s")) h = app.canvasResize.height + dy;
  if (handle.includes("w")) {
    w = app.canvasResize.width - dx;
    offsetX = -dx;
  }
  if (handle.includes("n")) {
    h = app.canvasResize.height - dy;
    offsetY = -dy;
  }

  if (w < minSize) {
    if (handle.includes("w")) offsetX -= minSize - w;
    w = minSize;
  }
  if (h < minSize) {
    if (handle.includes("n")) offsetY -= minSize - h;
    h = minSize;
  }
  return { w: Math.round(w), h: Math.round(h), offsetX: Math.round(offsetX), offsetY: Math.round(offsetY) };
}

function applyCanvasResize(w, h, offsetX, offsetY) {
  app.width = w;
  app.height = h;
  [els.composite, els.overlay].forEach((canvas) => { canvas.width = w; canvas.height = h; });
  els.shell.style.width = `${w}px`;
  els.shell.style.height = `${h}px`;

  app.canvasResize.layers.forEach(({ layer, canvas }) => {
    const next = makeCanvas(w, h);
    next.getContext("2d").drawImage(canvas, offsetX, offsetY);
    layer.canvas = next;
  });

  app.selection = null;
  updateCanvasStatus();
  render();
}

function rotateCanvas(deg) {
  saveState();
  const swap = Math.abs(deg) === 90;
  app.layers.forEach((layer) => {
    const next = makeCanvas(swap ? app.height : app.width, swap ? app.width : app.height);
    const nctx = next.getContext("2d");
    nctx.translate(next.width / 2, next.height / 2);
    nctx.rotate(deg * Math.PI / 180);
    nctx.drawImage(layer.canvas, -app.width / 2, -app.height / 2);
    layer.canvas = next;
  });
  if (swap) resizeDocument(app.height, app.width, false);
  finishChange();
}

function flipCanvas(axis) {
  saveState();
  app.layers.forEach((layer) => {
    const next = makeCanvas();
    const nctx = next.getContext("2d");
    if (axis === "h") {
      nctx.translate(app.width, 0);
      nctx.scale(-1, 1);
    } else {
      nctx.translate(0, app.height);
      nctx.scale(1, -1);
    }
    nctx.drawImage(layer.canvas, 0, 0);
    layer.canvas = next;
  });
  finishChange();
}

function removeBackground() {
  saveState();
  const layerCtx = currentCtx();
  const image = layerCtx.getImageData(0, 0, app.width, app.height);
  const data = image.data;
  const samples = [[0, 0], [app.width - 1, 0], [0, app.height - 1], [app.width - 1, app.height - 1]].map(([x, y]) => {
    const i = (y * app.width + x) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  });
  for (let i = 0; i < data.length; i += 4) {
    const px = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    const near = Math.min(...samples.map((s) => colorDistance(px, s)));
    if (near < 58) data[i + 3] = 0;
    else if (near < 90) data[i + 3] = Math.max(0, data[i + 3] - 120);
  }
  layerCtx.putImageData(image, 0, 0);
  app.transparentBg = true;
  finishChange();
}

function filterImage(type) {
  saveState();
  const layerCtx = currentCtx();
  if (type === "pixelate") {
    const block = Math.max(4, app.size);
    const temp = makeCanvas(Math.ceil(app.width / block), Math.ceil(app.height / block));
    temp.getContext("2d").drawImage(layerCtx.canvas, 0, 0, temp.width, temp.height);
    layerCtx.imageSmoothingEnabled = false;
    layerCtx.clearRect(0, 0, app.width, app.height);
    layerCtx.drawImage(temp, 0, 0, app.width, app.height);
    layerCtx.imageSmoothingEnabled = true;
    finishChange();
    return;
  }
  const image = layerCtx.getImageData(0, 0, app.width, app.height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    if (type === "invert") {
      data[i] = 255 - data[i]; data[i + 1] = 255 - data[i + 1]; data[i + 2] = 255 - data[i + 2];
    } else if (type === "grayscale") {
      const avg = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = data[i + 1] = data[i + 2] = avg;
    } else if (type === "soften") {
      data[i] = data[i] * 0.92 + 18; data[i + 1] = data[i + 1] * 0.92 + 18; data[i + 2] = data[i + 2] * 0.92 + 18;
    } else if (type === "sharpen") {
      data[i] = clamp(data[i] * 1.14 - 14, 0, 255); data[i + 1] = clamp(data[i + 1] * 1.14 - 14, 0, 255); data[i + 2] = clamp(data[i + 2] * 1.14 - 14, 0, 255);
    }
  }
  layerCtx.putImageData(image, 0, 0);
  finishChange();
}

function addLayer() {
  saveState();
  app.layers.splice(app.activeLayer + 1, 0, newLayer());
  app.activeLayer += 1;
  finishChange();
}

function duplicateLayer() {
  saveState();
  const layer = currentLayer();
  const clone = newLayer(`${layer.name} 蹂듭궗`);
  clone.opacity = layer.opacity;
  clone.visible = layer.visible;
  clone.canvas.getContext("2d").drawImage(layer.canvas, 0, 0);
  app.layers.splice(app.activeLayer + 1, 0, clone);
  app.activeLayer += 1;
  finishChange();
}

function deleteLayer() {
  if (app.layers.length === 1) return;
  saveState();
  app.layers.splice(app.activeLayer, 1);
  app.activeLayer = clamp(app.activeLayer, 0, app.layers.length - 1);
  finishChange();
}

function mergeLayerDown() {
  if (app.activeLayer === 0) return;
  saveState();
  const top = currentLayer();
  const below = app.layers[app.activeLayer - 1];
  const bctx = below.canvas.getContext("2d");
  bctx.save();
  bctx.globalAlpha = top.opacity;
  bctx.drawImage(top.canvas, 0, 0);
  bctx.restore();
  app.layers.splice(app.activeLayer, 1);
  app.activeLayer -= 1;
  finishChange();
}

function renderLayers() {
  els.layerList.innerHTML = "";
  [...app.layers].reverse().forEach((layer, reverseIndex) => {
    const index = app.layers.length - 1 - reverseIndex;
    const item = document.createElement("div");
    item.className = `layer-item ${index === app.activeLayer ? "active" : ""}`;
    const visible = document.createElement("button");
    visible.textContent = layer.visible ? "V" : "-";
    visible.addEventListener("click", () => { layer.visible = !layer.visible; render(); renderLayers(); });
    const thumb = document.createElement("canvas");
    thumb.className = "layer-thumb";
    thumb.width = 104;
    thumb.height = 68;
    thumb.getContext("2d").drawImage(layer.canvas, 0, 0, thumb.width, thumb.height);
    const name = document.createElement("button");
    name.className = "layer-name";
    name.textContent = layer.name;
    name.addEventListener("click", () => { app.activeLayer = index; updateAll(); });
    item.append(visible, thumb, name);
    els.layerList.appendChild(item);
  });
  $("layerOpacity").value = Math.round(currentLayer().opacity * 100);
}

function saveState() {
  const snapshot = {
    width: app.width,
    height: app.height,
    activeLayer: app.activeLayer,
    layers: app.layers.map((layer) => ({
      name: layer.name,
      visible: layer.visible,
      opacity: layer.opacity,
      data: layer.canvas.toDataURL("image/png")
    }))
  };
  app.undo.push(snapshot);
  if (app.undo.length > 50) app.undo.shift();
  app.redo = [];
}

async function restoreState(snapshot) {
  app.width = snapshot.width;
  app.height = snapshot.height;
  app.activeLayer = snapshot.activeLayer;
  app.floatingSelection = null;
  app.selectionDrag = null;
  app.selection = null;
  app.layers = [];
  for (const saved of snapshot.layers) {
    const layer = newLayer(saved.name);
    layer.visible = saved.visible;
    layer.opacity = saved.opacity;
    await drawDataUrl(layer.canvas, saved.data);
    app.layers.push(layer);
  }
  resizeDocument(app.width, app.height, false);
  updateAll();
}

function currentSnapshot() {
  return {
    width: app.width,
    height: app.height,
    activeLayer: app.activeLayer,
    layers: app.layers.map((layer) => ({
      name: layer.name,
      visible: layer.visible,
      opacity: layer.opacity,
      data: layer.canvas.toDataURL("image/png")
    }))
  };
}

async function undo() {
  if (app.undo.length <= 1) return;
  app.redo.push(currentSnapshot());
  app.undo.pop();
  await restoreState(app.undo[app.undo.length - 1]);
}

async function redo() {
  if (!app.redo.length) return;
  const snapshot = app.redo.pop();
  app.undo.push(snapshot);
  await restoreState(snapshot);
}

function finishChange() {
  app.dirty = true;
  app.selection = app.selection && app.tool === "select" ? app.selection : null;
  render();
  updateAll();
}

function newFile() {
  commitFloatingSelection();
  if (app.dirty && !confirm("?꾩옱 洹몃┝??吏?곌퀬 ?덈줈 留뚮뱾源뚯슂?")) return;
  app.width = 1080;
  app.height = 648;
  app.layers = [newLayer("諛곌꼍", true)];
  app.activeLayer = 0;
  app.undo = [];
  app.redo = [];
  app.selection = null;
  resizeDocument(app.width, app.height, false);
  saveState();
  updateAll();
}

function openImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      saveState();
      if (event.target.id === "fileInput") {
        resizeDocument(img.width, img.height, false);
        app.layers = [newLayer("諛곌꼍")];
        app.activeLayer = 0;
      }
      currentCtx().drawImage(img, 0, 0);
      finishChange();
      $("documentTitle").textContent = `${file.name} - \uc6f9 \uadf8\ub9bc\ud310`;
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
  event.target.value = "";
}

function saveImage(format) {
  commitText();
  commitFloatingSelection();
  render();
  const mime = format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
  const ext = format === "jpeg" ? "jpg" : format;
  download(els.composite.toDataURL(mime, 0.92), `web-paint.${ext}`);
  app.dirty = false;
}

function saveProject() {
  commitText();
  commitFloatingSelection();
  const project = {
    type: "web-paint-project",
    version: 1,
    width: app.width,
    height: app.height,
    transparentBg: app.transparentBg,
    layers: app.layers.map((layer) => ({
      name: layer.name,
      visible: layer.visible,
      opacity: layer.opacity,
      data: layer.canvas.toDataURL("image/png")
    }))
  };
  const blob = new Blob([JSON.stringify(project)], { type: "application/json" });
  download(URL.createObjectURL(blob), "web-paint.webpaint");
}

function openProject(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    const project = JSON.parse(reader.result);
    app.width = project.width;
    app.height = project.height;
    app.transparentBg = !!project.transparentBg;
    app.layers = [];
    for (const saved of project.layers) {
      const layer = newLayer(saved.name);
      layer.visible = saved.visible;
      layer.opacity = saved.opacity;
      await drawDataUrl(layer.canvas, saved.data);
      app.layers.push(layer);
    }
    app.activeLayer = app.layers.length - 1;
    app.undo = [];
    app.redo = [];
    resizeDocument(app.width, app.height, false);
    saveState();
    updateAll();
  };
  reader.readAsText(file);
  event.target.value = "";
}

function drawDataUrl(canvas, dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      canvas.width = app.width;
      canvas.height = app.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve();
    };
    img.src = dataUrl;
  });
}

function download(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => {
    if (url.startsWith("blob:")) URL.revokeObjectURL(url);
  }, 1000);
}

function setZoom(percent) {
  const value = clamp(Number(percent), 25, 400);
  app.zoom = value / 100;
  els.shell.style.transform = `scale(${app.zoom})`;
  els.shell.style.marginRight = `${app.width * (app.zoom - 1)}px`;
  els.shell.style.marginBottom = `${app.height * (app.zoom - 1)}px`;
  $("zoomSlider").value = value;
  $("zoomSelect").value = `${nearestZoom(value)}%`;
}

function nearestZoom(value) {
  return [25, 50, 100, 150, 200, 400].reduce((a, b) => Math.abs(b - value) < Math.abs(a - value) ? b : a);
}

function fitZoom() {
  const rect = els.stage.getBoundingClientRect();
  const value = Math.floor(Math.min((rect.width - 80) / app.width, (rect.height - 140) / app.height) * 100);
  setZoom(clamp(value, 25, 400));
}

function toggleGrid() {
  app.showGrid = !app.showGrid;
  els.shell.style.backgroundSize = app.showGrid ? "10px 10px" : "20px 20px";
}

function toggleTransparent() {
  app.transparentBg = !app.transparentBg;
  els.shell.classList.toggle("solid-bg", !app.transparentBg);
  render();
}

function updateAll() {
  updateColorButtons();
  updateToolButtons();
  updateCanvasStatus();
  updateSelectionStatus();
  renderLayers();
  $("undoBtn").disabled = app.undo.length <= 1;
  $("redoBtn").disabled = app.redo.length === 0;
}

function updateCanvasStatus() {
  $("canvasStatus").textContent = `${app.width} 횞 ${app.height}px`;
}

function updateSelectionStatus() {
  if (!app.selection) {
    $("selectionStatus").textContent = "";
    return;
  }
  const label = app.floatingSelection?.kind === "shape"
    ? "\ub3c4\ud615 \uac1d\uccb4"
    : app.floatingSelection?.kind === "selection"
      ? "\uc120\ud0dd \uc601\uc5ed"
      : app.floatingSelection
        ? "\ubd99\uc5ec\ub123\uc740 \uc601\uc5ed"
        : "\uc120\ud0dd";
  $("selectionStatus").textContent = `${app.selection.w} \u00d7 ${app.selection.h}px ${label}`;
}

function hexToRgba(hex, alpha = 1) {
  const clean = hex.replace("#", "");
  return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16), Math.round(alpha * 255)];
}

function rgbaString(hex, alpha) {
  const [r, g, b] = hexToRgba(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

function colorDistance(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 + ((a[3] ?? 255) - (b[3] ?? 255)) ** 2 * 0.2);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

init();
