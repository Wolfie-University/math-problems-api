const BaseGenerator = require("../../../../core/BaseGenerator");
const SVGUtils = require("../../../../utils/SVGUtils");

class TransformationsQuadraticGenerator extends BaseGenerator {
  generateShiftParabolaProblem() {
    const formulaNew = `x^2 + 6x + 11`;
    return this.createResponse({
      question: `$$f(x)=x^2$$ przesunięto o $$v=[-3, 2]$$. Nowy wzór:`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: `g(x) = ${formulaNew}`,
      distractors: [
        `g(x) = x^2 - 6x + 11`,
        `g(x) = x^2 + 6x + 7`,
        `g(x) = x^2 + 2`,
      ],
      steps: [`$$g(x) = (x+3)^2 + 2 = x^2+6x+9+2$$`],
    });
  }

  generateInequalityGraphProblem() {
    // Uproszczona wersja wykorzystująca SVG
    const x1 = -2,
      x2 = 2,
      a = 1,
      b = 0,
      c = -4,
      p = 0,
      q = -4;
    return this.createResponse({
      question: `Zbiór rozwiązań $$f(x) < 0$$ z wykresu:`,
      latex: ``,
      image: SVGUtils.generateSVG({
        a,
        b,
        c,
        p,
        q,
        x1,
        x2,
        highlight: "roots",
      }),
      variables: {},
      correctAnswer: `x \\in (-2, 2)`,
      distractors: [
        `x \\in (-\\infty, -2) \\cup (2, \\infty)`,
        `x \\in \\langle -2, 2 \\rangle`,
        `x \\in R`,
      ],
      steps: [
        `Parabola uśmiechnięta, wartości ujemne między miejscami zerowymi.`,
      ],
    });
  }
}

module.exports = TransformationsQuadraticGenerator;
