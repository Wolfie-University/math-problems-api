const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class UrnsAndCardsGenerator extends BaseGenerator {
  generateUrnDynamic() {
    let colors, bRange;
    if (this.difficulty === "easy") {
      colors = 2;
      bRange = [2, 5];
    } else {
      colors = 3;
      bRange = [4, 8];
    }

    const b = MathUtils.randomInt(bRange[0], bRange[1]);
    const c = MathUtils.randomInt(bRange[0], bRange[1]);
    const n = colors === 3 ? MathUtils.randomInt(bRange[0], bRange[1]) : 0;

    const total = b + c + n;

    let type;
    if (this.difficulty === "easy") {
      type = "white";
    } else {
      type = MathUtils.randomElement(["white", "not_black", "blue_or_white"]);
    }

    let favored = 0;
    let desc = "";

    if (type === "white") {
      favored = b;
      desc = "wylosowana kula będzie biała";
    } else if (type === "not_black") {
      favored = b + n;
      desc = "wylosowana kula NIE będzie czarna";
    } else {
      favored = b + n;
      desc = "wylosowana kula będzie biała lub niebieska";
    }

    const gcd = this.getGCD(favored, total);

    return this.createResponse({
      question: `W urnie znajduje się $$${b}$$ kul białych, $$${c}$$ czarnych${n > 0 ? ` i $$${n}$$ niebieskich` : ""}. Losujemy jedną kulę. Oblicz prawdopodobieństwo, że ${desc}.`,
      latex: ``,
      image: null,
      variables: { b, c, n, total, favored },
      correctAnswer: `\\frac{${favored / gcd}}{${total / gcd}}`,
      distractors: [
        `\\frac{${c}}{${total}}`,
        `\\frac{1}{${colors}}`,
        `\\frac{${b}}{${c + n}}`,
      ],
      steps: [
        `Razem kul: $$${b} + ${c} ${n > 0 ? `+ ${n}` : ""} = ${total}$$`,
        `Liczba kul sprzyjających zdarzeniu: $$${favored}$$`,
        `$$P(A) = \\frac{${favored}}{${total}}$$`,
      ],
    });
  }

  generateDrawingWithoutReplacement() {
    let range;
    if (this.difficulty === "easy") range = [4, 8];
    else if (this.difficulty === "hard") range = [12, 18];
    else range = [8, 12];

    const boys = MathUtils.randomInt(range[0], range[1]);
    const girls = MathUtils.randomInt(range[0], range[1]);
    const total = boys + girls;
    const omega = (total * (total - 1)) / 2;

    let type;
    if (this.difficulty === "easy") type = "two_girls";
    else type = MathUtils.randomElement(["two_girls", "mixed"]);

    let favored = 0;
    let desc = "";

    if (type === "two_girls") {
      desc = "wylosowane zostaną dwie dziewczyny";
      favored = (girls * (girls - 1)) / 2;
    } else {
      desc = "wylosowana zostanie jedna dziewczyna i jeden chłopiec";
      favored = girls * boys;
    }

    const gcd = this.getGCD(favored, omega);

    return this.createResponse({
      question: `W klasie jest $$${boys}$$ chłopców i $$${girls}$$ dziewcząt. Wybieramy losowo dwie osoby (delegację). Oblicz prawdopodobieństwo, że ${desc}.`,
      latex: ``,
      image: null,
      variables: { boys, girls, total, favored },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [
        `\\frac{1}{2}`,
        `\\frac{${favored}}{${total * total}}`,
        `\\frac{${type === "two_girls" ? girls : boys}}{${total}}`,
      ],
      steps: [
        `Liczba wszystkich możliwych par (kombinacje): $$|\\Omega| = {${total} \\choose 2} = \\frac{${total} \\cdot ${total - 1}}{2} = ${omega}$$`,
        type === "two_girls"
          ? `Liczba par dziewcząt: $$|A| = {${girls} \\choose 2} = \\frac{${girls} \\cdot ${girls - 1}}{2} = ${favored}$$`
          : `Liczba par mieszanych: $$|A| = ${boys} \\cdot ${girls} = ${favored}$$`,
        `$$P(A) = \\frac{${favored}}{${omega}}$$`,
      ],
    });
  }

  generateCardsDynamic() {
    const omega = 52;
    let types;

    if (this.difficulty === "easy") {
      types = ["color", "suit"];
    } else if (this.difficulty === "hard") {
      types = ["face_or_red", "number_lt_5"];
    } else {
      types = ["face", "ace"];
    }

    const type = MathUtils.randomElement(types);
    let favored = 0;
    let desc = "";

    if (type === "color") {
      const color = MathUtils.randomElement(["czerwoną", "czarną"]);
      favored = 26;
      desc = `wylosowana karta będzie miała barwę ${color}`;
    } else if (type === "face") {
      favored = 12;
      desc = "wylosowana karta będzie figurą (walet, dama, król)";
    } else if (type === "ace") {
      favored = 4;
      desc = "wylosowana karta będzie asem";
    } else if (type === "suit") {
      const suit = MathUtils.randomElement([
        "kierem",
        "karem",
        "pikiem",
        "treflem",
      ]);
      favored = 13;
      desc = `wylosowana karta będzie ${suit}`;
    } else if (type === "face_or_red") {
      favored = 32;
      desc = "wylosowana karta będzie figurą (J,Q,K) lub kartą czerwoną";
    } else {
      favored = 12;
      desc =
        "wylosowana karta będzie miała numer mniejszy niż 5 (nie jest asem ani figurą)";
    }

    const gcd = this.getGCD(favored, omega);

    return this.createResponse({
      question: `Z talii 52 kart losujemy jedną. Prawdopodobieństwo, że ${desc}, wynosi:`,
      latex: ``,
      image: null,
      variables: { type, favored },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [
        `\\frac{1}{52}`,
        `\\frac{1}{13}`,
        `\\frac{${favored + 1}}{52}`,
      ],
      steps: [
        `Liczba wszystkich kart: 52.`,
        `Liczba kart sprzyjających: $$${favored}$$.`,
        `$$P(A) = \\frac{${favored}}{52}$$`,
      ],
    });
  }

  getGCD(a, b) {
    return b ? this.getGCD(b, a % b) : a;
  }
}

module.exports = UrnsAndCardsGenerator;
