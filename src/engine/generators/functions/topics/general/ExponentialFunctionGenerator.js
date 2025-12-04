const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class ExponentialFunctionGenerator extends BaseGenerator {
  generateExponentialParam() {
    let scenarios;

    if (this.difficulty === "easy") {
      scenarios = [
        { x: 2, a: 3, y: 9 }, // a^2 = 9
        { x: 2, a: 2, y: 4 },
        { x: 2, a: 5, y: 25 },
        { x: 3, a: 2, y: 8 }, // a^3 = 8
        { x: 1, a: 4, y: 4 }, // a^1 = 4
      ];
    } else if (this.difficulty === "hard") {
      scenarios = [
        { x: -2, a: 2, y: "\\frac{1}{4}" }, // a^-2 = 1/4
        { x: -2, a: 3, y: "\\frac{1}{9}" },
        { x: 0.5, a: 16, y: 4 }, // a^0.5 = 4 (sqrt(a)=4 -> a=16)
        { x: -1, a: "1/2", y: 2 }, // (1/2)^-1 = 2
        { x: 3, a: "1/2", y: "\\frac{1}{8}" }, // (1/2)^3 = 1/8
      ];
    } else {
      scenarios = [
        { x: 2, a: 4, y: 16 },
        { x: 3, a: 3, y: 27 },
        { x: -1, a: 2, y: "\\frac{1}{2}" }, // a^-1 = 1/2
        { x: -1, a: 3, y: "\\frac{1}{3}" },
        { x: -1, a: 4, y: "0.25" }, // a^-1 = 0.25
      ];
    }

    const scenario = MathUtils.randomElement(scenarios);

    let correctA = `${scenario.a}`;

    let distractors;
    if (
      this.difficulty === "hard" &&
      typeof scenario.a === "string" &&
      scenario.a.includes("/")
    ) {
      distractors = ["2", "4", "-2"];
    } else {
      const aVal = parseFloat(scenario.a);
      distractors = [
        `${aVal * 2}`,
        scenario.x > 0 ? `\\frac{1}{${aVal}}` : `${1 / aVal}`,
        `${aVal + 1}`,
      ];
    }

    return this.createResponse({
      question: `Funkcja wykładnicza określona wzorem $$f(x) = a^x$$ przyjmuje dla argumentu $$${scenario.x}$$ wartość $$${scenario.y}$$. Podstawa $$a$$ tej funkcji jest równa:`,
      latex: `f(${scenario.x}) = ${scenario.y}`,
      image: null,
      variables: { scenario },
      correctAnswer: correctA,
      distractors: distractors,
      steps: [
        `Podstawiamy do wzoru $$f(x) = a^x$$:`,
        `$$a^{${scenario.x}} = ${scenario.y}$$`,
        scenario.x === -1
          ? `$$a^{-1} = \\frac{1}{a} = ${scenario.y} \\implies a = ${correctA}$$`
          : `Szukamy liczby, która podniesiona do potęgi $$${scenario.x}$$ da $$${scenario.y}$$.`,
        `$$a = ${correctA}$$`,
      ],
    });
  }
}

module.exports = ExponentialFunctionGenerator;
