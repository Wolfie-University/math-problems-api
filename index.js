const express = require("express");
const app = express();
const cors = require("cors");

// algebra i Liczby
const AlgebraGenerator = require("./src/engine/generators/algebra/AlgebraGenerator");

// funkcje
const FunctionsGeneralGenerator = require("./src/engine/generators/functions/FunctionsGeneralGenerator");
const QuadraticGenerator = require("./src/engine/generators/functions/QuadraticGenerator");
const OptimizationGenerator = require("./src/engine/generators/functions/OptimizationGenerator");

// ciagi
const SequencesGenerator = require("./src/engine/generators/sequences/SequencesGenerator");

// geometria
const AnalyticGenerator = require("./src/engine/generators/geometry/AnalyticGenerator");
const PlanimetryGenerator = require("./src/engine/generators/geometry/PlanimetryGenerator");
const StereometryGenerator = require("./src/engine/generators/geometry/StereometryGenerator");
const TrigonometryGenerator = require("./src/engine/generators/trigonometry/TrigonometryGenerator");

// statystyka i prawdopodobienstwo
const StatisticsGenerator = require("./src/engine/generators/statistics/StatisticsGenerator");
const CombinatoricsGenerator = require("./src/engine/generators/combinatorics/CombinatoricsGenerator");
const ProbabilityGenerator = require("./src/engine/generators/statistics/ProbabilityGenerator");

const ExamGenerator = require("./src/engine/generators/ExamGenerator");

const AllGenerators = [
  AlgebraGenerator,
  FunctionsGeneralGenerator,
  QuadraticGenerator,
  OptimizationGenerator,
  SequencesGenerator,
  AnalyticGenerator,
  PlanimetryGenerator,
  StereometryGenerator,
  TrigonometryGenerator,
  StatisticsGenerator,
  CombinatoricsGenerator,
  ProbabilityGenerator,
];

app.use(cors());

/**
 * helper to handle requests with difficulty and count parameters
 * @param {Class} GeneratorClass - generator class to use (optional for random)
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {Boolean} isRandomMode - if true, picks a random generator for each iteration
 */
const handleRequest = (GeneratorClass, req, res, isRandomMode = false) => {
  try {
    const difficulty = req.query.difficulty || "medium";
    const countParam = req.query.count;

    let count = countParam ? parseInt(countParam, 10) : 1;
    if (isNaN(count) || count < 1) count = 1;
    if (count > 50) count = 50;

    const problems = [];

    for (let i = 0; i < count; i++) {
      let generator;

      if (isRandomMode) {
        const RandomClass =
          AllGenerators[Math.floor(Math.random() * AllGenerators.length)];
        generator = new RandomClass(difficulty);
      } else {
        generator = new GeneratorClass(difficulty);
      }

      const problem = generator.generate();
      problems.push(problem);
    }

    if (countParam) {
      res.json(problems);
    } else {
      res.json(problems[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Generator Error", details: error.message });
  }
};

// algebra
app.get("/api/v2/generator/algebra", (req, res) =>
  handleRequest(AlgebraGenerator, req, res),
);

// funkcje
app.get("/api/v2/generator/functions-general", (req, res) =>
  handleRequest(FunctionsGeneralGenerator, req, res),
);
app.get("/api/v2/generator/quadratic", (req, res) =>
  handleRequest(QuadraticGenerator, req, res),
);
app.get("/api/v2/generator/optimization", (req, res) =>
  handleRequest(OptimizationGenerator, req, res),
);

// ciagi
app.get("/api/v2/generator/sequences", (req, res) =>
  handleRequest(SequencesGenerator, req, res),
);

// geometria
app.get("/api/v2/generator/analytic", (req, res) =>
  handleRequest(AnalyticGenerator, req, res),
);
app.get("/api/v2/generator/planimetry", (req, res) =>
  handleRequest(PlanimetryGenerator, req, res),
);
app.get("/api/v2/generator/stereometry", (req, res) =>
  handleRequest(StereometryGenerator, req, res),
);
app.get("/api/v2/generator/trigonometry", (req, res) =>
  handleRequest(TrigonometryGenerator, req, res),
);

// statystyka i kombinatoryka
app.get("/api/v2/generator/statistics", (req, res) =>
  handleRequest(StatisticsGenerator, req, res),
);
app.get("/api/v2/generator/combinatorics", (req, res) =>
  handleRequest(CombinatoricsGenerator, req, res),
);
app.get("/api/v2/generator/probability", (req, res) =>
  handleRequest(ProbabilityGenerator, req, res),
);

app.get("/api/v2/generator/random", (req, res) =>
  handleRequest(null, req, res, true),
);

app.get("/api/v2/exam/full", (req, res) => {
  try {
    const difficulty = req.query.difficulty || "medium";
    const generator = new ExamGenerator(difficulty);
    const exam = generator.generateExam();
    res.json(exam);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Błąd generowania egzaminu", details: error.message });
  }
});

// health check
app.get("/", (req, res) => {
  res.send("Math API v2 (JS) is running!");
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});

module.exports = app;
