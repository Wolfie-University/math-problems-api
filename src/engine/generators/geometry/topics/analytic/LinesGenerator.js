const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const AnalyticSVGUtils = require("./AnalyticSVGUtils");

class LinesGenerator extends BaseGenerator {
  generateLineThroughTwoPoints() {
    // y = ax + b through A, B
    let dxRange, dyRange;

    if (this.difficulty === "easy") {
      dxRange = [1, 1];
      dyRange = [-3, 3];
    } else if (this.difficulty === "hard") {
      dxRange = [2, 5];
      dyRange = [-5, 5];
    } else {
      dxRange = [1, 3];
      dyRange = [-4, 4];
    }

    const x1 = MathUtils.randomInt(-5, 5);
    const y1 = MathUtils.randomInt(-5, 5);
    const dx = MathUtils.randomInt(dxRange[0], dxRange[1]);
    const dy = MathUtils.randomInt(dyRange[0], dyRange[1]);

    if (dx === 0) return this.generateLineThroughTwoPoints();
    if (dy === 0 && this.difficulty !== "easy")
      return this.generateLineThroughTwoPoints();

    const x2 = x1 + dx;
    const y2 = y1 + dy;
    const a = dy / dx;
    const b = y1 - a * x1;

    const A = { x: x1, y: y1 };
    const B = { x: x2, y: y2 };

    const eq = this.formatLineEquation(a, b);

    return this.createResponse({
      question: "Podaj równanie prostej przechodzącej przez punkty:",
      latex: `A=(${A.x}, ${A.y}), B=(${B.x}, ${B.y})`,
      image: null,
      variables: { A, B, a, b },
      correctAnswer: `y = ${eq}`,
      distractors: [
        `y = ${this.formatLineEquation(-a, b)}`,
        `y = ${this.formatLineEquation(a, -b)}`,
        `y = ${this.formatLineEquation(b, a)}`,
      ],
      steps: [
        `$$a = \\frac{y_B - y_A}{x_B - x_A} = \\frac{${B.y}-${A.y}}{${B.x}-${A.x}} = ${this.fractionToLatex(a)}$$`,
        `$$b = y_A - a x_A = ${A.y} - (${this.fractionToLatex(a)})\\cdot${A.x} = ${this.fractionToLatex(b)}$$`,
        `$$y = ${eq}$$`,
      ],
    });
  }

  generateParallelLine() {
    return this.generateRelativeLine("parallel");
  }
  generatePerpendicularLine() {
    return this.generateRelativeLine("perpendicular");
  }

  generateRelativeLine(mode) {
    let aNumRange, aDenRange;

    if (this.difficulty === "easy") {
      aNumRange = [-3, 3];
      aDenRange = [1, 1];
    } else if (this.difficulty === "hard") {
      aNumRange = [-5, 5];
      aDenRange = [2, 5];
    } else {
      aNumRange = [-2, 2];
      aDenRange = [1, 2];
    }

    let a1_num = MathUtils.randomInt(aNumRange[0], aNumRange[1]);
    if (a1_num === 0) a1_num = 1;
    let a1_den = MathUtils.randomInt(aDenRange[0], aDenRange[1]);

    const a1 = a1_num / a1_den;
    const b1 = MathUtils.randomInt(-5, 5);
    const P = {
      x: MathUtils.randomInt(-3, 3) * a1_den,
      y: MathUtils.randomInt(-5, 5),
    };

    const a2 = mode === "parallel" ? a1 : -1 / a1;
    const b2 = P.y - a2 * P.x;

    const eq1 = this.formatLineEquation(a1, b1);
    const eq2 = this.formatLineEquation(a2, b2);

    return this.createResponse({
      question: `Wyznacz równanie prostej $$l$$ przechodzącej przez punkt $$P=(${P.x}, ${P.y})$$ i ${mode === "parallel" ? "równoległej" : "prostopadłej"} do prostej $$k$$:`,
      latex: `k: y=${eq1}`,
      image: null,
      variables: { a2, b2 },
      correctAnswer: `l: y=${eq2}`,
      distractors: [
        `l: y = ${this.formatLineEquation(a1, b2)}`,
        `l: y = ${this.formatLineEquation(-a2, b2)}`,
        `l: y = ${this.formatLineEquation(1 / a2, b2)}`,
      ],
      steps: [
        `Współczynnik kierunkowy prostej $$k$$: $$a_1 = ${this.fractionToLatex(a1)}$$`,
        mode === "parallel"
          ? `Dla prostej równoległej: $$a_2 = a_1 = ${this.fractionToLatex(a2)}$$`
          : `Dla prostej prostopadłej: $$a_2 = -\\frac{1}{a_1} = ${this.fractionToLatex(a2)}$$`,
        `Podstawiamy punkt $$P$$: $$${P.y} = ${this.fractionToLatex(a2)} \\cdot (${P.x}) + b_2$$`,
        `$$b_2 = ${this.fractionToLatex(b2)}$$`,
        `$$y = ${eq2}$$`,
      ],
      questionType: "open",
      answerFormat: "l: y=...",
    });
  }

