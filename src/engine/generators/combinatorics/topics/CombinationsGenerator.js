const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class CombinationsGenerator extends BaseGenerator {
  generateSetsProblem() {
    const type = MathUtils.randomElement(["clothes", "menu"]);
    let q, n1, n2, n3, total;

    if (type === "clothes") {
      n1 = MathUtils.randomInt(3, 6);
      n2 = MathUtils.randomInt(3, 6);
      n3 = MathUtils.randomInt(2, 4);
      q = `W szafie wisi ${n1} bluzek, leży ${n2} par spodni i stoi ${n3} par butów. Ile różnych zestawów (bluzka + spodnie + buty) można utworzyć?`;
    } else {
      n1 = MathUtils.randomInt(3, 5);
      n2 = MathUtils.randomInt(4, 8);
      n3 = MathUtils.randomInt(2, 5);
      q = `Restauracja oferuje ${n1} zup, ${n2} drugich dań i ${n3} deserów. Ile różnych pełnych zestawów obiadowych można zamówić?`;
    }
    total = n1 * n2 * n3;

    return this.createResponse({
      question: q,
      latex: ``,
      image: null,
      variables: { n1, n2, n3 },
      correctAnswer: `${total}`,
      distractors: [`${n1 + n2 + n3}`, `${total * 2}`, `${n1 * n2 + n3}`],
      steps: [
        `Reguła mnożenia: mnożymy liczby możliwości z każdej kategorii.`,
        `$$${n1} \\cdot ${n2} \\cdot ${n3} = ${total}$$`,
      ],
    });
  }

  generateHandshakesProblem() {
    const n = MathUtils.randomInt(6, 12);
    const result = (n * (n - 1)) / 2;
    const type = MathUtils.randomElement(["handshakes", "matches"]);

    const q =
      type === "handshakes"
        ? `Na spotkaniu było $$${n}$$ osób. Ile było powitań?`
        : `W turnieju bierze udział $$${n}$$ zawodników (każdy z każdym). Ile meczów?`;

    return this.createResponse({
      question: q,
      latex: `n=${n}`,
      image: null,
      variables: { n },
      correctAnswer: `${result}`,
      distractors: [`${n * (n - 1)}`, `${n * 2}`, `${result + n}`],
      steps: [
        `Wzór: $$\\frac{n(n-1)}{2}$$`,
        `$$\\frac{${n}\\cdot${n - 1}}{2} = ${result}$$`,
      ],
    });
  }

  generateTeamSelection() {
    const total = MathUtils.randomElement([20, 25, 30]);
    const k = 3;
    const res = (total * (total - 1) * (total - 2)) / 6;

    return this.createResponse({
      question: `Z grupy liczącej $$${total}$$ osób wybieramy trzyosobową delegację. Na ile sposobów można to zrobić?`,
      latex: `n=${total}, k=3`,
      image: null,
      variables: { total, k },
      correctAnswer: `${res}`,
      distractors: [
        `${total * (total - 1) * (total - 2)}`,
        `${total * 3}`,
        `${res + total}`,
      ],
      steps: [
        `Kolejność wyboru nie ma znaczenia, stosujemy symbol Newtona (kombinacje).`,
        `$${total} \\choose 3} = \\frac{${total} \\cdot ${total - 1} \\cdot ${total - 2}}{3 \\cdot 2 \\cdot 1}$$`,
        `$$= \\frac{${total * (total - 1) * (total - 2)}}{6} = ${res}$$`,
      ],
    });
  }
}

module.exports = CombinationsGenerator;
