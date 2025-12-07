const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const StereometrySVGUtils = require("./StereometrySVGUtils");

class PyramidsAndPrismsGenerator extends BaseGenerator {
  generatePyramidSquare() {
    let aList, angles;

    if (this.difficulty === "easy") {
      aList = [4, 6, 8, 10];
      angles = [45];
    } else if (this.difficulty === "hard") {
      aList = [5, 7, 9, 11];
      angles = [60];
    } else {
      aList = [4, 5, 6, 7];
      angles = [45, 60];
    }

    const a = MathUtils.randomElement(aList);
    const angle = MathUtils.randomElement(angles);

    // H = a/2 * tg(alpha)
    let H_latex;

    if (angle === 45) {
      H_latex = a % 2 === 0 ? `${a / 2}\\sqrt{2}` : `\\frac{${a}\\sqrt{2}}{2}`;
    } else {
      H_latex = a % 2 === 0 ? `${a / 2}\\sqrt{6}` : `\\frac{${a}\\sqrt{6}}{2}`;
    }

    return this.createResponse({
      question: `Krawędź podstawy ostrosłupa prawidłowego czworokątnego ma długość $$${a}$$. Krawędź boczna tworzy z płaszczyzną podstawy kąt $$${angle}^\\circ$$. Oblicz wysokość tego ostrosłupa.`,
      latex: null,
      image: null,
      variables: { a, angle },
      correctAnswer: H_latex,
      distractors: [
        `${a}\\sqrt{2}`,
        angle === 45 ? `${a}` : `${a}\\sqrt{3}`,
        `\\frac{${a}\\sqrt{2}}{4}`,
      ],
      steps: [
        `Przekątna podstawy $$d = a\\sqrt{2} = ${a}\\sqrt{2} \\implies d/2 = \\frac{${a}\\sqrt{2}}{2}$$`,
        `$$H = d/2 \\cdot \\tg ${angle}^\\circ = ${H_latex}$$`,
      ],
      questionType: "open",
      answerFormat: "number",
    });
  }

  generatePyramidFaceAngle() {
    let aList, angles;
    if (this.difficulty === "easy") {
      aList = [4, 6, 8];
      angles = [45];
    } else {
      aList = [3, 5, 7, 9];
      angles = [60];
    }

    const a = MathUtils.randomElement(aList);
    const angle = MathUtils.randomElement(angles);

    let H_latex;
    if (angle === 45) H_latex = a % 2 === 0 ? `${a / 2}` : `\\frac{${a}}{2}`;
    else
      H_latex = a % 2 === 0 ? `${a / 2}\\sqrt{3}` : `\\frac{${a}\\sqrt{3}}{2}`;

    return this.createResponse({
      question: `Krawędź podstawy ostrosłupa prawidłowego czworokątnego ma długość $$${a}$$. Wysokość ściany bocznej tworzy z płaszczyzną podstawy kąt $$${angle}^\\circ$$. Oblicz wysokość tego ostrosłupa.`,
      latex: null,
      image: null,
      variables: { a, angle },
      correctAnswer: H_latex,
      distractors: [`${a}`, `${a}\\sqrt{2}`, `${a}\\sqrt{3}`],
      steps: [`$$H = \\frac{a}{2} \\cdot \\tg ${angle}^\\circ = ${H_latex}$$`],
      questionType: "open",
      answerFormat: "number",
    });
  }

  generatePyramidTriangle() {
    const a = MathUtils.randomInt(3, 9) * 2;
    const H = a / 2;
    return this.createResponse({
      question: `Krawędź podstawy ostrosłupa prawidłowego trójkątnego ma długość $$${a}$$. Wysokość ściany bocznej tworzy z płaszczyzną podstawy kąt $$60^\\circ$$. Oblicz wysokość tego ostrosłupa.`,
      latex: null,
      image: null,
      variables: { a, H },
      correctAnswer: `${H}`,
      distractors: [`${a}`, `${a}\\sqrt{3}`, `\\frac{${a}\\sqrt{3}}{2}`],
      steps: [
        `$$r = \\frac{a\\sqrt{3}}{6}$$`,
        `$$H = r \\cdot \\tg 60^\\circ = ${H}$$`,
      ],
      questionType: "open",
      answerFormat: "number",
    });
  }

