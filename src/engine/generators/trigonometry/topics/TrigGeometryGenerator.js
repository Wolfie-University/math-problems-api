const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");
const TrigSVGUtils = require("./TrigSVGUtils");

class TrigGeometryGenerator extends BaseGenerator {
  generateTriangleDef() {
    let triples;
    if (this.difficulty === "easy") {
      triples = [[3, 4, 5]];
    } else if (this.difficulty === "hard") {
      triples = [
        [8, 15, 17],
        [20, 21, 29],
      ];
    } else {
      triples = [[5, 12, 13]];
    }

    const [a, b, c] = MathUtils.randomElement(triples);
    const func = MathUtils.randomElement(["sin", "cos", "tg"]);
    let num, den;
    if (func === "sin") {
      num = a;
      den = c;
    } else if (func === "cos") {
      num = b;
      den = c;
    } else {
      num = a;
      den = b;
    }

    return this.createResponse({
      question: `W trójkącie prostokątnym o bokach $$${a}, ${b}, ${c}$$ kąt $$\\alpha$$ leży naprzeciwko boku $$${a}$$. Wartość $$${func} \\alpha$$ wynosi:`,
      latex: ``,
      image: TrigSVGUtils.generateSVG({ type: "triangle", a, b, c }),
      variables: { a, b, c, func },
      correctAnswer: `\\frac{${num}}{${den}}`,
      distractors: [
        `\\frac{${den}}{${num}}`,
        `\\frac{${b}}{${a}}`,
        `\\frac{${a}}{${c + 1}}`,
      ],
      steps: [`Definicja $$${func}$$: Odpowiedni stosunek boków.`],
    });
  }

  generateAreaTriangle() {
    let angles;
    if (this.difficulty === "easy") {
      angles = [30];
    } else if (this.difficulty === "hard") {
      angles = [45, 60];
    } else {
      angles = [30, 150];
    }

    const angle = MathUtils.randomElement(angles);
    const minSide = this.difficulty === "easy" ? 4 : 3;
    const a =
      MathUtils.randomInt(minSide, 10) * (this.difficulty === "easy" ? 2 : 1);
    const b =
      MathUtils.randomInt(minSide, 10) * (this.difficulty === "easy" ? 2 : 1);

    let sinValStr;
    if (angle === 30 || angle === 150) sinValStr = "1/2";
    else if (angle === 45) sinValStr = "\\frac{\\sqrt{2}}{2}";
    else sinValStr = "\\frac{\\sqrt{3}}{2}";

    let areaStr;
    const coeff = (a * b) / 2;

    if (angle === 30 || angle === 150) {
      const val = coeff / 2;
      areaStr = Number.isInteger(val) ? `${val}` : val.toFixed(1);
    } else if (angle === 45) {
      areaStr = `${coeff / 2}\\sqrt{2}`;
      if (!Number.isInteger(coeff / 2))
        areaStr = `\\frac{${coeff}\\sqrt{2}}{2}`;
    } else {
      areaStr = `${coeff / 2}\\sqrt{3}`;
      if (!Number.isInteger(coeff / 2))
        areaStr = `\\frac{${coeff}\\sqrt{3}}{2}`;
    }

    return this.createResponse({
      question: `Dany jest trójkąt o bokach $$${a}$$ i $$${b}$$ oraz kącie między nimi $$${angle}^\\circ$$. Pole tego trójkąta wynosi:`,
      latex: ``,
      image: TrigSVGUtils.generateSVG({ type: "triangle_sas", a, b, angle }),
      variables: { a, b, angle },
      correctAnswer: areaStr,
      distractors: [`${a * b}`, `${coeff}`, `${coeff}\\sqrt{2}`],
      steps: [`$$P = \\frac{1}{2}ab \\sin\\alpha$$`],
    });
  }

