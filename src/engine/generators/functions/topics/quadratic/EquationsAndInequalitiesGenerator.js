const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const SVGUtils = require("../../../../utils/SVGUtils");

class EquationsAndInequalitiesGenerator extends BaseGenerator {
  generateInequalityProblem() {
    let rootRange, aList;

    if (this.difficulty === "easy") {
      rootRange = [-3, 3];
      aList = [-1, 1];
    } else if (this.difficulty === "hard") {
      rootRange = [-8, 8];
      aList = [-2, -1, 1, 2, 3];
    } else {
      rootRange = [-5, 5];
      aList = [-1, 1, 2];
    }

    const x1 = MathUtils.randomInt(rootRange[0], rootRange[1]);
    let x2 = MathUtils.randomInt(rootRange[0], rootRange[1]);
    while (x1 === x2) x2 = MathUtils.randomInt(rootRange[0], rootRange[1]);

    const a = MathUtils.randomElement(aList);
    const b = -a * (x1 + x2);
    const c = a * x1 * x2;
    const sign = MathUtils.randomElement([">", "<", ">=", "<="]);

    const isUp = a > 0;
    const isGr = sign.includes(">");
    const isCl = sign.includes("=");
    const brL = isCl ? "\\langle" : "(";
    const brR = isCl ? "\\rangle" : ")";

    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);

    const res =
      isUp !== isGr
        ? `${brL}${minX}, ${maxX}${brR}`
        : `(-\\infty, ${minX}${brR} \\cup ${brL}${maxX}, \\infty)`;

