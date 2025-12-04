const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class GeometricSequencesGenerator extends BaseGenerator {
  generateGeometricX() {
    // (f, x, l) -> x = sqrt(f*l)
    let qList, fRange;

    if (this.difficulty === "easy") {
      qList = [2, 3];
      fRange = [1, 5];
    } else if (this.difficulty === "hard") {
      qList = [4, 5, -4, -5];
      fRange = [5, 15];
    } else {
      qList = [-2, -3, 2, 3];
      fRange = [2, 10];
    }

    let r = MathUtils.randomElement(qList);
    const f = MathUtils.randomInt(fRange[0], fRange[1]);

    if (this.difficulty === "hard" && r > 1 && Math.random() > 0.5) {
      r = 1 / r;
    }

    const m = f * r;
    const l = m * r;

    const isFractional =
      this.difficulty === "hard" && Math.random() > 0.5 && r > 0;
    const t1 = isFractional ? l : f;
    const t3 = isFractional ? f : l;
    const t2 = isFractional ? l / r : f * r;

    return this.createResponse({
      question: `Liczby $$(${t1}, x, ${t3})$$ tworzą ciąg geometryczny o wyrazach dodatnich. Oblicz $$x$$.`,
      latex: `(${t1}, x, ${t3})`,
      image: null,
      variables: { f: t1, m: t2, l: t3 },
      correctAnswer: `${Math.abs(t2)}`,
      distractors: [
        `${t2 * 2}`,
        `${Math.abs(t3 - t1)}`,
        `${t1 * t3}`,
      ],
      steps: [
        `Własność ciągu geometrycznego: $$x^2 = a_1 \\cdot a_3$$`,
        `$$x^2 = ${t1} \\cdot ${t3} = ${t1 * t3}$$`,
        `$$x = \\sqrt{${t1 * t3}} = ${Math.abs(t2)}$$`,
      ],
    });
  }

  generateGeometricSum() {
    let nRange, qList;

    if (this.difficulty === "easy") {
      nRange = [3, 4];
      qList = [2];
    } else if (this.difficulty === "hard") {
      nRange = [5, 6];
      qList = [-2, -3, 3];
    } else {
      nRange = [4, 5];
      qList = [2, -2, 3];
    }

    const n = MathUtils.randomInt(nRange[0], nRange[1]);
    const q = MathUtils.randomElement(qList);
    const a1 = MathUtils.randomInt(1, 4);

    const sum = (a1 * (1 - Math.pow(q, n))) / (1 - q);

    return this.createResponse({
      question: `Oblicz sumę $$${n}$$ początkowych wyrazów ciągu geometrycznego, w którym $$a_1 = ${a1}$$ oraz iloraz $$q = ${q}$$.`,
      latex: `a_1=${a1}, q=${q}`,
      image: null,
      variables: { a1, q, n },
      correctAnswer: `${sum}`,
      distractors: [
        `${(a1 * (1 - Math.pow(q, n - 1))) / (1 - q)}`,
        `${sum * q}`,
        `${a1 * Math.pow(q, n - 1)}`,
      ],
      steps: [
        `Wzór na sumę: $$S_n = a_1 \\frac{1-q^n}{1-q}$$`,
        `$$S_{${n}} = ${a1} \\cdot \\frac{1-(${q})^{${n}}}{1-(${q})}$$`,
        `Obliczamy potęgę: $$(${q})^{${n}} = ${Math.pow(q, n)}$$`,
        `$$S_{${n}} = ${a1} \\cdot \\frac{1 - ${Math.pow(q, n)}}{${1 - q}} = ${sum}$$`,
      ],
    });
  }

  generateGeometricRatioDist() {
    let diffRange, qList;

    if (this.difficulty === "easy") {
      diffRange = [2, 2];
      qList = [2, 3, 4, 5];
    } else if (this.difficulty === "hard") {
      diffRange = [3, 4];
      qList = [-2, -3, 2, 3];
    } else {
      diffRange = [2, 3];
      qList = [2, 3, 4];
    }

    const q = MathUtils.randomElement(qList);
    const k = MathUtils.randomInt(1, 2);
    const diff = MathUtils.randomInt(diffRange[0], diffRange[1]);
    const m = k + diff;

    const a1 = MathUtils.randomInt(1, 3);
    const valK = a1 * Math.pow(q, k - 1);
    const valM = valK * Math.pow(q, diff);

    return this.createResponse({
      question: `W ciągu geometrycznym $$(a_n)$$ dane są wyrazy $$a_{${k}} = ${valK}$$ oraz $$a_{${m}} = ${valM}$$. Iloraz $$q$$ tego ciągu jest równy:`,
      latex: `a_{${k}}=${valK}, a_{${m}}=${valM}`,
      image: null,
      variables: { k, m, q, valK, valM },
      correctAnswer: `${q}`,
      distractors: [
        `${q * 2}`,
        `${valM / valK}`,
        `${q > 0 ? -q : Math.abs(q)}`,
      ],
      steps: [
        `$$a_m = a_k \\cdot q^{m-k}$$`,
        `$$${valM} = ${valK} \\cdot q^{${diff}}$$`,
        `$$q^{${diff}} = \\frac{${valM}}{${valK}} = ${Math.pow(q, diff)}$$`,
        `$$q = \\sqrt[${diff}]{${Math.pow(q, diff)}} = ${q}$$`,
      ],
    });
  }

  generateGeometricAlgebraic() {
    let aList;

    if (this.difficulty === "easy") {
      aList = [2, 3];
    } else if (this.difficulty === "hard") {
      aList = [6, 8, 9, 12];
    } else {
      aList = [3, 4, 5];
    }

    const a = MathUtils.randomElement(aList);
    const div = MathUtils.randomElement([1, a]);
    const b_minus_2a = div;
    const b = b_minus_2a + 2 * a;
    const x = (a * a) / div;

    const t1 = `x`;
    const t2 = `x + ${a}`;
    const t3 = `x + ${b}`;

    return this.createResponse({
      question: `Ciąg $$(${t1}, ${t2}, ${t3})$$ jest geometryczny. Wtedy $$x$$ wynosi:`,
      latex: ``,
      image: null,
      variables: { x, a, b },
      correctAnswer: `${x}`,
      distractors: [`${x + a}`, `${x - 1}`, `${a}`],
      steps: [
        `Środkowy do kwadratu = iloczyn skrajnych.`,
        `$$(${t2})^2 = x \\cdot (${t3})$$`,
        `$$x^2 + ${2 * a}x + ${a * a} = x^2 + ${b}x$$`,
        `$$${a * a} = ${b}x - ${2 * a}x = ${b - 2 * a}x$$`,
        `$$x = ${x}$$`,
      ],
    });
  }
}

module.exports = GeometricSequencesGenerator;
