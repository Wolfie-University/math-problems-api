const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class TrigValuesAndPropertiesGenerator extends BaseGenerator {
  generateValuesEval() {
    let exprs;

    if (this.difficulty === "easy") {
      exprs = [
        {
          q: "\\sin 30^\\circ + \\cos 60^\\circ",
          val: "1",
          s: "1/2 + 1/2 = 1",
        },
        { q: "\\tg 45^\\circ - \\sin 90^\\circ", val: "0", s: "1 - 1 = 0" },
        { q: "2\\cos 60^\\circ", val: "1", s: "2 \\cdot (1/2) = 1" },
        { q: "\\sin 0^\\circ + \\cos 0^\\circ", val: "1", s: "0 + 1 = 1" },
      ];
    } else {
      exprs = [
        {
          q: "\\sin 45^\\circ \\cdot \\cos 45^\\circ",
          val: "\\frac{1}{2}",
          s: "\\frac{\\sqrt{2}}{2} \\cdot \\frac{\\sqrt{2}}{2} = \\frac{2}{4} = \\frac{1}{2}",
        },
        {
          q: "\\tg 30^\\circ \\cdot \\tg 60^\\circ",
          val: "1",
          s: "\\frac{\\sqrt{3}}{3} \\cdot \\sqrt{3} = \\frac{3}{3} = 1",
        },
        {
          q: "(\\sin 60^\\circ)^2",
          val: "\\frac{3}{4}",
          s: "(\\frac{\\sqrt{3}}{2})^2 = \\frac{3}{4}",
        },
        {
          q: "\\cos 30^\\circ + \\sin 60^\\circ",
          val: "\\sqrt{3}",
          s: "\\frac{\\sqrt{3}}{2} + \\frac{\\sqrt{3}}{2} = \\sqrt{3}",
        },
      ];
    }

    const item = MathUtils.randomElement(exprs);

    return this.createResponse({
      question: `Wartość wyrażenia $$${item.q}$$ jest równa:`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: `${item.val}`,
      distractors: [`0`, `\\frac{1}{2}`, `\\sqrt{2}`, `1`]
        .filter((d) => d !== item.val)
        .slice(0, 3),
      steps: [
        `Podstawiamy wartości z tabeli trygonometrycznej:`,
        `$$${item.q} = ${item.s}$$`,
      ],
    });
  }

  generateFindAngle() {
    let options;

    if (this.difficulty === "easy") {
      options = [
        { func: "sin", val: "\\frac{1}{2}", ang: 30 },
        { func: "cos", val: "\\frac{1}{2}", ang: 60 },
        { func: "tg", val: "1", ang: 45 },
        { func: "sin", val: "1", ang: 90 },
        { func: "cos", val: "0", ang: 90 },
      ];
    } else {
      options = [
        { func: "sin", val: "\\frac{\\sqrt{2}}{2}", ang: 45 },
        { func: "cos", val: "\\frac{\\sqrt{3}}{2}", ang: 30 },
        { func: "tg", val: "\\sqrt{3}", ang: 60 },
        { func: "tg", val: "\\frac{\\sqrt{3}}{3}", ang: 30 },
        { func: "sin", val: "\\frac{\\sqrt{3}}{2}", ang: 60 },
      ];
    }

    const item = MathUtils.randomElement(options);

    return this.createResponse({
      question: `Kąt $$\\alpha$$ jest ostry i $$${item.func}\\alpha = ${item.val}$$. Miara kąta $$\\alpha$$ wynosi:`,
      latex: ``,
      image: null,
      variables: { func: item.func, val: item.val },
      correctAnswer: `${item.ang}^\\circ`,
      distractors: [`30^\\circ`, `45^\\circ`, `60^\\circ`, `90^\\circ`]
        .filter((x) => x !== `${item.ang}^\\circ`)
        .slice(0, 3),
      steps: [`Odczytujemy z tablic wartości funkcji trygonometrycznych.`],
    });
  }

  generateCompareFunctions() {
    let func, a1, a2;

    if (this.difficulty === "easy") {
      func = MathUtils.randomElement(["sin", "tg"]);
      a1 = MathUtils.randomInt(10, 30);
      a2 = MathUtils.randomInt(50, 80);
    } else {
      func = "cos";
      a1 = MathUtils.randomInt(30, 50);
      a2 = a1 + MathUtils.randomInt(1, 5);
    }

    const isGrowing = func !== "cos";
    const sign = isGrowing ? "<" : ">";

    const minA = Math.min(a1, a2);
    const maxA = Math.max(a1, a2);

    return this.createResponse({
      question: `Wskaż prawdziwą nierówność:`,
      latex: ``,
      image: null,
      variables: { func, minA, maxA },
      correctAnswer: `\\${func} ${minA}^\\circ ${sign} \\${func} ${maxA}^\\circ`,
      distractors: [
        `\\${func} ${minA}^\\circ ${sign === "<" ? ">" : "<"} \\${func} ${maxA}^\\circ`,
        `\\${func} ${minA}^\\circ = \\${func} ${maxA}^\\circ`,
        `\\${func} ${minA}^\\circ \\cdot \\${func} ${maxA}^\\circ = 1`,
      ],
      steps: [
        `Funkcja $$y=\\${func} x$$ w przedziale $$(0^\\circ, 90^\\circ)$$ jest ${isGrowing ? "rosnąca" : "malejąca"}.`,
        `Ponieważ $$${minA} < ${maxA}$$, to $$\\${func} ${minA}^\\circ ${sign} \\${func} ${maxA}^\\circ$$.`,
      ],
    });
  }

  generateApproxValue() {
    let angle;
    if (this.difficulty === "easy") {
      angle = MathUtils.randomElement([10, 20, 40, 50, 70, 80]);
    } else {
      angle = MathUtils.randomInt(11, 79);
    }

    const val = parseFloat(Math.sin((angle * Math.PI) / 180).toFixed(4));

    return this.createResponse({
      question: `Z tablic trygonometrycznych odczytano, że $$\\sin ${angle}^\\circ \\approx ${val}$$. Zatem $$\\cos ${90 - angle}^\\circ$$ jest w przybliżeniu równy:`,
      latex: ``,
      image: null,
      variables: { angle, val },
      correctAnswer: `${val}`,
      distractors: [
        `${(1 - val).toFixed(4)}`,
        `${(val * 0.5).toFixed(4)}`,
        `${Math.cos((angle * Math.PI) / 180).toFixed(4)}`,
      ],
      steps: [
        `Korzystamy ze wzoru redukcyjnego: $$\\cos(90^\\circ - \\alpha) = \\sin\\alpha$$.`,
        `Zatem $$\\cos ${90 - angle}^\\circ = \\sin ${angle}^\\circ \\approx ${val}$$`,
      ],
    });
  }
}

module.exports = TrigValuesAndPropertiesGenerator;
