const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const PlanimetrySVGUtils = require("./PlanimetrySVGUtils");

class TrianglesGenerator extends BaseGenerator {
  generatePythagoras() {
    let triples;
    if (this.difficulty === "easy") {
      triples = [
        [3, 4, 5],
        [6, 8, 10],
      ];
    } else if (this.difficulty === "hard") {
      if (Math.random() > 0.5) {
        const a = MathUtils.randomInt(2, 6);
        const b = MathUtils.randomInt(2, 6);
        const cSq = a * a + b * b;

        if (!Number.isInteger(Math.sqrt(cSq))) {
          return this.createResponse({
            question: `W trójkącie prostokątnym przyprostokątne mają długości $$${a}$$ i $$${b}$$. Przeciwprostokątna ma długość:`,
            latex: ``,
            image: PlanimetrySVGUtils.generateSVG({
              type: "right_triangle_basic",
              a,
              b,
              c: "?",
              missing: "c",
            }),
            variables: { a, b },
            correctAnswer: `\\sqrt{${cSq}}`,
            distractors: [`${a + b}`, `${Math.abs(a - b)}`, `${cSq}`],
            steps: [
              `$$c^2 = ${a}^2 + ${b}^2 = ${cSq} \\implies c = \\sqrt{${cSq}}$$`,
            ],
          });
        }
      }
      triples = [
        [8, 15, 17],
        [9, 12, 15],
        [5, 12, 13],
      ];
    } else {
      triples = [
        [3, 4, 5],
        [5, 12, 13],
        [8, 15, 17],
      ];
    }

    const triple = MathUtils.randomElement(triples);
    const mode = MathUtils.randomElement(["hypotenuse", "leg"]);
    const [a, b, c] = triple;

    return this.createResponse({
      question:
        mode === "hypotenuse"
          ? `W trójkącie prostokątnym przyprostokątne mają długości $$${a}$$ i $$${b}$$. Przeciwprostokątna ma długość:`
          : `W trójkącie prostokątnym jedna przyprostokątna ma długość $$${a}$$, a przeciwprostokątna $$${c}$$. Druga przyprostokątna ma długość:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "right_triangle_basic",
        a,
        b,
        c,
        missing: mode === "hypotenuse" ? "c" : "b",
      }),
      variables: { a, b, c },
      correctAnswer: `${mode === "hypotenuse" ? c : b}`,
      distractors: [
        `${mode === "hypotenuse" ? a + b : c - a}`,
        `${Math.sqrt(mode === "hypotenuse" ? a * a + b * b + 1 : c * c - a * a - 1).toFixed(1)}`,
        `${mode === "hypotenuse" ? Math.abs(a - b) : c + a}`,
      ],
      steps: [
        `Twierdzenie Pitagorasa: $$a^2 + b^2 = c^2$$`,
        mode === "hypotenuse"
          ? `$$c^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c} \\implies c = ${c}$$`
          : `$$b^2 = c^2 - a^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b} \\implies b = ${b}$$`,
      ],
    });
  }

  generateTriangleAnglesSum() {
    let a;
    if (this.difficulty === "easy") a = MathUtils.randomInt(3, 8) * 10;
    else if (this.difficulty === "hard") a = MathUtils.randomInt(25, 85);
    else a = MathUtils.randomInt(30, 80);

    const maxB = 180 - a - 10;
    let b =
      this.difficulty === "easy"
        ? MathUtils.randomInt(3, Math.floor(maxB / 10)) * 10
        : MathUtils.randomInt(30, maxB);

    const c = 180 - a - b;

    return this.createResponse({
      question: `Dwa kąty trójkąta mają miary $$${a}^\\circ$$ i $$${b}^\\circ$$. Trzeci kąt tego trójkąta ma miarę:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "triangle_angles",
        a,
        b,
        c,
      }),
      variables: { a, b, c },
      correctAnswer: `${c}^\\circ`,
      distractors: [
        `${180 - a}^\\circ`,
        `${180 - b}^\\circ`,
        `${a + b}^\\circ`,
      ],
      steps: [
        `Suma kątów w trójkącie wynosi $$180^\\circ$$.`,
        `$$180^\\circ - (${a}^\\circ + ${b}^\\circ) = 180^\\circ - ${a + b}^\\circ = ${c}^\\circ$$`,
      ],
    });
  }

  generateEquilateralTriangle() {
    let a;
    if (this.difficulty === "easy") a = MathUtils.randomInt(2, 6) * 2;
    else if (this.difficulty === "hard") a = MathUtils.randomInt(3, 9);
    else a = MathUtils.randomInt(4, 10);

    const mode = MathUtils.randomElement(["height", "area"]);

    if (mode === "height") {
      // h = a * sqrt(3) / 2
      const hCoeff = a % 2 === 0 ? `${a / 2}` : `\\frac{${a}}{2}`;

      return this.createResponse({
        question: `Wysokość trójkąta równobocznego o boku $$${a}$$ jest równa:`,
        latex: `a=${a}`,
        image: PlanimetrySVGUtils.generateSVG({ type: "equilateral", a }),
        variables: { a },
        correctAnswer: `${hCoeff}\\sqrt{3}`,
        distractors: [`${a}\\sqrt{3}`, `${a / 2}`, `${a * a}\\sqrt{3}`],
        steps: [`$$h = \\frac{a\\sqrt{3}}{2} = ${hCoeff}\\sqrt{3}$$`],
      });
    } else {
      // P = a^2 * sqrt(3) / 4
      const aSq = a * a;
      const pCoeff = aSq % 4 === 0 ? `${aSq / 4}` : `\\frac{${aSq}}{4}`;

      return this.createResponse({
        question: `Pole trójkąta równobocznego o boku $$${a}$$ jest równe:`,
        latex: `a=${a}`,
        image: PlanimetrySVGUtils.generateSVG({ type: "equilateral", a }),
        variables: { a },
        correctAnswer: `${pCoeff}\\sqrt{3}`,
        distractors: [`${pCoeff * 4}\\sqrt{3}`, `${pCoeff}`, `${a}\\sqrt{3}`],
        steps: [`$$P = \\frac{a^2\\sqrt{3}}{4} = ${pCoeff}\\sqrt{3}$$`],
      });
    }
  }

  generateSimilarity() {
    let P1, k;
    if (this.difficulty === "easy") {
      P1 = MathUtils.randomInt(2, 5);
      k = 2;
    } else if (this.difficulty === "hard") {
      P1 = MathUtils.randomInt(10, 20);
      k = MathUtils.randomInt(3, 6);
    } else {
      P1 = MathUtils.randomInt(5, 15);
      k = MathUtils.randomInt(2, 4);
    }

    const P2 = P1 * k * k;
    return this.createResponse({
      question: `Trójkąt $$T_1$$ jest podobny do $$T_2$$ w skali $$k=${k}$$. Pole $$T_1$$ wynosi $$${P1}$$. Pole $$T_2$$ wynosi:`,
      latex: ``,
      image: null,
      variables: { P1, k },
      correctAnswer: `${P2}`,
      distractors: [`${P1 * k}`, `${P1 + k}`, `${P1 * k * 2}`],
      steps: [`$$P_2 = P_1 \\cdot k^2 = ${P1} \\cdot ${k * k} = ${P2}$$`],
    });
  }

  generateTriangleAreaSin() {
    let a, b, angle;
    if (this.difficulty === "easy") {
      a = 4;
      b = 6;
      angle = 30;
    } else if (this.difficulty === "hard") {
      a = MathUtils.randomInt(5, 9);
      b = MathUtils.randomInt(5, 9);
      angle = MathUtils.randomElement([45, 60]);
    } else {
      a = MathUtils.randomInt(4, 8);
      b = MathUtils.randomInt(4, 8);
      angle = 30;
    }

    const coeff = (a * b) / 2;
    let areaStr;

    if (angle === 30) {
      areaStr = Number.isInteger(coeff / 2) ? `${coeff / 2}` : `${coeff / 2}`;
    } else if (angle === 45) {
      areaStr = `${coeff / 2}\\sqrt{2}`;
    } else {
      areaStr = `${coeff / 2}\\sqrt{3}`;
    }

    return this.createResponse({
      question: `Boki trójkąta to odpowiednio: $$${a}, ${b}$$ oraz kąt między nimi to $$${angle}^\\circ$$. Pole trójkąta wynosi:`,
      latex: ``,
      image: null,
      variables: { a, b },
      correctAnswer: `${areaStr}`,
      distractors: [`${a * b}`, `${a + b}`, `${coeff}`],
      steps: [`$$P = \\frac{1}{2}ab \\sin\\alpha$$`],
    });
  }

  generateInradiusRightTriangle() {
    let triples;
    if (this.difficulty === "easy") triples = [[3, 4, 5]];
    else if (this.difficulty === "hard")
      triples = [
        [8, 15, 17],
        [20, 21, 29],
      ];
    else triples = [[5, 12, 13]];

    const [a, b, c] = MathUtils.randomElement(triples);
    const r = (a + b - c) / 2;
    return this.createResponse({
      question: `Przyprostokątne trójkąta prostokątnego mają długości $$${a}$$ i $$${b}$$. Promień okręgu wpisanego wynosi:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "right_triangle_basic",
        a,
        b,
        c,
      }),
      variables: { a, b, c, r },
      correctAnswer: `${r}`,
      distractors: [`${r * 2}`, `${c / 2}`, `${(a + b) / 2}`],
      steps: [
        `$$c = ${c}$$`,
        `$$r = \\frac{a+b-c}{2} = \\frac{${a}+${b}-${c}}{2} = ${r}$$`,
      ],
    });
  }

  generateCircumradiusRightTriangle() {
    let triples;
    if (this.difficulty === "easy") triples = [[6, 8, 10]];
    else
      triples = [
        [5, 12, 13],
        [10, 24, 26],
      ];

    const [a, b, c] = MathUtils.randomElement(triples);
    const R = c / 2;
    return this.createResponse({
      question: `Przyprostokątne trójkąta prostokątnego mają długości $$${a}$$ i $$${b}$$. Promień okręgu opisanego wynosi:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "right_triangle_basic",
        a,
        b,
        c,
      }),
      variables: { a, b, c, R },
      correctAnswer: `${R}`,
      distractors: [`${c}`, `${(a + b) / 2}`, `${(a + b - c) / 2}`],
      steps: [`$$c=${c}$$`, `$$R = c/2 = ${c}/2 = ${R}$$`],
    });
  }

  generateIsoscelesAngles() {
    const base = this.difficulty === "easy" ? 70 : MathUtils.randomInt(20, 80);
    return this.createResponse({
      question: `Kąt przy podstawie to $$${base}^\\circ$$. Kąt wierzchołka:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "isosceles",
        baseAngle: base,
      }),
      variables: { base },
      correctAnswer: `${180 - 2 * base}^\\circ`,
      distractors: [
        `${base}^\\circ`,
        `${180 - base}^\\circ`,
        `${90 - base}^\\circ`,
      ],
      steps: [`$$180 - 2\\cdot${base}$$`],
    });
  }

  generateTrigProblem() {
    const [a, b, c] = MathUtils.randomElement([
      [3, 4, 5],
      [5, 12, 13],
    ]);
    return this.createResponse({
      question: `W trójkącie prostokątnym o bokach $$${a}, ${b}, ${c}$$ wartość $$\\sin\\alpha$$ (naprzeciw $$${a}$$) wynosi:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "right_triangle",
        a,
        b,
        c,
      }),
      variables: { a, b, c },
      correctAnswer: `\\frac{${a}}{${c}}`,
      distractors: [`\\frac{${b}}{${c}}`, `\\frac{${a}}{${b}}`],
      steps: [`Definicja sinusa.`],
    });
  }
}

module.exports = TrianglesGenerator;