    return this.createResponse({
      question: "Rozwiąż nierówność:",
      latex: `${MathUtils.formatPolynomial(a, b, c)} ${sign} 0`,
      image: null,
      variables: { x1, x2 },
      correctAnswer: `x \\in ${res}`,
      distractors: [
        `x \\in ${res.includes("cup") ? `(${minX},${maxX})` : `R\\setminus(${minX},${maxX})`}`,
        `x \\in R`,
        `x \\in \\emptyset`,
      ],
      steps: [
        `Miejsca zerowe: ${minX}, ${maxX}`,
        `Parabola ${a > 0 ? "uśmiechnięta" : "smutna"}`,
        `Odp: ${res}`,
      ],
    });
  }

  generateSolutionsCountProblem() {
    const { a, b, c, p, q } = this.generateCoefficients();
    const condition = a > 0 ? "k >" : "k <";
    return this.createResponse({
      question: `Równanie $$${MathUtils.formatPolynomial(a, b, c)} = k$$ ma dwa rozwiązania dla:`,
      latex: ``,
      image: SVGUtils.generateSVG({ a, b, c, p, q, highlight: "vertex" }),
      variables: { q },
      correctAnswer: `k \\in (${condition === "k >" ? `${q}, \\infty` : `-\\infty, ${q}`})`,
      distractors: [`k = ${q}`, `k \\in R`, `k > ${p}`],
      steps: [
        `Wierzchołek $$q=${q}$$. Dwa rozwiązania gdy prosta przecina ramiona.`,
      ],
    });
  }

  generateVietaProblem() {
    let aList;
    if (this.difficulty === "easy") {
      aList = [-1, 1]; // a=1 -> sum = -b
    } else if (this.difficulty === "hard") {
      aList = [-3, -2, 2, 3, 4];
    } else {
      aList = [-2, 2];
    }

    const a = MathUtils.randomElement(aList);
    const x1 = MathUtils.randomInt(-5, 5);
    const x2 = MathUtils.randomInt(-5, 5);
    const b = -a * (x1 + x2);
    const c = a * x1 * x2;

    const formatFrac = (num, den) =>
      num % den === 0 ? `${num / den}` : `\\frac{${num}}{${den}}`;

    const sum = formatFrac(-b, a);
    const prod = formatFrac(c, a);

    return this.createResponse({
      question: `Suma i iloczyn pierwiastków równania $$${MathUtils.formatPolynomial(a, b, c)} = 0$$ wynoszą odpowiednio:`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: `${sum}, ${prod}`,
      distractors: [
        `${formatFrac(b, a)}, ${prod}`, // bad sign of sum
        `${sum}, ${formatFrac(-c, a)}`, // bad sign of product
        `${prod}, ${sum}`, // swapped
      ],
      steps: [`Suma = $$-b/a = ${sum}$$`, `Iloczyn = $$c/a = ${prod}$$`],
    });
  }

  generateFormulaFromVertexProblem() {
    // y = a(x-p)^2 + q
    let pRange, qRange, aList;

    if (this.difficulty === "easy") {
      pRange = [1, 3];
      qRange = [1, 3];
      aList = [1];
    } else if (this.difficulty === "hard") {
      pRange = [-5, 5];
      qRange = [-5, 5];
      aList = [-2, 2, 3];
    } else {
      pRange = [-3, 3];
      qRange = [-3, 3];
      aList = [-1, 1];
    }

    const p = MathUtils.randomInt(pRange[0], pRange[1]);
    const q = MathUtils.randomInt(qRange[0], qRange[1]);
    const a = MathUtils.randomElement(aList);

    // A = (x, y)
    // x = p + dx (dx small)
    const dx = 1;
    const x = p + dx;
    const y = a * dx * dx + q;

    const aStr = a === 1 ? "" : a === -1 ? "-" : a;
    const pSign = p > 0 ? "-" : "+";
    const qSign = q >= 0 ? "+" : "";

    const formula = `f(x) = ${aStr}(x ${pSign} ${Math.abs(p)})^2 ${qSign}${q}`;

    return this.createResponse({
      question: `Wierzchołkiem paraboli jest punkt $$W(${p},${q})$$, a jej wykres przechodzi przez punkt $$A(${x},${y})$$. Wzór tej funkcji w postaci kanonicznej to:`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: formula,
      distractors: [
        `f(x) = ${aStr}(x ${pSign === "-" ? "+" : "-"} ${Math.abs(p)})^2 ${qSign}${q}`, // bad p sign
        `f(x) = ${-a}(x ${pSign} ${Math.abs(p)})^2 ${qSign}${q}`, // bad a sign
        `f(x) = (x ${pSign} ${Math.abs(p)})^2 ${qSign}${q}`, // a=1 (missing)
      ],
      steps: [`Postać kanoniczna. Podstawiamy W i A, wyliczamy a.`],
    });
  }

  generateCoeffsFromVertexProblem() {
    const { a, b, c, p, q } = this.generateCoefficients();
    return this.createResponse({
      question: `Wierzchołek W(${p},${q}) paraboli $$y=${a}x^2+bx+c$$. Oblicz b, c.`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: `b=${b}, c=${c}`,
      distractors: [`b=${-b}, c=${c}`, `b=${c}, c=${b}`, `b=${b}, c=${-c}`],
      steps: [`$$p=-b/2a$$, $$q=ap^2+bp+c$$`],
    });
  }

  generateProductToGeneralProblem() {
    const x1 = MathUtils.randomInt(-4, 4);
    const x2 = MathUtils.randomInt(-4, 4);
    const a = MathUtils.randomElement([1, -1, 2]);

    const b = -a * (x1 + x2);
    const c = a * x1 * x2;

    const formula = `f(x)=${a === 1 ? "" : a}(x${x1 > 0 ? "-" : "+"}${Math.abs(x1)})(x${x2 > 0 ? "-" : "+"}${Math.abs(x2)})`;

    return this.createResponse({
      question: `Funkcja $$${formula}$$. Współczynnik b we wzorze ogólnym:`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: `${b}`,
      distractors: [`${c}`, `${-b}`, `${a}`],
      steps: [`Wymnażamy nawiasy.`],
    });
  }

  generateCoefficients() {
    let aList, range;
    if (this.difficulty === "easy") {
      aList = [-1, 1];
      range = [-3, 3];
    } else if (this.difficulty === "hard") {
      aList = [-2, 2, 3, -3];
      range = [-6, 6];
    } else {
      aList = [-1, 1, 2, -2];
      range = [-4, 4];
    }

    const p = MathUtils.randomInt(range[0], range[1]);
    const q = MathUtils.randomInt(range[0], range[1]);
    const a = MathUtils.randomElement(aList);
    const b = -2 * a * p;
    const c = a * (p * p) + q;
    return { a, b, c, p, q };
  }
}

module.exports = EquationsAndInequalitiesGenerator;
