const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

class QuadraticGenerator extends BaseGenerator {
  generate() {
    // Rozszerzona lista wariantów
    const variants = [
      "vertex_coords",
      "roots",
      "value_range",
      "canonical_form",
      "inequality", // NOWOŚĆ: Nierówności
      "optimization_revenue", // NOWOŚĆ: Zadania z treścią
    ];

    // Możemy ważyć prawdopodobieństwo, np. częściej dawać wierzchołek i nierówności
    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      case "roots":
        return this.generateRootsProblem();
      case "value_range":
        return this.generateValueRangeProblem();
      case "canonical_form":
        return this.generateCanonicalProblem();
      case "inequality":
        return this.generateInequalityProblem();
      case "vertex_coords":
      default:
        return this.generateVertexProblem();
    }
  }

  // --- WARIANT 1: WIERZCHOŁEK (To co już mieliśmy) ---
  generateVertexProblem() {
    const { a, b, c, p, q } = this.generateCoefficients();
    const formula = `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`;

    return this.createResponse({
      question:
        "Wyznacz współrzędne wierzchołka paraboli będącej wykresem funkcji:",
      latex: formula,
      image: this.generateSVG({ a, b, c, p, q, highlight: "vertex" }),
      variables: { a, b, c, p, q },
      correctAnswer: `W(${p}, ${q})`,
      distractors: [
        `W(${-p}, ${q})`, // Zły znak p
        `W(${q}, ${p})`, // Zamiana współrzędnych
        `W(${p}, ${c})`, // q pomylone z c
      ],
      steps: [
        `Wzór funkcji w postaci ogólnej: $$${formula}$$`,
        `Współczynniki: $$a=${a}, b=${b}, c=${c}$$`,
        `Obliczamy $$p = \\frac{-b}{2a} = \\frac{${-b}}{${2 * a}} = ${p}$$`,
        `Obliczamy $$q = f(p) = ${a}\\cdot(${p})^2 + (${b})\\cdot(${p}) + (${c}) = ${q}$$`,
        `Odpowiedź: $$W(${p}, ${q})$$`,
      ],
    });
  }

  // --- WARIANT 2: MIEJSCA ZEROWE (Reverse Engineering od pierwiastków) ---
  generateRootsProblem() {
    // Losujemy dwa pierwiastki całkowite x1, x2
    const x1 = MathUtils.randomInt(-6, 6);
    let x2 = MathUtils.randomInt(-6, 6);
    while (x1 === x2) x2 = MathUtils.randomInt(-6, 6); // Żeby były dwa różne

    const a =
      this.difficulty === "easy"
        ? MathUtils.randomElement([-1, 1])
        : MathUtils.randomInt(-2, 2) || 1;

    // Odtwarzamy b i c z postaci iloczynowej: a(x-x1)(x-x2)
    // a(x^2 - x*x2 - x*x1 + x1*x2) = ax^2 - a(x1+x2)x + a(x1*x2)
    const b = -a * (x1 + x2);
    const c = a * (x1 * x2);

    // Obliczamy p i q dla rysunku
    const p = (x1 + x2) / 2;
    const q = a * (p * p) + b * p + c;

    const formula = `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`;

    // Sortujemy wyniki rosnąco do ładnej odpowiedzi
    const roots = [x1, x2].sort((n1, n2) => n1 - n2);

    return this.createResponse({
      question: "Wyznacz miejsca zerowe funkcji kwadratowej określonej wzorem:",
      latex: formula,
      image: this.generateSVG({ a, b, c, p, q, x1, x2, highlight: "roots" }),
      variables: { a, b, c, x1, x2 },
      correctAnswer: `x_1 = ${roots[0]}, x_2 = ${roots[1]}`,
      distractors: [
        `x_1 = ${-roots[0]}, x_2 = ${-roots[1]}`, // Przeciwne znaki
        `x_1 = ${roots[0]}, x_2 = ${-roots[1]}`, // Jeden zły znak
        `x_1 = ${p}, x_2 = ${q}`, // Wierzchołek zamiast miejsc zerowych
      ],
      steps: [
        `Obliczamy wyróżnik $$\\Delta = b^2 - 4ac$$`,
        `$$\\Delta = (${b})^2 - 4\\cdot(${a})\\cdot(${c}) = ${b * b} - (${4 * a * c}) = ${b * b - 4 * a * c}$$`,
        `$$\\sqrt{\\Delta} = ${Math.sqrt(b * b - 4 * a * c)}$$`,
        `Obliczamy $$x_1 = \\frac{-b - \\sqrt{\\Delta}}{2a} = \\frac{${-b} - ${Math.sqrt(b * b - 4 * a * c)}}{${2 * a}} = ${Math.min(x1, x2)}$$`,
        `Obliczamy $$x_2 = \\frac{-b + \\sqrt{\\Delta}}{2a} = \\frac{${-b} + ${Math.sqrt(b * b - 4 * a * c)}}{${2 * a}} = ${Math.max(x1, x2)}$$`,
      ],
    });
  }

  // --- WARIANT 3: ZBIÓR WARTOŚCI (Range) ---
  generateValueRangeProblem() {
    const { a, b, c, p, q } = this.generateCoefficients();
    const formula = `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`;

    // Zbiór wartości zależy od znaku a
    let rangeLatex, rangeDistractor1, rangeDistractor2;

    if (a > 0) {
      rangeLatex = `\\langle ${q}, \\infty )`;
      rangeDistractor1 = `( -\\infty, ${q} \\rangle`; // Odwrotnie
      rangeDistractor2 = `\\langle ${p}, \\infty )`; // Pomyłka z p
    } else {
      rangeLatex = `( -\\infty, ${q} \\rangle`;
      rangeDistractor1 = `\\langle ${q}, \\infty )`; // Odwrotnie
      rangeDistractor2 = `( -\\infty, ${p} \\rangle`; // Pomyłka z p
    }

    return this.createResponse({
      question: "Wyznacz zbiór wartości funkcji kwadratowej:",
      latex: formula,
      image: this.generateSVG({ a, b, c, p, q, highlight: "vertex" }),
      variables: { a, b, c, p, q },
      correctAnswer: rangeLatex,
      distractors: [
        rangeDistractor1,
        rangeDistractor2,
        `\\mathbb{R}`, // Zbiór liczb rzeczywistych (typowa pomyłka z dziedziną)
      ],
      steps: [
        `Współczynnik $$a = ${a}$$. Ponieważ $$a ${a > 0 ? ">" : "<"} 0$$, ramiona paraboli są skierowane w ${a > 0 ? "górę" : "dół"}.`,
        `Obliczamy współrzędną $$q$$ wierzchołka (wartość ${a > 0 ? "minimalną" : "maksymalną"}):`,
        `$$q = f(p) = f(\\frac{-b}{2a}) = ${q}$$`,
        `Zbiorem wartości jest przedział: $$${rangeLatex}$$`,
      ],
    });
  }

  // --- WARIANT 4: POSTAĆ KANONICZNA ---
  generateCanonicalProblem() {
    const { a, b, c, p, q } = this.generateCoefficients();
    const generalFormula = `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`;

    // Formatowanie p w nawiasie: (x - p)^2
    const pSign = p > 0 ? `(x - ${p})^2` : `(x + ${Math.abs(p)})^2`;
    // Jeśli p=0 to po prostu x^2
    const core = p === 0 ? `x^2` : pSign;

    const qStr = q === 0 ? "" : q > 0 ? `+ ${q}` : `- ${Math.abs(q)}`;
    const aStr = a === 1 ? "" : a === -1 ? "-" : a;

    const canonicalLatex = `${aStr}${core} ${qStr}`;

    return this.createResponse({
      question: "Wskaż postać kanoniczną funkcji określonej wzorem:",
      latex: generalFormula,
      image: this.generateSVG({ a, b, c, p, q, highlight: "vertex" }),
      variables: { a, b, c, p, q },
      correctAnswer: `f(x) = ${canonicalLatex}`,
      distractors: [
        // Błąd: Zły znak przy p
        `f(x) = ${aStr}${p > 0 ? `(x + ${p})^2` : `(x - ${Math.abs(p)})^2`} ${qStr}`,
        // Błąd: Zamiana p i q
        `f(x) = ${aStr}${q > 0 ? `(x - ${q})^2` : `(x + ${Math.abs(q)})^2`} ${p === 0 ? "" : p > 0 ? `+ ${p}` : `- ${Math.abs(p)}`}`,
        // Błąd: Zgubione a
        `f(x) = ${core} ${qStr}`,
      ],
      steps: [
        `Postać kanoniczna to $$f(x) = a(x-p)^2 + q$$.`,
        `Obliczamy $$p = \\frac{-b}{2a} = ${p}$$`,
        `Obliczamy $$q = f(p) = ${q}$$`,
        `Podstawiamy do wzoru: $$f(x) = ${a}(x - (${p}))^2 + (${q})$$`,
        `Po uproszczeniu znaków: $$f(x) = ${canonicalLatex}$$`,
      ],
    });
  }

  // --- NOWE METODY ---

  // --- WARIANT 5: NIERÓWNOŚĆ KWADRATOWA ---
  generateInequalityProblem() {
    // Reverse engineering: ustalamy miejsca zerowe całkowite
    const x1 = MathUtils.randomInt(-5, 4);
    const x2 = x1 + MathUtils.randomInt(2, 6); // x2 zawsze większe od x1

    // Ustalamy 'a' (1 lub -1 dla uproszczenia w 'medium', inne w 'hard')
    const a = MathUtils.randomElement([-1, 1]);

    // Ustalamy znak nierówności (> lub < lub >= lub <=)
    const signType = MathUtils.randomElement([">", "<", ">=", "<="]);

    // Wyliczamy b i c
    const b = -a * (x1 + x2);
    const c = a * (x1 * x2);

    // Obliczenia pod SVG
    const p = (x1 + x2) / 2;
    const q = a * (p * p) + b * p + c;

    const formula = `${MathUtils.formatPolynomial(a, b, c)} ${signType} 0`;

    // Logika rozwiązania przedziałów
    let resultInterval = "";
    const isParabolaUp = a > 0;
    const isSignGreater = signType.includes(">");
    const isClosed = signType.includes("=");

    const bracketL = isClosed ? "\\langle" : "(";
    const bracketR = isClosed ? "\\rangle" : ")";

    // Tabela prawdy dla paraboli:
    // a > 0 (U) i > 0 (nad osią) -> (-inf, x1) U (x2, +inf)
    // a > 0 (U) i < 0 (pod osią) -> (x1, x2)
    // a < 0 (n) i > 0 (nad osią) -> (x1, x2)
    // a < 0 (n) i < 0 (pod osią) -> (-inf, x1) U (x2, +inf)

    const outsideIntervals = `(- \\infty, ${x1}${bracketR} \\cup ${bracketL}${x2}, \\infty)`;
    const insideInterval = `${bracketL}${x1}, ${x2}${bracketR}`;

    if (isParabolaUp) {
      resultInterval = isSignGreater ? outsideIntervals : insideInterval;
    } else {
      resultInterval = isSignGreater ? insideInterval : outsideIntervals;
    }

    // Dystraktory (odwrotne przedziały, złe nawiasy)
    const wrongInterval1 =
      resultInterval === outsideIntervals ? insideInterval : outsideIntervals;
    const wrongInterval2 = isClosed
      ? resultInterval.replace(/\\langle/g, "(").replace(/\\rangle/g, ")")
      : resultInterval.replace(/\(/g, "\\langle").replace(/\)/g, "\\rangle");

    return this.createResponse({
      question: "Rozwiąż nierówność kwadratową:",
      latex: formula,
      image: this.generateSVG({
        a,
        b,
        c,
        p,
        q,
        x1,
        x2,
        highlight: "inequality",
        inequalitySign: signType,
      }),
      variables: { a, b, c, x1, x2 },
      correctAnswer: `x \\in ${resultInterval}`,
      distractors: [
        `x \\in ${wrongInterval1}`,
        `x \\in ${wrongInterval2}`,
        `x \\in \\mathbb{R}`,
      ],
      steps: [
        `Rozwiązujemy równanie $$${MathUtils.formatPolynomial(a, b, c)} = 0$$`,
        `$$\\Delta = ${b * b} - 4\\cdot(${a})\\cdot(${c}) = ${b * b - 4 * a * c}$$`,
        `Miejsca zerowe: $$x_1 = ${x1}, x_2 = ${x2}$$`,
        `Szkicujemy parabolę ramionami skierowaną w ${a > 0 ? "górę" : "dół"}.`,
        `Szukamy wartości ${isSignGreater ? "większych" : "mniejszych"} od zera ${isClosed ? "(wraz z zerem)" : ""}.`,
        `Odczytujemy z wykresu: $$x \\in ${resultInterval}$$`,
      ],
    });
  }

  // --- Helper Logic ---
  generateCoefficients() {
    const p = MathUtils.randomInt(-4, 4);
    const q = MathUtils.randomInt(-4, 4);
    const a =
      this.difficulty === "easy"
        ? MathUtils.randomElement([-1, 1])
        : MathUtils.randomElement([-2, -1, 1, 2]);
    const b = -2 * a * p;
    const c = a * (p * p) + q;
    return { a, b, c, p, q };
  }

  generateSVG({ a, b, c, p, q, x1, x2, highlight, inequalitySign }) {
    const size = 300;
    const center = size / 2;

    // Dynamiczne skalowanie dla zadań optymalizacyjnych (gdzie liczby są duże)
    let scaleX = 20;
    let scaleY = 20;
    let shiftY = 0; // Przesunięcie wykresu w pionie dla optymalizacji

    if (highlight === "vertex_opt") {
      scaleX = size / 2 / (p * 2.5); // Dopasuj X do wierzchołka
      scaleY = size / 2 / (q * 1.2); // Dopasuj Y do przychodu
      shiftY = q * scaleY - size / 4; // Przesuń w dół, żeby wierzchołek był widoczny
    }

    let pathData = "";

    // Rysowanie paraboli
    const range = highlight === "vertex_opt" ? p * 2.5 : 10;
    const step = highlight === "vertex_opt" ? p / 10 : 0.2;

    for (let x = -range; x <= range; x += step) {
      const y = a * x * x + b * x + c;

      const svgX = center + x * scaleX;
      const svgY = center - y * scaleY + shiftY; // + shiftY dla optymalizacji

      if (svgY >= -size && svgY <= size * 2 && svgX >= 0 && svgX <= size) {
        pathData += `${pathData ? "L" : "M"} ${svgX} ${svgY} `;
      }
    }

    let extras = "";

    if (highlight === "vertex" || highlight === "vertex_opt") {
      const vy = center - q * scaleY + shiftY;
      const vx = center + p * scaleX;
      extras += `<circle cx="${vx}" cy="${vy}" r="4" fill="red" />`;
      // Linie pomocnicze do osi
      if (highlight === "vertex_opt") {
        extras += `<line x1="${vx}" y1="${vy}" x2="${vx}" y2="${center + shiftY}" stroke="#ccc" stroke-dasharray="4" />`;
        extras += `<line x1="${vx}" y1="${vy}" x2="${center}" y2="${vy}" stroke="#ccc" stroke-dasharray="4" />`;
      }
    } else if (highlight === "roots" && x1 !== undefined) {
      extras += `<circle cx="${center + x1 * scaleX}" cy="${center}" r="4" fill="red" />`;
      extras += `<circle cx="${center + x2 * scaleX}" cy="${center}" r="4" fill="red" />`;
    } else if (highlight === "inequality" && x1 !== undefined) {
      // Rysowanie przedziału na osi X (pogrubiona linia)
      const yAxis = center;
      const x1Pos = center + x1 * scaleX;
      const x2Pos = center + x2 * scaleX;

      let rangeColor = "rgba(0, 255, 0, 0.5)"; // Zielony marker
      let rangeWidth = 6;

      // Logika: Gdzie jest wężyk?
      const isParabolaUp = a > 0;
      const isSignGreater = inequalitySign.includes(">");

      // Jeśli rozwiązaniem jest "pomiędzy pierwiastkami"
      if (
        (!isParabolaUp && isSignGreater) ||
        (isParabolaUp && !isSignGreater)
      ) {
        extras += `<line x1="${x1Pos}" y1="${yAxis}" x2="${x2Pos}" y2="${yAxis}" stroke="${rangeColor}" stroke-width="${rangeWidth}" />`;
      } else {
        // Jeśli rozwiązaniem jest "na zewnątrz"
        extras += `<line x1="0" y1="${yAxis}" x2="${x1Pos}" y2="${yAxis}" stroke="${rangeColor}" stroke-width="${rangeWidth}" />`;
        extras += `<line x1="${x2Pos}" y1="${yAxis}" x2="${size}" y2="${yAxis}" stroke="${rangeColor}" stroke-width="${rangeWidth}" />`;
      }

      // Kółeczka otwarte/zamknięte
      const fill = inequalitySign.includes("=") ? "black" : "white";
      extras += `<circle cx="${x1Pos}" cy="${yAxis}" r="4" fill="${fill}" stroke="black" stroke-width="2"/>`;
      extras += `<circle cx="${x2Pos}" cy="${yAxis}" r="4" fill="${fill}" stroke="black" stroke-width="2"/>`;
    }

    // Przesunięcie osi X dla zadań optymalizacyjnych (żeby była na dole, a nie na środku, jeśli wartości są dodatnie)
    const xAxisY = highlight === "vertex_opt" ? center + shiftY : center;

    return `
        <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#aaa" />
                </marker>
            </defs>
            <path d="M0 ${xAxisY} H${size} M${center} 0 V${size}" stroke="#eee" stroke-width="1" />
            <line x1="10" y1="${xAxisY}" x2="${size - 10}" y2="${xAxisY}" stroke="#333" stroke-width="2" marker-end="url(#arrow)" />
            <line x1="${center}" y1="${size - 10}" x2="${center}" y2="10" stroke="#333" stroke-width="2" marker-end="url(#arrow)" />
            <path d="${pathData}" stroke="#007bff" stroke-width="2" fill="none" />
            ${extras}
        </svg>
        `;
  }
}

module.exports = QuadraticGenerator;
