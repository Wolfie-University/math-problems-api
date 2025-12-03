class SVGUtils {
  static generateSVG({ a, b, c, p, q, x1, x2, highlight, inequalitySign }) {
    const size = 300;
    const center = size / 2;
    let scaleX = 20,
      scaleY = 20,
      shiftY = 0;

    let pathData = "";
    for (let x = -10; x <= 10; x += 0.2) {
      const y = a * x * x + b * x + c;
      const svgX = center + x * scaleX;
      const svgY = center - y * scaleY + shiftY;
      if (svgY >= -size && svgY <= size * 2 && svgX >= 0 && svgX <= size) {
        pathData += `${pathData ? "L" : "M"} ${svgX} ${svgY} `;
      }
    }

    let extras = "";
    if (highlight === "vertex") {
      extras += `<circle cx="${center + p * scaleX}" cy="${center - q * scaleY}" r="4" fill="red" />`;
    } else if (highlight === "roots" || highlight === "roots_axis") {
      if (x1 !== undefined)
        extras += `<circle cx="${center + x1 * scaleX}" cy="${center}" r="4" fill="red" />`;
      if (x2 !== undefined)
        extras += `<circle cx="${center + x2 * scaleX}" cy="${center}" r="4" fill="red" />`;
      if (highlight === "roots_axis")
        extras += `<line x1="${center + p * scaleX}" y1="0" x2="${center + p * scaleX}" y2="${size}" stroke="green" stroke-dasharray="4"/>`;
    } else if (highlight === "axis") {
      extras += `<line x1="${center + p * scaleX}" y1="0" x2="${center + p * scaleX}" y2="${size}" stroke="green" stroke-dasharray="4"/>`;
    } else if (highlight === "inequality") {
      const yAxis = center;
      const x1Pos = center + x1 * scaleX;
      const x2Pos = center + x2 * scaleX;
      const rangeColor = "rgba(0, 255, 0, 0.5)";
      const isParabolaUp = a > 0;
      const isSignGreater = inequalitySign.includes(">");
      if (
        (!isParabolaUp && isSignGreater) ||
        (isParabolaUp && !isSignGreater)
      ) {
        extras += `<line x1="${x1Pos}" y1="${yAxis}" x2="${x2Pos}" y2="${yAxis}" stroke="${rangeColor}" stroke-width="6" />`;
      } else {
        extras += `<line x1="0" y1="${yAxis}" x2="${x1Pos}" y2="${yAxis}" stroke="${rangeColor}" stroke-width="6" />`;
        extras += `<line x1="${x2Pos}" y1="${yAxis}" x2="${size}" y2="${yAxis}" stroke="${rangeColor}" stroke-width="6" />`;
      }
    }

    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
        <path d="M0 ${center} H${size} M${center} 0 V${size}" stroke="#eee" stroke-width="1" />
        <line x1="10" y1="${center}" x2="${size - 10}" y2="${center}" stroke="#333" stroke-width="2" />
        <line x1="${center}" y1="${size - 10}" x2="${center}" y2="10" stroke="#333" stroke-width="2" />
        <path d="${pathData}" stroke="#007bff" stroke-width="2" fill="none" />
        ${extras}
    </svg>`;
  }
}

module.exports = SVGUtils;
