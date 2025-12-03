class StereometrySVGUtils {
  static generateSVG(params) {
    const size = 300;
    const cx = size / 2;
    const cy = size / 2 + 50;

    let scale = 15;
    if (params.h > 8 || params.a > 8) scale = 12;
    if (params.h > 12) scale = 10;

    let content = "";
    const line = (x1, y1, x2, y2, dashed = false, color = "black") =>
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" ${dashed ? 'stroke-dasharray="4"' : ""} />`;
    const text = (x, y, str) =>
      `<text x="${x}" y="${y}" font-size="14" font-weight="bold" fill="black" style="text-shadow: 1px 1px 2px white;">${str}</text>`;

    if (
      params.type === "cube" ||
      params.type === "cuboid_angle" ||
      params.type === "cuboid_diagonal"
    ) {
      const a = (params.a || 4) * scale;
      const h = params.c ? params.c * scale : a;
      const slant = a * 0.5;

      const A = { x: cx - a / 2, y: cy };
      const B = { x: cx + a / 2, y: cy };
      const C = { x: cx + a / 2 + slant, y: cy - slant };
      const D = { x: cx - a / 2 + slant, y: cy - slant };
      const A1 = { x: A.x, y: A.y - h };
      const B1 = { x: B.x, y: B.y - h };
      const C1 = { x: C.x, y: C.y - h };
      const D1 = { x: D.x, y: D.y - h };

      content +=
        line(A.x, A.y, B.x, B.y) +
        line(B.x, B.y, C.x, C.y) +
        line(C.x, C.y, C1.x, C1.y);
      content +=
        line(A.x, A.y, A1.x, A1.y) +
        line(B.x, B.y, B1.x, B1.y) +
        line(A1.x, A1.y, B1.x, B1.y);
      content +=
        line(B1.x, B1.y, C1.x, C1.y) +
        line(C1.x, C1.y, D1.x, D1.y) +
        line(D1.x, D1.y, A1.x, A1.y);
      content +=
        line(A.x, A.y, D.x, D.y, true) +
        line(C.x, C.y, D.x, D.y, true) +
        line(D.x, D.y, D1.x, D1.y, true);

      if (params.type === "cuboid_angle") {
        content += line(B.x, B.y, D.x, D.y, true, "blue"); // przekatna podstawy
        content += line(B.x, B.y, D1.x, D1.y, false, "red"); // przekatna bryly
        content += line(D.x, D.y, D1.x, D1.y, true, "blue"); // wysokosc
        content += text(B.x - 20, B.y - 5, "α");
      } else if (params.type === "cuboid_diagonal") {
        content += line(A.x, A.y, C1.x, C1.y, true, "red"); // przekatna
      } else {
        content += line(A.x, A.y, C1.x, C1.y, false, "red"); // przekatna szescianu
      }
    } else if (
      params.type === "pyramid_square" ||
      params.type === "pyramid_face_angle"
    ) {
      const a = params.a * scale;
      const h = a * 1.5;
      const slant = a * 0.5;

      const A = { x: cx - a / 2, y: cy };
      const B = { x: cx + a / 2, y: cy };
      const C = { x: cx + a / 2 + slant, y: cy - slant };
      const D = { x: cx - a / 2 + slant, y: cy - slant };
      const S = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };
      const Top = { x: S.x, y: S.y - h };

      content += line(A.x, A.y, B.x, B.y) + line(B.x, B.y, C.x, C.y);
      content +=
        line(A.x, A.y, Top.x, Top.y) +
        line(B.x, B.y, Top.x, Top.y) +
        line(C.x, C.y, Top.x, Top.y);
      content +=
        line(A.x, A.y, D.x, D.y, true) +
        line(C.x, C.y, D.x, D.y, true) +
        line(D.x, D.y, Top.x, Top.y, true);

      if (params.type === "pyramid_face_angle") {
        const midBC = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };
        content += line(S.x, S.y, Top.x, Top.y, true, "blue"); // H
        content += line(S.x, S.y, midBC.x, midBC.y, true, "blue"); // a/2
        content += line(Top.x, Top.y, midBC.x, midBC.y, false, "red"); // h_boczna
        content += text(midBC.x - 20, midBC.y + 5, "α");
      } else {
        content += line(S.x, S.y, Top.x, Top.y, true, "blue"); // H
        content += line(S.x, S.y, C.x, C.y, true, "blue"); // d/2
        content += text(C.x - 15, C.y - 5, "α");
      }
    } else if (
      params.type === "pyramid_triangle" ||
      params.type === "prism_triangle"
    ) {
      const a = params.a * scale;
      const h = params.H ? params.H * scale : a * 1.2;
      const A = { x: cx - a / 2, y: cy };
      const B = { x: cx + a / 2, y: cy };
      const C = { x: cx, y: cy - a * 0.6 };

      if (params.type === "prism_triangle") {
        const A1 = { x: A.x, y: A.y - h };
        const B1 = { x: B.x, y: B.y - h };
        const C1 = { x: C.x, y: C.y - h };
        content +=
          line(A.x, A.y, B.x, B.y) +
          line(A.x, A.y, A1.x, A1.y) +
          line(B.x, B.y, B1.x, B1.y);
        content +=
          line(A1.x, A1.y, B1.x, B1.y) +
          line(B1.x, B1.y, C1.x, C1.y) +
          line(C1.x, C1.y, A1.x, A1.y);
        content +=
          line(A.x, A.y, C.x, C.y, true) +
          line(B.x, B.y, C.x, C.y, true) +
          line(C.x, C.y, C1.x, C1.y, true);
      } else {
        const S = { x: cx, y: cy - a * 0.2 };
        const Top = { x: S.x, y: S.y - h };
        content +=
          line(A.x, A.y, B.x, B.y) +
          line(A.x, A.y, Top.x, Top.y) +
          line(B.x, B.y, Top.x, Top.y);
        content +=
          line(A.x, A.y, C.x, C.y, true) +
          line(B.x, B.y, C.x, C.y, true) +
          line(C.x, C.y, Top.x, Top.y, true);
        const midAB = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
        content += line(S.x, S.y, Top.x, Top.y, true, "red");
        content += line(S.x, S.y, midAB.x, midAB.y, true, "red");
        content += line(Top.x, Top.y, midAB.x, midAB.y, false, "red");
      }
    } else if (params.type === "sphere") {
      const r = params.r * scale * 1.5;
      content += `<circle cx="${cx}" cy="${cy - r / 2}" r="${r}" stroke="black" fill="none" stroke-width="2"/>`;
      content += `<ellipse cx="${cx}" cy="${cy - r / 2}" rx="${r}" ry="${r / 4}" stroke="black" fill="none" stroke-dasharray="4"/>`;
      content += text(cx + 5, cy - r / 2, "r");
      content += line(cx, cy - r / 2, cx + r, cy - r / 2, true, "red");
    } else if (params.type === "cone") {
      const r = params.r * scale;
      const h = params.h * scale;
      content += `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r / 3}" stroke="black" fill="none" stroke-width="2" />`;
      content += line(cx - r, cy, cx, cy - h) + line(cx + r, cy, cx, cy - h);
      content +=
        line(cx, cy, cx, cy - h, true, "blue") +
        line(cx, cy, cx + r, cy, true, "blue");
      content +=
        text(cx + 5, cy - h / 2, "h") +
        text(cx + r / 2, cy + 15, "r") +
        text(cx + r / 2 + 10, cy - h / 2, "l");
    } else if (
      params.type === "cylinder" ||
      params.type === "cylinder_section"
    ) {
      const r = params.r * scale;
      const h = params.h * scale;
      content += `<ellipse cx="${cx}" cy="${cy - h}" rx="${r}" ry="${r / 3}" stroke="black" fill="white" stroke-width="2" />`;
      content += `<path d="M ${cx - r} ${cy} A ${r} ${r / 3} 0 0 0 ${cx + r} ${cy}" stroke="black" fill="none" stroke-width="2" />`;
      content += `<path d="M ${cx - r} ${cy} A ${r} ${r / 3} 0 0 1 ${cx + r} ${cy}" stroke="black" fill="none" stroke-width="2" stroke-dasharray="4" />`;
      content +=
        line(cx - r, cy - h, cx - r, cy) + line(cx + r, cy - h, cx + r, cy);
      if (params.type === "cylinder_section") {
        content += `<rect x="${cx - r}" y="${cy - h}" width="${2 * r}" height="${h}" fill="rgba(0,0,255,0.1)" stroke="none" />`;
        content += line(cx - r, cy - h, cx + r, cy, true, "red");
      } else {
        content += `<rect x="${cx - r}" y="${cy - h}" width="${2 * r}" height="${h}" fill="rgba(0,0,255,0.1)" stroke="none" />`;
      }
    }

    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">${content}</svg>`;
  }
}

module.exports = StereometrySVGUtils;
