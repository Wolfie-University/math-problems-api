const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

const TrigIdentitiesGenerator = require("./topics/TrigIdentitiesGenerator");
const TrigGeometryGenerator = require("./topics/TrigGeometryGenerator");
const TrigValuesAndPropertiesGenerator = require("./topics/TrigValuesAndPropertiesGenerator");
const TrigWordProblemsGenerator = require("./topics/TrigWordProblemsGenerator");

class TrigonometryGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.identityGen = new TrigIdentitiesGenerator(difficulty);
    this.geoGen = new TrigGeometryGenerator(difficulty);
    this.valGen = new TrigValuesAndPropertiesGenerator(difficulty);
    this.wordGen = new TrigWordProblemsGenerator(difficulty);
  }

  generate() {
    const variants = [
      // Identities & Algebra
      "pythagorean_id", // sin^2 + cos^2 = 1
      "identity_reduction", // sin^2(20) + sin^2(70) = 1
      "calc_expr_from_trig", // dane sin, oblicz 2cos^2 - 1
      "linear_relation", // sin = 2cos -> oblicz tg
      "simplify_basic", // (1-cos)(1+cos) -> sin^2
      "angle_relation", // redukcja: sin(a) = cos(90-a)
      "tg_identity", // tg = sin/cos
      "tan_product_reduction", // tg(20) * tg(70) = 1

      // Geometry Application
      "triangle_def", // definicja w trojkacie
      "area_triangle", // P = 0.5 ab sin(alpha)
      "area_parallelogram", // P = ab sin(alpha)
      "area_rhombus", // P = a^2 sin(alpha)
      "isosceles_arm", // podstawa, kat -> ramie
      "trapezoid_height", // ramie, kat -> wysokosc

      // Values & Properties
      "values_eval", // sin(30) + cos(60)
      "find_angle", // tg(x) = 1 -> x = 45
      "compare_functions", // sin(20) vs sin(50)
      "approx_value", // przyblizona wartosc

      // Word Problems
      "word_ladder", // drabina
      "word_shadow", // cien
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // Identities
      case "pythagorean_id":
        return this.identityGen.generatePythagoreanIdentity();
      case "identity_reduction":
        return this.identityGen.generateIdentityReduction();
      case "calc_expr_from_trig":
        return this.identityGen.generateCalcExprFromTrig();
      case "linear_relation":
        return this.identityGen.generateLinearRelation();
      case "simplify_basic":
        return this.identityGen.generateSimplifyBasic();
      case "angle_relation":
        return this.identityGen.generateAngleRelation();
      case "tg_identity":
        return this.identityGen.generateTgIdentity();
      case "tan_product_reduction":
        return this.identityGen.generateTanProductReduction();

      // Geometry
      case "triangle_def":
        return this.geoGen.generateTriangleDef();
      case "area_triangle":
        return this.geoGen.generateAreaTriangle();
      case "area_parallelogram":
        return this.geoGen.generateAreaParallelogram();
      case "area_rhombus":
        return this.geoGen.generateAreaRhombus();
      case "isosceles_arm":
        return this.geoGen.generateIsoscelesArm();
      case "trapezoid_height":
        return this.geoGen.generateTrapezoidHeight();

      // Values
      case "values_eval":
        return this.valGen.generateValuesEval();
      case "find_angle":
        return this.valGen.generateFindAngle();
      case "compare_functions":
        return this.valGen.generateCompareFunctions();
      case "approx_value":
        return this.valGen.generateApproxValue();

      // Word Problems
      case "word_ladder":
        return this.wordGen.generateWordLadder();
      case "word_shadow":
        return this.wordGen.generateWordShadow();

      default:
        return this.identityGen.generateTgIdentity();
    }
  }
}

module.exports = TrigonometryGenerator;
