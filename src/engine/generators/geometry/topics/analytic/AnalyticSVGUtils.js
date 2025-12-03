class AnalyticSVGUtils {
  static generateSVG(params) {
    const size = 300;
    const center = size / 2;
    const scale = 20;
    const toSVG = (p) => ({ x: center + p.x * scale, y: center - p.y * scale });

    let content = "";
    const drawLine = (a, b, color, dash) => {
      const x1 = -10,
        x2 = 10;
      const p1 = toSVG({ x: x1, y: a * x1 + b }),
        p2 = toSVG({ x: x2, y: a * x2 + b });
      return `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${color}" stroke-width="2" ${dash ? 'stroke-dasharray="4"' : ""}/>`;
    };

    if (params.type === "segment" || params.type === "bisector") {
      const A = toSVG(params.A),
        B = toSVG(params.B);
      content += `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" stroke="black" stroke-width="2" />`;
      content += `<circle cx="${A.x}" cy="${A.y}" r="3" fill="blue" /><text x="${A.x + 5}" y="${A.y - 5}" font-size="10">A</text>`;
      content += `<circle cx="${B.x}" cy="${B.y}" r="3" fill="blue" /><text x="${B.x + 5}" y="${B.y - 5}" font-size="10">B</text>`;
      if (params.S) {
        const S = toSVG(params.S);
        content += `<circle cx="${S.x}" cy="${S.y}" r="3" fill="red" /><text x="${S.x + 5}" y="${S.y - 10}" font-size="10" fill="red">S</text>`;
      }
      if (params.type === "bisector")
        content += drawLine(params.a_sym, params.b_sym, "green", true);
    }

    if (
      params.type === "line" ||
      params.type === "lines_relative" ||
      params.type === "lines_intersection"
    ) {
      if (params.a !== undefined)
        content += drawLine(params.a, params.b, "blue");
      if (params.a1 !== undefined)
        content += drawLine(params.a1, params.b1, "black");
      if (params.a2 !== undefined)
        content += drawLine(params.a2, params.b2, "blue", true);
      if (params.P) {
        const P = toSVG(params.P);
        content += `<circle cx="${P.x}" cy="${P.y}" r="4" fill="red" /><text x="${P.x + 5}" y="${P.y - 5}" font-size="12">P</text>`;
      }
    }

    if (params.type === "circle") {
      const S = toSVG(params.S);
      content += `<circle cx="${S.x}" cy="${S.y}" r="${params.r * scale}" stroke="blue" stroke-width="2" fill="none" />`;
      content += `<circle cx="${S.x}" cy="${S.y}" r="3" fill="red" /><text x="${S.x + 5}" y="${S.y - 5}" font-size="12">S</text>`;
    }

    if (params.type === "parallelogram_points") {
      const A = toSVG(params.A),
        B = toSVG(params.B),
        C = toSVG(params.C),
        D = toSVG(params.D);
      content += `<polygon points="${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}" stroke="black" fill="none" stroke-width="2" />`;
      content += `<circle cx="${A.x}" cy="${A.y}" r="3" fill="blue"/><text x="${A.x}" y="${A.y - 5}">A</text>`;
      content += `<circle cx="${B.x}" cy="${B.y}" r="3" fill="blue"/><text x="${B.x}" y="${B.y - 5}">B</text>`;
      content += `<circle cx="${C.x}" cy="${C.y}" r="3" fill="blue"/><text x="${C.x}" y="${C.y - 5}">C</text>`;
      content += `<circle cx="${D.x}" cy="${D.y}" r="3" fill="red"/><text x="${D.x}" y="${D.y - 5}">D</text>`;
    }

    if (params.type === "triangle_coords") {
      const A = toSVG(params.A),
        B = toSVG(params.B),
        C = toSVG(params.C);
      content += `<polygon points="${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}" stroke="black" fill="rgba(0,0,255,0.1)" stroke-width="2" />`;
      content += `<circle cx="${A.x}" cy="${A.y}" r="3" fill="black"/><text x="${A.x}" y="${A.y + 15}">A</text>`;
      content += `<circle cx="${B.x}" cy="${B.y}" r="3" fill="black"/><text x="${B.x}" y="${B.y + 15}">B</text>`;
      content += `<circle cx="${C.x}" cy="${C.y}" r="3" fill="black"/><text x="${C.x}" y="${C.y - 5}">C</text>`;
    }

    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff"><line x1="0" y1="${center}" x2="${size}" y2="${center}" stroke="#aaa" stroke-width="1" /><line x1="${center}" y1="0" x2="${center}" y2="${size}" stroke="#aaa" stroke-width="1" />${content}</svg>`;
  }
}

module.exports = AnalyticSVGUtils;
