const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class TheoryGenerator extends BaseGenerator {
  generateUnionFormula() {
    let denRange;

    if (this.difficulty === "easy") {
      const den = 10;
      const nA = MathUtils.randomInt(2, 4);
      const nB = MathUtils.randomInt(2, 4);
      const nIntersect = MathUtils.randomInt(1, Math.min(nA, nB));

      const pA = `0.${nA}`;
      const pB = `0.${nB}`;
      const pInt = `0.${nIntersect}`;
      const res = (nA + nB - nIntersect) / 10;

      return this.createResponse({
        question: `Dla zdarzeń $$A, B$$ zachodzi: $$P(A) = ${pA}$$, $$P(B) = ${pB}$$, $$P(A \\cap B) = ${pInt}$$. Wtedy $$P(A \\cup B)$$ wynosi:`,
        latex: ``,
        image: null,
        variables: { res },
        correctAnswer: `${res}`,
        distractors: [`${(nA + nB) / 10}`, `${(1 - res).toFixed(1)}`, `1`],
        steps: [`$$P(A \\cup B) = ${pA} + ${pB} - ${pInt} = ${res}$$`],
      });
    } else {
      const den = MathUtils.randomElement([7, 9, 12, 15]);
      const nA = MathUtils.randomInt(2, den - 2);
      const nB = MathUtils.randomInt(2, den - 2);
      const nIntersect = MathUtils.randomInt(1, Math.min(nA, nB));
      const nUnion = nA + nB - nIntersect;

      const gcdA = this.getGCD(nA, den);
      const gcdB = this.getGCD(nB, den);
      const gcdInt = this.getGCD(nIntersect, den);
      const gcdRes = this.getGCD(nUnion, den);

      const pA = `\\frac{${nA / gcdA}}{${den / gcdA}}`;
      const pB = `\\frac{${nB / gcdB}}{${den / gcdB}}`;
      const pInt = `\\frac{${nIntersect / gcdInt}}{${den / gcdInt}}`;
      const res = `\\frac{${nUnion / gcdRes}}{${den / gcdRes}}`;

      return this.createResponse({
        question: `Dla zdarzeń $$A, B$$ zachodzi: $$P(A) = ${pA}$$, $$P(B) = ${pB}$$, $$P(A \\cap B) = ${pInt}$$. Wtedy $$P(A \\cup B)$$ wynosi:`,
        latex: ``,
        image: null,
        variables: { res },
        correctAnswer: res,
        distractors: [
          `\\frac{${(nA + nB) / this.getGCD(nA + nB, den)}}{${den / this.getGCD(nA + nB, den)}}`,
          `\\frac{${(den - nUnion) / this.getGCD(den - nUnion, den)}}{${den / this.getGCD(den - nUnion, den)}}`,
          `1`,
        ],
        steps: [
          `Sprowadzamy do wspólnego mianownika $$${den}$$:`,
          `$$P(A)=${nA}/${den}, P(B)=${nB}/${den}, P(A \\cap B)=${nIntersect}/${den}$$`,
          `$$P(A \\cup B) = \\frac{${nA} + ${nB} - ${nIntersect}}{${den}} = \\frac{${nUnion}}{${den}}$$`,
        ],
      });
    }
  }

  generateComplementaryEvent() {
    let denRange, isDecimal;
    if (this.difficulty === "easy") {
      denRange = [5, 10];
      isDecimal = false;
    } else if (this.difficulty === "hard") {
      isDecimal = true;
    } else {
      denRange = [11, 25];
      isDecimal = false;
    }

    if (isDecimal) {
      const val = MathUtils.randomInt(1, 99) / 100;
      const res = (1 - val).toFixed(2);
      return this.createResponse({
        question: `Jeżeli $$P(A) = ${val}$$, to prawdopodobieństwo zdarzenia przeciwnego $$A'$$ wynosi:`,
        latex: ``,
        image: null,
        variables: { val },
        correctAnswer: `${res}`,
        distractors: [
          `${(val / 2).toFixed(2)}`,
          `${(val + 0.1).toFixed(2)}`,
          `1`,
        ],
        steps: [`$$P(A') = 1 - P(A) = 1 - ${val} = ${res}$$`],
      });
    } else {
      const den = MathUtils.randomInt(denRange[0], denRange[1]);
      const num = MathUtils.randomInt(1, den - 1);
      return this.createResponse({
        question: `Jeżeli $$P(A) = \\frac{${num}}{${den}}$$, to prawdopodobieństwo zdarzenia przeciwnego $$A'$$ wynosi:`,
        latex: ``,
        image: null,
        variables: { num, den },
        correctAnswer: `\\frac{${den - num}}{${den}}`,
        distractors: [`\\frac{${num}}{${den - num}}`, `\\frac{1}{${den}}`, `1`],
        steps: [
          `$$P(A') = 1 - P(A) = 1 - \\frac{${num}}{${den}} = \\frac{${den - num}}{${den}}$$`,
        ],
      });
    }
  }

  generateGeometry1D() {
    let range, isFraction;
    if (this.difficulty === "easy") {
      range = [-5, 5];
      isFraction = false;
    } else {
      range = [-10, 10];
      isFraction = Math.random() > 0.5;
    }

    let start = MathUtils.randomInt(range[0], range[1]);
    let end = start + MathUtils.randomInt(4, 10);

    if (isFraction) {
      start += 0.5;
      end += 0.5;
    }

    const totalLen = end - start;
    const subStart = start + 1;
    const subEnd = subStart + MathUtils.randomInt(1, Math.floor(totalLen / 2));
    const subLen = subEnd - subStart;

    const gcd = this.getGCD(subLen * 10, totalLen * 10);

    return this.createResponse({
      question: `Z przedziału $$<${start}, ${end}>$$ losujemy liczbę. Prawdopodobieństwo, że należy do $$<${subStart}, ${subEnd}>$$:`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: `\\frac{${(subLen * 10) / gcd}}{${(totalLen * 10) / gcd}}`,
      distractors: [
        `\\frac{1}{2}`,
        `\\frac{1}{${totalLen}}`,
        `\\frac{${subLen}}{${end}}`,
      ],
      steps: [
        `Długość przedziału Omega: $$|\\Omega| = ${end} - (${start}) = ${totalLen}$$`,
        `Długość przedziału A: $$|A| = ${subEnd} - ${subStart} = ${subLen}$$`,
        `$$P(A) = \\frac{${subLen}}{${totalLen}}$$`,
      ],
    });
  }

  getGCD(a, b) {
    return b ? this.getGCD(b, a % b) : a;
  }
}

module.exports = TheoryGenerator;