  generateParameterMProblem() {
    const mode = MathUtils.randomElement(["parallel", "perpendicular"]);
    const m = MathUtils.randomInt(-3, 3);

    let a1_coeff, a2_val;

    if (this.difficulty === "easy") {
      a1_coeff = 2; // 2m
      a2_val = mode === "parallel" ? 2 * m : -1 / (2 * m);
    } else {
      a1_coeff = MathUtils.randomElement([2, 3, 4]);
    }

    // a1 = Coeff * m + Const
    // a2 = Val
    // Parallel: a1 = a2. Perp: a1*a2 = -1.

    const a1_const = MathUtils.randomInt(-2, 2);

    // Parallel: a2 = coeff*m + const
    // Perp: a2 = -1 / (coeff*m + const)

    let a2;
    if (mode === "parallel") {
      a2 = a1_coeff * m + a1_const;
    } else {
      const denominator = a1_coeff * m + a1_const;
      if (denominator === 0) return this.generateParameterMProblem();
      a2 = -1.0 / denominator;
    }

    const a2_latex = this.fractionToLatex(a2);

    return this.createResponse({
      question: `Proste $$l$$ i $$k$$ są ${mode === "parallel" ? "równoległe" : "prostopadłe"}. Oblicz parametr $$m$$.`,
      latex: `l: y=(${a1_coeff}m ${a1_const >= 0 ? "+" : ""}${a1_const})x+1, \\quad k: y=${a2_latex}x-2`,
      image: null,
      variables: { m },
      correctAnswer: `m=${m}`,
      distractors: [`m=${m + 1}`, `m=${-m}`, `m=0`],
      steps: [
        `Współczynniki kierunkowe: $$a_1 = ${a1_coeff}m ${a1_const >= 0 ? "+" : ""}${a1_const}$$, $$a_2 = ${a2_latex}$$`,
        `Warunek: $${mode === "parallel" ? "a_1=a_2" : "a_1 a_2 = -1"}$$`,
        `Rozwiązanie równania daje $$m=${m}$$`,
      ],
      questionType: "open",
      answerFormat: "m=...",
    });
  }

  generateIntersectionProblem() {
    let range;
    if (this.difficulty === "easy") range = [-2, 2];
    else range = [-5, 5];

    const intX = MathUtils.randomInt(range[0], range[1]);
    const intY = MathUtils.randomInt(range[0], range[1]);

    const a1 = 1;
    const b1 = intY - a1 * intX;

    const a2 = -1;
    const b2 = intY - a2 * intX;

    return this.createResponse({
      question:
        "Jakie są współrzędne punktu przecięcia prostych układu równań:",
      latex: `\\begin{cases} y=x${b1 >= 0 ? "+" : ""}${b1} \\\\ y=-x${b2 >= 0 ? "+" : ""}${b2} \\end{cases}`,
      image: null,
      variables: { intX, intY },
      correctAnswer: `(${intX}, ${intY})`,
      distractors: [`(${intY}, ${intX})`, `(0,0)`, `(${intX}, 0)`],
      steps: [
        `$$x${b1 >= 0 ? "+" : ""}${b1} = -x${b2 >= 0 ? "+" : ""}${b2}$$`,
        `$$2x = ${b2 - b1} \\implies x = ${intX}$$`,
        `$$y = ${intX} ${b1 >= 0 ? "+" : ""}${b1} = ${intY}$$`,
      ],
      questionType: "open",
      answerFormat: "(x, y)",
    });
  }

