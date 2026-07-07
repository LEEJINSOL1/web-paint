const iconStroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

function attrs(values) {
  return Object.entries(values).map(([key, value]) => `${key}="${value}"`).join(" ");
}

function svgIcon(paths, options = {}) {
  return `<svg class="${options.className || "paint-svg"}" viewBox="${options.viewBox || "0 0 24 24"}" aria-hidden="true">${paths}</svg>`;
}

function p(d, extra = {}) {
  return `<path ${attrs({ ...iconStroke, ...extra, d })}/>`;
}

function r(x, y, width, height, extra = {}) {
  return `<rect ${attrs({ ...iconStroke, ...extra, x, y, width, height })}/>`;
}

function c(cx, cy, radius, extra = {}) {
  return `<circle ${attrs({ ...iconStroke, ...extra, cx, cy, r: radius })}/>`;
}

function poly(points, extra = {}) {
  return `<polygon ${attrs({ ...iconStroke, ...extra, points })}/>`;
}

const icons = {
  save: svgIcon(`${p("M5 4h12l2 2v14H5z")}${p("M8 4v6h8V4")}${p("M8 20v-6h8v6")}`, { className: "paint-svg navy" }),
  open: svgIcon(`${p("M3 7h7l2 2h9v10H3z", { fill: "#ffd24d", stroke: "#c79000" })}${p("M3 10h18")}`),
  undo: svgIcon(`${p("M9 7H4v5")}${p("M4 12c2.4-4.2 8.8-6.3 14-1.4")}`),
  redo: svgIcon(`${p("M15 7h5v5")}${p("M20 12c-2.4-4.2-8.8-6.3-14-1.4")}`),
  crop: svgIcon(`${p("M7 3v14h14")}${p("M3 7h14V3")}${p("M17 17v4")}${p("M7 3H3")}`),
  resize: svgIcon(`${r(5, 5, 10, 10)}${p("M14 4h6v6")}${p("M20 4l-8 8")}${p("M4 20h6v-2H6v-4H4z", { fill: "#fff" })}`),
  rotateLeft: svgIcon(`${p("M7 7h7a5 5 0 1 1-4.6 7")}${p("M7 7l3-3")}${p("M7 7l3 3")}`, { className: "paint-svg blue-accent" }),
  rotateRight: svgIcon(`${p("M17 7h-7a5 5 0 1 0 4.6 7")}${p("M17 7l-3-3")}${p("M17 7l-3 3")}`),
  flipH: svgIcon(`${p("M4 5v14")}${p("M20 5v14")}${poly("8,6 14,12 8,18")}${poly("16,6 10,12 16,18")}`),
  flipV: svgIcon(`${p("M5 4h14")}${p("M5 20h14")}${poly("6,8 12,14 18,8")}${poly("6,16 12,10 18,16")}`),
  pencil: svgIcon(`${p("M4 17l-.8 3.8L7 20l11.6-11.6-3-3z", { fill: "#ffd45a", stroke: "#222" })}${p("M14.5 6.5l3 3")}`),
  brush: svgIcon(`${p("M14 4l6 6-6.5 6.5c-1.6 1.6-4.5 1.4-6-.2l-.3-.3c-1.6-1.6-1.8-4.4-.2-6z", { fill: "#78b7ff", stroke: "#222" })}${p("M5 18c-.7 1.8-2 2-3 2 1.8-1.4.4-3 2.2-4.1")}`),
  eraser: svgIcon(`${p("M4 15l7-7 7 7-4 4H8z", { fill: "#ff9ea8", stroke: "#222" })}${p("M8 19h12")}`),
  fill: svgIcon(`${p("M6 4l8 8-5 5-8-8z", { fill: "#b9d9ff", stroke: "#222" })}${p("M13 13c2 1.5 3 3 3 4a2 2 0 0 1-4 0c0-1 .7-2.3 1-4z", { fill: "#e40057", stroke: "#222" })}`),
  eyedropper: svgIcon(`${p("M15 4l5 5-9.8 9.8H5.2V13.8z", { fill: "#4aa3ff", stroke: "#222" })}${p("M13 6l5 5")}`),
  text: svgIcon(`${p("M5 19L11 5h2l6 14")}${p("M8 14h8")}`, { className: "paint-svg text-icon" }),
  magnifier: svgIcon(`${c(10, 10, 5)}${p("M14 14l6 6")}${p("M10 7v6")}${p("M7 10h6")}`, { className: "paint-svg blue-accent" }),
  clear: svgIcon(`${p("M5 7h14")}${p("M9 7V5h6v2")}${p("M8 10v9")}${p("M12 10v9")}${p("M16 10v9")}${p("M7 7l1 14h8l1-14")}`),
  background: svgIcon(`${p("M6 18h10l3-3V6H6z", { fill: "#dff8ff", stroke: "#1b5b7a" })}${p("M16 18v-4h4")}${p("M11 10l-2 2 2 2 2-2z", { fill: "#00a6ff", stroke: "#00a6ff" })}`),
  copilot: svgIcon(`${p("M7 5c3-3 8-1 10 2 3 0 5 4 2 7-1 4-7 5-9 2-3 1-7-1-7-5 0-3 2-5 4-6z", { fill: "url(#copilotGradient)", stroke: "none" })}<defs><linearGradient id="copilotGradient" x1="3" x2="21" y1="4" y2="20"><stop stop-color="#00a6ff"/><stop offset=".34" stop-color="#8d4dff"/><stop offset=".68" stop-color="#ff5aa6"/><stop offset="1" stop-color="#36c66c"/></linearGradient></defs>`),
  layers: svgIcon(`${p("M12 4l8 4-8 4-8-4z", { fill: "#eff7ff", stroke: "#1d3557" })}${p("M4 12l8 4 8-4")}${p("M4 16l8 4 8-4")}`),
  fit: svgIcon(`${p("M5 10V5h5")}${p("M14 5h5v5")}${p("M19 14v5h-5")}${p("M10 19H5v-5")}`),
  zoomOut: svgIcon(`${c(10, 10, 5)}${p("M14 14l6 6")}${p("M7 10h6")}`),
  zoomIn: svgIcon(`${c(10, 10, 5)}${p("M14 14l6 6")}${p("M10 7v6")}${p("M7 10h6")}`)
};

