const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

const ArithmeticSequencesGenerator = require("./topics/ArithmeticSequencesGenerator");
const GeometricSequencesGenerator = require("./topics/GeometricSequencesGenerator");
const GeneralSequencesGenerator = require("./topics/GeneralSequencesGenerator");

class SequencesGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.arithGen = new ArithmeticSequencesGenerator(difficulty);
    this.geoGen = new GeometricSequencesGenerator(difficulty);
    this.genGen = new GeneralSequencesGenerator(difficulty);
  }

  generate() {
    const variants = [
      // Arithmetic
      "arithmetic_x", // (a, x, b) arytmetyczny
      "arithmetic_params", // a_k i a_m -> r
      "arithmetic_sum", // suma n wyrazow arytm
      "arithmetic_algebraic", // (x-1, x+2, 2x) arytmetyczny -> x

      // Geometric
      "geometric_x", // (a, x, b) geometryczny
      "geometric_sum", // suma n wyrazow geom
      "geometric_ratio_dist", // a_2=27, a_5=1 -> q
      "geometric_algebraic", // (x, x+2, x+6) geometryczny -> x

      // General
      "nth_term", // a_n ze wzoru
      "which_term", // ktorym wyrazem jest x
      "count_terms", // ile wyrazow < x
      "sequence_monotonicity", // czy an = -2n+5 jest rosnacy?
      "quadratic_sequence_pos", // ile wyrazow an = -n^2... jest dodatnich?
      "sequence_average", // srednia wyrazow ciagu
      "sum_formula_analysis", // Sn = n^2 - n -> a_n?
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // Arithmetic
      case "arithmetic_x":
        return this.arithGen.generateArithmeticX();
      case "arithmetic_params":
        return this.arithGen.generateArithmeticParams();
      case "arithmetic_sum":
        return this.arithGen.generateArithmeticSum();
      case "arithmetic_algebraic":
        return this.arithGen.generateArithmeticAlgebraic();

      // Geometric
      case "geometric_x":
        return this.geoGen.generateGeometricX();
      case "geometric_sum":
        return this.geoGen.generateGeometricSum();
      case "geometric_ratio_dist":
        return this.geoGen.generateGeometricRatioDist();
      case "geometric_algebraic":
        return this.geoGen.generateGeometricAlgebraic();

      // General
      case "which_term":
        return this.genGen.generateWhichTerm();
      case "count_terms":
        return this.genGen.generateCountTerms();
      case "sequence_monotonicity":
        return this.genGen.generateSequenceMonotonicity();
      case "quadratic_sequence_pos":
        return this.genGen.generateQuadraticSequencePos();
      case "sequence_average":
        return this.genGen.generateSequenceAverage();
      case "sum_formula_analysis":
        return this.genGen.generateSumFormulaAnalysis();
      case "nth_term":
      default:
        return this.genGen.generateNthTerm();
    }
  }
}

module.exports = SequencesGenerator;
