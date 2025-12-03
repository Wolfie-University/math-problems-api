const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

const TrianglesGenerator = require("./topics/planimetry/TrianglesGenerator");
const CirclesGenerator = require("./topics/planimetry/CirclesGenerator");
const QuadrilateralsGenerator = require("./topics/planimetry/QuadrilateralsGenerator");
const AnglesGenerator = require("./topics/planimetry/AnglesGenerator");

class PlanimetryGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.triGen = new TrianglesGenerator(difficulty);
    this.circGen = new CirclesGenerator(difficulty);
    this.quadGen = new QuadrilateralsGenerator(difficulty);
    this.angleGen = new AnglesGenerator(difficulty);
  }

  generate() {
    const variants = [
      // Triangles
      "pythagoras_simple",
      "triangle_angles_sum",
      "equilateral_triangle",
      "triangle_similarity",
      "triangle_area_sin",
      "inradius_right_triangle",
      "circumradius_right_triangle",
      "isosceles_angles",
      "right_triangle_trig",

      // Circles
      "circle_angles",
      "circle_area_circumference",
      "sector_area",
      "arc_length",
      "thales_theorem",
      "circle_tangent",

      // Quadrilaterals
      "rhombus_area",
      "rhombus_angles",
      "parallelogram_neighbor",
      "trapezoid_area",
      "quadrilateral_angles",
      "cyclic_quadrilateral",
      "tangential_quadrilateral",

      // Lines & Angles
      "angles_lines",
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // Triangles
      case "pythagoras_simple":
        return this.triGen.generatePythagoras();
      case "triangle_angles_sum":
        return this.triGen.generateTriangleAnglesSum();
      case "equilateral_triangle":
        return this.triGen.generateEquilateralTriangle();
      case "triangle_similarity":
        return this.triGen.generateSimilarity();
      case "triangle_area_sin":
        return this.triGen.generateTriangleAreaSin();
      case "inradius_right_triangle":
        return this.triGen.generateInradiusRightTriangle();
      case "circumradius_right_triangle":
        return this.triGen.generateCircumradiusRightTriangle();
      case "isosceles_angles":
        return this.triGen.generateIsoscelesAngles();
      case "right_triangle_trig":
        return this.triGen.generateTrigProblem();

      // Circles
      case "circle_angles":
        return this.circGen.generateCircleAngles();
      case "circle_area_circumference":
        return this.circGen.generateCircleAreaCircumference();
      case "sector_area":
        return this.circGen.generateSectorArea();
      case "arc_length":
        return this.circGen.generateArcLength();
      case "thales_theorem":
        return this.circGen.generateThalesTheorem();
      case "circle_tangent":
        return this.circGen.generateCircleTangent();

      // Quadrilaterals
      case "rhombus_area":
        return this.quadGen.generateRhombus();
      case "rhombus_angles":
        return this.quadGen.generateRhombusAngles();
      case "parallelogram_neighbor":
        return this.quadGen.generateParallelogramNeighbor();
      case "trapezoid_area":
        return this.quadGen.generateTrapezoidArea();
      case "quadrilateral_angles":
        return this.quadGen.generateQuadrilateralAngles();
      case "cyclic_quadrilateral":
        return this.quadGen.generateCyclicQuadrilateral();
      case "tangential_quadrilateral":
        return this.quadGen.generateTangentialQuadrilateral();

      // Angles
      case "angles_lines":
        return this.angleGen.generateAnglesLines();

      default:
        return this.circGen.generateCircleAngles();
    }
  }
}

module.exports = PlanimetryGenerator;
