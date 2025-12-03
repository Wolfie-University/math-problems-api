const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

const LinesGenerator = require("./topics/analytic/LinesGenerator");
const PointsAndSegmentsGenerator = require("./topics/analytic/PointsAndSegmentsGenerator");
const ShapesCoordsGenerator = require("./topics/analytic/ShapesCoordsGenerator");

class AnalyticGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.linesGen = new LinesGenerator(difficulty);
    this.pointsGen = new PointsAndSegmentsGenerator(difficulty);
    this.shapesGen = new ShapesCoordsGenerator(difficulty);
  }

  generate() {
    const variants = [
      // Lines
      "line_equation_2p", // rownanie prostej przez 2 punkty
      "line_parallel", // prosta rownolegla
      "line_perpendicular", // prosta prostopadla
      "line_parameter_m", // parametr m
      "intersection_point", // punkt przeciecia
      "slope_angle", // kat nachylenia
      "point_on_line_param", // punkt z parametrem na prostej
      "intersection_with_axes", // przeciecie z osiami
      "perpendicular_coeff", // wspolczynnik prostopadlej
      "perpendicular_bisector", // symetralna odcinka

      // Points & Segments
      "midpoint_length", // srodek i dlugosc
      "missing_endpoint", // brakujacy koniec
      "distance_unknown_coord", // dlugosc z niewiadoma
      "point_symmetry", // symetria punktu
      "collinear_points", // wspolliniowosc

      // Shapes & Circles
      "circle_equation", // rownanie okregu
      "circle_tangent_to_axis", // okrag styczny do osi
      "radius_from_equation", // promien z rownania
      "parallelogram_vertex", // czwarty wierzcholek
      "triangle_area_coords", // pole trojkata
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // Lines
      case "line_equation_2p":
        return this.linesGen.generateLineThroughTwoPoints();
      case "line_parallel":
        return this.linesGen.generateParallelLine();
      case "line_perpendicular":
        return this.linesGen.generatePerpendicularLine();
      case "line_parameter_m":
        return this.linesGen.generateParameterMProblem();
      case "intersection_point":
        return this.linesGen.generateIntersectionProblem();
      case "slope_angle":
        return this.linesGen.generateSlopeAngle();
      case "point_on_line_param":
        return this.linesGen.generatePointOnLineParam();
      case "intersection_with_axes":
        return this.linesGen.generateIntersectionWithAxes();
      case "perpendicular_coeff":
        return this.linesGen.generatePerpendicularCoeff();
      case "perpendicular_bisector":
        return this.linesGen.generateBisector();

      // Points
      case "midpoint_length":
        return this.pointsGen.generateMidpointProblem();
      case "missing_endpoint":
        return this.pointsGen.generateMissingEndpoint();
      case "distance_unknown_coord":
        return this.pointsGen.generateDistanceUnknownCoord();
      case "point_symmetry":
        return this.pointsGen.generatePointSymmetry();
      case "collinear_points":
        return this.pointsGen.generateCollinearPoints();

      // Shapes
      case "circle_equation":
        return this.shapesGen.generateCircleProblem();
      case "circle_tangent_to_axis":
        return this.shapesGen.generateCircleTangentToAxis();
      case "radius_from_equation":
        return this.shapesGen.generateRadiusFromEquation();
      case "parallelogram_vertex":
        return this.shapesGen.generateParallelogramVertex();
      case "triangle_area_coords":
        return this.shapesGen.generateTriangleAreaCoords();

      default:
        return this.pointsGen.generateMidpointProblem();
    }
  }
}

module.exports = AnalyticGenerator;
