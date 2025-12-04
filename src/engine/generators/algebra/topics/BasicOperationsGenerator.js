const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class BasicOperationsGenerator extends BaseGenerator {
  generatePowerProblem() {
    // difficulty
    let bases, nRange, kRange, mRange;

    if (this.difficulty === "easy") {
      bases = [2, 3, 5];
      nRange = [1, 4];
      kRange = [1, 3];
      mRange = [1, 4];
    } else if (this.difficulty === "hard") {
      bases = [2, 3, 5, 6, 7, 10];
      nRange = [-8, 8];
      kRange = [-6, 6];
      mRange = [-8, 8];
    } else {
      // medium
      bases = [2, 3, 5, 6];
      nRange = [-5, 5];
      kRange = [-4, 4];
      mRange = [-5, 5];
    }

    const base = MathUtils.randomElement(bases);
    const n = MathUtils.randomInt(nRange[0], nRange[1]);
    const k = MathUtils.randomInt(kRange[0], kRange[1]);
    const m = MathUtils.randomInt(mRange[0], mRange[1]);

    const finalExp = n + 2 * k - m;
    const baseSq = base * base;

    return this.createResponse({
      question: "Liczba $$x$$ jest równa wartości wyrażenia. Wyznacz $$x$$.",
      latex: `x = \\frac{${base}^{${n}} \\cdot ${baseSq}^{${k}}}{${base}^{${m}}}`,
      image: null,
      variables: { base, n, k, m, finalExp },
      correctAnswer: `${base}^{${finalExp}}`,
      distractors: [
        `${base}^{${n + k - m}}`,
        `${base}^{${finalExp * -1}}`,
        `${baseSq}^{${finalExp}}`,
      ],
      steps: [
        `Sprowadzamy do podstawy $$${base}$$: $$${baseSq} = ${base}^2$$.`,
        `$$(${base}^2)^{${k}} = ${base}^{${2 * k}}$$`,
        `Licznik: $$${base}^{${n}} \\cdot ${base}^{${2 * k}} = ${base}^{${n + 2 * k}}$$`,
        `Całość: $$x = ${base}^{${n + 2 * k} - ${m}} = ${base}^{${finalExp}}$$`,
      ],
    });
  }

  generateRootsProblem() {
    // difficulty
    let roots, f1Range, f2Range, opList;

    if (this.difficulty === "easy") {
      roots = [2, 3, 5];
      f1Range = [2, 4];
      f2Range = [1, 3];
      opList = ["+", "-"];
    } else if (this.difficulty === "hard") {
      roots = [2, 3, 5, 6, 7, 10, 11];
      f1Range = [5, 12];
      f2Range = [2, 10];
      opList = ["-", "+"];
    } else {
      roots = [2, 3, 5, 7];
      f1Range = [2, 6];
      f2Range = [1, 5];
      opList = ["-", "+"];
    }

    const root = MathUtils.randomElement(roots);
    const f1 = MathUtils.randomInt(f1Range[0], f1Range[1]);
    const f2 = MathUtils.randomInt(f2Range[0], Math.min(f1 - 1, f2Range[1]));

    const largeVal = f1 * f1 * root;
    const smallVal = f2 * f2 * root;
    const op = MathUtils.randomElement(opList);

    const resultFactor = op === "-" ? f1 - f2 : f1 + f2;
    const latex = `\\sqrt{${largeVal}} ${op} \\sqrt{${smallVal}}`;
    const correctAnswer = `${resultFactor}\\sqrt{${root}}`;

    return this.createResponse({
      question: "Liczba jest równa:",
      latex: latex,
      image: null,
      variables: { root, f1, f2, largeVal, smallVal },
      correctAnswer: correctAnswer,
      distractors: [
        `\\sqrt{${op === "-" ? largeVal - smallVal : largeVal + smallVal}}`,
        `${resultFactor * root}`,
        `${op === "-" ? f1 + f2 : f1 - f2}\\sqrt{${root}}`,
      ],
      steps: [
        `$$\\sqrt{${largeVal}} = ${f1}\\sqrt{${root}}$$`,
        `$$\\sqrt{${smallVal}} = ${f2}\\sqrt{${root}}$$`,
        `Wynik: $$${correctAnswer}$$`,
      ],
    });
  }

  generateScientificProblem() {
    // difficulty
    let bBaseRange, multipliers, expRange;

    if (this.difficulty === "easy") {
      bBaseRange = [2, 5];
      multipliers = [2, 3, 4];
      expRange = [2, 6];
    } else if (this.difficulty === "hard") {
      bBaseRange = [2, 9];
      multipliers = [1.5, 2.5, 0.5, 0.2];
      expRange = [-15, 15];
    } else {
      bBaseRange = [2, 8];
      multipliers = [2, 3, 4, 1.5, 2.5];
      expRange = [-10, 10];
    }

    const b_base = MathUtils.randomInt(bBaseRange[0], bBaseRange[1]);
    const multiplier = MathUtils.randomElement(multipliers);
    const a_base = b_base * multiplier;

    const k = MathUtils.randomInt(expRange[0], expRange[1]);
    const m = MathUtils.randomInt(expRange[0], expRange[1]);

    const mantissa = a_base / b_base; // = multiplier
    const exponent = k - m;

    let finalMantissa = mantissa;
    let finalExponent = exponent;

    if (finalMantissa >= 10) {
      finalMantissa /= 10;
      finalExponent += 1;
    } else if (finalMantissa < 1) {
      finalMantissa *= 10;
      finalExponent -= 1;
    }

    const formatNum = (num) => (Number.isInteger(num) ? `${num}` : `${num}`);

    return this.createResponse({
      question: "Wartość wyrażenia jest równa:",
      latex: `\\frac{${formatNum(a_base)} \\cdot 10^{${k}}}{${formatNum(b_base)} \\cdot 10^{${m}}}`,
      image: null,
      variables: { a_base, b_base, k, m },
      correctAnswer: `${formatNum(finalMantissa)} \\cdot 10^{${finalExponent}}`,
      distractors: [
        `${formatNum(finalMantissa)} \\cdot 10^{${k - m}}`,
        `${formatNum(mantissa * 10)} \\cdot 10^{${exponent}}`,
        `${formatNum(a_base - b_base)} \\cdot 10^{${k - m}}`,
      ],
      steps: [
        `$$${formatNum(a_base)}:${formatNum(b_base)}=${formatNum(mantissa)}$$`,
        `$$10^{${k}}:10^{${m}}=10^{${k - m}}$$`,
        `Normalizacja: $$${formatNum(finalMantissa)} \\cdot 10^{${finalExponent}}$$`,
      ],
    });
  }

  generateExponentRootConversion() {
    // difficulty
    let aList, nRange, mRange;

    if (this.difficulty === "easy") {
      aList = [2, 3, 5];
      nRange = [2, 3];
      mRange = [1, 2];
    } else if (this.difficulty === "hard") {
      aList = [2, 3, 5, 7, 11, 13];
      nRange = [3, 7];
      mRange = [2, 9];
    } else {
      aList = [2, 3, 5, 7];
      nRange = [3, 5];
      mRange = [2, 5];
    }

    const a = MathUtils.randomElement(aList);
    const n = MathUtils.randomInt(nRange[0], nRange[1]);
    const m = MathUtils.randomInt(mRange[0], mRange[1]);

    const resNum = 2 * m + n;
    const resDen = 2 * n;

    const gcd = (x, y) => (y ? gcd(y, x % y) : x);

    const common = gcd(resNum, resDen);
    const finalNum = resNum / common;
    const finalDen = resDen / common;

    return this.createResponse({
      question: `Liczbę $$\\sqrt[${n}]{${a}^${m}} \\cdot ${a}^{\\frac{1}{2}}$$ można zapisać w postaci:`,
      latex: ``,
      image: null,
      variables: { a, n, m },
      correctAnswer: `${a}^{\\frac{${finalNum}}{${finalDen}}}`,
      distractors: [
        `${a}^{\\frac{${m}}{${n + 2}}}`,
        `${a}^{\\frac{${resNum}}{${n}}}`,
        `${a}^{\\frac{${finalDen}}{${finalNum}}}`,
      ],
      steps: [
        `Zamieniamy pierwiastek na potęgę: $$\\sqrt[n]{a^m} = a^{\\frac{m}{n}}$$`,
        `Mnożenie potęg: dodajemy wykładniki $$\\frac{${m}}{${n}} + \\frac{1}{2}$$`,
        `Sprowadzamy do wspólnego mianownika i skracamy: $$${a}^{\\frac{${finalNum}}{${finalDen}}}$$`,
      ],
    });
  }
}

module.exports = BasicOperationsGenerator;
