const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

// Import sub-generators
const EconomicOptimizationGenerator = require("./topics/EconomicOptimizationGenerator");
const GeometricOptimizationGenerator = require("./topics/GeometricOptimizationGenerator");

class OptimizationGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.econGen = new EconomicOptimizationGenerator(difficulty);
    this.geomGen = new GeometricOptimizationGenerator(difficulty);
  }

  generate() {
    const variants = [
      "revenue", // Ekonomiczne: Bilet/Klocki (przychód)
      "density", // Ekonomiczne: Sadownik (zagęszczenie)
      "fencing_3_pens", // Geometryczne: Ogrodzenie 3 wybiegów (pole)
      "cuboid_surface", // Geometryczne: Prostopadłościan (suma krawędzi)
      "trapezoid_window", // Geometryczne: Okno trapezowe (pole)
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
