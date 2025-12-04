const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");
const TrigSVGUtils = require("./TrigSVGUtils");

class TrigWordProblemsGenerator extends BaseGenerator {
  generateWordLadder() {
    let d, angle, question, correct, distractors, steps;

    // d - ladder length
    // angle - angle with the ground
    // h - height
    // x - distance from the wall

    if (this.difficulty === "hard") {
      // x = d * cos(alpha)
      d = MathUtils.randomInt(3, 8) * 2;
      angle = 60;
      const xVal = d / 2;

      question = `Drabina o długości $$${d}$$ m jest oparta o ścianę budynku pod kątem $$${angle}^\\circ$$ do podłoża. Jaka jest odległość dolnego końca drabiny od ściany budynku?`;
      correct = `${xVal}`;
      distractors = [
        `${((d * Math.sqrt(3)) / 2).toFixed(1)}`,
        `${d}`,
        `${d / 4}`,
      ];
      steps = [
        `Szukamy przyprostokątnej przyległej do kąta (odległość od ściany).`,
        `Z definicji cosinusa: $$\\cos \\alpha = \\frac{x}{d}$$`,
        `$$x = d \\cdot \\cos ${angle}^\\circ = ${d} \\cdot \\frac{1}{2} = ${xVal}$$`,
      ];
    } else if (this.difficulty === "easy") {
      d = MathUtils.randomInt(4, 12) * 2;
      angle = 30;
      const hVal = d / 2;

      question = `Drabina o długości $$${d}$$ m jest oparta o ścianę budynku pod kątem $$${angle}^\\circ$$ do podłoża. Na jaką wysokość sięga ta drabina?`;
      correct = `${hVal}`;
      distractors = [
        `${d}`,
        `${((d * Math.sqrt(3)) / 2).toFixed(1)}`,
        `${hVal * 2}`,
      ];
      steps = [
        `Szukamy przyprostokątnej naprzeciw kąta (wysokość).`,
        `Z definicji sinusa: $$\\sin \\alpha = \\frac{h}{d}$$`,
        `$$h = d \\cdot \\sin 30^\\circ = ${d} \\cdot \\frac{1}{2} = ${hVal}$$`,
      ];
    } else {
      d = MathUtils.randomInt(3, 8) * 2;
      angle = MathUtils.randomElement([45, 60]);

      let hLatex;
      if (angle === 45) hLatex = `${d / 2}\\sqrt{2}`;
      else hLatex = `${d / 2}\\sqrt{3}`;

      question = `Drabina o długości $$${d}$$ m jest oparta o ścianę budynku pod kątem $$${angle}^\\circ$$ do podłoża. Na jaką wysokość sięga ta drabina?`;
      correct = hLatex;
      distractors = [
        `${d / 2}`,
        angle === 45 ? `${d / 2}\\sqrt{3}` : `${d / 2}\\sqrt{2}`,
        `${d}`,
      ];
      steps = [
        `$$h = d \\cdot \\sin ${angle}^\\circ$$`,
        `$$h = ${d} \\cdot ${angle === 45 ? "\\frac{\\sqrt{2}}{2}" : "\\frac{\\sqrt{3}}{2}"} = ${hLatex}$$`,
      ];
    }

    return this.createResponse({
      question: question,
      latex: ``,
      image: TrigSVGUtils.generateSVG({ type: "ladder", d, angle }),
      variables: { d, angle },
      correctAnswer: correct,
      distractors: distractors,
      steps: steps,
    });
  }

  generateWordShadow() {
    let h, s, angle, base;
    let question, correct, distractors, steps;

    if (this.difficulty === "hard") {
      // h = s * tg(alpha)
      const sVal = MathUtils.randomInt(5, 15);
      base = sVal;
      angle = MathUtils.randomElement([30, 60]);

      let hLatex;
      if (angle === 60) hLatex = `${sVal}\\sqrt{3}`;
      else
        hLatex = `${sVal === 3 || sVal % 3 === 0 ? sVal / 3 : `\\frac{${sVal}}{3}`}\\sqrt{3}`;

      question = `Cień rzucany przez drzewo ma długość $$${sVal}$$ m. Promienie słoneczne padają pod kątem $$${angle}^\\circ$$. Jaką wysokość ma drzewo?`;
      correct = hLatex;
      distractors = [
        `${sVal}`,
        angle === 60 ? `${sVal}\\frac{\\sqrt{3}}{3}` : `${sVal}\\sqrt{3}`,
        `${sVal * 2}`,
      ];
      steps = [
        `Z trójkąta prostokątnego: $$\\frac{h}{s} = \\tg \\alpha$$`,
        `$$h = s \\cdot \\tg ${angle}^\\circ$$`,
        `$$h = ${sVal} \\cdot ${angle === 60 ? "\\sqrt{3}" : "\\frac{\\sqrt{3}}{3}"} = ${hLatex}$$`,
      ];

      s = sVal;
      h = angle === 60 ? s * 1.73 : s * 0.58;
    } else {
      base = MathUtils.randomInt(5, 15);

      if (this.difficulty === "easy") {
        h = base;
        s = base;
        angle = 45;
      } else {
        if (Math.random() > 0.5) {
          h = `${base}\\sqrt{3}`;
          s = base;
          angle = 60;
        } else {
          h = base;
          s = `${base}\\sqrt{3}`;
          angle = 30;
        }
      }

      question = `Drzewo o wysokości $$${h}$$ m rzuca cień o długości $$${s}$$ m. Pod jakim kątem promienie słoneczne padają na ziemię?`;
      correct = `${angle}^\\circ`;
      distractors = [`30^\\circ`, `45^\\circ`, `60^\\circ`]
        .filter((x) => x !== `${angle}^\\circ`)
        .concat([`${90 - angle}^\\circ`]);
      steps = [
        `Tworzymy trójkąt prostokątny. $$\\tg\\alpha = \\frac{\\text{wysokość}}{\\text{cień}}$$`,
        `$$\\tg\\alpha = \\frac{${h}}{${s}}$$`,
        this.difficulty === "medium"
          ? `Po skróceniu otrzymujemy wartość odpowiadającą kątowi $$${angle}^\\circ$$.`
          : `$$1 = \\tg 45^\\circ$$`,
      ];
    }

    return this.createResponse({
      question: question,
      latex: ``,
      image: TrigSVGUtils.generateSVG({
        type: "shadow",
        h: typeof h === "string" ? base * 1.7 : h,
        s: typeof s === "string" ? base * 1.7 : s,
      }),
      variables: { h, s, angle },
      correctAnswer: correct,
      distractors: distractors,
      steps: steps,
    });
  }
}

module.exports = TrigWordProblemsGenerator;
