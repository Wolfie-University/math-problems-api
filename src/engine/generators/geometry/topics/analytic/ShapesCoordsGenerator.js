const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const AnalyticSVGUtils = require("./AnalyticSVGUtils");

class ShapesCoordsGenerator extends BaseGenerator {
  generateCircleProblem() {
    let rangeS;
    if (this.difficulty === "easy") rangeS = [-3, 3];
    else rangeS = [-8, 8];

    const S = {
      x: MathUtils.randomInt(rangeS[0], rangeS[1]),
      y: MathUtils.randomInt(rangeS[0], rangeS[1]),
    };
    const r = MathUtils.randomInt(2, 6);

    const eq = `(x ${S.x > 0 ? "-" : "+"} ${Math.abs(S.x)})^2 + (y ${S.y > 0 ? "-" : "+"} ${Math.abs(S.y)})^2 = ${r * r}`;

    return this.createResponse({
      question: "Podaj kolejno: środek i promień okręgu o równaniu:",
      latex: eq,
      image: null,
      variables: { S, r },
      correctAnswer: `S=(${S.x},${S.y}), r=${r}`,
      distractors: [
        `S=(${-S.x},${-S.y}), r=${r}`,
        `S=(${S.x},${S.y}), r=${r * r}`,
        `S=(${S.y},${S.x}), r=${r}`,
      ],
      steps: [`$$(x-a)^2+(y-b)^2=r^2$$`, `$$a=${S.x}, b=${S.y}, r=${r}$$`],
      questionType: "open",
      answerFormat: "S=(x, y), r=d",
    });
  }

  generateCircleTangentToAxis() {
    let rangeS;
    if (this.difficulty === "easy") {
      rangeS = [-3, 3];
    } else {
      rangeS = [-8, 8];
    }

    const axis = MathUtils.randomElement(["Ox", "Oy"]);
    const S = {
      x: MathUtils.randomInt(rangeS[0], rangeS[1]),
      y: MathUtils.randomInt(rangeS[0], rangeS[1]),
    };
    if (S.x === 0) S.x = 2;
    if (S.y === 0) S.y = -3;

    const r = axis === "Ox" ? Math.abs(S.y) : Math.abs(S.x);

    return this.createResponse({
      question: `Okrąg o środku $$S=(${S.x}, ${S.y})$$ jest styczny do osi $$${axis}$$. Jego promień wynosi:`,
      latex: null,
      image: null,
      variables: { S, axis, r },
      correctAnswer: `${r}`,
      distractors: [
        `${axis === "Ox" ? Math.abs(S.x) : Math.abs(S.y)}`,
        `${r * r}`,
        `${Math.sqrt(S.x * S.x + S.y * S.y).toFixed(1)}`,
      ],
      steps: [
        `Odległość środka od osi $$${axis}$$ jest równa promieniowi. $$r = |${axis === "Ox" ? S.y : S.x}| = ${r}$$`,
      ],
      questionType: "closed",
    });
  }

  generateRadiusFromEquation() {
    let rSqList;
    if (this.difficulty === "easy") {
      rSqList = [4, 9, 16, 25, 36, 49, 64, 81, 100];
    } else if (this.difficulty === "hard") {
      rSqList = [2, 3, 5, 6, 7, 8, 10, 12];
    } else {
      rSqList = [4, 9, 25, 2, 3, 5];
    }

    const rSq = MathUtils.randomElement(rSqList);
    const rStr = Number.isInteger(Math.sqrt(rSq))
      ? `${Math.sqrt(rSq)}`
      : `\\sqrt{${rSq}}`;

    return this.createResponse({
      question: `Promień okręgu $$(x-1)^2 + (y+2)^2 = ${rSq}$$ wynosi:`,
      latex: ``,
      image: null,
      variables: { rSq },
      correctAnswer: rStr,
      distractors: [`${rSq}`, `${rSq / 2}`, `${rSq * 2}`],
      steps: [`$$r^2 = ${rSq} \\implies r = ${rStr}$$`],
      questionType: "closed",
    });
  }

