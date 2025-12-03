const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const SVGUtils = require("../../../../utils/SVGUtils");

class EquationsAndInequalitiesGenerator extends BaseGenerator {
  generateInequalityProblem() {
    const x1 = MathUtils.randomInt(-5, 4);
    const x2 = x1 + MathUtils.randomInt(2, 6);
    const a = MathUtils.randomElement([-1, 1]);
    const b = -a * (x1 + x2);
    const c = a * x1 * x2;
    const sign = MathUtils.randomElement([">", "<", ">=", "<="]);

    const isUp = a > 0;
    const isGr = sign.includes(">");
    const isCl = sign.includes("=");
    const brL = isCl ? "\\langle" : "(";
    const brR = isCl ? "\\rangle" : ")";
    const res =
      isUp !== isGr
        ? `${brL}${x1}, ${x2}${brR}`
        : `(-\\infty, ${x1}${brR} \\cup ${brL}${x2}, \\infty)`;

    return this.createResponse({
      question: "Rozwiąż nierówność:",
      latex: `${MathUtils.formatPolynomial(a, b, c)} ${sign} 0`,
      image: SVGUtils.generateSVG({
        a,
        b,
        c,
        p: (x1 + x2) / 2,
        q: 0,
        x1,
        x2,
        highlight: "inequality",
        inequalitySign: sign,
      }),
      variables: { x1, x2 },
      correctAnswer: `x \\in ${res}`,
      distractors: [
        `x \\in ${res.includes("cup") ? `(${x1},${x2})` : `R\\setminus(${x1},${x2})`}`,
        `x \\in R`,
        `x \\in \\emptyset`,
      ],
      steps: [
        `Miejsca zerowe: ${x1}, ${x2}`,
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
    const a = MathUtils.randomElement([-1, 1]);
    const x1 = MathUtils.randomInt(-5, 5);
    const x2 = MathUtils.randomInt(-5, 5);
    const b = -a * (x1 + x2);
    const c = a * x1 * x2;
    const sum = -b / a;
    const prod = c / a;
    return this.createResponse({
      question: `Suma i iloczyn pierwiastków równania $$${MathUtils.formatPolynomial(a, b, c)} = 0$$:`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: `${sum}, ${prod}`,
      distractors: [`${-sum}, ${prod}`, `${sum}, ${-prod}`, `${prod}, ${sum}`],
      steps: [`Suma = -b/a`, `Iloczyn = c/a`],
    });
  }

  generateFormulaFromVertexProblem() {
    const p = 1,
      q = -3,
      a = 1,
      x = 2,
      y = -2; // Simplified logic for brevity
    const formula = `f(x) = (x-1)^2 - 3`;
    return this.createResponse({
      question: `Wierzchołek W(1,-3), punkt A(2,-2). Wzór:`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: formula,
      distractors: [`f(x)=(x+1)^2-3`, `f(x)=(x-1)^2+3`, `f(x)=x^2-3`],
      steps: [`Postać kanoniczna.`],
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
    const b = -2,
      c = -3;
    return this.createResponse({
      question: `Funkcja $$f(x)=(x+1)(x-3)$$. Współczynnik b:`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: `${b}`,
      distractors: [`${c}`, `2`, `0`],
      steps: [`Wymnażamy nawiasy.`],
    });
  }

  generateCoefficients() {
    const p = MathUtils.randomInt(-4, 4);
    const q = MathUtils.randomInt(-4, 4);
    const a = MathUtils.randomElement([-2, -1, 1, 2]);
    const b = -2 * a * p;
    const c = a * (p * p) + q;
    return { a, b, c, p, q };
  }
}

module.exports = EquationsAndInequalitiesGenerator;
