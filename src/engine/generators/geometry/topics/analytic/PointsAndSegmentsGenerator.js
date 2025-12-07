const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const AnalyticSVGUtils = require("./AnalyticSVGUtils");

class PointsAndSegmentsGenerator extends BaseGenerator {
  generateMidpointProblem() {
    let range;
    if (this.difficulty === "easy") {
      range = [-4, 4];
    } else if (this.difficulty === "hard") {
      range = [-8, 8];
    } else {
      range = [-6, 6];
    }

    const A = {
      x: MathUtils.randomInt(range[0], range[1]),
      y: MathUtils.randomInt(range[0], range[1]),
    };

    const dx = MathUtils.randomInt(1, 5) * (this.difficulty === "easy" ? 2 : 1);
    const dy = MathUtils.randomInt(1, 5) * (this.difficulty === "easy" ? 2 : 1);

    const B = { x: A.x + dx, y: A.y + dy };
    const S = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };

    const lengthSquared = Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2);
    const lengthStr = Number.isInteger(Math.sqrt(lengthSquared))
      ? `${Math.sqrt(lengthSquared)}`
      : `\\sqrt{${lengthSquared}}`;

    return this.createResponse({
      question: `Dane są punkty $$A=(${A.x}, ${A.y})$$ i $$B=(${B.x}, ${B.y})$$. Oblicz środek i długość odcinka.`,
      latex: null,
      image: null,
      variables: { A, B, S },
      correctAnswer: `S=(${S.x}, ${S.y}), |AB|=${lengthStr}`,
      distractors: [
        `S=(${S.x}, ${S.y}), |AB|=${lengthSquared}`,
        `S=(${B.x - A.x}, ${B.y - A.y}), |AB|=${lengthStr}`,
        `S=(${S.y}, ${S.x}), |AB|=${lengthStr}`,
      ],
      steps: [
        `$$S=(\\frac{${A.x}+${B.x}}{2}, \\frac{${A.y}+${B.y}}{2})=(${S.x}, ${S.y})$$`,
        `$$|AB|=\\sqrt{(${B.x}-${A.x})^2+(${B.y}-${A.y})^2}=${lengthStr}$$`,
      ],
      questionType: "open",
      answerFormat: "S=(x, y), |AB|=d",
    });
  }

  generateMissingEndpoint() {
    let range;
    if (this.difficulty === "easy") range = [-4, 4];
    else range = [-8, 8];

    const A = {
      x: MathUtils.randomInt(range[0], range[1]),
      y: MathUtils.randomInt(range[0], range[1]),
    };
    const S = {
      x: MathUtils.randomInt(range[0], range[1]),
      y: MathUtils.randomInt(range[0], range[1]),
    };

    // B = 2S - A
    const B = { x: 2 * S.x - A.x, y: 2 * S.y - A.y };

    return this.createResponse({
      question: `Punkt $$S=(${S.x}, ${S.y})$$ jest środkiem odcinka AB. Wiedząc, że $$A=(${A.x}, ${A.y})$$ oblicz B.`,
      latex: null,
      image: null,
      variables: { A, B, S },
      correctAnswer: `B=(${B.x}, ${B.y})`,
      distractors: [
        `B=(${S.x - A.x}, ${S.y - A.y})`,
        `B=(\\frac{${A.x}+${S.x}}{2}, \\frac{${A.y}+${S.y}}{2})`,
        `B=(${A.x}, ${A.y})`,
      ],
      steps: [`$$x_B = 2x_S - x_A = ${B.x}$$`, `$$y_B = 2y_S - y_A = ${B.y}$$`],
      questionType: "open",
      answerFormat: "B=(x, y)",
    });
  }

  generateDistanceUnknownCoord() {
    // |AB| = d. A=(x1, y1), B=(x2, m).
    const x1 = 1;
    const y1 = 2;

    let triples;

    if (this.difficulty === "easy") {
      triples = [
        [3, 4, 5],
        [6, 8, 10],
      ];
    } else {
      triples = [
        [5, 12, 13],
        [8, 15, 17],
        [7, 24, 25],
      ];
    }

    const triple = MathUtils.randomElement(triples);
    const swap = Math.random() > 0.5;
    const dx = swap ? triple[1] : triple[0];
    const dy = swap ? triple[0] : triple[1];
    const d = triple[2];

    const x2 = x1 + dx;

    const targetDy = Math.random() > 0.5 ? dy : -dy;
    const m = y1 + targetDy;

    const candidates = [y1 - targetDy, m + 2, m - 2, y1, x2, d, m + dy, 0];

    const uniqueDistractors = [];
    const usedValues = new Set();
    usedValues.add(m);

    for (const cand of candidates) {
      if (!usedValues.has(cand)) {
        uniqueDistractors.push(`${cand}`);
        usedValues.add(cand);
      }
      if (uniqueDistractors.length === 3) break;
    }

    let offset = 1;
    while (uniqueDistractors.length < 3) {
      const val = m + offset;
      if (!usedValues.has(val)) {
        uniqueDistractors.push(`${val}`);
        usedValues.add(val);
      }
      offset = offset > 0 ? -offset : -offset + 1;
    }

    return this.createResponse({
      question: `Punkty $$A=(${x1}, ${y1})$$ i $$B=(${x2}, m)$$ są odległe o $$${d}$$. Jedną z możliwych wartości $$m$$ jest:`,
      latex: null,
      image: null,
      variables: { m, d },
      correctAnswer: `${m}`,
      distractors: uniqueDistractors,
      steps: [
        `Wzór na długość odcinka: $$|AB| = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$$`,
        `Podstawiamy dane: $$${d} = \\sqrt{(${x2}-${x1})^2 + (m-${y1})^2}$$`,
        `$$${d}^2 = ${dx}^2 + (m-${y1})^2$$`,
        `$$${d * d} = ${dx * dx} + (m-${y1})^2$$`,
        `$$(m-${y1})^2 = ${dy * dy} \\implies |m-${y1}| = ${dy}$$`,
        `$$m-${y1} = ${dy} \\lor m-${y1} = -${dy}$$`,
        `$$m = ${y1 + dy} \\lor m = ${y1 - dy}$$`,
        `Jedną z wartości jest $$m=${m}$$`,
      ],
      questionType: "closed",
    });
  }

  generatePointSymmetry() {
    const P = { x: MathUtils.randomInt(-6, 6), y: MathUtils.randomInt(-6, 6) };
    let types;

    if (this.difficulty === "easy") types = ["Ox", "Oy"];
    else types = ["Ox", "Oy", "(0,0)"];

    const type = MathUtils.randomElement(types);
    let resX, resY;
    if (type === "Ox") {
      resX = P.x;
      resY = -P.y;
    } else if (type === "Oy") {
      resX = -P.x;
      resY = P.y;
    } else {
      resX = -P.x;
      resY = -P.y;
    }

    return this.createResponse({
      question: `Oblicz obraz punktu $$P(${P.x}, ${P.y})$$ w symetrii względem osi ${type}.`,
      latex: ``,
      image: null,
      variables: { P, type },
      correctAnswer: `(${resX}, ${resY})`,
      distractors: [
        `(${P.x}, ${P.y})`,
        `(${-resX}, ${-resY})`,
        `(${P.y}, ${P.x})`,
      ],
      steps: [
        type === "Ox"
          ? `Symetria OX: (x, -y)`
          : type === "Oy"
            ? `Symetria OY: (-x, y)`
            : `Symetria (0,0): (-x, -y)`,
      ],
      questionType: "open",
      answerFormat: "(x, y)",
    });
  }

  generateCollinearPoints() {
    let aRange, aDen;
    if (this.difficulty === "easy") {
      aRange = [-2, 2];
      aDen = 1;
    } else {
      aRange = [-5, 5];
      aDen = MathUtils.randomElement([1, 2]);
    }

    const a_num = MathUtils.randomInt(aRange[0], aRange[1]) || 1;
    const a_val = a_num / aDen;
    const b_int = MathUtils.randomInt(-5, 5);

    // A=(1, ...), B=(3, ...)
    // y = ax+b
    // C=(m, ...)
    const A2 = { x: 1 * aDen, y: a_num * 1 + b_int };
    const B2 = { x: 3 * aDen, y: a_num * 3 + b_int };

    const m_sol = MathUtils.randomInt(-4, 4);
    const C_val = a_val * m_sol + b_int;

    const C_val_str = Number.isInteger(C_val) ? `${C_val}` : C_val.toFixed(1);

    return this.createResponse({
      question: `Punkty $$A=(${A2.x}, ${A2.y})$$, $$B=(${B2.x}, ${B2.y})$$ i $$C=(m, ${C_val_str})$$ są współliniowe. Wynika stąd, że:`,
      latex: ``,
      image: null,
      variables: { m_sol },
      correctAnswer: `m = ${m_sol}`,
      distractors: [`m = ${m_sol + 1}`, `m = ${-m_sol}`, `m = 0`],
      steps: [
        `Wyznaczamy prostą AB.`,
        `Podstawiamy C do równania prostej $$y = ax + b$$`,
        `$$${C_val_str} = ${a_val}m + ${b_int} \\implies m=${m_sol}$$`,
      ],
      questionType: "closed",
    });
  }
}

module.exports = PointsAndSegmentsGenerator;