  generateSlopeAngle() {
    const angles = [
      { ang: 30, tan: "\\frac{\\sqrt{3}}{3}", val: Math.sqrt(3) / 3 },
      { ang: 45, tan: "1", val: 1 },
      { ang: 60, tan: "\\sqrt{3}", val: Math.sqrt(3) },
      { ang: 120, tan: "-\\sqrt{3}", val: -Math.sqrt(3) },
      { ang: 135, tan: "-1", val: -1 },
      { ang: 150, tan: "-\\frac{\\sqrt{3}}{3}", val: -Math.sqrt(3) / 3 },
    ];

    let availableAngles = angles;
    if (this.difficulty === "easy") {
      availableAngles = angles.filter((x) => x.ang === 45 || x.ang === 135);
    }

    const sel = MathUtils.randomElement(availableAngles);
    const angle = sel.ang;
    const b = MathUtils.randomInt(-4, 4);

    const aStr = sel.tan;
    const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const eq =
      aStr === "1"
        ? `x ${bStr}`
        : aStr === "-1"
          ? `-x ${bStr}`
          : `${aStr}x ${bStr}`;

    const candidates = [
      180 - angle,
      Math.abs(90 - angle),
      angle > 90 ? angle - 90 : angle + 90,
      angle + 30,
      angle - 30,
      180 - (angle + 30),
      30,
      45,
      60,
      120,
      135,
      150,
    ];

    const uniqueDistractors = [];
    const usedValues = new Set();
    usedValues.add(angle);

    for (const cand of candidates) {
      if (!usedValues.has(cand) && cand > 0 && cand < 180) {
        uniqueDistractors.push(`${cand}^\\circ`);
        usedValues.add(cand);
      }
      if (uniqueDistractors.length === 3) break;
    }

    let fallbackAngle = 10;
    while (uniqueDistractors.length < 3) {
      if (!usedValues.has(fallbackAngle)) {
        uniqueDistractors.push(`${fallbackAngle}^\\circ`);
        usedValues.add(fallbackAngle);
      }
      fallbackAngle += 10;
    }

    return this.createResponse({
      question: `Prosta o równaniu $$y = ${eq}$$ tworzy z osią $$Ox$$ kąt $$\\alpha$$. Miara tego kąta jest równa:`,
      latex: ``,
      image: null,
      variables: { angle: sel.ang, a_latex: sel.tan },
      correctAnswer: `${sel.ang}^\\circ`,
      distractors: uniqueDistractors,
      steps: [
        `Współczynnik kierunkowy $$a = \\tg\\alpha$$.`,
        `$$a = ${sel.tan} \\implies \\alpha = ${sel.ang}^\\circ$$`,
      ],
      questionType: "closed",
    });
  }

  generatePointOnLineParam() {
    const a = MathUtils.randomInt(-3, 3) || 1;
    const b = MathUtils.randomInt(-5, 5);
    const x = MathUtils.randomInt(-4, 4);
    const y = a * x + b;
    const eq = this.formatLineEquation(a, b);

    const candidates = [-y, x, a * x, b, y + 1, y - 1, a + b];

    const uniqueDistractors = [];
    const usedValues = new Set();
    usedValues.add(y);

    for (const cand of candidates) {
      if (!usedValues.has(cand)) {
        uniqueDistractors.push(`${cand}`);
        usedValues.add(cand);
      }
      if (uniqueDistractors.length === 3) break;
    }

    let offset = 2;
    while (uniqueDistractors.length < 3) {
      const val = y + offset;
      if (!usedValues.has(val)) {
        uniqueDistractors.push(`${val}`);
        usedValues.add(val);
      }
      offset = offset > 0 ? -offset : -offset + 1;
    }

    return this.createResponse({
      question: `Punkt $$P=(${x}, m)$$ należy do wykresu funkcji liniowej $$y=${eq}$$. Liczba $$m$$ jest równa:`,
      latex: null,
      image: null,
      variables: { a, b, x, m_val: y },
      correctAnswer: `${y}`,
      distractors: uniqueDistractors,
      steps: [
        `Podstawiamy $$x=${x}$$ do wzoru:`,
        `$$m = ${a}\\cdot(${x}) ${b >= 0 ? "+" : ""}${b} = ${y}$$`,
      ],
      questionType: "closed",
    });
  }

  generateIntersectionWithAxes() {
    const b = MathUtils.randomInt(-6, 6);
    const root = MathUtils.randomInt(-6, 6);

    if (root === 0) return this.generateIntersectionWithAxes();

    const a = -b / root;

    if (this.difficulty !== "hard" && !Number.isInteger(a))
      return this.generateIntersectionWithAxes();

    const axis = MathUtils.randomElement(["Ox", "Oy"]);
    const eq = this.formatLineEquation(a, b);
    return this.createResponse({
      question: `Punkt przecięcia prostej $$y=${eq}$$ z osią $$${axis}$$ ma współrzędne:`,
      latex: ``,
      image: null,
      variables: { a, b, axis },
      correctAnswer: axis === "Oy" ? `(0, ${b})` : `(${root}, 0)`,
      distractors: [
        axis === "Oy" ? `(${b}, 0)` : `(0, ${root})`,
        `(0, 0)`,
        axis === "Oy" ? `(0, ${-b})` : `(${-root}, 0)`,
      ],
      steps: [
        axis === "Oy"
          ? `$$x=0 \\implies y=${b}$$`
          : `$$y=0 \\implies ax+b=0 \\implies x=${root}$$`,
      ],
      questionType: "open",
      answerFormat: "(x, y)",
    });
  }

