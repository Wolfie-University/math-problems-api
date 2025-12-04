const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class TrigIdentitiesGenerator extends BaseGenerator {
  generateIdentityReduction() {
    let angle;
    if (this.difficulty === "easy") angle = MathUtils.randomInt(2, 4) * 10;
    else if (this.difficulty === "hard")
      angle = MathUtils.randomInt(21, 89) / 2;
    else angle = MathUtils.randomInt(10, 40);

    const compl = 90 - angle;
    const type = MathUtils.randomElement(["sin", "cos"]);

    const aStr = Number.isInteger(angle) ? `${angle}` : angle.toFixed(1);
    const cStr = Number.isInteger(compl) ? `${compl}` : compl.toFixed(1);

    return this.createResponse({
      question: `Wartość wyrażenia $$${type}^2 ${aStr}^\\circ + ${type}^2 ${cStr}^\\circ$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { angle, compl, type },
      correctAnswer: `1`,
      distractors: [`0`, `2`, `\\frac{1}{2}`],
      steps: [
        `Wzór redukcyjny: $$${type}(${cStr}^\\circ) = ${type === "sin" ? "\\cos" : "\\sin"}(90^\\circ - ${cStr}^\\circ) = ${type === "sin" ? "\\cos" : "\\sin"}(${aStr}^\\circ)$$`,
        `$$${type}^2 ${aStr}^\\circ + ${type === "sin" ? "\\cos" : "\\sin"}^2 ${aStr}^\\circ = 1$$`,
      ],
    });
  }

  generateCalcExprFromTrig() {
    let triples;
    if (this.difficulty === "easy") triples = [[3, 4, 5]];
    else if (this.difficulty === "hard")
      triples = [
        [5, 12, 13],
        [8, 15, 17],
      ];
    else
      triples = [
        [3, 4, 5],
        [5, 12, 13],
      ];

    const [leg1, leg2, hyp] = MathUtils.randomElement(triples);
    const qType = MathUtils.randomElement(["cos_sq", "val_expr"]);
    const sinVal = `\\frac{${leg1}}{${hyp}}`;

    if (qType === "cos_sq") {
      return this.createResponse({
        question: `Kąt $$\\alpha$$ jest ostry i $$\\sin\\alpha = ${sinVal}$$. Wtedy $$\\cos^2\\alpha$$ równa się:`,
        latex: ``,
        image: null,
        variables: { leg1, hyp },
        correctAnswer: `\\frac{${leg2 * leg2}}{${hyp * hyp}}`,
        distractors: [
          `\\frac{${leg1 * leg1}}{${hyp * hyp}}`,
          `\\frac{${hyp * hyp - leg1 * leg1}}{${leg1 * leg1}}`,
          `1`,
        ],
        steps: [
          `$$1 - (\\frac{${leg1}}{${hyp}})^2 = \\frac{${hyp * hyp} - ${leg1 * leg1}}{${hyp * hyp}} = \\frac{${leg2 * leg2}}{${hyp * hyp}}$$`,
        ],
      });
    } else {
      return this.createResponse({
        question: `Kąt $$\\alpha$$ jest ostry i $$\\cos\\alpha = \\frac{${leg2}}{${hyp}}$$. Wartość wyrażenia $$3 - 2\\sin^2\\alpha$$ wynosi:`,
        latex: ``,
        image: null,
        variables: { leg2, hyp },
        correctAnswer: `\\frac{${3 * hyp * hyp - 2 * leg1 * leg1}}{${hyp * hyp}}`,
        distractors: [`1`, `\\frac{${hyp}}{${leg2}}`, `0`],
        steps: [
          `$$\\sin^2\\alpha = \\frac{${leg1 * leg1}}{${hyp * hyp}}$$`,
          `$$3 - \\frac{${2 * leg1 * leg1}}{${hyp * hyp}} = \\dots$$`,
        ],
      });
    }
  }

  generateLinearRelation() {
    let k;
    if (this.difficulty === "easy") k = 2;
    else if (this.difficulty === "hard") k = 5;
    else k = MathUtils.randomInt(2, 4);

    return this.createResponse({
      question: `Kąt $$\\alpha$$ jest ostry i $$\\sin\\alpha = ${k}\\cos\\alpha$$. Wartość $$\\tg\\alpha$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { k },
      correctAnswer: `${k}`,
      distractors: [`\\frac{1}{${k}}`, `${k * k}`, `\\sqrt{${k}}`],
      steps: [
        `$$\\tg\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha} = \\frac{${k}\\cos\\alpha}{\\cos\\alpha} = ${k}$$`,
      ],
    });
  }

  generateSimplifyBasic() {
    const func = MathUtils.randomElement(["sin", "cos"]);
    const other = func === "sin" ? "cos" : "sin";
    return this.createResponse({
      question: `Dla każdego kąta ostrego $$\\alpha$$ wyrażenie $$(1 - \\${func}\\alpha)(1 + \\${func}\\alpha)$$ jest równe:`,
      latex: ``,
      image: null,
      variables: { func },
      correctAnswer: `\\${other}^2\\alpha`,
      distractors: [`\\${func}^2\\alpha`, `1`, `2\\${other}\\alpha`],
      steps: [`$$1 - \\${func}^2\\alpha = \\${other}^2\\alpha$$`],
    });
  }

  generatePythagoreanIdentity() {
    const [a, b, c] = MathUtils.randomElement([
      [3, 4, 5],
      [5, 12, 13],
    ]);
    const givenFunc = MathUtils.randomElement(["sin", "cos"]);
    const targetFunc = givenFunc === "sin" ? "cos" : "sin";
    const givenVal = `\\frac{${givenFunc === "sin" ? a : b}}{${c}}`;
    const targetVal = `\\frac{${givenFunc === "sin" ? b : a}}{${c}}`;
    return this.createResponse({
      question: `Kąt $$\\alpha$$ jest ostry i $$${givenFunc} \\alpha = ${givenVal}$$. Wartość $$${targetFunc} \\alpha$$ jest równa:`,
      latex: `${givenFunc} \\alpha = ${givenVal}`,
      image: null,
      variables: { a, b, c },
      correctAnswer: targetVal,
      distractors: [`\\frac{${c - a}}{${c}}`, `\\frac{${a}}{${b}}`, `1`],
      steps: [`$$1 - (\\frac{${givenFunc === "sin" ? a : b}}{${c}})^2$$`],
    });
  }

  generateAngleRelation() {
    let alpha;
    if (this.difficulty === "easy") alpha = 30;
    else alpha = MathUtils.randomInt(10, 80);
    const beta = 90 - alpha;
    return this.createResponse({
      question: `Wartość wyrażenia $$\\sin ${alpha}^\\circ - \\cos ${beta}^\\circ$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { alpha, beta },
      correctAnswer: `0`,
      distractors: [`1`, `-1`, `2\\sin ${alpha}^\\circ`],
      steps: [`$$\\cos ${beta}^\\circ = \\sin ${alpha}^\\circ$$`],
    });
  }

  generateTgIdentity() {
    const [a, b, c] = MathUtils.randomElement([
      [3, 4, 5],
      [5, 12, 13],
    ]);
    return this.createResponse({
      question: `Kąt $$\\alpha$$ jest ostry, $$\\sin\\alpha=\\frac{${a}}{${c}}$$ i $$\\cos\\alpha=\\frac{${b}}{${c}}$$. Wartość $$\\tg\\alpha$$ wynosi:`,
      latex: ``,
      image: null,
      variables: { a, b, c },
      correctAnswer: `\\frac{${a}}{${b}}`,
      distractors: [`\\frac{${b}}{${a}}`, `\\frac{${a}}{${c}}`, `1`],
      steps: [`$$\\tg\\alpha = \\sin\\alpha / \\cos\\alpha$$`],
    });
  }

  generateTanProductReduction() {
    let angle;
    if (this.difficulty === "easy")
      angle = 30;
    else angle = MathUtils.randomInt(10, 40);
    const compl = 90 - angle;
    return this.createResponse({
      question: `Wartość wyrażenia $$\\tg ${angle}^\\circ \\cdot \\tg ${compl}^\\circ$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { angle },
      correctAnswer: `1`,
      distractors: [`0`, `\\frac{1}{2}`, `\\sqrt{3}`],
      steps: [`$$\\tg ${compl}^\\circ = \\frac{1}{\\tg ${angle}^\\circ}$$`],
    });
  }
}

module.exports = TrigIdentitiesGenerator;
