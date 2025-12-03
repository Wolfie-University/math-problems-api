// src/engine/core/BaseGenerator.js

class BaseGenerator {
  constructor(difficulty = "medium") {
    this.difficulty = difficulty;
  }

  // Metoda, którą każdy generator musi nadpisać
  generate() {
    throw new Error("Method 'generate()' must be implemented.");
  }

  // Pomocnicza struktura odpowiedzi
  createResponse({
    question,
    latex,
    image,
    variables,
    correctAnswer,
    distractors,
    steps,
  }) {
    return {
      meta: {
        type: this.constructor.name,
        difficulty: this.difficulty,
      },
      content: {
        question_text: question, // Tekst z placeholderami
        question_latex: latex, // Surowy LaTeX do renderowania
        image_svg: image, // Kod SVG
        variables: variables, // Wylosowane liczby (dla debugowania)
      },
      answers: {
        correct: correctAnswer,
        distractors: distractors, // 3 błędne odpowiedzi
      },
      solution: {
        steps: steps, // Tablica kroków rozwiązania
      },
    };
  }
}

module.exports = BaseGenerator;
