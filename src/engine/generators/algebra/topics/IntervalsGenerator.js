const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class IntervalsGenerator extends BaseGenerator {
  generateAbsValueProblem() {
    // |x - a| < b
    let centerRange, radiusRange;

    if (this.difficulty === "easy") {
      centerRange = [-3, 3];
      radiusRange = [1, 4];
    } else if (this.difficulty === "hard") {
      centerRange = [-10, 10];
      radiusRange = [5, 12];
    } else {
      centerRange = [-5, 5];
      radiusRange = [1, 6];
    }

    const a = MathUtils.randomInt(centerRange[0], centerRange[1]);
    const b = MathUtils.randomInt(radiusRange[0], radiusRange[1]);
    const sign = MathUtils.randomElement(["<", ">", "\\le", "\\ge"]);

    const x1 = a - b;
    const x2 = a + b;
    const isInside = sign === "<" || sign === "\\le";
    const isClosed = sign === "\\le" || sign === "\\ge";

    const bL = isClosed ? "\\langle" : "(";
    const bR = isClosed ? "\\rangle" : ")";

    const interval = isInside
      ? `${bL} ${x1}, ${x2} ${bR}`
      : `(- \\infty, ${x1} ${bR} \\cup ${bL} ${x2}, \\infty)`;

    return this.createResponse({
      question:
        "Zbiór rozwiązań nierówności jest zaznaczony na osi liczbowej. Wybierz poprawny zbiór.",
      latex: `|x - (${a})| ${sign} ${b}`
        .replace("- (-", "+ ")
        .replace("- (", "- "),
      image: this.generateNumberLineSVG({
        center: a,
        points: [x1, x2],
        isInside,
        isClosed,
        type: "inequality",
      }),
      variables: { a, b, sign },
      correctAnswer: `x \\in ${interval}`,
      distractors: [
        isInside
          ? `x \\in (- \\infty, ${x1} ${bR} \\cup ${bL} ${x2}, \\infty)`
          : `x \\in ${bL} ${x1}, ${x2} ${bR}`,
        `x \\in ${bL} ${-b}, ${b} ${bR}`,
      ],
      steps: [
        `Środek przedziału to $$a = ${a}$$, a promień (odległość od środka) to $$b = ${b}$$.`,
        `Szukamy liczb, których odległość od $$${a}$$ jest ${isInside ? "mniejsza" : "większa"} ${isClosed ? "lub równa" : ""} $$${b}$$.`,
        `Odp: $$${interval}$$`,
      ],
    });
  }

  generateIntervalOpsProblem() {
    // A u B / A n B
    let range;
    if (this.difficulty === "easy") {
      range = [-3, 3];
    } else if (this.difficulty === "hard") {
      range = [-8, 8];
    } else {
      range = [-5, 5];
    }

    const a = MathUtils.randomInt(range[0], range[1]);
    const offset =
      this.difficulty === "hard"
        ? MathUtils.randomInt(-1, 3)
        : MathUtils.randomInt(-2, 4);

    const b = a + offset;

    const closedA = MathUtils.randomElement([true, false]);
    const closedB = MathUtils.randomElement([true, false]);
    const op = MathUtils.randomElement(["union", "intersection"]);
    const opSymbol = op === "union" ? "\\cup" : "\\cap";

    const bracketA = closedA ? "\\rangle" : ")";
    const bracketB = closedB ? "\\langle" : "(";

    let result = "";
    // A = (-inf, a>
    // B = <b, inf)

    if (b > a) {
      // A ... a   b ... B
      if (op === "intersection") result = `\\emptyset`;
      else
        result = `(- \\infty, ${a} ${bracketA} \\cup ${bracketB} ${b}, \\infty)`;
    } else if (b === a) {
      if (op === "intersection") {
        if (closedA && closedB) result = `\\{ ${a} \\}`;
        else result = `\\emptyset`;
      } else {
        if (!closedA && !closedB)
          result = `(- \\infty, ${a}) \\cup (${a}, \\infty)`;
        else result = `\\mathbb{R}`;
      }
    } else {
      // <b, a>
      if (op === "intersection") result = `${bracketB} ${b}, ${a} ${bracketA}`;
      else result = `\\mathbb{R}`;
    }

    return this.createResponse({
      question: `Wyznacz $$A ${opSymbol} B$$ dla przedziałów z rysunku.`,
      latex: null,
      image: this.generateNumberLineSVG({
        type: "sets",
        a,
        b,
        closedA,
        closedB,
        op,
      }),
      variables: { a, b, op },
      correctAnswer: result,
      distractors: [
        `\\emptyset`,
        `\\mathbb{R}`,
        `(- \\infty, ${b} ${bracketB}`,
      ],
      steps: [
        `Zaznaczamy przedziały na osi liczbowej.`,
        b > a
          ? `Przedziały są rozłączne.`
          : b === a
            ? `Przedziały stykają się w punkcie $$${a}$$.`
            : `Przedziały zachodzą na siebie.`,
        `Odp: $$${result}$$`,
      ],
    });
  }

  generateNumberLineSVG(params) {
    const size = 300;
    const midY = 50;
    const scale = 20;
    const center = params.center || 0;
    const toSVG = (val) => size / 2 + (val - center) * scale;
    let content = "";

    if (params.type === "inequality") {
      const p1 = toSVG(params.points[0]);
      const p2 = toSVG(params.points[1]);
      const color = "blue";
      if (params.isInside) {
        content += `<line x1="${p1}" y1="${midY}" x2="${p2}" y2="${midY}" stroke="${color}" stroke-width="4" />`;
      } else {
        content += `<line x1="0" y1="${midY}" x2="${p1}" y2="${midY}" stroke="${color}" stroke-width="4" /><line x1="${p2}" y1="${midY}" x2="${size}" y2="${midY}" stroke="${color}" stroke-width="4" />`;
      }
      const fill = params.isClosed ? color : "white";
      content += `<circle cx="${p1}" cy="${midY}" r="5" fill="${fill}" stroke="${color}" stroke-width="2"/><circle cx="${p2}" cy="${midY}" r="5" fill="${fill}" stroke="${color}" stroke-width="2"/>`;
      content += `<text x="${p1 - 5}" y="${midY + 25}" font-size="14">${params.points[0]}</text><text x="${p2 - 5}" y="${midY + 25}" font-size="14">${params.points[1]}</text>`;
    } else if (params.type === "sets") {
      const { a, b, closedA, closedB } = params;
      const pA = toSVG(a);
      const pB = toSVG(b);
      content += `<line x1="0" y1="${midY - 10}" x2="${pA}" y2="${midY - 10}" stroke="blue" stroke-width="3" />`;
      content += `<circle cx="${pA}" cy="${midY - 10}" r="4" fill="${closedA ? "blue" : "white"}" stroke="blue" stroke-width="2"/>`;
      content += `<text x="${pA - 5}" y="${midY - 25}" font-size="12" fill="blue">${a}</text>`;
      content += `<line x1="${pB}" y1="${midY + 10}" x2="${size}" y2="${midY + 10}" stroke="red" stroke-width="3" />`;
      content += `<circle cx="${pB}" cy="${midY + 10}" r="4" fill="${closedB ? "red" : "white"}" stroke="red" stroke-width="2"/>`;
      content += `<text x="${pB - 5}" y="${midY + 35}" font-size="12" fill="red">${b}</text>`;
    }
    return `<svg viewBox="0 0 ${size} 100" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff"><line x1="0" y1="${midY}" x2="${size}" y2="${midY}" stroke="#333" stroke-width="1" /><line x1="${size - 10}" y1="${midY - 5}" x2="${size}" y2="${midY}" stroke="#333" stroke-width="1" /><line x1="${size - 10}" y1="${midY + 5}" x2="${size}" y2="${midY}" stroke="#333" stroke-width="1" />${content}</svg>`;
  }
}

module.exports = IntervalsGenerator;
