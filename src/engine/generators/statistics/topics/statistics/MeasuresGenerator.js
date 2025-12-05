const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class MeasuresGenerator extends BaseGenerator {
  generateBasicStatsProblem() {
    let countRange, valRange;
    if (this.difficulty === "easy") {
      countRange = [5, 7];
      valRange = [1, 6];
    } else if (this.difficulty === "hard") {
      countRange = [8, 12];
      valRange = [10, 50];
    } else {
      countRange = [6, 9];
      valRange = [1, 9];
    }

    const count = MathUtils.randomInt(countRange[0], countRange[1]);
    const numbers = [];
    for (let i = 0; i < count; i++)
      numbers.push(MathUtils.randomInt(valRange[0], valRange[1]));

    const mode = MathUtils.randomElement(["mean", "median"]);
    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((a, b) => a + b, 0);

    let answer,
      steps = [];

    if (mode === "mean") {
      const mean = sum / count;
      const meanStr = Number.isInteger(mean)
        ? `${mean}`
        : this.difficulty === "easy"
          ? mean.toFixed(1)
          : `\\frac{${sum}}{${count}}`;
      answer = meanStr;
      steps = [
        `Suma liczb: $$${sum}$$`,
        `Liczba elementów: $$${count}$$`,
        `Średnia: $$${meanStr}$$`,
      ];
    } else {
      const mid = Math.floor(count / 2);
      let medVal;
      steps.push(`Porządkujemy liczby: $$${sorted.join(", ")}$$`);

      if (count % 2 !== 0) {
        medVal = sorted[mid];
        steps.push(
          `Liczba elementów nieparzysta. Mediana to środkowy wyraz: $$${medVal}$$`,
        );
      } else {
        const v1 = sorted[mid - 1];
        const v2 = sorted[mid];
        medVal = (v1 + v2) / 2;
        steps.push(
          `Liczba elementów parzysta. Mediana to średnia $$${v1}$$ i $$${v2}$$: $$${medVal}$$`,
        );
      }
      answer = `${medVal}`;
    }

    return this.createResponse({
      question: `Dany jest zestaw liczb: $$${numbers.join(", ")}$$. ${mode === "mean" ? "Średnia arytmetyczna" : "Mediana"} tego zestawu jest równa:`,
      latex: ``,
      image: null,
      variables: { numbers },
      correctAnswer: answer,
      distractors: [
        `${(sum / (count - 1)).toFixed(2)}`,
        mode === "mean"
          ? `${sorted[Math.floor(count / 2)]}`
          : `${(sum / count).toFixed(2)}`,
        `${sorted[0]}`,
      ],
      steps: steps,
    });
  }

  generateModeProblem() {
    const targetMode = MathUtils.randomInt(1, 9);
    const numbers = [targetMode, targetMode, targetMode];
    const noiseCount = this.difficulty === "easy" ? 3 : 7;

    for (let i = 0; i < noiseCount; i++) {
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
      distractors: [`${numbers[0]}`, `${numbers[1]}`, `${numbers[2]}`],
      steps: [`Liczba $$${targetMode}$$ występuje najczęściej.`],
    });
  }

  generateWeightedMeanProblem() {
    let count;
    if (this.difficulty === "easy") count = 3;
    else if (this.difficulty === "hard") count = 5;
    else count = 4;

    const grades = [];
    let num = 0,
      den = 0;

    for (let i = 0; i < count; i++) {
      const g = MathUtils.randomInt(2, 5);
      const w = MathUtils.randomInt(1, this.difficulty === "hard" ? 4 : 2);
      grades.push({ g, w });
      num += g * w;
      den += w;
    }

    const mean = num / den;
    const meanStr = Number.isInteger(mean) ? `${mean}` : mean.toFixed(2);

    return this.createResponse({
      question: `Uczeń otrzymał następujące oceny z wagami: ${grades.map((x) => `${x.g} (waga ${x.w})`).join(", ")}. Średnia ważona tych ocen jest równa:`,
      latex: ``,
      image: null,
      variables: { mean },
      correctAnswer: meanStr,
      distractors: [
        `${(mean + 0.5).toFixed(2)}`,
        `${(mean - 0.5).toFixed(2)}`,
        `${Math.floor(mean)}`,
      ],
      steps: [`Licznik: ${num}, Mianownik: ${den}, Wynik: ${meanStr}`],
    });
  }

  generateStdDevProblem() {
    let nums = [],
      mean = 0;
    if (this.difficulty === "easy") {
      nums = [1, 3, 5];
      mean = 3;
    } else if (this.difficulty === "hard") {
      nums = [2, 4, 6, 8, 10];
      mean = 6;
    } else {
      nums = [1, 3, 5, 7, 9];
      mean = 5;
    }

    const varianceNum = nums.reduce(
      (acc, val) => acc + Math.pow(val - mean, 2),
      0,
    );
    const variance = varianceNum / nums.length;
    const isPerf = Number.isInteger(Math.sqrt(variance));
    const stdDevStr = isPerf ? `${Math.sqrt(variance)}` : `\\sqrt{${variance}}`;

    if (this.difficulty === "easy") {
      nums = [4, 4, 8, 8];
      mean = 6;
    }

    return this.createResponse({
      question: `Odchylenie standardowe zestawu danych: $$${nums.join(", ")}$$ jest równe:`,
      latex: ``,
      image: null,
      variables: { nums, mean, variance },
      correctAnswer: this.difficulty === "easy" ? `2` : stdDevStr,
      distractors: [
        `${variance}`,
        `${mean}`,
        `${this.difficulty === "easy" ? 4 : variance + 2}`,
      ],
      steps: [`Średnia: ${mean}`, `Wariancja: ${variance}`, `Odchylenie: ...`],
    });
  }

  generateMissingNumberMean() {
    let count, targetMean;
    if (this.difficulty === "easy") {
      count = 4;
      targetMean = 5;
    } else {
      count = 6;
      targetMean = 12;
    }

    const known = [];
    for (let i = 0; i < count - 1; i++)
      known.push(MathUtils.randomInt(1, targetMean * 2));
    const targetSum = count * targetMean;
    const currentSum = known.reduce((a, b) => a + b, 0);
    const x = targetSum - currentSum;

    const allNums = [...known, "x"];
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
      question: `Średnia arytmetyczna zestawu $$${n}$$ liczb wynosi $$${S1}$$. Gdy do tego zestawu dopiszemy liczbę $$x$$, to średnia wzrośnie do $$${S2}$$. Liczba $$x$$ jest równa:`,
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
