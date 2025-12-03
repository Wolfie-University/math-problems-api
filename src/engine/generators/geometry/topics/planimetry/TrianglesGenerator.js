const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const PlanimetrySVGUtils = require("./PlanimetrySVGUtils");

class TrianglesGenerator extends BaseGenerator {
  generatePythagoras() {
    const triple = MathUtils.randomElement([
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
      [8, 15, 17],
      [9, 12, 15],
    ]);
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
    const a = MathUtils.randomInt(30, 80);
    const b = MathUtils.randomInt(30, 180 - a - 10);
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
    const a = MathUtils.randomInt(2, 8) * 2;
    const mode = MathUtils.randomElement(["height", "area"]);

    if (mode === "height") {
      return this.createResponse({
        question: `Wysokość trójkąta równobocznego o boku $$${a}$$ jest równa:`,
        latex: `a=${a}`,
        image: PlanimetrySVGUtils.generateSVG({ type: "equilateral", a }),
        variables: { a },
        correctAnswer: `${a / 2}\\sqrt{3}`,
        distractors: [`${a}\\sqrt{3}`, `${a / 2}`, `${a * a}\\sqrt{3}`],
        steps: [
          `$$h = \\frac{a\\sqrt{3}}{2} = \\frac{${a}\\sqrt{3}}{2} = ${a / 2}\\sqrt{3}$$`,
        ],
      });
    } else {
      const P = (a * a) / 4;
      return this.createResponse({
        question: `Pole trójkąta równobocznego o boku $$${a}$$ jest równe:`,
        latex: `a=${a}`,
        image: PlanimetrySVGUtils.generateSVG({ type: "equilateral", a }),
        variables: { a },
        correctAnswer: `${P}\\sqrt{3}`,
        distractors: [`${P * 4}\\sqrt{3}`, `${P}`, `${a}\\sqrt{3}`],
        steps: [
          `$$P = \\frac{a^2\\sqrt{3}}{4} = \\frac{${a * a}\\sqrt{3}}{4} = ${P}\\sqrt{3}$$`,
        ],
      });
    }
  }

  generateSimilarity() {
    const P1 = MathUtils.randomInt(2, 10);
    const k = MathUtils.randomInt(2, 5);
    const P2 = P1 * k * k;
    return this.createResponse({
      question: `Trójkąt $$T_1$$ jest podobny do $$T_2$$ w skali $$k=${k}$$. Pole $$T_1$$ wynosi $$${P1}$$. Pole $$T_2$$ to:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({ type: "similarity", k }),
      variables: { P1, k },
      correctAnswer: `${P2}`,
      distractors: [`${P1 * k}`, `${P1 + k}`, `${P1 * k * 2}`],
      steps: [`$$P_2 = P_1 \\cdot k^2$$`],
    });
  }

  generateTriangleAreaSin() {
    const a = MathUtils.randomInt(4, 10);
    const b = MathUtils.randomInt(4, 10);
    const alpha = 30;
    const area = (a * b) / 4;
    return this.createResponse({
      question: `Boki $$${a}, ${b}$$, kąt $$30^\\circ$$. Pole trójkąta:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "triangle_sas",
        a,
        b,
        alpha,
      }),
      variables: { a, b },
      correctAnswer: `${area}`,
      distractors: [`${a * b}`, `${a + b}`, `${(a * b) / 2}`],
      steps: [`$$P = \\frac{1}{2}ab \\sin\\alpha$$`],
    });
  }

  generateInradiusRightTriangle() {
    const [a, b, c] = MathUtils.randomElement([
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
    ]);
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
    const [a, b, c] = MathUtils.randomElement([
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
      [10, 24, 26],
    ]);
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
    const base = 70;
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
