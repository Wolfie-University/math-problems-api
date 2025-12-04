const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class DiceAndCoinsGenerator extends BaseGenerator {
  generateDiceSum() {
    let limitRange;
    if (this.difficulty === "easy") {
      limitRange = [2, 5];
      limitRange = [9, 10];
    } else if (this.difficulty === "hard") {
      limitRange = [5, 7];
    } else {
      limitRange = [7, 9];
    }

    const limit = MathUtils.randomInt(limitRange[0], limitRange[1]);
    const omega = 36;
    let favored = 0;

    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 6; j++) {
        if (i + j > limit) favored++;
      }
    }

    const gcd = this.getGCD(favored, omega);
    return this.createResponse({
      question: `Rzucamy dwa razy sześcienną kostką. Oblicz prawdopodobieństwo, że suma wyrzuconych oczek jest większa od $$${limit}$$.`,
      latex: ``,
      image: null,
      variables: { limit, favored },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [
        `\\frac{1}{6}`,
        `\\frac{1}{2}`,
        `\\frac{${favored + 1}}{36}`,
      ],
      steps: [
        `Liczba wszystkich zdarzeń elementarnych: $$|\\Omega| = 6 \\cdot 6 = 36$$.`,
        `Wypisujemy zdarzenia sprzyjające (suma > ${limit}).`,
        `Jest ich $$${favored}$$.`,
        `$$P(A) = \\frac{${favored}}{36}$$`,
      ],
    });
  }

  generateDiceComparison() {
    const omega = 36;
    let type;

    if (this.difficulty === "easy") {
      type = "equal";
    } else if (this.difficulty === "hard") {
      type = MathUtils.randomElement(["greater", "less"]);
    } else {
      type = MathUtils.randomElement(["greater", "equal"]);
    }

    let favored = 0;
    let desc = "";

    if (type === "equal") {
      favored = 6;
      desc =
        "liczba oczek w pierwszym rzucie będzie równa liczbie oczek w drugim";
    } else {
      favored = 15;
      desc = `liczba oczek w pierwszym rzucie będzie ${type === "greater" ? "większa od" : "mniejsza od"} liczby oczek w drugim`;
    }

    const gcd = this.getGCD(favored, omega);

    return this.createResponse({
      question: `Rzucamy dwa razy sześcienną kostką. Oblicz prawdopodobieństwo, że ${desc}.`,
      latex: ``,
      image: null,
      variables: { favored },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [`\\frac{1}{2}`, `\\frac{1}{6}`, `\\frac{21}{36}`],
      steps: [
        `$$|\\Omega| = 36$$`,
        `Liczba zdarzeń sprzyjających: $$${favored}$$`,
        `$$P(A) = \\frac{${favored}}{36}$$`,
      ],
    });
  }

  generateDiceProduct() {
    const omega = 36;
    let type;

    if (this.difficulty === "easy") {
      type = "odd";
    } else if (this.difficulty === "hard") {
      type = "div4";
    } else {
      type = "even";
    }

    let favored = 0;
    let desc = "";

    if (type === "odd") {
      favored = 9;
      desc = "iloczyn oczek będzie liczbą nieparzystą";
    } else if (type === "even") {
      favored = 27;
      desc = "iloczyn oczek będzie liczbą parzystą";
    } else {
      desc = "iloczyn oczek będzie podzielny przez 4";
      for (let i = 1; i <= 6; i++)
        for (let j = 1; j <= 6; j++) if ((i * j) % 4 === 0) favored++;
    }

    const gcd = this.getGCD(favored, omega);

    return this.createResponse({
      question: `Rzucamy dwa razy kostką. Oblicz prawdopodobieństwo, że ${desc}.`,
      latex: ``,
      image: null,
      variables: { favored, type },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [`\\frac{1}{2}`, `\\frac{1}{4}`, `\\frac{1}{6}`],
      steps: [
        `Liczba zdarzeń sprzyjających: $$${favored}$$`,
        `$$P(A) = \\frac{${favored}}{36}$$`,
      ],
    });
  }

  generateCoinsDynamic() {
    let n;
    if (this.difficulty === "easy") n = 2;
    else if (this.difficulty === "hard") n = 4;
    else n = 3;

    const omega = Math.pow(2, n);
    const favored = omega - 1;
    const gcd = this.getGCD(favored, omega);

    return this.createResponse({
      question: `Rzucamy $$${n}$$ razy monetą. Prawdopodobieństwo wyrzucenia co najmniej jednego orła:`,
      latex: ``,
      image: null,
      variables: { n, favored },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [
        `\\frac{1}{${omega}}`,
        `\\frac{1}{2}`,
        `\\frac{${n}}{${omega}}`,
      ],
      steps: [
        `Zdarzenie przeciwne (same reszki): 1. $$P(A) = 1 - \\frac{1}{${omega}}$$`,
      ],
    });
  }

  getGCD(a, b) {
    return b ? this.getGCD(b, a % b) : a;
  }
}

module.exports = DiceAndCoinsGenerator;
