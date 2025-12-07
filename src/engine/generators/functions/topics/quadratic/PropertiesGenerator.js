const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const SVGUtils = require("../../../../utils/SVGUtils");

class PropertiesGenerator extends BaseGenerator {
  generateValueRangeProblem() {
    let aList, vertexRange;

    if (this.difficulty === "easy") {
      aList = [-1, 1];
      vertexRange = [-3, 3];
    } else if (this.difficulty === "hard") {
      aList = [-3, -2, 2, 3, 4];
      vertexRange = [-8, 8];
    } else {
      aList = [-2, -1, 1, 2];
      vertexRange = [-5, 5];
    }

    const p = MathUtils.randomInt(vertexRange[0], vertexRange[1]);
    const q = MathUtils.randomInt(vertexRange[0], vertexRange[1]);
    const a = MathUtils.randomElement(aList);
    const b = -2 * a * p;
    const c = a * p * p + q;

    const range =
      a > 0 ? `\\langle ${q}, \\infty )` : `( -\\infty, ${q} \\rangle`;

    return this.createResponse({
      question: "Wyznacz zbiór wartości funkcji:",
      latex: `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`,
      image: null,
      variables: { a, b, c, p, q },
      correctAnswer: range,
      distractors: [
        a > 0 ? `( -\\infty, ${q} \\rangle` : `\\langle ${q}, \\infty )`, // reversed range
        `\\langle ${p}, \\infty )`, // misstake q with p
        `\\mathbb{R}`,
      ],
      steps: [
        `Współczynnik $$a=${a}$$, ramiona skierowane w ${a > 0 ? "górę" : "dół"}.`,
        `Współrzędna $$q=${q}$$ wierzchołka.`,
        `Zbiór wartości: $$${range}$$`,
      ],
      questionType: "open",
      answerFormat: "interval",
    });
  }

  generateMonotonicityProblem() {
    // (-inf, p> & <p, inf)
    let aList, pRange;

    if (this.difficulty === "easy") {
      aList = [-1, 1];
      pRange = [-3, 3];
    } else if (this.difficulty === "hard") {
      aList = [-3, 3];
      pRange = [-10, 10];
    } else {
      aList = [-2, 2];
      pRange = [-5, 5];
    }

    const p = MathUtils.randomInt(pRange[0], pRange[1]);
    const q = MathUtils.randomInt(pRange[0], pRange[1]);
    const a = MathUtils.randomElement(aList);
    const b = -2 * a * p;
    const c = a * p * p + q;

    const type = MathUtils.randomElement(["rosnąca", "malejąca"]);
    let interval;

    // a > 0 (U): maleje (-inf, p>, rosnie <p, inf)
    // a < 0 (n): rosnie (-inf, p>, maleje <p, inf)

    if ((a > 0 && type === "rosnąca") || (a < 0 && type === "malejąca")) {
      interval = `\\langle ${p}, \\infty )`;
    } else {
      interval = `( -\\infty, ${p} \\rangle`;
    }

    return this.createResponse({
      question: `Funkcja kwadratowa $$f(x) = ${MathUtils.formatPolynomial(a, b, c)}$$ jest ${type} w przedziale:`,
      latex: null,
      image: null,
      variables: { a, p, type },
      correctAnswer: interval,
      distractors: [
        interval.includes("infty") && interval.includes("-")
          ? interval.replace("-", "")
          : `( -\\infty, ${p} \\rangle`, // reversed interval
        `\\langle ${q}, \\infty )`, // misstake p with q
        `( -\\infty, ${q} \\rangle`,
      ],
      steps: [
        `Współrzędna $$p$$ wierzchołka $$p = \\frac{-b}{2a} = ${p}$$.`,
        `Ramiona ${a > 0 ? "góra" : "dół"}.`,
      ],
      questionType: "closed",
    });
  }

  generateMinMaxIntervalProblem() {
    // f(x) in <start, end>
    const { a, b, c, p, q } = this.generateCoefficients();

    let isPInside;
    if (this.difficulty === "easy") isPInside = true;
    else if (this.difficulty === "hard") isPInside = Math.random() > 0.5;
    else isPInside = true;

    let start, end;
    if (isPInside) {
      start = p - MathUtils.randomInt(1, 2);
      end = p + MathUtils.randomInt(1, 2);
    } else {
      if (Math.random() > 0.5) {
        start = p + 1;
        end = p + 3;
      } else {
        end = p - 1;
        start = end - 2;
      }
    }

    const f_start = a * start * start + b * start + c;
    const f_end = a * end * end + b * end + c;
    const f_p = q;

    const type = MathUtils.randomElement(["najmniejsza", "największa"]);
    const values = [f_start, f_end];
    if (start <= p && p <= end) values.push(f_p);

    const ans =
      type === "najmniejszą" ? Math.min(...values) : Math.max(...values);

    return this.createResponse({
      question: `Największą i najmniejszą wartość funkcji w przedziale $$\\langle ${start}, ${end} \\rangle$$ są odpowiednio liczby... Jaka jest ${type} z nich?`,
      latex: `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`,
      image: null,
      variables: { ans },
      correctAnswer: `${ans}`,
      distractors: [`${f_start}`, `${f_end}`, `${q}`],
      steps: [
        `Wierzchołek $$p=${p}$$ ${start <= p && p <= end ? "należy" : "nie należy"} do przedziału.`,
        `Obliczamy wartości na krańcach: $$f(${start})=${f_start}, f(${end})=${f_end}$$` +
          (start <= p && p <= end
            ? ` oraz w wierzchołku $$f(${p})=${f_p}$$`
            : ``) +
          `.`,
      ],
      questionType: "open",
      answerFormat: "number",
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

module.exports = PropertiesGenerator;
