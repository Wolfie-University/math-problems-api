const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class FormulasGenerator extends BaseGenerator {
  generateShortMultProblem() {
    // (sqrt(a) +/- b)^2
    let aList, bRange;

    if (this.difficulty === "easy") {
      aList = [2, 3];
      bRange = [1, 3];
    } else if (this.difficulty === "hard") {
      aList = [2, 3, 5, 6, 7, 8, 10];
      bRange = [5, 12];
    } else {
      aList = [2, 3, 5, 7];
      bRange = [2, 5];
    }

    const a = MathUtils.randomElement(aList);
    const b = MathUtils.randomInt(bRange[0], bRange[1]);
    const sign = MathUtils.randomElement(["-", "+"]);

    // (sqrt(a) +/- b)^2 = a +/- 2b*sqrt(a) + b^2 = (a+b^2) +/- 2b*sqrt(a)
    const constantPart = a + b * b;
    const rootPart = 2 * b;

    const answer = `${constantPart} ${sign} ${rootPart}\\sqrt{${a}}`;

    return this.createResponse({
      question: "Liczba $$(\\sqrt{${a}} ${sign} ${b})^2$$ jest równa:",
      latex: null,
      image: null,
      variables: { a, b, sign },
      correctAnswer: answer,
      distractors: [
        `${constantPart} ${sign === "-" ? "+" : "-"} ${rootPart}\\sqrt{${a}}`,
        `${constantPart}`,
        `${a - b * b}`,
      ],
      steps: [
        `$$(x ${sign} y)^2 = x^2 ${sign} 2xy + y^2$$`,
        `$$(\\sqrt{${a}})^2 ${sign} 2\\cdot\\sqrt{${a}}\\cdot${b} + ${b}^2$$`,
        `$$${a} ${sign} ${2 * b}\\sqrt{${a}} + ${b * b} = ${answer}$$`,
      ],
    });
  }

  generateAlgebraicExpansion() {
    // (ax - b)^2 - (ax + b)^2
    let aRange, bRange;

    if (this.difficulty === "easy") {
      aRange = [1, 1];
      bRange = [1, 4];
    } else if (this.difficulty === "hard") {
      aRange = [4, 9];
      bRange = [5, 10];
    } else {
      aRange = [2, 4];
      bRange = [2, 5];
    }

    const a = MathUtils.randomInt(aRange[0], aRange[1]);
    const b = MathUtils.randomInt(bRange[0], bRange[1]);
    const variable = "x";

    const ax = a === 1 ? variable : `${a}${variable}`;

    const expr = `(${ax} - ${b})^2 - (${ax} + ${b})^2`;
    const resultVal = -4 * a * b;
    const correctAnswer = `${resultVal}${variable}`;

    return this.createResponse({
      question: `Dla każdej liczby rzeczywistej $$${variable}$$ wyrażenie $$${expr}$$ jest równe:`,
      latex: null,
      image: null,
      variables: { a, b },
      correctAnswer: correctAnswer,
      distractors: [`0`, `${2 * b * b}`, `${-2 * a * b}${variable}`],
      steps: [
        `Stosujemy wzory skróconego mnożenia: $$(a-b)^2 - (a+b)^2$$`,
        `Po rozpisaniu i redukcji wyrazów $$a^2$$ i $$b^2$$, zostaje: $$-2ab - 2ab = -4ab$$`,
        `$$a = ${ax}, \\quad b = ${b}$$`,
        `$$-4 \\cdot (${ax}) \\cdot ${b} = ${resultVal}${variable}$$`,
      ],
    });
  }

  generateRationalProblem() {
    // easy/medium: (x^2 - a^2)/(x-a)
    // hard: (k^2*x^2 - a^2)/(kx-a) -> kx + a

    let aRange, kRange;

    if (this.difficulty === "easy") {
      aRange = [1, 4];
      kRange = [1, 1];
    } else if (this.difficulty === "hard") {
      aRange = [3, 9];
      kRange = [2, 5];
    } else {
      aRange = [2, 9];
      kRange = [1, 1];
    }

    const type = MathUtils.randomElement(["diff_squares", "perfect_square"]);
    const a = MathUtils.randomInt(aRange[0], aRange[1]);
    const k = MathUtils.randomInt(kRange[0], kRange[1]);

    const kx = k === 1 ? "x" : `${k}x`;
    const k2x2 = k === 1 ? "x^2" : `${k * k}x^2`;

    let nom, den, res;
    let step1 = "";

    if (type === "diff_squares") {
      // (kx)^2 - a^2 / kx - a
      nom = `${k2x2} - ${a * a}`;
      den = `${kx} - ${a}`;
      res = `${kx} + ${a}`;
      step1 = `(${kx}-${a})(${kx}+${a})`;
    } else {
      // (kx + a)^2 / kx + a
      // k^2x^2 + 2kax + a^2
      const middleCoef = 2 * k * a;
      nom = `${k2x2} + ${middleCoef}x + ${a * a}`;
      den = `${kx} + ${a}`;
      res = `${kx} + ${a}`;
      step1 = `(${kx}+${a})^2`;
    }

    return this.createResponse({
      question: `Wyrażenie $$\\frac{${nom}}{${den}}$$ jest równe:`,
      latex: null,
      image: null,
      variables: { a, k, type },
      correctAnswer: res,
      distractors: [
        `${kx} - ${a}`,
        `${k2x2} + ${a}`,
        `\\frac{1}{${kx} - ${a}}`,
      ],
      steps: [
        `Rozkładamy licznik na czynniki:`,
        `$$${nom} = ${step1}$$`,
        `Skracamy z mianownikiem $$(${den})$$.`,
        `Wynik: $$${res}$$`,
      ],
    });
  }
}

module.exports = FormulasGenerator;
