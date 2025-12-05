const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class LogarithmsGenerator extends BaseGenerator {
  generateLogProblem() {
    // log_a X - log_a Y = log_a (X/Y) = result
    let bases, resultRange, yRange;

    if (this.difficulty === "easy") {
      bases = [2, 3, 4, 5];
      resultRange = [1, 2];
      yRange = [2, 5];
    } else if (this.difficulty === "hard") {
      bases = [2, 3, 4, 5, 6, 8, 9];
      resultRange = [2, 4];
      yRange = [4, 15];
    } else {
      bases = [2, 3, 4, 5, 6];
      resultRange = [1, 3];
      yRange = [2, 8];
    }

    const base = MathUtils.randomElement(bases);
    const result = MathUtils.randomInt(resultRange[0], resultRange[1]);
    const ratio = Math.pow(base, result);

    const Y = MathUtils.randomInt(yRange[0], yRange[1]);
    const X = Y * ratio;

    return this.createResponse({
      question:
        "Wartość wyrażenia $$\\log_{${base}} ${X} - \\log_{${base}} ${Y}$$ jest równa:",
      latex: null,
      image: null,
      variables: { base, X, Y, result },
      correctAnswer: `${result}`,
      distractors: [`${result + 1}`, `\\log_{${base}} ${X + Y}`, `${X - Y}`],
      steps: [
        `$$\\log_a b - \\log_a c = \\log_a \\frac{b}{c}$$`,
        `$$\\log_{${base}} \\frac{${X}}{${Y}} = \\log_{${base}} ${X / Y} = ${result}$$`,
      ],
    });
  }

  generateLogPowerRule() {
    // k * log_a (realX) - log_a (y) = result
    let bases, kOptions, pRange, multRange;

    if (this.difficulty === "easy") {
      bases = [2, 3, 5];
      kOptions = [2];
      pRange = [1, 2];
      multRange = [1, 2];
    } else if (this.difficulty === "hard") {
      bases = [2, 3, 4, 5];
      kOptions = [2, 3];
      pRange = [2, 4];
      multRange = [2, 6];
    } else {
      bases = [2, 3, 5];
      kOptions = [2];
      pRange = [1, 3];
      multRange = [2, 4];
    }

    const base = MathUtils.randomElement(bases);
    const k = MathUtils.randomElement(kOptions);
    const p = MathUtils.randomInt(pRange[0], pRange[1]);

    // realX = multiplier * base
    const multiplier = MathUtils.randomInt(multRange[0], multRange[1]);
    const realX = multiplier * base;

    // total = base^p
    // log(realX^k) - log(y) = log(realX^k / y) = log(total)
    // y = realX^k / total
    const total = Math.pow(base, p);
    const numerator = Math.pow(realX, k);

    if (numerator % total !== 0) {
      return this.generateLogPowerRule();
    }

    const y = numerator / total;

    return this.createResponse({
      question: "Wartość wyrażenia jest równa:",
      latex: `${k}\\log_{${base}} ${realX} - \\log_{${base}} ${y}`,
      image: null,
      variables: { base, k, realX, y, p },
      correctAnswer: `${p}`,
      distractors: [
        `${p + 1}`,
        `\\log_{${base}} ${realX * k - y}`,
        `${Math.floor(realX / y)}`,
      ],
      steps: [
        `Korzystamy ze wzoru $$r \\log_a b = \\log_a b^r$$:`,
        `$$${k}\\log_{${base}} ${realX} = \\log_{${base}} ${realX}^${k} = \\log_{${base}} ${Math.pow(realX, k)}$$`,
        `Teraz odejmujemy logarytmy: $$\\log_a b - \\log_a c = \\log_a \\frac{b}{c}$$`,
        `$$\\log_{${base}} ${Math.pow(realX, k)} - \\log_{${base}} ${y} = \\log_{${base}} \\frac{${Math.pow(realX, k)}}{${y}} = \\log_{${base}} ${total}$$`,
        `$$${base}^x = ${total} \\implies x = ${p}$$`,
      ],
    });
  }
}

module.exports = LogarithmsGenerator;
