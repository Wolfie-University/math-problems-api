const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class ScalingGenerator extends BaseGenerator {
  generateScalingProblem() {
    let k = MathUtils.randomInt(2, 5);
    let type = MathUtils.randomElement(["volume", "area"]);
    let question, correct, distractors, steps;
    let latexVar;

    if (this.difficulty === "hard") {
      k = MathUtils.randomInt(2, 5);
      const volFactor = k * k * k;
      const areaFactor = k * k;

      question = `Objętość bryły podobnej zwiększyła się $$${volFactor}$$-krotnie względem bryły wyjściowej. Ile razy zwiększyło się pole powierzchni tej bryły?`;
      latexVar = `V' = ${volFactor}V`;

      correct = `${areaFactor}-krotnie`;
      distractors = [
        `${k}-krotnie`,
        `${volFactor}-krotnie`,
        `${Math.round(Math.sqrt(volFactor))}-krotnie`,
      ];

      steps = [
        `Stosunek objętości brył podobnych to $$k^3$$.`,
        `$$k^3 = ${volFactor} \\implies k = \\sqrt[3]{${volFactor}} = ${k}$$ (skala podobieństwa)`,
        `Stosunek pól powierzchni to $$k^2$$.`,
        `$$k^2 = ${k}^2 = ${areaFactor}$$`,
      ];
    } else if (this.difficulty === "medium") {
      k = MathUtils.randomInt(2, 4);
      const factor = type === "volume" ? k * k * k : k * k;

      question = `Krawędź pewnej bryły zmniejszono $$${k}$$-krotnie. Jego ${type === "volume" ? "objętość" : "pole powierzchni"} zmaleje:`;
      latexVar = `k = 1/${k}`;

      correct = `${factor}-krotnie`;
      distractors = [
        `${k}-krotnie`,
        `${type === "volume" ? k * k : k * 3}-krotnie`,
        `${factor * 2}-krotnie`,
      ];

      steps = [
        `Skala podobieństwa wynosi $$k = \\frac{1}{${k}}$$ (zmniejszenie).`,
        type === "volume"
          ? `Objętość zmienia się w skali $$k^3 = (\\frac{1}{${k}})^3 = \\frac{1}{${factor}}$$`
          : `Pole zmienia się w skali $$k^2 = (\\frac{1}{${k}})^2 = \\frac{1}{${factor}}$$`,
        `Zatem wielkość ta zmaleje $$${factor}$$-krotnie.`,
      ];
    } else {
      const factor = type === "volume" ? k * k * k : k * k;

      question = `Jeśli krawędź bryły zwiększymy $$${k}$$-krotnie, to jej ${type === "volume" ? "objętość" : "pole powierzchni"} zwiększy się:`;
      latexVar = `k=${k}`;

      correct = `${factor}-krotnie`;
      distractors = [
        `${k}-krotnie`,
        `${k * 2}-krotnie`,
        `${type === "volume" ? k * k : k * 3}-krotnie`,
      ];

      steps = [
        `Stosunek ${type === "volume" ? "objętości" : "pól"} brył podobnych to $$k^${type === "volume" ? 3 : 2}$$`,
        `$$${k}^${type === "volume" ? 3 : 2} = ${factor}$$`,
      ];
    }

    return this.createResponse({
      question: question,
      latex: latexVar,
      image: null,
      variables: { k, type },
      correctAnswer: correct,
      distractors: distractors,
      steps: steps,
      questionType: "closed",
    });
  }
}

module.exports = ScalingGenerator;
