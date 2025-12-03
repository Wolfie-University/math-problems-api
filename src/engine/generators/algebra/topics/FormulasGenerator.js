const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class FormulasGenerator extends BaseGenerator {
  generateShortMultProblem() {
    const a = MathUtils.randomElement([2, 3, 5, 7]);
    const b = MathUtils.randomInt(1, 5);
    const sign = MathUtils.randomElement(["-", "+"]);
    const constantPart = a + b * b;
    const rootPart = 2 * b;
    const answer = `${constantPart} ${sign} ${rootPart}\\sqrt{${a}}`;

    return this.createResponse({
      question: "Liczba jest równa:",
      latex: `(\\sqrt{${a}} ${sign} ${b})^2`,
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
        `$$(\\sqrt{${a}})^2 ${sign} 2\\cdot\\sqrt{${a}}\\cdot${b} + ${b}^2 = ${a} ${sign} ${2 * b}\\sqrt{${a}} + ${b * b} = ${answer}$$`,
      ],
    });
  }

  generateAlgebraicExpansion() {
    const a = MathUtils.randomInt(2, 5);
    const b = MathUtils.randomInt(2, 5);
    const variable = "x";
    const expr = `(${a}${variable} - ${b})^2 - (${a}${variable} + ${b})^2`;
    const resultVal = -4 * a * b;
    const correctAnswer = `${resultVal}${variable}`;

    return this.createResponse({
      question: `Dla każdej liczby rzeczywistej $$${variable}$$ wyrażenie $$${expr}$$ jest równe:`,
      latex: expr,
      image: null,
      variables: { a, b },
      correctAnswer: correctAnswer,
      distractors: [`0`, `${2 * b * b}`, `${-2 * a * b}${variable}`],
      steps: [
        `Stosujemy wzory skróconego mnożenia.`,
        `Zauważmy, że wyrazy kwadratowe $${a * a}${variable}^2$ i wyrazy wolne $${b * b}$ się redukują.`,
        `Zostają wyrazy środkowe: $$-${2 * a * b}${variable} - ${2 * a * b}${variable} = ${resultVal}${variable}$$`,
      ],
    });
  }

  generateRationalProblem() {
    const type = MathUtils.randomElement(["diff_squares", "perfect_square"]);
    const a = MathUtils.randomInt(2, 9);
    let nom, den, res;
    if (type === "diff_squares") {
      nom = `x^2 - ${a * a}`;
      den = `x - ${a}`;
      res = `x + ${a}`;
    } else {
      nom = `x^2 + ${2 * a}x + ${a * a}`;
      den = `x + ${a}`;
      res = `x + ${a}`;
    }

    return this.createResponse({
      question: `Wyrażenie $$${nom}$$ podzielone przez $$${den}$$ jest równe:`,
      latex: `\\frac{${nom}}{${den}}`,
      image: null,
      variables: { a, type },
      correctAnswer: res,
      distractors: [`x - ${a}`, `x^2 + ${a}`, `\\frac{1}{x - ${a}}`],
      steps: [
        `Rozkładamy licznik: ${type === "diff_squares" ? `(x-${a})(x+${a})` : `(x+${a})^2`}`,
        `Skracamy z mianownikiem. Odp: $$${res}$$`,
      ],
    });
  }
}

module.exports = FormulasGenerator;
