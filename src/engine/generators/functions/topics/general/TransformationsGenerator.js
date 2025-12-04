const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class TransformationsGenerator extends BaseGenerator {
  generateSymmetryTransform() {
    let typeList, funcTypes;

    if (this.difficulty === "easy") {
      typeList = ["OX", "OY"];
      funcTypes = ["linear"];
    } else if (this.difficulty === "hard") {
      typeList = ["(0,0)"];
      funcTypes = ["linear", "quadratic"];
    } else {
      typeList = ["OX", "OY"];
      funcTypes = ["quadratic"];
    }

    const type = MathUtils.randomElement(typeList);
    const baseFunc = MathUtils.randomElement(funcTypes);
    let f_latex, g_latex, dist1, dist2;

    if (baseFunc === "linear") {
      const a = MathUtils.randomInt(2, 5);
      const b = MathUtils.randomInt(1, 5);
      f_latex = `${a}x + ${b}`;

      if (type === "OX") {
        // y -> -y => -f(x)
        g_latex = `-${a}x - ${b}`;
        dist1 = `${a}x - ${b}`;
        dist2 = `-${a}x + ${b}`;
      } else if (type === "OY") {
        // x -> -x => f(-x)
        g_latex = `-${a}x + ${b}`;
        dist1 = `${a}x - ${b}`;
        dist2 = `-${a}x - ${b}`;
      } else {
        // (0,0) => -f(-x)
        // f(-x) = -ax+b => -(-ax+b) = ax-b
        g_latex = `${a}x - ${b}`;
        dist1 = `-${a}x - ${b}`;
        dist2 = `-${a}x + ${b}`;
      }
    } else {
      const c = MathUtils.randomInt(1, 5);
      f_latex = `x^2 + ${c}`;

      if (type === "OX") {
        g_latex = `-x^2 - ${c}`;
        dist1 = `x^2 - ${c}`;
        dist2 = `-x^2 + ${c}`;
      } else if (type === "OY") {
        // f(-x) = (-x)^2 + c = x^2 + c
        g_latex = `x^2 + ${c}`;
        dist1 = `-x^2 + ${c}`;
        dist2 = `x^2 - ${c}`;
      } else {
        // (0,0) => -f(-x)
        // -(x^2+c) = -x^2-c
        g_latex = `-x^2 - ${c}`;
        dist1 = `x^2 - ${c}`;
        dist2 = `-x^2 + ${c}`;
      }
    }

    const typeName =
      type === "(0,0)" ? "początku układu współrzędnych" : `osi $$${type}$$`;

    return this.createResponse({
      question: `Wykres funkcji $$g$$ powstał przez przekształcenie wykresu funkcji $$f(x) = ${f_latex}$$ w symetrii względem ${typeName}. Funkcja $$g$$ jest określona wzorem:`,
      latex: ``,
      image: null,
      variables: { type, baseFunc },
      correctAnswer: `g(x) = ${g_latex}`,
      distractors: [`g(x) = ${dist1}`, `g(x) = ${dist2}`, `g(x) = ${f_latex}`],
      steps: [
        type === "OX"
          ? `Symetria OX: $$g(x) = -f(x)$$`
          : type === "OY"
            ? `Symetria OY: $$g(x) = f(-x)$$`
            : `Symetria (0,0): $$g(x) = -f(-x)$$`,
        `$$g(x) = ${g_latex}$$`,
      ],
    });
  }

  generateFunctionShift() {
    let pRange, qRange, types;

    if (this.difficulty === "easy") {
      if (Math.random() > 0.5) {
        pRange = [1, 4];
        qRange = [0, 0];
      } else {
        pRange = [0, 0];
        qRange = [1, 4];
      }
      types = ["quadratic"];
    } else if (this.difficulty === "hard") {
      pRange = [-5, 5];
      qRange = [-5, 5];
      types = ["exponential", "rational"];
    } else {
      pRange = [-3, 3];
      qRange = [-3, 3];
      types = ["quadratic"];
    }

    const p = MathUtils.randomInt(pRange[0], pRange[1]);
    const q = MathUtils.randomInt(qRange[0], qRange[1]);

    if (this.difficulty !== "easy" && p === 0 && q === 0)
      return this.generateFunctionShift();

    const type = MathUtils.randomElement(types);
    let baseFuncLatex, shiftedFuncLatex, dist1, dist2;

    if (type === "quadratic") {
      baseFuncLatex = "f(x) = x^2";
      const inside =
        p === 0 ? "x" : p > 0 ? `(x - ${p})` : `(x + ${Math.abs(p)})`;
      shiftedFuncLatex = `${inside}^2 ${q === 0 ? "" : q > 0 ? `+ ${q}` : q}`;

      // distractors
      const wrongP =
        p === 0 ? "x" : p > 0 ? `(x + ${p})` : `(x - ${Math.abs(p)})`;
      dist1 = `${wrongP}^2 ${q === 0 ? "" : q > 0 ? `+ ${q}` : q}`;
      dist2 = `${inside}^2 ${q === 0 ? "" : q > 0 ? `- ${q}` : `+ ${Math.abs(q)}`}`;
    } else if (type === "exponential") {
      const base = MathUtils.randomElement([2, 3]);
      baseFuncLatex = `f(x) = ${base}^x`;
      const exponent =
        p === 0 ? "x" : p > 0 ? `x - ${p}` : `x + ${Math.abs(p)}`;
      shiftedFuncLatex = `${base}^{${exponent}} ${q === 0 ? "" : q > 0 ? `+ ${q}` : q}`;

      const wrongExp =
        p === 0 ? "x" : p > 0 ? `x + ${p}` : `x - ${Math.abs(p)}`;
      dist1 = `${base}^{${wrongExp}} ${q === 0 ? "" : q > 0 ? `+ ${q}` : q}`;
      dist2 = `${base}^{${exponent}} ${q === 0 ? "" : q > 0 ? `- ${q}` : `+ ${Math.abs(q)}`}`;
    } else {
      baseFuncLatex = `f(x) = \\frac{1}{x}`;
      const den = p === 0 ? "x" : p > 0 ? `x - ${p}` : `x + ${Math.abs(p)}`;
      shiftedFuncLatex = `\\frac{1}{${den}} ${q === 0 ? "" : q > 0 ? `+ ${q}` : q}`;

      const wrongDen =
        p === 0 ? "x" : p > 0 ? `x + ${p}` : `x - ${Math.abs(p)}`;
      dist1 = `\\frac{1}{${wrongDen}} ${q === 0 ? "" : q > 0 ? `+ ${q}` : q}`;
      dist2 = `\\frac{1}{${den}} ${q === 0 ? "" : q > 0 ? `- ${q}` : `+ ${Math.abs(q)}`}`;
    }

    return this.createResponse({
      question: `Wykres funkcji $$g$$ powstał przez przesunięcie wykresu funkcji $$${baseFuncLatex}$$ o wektor $$v=[${p}, ${q}]$$. Wzór funkcji $$g$$ to:`,
      latex: `v=[${p}, ${q}]`,
      image: null,
      variables: { p, q, type },
      correctAnswer: `g(x) = ${shiftedFuncLatex}`,
      distractors: [
        `g(x) = ${dist1}`,
        `g(x) = ${dist2}`,
        `g(x) = ${shiftedFuncLatex.replace(q.toString(), (-q).toString()).replace(p.toString(), (-p).toString())}`,
      ],
      steps: [
        `Wzór po przesunięciu o $$[p, q]$$: $$g(x) = f(x-p) + q$$ 

[Image of function translation vector]
`,
        `$$g(x) = ${shiftedFuncLatex}$$`,
      ],
    });
  }
}

module.exports = TransformationsGenerator;
