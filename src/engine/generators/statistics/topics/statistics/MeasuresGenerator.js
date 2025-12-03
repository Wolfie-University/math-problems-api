const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class MeasuresGenerator extends BaseGenerator {
  generateBasicStatsProblem() {
    const count = MathUtils.randomInt(6, 9);
    const numbers = [];
    for (let i = 0; i < count; i++) numbers.push(MathUtils.randomInt(1, 9));
    const mode = MathUtils.randomElement(["mean", "median"]);
    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((a, b) => a + b, 0);

    let answer,
      steps = [];
    if (mode === "mean") {
      const mean = sum / count;
      const meanStr = Number.isInteger(mean)
        ? `${mean}`
        : `\\frac{${sum}}{${count}}`;
      answer = meanStr;
      steps = [
        `Suma: $$${sum}$$`,
        `Ilość: $$${count}$$`,
        `Średnia: $$${meanStr}$$`,
      ];
    } else {
      const mid = Math.floor(count / 2);
      let medVal;
      steps.push(`Porządkujemy: $$${sorted.join(", ")}$$`);
      if (count % 2 !== 0) {
        medVal = sorted[mid];
        steps.push(`Środkowy: $$${medVal}$$`);
      } else {
        medVal = (sorted[mid - 1] + sorted[mid]) / 2;
        steps.push(`Średnia środkowych: $$${medVal}$$`);
      }
      answer = `${medVal}`;
    }

    return this.createResponse({
      question: `Dany jest zestaw liczb: $$${numbers.join(", ")}$$. ${mode === "mean" ? "Średnia arytmetyczna" : "Mediana"} jest równa:`,
      latex: ``,
      image: null,
      variables: { numbers },
      correctAnswer: answer,
      distractors: [
        `${(sum / (count - 1)).toFixed(2)}`,
        `${sorted[0]}`,
        `${sorted[count - 1]}`,
      ],
      steps: steps,
    });
  }

  generateModeProblem() {
    const targetMode = MathUtils.randomInt(1, 9);
    const numbers = [targetMode, targetMode, targetMode];
    for (let i = 0; i < 5; i++) {
      let n;
      do {
        n = MathUtils.randomInt(1, 9);
      } while (n === targetMode);
      numbers.push(n);
    }
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return this.createResponse({
      question: `Dominanta zestawu: $$${numbers.join(", ")}$$ wynosi:`,
      latex: ``,
      image: null,
      variables: { targetMode },
      correctAnswer: `${targetMode}`,
      distractors: [`${numbers[0]}`, `5`, `0`],
      steps: [`Liczba $$${targetMode}$$ występuje najczęściej.`],
    });
  }

  generateWeightedMeanProblem() {
    const grades = [];
    let num = 0,
      den = 0;
    const c = 3;
    for (let i = 0; i < c; i++) {
      const g = MathUtils.randomInt(2, 5),
        w = MathUtils.randomInt(1, 3);
      grades.push({ g, w });
      num += g * w;
      den += w;
    }
    const mean = num / den;
    const meanStr = Number.isInteger(mean) ? `${mean}` : mean.toFixed(2);
    return this.createResponse({
      question: `Oceny z wagami: ${grades.map((x) => `${x.g} (waga ${x.w})`).join(", ")}. Średnia ważona:`,
      latex: ``,
      image: null,
      variables: { mean },
      correctAnswer: meanStr,
      distractors: [`${mean + 0.5}`, `${mean - 0.5}`, `${Math.floor(mean)}`],
      steps: [`Licznik: ${num}, Mianownik: ${den}, Wynik: ${meanStr}`],
    });
  }

  generateStdDevProblem() {
    const setType = MathUtils.randomElement([
      "seq_odd",
      "seq_even",
      "symmetric",
    ]);
    let nums = [],
      mean = 0;
    if (setType === "seq_odd") {
      nums = [1, 3, 5, 7, 9];
      mean = 5;
    } else if (setType === "seq_even") {
      nums = [2, 4, 6, 8, 10];
      mean = 6;
    } else {
      nums = [4, 4, 8, 8];
      mean = 6;
    }

    const varianceNum = nums.reduce(
      (acc, val) => acc + Math.pow(val - mean, 2),
      0,
    );
    const variance = varianceNum / nums.length;
    const isPerf = Number.isInteger(Math.sqrt(variance));
    const stdDevStr = isPerf ? `${Math.sqrt(variance)}` : `\\sqrt{${variance}}`;

    return this.createResponse({
      question: `Odchylenie standardowe zestawu danych: $$${nums.join(", ")}$$ jest równe:`,
      latex: ``,
      image: null,
      variables: { nums, mean, variance },
      correctAnswer: stdDevStr,
      distractors: [
        `${variance}`,
        `${mean}`,
        `${isPerf ? Math.sqrt(variance) + 1 : variance + 2}`,
      ],
      steps: [
        `Średnia: ${mean}`,
        `Wariancja: ${variance}`,
        `Odchylenie: ${stdDevStr}`,
      ],
    });
  }

  generateMissingNumberMean() {
    const count = MathUtils.randomInt(4, 6);
    const known = [];
    for (let i = 0; i < count - 1; i++) known.push(MathUtils.randomInt(1, 10));
    const targetMean = MathUtils.randomInt(4, 8);
    const targetSum = count * targetMean;
    const currentSum = known.reduce((a, b) => a + b, 0);
    const x = targetSum - currentSum;
    const allNums = [...known, "x"];
    // Shuffle
    for (let i = allNums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allNums[i], allNums[j]] = [allNums[j], allNums[i]];
    }

    return this.createResponse({
      question: `Średnia arytmetyczna zestawu liczb: $$${allNums.join(", ")}$$ jest równa $$${targetMean}$$. Wtedy $$x$$ wynosi:`,
      latex: `\\bar{x}=${targetMean}`,
      image: null,
      variables: { known, targetMean, x },
      correctAnswer: `${x}`,
      distractors: [`${x + 1}`, `${x - 2}`, `${targetMean}`],
      steps: [
        `Suma musi wynosić $$${count} \\cdot ${targetMean} = ${targetSum}$$`,
        `$$x = ${targetSum} - ${currentSum} = ${x}$$`,
      ],
    });
  }

  generateMedianWithParam() {
    const a = MathUtils.randomInt(1, 3);
    const b = a + MathUtils.randomInt(1, 3);
    const c = b + MathUtils.randomInt(4, 8);
    const M = b + MathUtils.randomInt(1, 2);
    const x = 2 * M - b;
    const setStr = `${a}, ${b}, x, ${c}`;

    return this.createResponse({
      question: `Dany jest zestaw liczb uporządkowanych rosnąco: $$${setStr}$$. Mediana tego zestawu jest równa $$${M}$$. Wtedy $$x$$ wynosi:`,
      latex: `M=${M}`,
      image: null,
      variables: { a, b, x, c, M },
      correctAnswer: `${x}`,
      distractors: [`${M}`, `${2 * M}`, `${b}`],
      steps: [
        `$$M = \\frac{b+x}{2} \\implies 2M = b+x \\implies x = 2M - b = ${x}$$`,
      ],
    });
  }

  generateMeanAfterAdding() {
    const n = MathUtils.randomInt(4, 8);
    const S1 = MathUtils.randomInt(5, 10);
    const sum1 = n * S1;
    const S2 = S1 + 1;
    const sum2 = (n + 1) * S2;
    const x = sum2 - sum1;

    return this.createResponse({
      question: `Średnia arytmetyczna zestawu $$${n}$$ liczb wynosi $$${S1}$$. Gdy do tego zestawu dopiszemy liczbę $$x$$, to średnia arytmetyczna wzrośnie do $$${S2}$$. Liczba $$x$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { n, S1, S2, x },
      correctAnswer: `${x}`,
      distractors: [`${x - 1}`, `${S2}`, `${S1}`],
      steps: [
        `Suma stara: ${sum1}`,
        `Suma nowa: ${sum2}`,
        `x = ${sum2} - ${sum1} = ${x}`,
      ],
    });
  }
}

module.exports = MeasuresGenerator;
