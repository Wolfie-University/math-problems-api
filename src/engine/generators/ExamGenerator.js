const AlgebraGenerator = require("./algebra/AlgebraGenerator");
const FunctionsGeneralGenerator = require("./functions/FunctionsGeneralGenerator");
const QuadraticGenerator = require("./functions/QuadraticGenerator");
const OptimizationGenerator = require("./functions/OptimizationGenerator");
const SequencesGenerator = require("./sequences/SequencesGenerator");
const PlanimetryGenerator = require("./geometry/PlanimetryGenerator");
const StereometryGenerator = require("./geometry/StereometryGenerator");
const AnalyticGenerator = require("./geometry/AnalyticGenerator");
const StatisticsGenerator = require("./statistics/StatisticsGenerator");
const TrigonometryGenerator = require("./trigonometry/TrigonometryGenerator");
const CombinatoricsGenerator = require("./combinatorics/CombinatoricsGenerator");
const ProbabilityGenerator = require("./statistics/ProbabilityGenerator");

class ExamGenerator {
  constructor() {
    this.generators = [
      new AlgebraGenerator(),
      new FunctionsGeneralGenerator(),
      new QuadraticGenerator(),
      new OptimizationGenerator(),
      new SequencesGenerator(),
      new PlanimetryGenerator(),
      new StereometryGenerator(),
      new AnalyticGenerator(),
      new StatisticsGenerator(),
      new TrigonometryGenerator(),
      new CombinatoricsGenerator(),
      new ProbabilityGenerator(),
    ];
  }

  generateExam() {
    const examTasks = [];
    let taskNumber = 1;

    // ok 30 zadan
    const structure = [
      { generator: AlgebraGenerator, count: 4 }, // liczby rzeczywiste (potegi, logarytmy itd)
      { generator: FunctionsGeneralGenerator, count: 2 }, // wlasnosci funkcji
      { generator: QuadraticGenerator, count: 3 }, // funkcja kwadratowa
      { generator: SequencesGenerator, count: 2 }, // ciagi
      { generator: TrigonometryGenerator, count: 3 }, // trygonometria
      { generator: AnalyticGenerator, count: 3 }, // geometria analityczna
      { generator: PlanimetryGenerator, count: 4 }, // planimetria
      { generator: StereometryGenerator, count: 1 }, // stereometria
      { generator: CombinatoricsGenerator, count: 2 }, // kombinatoryka
      { generator: StatisticsGenerator, count: 3 }, // statystyka
      { generator: ProbabilityGenerator, count: 2 }, // prawdopodobienstwo
      { generator: OptimizationGenerator, count: 1 }, // zadanie optymalizacyjne (otwarte)
    ];

    structure.forEach((section) => {
      const generatorInstance = this.generators.find(
        (g) => g instanceof section.generator,
      );

      for (let i = 0; i < section.count; i++) {
        const problem = generatorInstance.generate();
        problem.taskNumber = taskNumber++;

        if (section.generator === OptimizationGenerator) {
          problem.answers.type = "open";
          delete problem.answers.distractors;
        } else {
          problem.answers.type = "closed";
        }

        examTasks.push(problem);
      }
    });

    return {
      title: "Próbny Arkusz Maturalny (Poziom Podstawowy)",
      generatedAt: new Date().toISOString(),
      tasksCount: examTasks.length,
      tasks: examTasks,
    };
  }
}

module.exports = ExamGenerator;
