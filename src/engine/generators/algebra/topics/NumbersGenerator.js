const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class NumbersGenerator extends BaseGenerator {
  generatePercentProblem() {
    let pList, priceRange;

    if (this.difficulty === "easy") {
      pList = [10, 20, 25, 50];
      priceRange = [20, 100];
    } else if (this.difficulty === "hard") {
      pList = [5, 15, 35, 45, 12, 8];
      priceRange = [150, 500];
    } else {
      pList = [10, 20, 25, 30, 40, 50];
      priceRange = [20, 200];
    }

    const p = MathUtils.randomElement(pList);
    const originalPrice =
      MathUtils.randomInt(priceRange[0] / 10, priceRange[1] / 10) * 10;

    const finalPrice = originalPrice * (1 - p / 100);

    const finalPriceStr = Number.isInteger(finalPrice)
      ? `${finalPrice}`
      : finalPrice.toFixed(2);

    return this.createResponse({
      question: `Cena towaru została obniżona o $$${p}\\%$$. Po obniżce towar kosztuje $$${finalPriceStr}$$ zł. Cena początkowa wynosiła:`,
      latex: null,
      image: null,
      variables: { p, originalPrice, finalPrice },
      correctAnswer: `${originalPrice} zł`,
      distractors: [
        `${(finalPrice * (1 + p / 100)).toFixed(2).replace(".00", "") + 5} zł`,
        `${originalPrice - 10} zł`,
        `${(finalPrice + p).toFixed(2).replace(".00", "") - 5} zł`,
      ],
      steps: [
        `$$(100\\% - ${p}\\%)x = ${finalPriceStr} \\implies ${(100 - p) / 100}x = ${finalPriceStr} \\implies x = ${originalPrice}$$`,
      ],
      questionType: "closed",
    });
  }

  generatePercentRelations() {
    let scenarios;

    if (this.difficulty === "easy") {
      scenarios = [
        { p: 100, b_frac: "0.5" }, // 2x -> 0.5
        { p: 50, b_frac: "\\frac{2}{3}" }, // 1.5x -> 2/3
      ];
    } else if (this.difficulty === "hard") {
      scenarios = [
        { p: 150, b_frac: "0.4" }, // 2.5x -> 0.4
        { p: 125, b_frac: "\\frac{4}{9}" }, // 2.25x -> 4/9
        { p: 300, b_frac: "0.25" }, // 4x -> 0.25
      ];
    } else {
      scenarios = [
        { p: 25, b_frac: "0.8" },
        { p: 60, b_frac: "0.625" },
        { p: 20, b_frac: "\\frac{5}{6}" },
      ];
    }

    const s = MathUtils.randomElement(scenarios);

    return this.createResponse({
      question: `Liczba $$x$$ jest o $$${s.p}\\%$$ większa od liczby $$y$$. Wynika stąd, że $$y=?$$`,
      latex: null,
      image: null,
      variables: { p: s.p },
      correctAnswer: `y = ${s.b_frac}x`,
      distractors: [
        `y = ${1 + s.p / 100}x`,
        `y = ${Math.abs(1 - s.p / 100)
          .toFixed(2)
          .replace("0.", ".")}x`,
        `y = ${s.p / 100}x`,
      ],
      steps: [
        `$$x = ${1 + s.p / 100}y$$`,
        `$$y = x : ${1 + s.p / 100} = ${s.b_frac}x$$`,
      ],
      questionType: "closed",
    });
  }

  generateErrorProblem() {
    let errorList, xRange;

    if (this.difficulty === "easy") {
      errorList = [1, 2, 5, 10];
      xRange = [10, 100];
    } else if (this.difficulty === "hard") {
      errorList = [0.5, 1.5, 2.5, 12];
      xRange = [150, 500];
    } else {
      errorList = [5, 10, 20, 25];
      xRange = [20, 200];
    }

    const errorPercent = MathUtils.randomElement(errorList);
    const x = MathUtils.randomInt(xRange[0] / 10, xRange[1] / 10) * 10;

    const delta = x * (errorPercent / 100);
    const isExcess = MathUtils.randomElement([true, false]);
    const y = isExcess ? x + delta : x - delta;

    const yStr = Number.isInteger(y) ? `${y}` : y.toFixed(2);
    const deltaStr = Number.isInteger(delta) ? `${delta}` : delta.toFixed(2);

    return this.createResponse({
      question: `Liczba $$y=${yStr}$$ jest przybliżeniem liczby $$x=${x}$$. Błąd względny wynosi:`,
      latex: null,
      image: null,
      variables: { x, y },
      correctAnswer: `${errorPercent}\\%`,
      distractors: [
        `${deltaStr}\\%`,
        `${100 - errorPercent}\\%`,
        `${errorPercent / 10}\\%`,
      ],
      steps: [
        `Błąd bezwzględny: $$|x-y|=${deltaStr}$$`,
        `Błąd względny: $$\\frac{${deltaStr}}{${x}} = ${errorPercent}\\%$$`,
      ],
      questionType: "closed",
    });
  }

  generateGcdLcm() {
    let commonList, mRange;

    if (this.difficulty === "easy") {
      commonList = [2, 3, 4, 5, 10];
      mRange = [1, 3];
    } else if (this.difficulty === "hard") {
      commonList = [12, 14, 15, 18, 24];
      mRange = [3, 8];
    } else {
      commonList = [4, 6, 8, 9, 12];
      mRange = [2, 5];
    }

    const common = MathUtils.randomElement(commonList);
    const m1 = MathUtils.randomInt(mRange[0], mRange[1]);
    const m2 = MathUtils.randomInt(mRange[0], mRange[1]);

    // a != b
    const a = common * m1;
    let b = common * m2;
    if (a === b) b += common;

    const gcdVal = this.getGCD(a, b);
    const lcmVal = this.getLCM(a, b);
    const mode = MathUtils.randomElement(["gcd", "lcm"]);
    const symbol = mode === "gcd" ? "NWD" : "NWW";
    const result = mode === "gcd" ? gcdVal : lcmVal;

    return this.createResponse({
      question: `Oblicz $$${symbol}(${a}, ${b})$$.`,
      latex: null,
      image: null,
      variables: { a, b, mode },
      correctAnswer: `${result}`,
      distractors: [
        `${mode === "gcd" ? lcmVal : gcdVal}`,
        `${mode === "gcd" ? 1 : a * b}`,
        `${mode === "gcd" ? Math.min(a, b) : Math.max(a, b)}`,
      ],
      steps: [
        `Rozkładamy na czynniki i stosujemy algorytm Euklidesa lub własność $$NWD \\cdot NWW = a \\cdot b$$.`,
      ],
      questionType: "open",
      answerFormat: `number`,
    });
  }

  getGCD(a, b) {
    return b ? this.getGCD(b, a % b) : a;
  }
  getLCM(a, b) {
    return (a * b) / this.getGCD(a, b);
  }
  getPrimeFactors(n) {
    const factors = [];
    let d = 2;
    while (d * d <= n) {
      while (n % d === 0) {
        factors.push(d);
        n /= d;
      }
      d++;
    }
    if (n > 1) factors.push(n);
    return factors;
  }
}

module.exports = NumbersGenerator;
