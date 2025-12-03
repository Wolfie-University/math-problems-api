// Import wszystkich generatorów
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
    // Inicjalizujemy instancje wszystkich generatorów
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

    // Blueprint arkusza maturalnego (ilość zadań z każdego działu)
    // Suma: ok. 30 zadań.
    const structure = [
      { generator: AlgebraGenerator, count: 4 }, // Liczby rzeczywiste (potęgi, logarytmy...)
      { generator: FunctionsGeneralGenerator, count: 2 }, // Własności funkcji
      { generator: QuadraticGenerator, count: 3 }, // Funkcja kwadratowa
      { generator: SequencesGenerator, count: 2 }, // Ciągi
      { generator: TrigonometryGenerator, count: 3 }, // NOWE
      { generator: AnalyticGenerator, count: 3 }, // Geometria analityczna
      { generator: PlanimetryGenerator, count: 4 }, // Planimetria
      { generator: StereometryGenerator, count: 1 }, // Stereometria
      { generator: CombinatoricsGenerator, count: 2 }, // NOWE
      { generator: StatisticsGenerator, count: 3 }, // Statystyka/Prawdopodobieństwo
      { generator: ProbabilityGenerator, count: 2 }, // NOWE
      { generator: OptimizationGenerator, count: 1 }, // Zadanie optymalizacyjne (otwarte)
    ];

    // Generowanie zadań
    structure.forEach((section) => {
      // Znajdź instancję generatora
      const generatorInstance = this.generators.find(
        (g) => g instanceof section.generator,
      );

      for (let i = 0; i < section.count; i++) {
        // Generujemy zadanie
        const problem = generatorInstance.generate();

        // Dodajemy numer zadania i metadata
        problem.taskNumber = taskNumber++;

        // Zadanie optymalizacyjne zawsze oznaczamy jako otwarte (brak ABCD)
        if (section.generator === OptimizationGenerator) {
          problem.answers.type = "open";
          delete problem.answers.distractors; // Usuwamy dystraktory
        } else {
          // Losowo decydujemy, czy inne zadania są otwarte (ok. 20% szans na zadanie otwarte)
          // Ale na maturze większość 1-punktowych jest zamknięta.
          // Zostawmy domyślnie zamknięte, chyba że chcemy symulować "krótkie odpowiedź".
          problem.answers.type = "closed";
        }

        examTasks.push(problem);
      }
    });

    // Opcjonalnie: Mieszanie kolejności zadań (chociaż na maturze są zazwyczaj pogrupowane działami)
    // examTasks.sort(() => Math.random() - 0.5);

    return {
      title: "Próbny Arkusz Maturalny (Poziom Podstawowy)",
      generatedAt: new Date().toISOString(),
      tasksCount: examTasks.length,
      tasks: examTasks,
    };
  }
}

module.exports = ExamGenerator;
