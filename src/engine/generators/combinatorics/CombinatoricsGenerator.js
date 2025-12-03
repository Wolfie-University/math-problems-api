const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

const SimpleRulesGenerator = require("./topics/SimpleRulesGenerator");
const PermutationsGenerator = require("./topics/PermutationsGenerator");
const CombinationsGenerator = require("./topics/CombinationsGenerator");

class CombinatoricsGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.simpleGen = new SimpleRulesGenerator(difficulty);
    this.permGen = new PermutationsGenerator(difficulty);
    this.combGen = new CombinationsGenerator(difficulty);
  }

  generate() {
    const variants = [
      "numbers_rule", // n-cyfrowe parzyste/podzielne
      "distinct_digits", // o roznych cyfrach
      "numbers_from_set", // z malego zbioru cyfr
      "numbers_sum_digits", // o sumie cyfr X
      "codes_mixed", // kody (litery i cyfry)

      "queue_perm", // kolejka (n!)
      "flag_coloring", // flagi (wariacje)
      "seating_constraint", // ustawienia z warunkiem

      "clothing_sets", // zestawy ubran/menu (mnozenie zbiorow)
      "handshakes", // usciski dloni (C(n,2))
      "team_selection", // delegacja (C(n,3))
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // LICZBY, KODY
      case "numbers_rule":
        return this.simpleGen.generateNumbersRule();
      case "distinct_digits":
        return this.simpleGen.generateDistinctDigits();
      case "numbers_from_set":
        return this.simpleGen.generateNumbersFromSet();
      case "numbers_sum_digits":
        return this.simpleGen.generateSumOfDigits();
      case "codes_mixed":
        return this.simpleGen.generateMixedCodes();

      // PERMUTACJE I WARIACJE
      case "queue_perm":
        return this.permGen.generateQueueProblem();
      case "flag_coloring":
        return this.permGen.generateFlagProblem();
      case "seating_constraint":
        return this.permGen.generateSeatingConstraint();

      // KOMBINACJE I ZBIORY
      case "clothing_sets":
        return this.combGen.generateSetsProblem();
      case "handshakes":
        return this.combGen.generateHandshakesProblem();
      case "team_selection":
        return this.combGen.generateTeamSelection();

      default:
        return this.simpleGen.generateNumbersRule();
    }
  }
}

module.exports = CombinatoricsGenerator;
