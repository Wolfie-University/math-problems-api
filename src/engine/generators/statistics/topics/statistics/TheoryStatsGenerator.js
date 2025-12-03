const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class TheoryStatsGenerator extends BaseGenerator {
  generateStdDevProperties() {
    const addVal = MathUtils.randomInt(2, 10);
    const sigma = MathUtils.randomInt(2, 6);

    return this.createResponse({
      question: `Odchylenie standardowe zestawu danych jest równe $$${sigma}$$. Jeśli do każdej liczby z tego zestawu dodamy stałą wartość $$${addVal}$$, to odchylenie standardowe nowego zestawu będzie równe:`,
      latex: `\\sigma_{stare}=${sigma}`,
      image: null,
      variables: { sigma, addVal },
      correctAnswer: `${sigma}`,
      distractors: [
        `${sigma + addVal}`,
        `${sigma * addVal}`,
        `\\sqrt{${sigma * sigma} + ${addVal}}`,
      ],
      steps: [
        `Dodanie stałej nie zmienia odchylenia standardowego (rozrzutu).`,
      ],
    });
  }
}

module.exports = TheoryStatsGenerator;
