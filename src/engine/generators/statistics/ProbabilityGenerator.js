const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

const DiceAndCoinsGenerator = require("./topics/probability/DiceAndCoinsGenerator");
const UrnsAndCardsGenerator = require("./topics/probability/UrnsAndCardsGenerator");
const SetsAndNumbersGenerator = require("./topics/probability/SetsAndNumbersGenerator");
const TheoryGenerator = require("./topics/probability/TheoryGenerator");

class ProbabilityGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.diceCoinsGen = new DiceAndCoinsGenerator(difficulty);
    this.urnsCardsGen = new UrnsAndCardsGenerator(difficulty);
    this.setsNumsGen = new SetsAndNumbersGenerator(difficulty);
    this.theoryGen = new TheoryGenerator(difficulty);
  }

  generate() {
    const variants = [
      // Dice & Coins
      "dice_sum", // suma oczek
      "dice_comparison", // x1 > x2
      "dice_product", // iloczyn oczek
      "coins_dynamic", // monety

      // Urns & Cards
      "urn_dynamic", // kule
      "drawing_without_replacement", // klasa/delegacja
      "cards_dynamic", // karty

      // Sets & Numbers
      "two_sets_sum", // dwa zbiory
      "drawing_with_replacement", // ze zwracaniem
      "divisibility_set_dynamic", // podzielnosc
      "draw_number_properties", // wlasnosci liczb

      // Theory
      "union_formula", // P(A u B)
      "complementary_event", // P(A')
      "geometry_1d", // geometria
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // Dice & Coins
      case "dice_sum":
        return this.diceCoinsGen.generateDiceSum();
      case "dice_comparison":
        return this.diceCoinsGen.generateDiceComparison();
      case "dice_product":
        return this.diceCoinsGen.generateDiceProduct();
      case "coins_dynamic":
        return this.diceCoinsGen.generateCoinsDynamic();

      // Urns & Cards
      case "urn_dynamic":
        return this.urnsCardsGen.generateUrnDynamic();
      case "drawing_without_replacement":
        return this.urnsCardsGen.generateDrawingWithoutReplacement();
      case "cards_dynamic":
        return this.urnsCardsGen.generateCardsDynamic();

      // Sets & Numbers
      case "two_sets_sum":
        return this.setsNumsGen.generateTwoSetsSum();
      case "drawing_with_replacement":
        return this.setsNumsGen.generateDrawingWithReplacement();
      case "divisibility_set_dynamic":
        return this.setsNumsGen.generateDivisibilitySetDynamic();
      case "draw_number_properties":
        return this.setsNumsGen.generateDrawNumberProperties();

      // Theory
      case "union_formula":
        return this.theoryGen.generateUnionFormula();
      case "complementary_event":
        return this.theoryGen.generateComplementaryEvent();
      case "geometry_1d":
        return this.theoryGen.generateGeometry1D();

      case "dice":
        return this.diceCoinsGen.generateDiceSum();
      case "coins":
        return this.diceCoinsGen.generateCoinsDynamic();
      case "urn":
        return this.urnsCardsGen.generateUrnDynamic();
      case "draw_number":
        return this.setsNumsGen.generateDrawNumberProperties();

      default:
        return this.diceCoinsGen.generateDiceSum();
    }
  }
}

module.exports = ProbabilityGenerator;
