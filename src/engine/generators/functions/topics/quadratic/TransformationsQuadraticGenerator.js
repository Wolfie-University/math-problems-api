const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const SVGUtils = require("../../../../utils/SVGUtils");

class TransformationsQuadraticGenerator extends BaseGenerator {
  generateShiftParabolaProblem() {
    // f(x) = ax^2,  v=[p, q]
    // g(x) = a(x-p)^2 + q
    // a(x^2 - 2px + p^2) + q = ax^2 - 2apx + (ap^2 + q)

    let aList, rangeV;

    if (this.difficulty === "easy") {
      aList = [1];
      rangeV = [-3, 3];
    } else if (this.difficulty === "hard") {
      aList = [2, -2];
      rangeV = [-6, 6];
    } else {
      aList = [-1, 1];
      rangeV = [-5, 5];
    }

    const a = MathUtils.randomElement(aList);
    const p = MathUtils.randomInt(rangeV[0], rangeV[1]);
    const q = MathUtils.randomInt(rangeV[0], rangeV[1]);

    // g(x) = Ax^2 + Bx + C
    const A = a;
    const B = -2 * a * p;
    const C = a * p * p + q;

    const formulaBase = `${a === 1 ? "" : a === -1 ? "-" : a}x^2`;
    const formulaNew = MathUtils.formatPolynomial(A, B, C);

    // bad sign for B
    const dist1 = MathUtils.formatPolynomial(A, -B, C);
    // bad sign for C
    const dist2 = MathUtils.formatPolynomial(A, B, -C);
    // forgotten p^2 in C
    const wrongC = p * p + q;
    const dist3 = MathUtils.formatPolynomial(A, B, wrongC);

    return this.createResponse({
      question: `Wykres funkcji $$f(x)=${formulaBase}$$ przesunięto o wektor $$v=[${p}, ${q}]$$. Jaki jest nowy wzór funkcji?`,
      latex: null,
      image: null,
      variables: { a, p, q },
      correctAnswer: `g(x) = ${formulaNew}`,
      distractors: [
        `g(x) = ${dist1}`,
        `g(x) = ${dist2}`,
        `g(x) = ${dist3 !== formulaNew ? dist3 : MathUtils.formatPolynomial(A, 0, C)}`,
      ],
      steps: [
        `Przesunięcie o wektor $$[p, q]$$ oznacza, że do wzoru wstawiamy $$(x-p)$$ zamiast $$x$$ i dodajemy $$q$$ na końcu.`,
        `Postać kanoniczna: $$g(x) = ${a}(x - (${p}))^2 + (${q})$$`,
        `$$g(x) = ${a}(x ${p > 0 ? "-" : "+"} ${Math.abs(p)})^2 ${q >= 0 ? "+" : ""}${q}$$`,
        `Rozwijamy wzór skróconego mnożenia: $$${a}(x^2 ${p > 0 ? "-" : "+"} ${2 * Math.abs(p)}x + ${p * p}) ${q >= 0 ? "+" : ""}${q}$$`,
        `$$g(x) = ${A}x^2 ${B >= 0 ? "+" : ""}${B}x + ${a * p * p} ${q >= 0 ? "+" : ""}${q}$$`,
        `$$g(x) = ${formulaNew}$$`,
      ],
      questionType: "open",
      answerFormat: "g(x) = Ax^2 + Bx + C",
    });
  }

  generateInequalityGraphProblem() {
    let aList, rootRange;

    if (this.difficulty === "easy") {
      aList = [1];
      rootRange = [-3, 3];
    } else if (this.difficulty === "hard") {
      aList = [-1];
      rootRange = [-6, 6];
    } else {
      aList = [-1, 1];
      rootRange = [-5, 5];
    }

    const a = MathUtils.randomElement(aList);
    const x1 = MathUtils.randomInt(rootRange[0], rootRange[1]);
    let x2 = MathUtils.randomInt(rootRange[0], rootRange[1]);
    while (x1 === x2) x2 = MathUtils.randomInt(rootRange[0], rootRange[1]);

    const b = -a * (x1 + x2);
    const c = a * x1 * x2;

    const p = (x1 + x2) / 2;
    const q = a * p * p + b * p + c;

    const sign = MathUtils.randomElement(["<", ">", "\\le", "\\ge"]);

    const isUp = a > 0;
    const isGr = sign.includes(">");
    const isCl =
      sign.includes("=") || sign.includes("le") || sign.includes("ge");

    const brL = isCl ? "\\langle" : "(";
    const brR = isCl ? "\\rangle" : ")";

    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);

    // Up & > 0 (Gr) -> outside
    // Up & < 0     -> inside
    // Down & > 0   -> inside
    // Down & < 0   -> outside

    // (!Up && Gr) || (Up && !Gr) -> XOR logic
    const isInside = isUp !== isGr;

    let res;
    if (isInside) {
      res = `${brL}${minX}, ${maxX}${brR}`;
    } else {
      res = `(-\\infty, ${minX}${brR} \\cup ${brL}${maxX}, \\infty)`;
    }

    return this.createResponse({
      question: `Na rysunku przedstawiono fragment wykresu funkcji kwadratowej. Zbiór rozwiązań nierówności $$f(x) ${sign} 0$$ to:`,
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
      variables: { x1, x2, a, sign },
      correctAnswer: `x \\in ${res}`,
      distractors: [
        `x \\in ${isInside ? `(-\\infty, ${minX}) \\cup (${maxX}, \\infty)` : `(${minX}, ${maxX})`}`,
        `x \\in \\langle ${minX - 1}, ${maxX + 1} \\rangle`,
        `x \\in \\mathbb{R}`,
      ],
      steps: [
        `Odczytujemy z wykresu miejsca zerowe: $$x_1 = ${minX}, x_2 = ${maxX}$$.`,
        `Parabola ma ramiona skierowane w ${a > 0 ? "górę" : "dół"}.`,
        `Szukamy wartości ${isGr ? "większych" : "mniejszych"} od zera (część wykresu ${isGr ? "nad osią" : "pod osią"}).`,
        `Odp: $$x \\in ${res}$$`,
      ],
      questionType: "closed",
    });
  }
}

module.exports = TransformationsQuadraticGenerator;
