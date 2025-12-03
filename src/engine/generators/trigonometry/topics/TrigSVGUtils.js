class TrigSVGUtils {
  static generateSVG(params) {
    const size = 300;
    const center = size / 2;
    const drawPoly = (pts) =>
      `<polygon points="${pts.map((p) => `${p.x},${p.y}`).join(" ")}" stroke="black" fill="none" stroke-width="2"/>`;
    const drawText = (x, y, txt) =>
      `<text x="${x}" y="${y}" font-size="14">${txt}</text>`;

    if (params.type === "triangle" || params.type === "triangle_sas") {
      const x0 = 50;
      const y0 = 250;
      const sc = 15;
      const ax = (params.b || 4) * sc;
      const ay = (params.a || 3) * sc;
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
        <polygon points="${x0},${y0} ${x0 + ax},${y0} ${x0},${y0 - ay}" stroke="black" fill="none" stroke-width="2"/>
        <text x="${x0 - 20}" y="${y0 - ay / 2}">${params.a || "a"}</text>
        <text x="${x0 + ax / 2}" y="${y0 + 20}">${params.b || "b"}</text>
        <text x="${x0 + ax - 30}" y="${y0 - 10}" fill="red">α</text>
      </svg>`;
    }
    if (params.type === "ladder") {
      const x0 = 50,
        y0 = 250;
      const len = 200;
      const rad = (params.angle * Math.PI) / 180;
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
            <line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - 220}" stroke="black" stroke-width="4"/>
            <line x1="${x0}" y1="${y0}" x2="${x0 + 220}" y2="${y0}" stroke="black" stroke-width="2"/>
            <line x1="${x0 + len * Math.cos(rad)}" y1="${y0}" x2="${x0}" y2="${y0 - len * Math.sin(rad)}" stroke="brown" stroke-width="5"/>
            <text x="${x0 + 20}" y="${y0 - (len * Math.sin(rad)) / 2}">d=${params.d}</text>
        </svg>`;
    }
    if (params.type === "shadow") {
      const x0 = 100,
        y0 = 250;
      const h = 150;
      const s = 100;
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
            <line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - h}" stroke="green" stroke-width="4"/>
            <line x1="${x0}" y1="${y0}" x2="${x0 + s}" y2="${y0}" stroke="gray" stroke-width="4"/>
            <line x1="${x0 + s}" y1="${y0}" x2="${x0}" y2="${y0 - h}" stroke="orange" stroke-dasharray="4"/>
            <text x="${x0 + s + 5}" y="${y0 - 5}">α</text>
        </svg>`;
    }
    if (params.type === "parallelogram" || params.type === "rhombus_angle") {
      const w = 120,
        h = 80,
        sh = 40;
      const x0 = 80,
        y0 = 180;
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
            <polygon points="${x0},${y0} ${x0 + w},${y0} ${x0 + w + sh},${y0 - h} ${x0 + sh},${y0 - h}" stroke="black" fill="none" stroke-width="2"/>
            <text x="${x0 + 20}" y="${y0 - 5}">${params.angle}°</text>
        </svg>`;
    }
    if (params.type === "isosceles" || params.type === "trapezoid_h") {
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
            <polygon points="50,250 250,250 150,150" stroke="black" fill="none" stroke-width="2"/>
            <text x="70" y="240">α</text>
        </svg>`;
    }
    return "";
  }
}

module.exports = TrigSVGUtils;
