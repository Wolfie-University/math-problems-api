const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const PlanimetrySVGUtils = require("./PlanimetrySVGUtils");

class AnglesGenerator extends BaseGenerator {
  generateAnglesLines() {
    let alpha;

    if (this.difficulty === "easy") {
      alpha = MathUtils.randomInt(3, 15) * 10;
    } else if (this.difficulty === "hard") {
      alpha = MathUtils.randomInt(60, 290) / 2;
    } else {
      alpha = MathUtils.randomInt(20, 160);
    }

    const beta = 180 - alpha;
    const mode = MathUtils.randomElement(["vertical", "supplementary"]);

    const alphaStr = alpha % 1 === 0 ? `${alpha}` : alpha.toFixed(1);
    const betaStr = beta % 1 === 0 ? `${beta}` : beta.toFixed(1);

    return this.createResponse({
      question:
        mode === "vertical"
          ? `Kąty $$\\alpha$$ i $$\\beta$$ są wierzchołkowe. 
 Jeśli $$\\alpha = ${alphaStr}^\\circ$$, to $$\\beta$$ wynosi:`
          : `Kąty $$\\alpha$$ i $$\\beta$$ są przyległe. 
 Jeśli $$\\alpha = ${alphaStr}^\\circ$$, to $$\\beta$$ wynosi:`,
      latex: ``,
      image: null,
      variables: { alpha, beta, mode },
      correctAnswer:
        mode === "vertical" ? `${alphaStr}^\\circ` : `${betaStr}^\\circ`,
      distractors: [
        mode === "vertical" ? `${betaStr}^\\circ` : `${alphaStr}^\\circ`,
        `${Math.abs(90 - alpha).toFixed(alpha % 1 === 0 ? 0 : 1)}^\\circ`,
        `${(360 - alpha).toFixed(alpha % 1 === 0 ? 0 : 1)}^\\circ`,
      ],
      steps: [
        mode === "vertical"
          ? `Kąty wierzchołkowe mają tę samą miarę. $$\\beta = \\alpha = ${alphaStr}^\\circ$$.`
          : `Suma kątów przyległych wynosi $$180^\\circ$$. $$\\beta = 180^\\circ - ${alphaStr}^\\circ = ${betaStr}^\\circ$$.`,
      ],
    });
  }
}

module.exports = AnglesGenerator;
