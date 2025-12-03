const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

const LogarithmsGenerator = require("./topics/LogarithmsGenerator");
const BasicOperationsGenerator = require("./topics/BasicOperationsGenerator");
const FormulasGenerator = require("./topics/FormulasGenerator");
const NumbersGenerator = require("./topics/NumbersGenerator");
const IntervalsGenerator = require("./topics/IntervalsGenerator");

class AlgebraGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.logGen = new LogarithmsGenerator(difficulty);
    this.basicGen = new BasicOperationsGenerator(difficulty);
    this.formulaGen = new FormulasGenerator(difficulty);
    this.numGen = new NumbersGenerator(difficulty);
    this.intervalGen = new IntervalsGenerator(difficulty);
  }

  generate() {
    const variants = [
      "power_simplify",
      "log_formula",
      "short_mult_eval",
      "percent_calc",
      "abs_value_inequality",
      "roots_simplify",
      "error_calc",
      "rational_simplify",
      "scientific_notation",
      "interval_operations",
      "algebraic_expansion",
      "log_power_rule",
      "exponent_root_conversion",
      "percent_relations",
      "gcd_lcm",
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      case "log_formula":
        return this.logGen.generateLogProblem();
      case "log_power_rule":
        return this.logGen.generateLogPowerRule();

      case "power_simplify":
        return this.basicGen.generatePowerProblem();
      case "roots_simplify":
        return this.basicGen.generateRootsProblem();
      case "scientific_notation":
        return this.basicGen.generateScientificProblem();
      case "exponent_root_conversion":
        return this.basicGen.generateExponentRootConversion();

      case "short_mult_eval":
        return this.formulaGen.generateShortMultProblem();
      case "rational_simplify":
        return this.formulaGen.generateRationalProblem();
      case "algebraic_expansion":
        return this.formulaGen.generateAlgebraicExpansion();

      case "percent_calc":
        return this.numGen.generatePercentProblem();
      case "percent_relations":
        return this.numGen.generatePercentRelations();
      case "error_calc":
        return this.numGen.generateErrorProblem();
      case "gcd_lcm":
        return this.numGen.generateGcdLcm();

      case "abs_value_inequality":
        return this.intervalGen.generateAbsValueProblem();
      case "interval_operations":
        return this.intervalGen.generateIntervalOpsProblem();

      default:
        return this.basicGen.generatePowerProblem();
    }
  }
}

module.exports = AlgebraGenerator;