  generateParallelogramVertex() {
    let range;
    if (this.difficulty === "easy") {
      range = [0, 5];
    } else {
      range = [-6, 6];
    }

    const A = {
      x: MathUtils.randomInt(range[0], range[1]),
      y: MathUtils.randomInt(range[0], range[1]),
    };
    const B = {
      x: A.x + MathUtils.randomInt(2, 6),
      y: A.y + MathUtils.randomInt(-2, 4),
    };
    const C = {
      x: B.x + MathUtils.randomInt(-2, 4),
      y: B.y + MathUtils.randomInt(3, 7),
    };
    const D = { x: A.x + C.x - B.x, y: A.y + C.y - B.y };

    return this.createResponse({
      question: `Wierzchołki równoległoboku ABCD: $$A(${A.x},${A.y})$$, $$B(${B.x},${B.y}), C(${C.x},${C.y})$$. Oblicz współrzędne wierzchołka $$D$$.`,
      latex: null,
      image: null,
      variables: { D },
      correctAnswer: `(${D.x}, ${D.y})`,
      distractors: [
        `(${B.x + C.x - A.x}, ${B.y + C.y - A.y})`,
        `(${A.x + B.x - C.x}, ${A.y + B.y - C.y})`,
        `(${(A.x + C.x) / 2}, ${(A.y + C.y) / 2})`,
      ],
      steps: [
        `$$x_D = x_A + x_C - x_B = ${D.x}$$`,
        `$$y_D = y_A + y_C - y_B = ${D.y}$$`,
      ],
      questionType: "open",
      answerFormat: "(x, y)",
    });
  }

  generateTriangleAreaCoords() {
    let range;
    if (this.difficulty === "easy") range = [-3, 3];
    else range = [-6, 6];

    const isHorizontal = this.difficulty === "easy" || Math.random() > 0.5;

    let x1, y1, x2, y2, x3, y3;
    let base, h;

    if (isHorizontal) {
      const y_base = MathUtils.randomInt(range[0], range[1]);
      x1 = MathUtils.randomInt(range[0], 0);
      x2 = x1 + MathUtils.randomInt(3, 8);
      x3 = MathUtils.randomInt(range[0], range[1]);
      y3 = y_base + MathUtils.randomElement([-3, -4, 3, 4]);

      y1 = y_base;
      y2 = y_base;
      base = Math.abs(x2 - x1);
      h = Math.abs(y3 - y_base);
    } else {
      const x_base = MathUtils.randomInt(range[0], range[1]);
      y1 = MathUtils.randomInt(range[0], 0);
      y2 = y1 + MathUtils.randomInt(3, 8);
      y3 = MathUtils.randomInt(range[0], range[1]);
      x3 = x_base + MathUtils.randomElement([-3, -4, 3, 4]);

      x1 = x_base;
      x2 = x_base;
      base = Math.abs(y2 - y1);
      h = Math.abs(x3 - x_base);
    }

    const area = 0.5 * base * h;

    const candidates = [
      area * 2,
      base + h,
      area + 2,
      area - 2,
      Math.abs(area - 1),
      (base * h) / 4,
      base * h + 2,
    ];

    const uniqueDistractors = [];
    const usedValues = new Set();
    usedValues.add(area);

    for (const val of candidates) {
      if (val > 0 && !usedValues.has(val)) {
        uniqueDistractors.push(`${val}`);
        usedValues.add(val);
      }
      if (uniqueDistractors.length === 3) break;
    }

    let offset = 1;
    while (uniqueDistractors.length < 3) {
      const val = area + offset;
      if (val > 0 && !usedValues.has(val)) {
        uniqueDistractors.push(`${val}`);
        usedValues.add(val);
      }
    }

    return this.createResponse({
      question: `Oblicz pole trójkąta o wierzchołkach $$A(${x1},${y1})$$, $$B(${x2},${y2})$$, $$C(${x3},${y3})$$.`,
      latex: null,
      image: null,
      variables: { area },
      correctAnswer: `${area}`,
      distractors: uniqueDistractors,
      steps: [
        isHorizontal
          ? `Podstawa AB pozioma, długość ${base}. Wysokość h=${h}. Pole = ${area}.`
          : `Podstawa AB pionowa, długość ${base}. Wysokość h=${h}. Pole = ${area}.`,
      ],
      questionType: "closed",
    });
  }
}

module.exports = ShapesCoordsGenerator;
