const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class PermutationsGenerator extends BaseGenerator {
  generateQueueProblem() {
    let nRange;

    if (this.difficulty === "easy") {
      nRange = [3, 4];
    } else if (this.difficulty === "hard") {
      nRange = [7, 8]; // 7! = 5040, 8! = 40320
    } else {
      nRange = [5, 6];
    }

    const n = MathUtils.randomInt(nRange[0], nRange[1]);
    let res = this.factorial(n);

    return this.createResponse({
      question: `Na ile sposobów $$${n}$$ osób może ustawić się w kolejce do kasy?`,
      latex: `n=${n}`,
      image: null,
      variables: { n },
      correctAnswer: `${res}`,
      distractors: [`${n * n}`, `${n}`, `${res / 2}`],
      steps: [
        `Liczba permutacji zbioru $$n$$-elementowego to $$n!$$.`,
        `$$${n}! = ${res}$$`,
      ],
    });
  }

  generateFlagProblem() {
    let kRange;

    if (this.difficulty === "easy") {
      kRange = [3, 4];
    } else if (this.difficulty === "hard") {
      kRange = [6, 9];
    } else {
      kRange = [4, 6];
    }

    const k = MathUtils.randomInt(kRange[0], kRange[1]);
    const distinct = MathUtils.randomElement([true, false]);
    const res = distinct ? k * (k - 1) * (k - 2) : k * k * k;

    return this.createResponse({
      question: `Mamy do dyspozycji $$${k}$$ kolorów materiału. Szyjemy flagę z trzech poziomych pasów jednakowej szerokości. Ile różnych flag można uszyć, jeśli kolory pasów ${distinct ? "nie mogą się powtarzać" : "mogą się powtarzać"}?`,
      latex: `k=${k}`,
      image: this.generateSVG({ type: "flag" }),
      variables: { k, distinct },
      correctAnswer: `${res}`,
      distractors: [
        distinct ? `${k * k * k}` : `${k * (k - 1) * (k - 2)}`,
        `${k * 3}`,
        `${Math.pow(3, k)}`,
      ],
      steps: [
        distinct
          ? `Pierwszy pas: ${k} opcji. Drugi: ${k - 1} opcji. Trzeci: ${k - 2} opcji.`
          : `Każdy pas możemy wybrać na ${k} sposobów.`,
        distinct
          ? `$$${k} \\cdot ${k - 1} \\cdot ${k - 2} = ${res}$$`
          : `$$${k} \\cdot ${k} \\cdot ${k} = ${res}$$`,
      ],
    });
  }

  generateSeatingConstraint() {
    let nRange;

    if (this.difficulty === "easy") {
      nRange = [3, 4];
    } else if (this.difficulty === "hard") {
      nRange = [7, 8];
    } else {
      nRange = [5, 6];
    }

    const n = MathUtils.randomInt(nRange[0], nRange[1]);
    const type = MathUtils.randomElement(["together", "fixed_first"]);
    let res, desc;

    if (type === "together") {
      let fact = this.factorial(n - 1);
      res = fact * 2;
      desc = `Sklejamy osoby A i B w jeden element. Mamy wtedy $$${n - 1}$$ elementów do ustawienia ($$${n - 1}!$$). Osoby A i B mogą zamienić się miejscami ($$\\cdot 2$$).`;
    } else {
      let fact = this.factorial(n - 1);
      res = fact;
      desc = `Skoro pierwsza osoba jest ustalona, to pozostałe $$${n - 1}$$ osób ustawiamy dowolnie na $$${n - 1}$$ miejscach.`;
    }

    return this.createResponse({
      question:
        type === "together"
          ? `Na ile sposobów $$${n}$$ osób (w tym Kasia i Tomek) może usiąść w rzędzie tak, aby Kasia i Tomek siedzieli obok siebie?`
          : `Na ile sposobów $$${n}$$ osób może ustawić się w kolejce, jeśli Pan X musi stać na pierwszym miejscu?`,
      latex: ``,
      image: null,
      variables: { n, type },
      correctAnswer: `${res}`,
      distractors: [
        `${this.factorial(n)}`,
        type === "together" ? `${res / 2}` : `${res * n}`,
        `${n * n}`,
      ],
      steps: [
        desc,
        type === "together"
          ? `$$(${n}-1)! \\cdot 2 = ${res / 2} \\cdot 2 = ${res}$$`
          : `$$(${n}-1)! = ${res}$$`,
      ],
    });
  }

  factorial(n) {
    let res = 1;
    for (let i = 1; i <= n; i++) res *= i;
    return res;
  }

  generateSVG(params) {
    if (params.type === "flag") {
      return `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
                <rect x="50" y="20" width="200" height="50" fill="#ddd" stroke="black"/>
                <rect x="50" y="70" width="200" height="50" fill="#bbb" stroke="black"/>
                <rect x="50" y="120" width="200" height="50" fill="#999" stroke="black"/>
                <line x1="50" y1="20" x2="50" y2="190" stroke="black" stroke-width="4"/>
            </svg>`;
    }
    return "";
  }
}

module.exports = PermutationsGenerator;