const shapeIcons = {
  line: svgIcon(p("M4 5l16 16"), { className: "shape-svg" }),
  curve: svgIcon(p("M4 16c4-9 8 8 16-4"), { className: "shape-svg" }),
  ellipse: svgIcon(c(12, 12, 7), { className: "shape-svg" }),
  rect: svgIcon(r(5, 6, 14, 12), { className: "shape-svg" }),
  roundrect: svgIcon(r(5, 6, 14, 12, { rx: 2.5 }), { className: "shape-svg" }),
  triangle: svgIcon(poly("12,5 20,19 4,19"), { className: "shape-svg" }),
  righttri: svgIcon(poly("5,5 19,19 5,19"), { className: "shape-svg" }),
  diamond: svgIcon(poly("12,4 20,12 12,20 4,12"), { className: "shape-svg" }),
  pentagon: svgIcon(poly("12,4 20,10 17,20 7,20 4,10"), { className: "shape-svg" }),
  hexagon: svgIcon(poly("8,5 16,5 21,12 16,19 8,19 3,12"), { className: "shape-svg" }),
  arrowR: svgIcon(p("M4 12h12M12 7l5 5-5 5"), { className: "shape-svg" }),
  arrowL: svgIcon(p("M20 12H8M12 7l-5 5 5 5"), { className: "shape-svg" }),
  arrowU: svgIcon(p("M12 20V8M7 12l5-5 5 5"), { className: "shape-svg" }),
  arrowD: svgIcon(p("M12 4v12M7 12l5 5 5-5"), { className: "shape-svg" }),
  star4: svgIcon(poly("12,4 14,10 20,12 14,14 12,20 10,14 4,12 10,10"), { className: "shape-svg" }),
  star5: svgIcon(poly("12,3 15,9 22,9 16.5,13.5 19,20 12,16 5,20 7.5,13.5 2,9 9,9"), { className: "shape-svg" }),
  star6: svgIcon(`${poly("12,3 16,10 8,10")}${poly("12,21 8,14 16,14")}`, { className: "shape-svg" }),
  callout: svgIcon(p("M5 6h14v10H12l-4 4v-4H5z"), { className: "shape-svg" }),
  bubble: svgIcon(`${c(11, 11, 7)}${p("M8 17l-3 4 6-3")}`, { className: "shape-svg" }),
  heart: svgIcon(p("M12 20C5 15 3 11 5.5 7.5 7.5 5 10.5 6 12 8c1.5-2 4.5-3 6.5-.5C21 11 19 15 12 20z"), { className: "shape-svg" })
};

function setButtonIcon(selector, icon, label) {
  const button = document.querySelector(selector);
  if (!button) return;
  button.innerHTML = label ? `${icon}<span>${label}</span>` : icon;
}

function polishPaintRibbon() {
  setButtonIcon("#saveBtn", icons.save);
  setButtonIcon("#openBtn", icons.open);
  setButtonIcon("#undoBtn", icons.undo);
  setButtonIcon("#redoBtn", icons.redo);
  setButtonIcon("#cropBtn", icons.crop);
  setButtonIcon("#resizeBtn", icons.resize);
  setButtonIcon("#rotateLeftBtn", icons.rotateLeft);
  setButtonIcon("#rotateRightBtn", icons.rotateRight);
  setButtonIcon("#flipHBtn", icons.flipH);
  setButtonIcon("#flipVBtn", icons.flipV);
  setButtonIcon('[data-tool="pencil"]', icons.pencil);
  setButtonIcon('.tool[data-tool="brush"]', icons.brush);
  setButtonIcon('[data-tool="eraser"]', icons.eraser);
  setButtonIcon('[data-tool="fill"]', icons.fill);
  setButtonIcon('[data-tool="eyedropper"]', icons.eyedropper);
  setButtonIcon('[data-tool="text"]', icons.text);
  setButtonIcon('[data-tool="magnifier"]', icons.magnifier);
  setButtonIcon("#clearBtn", icons.clear);
  setButtonIcon("#brushMenuBtn", icons.brush, "&#48652;&#47084;&#49884;");
  setButtonIcon("#removeBgBtn", icons.background, "&#48176;&#44221;&#51228;&#44144;");
  setButtonIcon("#aiBtn", icons.copilot, "Copilot");
  setButtonIcon("#layersBtn", icons.layers, "&#47112;&#51060;&#50612;");
  setButtonIcon("#fitBtn", icons.fit);
  setButtonIcon("#zoomOutBtn", icons.zoomOut);
  setButtonIcon("#zoomInBtn", icons.zoomIn);

  document.querySelectorAll(".shape-btn").forEach((button) => {
    if (shapeIcons[button.dataset.shape]) button.innerHTML = shapeIcons[button.dataset.shape];
  });

  document.querySelectorAll(".large-tool[data-tool='select']").forEach((button) => {
    button.innerHTML = '<span class="paint-select-icon" aria-hidden="true"></span><span>&#49440;&#53469;</span><span class="split-caret">&#8964;</span>';
  });
}

polishPaintRibbon();
