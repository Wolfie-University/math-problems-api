const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

const CubesGenerator = require("./topics/stereometry/CubesGenerator");
const SolidsOfRevolutionGenerator = require("./topics/stereometry/SolidsOfRevolutionGenerator");
const PyramidsAndPrismsGenerator = require("./topics/stereometry/PyramidsAndPrismsGenerator");
const ScalingGenerator = require("./topics/stereometry/ScalingGenerator");

class StereometryGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.cubeGen = new CubesGenerator(difficulty);
    this.revGen = new SolidsOfRevolutionGenerator(difficulty);
    this.pyrGen = new PyramidsAndPrismsGenerator(difficulty);
    this.scaleGen = new ScalingGenerator(difficulty);
  }

  generate() {
    const variants = [
      "cube_features", // szescian
      "cuboid_angle", // kat w prostopadloscianie
      "cuboid_diagonal", // przekatna prostopadloscianu
      "cone_basics", // stozek (Pitagoras)
      "cylinder_volume", // walec (przekroj)
      "cylinder_section_diagonal", // przekatna przekroju walca
      "sphere_calc", // kula
      "pyramid_square", // ostroslup praw. czwarokatny
      "pyramid_face_angle", // kat sciany bocznej ostroslupa
      "pyramid_triangle", // ostroslup praw. trojkatny
      "tetrahedron_regular", // czwaroscian foremny
      "prism_triangle", // graniastoslup praw. trojkatny
      "solid_scaling", // skalowanie bryl
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // Cubes & Cuboids
      case "cuboid_angle":
        return this.cubeGen.generateCuboidAngle();
      case "cuboid_diagonal":
        return this.cubeGen.generateCuboidDiagonal();
      case "cube_features":
        return this.cubeGen.generateCubeProblem();

      // Revolution Solids
      case "cone_basics":
        return this.revGen.generateConeProblem();
      case "cylinder_volume":
        return this.revGen.generateCylinderProblem();
      case "cylinder_section_diagonal":
        return this.revGen.generateCylinderSectionDiagonal();
      case "sphere_calc":
        return this.revGen.generateSphereProblem();

      // Pyramids & Prisms
      case "pyramid_square":
        return this.pyrGen.generatePyramidSquare();
      case "pyramid_face_angle":
        return this.pyrGen.generatePyramidFaceAngle();
      case "pyramid_triangle":
        return this.pyrGen.generatePyramidTriangle();
      case "tetrahedron_regular":
        return this.pyrGen.generateTetrahedronRegular();
      case "prism_triangle":
        return this.pyrGen.generatePrismTriangle();

      // Other
      case "solid_scaling":
        return this.scaleGen.generateScalingProblem();

      default:
        return this.cubeGen.generateCubeProblem();
    }
  }
}

module.exports = StereometryGenerator;
