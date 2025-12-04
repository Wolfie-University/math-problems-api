const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class SimpleRulesGenerator extends BaseGenerator {
  generateNumbersRule() {
    let digitsRange, types;

    if (this.difficulty === "easy") {
      digitsRange = [3, 3];
      types = ["even", "div10"];
    } else if (this.difficulty === "hard") {
      digitsRange = [4, 5];
      types = ["div5", "no_zero_digit"];
    } else {
      digitsRange = [3, 4];
      types = ["even", "div5", "div10", "no_zero_digit"];
    }

    const digits = MathUtils.randomInt(digitsRange[0], digitsRange[1]);
    const type = MathUtils.randomElement(types);

    let count, desc;
    if (type === "even") {
      count = 9 * Math.pow(10, digits - 2) * 5;
      desc = `Pierwsza cyfra: 9 opcji. Kolejne: 10 opcji. Ostatnia (parzysta): 5 opcji.`;
    } else if (type === "div5") {
      count = 9 * Math.pow(10, digits - 2) * 2;
      desc = `Ostatnia cyfra to 0 lub 5 (2 opcje).`;
    } else if (type === "div10") {
      count = 9 * Math.pow(10, digits - 2) * 1;
      desc = `Ostatnia cyfra to 0 (1 opcja).`;
    } else {
      count = Math.pow(9, digits);
      desc = `Na każdym miejscu cyfra od 1 do 9 (9 opcji).`;
    }

    return this.createResponse({
      question: `Ile jest wszystkich liczb naturalnych ${digits}-cyfrowych ${type === "even" ? "parzystych" : type === "div5" ? "podzielnych przez 5" : type === "div10" ? "podzielnych przez 10" : "w których zapisie nie występuje cyfra 0"}?`,
      latex: ``,
      image: null,
      variables: { digits, type },
      correctAnswer: `${count}`,
      distractors: [`${count + 10}`, `${count / 2}`, `${Math.pow(10, digits)}`],
      steps: [`Stosujemy regułę mnożenia.`, desc, `Wynik: $$${count}$$`],
    });
  }

  generateDistinctDigits() {
    let digits;
    if (this.difficulty === "easy") {
      digits = 3;
    } else if (this.difficulty === "hard") {
      digits = 5;
    } else {
      digits = 4;
    }

    // 9 * 9 * 8 * 7 * ...
    let res = 9;
    let current = 9;
    for (let i = 1; i < digits; i++) {
      res *= current;
      current--;
    }

    const digitName =
      digits === 3
        ? "trzycyfrowych"
        : digits === 4
          ? "czterocyfrowych"
          : "pięciocyfrowych";

    return this.createResponse({
      question: `Ile jest wszystkich liczb naturalnych ${digitName} o cyfrach niepowtarzających się?`,
      latex: ``,
      image: null,
      variables: { digits },
      correctAnswer: `${res}`,
      distractors: [
        `${9 * Math.pow(10, digits - 1)}`,
        `${Math.pow(9, digits)}`,
        `${res * 2}`,
      ],
      steps: [
        `Pierwsza cyfra: 9 opcji (bez 0).`,
        `Druga: 9 opcji (bo dochodzi 0, odpada użyta).`,
        `Trzecia: 8 opcji.`,
        digits > 3 ? `Kolejne: coraz mniej o 1.` : ``,
        `Wynik: $$${res}$$`,
      ],
    });
  }

  generateNumbersFromSet() {
    let nRange, setTypes;

    if (this.difficulty === "easy") {
      nRange = [2, 3];
      setTypes = ["small"];
    } else if (this.difficulty === "hard") {
      nRange = [4, 6];
      setTypes = ["prime", "odd"];
    } else {
      nRange = [3, 4];
      setTypes = ["odd", "small", "prime"];
    }

    const setType = MathUtils.randomElement(setTypes);
    let setDigits, setName;

    if (setType === "odd") {
      setDigits = [1, 3, 5, 7, 9];
      setName = "nieparzystych";
    } else if (setType === "small") {
      setDigits = [1, 2, 3, 4];
      setName = "należących do zbioru \\{1, 2, 3, 4\\}";
    } else {
      setDigits = [2, 3, 5, 7];
      setName = "będących cyframi pierwszymi";
    }

    const n = MathUtils.randomInt(nRange[0], nRange[1]);
    const k = setDigits.length;
    const res = Math.pow(k, n);

    return this.createResponse({
      question: `Ile jest wszystkich liczb naturalnych ${n}-cyfrowych, których zapis dziesiętny składa się wyłącznie z cyfr ${setName}?`,
      latex: ``,
      image: null,
      variables: { n, k, setType },
      correctAnswer: `${res}`,
      distractors: [`${Math.pow(10, n)}`, `${n * k}`, `${Math.pow(n, k)}`],
      steps: [
        `Dostępne cyfry to: $$${setDigits.join(", ")}$$. Jest ich $$${k}$$.`,
        `$$${Array(n).fill(k).join(" \\cdot ")} = ${k}^{${n}} = ${res}$$`,
      ],
    });
  }

  generateSumOfDigits() {
    let sumRange;
    if (this.difficulty === "easy") {
      sumRange = [2, 3];
    } else if (this.difficulty === "hard") {
      sumRange = [6, 7];
    } else {
      sumRange = [4, 5];
    }

    const sumTarget = MathUtils.randomInt(sumRange[0], sumRange[1]);
    let count = 0;
    let examples = [];

    for (let h = 1; h <= 9; h++) {
      for (let t = 0; t <= 9; t++) {
        const u = sumTarget - h - t;
        if (u >= 0 && u <= 9) {
          count++;
          if (examples.length < 5) examples.push(`${h}${t}${u}`);
        }
      }
    }

    return this.createResponse({
      question: `Ile jest wszystkich liczb naturalnych trzycyfrowych, których suma cyfr jest równa $$${sumTarget}$$?`,
      latex: ``,
      image: null,
      variables: { sumTarget, count },
      correctAnswer: `${count}`,
      distractors: [`${count + 2}`, `${count - 1}`, `${sumTarget * 3}`],
      steps: [
        `Wypisujemy systematycznie liczby trzycyfrowe o sumie cyfr $$${sumTarget}$$:`,
        `$$${examples.join(", ")}...$$`,
        `Łącznie jest ich: $$${count}$$`,
      ],
    });
  }

  generateMixedCodes() {
    let lRange, dRange;
    if (this.difficulty === "easy") {
      lRange = [1, 2];
      dRange = [1, 2];
    } else if (this.difficulty === "hard") {
      lRange = [3, 4];
      dRange = [3, 5];
    } else {
      lRange = [2, 3];
      dRange = [2, 4];
    }

    const lettersCount = MathUtils.randomInt(lRange[0], lRange[1]);
    const digitsCount = MathUtils.randomInt(dRange[0], dRange[1]);
    const latexRes = `26^{${lettersCount}} \\cdot 10^{${digitsCount}}`;

    return this.createResponse({
      question: `Ile różnych kodów można utworzyć, jeżeli każdy kod składa się z $$${lettersCount}$$ liter (wybranych z 26 liter alfabetu łacińskiego) oraz $$${digitsCount}$$ cyfr (arabskich)? Zakładamy, że najpierw występują litery, a potem cyfry, i mogą się one powtarzać.`,
      latex: ``,
      image: null,
      variables: { lettersCount, digitsCount },
      correctAnswer: latexRes,
      distractors: [
        `26 \\cdot 10`,
        `${lettersCount + digitsCount}^{26+10}`,
        `26 \\cdot ${lettersCount} + 10 \\cdot ${digitsCount}`,
      ],
      steps: [
        `Mamy $$${lettersCount}$$ miejsc na litery i $$${digitsCount}$$ miejsc na cyfry.`,
        `$$26^{${lettersCount}}$$ (litery) $$\\cdot$$ $$10^{${digitsCount}}$$ (cyfry)`,
        `Z reguły mnożenia: $$${latexRes}$$`,
      ],
    });
  }
}

module.exports = SimpleRulesGenerator;
