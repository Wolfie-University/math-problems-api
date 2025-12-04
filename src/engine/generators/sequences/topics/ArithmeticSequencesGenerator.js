const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class ArithmeticSequencesGenerator extends BaseGenerator {
  generateArithmeticX() {
    // (a, x, b) -> x = (a+b)/2
    let rRange, midRange;

    if (this.difficulty === "easy") {
      rRange = [2, 5];
      midRange = [2, 10];
    } else if (this.difficulty === "hard") {
      rRange = [-10, 10];
      midRange = [-20, 20];
    } else {
      rRange = [-5, 5];
      midRange = [-10, 10];
    }

    const r = MathUtils.randomInt(rRange[0], rRange[1]) || 2;
    const middle = MathUtils.randomInt(midRange[0], midRange[1]);
    const first = middle - r;
    const last = middle + r;

    const askForEdge = this.difficulty === "hard" && Math.random() > 0.5;

    if (askForEdge) {
      return this.createResponse({
        question: `Liczby $$(x, ${middle}, ${last})$$ tworzą ciąg arytmetyczny. Oblicz $$x$$.`,
        latex: `(x, ${middle}, ${last})`,
        image: null,
        variables: { first, middle, last },
        correctAnswer: `${first}`,
        distractors: [`${last}`, `${middle - r * 2}`, `${middle + r}`],
        steps: [
          `$$r = ${last} - ${middle} = ${r}$$`,
          `$$x = ${middle} - r = ${first}$$`,
        ],
      });
    }

    return this.createResponse({
      question: `Liczby $$(${first}, x, ${last})$$ tworzą ciąg arytmetyczny. Oblicz $$x$$.`,
      latex: `(${first}, x, ${last})`,
      image: null,
      variables: { first, middle, last },
      correctAnswer: `${middle}`,
      distractors: [`${first + last}`, `${r}`, `${middle + 1}`],
      steps: [`$$x = \\frac{${first}+${last}}{2} = ${middle}$$`],
    });
  }

  generateArithmeticParams() {
    // a_k, a_m -> r
    let k, mDiff, rRange;

    if (this.difficulty === "easy") {
      k = 1;
      mDiff = 1; // a1, a2
      rRange = [2, 5];
    } else if (this.difficulty === "hard") {
      k = MathUtils.randomInt(3, 6);
      mDiff = MathUtils.randomInt(4, 8);
      rRange = [-5, 5];
    } else {
      k = 2;
      mDiff = 3;
      rRange = [-3, 3];
    }

    const m = k + mDiff;
    const r = MathUtils.randomInt(rRange[0], rRange[1]) || 2;
    const a1 = MathUtils.randomInt(-10, 10);

    const vk = a1 + (k - 1) * r;
    const vm = a1 + (m - 1) * r;

    return this.createResponse({
      question: `W ciągu arytmetycznym $$a_{${k}}=${vk}$$ oraz $$a_{${m}}=${vm}$$. Oblicz różnicę $$r$$ tego ciągu.`,
      latex: `a_{${k}}=${vk}, a_{${m}}=${vm}`,
      image: null,
      variables: { r },
      correctAnswer: `r=${r}`,
      distractors: [`r=${r + 1}`, `r=${-r}`, `r=${vm - vk}`],
      steps: [
        `Korzystamy ze wzoru $$a_m - a_k = (m-k)r$$`,
        `$$${vm} - ${vk} = (${m}-${k})r$$`,
        `$$${vm - vk} = ${m - k}r \\implies r=${r}$$`,
      ],
    });
  }

  generateArithmeticSum() {
    let nRange, a1Range;
    if (this.difficulty === "easy") {
      nRange = [5, 10];
      a1Range = [1, 5];
    } else if (this.difficulty === "hard") {
      nRange = [20, 50];
      a1Range = [-20, 20];
    } else {
      nRange = [10, 20];
      a1Range = [-10, 10];
    }

    const n = MathUtils.randomInt(nRange[0], nRange[1]);
    const a1 = MathUtils.randomInt(a1Range[0], a1Range[1]);
    const r = MathUtils.randomInt(-5, 5) || 2;

    const an = a1 + (n - 1) * r;
    const sum = ((a1 + an) / 2) * n;

    const mode = MathUtils.randomElement(["formula", "params"]);
    let question, latex, dist1, dist2;

    if (mode === "formula") {
      const b = a1 - r;
      const formula = `a_n = ${r}n ${b >= 0 ? "+" : ""}${b}`;
      question = `Oblicz sumę $$${n}$$ początkowych wyrazów ciągu arytmetycznego określonego wzorem $$${formula}$$ dla $$n \\ge 1$$.`;
      latex = formula;
      dist1 = sum + n * r;
      dist2 = sum - a1;
    } else {
      question = `W ciągu arytmetycznym $$a_1 = ${a1}$$ oraz $$r = ${r}$$. Oblicz sumę $$${n}$$ początkowych wyrazów tego ciągu.`;
      latex: `a_1=${a1}, r=${r}`;
      dist1 = ((a1 + an) / 2) * (n - 1);
      dist2 = (a1 + an) * n;
    }

    return this.createResponse({
      question: question,
      latex: latex,
      image: null,
      variables: { a1, r, n, an },
      correctAnswer: `${sum}`,
      distractors: [`${dist1}`, `${dist2}`, `${sum + 10}`],
      steps: [
        `Obliczamy $$a_{${n}} = a_1 + (n-1)r = ${a1} + ${n - 1}\\cdot${r} = ${an}$$`,
        `Wzór na sumę: $$S_{${n}} = \\frac{a_1 + a_{${n}}}{2} \\cdot ${n}$$`,
        `$$S_{${n}} = \\frac{${a1} + ${an}}{2} \\cdot ${n} = ${sum}$$`,
      ],
    });
  }

  generateArithmeticAlgebraic() {
    // 2b = a+c
    let xRange;
    if (this.difficulty === "easy") xRange = [2, 5];
    else if (this.difficulty === "hard") xRange = [10, 20];
    else xRange = [3, 8];

    const x = MathUtils.randomInt(xRange[0], xRange[1]);
    const a = MathUtils.randomInt(-3, 3);
    const b_coeff = MathUtils.randomInt(2, 4);
    const d_real = 2 * b_coeff - 2;
    const e = x - a;

    const t1 = `x ${a >= 0 ? "+" : ""}${a}`;
    const t2 = `${b_coeff}x`;
    const t3 = `${d_real}x ${e >= 0 ? "+" : ""}${e}`;

    return this.createResponse({
      question: `Ciąg $$(${t1}, ${t2}, ${t3})$$ jest arytmetyczny. Wtedy $$x$$ jest równe:`,
      latex: ``,
      image: null,
      variables: { x },
      correctAnswer: `${x}`,
      distractors: [`${x + 1}`, `${-x}`, `${0}`],
      steps: [
        `Dla ciągu arytmetycznego zachodzi: $$2b = a + c$$`,
        `$$2(${t2}) = (${t1}) + (${t3})$$`,
        `Rozwiązujemy równanie: $$x = ${x}$$`,
      ],
    });
  }
}

module.exports = ArithmeticSequencesGenerator;
