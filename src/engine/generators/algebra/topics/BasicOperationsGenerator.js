const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class BasicOperationsGenerator extends BaseGenerator {
  generatePowerProblem() {
    const base = MathUtils.randomElement([2, 3, 5]);
    const n = MathUtils.randomInt(-5, 5);
    const k = MathUtils.randomInt(-4, 4);
    const m = MathUtils.randomInt(-5, 5);
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
    const root = MathUtils.randomElement([2, 3, 5, 6, 7]);
    const f1 = MathUtils.randomInt(2, 6);
    const f2 = MathUtils.randomInt(1, f1 - 1);
    const largeVal = f1 * f1 * root;
    const smallVal = f2 * f2 * root;
    const op = MathUtils.randomElement(["-", "+"]);
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
    const b_base = MathUtils.randomInt(2, 8);
    const multiplier = MathUtils.randomElement([2, 3, 4, 1.5, 2.5]);
    const a_base = b_base * multiplier;
    const k = MathUtils.randomInt(-10, 10);
    const m = MathUtils.randomInt(-10, 10);
    const mantissa = a_base / b_base;
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

    return this.createResponse({
      question: "Wartość wyrażenia jest równa:",
      latex: `\\frac{${a_base} \\cdot 10^{${k}}}{${b_base} \\cdot 10^{${m}}}`,
      image: null,
      variables: { a_base, b_base, k, m },
      correctAnswer: `${finalMantissa} \\cdot 10^{${finalExponent}}`,
      distractors: [
        `${finalMantissa} \\cdot 10^{${k - m}}`,
        `${mantissa * 10} \\cdot 10^{${exponent}}`,
        `${a_base - b_base} \\cdot 10^{${k - m}}`,
      ],
      steps: [
        `$$${a_base}:${b_base}=${mantissa}$$`,
        `$$10^{${k}}:10^{${m}}=10^{${k - m}}$$`,
        `Normalizacja: $$${finalMantissa} \\cdot 10^{${finalExponent}}$$`,
      ],
    });
  }

  generateExponentRootConversion() {
    const a = MathUtils.randomElement([2, 3, 5, 7]);
    const n = MathUtils.randomInt(3, 5);
    const m = MathUtils.randomInt(2, 5);
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