  generateTetrahedronRegular() {
    let aRange;

    if (this.difficulty === "easy") {
      aRange = [3, 6, 9, 12];
    } else {
      aRange = [2, 4, 5, 7, 8];
    }

    const a = MathUtils.randomElement(aRange);
    const mode = MathUtils.randomElement(["height", "area"]);

    if (mode === "height") {
      // h = a/3 * sqrt(6)
      const hCoeff = a % 3 === 0 ? `${a / 3}` : `\\frac{${a}}{3}`;
      const hStr = `${hCoeff}\\sqrt{6}`;

      return this.createResponse({
        question: `Wysokość czworościanu foremnego o krawędzi $$a=${a}$$ jest równa:`,
        latex: null,
        image: null,
        variables: { a },
        correctAnswer: hStr,
        distractors: [
          `${a}\\sqrt{3}`,
          `${a}\\sqrt{6}`,
          `${(a / 2).toFixed(0)}\\sqrt{3}`,
        ],
        steps: [`$$H = \\frac{a\\sqrt{6}}{3} = ${hStr}$$`],
        questionType: "closed",
      });
    } else {
      const areaStr = `${a * a}\\sqrt{3}`;
      return this.createResponse({
        question: `Pole powierzchni całkowitej czworościanu foremnego o krawędzi $$a=${a}$$ jest równe:`,
        latex: null,
        image: null,
        variables: { a },
        correctAnswer: areaStr,
        distractors: [
          `\\frac{${a * a}\\sqrt{3}}{4}`,
          `${a * a}\\sqrt{2}`,
          `${3 * a * a}`,
        ],
        steps: [`$$P_c = 4 \\cdot \\frac{a^2\\sqrt{3}}{4} = a^2\\sqrt{3}$$`],
        questionType: "closed",
      });
    }
  }

  generatePrismTriangle() {
    let aList;
    if (this.difficulty === "easy") {
      aList = [2, 4, 6, 8];
    } else {
      aList = [3, 5, 7];
    }

    const a = MathUtils.randomElement(aList);
    const H = MathUtils.randomInt(5, 12);

    // Pp = a^2 * sqrt(3) / 4
    const aSq = a * a;
    const Pp_coeff = aSq % 4 === 0 ? `${aSq / 4}` : `\\frac{${aSq}}{4}`;

    // V = Pp * H
    let V_coeff;
    if (aSq % 4 === 0) {
      V_coeff = `${(aSq / 4) * H}`;
    } else {
      // (aSq * H) / 4
      const num = aSq * H;
      const den = 4;
      if (num % den === 0) V_coeff = `${num / den}`;
      else if (num % 2 === 0) V_coeff = `\\frac{${num / 2}}{2}`;
      else V_coeff = `\\frac{${num}}{4}`;
    }

    return this.createResponse({
      question: `Krawędź podstawy graniastosłupa prawidłowego trójkątnego ma długość $$${a}$$, a jego wysokość wynosi $$${H}$$. Oblicz objętość tego graniastosłupa.`,
      latex: null,
      image: null,
      variables: { a, H },
      correctAnswer: `${V_coeff}\\sqrt{3}`,
      distractors: [
        `${V_coeff}\\sqrt{2}`, // wrong root
        `${a * a * H}\\sqrt{3}`, // forgot division by 4
        `${(a * a * H) / 2}\\sqrt{3}`,
      ],
      steps: [
        `$$P_p = \\frac{a^2\\sqrt{3}}{4} = ${Pp_coeff}\\sqrt{3}$$`,
        `$$V = P_p \\cdot H = ${V_coeff}\\sqrt{3}$$`,
      ],
      questionType: "open",
      answerFormat: "number",
    });
  }
}

module.exports = PyramidsAndPrismsGenerator;
