const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class GeneralSequencesGenerator extends BaseGenerator {
  generateNthTerm() {
    let aRange, bRange, cRange, nRange;
    if (this.difficulty === "easy") {
      aRange = [0, 0];
      bRange = [2, 5];
      cRange = [-5, 5];
      nRange = [2, 5];
    } else if (this.difficulty === "hard") {
      aRange = [1, 3];
      bRange = [-5, 5];
      cRange = [-10, 10];
      nRange = [5, 12];
    } else {
      aRange = [1, 1];
      bRange = [0, 0];
      cRange = [-5, 5];
      nRange = [3, 8];
    }

    const a = MathUtils.randomInt(aRange[0], aRange[1]);
    const b = MathUtils.randomInt(bRange[0], bRange[1]) || 1;
    const c = MathUtils.randomInt(cRange[0], cRange[1]);
    const n = MathUtils.randomInt(nRange[0], nRange[1]);

    const formula = `a_n = ${MathUtils.formatPolynomial(a, b, c).replace(/x/g, "n")}`;
    const val = a * n * n + b * n + c;

    return this.createResponse({
      question: `Oblicz $$a_{${n}}$$ dla ciągu $$${formula}$$ (dla $$n \\ge 1$$).`,
      latex: formula,
      image: null,
      variables: { a, b, c, n },
      correctAnswer: `${val}`,
      distractors: [`${val + b}`, `${val - b}`, `${-val}`],
      steps: [`$$a_{${n}} = ${a}(${n})^2 + (${b})(${n}) + (${c}) = ${val}$$`],
    });
  }

  generateWhichTerm() {
    let type;
    if (this.difficulty === "easy") {
      type = "linear";
    } else if (this.difficulty === "hard") {
      type = "quadratic";
    } else {
      type = MathUtils.randomElement(["linear", "quadratic"]);
    }

    const n = MathUtils.randomInt(2, 12);
    let a, b, c, X, formula;

    if (type === "linear") {
      a = MathUtils.randomInt(-5, 5) || 2;
      b = MathUtils.randomInt(-10, 10);
      X = a * n + b;
      formula = `a_n = ${a}n ${b >= 0 ? "+" : ""}${b}`;
    } else {
      a = 1;
      b = -MathUtils.randomInt(3, 12);
      c = MathUtils.randomInt(-10, 10);
      X = n * n + b * n + c;
      formula = `a_n = n^2 ${b >= 0 ? "+" : ""}${b}n ${c >= 0 ? "+" : ""}${c}`;
    }

    return this.createResponse({
      question: `Którym wyrazem ciągu $$(${formula})$$ jest liczba $$${X}$$?`,
      latex: formula,
      image: null,
      variables: { n, X },
      correctAnswer: `${n}`,
      distractors: [
        `${n + 1}`,
        `${n - 1}`,
        type === "quadratic" && b !== 0 ? `${Math.abs(n + b)}` : `${n + 2}`,
      ],
      steps: [`$$a_n = ${X} \\implies n = ${n}$$`],
    });
  }

  generateCountTerms() {
    let type;
    if (this.difficulty === "easy") type = "linear";
    else type = "quadratic";

    if (type === "linear") {
      const a = -MathUtils.randomInt(2, 5);
      const b = MathUtils.randomInt(20, 50);
      const limit = -b / a;
      const count = Math.ceil(limit) - 1;
      const formula = `a_n = ${a}n + ${b}`;

      return this.createResponse({
        question: `Ile wyrazów ciągu określonego wzorem $$${formula}$$ jest dodatnich?`,
        latex: formula,
        image: null,
        variables: { a, b, count },
        correctAnswer: `${count}`,
        distractors: [`${count + 1}`, `${count - 1}`, `${Math.floor(limit)}`],
        steps: [
          `$$${a}n + ${b} > 0 \\implies n < ${parseFloat(limit.toFixed(2))} \\implies n \\in \\{1, ..., ${count}\\}$$`,
        ],
      });
    } else {
      return this.generateQuadraticSequencePos();
    }
  }

  generateSequenceMonotonicity() {
    const a = MathUtils.randomElement([-3, -2, 2, 3]);
    const b = MathUtils.randomInt(-5, 5);
    const type = a > 0 ? "rosnący" : "malejący";
    const formula = `a_n = ${a}n ${b >= 0 ? "+" : ""}${b}`;

    return this.createResponse({
      question: `Ciąg określony wzorem $$${formula}$$ jest:`,
      latex: formula,
      image: null,
      variables: { a, b, type },
      correctAnswer: type,
      distractors: [a > 0 ? "malejący" : "rosnący", "stały", "niemonotoniczny"],
      steps: [`Różnica $$a_{n+1}-a_n = ${a}$$, więc ciąg jest ${type}.`],
    });
  }

  generateQuadraticSequencePos() {
    let x1Range, diffRange;
    if (this.difficulty === "easy") {
      x1Range = [1, 2];
      diffRange = [2, 4];
    } else {
      x1Range = [1, 3];
      diffRange = [5, 10];
    }

    const x1 = MathUtils.randomInt(x1Range[0], x1Range[1]);
    const diff = MathUtils.randomInt(diffRange[0], diffRange[1]);
    const x2 = x1 + diff;
    const b = x1 + x2;
    const c = -(x1 * x2);
    const count = x2 - x1 - 1;
    const formula = `-n^2 + ${b}n ${c >= 0 ? "+" : ""}${c}`;

    return this.createResponse({
      question: `Ile wyrazów ciągu $$a_n = ${formula}$$ jest dodatnich?`,
      latex: formula,
      image: null,
      variables: { x1, x2, count },
      correctAnswer: `${count}`,
      distractors: [`${count + 1}`, `${count + 2}`, `${x2}`],
      steps: [
        `Parabola w dół, dodatnia między $$${x1}$$ a $$${x2}$$. Ilość liczb całkowitych: $$${count}$$.`,
      ],
    });
  }

  generateSequenceAverage() {
    const n = 5;
    const middle = MathUtils.randomInt(4, 10);
    const r = MathUtils.randomInt(2, 5);
    const a1 = middle - 2 * r;
    const avg = middle;

    return this.createResponse({
      question: `Średnia arytmetyczna pięciu początkowych wyrazów ciągu arytmetycznego wynosi $$${avg}$$. Pierwszy wyraz tego ciągu to $$${a1}$$. Różnica tego ciągu jest równa:`,
      latex: `\\bar{x}=${avg}, a_1=${a1}`,
      image: null,
      variables: { a1, avg, r },
      correctAnswer: `${r}`,
      distractors: [`${r + 1}`, `${avg - a1}`, `${r * 2}`],
      steps: [`$$a_3 = ${avg} = a_1 + 2r \\implies r = ${r}$$`],
    });
  }

  generateSumFormulaAnalysis() {
    let aRange, bRange;
    if (this.difficulty === "easy") {
      aRange = [1, 1];
      bRange = [0, 2];
    } else {
      aRange = [2, 4];
      bRange = [3, 8];
    }

    const a = MathUtils.randomInt(aRange[0], aRange[1]);
    const b = MathUtils.randomInt(bRange[0], bRange[1]);
    const S3 = a * 3 * 3 - b * 3;
    const S2 = a * 2 * 2 - b * 2;
    const a3 = S3 - S2;
    const formula = `S_n = ${a === 1 ? "" : a}n^2 - ${b}n`;

    return this.createResponse({
      question: `Suma $$n$$ początkowych wyrazów ciągu liczbowego określona jest wzorem $$${formula}$$ dla $$n \\ge 1$$. Trzeci wyraz tego ciągu jest równy:`,
      latex: formula,
      image: null,
      variables: { S3, S2, a3 },
      correctAnswer: `${a3}`,
      distractors: [`${S3}`, `${S3 + S2}`, `${a * 3 * 3 + b * 3}`],
      steps: [`$$a_3 = S_3 - S_2 = ${S3} - ${S2} = ${a3}$$`],
    });
  }
}

module.exports = GeneralSequencesGenerator;