  generatePerpendicularCoeff() {
    let num = MathUtils.randomInt(1, 5);
    let den = MathUtils.randomInt(1, 5);

    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    const common = gcd(num, den);
    num /= common;
    den /= common;

    const sign = MathUtils.randomElement([1, -1]);

    const formatForEquation = (n, d, s) => {
      if (d === 1) {
        if (n === 1) return s === 1 ? "" : "-"; // 1 -> "", -1 -> "-"
        return s === 1 ? `${n}` : `-${n}`;
      }
      return (s === 1 ? "" : "-") + `\\frac{${n}}{${d}}`;
    };

    const formatValue = (n, d, s) => {
      if (d === 1) {
        return s === 1 ? `${n}` : `-${n}`;
      }
      return (s === 1 ? "" : "-") + `\\frac{${n}}{${d}}`;
    };

    const a1_eq_latex = formatForEquation(num, den, sign);
    const a1_val_latex = formatValue(num, den, sign);

    const num2 = den;
    const den2 = num;
    const sign2 = -sign;
    const a2_val_latex = formatValue(num2, den2, sign2);

    const candidates = [
      a1_val_latex,
      formatValue(num, den, -sign),
      formatValue(num2, den2, sign),
      "1",
      "-1",
    ];

    const uniqueDistractors = [];
    const usedValues = new Set();
    usedValues.add(a2_val_latex);

    for (const cand of candidates) {
      if (!usedValues.has(cand)) {
        uniqueDistractors.push(cand);
        usedValues.add(cand);
      }
      if (uniqueDistractors.length === 3) break;
    }

    let fallbackNum = 2;
    while (uniqueDistractors.length < 3) {
      const val = `${fallbackNum}`;
      if (!usedValues.has(val)) {
        uniqueDistractors.push(val);
        usedValues.add(val);
      }
      fallbackNum++;
    }

    return this.createResponse({
      question: `Współczynnik kierunkowy prostej prostopadłej do prostej $$y = ${a1_eq_latex}x + 5$$ jest równy:`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: a2_val_latex,
      distractors: uniqueDistractors,
      steps: [
        `Współczynnik kierunkowy danej prostej to $$a_1 = ${a1_val_latex}$$.`,
        `Warunkiem prostopadłości prostych jest $$a_1 \\cdot a_2 = -1$$.`,
        `Szukamy $$a_2$$:`,
        `$$a_2 = -\\frac{1}{a_1} = -\\frac{1}{${a1_val_latex}} = ${a2_val_latex}$$`,
      ],
      questionType: "closed",
    });
  }

  generateBisector() {
    const A = { x: -2, y: 0 };
    const B = { x: 2, y: 4 };
    const S = { x: 0, y: 2 };
    const a_sym = -1;
    const b_sym = 2;
    return this.createResponse({
      question:
        "Wyznacz równanie symetralnej odcinka AB, gdzie A(-2,0) i B(2,4).",
      latex: null,
      image: null,
      variables: { S },
      correctAnswer: `y=-x+2`,
      distractors: [`y=x+2`, `y=-x`, `y=x`],
      steps: [
        `Środek $$S(0,2)$$`,
        `$$a_{AB}=1 \\implies a_{sym}=-1$$`,
        `Podstawiamy S do $$y=-x+b$$`,
      ],
      questionType: "open",
      answerFormat: "y=...",
    });
  }

  generateNiceLinePoints() {
    const x1 = MathUtils.randomInt(-5, 5),
      y1 = MathUtils.randomInt(-5, 5);
    const dx = MathUtils.randomElement([1, 2, 3]),
      dy = MathUtils.randomInt(-4, 4);
    return {
      A: { x: x1, y: y1 },
      B: { x: x1 + dx, y: y1 + dy },
      a: dy / dx,
      b: y1 - (dy / dx) * x1,
    };
  }

  formatLineEquation(a, b) {
    const aStr = this.fractionToLatex(a);
    if (a === 0) return this.fractionToLatex(b);
    let xPart = aStr === "1" ? "x" : aStr === "-1" ? "-x" : `${aStr}x`;
    if (b === 0) return xPart;
    return `${xPart} ${b > 0 ? "+" : "-"} ${this.fractionToLatex(Math.abs(b))}`;
  }

  fractionToLatex(val) {
    if (Number.isInteger(val)) return `${val}`;
    if (Math.abs(val - 0.5) < 0.001) return "\\frac{1}{2}";
    if (Math.abs(val + 0.5) < 0.001) return "-\\frac{1}{2}";
    if (Math.abs(val - 1 / 3) < 0.001) return "\\frac{1}{3}";
    if (Math.abs(val + 1 / 3) < 0.001) return "-\\frac{1}{3}";
    return parseFloat(val.toFixed(2));
  }
}

module.exports = LinesGenerator;
