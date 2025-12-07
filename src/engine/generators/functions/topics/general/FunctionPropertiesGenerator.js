const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class FunctionPropertiesGenerator extends BaseGenerator {
  generatePointBelongsParam() {
    let type, coeffRange, pointRange;

    if (this.difficulty === "easy") {
      type = "quadratic";
      coeffRange = [-2, 2];
      pointRange = [-3, 3];
    } else if (this.difficulty === "hard") {
      type = MathUtils.randomElement(["rational", "quadratic"]);
      coeffRange = [-8, 8];
      pointRange = [-8, 8];
    } else {
      type = "rational";
      coeffRange = [-5, 5];
      pointRange = [-5, 5];
    }

    let formula, x0, m, stepsCalc;

    if (type === "rational") {
      let a = MathUtils.randomInt(coeffRange[0], coeffRange[1]);
      if (a === 0) a = 2;

      const b = MathUtils.randomInt(coeffRange[0], coeffRange[1]);

      const divisors = [];
      for (let i = 1; i <= Math.abs(a); i++) {
        if (a % i === 0) {
          divisors.push(i);
          divisors.push(-i);
        }
      }
      x0 = MathUtils.randomElement(divisors);
      m = a / x0 + b;

      formula = `f(x) = \\frac{${a}}{x} ${b >= 0 ? "+" : ""}${b === 0 ? "" : b}`;
      stepsCalc = `$$f(${x0}) = \\frac{${a}}{${x0}} ${b >= 0 ? "+" : ""}${b === 0 ? "" : b} = ${a / x0} ${b >= 0 ? "+" : ""}${b === 0 ? "" : b} = ${m}$$`;
    } else {
      // f(x) = (x-p)^2 + q
      const p = MathUtils.randomInt(coeffRange[0], coeffRange[1]);
      const q = MathUtils.randomInt(coeffRange[0], coeffRange[1]);
      x0 = MathUtils.randomInt(pointRange[0], pointRange[1]);
      m = Math.pow(x0 - p, 2) + q;

      formula = `f(x) = (x ${p > 0 ? "-" : "+"} ${Math.abs(p)})^2 ${q >= 0 ? "+" : ""}${q}`;
      stepsCalc = `$$f(${x0}) = (${x0} ${p > 0 ? "-" : "+"} ${Math.abs(p)})^2 ${q >= 0 ? "+" : ""}${q} = (${x0 - p})^2 ${q >= 0 ? "+" : ""}${q} = ${Math.pow(x0 - p, 2)} ${q >= 0 ? "+" : ""}${q} = ${m}$$`;
    }

    return this.createResponse({
      question: `Punkt $$A = (${x0}, m)$$ należy do wykresu funkcji $$${formula}$$. Zatem:`,
      latex: null,
      image: null,
      variables: { x0, m },
      correctAnswer: `m = ${m}`,
      distractors: [`m = ${m + 1}`, `m = ${-m}`, `m = 0`],
      steps: [
        `Skoro punkt $$A$$ należy do wykresu, to jego współrzędne spełniają równanie funkcji.`,
        `Podstawiamy $$x = ${x0}$$ i $$y = m$$.`,
        stepsCalc,
        `$$m = ${m}$$`,
      ],
      questionType: "closed",
    });
  }

  generateReadGraphProperties() {
    let segmentsCount, rangeXY;
    if (this.difficulty === "easy") {
      segmentsCount = 2;
      rangeXY = [-4, 4];
    } else if (this.difficulty === "hard") {
      segmentsCount = 5;
      rangeXY = [-8, 8];
    } else {
      segmentsCount = 3;
      rangeXY = [-6, 6];
    }

    const points = [];
    let currX = rangeXY[0];
    let currY = MathUtils.randomInt(rangeXY[0], rangeXY[1]);
    points.push({ x: currX, y: currY });

    for (let i = 0; i < segmentsCount; i++) {
      currX += MathUtils.randomInt(2, 4);
      if (currX > rangeXY[1]) {
        currX = rangeXY[1];
      }

      currY = MathUtils.randomInt(rangeXY[0], rangeXY[1]);
      points.push({ x: currX, y: currY });
      if (currX >= rangeXY[1]) break;
    }

    const ys = points.map((p) => p.y);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const range = `\\langle ${minY}, ${maxY} \\rangle`;

    return this.createResponse({
      question:
        "Na rysunku przedstawiono wykres funkcji $$y=f(x)$$. Zbiorem wartości tej funkcji jest:",
      latex: ``,
      image: this.generateSVG({ type: "polyline", points }),
      variables: { points, minY, maxY },
      correctAnswer: range,
      distractors: [
        `\\langle ${points[0].x}, ${points[points.length - 1].x} \\rangle`,
        `\\langle ${minY - 1}, ${maxY + 1} \\rangle`,
        `\\langle ${minY}, ${maxY})`,
      ],
      steps: [
        `Odczytujemy z osi $$Oy$$ najniższy i najwyższy punkt wykresu.`,
        `Najmniejsza wartość: $$y_{min} = ${minY}$$`,
        `Największa wartość: $$y_{max} = ${maxY}$$`,
        `Funkcja jest ciągła (połączone odcinki), więc zbiór wartości to $$${range}$$`,
      ],
      questionType: "closed",
    });
  }

  generateFunctionDomain() {
    let range;
    let polynomialProb;

    if (this.difficulty === "easy") {
      range = [-3, 3];
      polynomialProb = 0.0;
    } else if (this.difficulty === "hard") {
      range = [-9, 9];
      polynomialProb = 1.0;
    } else {
      range = [-5, 5];
      polynomialProb = 0.5;
    }

    const x1 = MathUtils.randomInt(range[0], range[1]);
    let x2 = MathUtils.randomInt(range[0], range[1]);
    while (x1 === x2) x2 = MathUtils.randomInt(range[0], range[1]);

    const showPolynomial = Math.random() < polynomialProb;
    let denominatorLatex;

    if (showPolynomial) {
      const b = -(x1 + x2);
      const c = x1 * x2;
      denominatorLatex = MathUtils.formatPolynomial(1, b, c);
    } else {
      const p1 = x1 > 0 ? `(x-${x1})` : `(x+${Math.abs(x1)})`;
      const p2 = x2 > 0 ? `(x-${x2})` : `(x+${Math.abs(x2)})`;
      denominatorLatex = `${p1}${p2}`;
    }

    return this.createResponse({
      question: `Dziedziną funkcji $$f$$ określonej wzorem $$f(x) = \\frac{2x+1}{${denominatorLatex}}$$ jest zbiór liczb rzeczywistych z wyłączeniem jakich liczb?`,
      latex: null,
      image: null,
      variables: { x1, x2 },
      correctAnswer: `\\{${Math.min(x1, x2)}, ${Math.max(x1, x2)}\\}`,
      distractors: [
        `\\{${Math.min(-x1, -x2)}, ${Math.max(-x1, -x2)}\\}`,
        `\\{${x1}\\}`,
        `\\mathbb{R}`,
      ],
      steps: [
        `Mianownik musi być różny od zera.`,
        `Miejsca zerowe mianownika: $$${x1}, ${x2}$$`,
        `Te liczby musimy wyrzucić ze zbioru liczb rzeczywistych.`,
      ],
      questionType: "open",
      answerFormat: "{x_1, x_2}",
    });
  }

  generateFunctionValue() {
    let coeffRange, xRange;
    if (this.difficulty === "easy") {
      coeffRange = [-2, 2];
      xRange = [0, 3];
    } else if (this.difficulty === "hard") {
      coeffRange = [-6, 6];
      xRange = [-5, 5];
    } else {
      coeffRange = [-4, 4];
      xRange = [-3, 3];
    }

    const a = MathUtils.randomInt(xRange[0], xRange[1]);
    const c1 = MathUtils.randomInt(coeffRange[0], coeffRange[1]) || 1;
    const c2 = MathUtils.randomInt(coeffRange[0], coeffRange[1]);
    const c3 = MathUtils.randomInt(coeffRange[0], coeffRange[1]);

    const formula = MathUtils.formatPolynomial(c1, c2, c3);
    const result = c1 * a * a + c2 * a + c3;

    return this.createResponse({
      question: `Dana jest funkcja $$f(x) = ${formula}$$. Wartość tej funkcji dla argumentu $$x=${a}$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { a, c1, c2, c3 },
      correctAnswer: `${result}`,
      distractors: [`${result + c1}`, `${-result}`, `${result - 10}`],
      steps: [
        `Podstawiamy $$x = ${a}$$ do wzoru funkcji.`,
        `$$f(${a}) = ${result}$$`,
      ],
      questionType: "closed",
    });
  }

  generateSVG(params) {
    const size = 300;
    const center = size / 2;
    const scale = 20;
    let svg = `<line x1="0" y1="${center}" x2="${size}" y2="${center}" stroke="#333" stroke-width="1" /><line x1="${center}" y1="0" x2="${center}" y2="${size}" stroke="#333" stroke-width="1" /><text x="${size - 15}" y="${center + 15}">x</text><text x="${center + 10}" y="15">y</text>`;
    if (params.type === "polyline") {
      let pts = "";
      params.points.forEach((p) => {
        const sx = center + p.x * scale;
        const sy = center - p.y * scale;
        pts += `${sx},${sy} `;
        svg += `<circle cx="${sx}" cy="${sy}" r="3" fill="blue" />`;
      });
      svg += `<polyline points="${pts}" fill="none" stroke="blue" stroke-width="2" />`;
    }
    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">${svg}</svg>`;
  }
}

module.exports = FunctionPropertiesGenerator;
