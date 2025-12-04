const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class PiecewiseFunctionGenerator extends BaseGenerator {
  generatePiecewiseFunction() {
    let cut, f1, f2, val1, val2, f1_tex, f2_tex;
    let res1, res2;

    if (this.difficulty === "easy") {
      // cut = 0, f1(x) = x^2, f2(x) = x + b
      cut = 0;
      const f2_b = MathUtils.randomInt(1, 5);

      f1_tex = "x^2";
      f2_tex = `x + ${f2_b}`;

      val1 = MathUtils.randomInt(-3, -1); // < 0
      val2 = MathUtils.randomInt(0, 3); // >= 0

      res1 = val1 * val1;
      res2 = val2 + f2_b;
    } else if (this.difficulty === "hard") {
      cut = MathUtils.randomInt(-3, 3);
      const f1_a = MathUtils.randomInt(2, 3);
      const f1_c = MathUtils.randomInt(1, 5);
      const f2_a = MathUtils.randomInt(-4, -2);
      const f2_b = MathUtils.randomInt(5, 10);

      f1_tex = `${f1_a}x^2 - ${f1_c}`;
      f2_tex = `${f2_a}x + ${f2_b}`;

      val1 = cut - MathUtils.randomInt(1, 4);
      val2 = cut + MathUtils.randomInt(0, 4);

      res1 = f1_a * val1 * val1 - f1_c;
      res2 = f2_a * val2 + f2_b;
    } else {
      cut = MathUtils.randomInt(-2, 2);
      const f1_c = MathUtils.randomInt(1, 3);
      const f2_a = MathUtils.randomInt(-2, 2) || 1;
      const f2_b = MathUtils.randomInt(1, 5);

      f1_tex = `x^2 + ${f1_c}`;
      f2_tex = `${f2_a === 1 ? "" : f2_a === -1 ? "-" : f2_a}x ${f2_b >= 0 ? "+" : ""}${f2_b}`;

      val1 = cut - MathUtils.randomInt(1, 3);
      val2 = cut + MathUtils.randomInt(0, 3);

      res1 = val1 * val1 + f1_c;
      res2 = f2_a * val2 + f2_b;
    }

    const total = res1 + res2;

    return this.createResponse({
      question: `Funkcja $$f$$ jest określona wzorem: $$f(x) = \\begin{cases} ${f1_tex} & \\text{dla } x < ${cut} \\\\ ${f2_tex} & \\text{dla } x \\ge ${cut} \\end{cases}$$. Wartość wyrażenia $$f(${val1}) + f(${val2})$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { cut, val1, val2, res1, res2 },
      correctAnswer: `${total}`,
      distractors: [`${res1 - res2}`, `${res1 * res2}`, `${res1 + res2 + 2}`],
      steps: [
        `Obliczamy $$f(${val1})$$. Ponieważ $$${val1} < ${cut}$$, korzystamy z pierwszego wzoru:`,
        `$$f(${val1}) = ${f1_tex.replace(/x/g, `(${val1})`)} = ${res1}$$`,
        `Obliczamy $$f(${val2})$$. Ponieważ $$${val2} \\ge ${cut}$$, korzystamy z drugiego wzoru:`,
        `$$f(${val2}) = ${f2_tex.replace(/x/g, `(${val2})`)} = ${res2}$$`,
        `Suma: $$${res1} + ${res2} = ${total}$$`,
      ],
    });
  }
}

module.exports = PiecewiseFunctionGenerator;
