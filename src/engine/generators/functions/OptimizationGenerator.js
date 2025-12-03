const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

const EconomicOptimizationGenerator = require("./topics/optimization/EconomicOptimizationGenerator");
const GeometricOptimizationGenerator = require("./topics/optimization/GeometricOptimizationGenerator");

class OptimizationGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.econGen = new EconomicOptimizationGenerator(difficulty);
    this.geomGen = new GeometricOptimizationGenerator(difficulty);
  }

  generate() {
    const variants = [
      "revenue", // ekonomiczne: bilet/klocki
      "density", // ekonomiczne: sadownik
      "fencing_3_pens", // geometryczne: ogrodzenie 3 wybiegow (pole)
      "cuboid_surface", // geometryczne: prostopadloscian (suma krawedzi)
      "trapezoid_window", // geometryczne: okno trapezowe (pole)
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // GEOMETRYCZNE
      case "fencing_3_pens":
        return this.geomGen.generateFencingProblem();
      case "cuboid_surface":
        return this.geomGen.generateCuboidProblem();
      case "trapezoid_window":
        return this.geomGen.generateTrapezoidProblem();

      // EKONOMICZNE
      case "density":
        return this.econGen.generateDensityProblem();
      case "revenue":
      default:
        return this.econGen.generateRevenueProblem();
    }
  }
}

module.exports = OptimizationGenerator;
