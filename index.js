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

app.use(cors());

const handleRequest = (GeneratorClass, req, res) => {
  try {
    const difficulty = req.query.difficulty || "medium";
    const generator = new GeneratorClass(difficulty);
    const problem = generator.generate();
    res.json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd generatora", details: error.message });
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
