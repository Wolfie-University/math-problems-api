const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

const VertexAndRootsGenerator = require("./topics/quadratic/VertexAndRootsGenerator");
const PropertiesGenerator = require("./topics/quadratic/PropertiesGenerator");
const EquationsAndInequalitiesGenerator = require("./topics/quadratic/EquationsAndInequalitiesGenerator");
const TransformationsQuadraticGenerator = require("./topics/quadratic/TransformationsQuadraticGenerator");

class QuadraticGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.vertexGen = new VertexAndRootsGenerator(difficulty);
    this.propGen = new PropertiesGenerator(difficulty);
    this.eqGen = new EquationsAndInequalitiesGenerator(difficulty);
    this.transGen = new TransformationsQuadraticGenerator(difficulty);
  }

  generate() {
    const variants = [
      // Vertex & Roots
      "vertex_coords",
      "roots",
      "canonical_form",
      "symmetry_axis",
      // Properties
      "value_range",
      "min_max_interval",
      "monotonicity_interval",
      // Equations & Inequalities
      "inequality",
      "vieta_sum_product",
      "solutions_count_k",
      "formula_from_vertex_point",
      "coeffs_from_vertex",
      "product_to_general",
      // Transformations & Graph
      "shift_parabola",
      "inequality_from_graph",
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // Vertex & Roots
      case "vertex_coords":
        return this.vertexGen.generateVertexProblem();
      case "roots":
        return this.vertexGen.generateRootsProblem();
      case "canonical_form":
        return this.vertexGen.generateCanonicalProblem();
      case "symmetry_axis":
        return this.vertexGen.generateSymmetryAxisProblem();

      // Properties
      case "value_range":
        return this.propGen.generateValueRangeProblem();
      case "min_max_interval":
        return this.propGen.generateMinMaxIntervalProblem();
      case "monotonicity_interval":
        return this.propGen.generateMonotonicityProblem();

      // Equations
      case "inequality":
        return this.eqGen.generateInequalityProblem();
      case "vieta_sum_product":
        return this.eqGen.generateVietaProblem();
      case "solutions_count_k":
        return this.eqGen.generateSolutionsCountProblem();
      case "formula_from_vertex_point":
        return this.eqGen.generateFormulaFromVertexProblem();
      case "coeffs_from_vertex":
        return this.eqGen.generateCoeffsFromVertexProblem();
      case "product_to_general":
        return this.eqGen.generateProductToGeneralProblem();

      // Transformations
      case "shift_parabola":
        return this.transGen.generateShiftParabolaProblem();
      case "inequality_from_graph":
        return this.transGen.generateInequalityGraphProblem();

      default:
        return this.vertexGen.generateVertexProblem();
    }
  }
}

module.exports = QuadraticGenerator;
