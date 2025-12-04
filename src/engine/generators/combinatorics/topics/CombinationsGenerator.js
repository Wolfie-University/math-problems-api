const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class CombinationsGenerator extends BaseGenerator {
  generateSetsProblem() {
    // n1 * n2 * n3 (* n4)
    let nRange, categories;

    if (this.difficulty === "easy") {
      nRange = [2, 4];
      categories = 3;
    } else if (this.difficulty === "hard") {
      nRange = [4, 8];
      categories = 4;
    } else {
      nRange = [3, 6];
      categories = 3;
    }

    const type = MathUtils.randomElement(["clothes", "menu"]);
    let q, n1, n2, n3, n4, total;

    if (type === "clothes") {
      n1 = MathUtils.randomInt(nRange[0], nRange[1]);
      n2 = MathUtils.randomInt(nRange[0], nRange[1]);
      n3 = MathUtils.randomInt(Math.max(2, nRange[0] - 1), nRange[1] - 1);

      if (categories === 4) {
        n4 = MathUtils.randomInt(2, 5);
        q = `W szafie wisi ${n1} bluzek, leży ${n2} par spodni, stoi ${n3} par butów i jest ${n4} czapek. Ile różnych zestawów (bluzka + spodnie + buty + czapka) można utworzyć?`;
        total = n1 * n2 * n3 * n4;
      } else {
        q = `W szafie wisi ${n1} bluzek, leży ${n2} par spodni i stoi ${n3} par butów. Ile różnych zestawów (bluzka + spodnie + buty) można utworzyć?`;
        total = n1 * n2 * n3;
      }
    } else {
      n1 = MathUtils.randomInt(nRange[0], nRange[1]);
      n2 = MathUtils.randomInt(nRange[0] + 1, nRange[1] + 1);
      n3 = MathUtils.randomInt(nRange[0], nRange[1]);

      if (categories === 4) {
        n4 = MathUtils.randomInt(3, 6);
        q = `Restauracja oferuje ${n1} zup, ${n2} drugich dań, ${n3} deserów i ${n4} napojów. Ile różnych pełnych zestawów obiadowych można zamówić?`;
        total = n1 * n2 * n3 * n4;
      } else {
        q = `Restauracja oferuje ${n1} zup, ${n2} drugich dań i ${n3} deserów. Ile różnych pełnych zestawów obiadowych można zamówić?`;
        total = n1 * n2 * n3;
      }
    }

    return this.createResponse({
      question: q,
      latex: ``,
      image: null,
      variables: { n1, n2, n3, n4 },
      correctAnswer: `${total}`,
      distractors: [
        categories === 4 ? `${n1 + n2 + n3 + n4}` : `${n1 + n2 + n3}`,
        `${total * 2}`,
        categories === 4 ? `${n1 * n2 + n3 * n4}` : `${n1 * n2 + n3}`,
      ],
      steps: [
        `Reguła mnożenia: mnożymy liczby możliwości z każdej kategorii.`,
        categories === 4
          ? `$$${n1} \\cdot ${n2} \\cdot ${n3} \\cdot ${n4} = ${total}$$`
          : `$$${n1} \\cdot ${n2} \\cdot ${n3} = ${total}$$`,
      ],
    });
  }

  generateHandshakesProblem() {
    // C(n, 2) = n(n-1)/2
    let nRange;

    if (this.difficulty === "easy") {
      nRange = [4, 8];
    } else if (this.difficulty === "hard") {
      nRange = [15, 30];
    } else {
      nRange = [6, 12];
    }

    const n = MathUtils.randomInt(nRange[0], nRange[1]);
    const result = (n * (n - 1)) / 2;
    const type = MathUtils.randomElement(["handshakes", "matches"]);

    const q =
      type === "handshakes"
        ? `Na spotkaniu było $$${n}$$ osób. Każdy przywitał się z każdym uściskiem dłoni. Ile nastąpiło powitań?`
        : `W turnieju bierze udział $$${n}$$ zawodników (każdy gra z każdym dokładnie jeden mecz). Ile meczów zostanie rozegranych?`;

    return this.createResponse({
      question: q,
      latex: `n=${n}`,
      image: null,
      variables: { n },
      correctAnswer: `${result}`,
      distractors: [`${n * (n - 1)}`, `${n * 2}`, `${result + n}`],
      steps: [
        `Wzór na liczbę kombinacji 2-elementowych ze zbioru n-elementowego: $$\\frac{n(n-1)}{2}$$`,
        `$$\\frac{${n}\\cdot${n - 1}}{2} = \\frac{${n * (n - 1)}}{2} = ${result}$$`,
      ],
    });
  }

  generateTeamSelection() {
    // C(n, k)
    let nRange, k;

    if (this.difficulty === "easy") {
      nRange = [5, 10];
      k = 2;
    } else if (this.difficulty === "hard") {
      nRange = [20, 35];
      k = 3;
    } else {
      nRange = [15, 25];
      k = 3;
    }

    const total = MathUtils.randomInt(nRange[0], nRange[1]);

    let res;
    let stepsCalc;

    if (k === 2) {
      res = (total * (total - 1)) / 2;
      stepsCalc = `\\frac{${total} \\cdot ${total - 1}}{2} = ${res}`;
    } else {
      res = (total * (total - 1) * (total - 2)) / 6;
      stepsCalc = `\\frac{${total} \\cdot ${total - 1} \\cdot ${total - 2}}{3 \\cdot 2 \\cdot 1} = \\frac{${total * (total - 1) * (total - 2)}}{6} = ${res}`;
    }

    const groupName = k === 2 ? "dwuosobową" : "trzyosobową";

    return this.createResponse({
      question: `Z grupy liczącej $$${total}$$ osób wybieramy ${groupName} delegację. Na ile sposobów można to zrobić?`,
      latex: `n=${total}, k=${k}`,
      image: null,
      variables: { total, k },
      correctAnswer: `${res}`,
      distractors: [
        k === 2
          ? `${total * (total - 1)}`
          : `${total * (total - 1) * (total - 2)}`,  
        `${total * k}`,
        `${res + total}`,
      ],
      steps: [
        `Kolejność wyboru nie ma znaczenia, stosujemy symbol Newtona (kombinacje) $${total} \\choose ${k}$.`,
        `$$${stepsCalc}$$`,
      ],
    });
  }
}

module.exports = CombinationsGenerator;
