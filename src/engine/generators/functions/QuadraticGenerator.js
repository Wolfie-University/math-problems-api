// src/engine/generators/functions/QuadraticGenerator.js
const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

class QuadraticGenerator extends BaseGenerator {
  generate() {
    // 1. REVERSE ENGINEERING:
    // Zamiast losować a, b, c -> losujemy wierzchołek (p, q) i współczynnik a.
    // Dzięki temu wierzchołek jest zawsze liczbą całkowitą!

    const p = MathUtils.randomInt(-5, 5); // Współrzędna X wierzchołka
    const q = MathUtils.randomInt(-5, 5); // Współrzędna Y wierzchołka

    // Unikamy a=0. Dla 'easy' bierzemy a=1 lub a=-1. Dla 'medium' a z zakresu -3 do 3.
    let a =
      this.difficulty === "easy"
        ? MathUtils.randomElement([-1, 1])
        : MathUtils.randomElement([-3, -2, -1, 1, 2, 3]);

    // 2. Obliczamy współczynniki postaci ogólnej: y = ax^2 + bx + c
    // Wzory: b = -2ap, c = ap^2 + q
    const b = -2 * a * p;
    const c = a * (p * p) + q;

    // 3. Generujemy wzór funkcji w LaTeX
    const formula = `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`;

    // 4. Generujemy poprawną odpowiedź
    const correctAnswer = `(${p}, ${q})`;

    // 5. Generujemy dystraktory (błędy uczniów)
    const distractors = this.generateDistractors(p, q, a, b, c);

    // 6. Generujemy prosty wykres SVG (zakodowany inline dla wydajności)
    const svgImage = this.generateSVG(a, b, c, p, q);

    // 7. Tworzymy rozwiązanie krok po kroku
    const steps = [
      `Mamy funkcję w postaci ogólnej: $$${formula}$$`,
      `Odczytujemy współczynniki: $$a = ${a}$$, $$b = ${b}$$, $$c = ${c}$$`,
      `Obliczamy współrzędną $$p$$ wierzchołka ze wzoru $$p = \\frac{-b}{2a}$$:`,
      `$$p = \\frac{-(${b})}{2 \\cdot (${a})} = \\frac{${-b}}{${2 * a}} = ${p}$$`,
      `Obliczamy współrzędną $$q$$ podstawiając $$p$$ do wzoru funkcji (lub ze wzoru na $$\\Delta$$):`,
      `$$q = f(${p}) = ${a}\\cdot(${p})^2 + (${b})\\cdot(${p}) + (${c})$$`,
      `$$q = ${a * p * p} + (${b * p}) + (${c}) = ${q}$$`,
      `Współrzędne wierzchołka to: $$W = (${p}, ${q})$$`,
    ];

    return this.createResponse({
      question:
        "Wyznacz współrzędne wierzchołka paraboli będącej wykresem funkcji:",
      latex: formula,
      image: svgImage,
      variables: { a, b, c, p, q },
      correctAnswer: correctAnswer,
      distractors: distractors,
      steps: steps,
    });
  }

  generateDistractors(p, q, a, b, c) {
    const wrongs = new Set();

    // Błąd 1: Pomylenie znaku przy p (-b/2a vs b/2a) -> (-p, q)
    wrongs.add(`(${-p}, ${q})`);

    // Błąd 2: Zamiana współrzędnych miejscami -> (q, p)
    wrongs.add(`(${q}, ${p})`);

    // Błąd 3: Błąd rachunkowy w q (np. q = c) -> (p, c) - częste u uczniów
    wrongs.add(`(${p}, ${c})`);

    // Błąd 4: Losowe przesunięcie
    wrongs.add(`(${p + 1}, ${q - 1})`);

    // Wybieramy 3 unikalne, różne od poprawnej
    const result = Array.from(wrongs)
      .filter((ans) => ans !== `(${p}, ${q})`)
      .slice(0, 3);

    // Fallback gdyby generatory błędów dały ten sam wynik co poprawny (np p=0)
    while (result.length < 3) {
      result.push(
        `(${p + MathUtils.randomInt(1, 3)}, ${q + MathUtils.randomInt(1, 3)})`,
      );
    }

    return result;
  }

  generateSVG(a, b, c, p, q) {
    // Bardzo prosty generator SVG "inline"
    // Rysujemy układ współrzędnych i parabolę aproksymowaną liniami
    const size = 200; // 200x200 px
    const scale = 10; // 1 jednostka to 10px
    const center = size / 2;

    let pathData = "";
    // Generujemy punkty wykresu od x = -10 do x = 10
    for (let x = -10; x <= 10; x += 0.5) {
      const y = a * x * x + b * x + c;
      // Konwersja na współrzędne SVG (oś Y w dół w SVG, więc odwracamy)
      const svgX = center + x * scale;
      const svgY = center - y * scale;

      // Zabezpieczenie przed wyjściem poza "papier"
      if (svgY >= -size && svgY <= size * 2) {
        pathData += `${pathData ? "L" : "M"} ${svgX} ${svgY} `;
      }
    }

    return `
        <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
            <line x1="0" y1="${center}" x2="${size}" y2="${center}" stroke="#aaa" stroke-width="1" />
            <line x1="${center}" y1="0" x2="${center}" y2="${size}" stroke="#aaa" stroke-width="1" />
            <path d="${pathData}" stroke="blue" stroke-width="2" fill="none" />
            <circle cx="${center + p * scale}" cy="${center - q * scale}" r="3" fill="red" />
        </svg>
        `;
  }
}

module.exports = QuadraticGenerator;
