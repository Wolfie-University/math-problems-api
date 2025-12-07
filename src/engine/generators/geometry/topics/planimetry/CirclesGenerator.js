const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const PlanimetrySVGUtils = require("./PlanimetrySVGUtils");

class CirclesGenerator extends BaseGenerator {
  generateCircleAngles() {
    let alpha;
    if (this.difficulty === "easy") {
      alpha = MathUtils.randomInt(2, 7) * 10;
    } else if (this.difficulty === "hard") {
      alpha = MathUtils.randomInt(40, 140) / 2;
    } else {
      alpha = MathUtils.randomInt(20, 70);
    }

    const beta = 2 * alpha;
    const mode = MathUtils.randomElement(["find_central", "find_inscribed"]);

    const aStr = Number.isInteger(alpha) ? `${alpha}` : alpha.toFixed(1);
    const bStr = Number.isInteger(beta) ? `${beta}` : beta.toFixed(1);

    return this.createResponse({
      question:
        mode === "find_central"
          ? `Punkt $$O$$ jest środkiem okręgu. Kąt wpisany $$\\alpha$$ ma miarę $$${aStr}^\\circ$$. Miara kąta środkowego $$\\beta$$ opartego na tym samym łuku jest równa:`
          : `Punkt $$O$$ jest środkiem okręgu. Kąt środkowy $$\\beta$$ ma miarę $$${bStr}^\\circ$$. Miara kąta wpisanego $$\\alpha$$ opartego na tym samym łuku jest równa:`,
      latex: null,
      image: null,
      variables: { alpha, beta, mode },
      correctAnswer:
        mode === "find_central" ? `${bStr}^\\circ` : `${aStr}^\\circ`,
      distractors:
        mode === "find_central"
          ? [
              `${aStr - 10}^\\circ`,
              `${(180 - alpha).toFixed(1).replace(".0", "")}^\\circ`,
              `${(90 + alpha).toFixed(1).replace(".0", "")}^\\circ`,
            ]
          : [
              `${bStr - 10}^\\circ`,
              `${(beta * 2).toFixed(1).replace(".0", "")}^\\circ`,
              `${(180 - beta).toFixed(1).replace(".0", "")}^\\circ`,
            ],
      steps: [
        `Zależność: $$\\beta = 2\\alpha$$`,
        mode === "find_central"
          ? `$$\\beta = 2 \\cdot ${aStr}^\\circ = ${bStr}^\\circ$$`
          : `$$\\alpha = ${bStr}^\\circ : 2 = ${aStr}^\\circ$$`,
      ],
      questionType: "closed",
    });
  }

  generateCircleAreaCircumference() {
    let rRange;
    if (this.difficulty === "easy") rRange = [2, 5];
    else if (this.difficulty === "hard") rRange = [8, 15];
    else rRange = [4, 9];

    const r = MathUtils.randomInt(rRange[0], rRange[1]);
    const mode = MathUtils.randomElement([
      "area_from_r",
      "circ_from_r",
      "r_from_area",
    ]);

    if (mode === "area_from_r") {
      return this.createResponse({
        question: `Pole koła o promieniu $$${r}$$ jest równe:`,
        latex: `r=${r}`,
        image: PlanimetrySVGUtils.generateSVG({ type: "circle_r", r }),
        variables: { r },
        correctAnswer: `${r * r}\\pi`,
        distractors: [`${2 * r}\\pi`, `${r}\\pi`, `${r * r}`],
        steps: [`$$P = \\pi r^2 = \\pi \\cdot ${r}^2 = ${r * r}\\pi$$`],
        questionType: "closed",
      });
    } else if (mode === "circ_from_r") {
      return this.createResponse({
        question: `Obwód koła o promieniu $$${r}$$ jest równy:`,
        latex: `r=${r}`,
        image: PlanimetrySVGUtils.generateSVG({ type: "circle_r", r }),
        variables: { r },
        correctAnswer: `${2 * r}\\pi`,
        distractors: [`${r * r}\\pi`, `${r}\\pi`, `${2 * r}`],
        steps: [`$$L = 2\\pi r = 2\\pi \\cdot ${r} = ${2 * r}\\pi$$`],
        questionType: "closed",
      });
    } else {
      const area = r * r;
      return this.createResponse({
        question: `Pole koła jest równe $$${area}\\pi$$. Promień tego koła wynosi:`,
        latex: null,
        image: null,
        variables: { area, r },
        correctAnswer: `${r}`,
        distractors: [`${area}`, `${area / 2}`, `${Math.sqrt(area) * 2}`],
        steps: [`$$P = \\pi r^2 \\implies r^2 = ${area} \\implies r = ${r}$$`],
        questionType: "closed",
      });
    }
  }