  generateAreaParallelogram() {
    let angles;
    if (this.difficulty === "easy") angles = [30];
    else if (this.difficulty === "hard") angles = [45, 60];
    else angles = [150];

    const a = MathUtils.randomInt(3, 8);
    const b = MathUtils.randomInt(3, 8);
    const angle = MathUtils.randomElement(angles);

    let areaStr;
    if (angle === 30 || angle === 150) {
      areaStr = Number.isInteger((a * b) / 2)
        ? `${(a * b) / 2}`
        : ((a * b) / 2).toFixed(1);
    } else if (angle === 45 || angle === 135) {
      areaStr = `${(a * b) / 2}\\sqrt{2}`;
    } else {
      areaStr = `${(a * b) / 2}\\sqrt{3}`;
    }

    return this.createResponse({
      question: `Boki równoległoboku mają długości $$${a}$$ i $$${b}$$, a kąt między nimi ma miarę $$${angle}^\\circ$$. Pole tego równoległoboku jest równe:`,
      latex: ``,
      image: TrigSVGUtils.generateSVG({ type: "parallelogram", a, b, angle }),
      variables: { a, b, angle },
      correctAnswer: areaStr,
      distractors: [`${a * b}`, `${a * b * 2}`, `${a + b}`],
      steps: [`$$P = ab \\sin\\alpha$$`],
    });
  }

  generateAreaRhombus() {
    let angles;
    if (this.difficulty === "easy") angles = [30];
    else if (this.difficulty === "hard") angles = [45, 60];
    else angles = [150];

    const a = MathUtils.randomInt(4, 10);
    const angle = MathUtils.randomElement(angles);

    let areaStr;
    const aSq = a * a;

    if (angle === 30 || angle === 150) {
      areaStr = Number.isInteger(aSq / 2) ? `${aSq / 2}` : (aSq / 2).toFixed(1);
    } else if (angle === 45) {
      areaStr = `${aSq / 2}\\sqrt{2}`;
    } else {
      areaStr = `${aSq / 2}\\sqrt{3}`;
    }

    return this.createResponse({
      question: `Bok rombu ma długość $$${a}$$, a kąt ostry ma miarę $$${angle}^\\circ$$. Pole tego rombu wynosi:`,
      latex: ``,
      image: TrigSVGUtils.generateSVG({ type: "rhombus_angle", a, angle }),
      variables: { a, angle },
      correctAnswer: areaStr,
      distractors: [`${a * a}`, `${a * 4}`, `${(a * a) / 4}`],
      steps: [`$$P = a^2 \\sin\\alpha$$`],
    });
  }

  generateIsoscelesArm() {
    let angle;
    if (this.difficulty === "easy") angle = 60;
    else if (this.difficulty === "hard") angle = 30;
    else angle = 45;

    const a = MathUtils.randomInt(4, 10) * 2;
    let armLatex;

    if (angle === 60) armLatex = `${a}`;
    else if (angle === 45) {
      armLatex = `${a / 2}\\sqrt{2}`;
    } else {
      armLatex = `\\frac{${a}\\sqrt{3}}{3}`;
    }

    return this.createResponse({
      question: `Podstawa trójkąta równoramiennego ma długość $$${a}$$, a kąt przy podstawie ma miarę $$${angle}^\\circ$$. Ramię tego trójkąta ma długość:`,
      latex: ``,
      image: TrigSVGUtils.generateSVG({ type: "isosceles", a, angle }),
      variables: { a, angle },
      correctAnswer: armLatex,
      distractors: [`${a}`, `${a}\\sqrt{3}`, `${a / 2}`],
      steps: [
        `$$\\cos ${angle}^\\circ = \\frac{a/2}{b} \\implies b = \\frac{${a / 2}}{\\cos ${angle}^\\circ}$$`,
      ],
    });
  }

  generateTrapezoidHeight() {
    let angle;
    if (this.difficulty === "easy") angle = 30;
    else if (this.difficulty === "hard") angle = 60;
    else angle = 45;

    const c = MathUtils.randomInt(4, 10) * 2;
    let hStr;
    if (angle === 30) hStr = `${c / 2}`;
    else if (angle === 45) hStr = `${c / 2}\\sqrt{2}`;
    else hStr = `${c / 2}\\sqrt{3}`;

    return this.createResponse({
      question: `Ramię trapezu równoramiennego ma długość $$${c}$$, a kąt ostry tego trapezu ma miarę $$${angle}^\\circ$$. Wysokość trapezu jest równa:`,
      latex: ``,
      image: TrigSVGUtils.generateSVG({ type: "trapezoid_h", c, angle }),
      variables: { c, angle },
      correctAnswer: hStr,
      distractors: [`${c}`, `${c}\\sqrt{2}`, `${c * 2}`],
      steps: [`$$h = c \\cdot \\sin ${angle}^\\circ$$`],
    });
  }
}

module.exports = TrigGeometryGenerator;
