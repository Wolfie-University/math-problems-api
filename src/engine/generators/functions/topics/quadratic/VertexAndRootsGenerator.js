const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const SVGUtils = require("../../../../utils/SVGUtils");

class VertexAndRootsGenerator extends BaseGenerator {
  generateVertexProblem() {
    // p, q -> a, b, c
    let aList, pRange;

    if (this.difficulty === "easy") {
      aList = [-1, 1];
      pRange = [-2, 2];
    } else if (this.difficulty === "hard") {
      aList = [-2, 2, 3];
      pRange = [-6, 6];
    } else {
      aList = [-1, 1, 2];
      pRange = [-4, 4];
    }

    const p = MathUtils.randomInt(pRange[0], pRange[1]);
    const q = MathUtils.randomInt(pRange[0], pRange[1]);
    const a = MathUtils.randomElement(aList);

    const b = -2 * a * p;
    const c = a * p * p + q;

    const formula = `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`;
    return this.createResponse({
      question:
        "Wyznacz współrzędne wierzchołka paraboli będącej wykresem funkcji:",
      latex: formula,
      image: null,
      variables: { a, b, c, p, q },
      correctAnswer: `W(${p}, ${q})`,
      distractors: [`W(${-p}, ${q})`, `W(${q}, ${p})`, `W(${p}, ${c})`],
      steps: [
        `$$p = \\frac{-b}{2a} = \\frac{${-b}}{${2 * a}} = ${p}$$`,
        `$$q = f(p) = ${q}$$`,
      ],
      questionType: "open",
      answerFormat: "W(x, y)",
    });
  }

  generateRootsProblem() {
    let rootRange, aList;

    if (this.difficulty === "easy") {
      rootRange = [-3, 3];
      aList = [1];
    } else if (this.difficulty === "hard") {
      rootRange = [-8, 8];
      aList = [-2, 2, 3];
    } else {
      rootRange = [-5, 5];
      aList = [-1, 1];
    }

    const x1 = MathUtils.randomInt(rootRange[0], rootRange[1]);
    let x2 = MathUtils.randomInt(rootRange[0], rootRange[1]);
    while (x1 === x2) x2 = MathUtils.randomInt(rootRange[0], rootRange[1]);

    const a = MathUtils.randomElement(aList);
    const b = -a * (x1 + x2);
    const c = a * x1 * x2;

    const roots = [x1, x2].sort((n1, n2) => n1 - n2);
    const p = (x1 + x2) / 2;
    const q = a * p * p + b * p + c;

    return this.createResponse({
      question: "Podaj miejsca zerowe funkcji:",
      latex: `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`,
      image: null,
      variables: { a, b, c, x1, x2 },
      correctAnswer: `${roots[0]}, ${roots[1]}`,
      distractors: [
        `x_1 = ${-roots[0]}, x_2 = ${-roots[1]}`,
        `x_1 = ${roots[0]}, x_2 = ${-roots[1]}`,
        `x_1 = 0, x_2 = ${c}`,
      ],
      steps: [
        `$$\\Delta = b^2 - 4ac = ${b * b - 4 * a * c}$$`,
        `$$x_1 = ${roots[0]}, x_2 = ${roots[1]}$$`,
      ],
      questionType: "open",
      answerFormat: "x_1, x_2",
    });
  }

  generateCanonicalProblem() {
    const { a, b, c, p, q } = this.generateCoefficients();

    if (this.difficulty === "easy" && p < 0) {
      return this.generateCanonicalProblem();
    }

    const pStr = p > 0 ? `(x - ${p})^2` : `(x + ${Math.abs(p)})^2`;
    const aStr = a === 1 ? "" : a === -1 ? "-" : a;
    const core = p === 0 ? "x^2" : pStr;

    const ans = `${aStr}${core} ${q > 0 ? `+ ${q}` : q < 0 ? `- ${Math.abs(q)}` : ""}`;

    return this.createResponse({
      question: "Wyznacz postać kanoniczną funkcji określonej wzorem:",
      latex: `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`,
      variables: { a, b, c },
      correctAnswer: `f(x) = ${ans}`,
      distractors: [
        `f(x) = ${a}(x-${q})^2+${p}`, // mistake p with q
        `f(x) = ${a}(x+${p})^2+${q}`, // bad sign for p
        `f(x) = (x-${p})^2+${q}`, // forgotten a
      ],
      steps: [`$$p=${p}, q=${q}$$`, `$$f(x)=a(x-p)^2+q$$`],
      questionType: "open",
      answerFormat: "f(x) = ...",
    });
  }

  generateSymmetryAxisProblem() {
    const { a, b, c, p } = this.generateCoefficients();
    return this.createResponse({
      question: `Osią symetrii wykresu funkcji $$f(x) = ${MathUtils.formatPolynomial(a, b, c)}$$ jest prosta:`,
      latex: null,
      image: null,
      variables: { a, b, c, p },
      correctAnswer: `x = ${p}`,
      distractors: [`x = ${-p}`, `y = ${p}`, `x = ${b}`],
      steps: [`Oś symetrii przechodzi przez wierzchołek.`, `$$x = p = ${p}$$`],
      questionType: "closed",
    });
  }

  generateCoefficients() {
    let pRange, aList;
    if (this.difficulty === "easy") {
      pRange = [-3, 3];
      aList = [-1, 1];
    } else if (this.difficulty === "hard") {
      pRange = [-6, 6];
      aList = [-2, 2, 3];
    } else {
      pRange = [-4, 4];
      aList = [-1, 1, 2];
    }

    const p = MathUtils.randomInt(pRange[0], pRange[1]);
    const q = MathUtils.randomInt(pRange[0], pRange[1]);
    const a = MathUtils.randomElement(aList);
    const b = -2 * a * p;
    const c = a * (p * p) + q;
    return { a, b, c, p, q };
  }
}

module.exports = VertexAndRootsGenerator;