  generateSectorArea() {
    let angles, niceR;
    if (this.difficulty === "easy") {
      angles = [60, 90, 180];
      niceR = 6;
      if (angles.includes(90)) niceR = 4; // 1/4 * 16pi = 4pi
    } else if (this.difficulty === "hard") {
      angles = [40, 72, 150];
      niceR = 6; // 36 * 1/9 = 4pi
    } else {
      angles = [30, 45, 60, 120];
      niceR = 6;
      if (angles.includes(45)) niceR = 4;
    }

    const alpha = MathUtils.randomElement(angles);
    if (alpha === 72) niceR = 5;

    const niceTotal = niceR * niceR;
    const niceSector = (niceTotal * alpha) / 360;

    const niceSectorStr = Number.isInteger(niceSector)
      ? `${niceSector}`
      : niceSector.toFixed(1);

    return this.createResponse({
      question: `Pole wycinka koła o promieniu $$${niceR}$$ i kącie środkowym $$${alpha}^\\circ$$ jest równe:`,
      latex: null,
      image: null,
      variables: { niceR, alpha },
      correctAnswer: `${niceSectorStr}\\pi`,
      distractors: [
        `${(niceSector * 2).toFixed(1).replace(".0", "")}\\pi`,
        `${niceTotal}\\pi`,
        `${niceSectorStr}`,
      ],
      steps: [
        `$$P_w = \\frac{${alpha}}{360} \\cdot \\pi \\cdot ${niceR}^2 = ${niceSectorStr}\\pi$$`,
      ],
      questionType: "closed",
    });
  }

  generateArcLength() {
    let angles, niceR;
    if (this.difficulty === "easy") {
      angles = [90, 180]; // 1/4, 1/2
      niceR = 4; // L = 1/4 * 8pi = 2pi
    } else if (this.difficulty === "hard") {
      angles = [40, 80, 160];
      niceR = 9; // 40/360 = 1/9. L = 1/9 * 18pi = 2pi
    } else {
      angles = [60, 120];
      niceR = 6; // 1/6 * 12pi = 2pi
    }

    const alpha = MathUtils.randomElement(angles);
    const niceLen = (alpha / 360) * 2 * niceR;
    const niceLenStr = Number.isInteger(niceLen)
      ? `${niceLen}`
      : niceLen.toFixed(1);

    return this.createResponse({
      question: `Długość łuku okręgu o promieniu $$${niceR}$$ i kącie środkowym $$${alpha}^\\circ$$ wynosi:`,
      latex: null,
      image: null,
      variables: { niceR, alpha },
      correctAnswer: `${niceLenStr}\\pi`,
      distractors: [
        `${(niceLen * niceR).toFixed(0)}\\pi`,
        `${(niceLen / 2).toFixed(1).replace(".0", "")}\\pi`,
        `${2 * niceR}\\pi`,
      ],
      steps: [
        `Wzór: $$L = \\frac{\\alpha}{360^\\circ} \\cdot 2\\pi r$$`,
        `$$L = \\frac{${alpha}}{360} \\cdot 2\\pi \\cdot ${niceR} = ${niceLenStr}\\pi$$`,
      ],
      questionType: "closed",
    });
  }

  generateThalesTheorem() {
    let angleRange;
    if (this.difficulty === "easy") angleRange = [30, 60];
    else if (this.difficulty === "hard") angleRange = [15, 75];
    else angleRange = [20, 70];

    const alpha = MathUtils.randomInt(angleRange[0], angleRange[1]);
    const beta = 90 - alpha;
    return this.createResponse({
      question: `Trójkąt $$ABC$$ wpisany w okrąg o średnicy $$AB$$. Kąt $$A$$ ma $$${alpha}^\\circ$$. Kąt $$B$$ ma:`,
      latex: null,
      image: null,
      variables: { alpha, beta },
      correctAnswer: `${beta}^\\circ`,
      distractors: [
        `${alpha}^\\circ`,
        `${90 + alpha}^\\circ`,
        `${180 - alpha}^\\circ`,
      ],
      steps: [`Kąt $$C = 90^\\circ$$. $$\\beta = 90 - ${alpha} = ${beta}$$`],
      questionType: "closed",
    });
  }

  generateCircleTangent() {
    let triples;
    if (this.difficulty === "easy") {
      triples = [
        [3, 4, 5],
        [6, 8, 10],
      ];
    } else if (this.difficulty === "hard") {
      triples = [
        [8, 15, 17],
        [9, 12, 15],
      ];
    } else {
      triples = [[5, 12, 13]];
    }

    const [r, x, d] = MathUtils.randomElement(triples);
    const mode = MathUtils.randomElement(["find_tangent", "find_dist"]);
    return this.createResponse({
      question:
        mode === "find_tangent"
          ? `Promień okręgu wynosi $$r=${r}$$, odległość od środka $$d=${d}$$. Styczna $$x$$ ma długość:`
          : `Styczna do okręgu wynosi $$x=${x}$$, promień okręgu $$r=${r}$$. Odległość $$d$$ ma długość:`,
      latex: null,
      image: PlanimetrySVGUtils.generateSVG({
        type: "circle_tangent",
        r,
        d,
        x,
      }),
      variables: { r, x, d },
      correctAnswer: mode === "find_tangent" ? `${x}` : `${d}`,
      distractors: [`${d - r}`, `${x + r}`, `${d + r}`],
      steps: [`$$r^2 + x^2 = d^2$$`],
      questionType: "closed",
    });
  }
}

module.exports = CirclesGenerator;
