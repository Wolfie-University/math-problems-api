const express = require("express");
const app = express();
const cors = require("cors");
const QuadraticGenerator = require("./src/engine/generators/functions/QuadraticGenerator");
const OptimizationGenerator = require("./src/engine/generators/functions/OptimizationGenerator");
const AnalyticGenerator = require("./src/engine/generators/geometry/AnalyticGenerator");

const problems = require("./problems.json");

app.use(cors());

// Endpoint do pobierania losowego zadania
app.get("/random-problem", (req, res) => {
  try {
    const random_problem =
      problems[Math.floor(Math.random() * problems.length)];
    res.json({ zadanie: random_problem });
  } catch (error) {
    res.status(500).json({ error: "Błąd serwera" });
  }
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

app.get("/random-problems", (req, res) => {
  try {
    let allProblems = shuffleArray(problems); // Shuffle the list of problems

    const count = Math.floor(Math.random() * (10 - 5 + 1) + 5);
    allProblems = allProblems.slice(0, count); // Randomly select a subset of problems

    res.json({ zadania: allProblems });
  } catch (error) {
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.get("/problems", (req, res) => {
  try {
    const typesParam = req.query.types;
    const countParam = req.query.count;
    const maturaParam = req.query.matura;
    const difficultyParam = req.query.difficulty;
    const tagsParam = req.query.tags;

    problems.sort(() => Math.random() - 0.5);

    if (maturaParam === true || maturaParam === "true") {
      let easyProblems = problems.filter(
        (problem) => problem.difficulty === "easy",
      );
      let mediumProblems = problems.filter(
        (problem) => problem.difficulty === "medium",
      );
      let hardProblems = problems.filter(
        (problem) => problem.difficulty === "hard",
      );

      const easyCount = 15;
      const mediumCount = 10;
      const hardCount = 6;

      easyProblems = easyProblems.slice(0, easyCount);
      mediumProblems = mediumProblems.slice(0, mediumCount);
      hardProblems = hardProblems.slice(0, hardCount);

      const maturaProblems = [
        ...easyProblems,
        ...mediumProblems,
        ...hardProblems,
      ];

      return res.json({ zadania: maturaProblems });
    } else {
      let filteredProblems = problems;

      if (typesParam && typesParam.toLowerCase() === "otwarte") {
        filteredProblems = filteredProblems.filter(
          (problem) => problem.type === "otwarte",
        );
      } else if (typesParam && typesParam.toLowerCase() === "zamkniete") {
        filteredProblems = filteredProblems.filter(
          (problem) => problem.type === "zamkniete",
        );
      }

      if (difficultyParam) {
        filteredProblems = filteredProblems.filter(
          (problem) => problem.difficulty === difficultyParam,
        );
      }

      if (tagsParam) {
        const tags = Array.isArray(tagsParam) ? tagsParam : [tagsParam];
        filteredProblems = filteredProblems.filter((problem) =>
          tags.some((tag) => problem.tags && problem.tags.includes(tag)),
        );
      }

      if (countParam) {
        const count = parseInt(countParam);
        filteredProblems = filteredProblems.slice(0, count);
      }

      res.json({ zadania: filteredProblems });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.get("/problems/:uid", (req, res) => {
  try {
    const uidArray = req.params.uid.split(",");
    const selectedProblems = [];

    uidArray.forEach((uid) => {
      const problem = problems.find((p) => p.uid === uid);
      if (problem) {
        selectedProblems.push(problem);
      }
    });

    res.json({ zadania: selectedProblems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

const port = 3333;
app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});

app.get("/api/v2/generator/quadratic", (req, res) => {
  try {
    const difficulty = req.query.difficulty || "medium";
    const generator = new QuadraticGenerator(difficulty);
    const problem = generator.generate();

    res.json(problem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Błąd generatora" });
  }
});

app.get("/api/v2/generator/optimization", (req, res) => {
  try {
    const difficulty = req.query.difficulty || "medium";
    const generator = new OptimizationGenerator(difficulty);
    const problem = generator.generate();
    res.json(problem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Błąd generatora optymalizacji" });
  }
});

app.get("/api/v2/generator/analytic", (req, res) => {
  try {
    const difficulty = req.query.difficulty || "medium";
    const generator = new AnalyticGenerator(difficulty);
    const problem = generator.generate();
    res.json(problem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Błąd generatora geometrii" });
  }
});
