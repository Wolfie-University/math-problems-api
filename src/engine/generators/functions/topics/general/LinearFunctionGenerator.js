const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class LinearFunctionGenerator extends BaseGenerator {
  generateLinearRoot() {
    // f(x) = ax + b = 0 -> x = -b/a

    let a_num, a_den, rootRange;

    if (this.difficulty === "easy") {
      a_num = MathUtils.randomElement([1, 2, 3, 4]);
      a_den = 1;
      rootRange = [-5, 5];
    } else if (this.difficulty === "hard") {
      a_num = MathUtils.randomElement([2, 3, 4, 5]);
      a_den = MathUtils.randomElement([3, 5, 7]);
      rootRange = [-8, 8];
    } else {
      a_num = MathUtils.randomElement([1, 2, 3]);
      a_den = MathUtils.randomElement([1, 2]);
      rootRange = [-6, 6];
    }

    const root = MathUtils.randomInt(rootRange[0], rootRange[1]);
    if (Math.random() > 0.5) a_num *= -1;

    const a = a_num / a_den;
    const b = -a * root;
    const formula = this.formatLinear(a, b);

    return this.createResponse({
      question: `Miejscem zerowym funkcji liniowej określonej wzorem $$f(x) = ${formula}$$ jest liczba:`,
      latex: formula,
      image: null,
      variables: { a, b, root },
      correctAnswer: `${root}`,
      distractors: [`${-root}`, `${b}`, `${root + 1}`],
      steps: [
        `Szukamy takiego $$x$$, dla którego $$f(x) = 0$$.`,
        `$$${formula} = 0$$`,
        `$$${this.fractionToLatex(a)}x = ${this.fractionToLatex(-b)}$$`,
        `$$x = ${this.fractionToLatex(-b)} : (${this.fractionToLatex(a)}) = ${root}$$`,
      ],
    });
  }

  generateLinearGraphAnalysis() {
    let rangeA, rangeB;
    if (this.difficulty === "easy") {
      rangeA = [-2, 2];
      rangeB = [-3, 3];
    } else {
      rangeA = [-0.5, 0.5];
      rangeB = [-1, 1];
    }

    let a = MathUtils.randomElement([-2, -1, 1, 2]);
    if (this.difficulty === "hard") a = MathUtils.randomElement([-0.5, 0.5]);

    const b = MathUtils.randomElement([-3, -2, 2, 3]);

    const aSign = a > 0 ? ">" : "<";
    const bSign = b > 0 ? ">" : "<";
    const correct = `$$a ${aSign} 0$$ i $$b ${bSign} 0$$`;

    const wrong1 = `$$a ${aSign === ">" ? "<" : ">"} 0$$ i $$b ${bSign} 0$$`;
    const wrong2 = `$$a ${aSign} 0$$ i $$b ${bSign === ">" ? "<" : ">"} 0$$`;
    const wrong3 = `$$a ${aSign === ">" ? "<" : ">"} 0$$ i $$b ${bSign === ">" ? "<" : ">"} 0$$`;

    return this.createResponse({
      question:
        "Na rysunku przedstawiono wykres funkcji liniowej $$f(x) = ax + b$$. Prawdziwe jest zdanie:",
      latex: ``,
      image: this.generateSVG({ type: "linear_full", a, b }),
      variables: { a, b },
      correctAnswer: correct,
      distractors: [wrong1, wrong2, wrong3],
      steps: [
        `Współczynnik $$a$$ decyduje o monotoniczności. Funkcja jest ${a > 0 ? "rosnąca" : "malejąca"}, więc $$a ${aSign} 0$$.`,
        `Współczynnik $$b$$ to punkt przecięcia z osią $$Oy$$ ($$0, b$$). Punkt ten leży ${b > 0 ? "nad osią" : "pod osią"} $$Ox$$, więc $$b ${bSign} 0$$.`,
      ],
    });
  }

  generateLinearMonotonicityParam() {
    // f(x) = (Am + B)x + C

    let coeffM, constRange;
    if (this.difficulty === "easy") {
      coeffM = MathUtils.randomElement([2, 3]);
      constRange = [-6, 6];
    } else if (this.difficulty === "hard") {
      coeffM = MathUtils.randomElement([-2, -3, -4]);
      constRange = [-12, 12];
    } else {
      coeffM = MathUtils.randomElement([-2, 2]);
      constRange = [-8, 8];
    }

    const constVal = MathUtils.randomInt(constRange[0], constRange[1]);
    const validConst =
      MathUtils.randomInt(1, 4) *
      Math.abs(coeffM) *
      (Math.random() > 0.5 ? 1 : -1);

    const bracket = `${coeffM}m ${validConst >= 0 ? "+" : "-"} ${Math.abs(validConst)}`;
    const type = MathUtils.randomElement(["rosnąca", "malejąca"]);
    const boundary = -validConst / coeffM;

    let finalSign;
    // type=rosnaca -> (coeff)m > -const
    // type=malejaca -> (coeff)m < -const
    // if coeff < 0, reverse sign

    if (type === "rosnąca") {
      finalSign = coeffM > 0 ? ">" : "<";
    } else {
      finalSign = coeffM > 0 ? "<" : ">";
    }

    return this.createResponse({
      question: `Funkcja liniowa $$f(x) = (${bracket})x + 5$$ jest ${type} dla:`,
      latex: ``,
      image: null,
      variables: { coeffM, validConst, type, boundary },
      correctAnswer: `$$m ${finalSign} ${boundary}$$`,
      distractors: [
        `$$m ${finalSign === ">" ? "<" : ">"} ${boundary}$$`,
        `$$m = ${boundary}$$`,
        `$$m ${finalSign} ${-boundary}$$`,
      ],
      steps: [
        `Funkcja liniowa jest ${type}, gdy jej współczynnik kierunkowy $$a$$ jest ${type === "rosnąca" ? "dodatni ($$a>0$$)" : "ujemny ($$a<0$$)"}.`,
        `$$${bracket} ${type === "rosnąca" ? ">" : "<"} 0$$`,
        `$$${coeffM}m ${type === "rosnąca" ? ">" : "<"} ${-validConst}$$`,
        `Dzielimy przez $$${coeffM}$$ ${coeffM < 0 ? "(pamiętając o zmianie znaku!)" : ""}:`,
        `$$m ${finalSign} ${boundary}$$`,
      ],
    });
  }

  generateLinearProperties() {
    const a = MathUtils.randomInt(-5, 5) || 1;
    const b = MathUtils.randomInt(-5, 5);
    const formula = `f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}x ${b >= 0 ? "+" : ""}${b}`;
    const monotonicity = a > 0 ? "rosnąca" : a < 0 ? "malejąca" : "stała";
    const intercept = `(0, ${b})`;

    return this.createResponse({
      question: `Dana jest funkcja liniowa określona wzorem $$${formula}$$. Funkcja ta jest:`,
      latex: formula,
      image: this.generateSVG({ type: "linear", a, b }),
      variables: { a, b },
      correctAnswer: `${monotonicity} i jej wykres przecina oś $$Oy$$ w punkcie $$${intercept}$$`,
      distractors: [
        `${monotonicity} i jej wykres przecina oś $$Oy$$ w punkcie $$(0, ${-b})$$`,
        `${a > 0 ? "malejąca" : "rosnąca"} i jej wykres przecina oś $$Oy$$ w punkcie $$${intercept}$$`,
        `${a > 0 ? "malejąca" : "rosnąca"} i jej wykres przecina oś $$Oy$$ w punkcie $$(${b}, 0)$$`,
      ],
      steps: [
        `Współczynnik kierunkowy $$a = ${a}$$ (${monotonicity}).`,
        `Wyraz wolny $$b = ${b}$$ (punkt $$(0, ${b})$$).`,
      ],
    });
  }

  formatLinear(a, b) {
    const aStr = this.fractionToLatex(a);
    const xPart = aStr === "1" ? "x" : aStr === "-1" ? "-x" : `${aStr}x`;
    const bS =
      b === 0
        ? ""
        : b > 0
          ? `+${this.fractionToLatex(b)}`
          : this.fractionToLatex(b);
    return `${xPart}${bS}`;
  }

  fractionToLatex(val) {
    if (Number.isInteger(val)) return `${val}`;
    if (Math.abs(val - 0.5) < 0.001) return "\\frac{1}{2}";
    if (Math.abs(val + 0.5) < 0.001) return "-\\frac{1}{2}";
    return parseFloat(val.toFixed(2));
  }

  generateSVG(params) {
    const size = 300;
    const center = size / 2;
    const scale = 20;
    let svg = `<line x1="0" y1="${center}" x2="${size}" y2="${center}" stroke="#333" stroke-width="1" /><line x1="${center}" y1="0" x2="${center}" y2="${size}" stroke="#333" stroke-width="1" /><text x="${size - 15}" y="${center + 15}">x</text><text x="${center + 10}" y="15">y</text>`;

    if (params.type === "linear" || params.type === "linear_full") {
      const a = params.a;
      const b = params.b;
      const x1 = -10,
        y1 = a * x1 + b;
      const x2 = 10,
        y2 = a * x2 + b;
      const p1 = { x: center + x1 * scale, y: center - y1 * scale };
      const p2 = { x: center + x2 * scale, y: center - y2 * scale };
      svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="blue" stroke-width="2" />`;
    }
    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">${svg}</svg>`;
  }
}

module.exports = LinearFunctionGenerator;
