const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

const LinearFunctionGenerator = require("./topics/general/LinearFunctionGenerator");
const FunctionPropertiesGenerator = require("./topics/general/FunctionPropertiesGenerator");
const TransformationsGenerator = require("./topics/general/TransformationsGenerator");
const ExponentialFunctionGenerator = require("./topics/general/ExponentialFunctionGenerator");
const PiecewiseFunctionGenerator = require("./topics/general/PiecewiseFunctionGenerator");

class FunctionsGeneralGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.linearGen = new LinearFunctionGenerator(difficulty);
    this.propsGen = new FunctionPropertiesGenerator(difficulty);
    this.transGen = new TransformationsGenerator(difficulty);
    this.expGen = new ExponentialFunctionGenerator(difficulty);
    this.pieceGen = new PiecewiseFunctionGenerator(difficulty);
  }

  generate() {
    const variants = [
      "linear_root", // miejsce zerowe f. liniowej
      "point_belongs_param", // punkt (x, m) nalezy do wykresu
      "exponential_param", // funkcja wykladnicza f(x)=a^x
      "symmetry_transform", // symetria OX/OY/00
      "read_graph_properties", // odczytywanie z wykresu (SVG)
      "piecewise_function", // funkcja klamrowa (przedzialami)
      "linear_graph_analysis", // znaki a i b z wykresu (SVG)
      "linear_monotonicity_param", // parametr m (funkcja rosnaca/malejaca)
      "function_shift", // przesunięcie o wektor [p, q]
      "function_domain", // dziedzina f. wymiernej
      "function_value", // wartosc funkcji dla argumentu x
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // LINEAR FUNCTIONS
      case "linear_root":
        return this.linearGen.generateLinearRoot();
      case "linear_graph_analysis":
        return this.linearGen.generateLinearGraphAnalysis();
      case "linear_monotonicity_param":
        return this.linearGen.generateLinearMonotonicityParam();
      case "linear_properties":
        return this.linearGen.generateLinearProperties();

      // FUNCTION PROPERTIES
      case "point_belongs_param":
        return this.propsGen.generatePointBelongsParam();
      case "read_graph_properties":
        return this.propsGen.generateReadGraphProperties();
      case "function_domain":
        return this.propsGen.generateFunctionDomain();
      case "function_value":
        return this.propsGen.generateFunctionValue();

      // TRANSFORMATIONS
      case "symmetry_transform":
        return this.transGen.generateSymmetryTransform();
      case "function_shift":
        return this.transGen.generateFunctionShift();

      // EXPONENTIAL FUNCTIONS
      case "exponential_param":
        return this.expGen.generateExponentialParam();
      case "piecewise_function":
        return this.pieceGen.generatePiecewiseFunction();

      default:
        return this.linearGen.generateLinearRoot();
    }
  }
}

module.exports = FunctionsGeneralGenerator;
