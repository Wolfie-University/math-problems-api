const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

class FunctionsGeneralGenerator extends BaseGenerator {
  generate() {
    const variants = [
      "linear_root", // Miejsce zerowe f. liniowej
      "point_belongs_param", // Punkt (x, m) należy do wykresu
      "exponential_param", // Funkcja wykładnicza f(x)=a^x
      "symmetry_transform", // Symetria OX/OY/00
      "read_graph_properties", // Odczytywanie z wykresu (SVG)
      "piecewise_function", // Funkcja klamrowa (przedziałami)
      "linear_graph_analysis", // Znaki a i b z wykresu (SVG)
      "linear_monotonicity_param", // Parametr m (funkcja rosnąca/malejąca)
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      case "point_belongs_param":
        return this.generatePointBelongsParam();
      case "exponential_param":
        return this.generateExponentialParam();
      case "symmetry_transform":
        return this.generateSymmetryTransform();
      case "read_graph_properties":
        return this.generateReadGraphProperties();
      case "piecewise_function":
        return this.generatePiecewiseFunction();
      case "linear_graph_analysis":
        return this.generateLinearGraphAnalysis();
      case "linear_monotonicity_param":
        return this.generateLinearMonotonicityParam();
      case "linear_root":
      default:
        return this.generateLinearRoot();
    }
  }

  // --- 1. MIEJSCE ZEROWE FUNKCJI LINIOWEJ ---
  generateLinearRoot() {
    // f(x) = ax + b = 0 -> x = -b/a
    // Dobieramy a i b tak, żeby wynik był ładny (całkowity lub prosty ułamek)

    const root = MathUtils.randomInt(-6, 6);
    let a_num = MathUtils.randomElement([1, 2, 3, 4, 5]);
    let a_den = MathUtils.randomElement([1, 1, 2, 3]); // Częściej całkowite

    // Czasem a ujemne
    if (Math.random() > 0.5) a_num *= -1;

    const a = a_num / a_den;
    const b = -a * root;

    const formula = this.formatLinear(a, b);

    return this.createResponse({
      question: `Miejscem zerowym funkcji liniowej określonej wzorem $$f(x) = ${formula}$$ jest liczba:`,
      latex: formula,
      image: null,
      variables: { a, b, root },
      correctAnswer: `${root}`,
      distractors: [`${-root}`, `${b}`, `${root + 1}`],
      steps: [
        `Szukamy takiego $$x$$, dla którego $$f(x) = 0$$.`,
        `$$${formula} = 0$$`,
        `$$${this.fractionToLatex(a)}x = ${this.fractionToLatex(-b)}$$`,
        `$$x = ${this.fractionToLatex(-b)} : (${this.fractionToLatex(a)}) = ${root}$$`,
      ],
    });
  }

  // --- 2. PUNKT NALEŻĄCY DO WYKRESU Z PARAMETREM ---
  generatePointBelongsParam() {
    // Punkt A = (x0, m) należy do wykresu f(x). Oblicz m.
    // Lub A = (m, y0).

    // Typ funkcji: wymierna (klasyk) lub kwadratowa
    const type = MathUtils.randomElement(["rational", "quadratic"]);
    const mode = "find_y"; // m jest współrzędną Y (łatwiejsze i częstsze)

    let formula, val, x0, m, stepsCalc;

    if (type === "rational") {
      // f(x) = a/x + b
      const a = MathUtils.randomElement([-4, -2, 2, 3, 4, 6, 8]);
      const b = MathUtils.randomInt(-5, 5);
      // x0 musi być dzielnikiem a
      const divisors = [1, -1];
      if (a % 2 === 0) divisors.push(2, -2);
      if (a % 3 === 0) divisors.push(3, -3);
      if (Math.abs(a) > 2) divisors.push(a, -a);

      x0 = MathUtils.randomElement(divisors);
      m = a / x0 + b;

      formula = `f(x) = \\frac{${a}}{x} ${b >= 0 ? "+" : ""}${b === 0 ? "" : b}`;
      stepsCalc = `$$f(${x0}) = \\frac{${a}}{${x0}} ${b >= 0 ? "+" : ""}${b === 0 ? "" : b} = ${a / x0} ${b >= 0 ? "+" : ""}${b === 0 ? "" : b} = ${m}$$`;
    } else {
      // f(x) = (x-a)^2 + b
      const p = MathUtils.randomInt(-3, 3);
      const q = MathUtils.randomInt(-3, 3);
      x0 = MathUtils.randomInt(-5, 5);
      m = Math.pow(x0 - p, 2) + q;

      formula = `f(x) = (x ${p > 0 ? "-" : "+"} ${Math.abs(p)})^2 ${q >= 0 ? "+" : ""}${q}`;
      stepsCalc = `$$f(${x0}) = (${x0} ${p > 0 ? "-" : "+"} ${Math.abs(p)})^2 ${q >= 0 ? "+" : ""}${q} = (${x0 - p})^2 ${q >= 0 ? "+" : ""}${q} = ${Math.pow(x0 - p, 2)} ${q >= 0 ? "+" : ""}${q} = ${m}$$`;
    }

    return this.createResponse({
      question: `Punkt $$A = (${x0}, m)$$ należy do wykresu funkcji $$${formula}$$. Zatem:`,
      latex: `A = (${x0}, m)`,
      image: null,
      variables: { x0, m },
      correctAnswer: `m = ${m}`,
      distractors: [`m = ${m + 1}`, `m = ${-m}`, `m = 0`],
      steps: [
        `Skoro punkt $$A$$ należy do wykresu, to jego współrzędne spełniają równanie funkcji.`,
        `Podstawiamy $$x = ${x0}$$ i $$y = m$$.`,
        stepsCalc,
        `$$m = ${m}$$`,
      ],
    });
  }

  // --- 3. FUNKCJA WYKŁADNICZA Z PARAMETREM ---
  generateExponentialParam() {
    // f(x) = a^x. f(x0) = y0. Oblicz a.
    // Np. f(2) = 9 -> a=3. f(1/2) = 4 -> a=16.

    const scenario = MathUtils.randomElement([
      { x: 2, a: 3, y: 9 },
      { x: 2, a: 2, y: 4 },
      { x: 2, a: 4, y: 16 },
      { x: 2, a: 5, y: 25 },
      { x: 3, a: 2, y: 8 },
      { x: 3, a: 3, y: 27 },
      { x: -1, a: 2, y: "\\frac{1}{2}" },
      { x: -1, a: 3, y: "\\frac{1}{3}" },
    ]);

    return this.createResponse({
      question: `Funkcja wykładnicza określona wzorem $$f(x) = a^x$$ przyjmuje dla argumentu $$${scenario.x}$$ wartość $$${scenario.y}$$. Podstawa $$a$$ tej funkcji jest równa:`,
      latex: `f(${scenario.x}) = ${scenario.y}`,
      image: null,
      variables: { scenario },
      correctAnswer: `${scenario.a}`,
      distractors: [
        `${scenario.a * 2}`,
        scenario.x > 0 ? `\\frac{1}{${scenario.a}}` : `${1 / scenario.a}`,
        `${scenario.a + 1}`,
      ],
      steps: [
        `Podstawiamy do wzoru $$f(x) = a^x$$:`,
        `$$a^{${scenario.x}} = ${scenario.y}$$`,
        scenario.x === -1
          ? `$$a^{-1} = \\frac{1}{a} = ${scenario.y} \\implies a = ${scenario.a}$$`
          : `Szukamy liczby, która podniesiona do potęgi $$${scenario.x}$$ da $$${scenario.y}$$.`,
        `$$a = ${scenario.a}$$`,
      ],
    });
  }

  // --- 4. SYMETRIE WYKRESÓW ---
  generateSymmetryTransform() {
    // f(x) -> Symetria OX -> -f(x)
    // f(x) -> Symetria OY -> f(-x)
    // f(x) -> Symetria (0,0) -> -f(-x)

    const type = MathUtils.randomElement(["OX", "OY"]);
    const baseFunc = MathUtils.randomElement(["linear", "quadratic"]);

    let f_latex, g_latex, dist1, dist2;

    if (baseFunc === "linear") {
      const a = MathUtils.randomInt(2, 5);
      const b = MathUtils.randomInt(1, 5);
      f_latex = `${a}x + ${b}`;

      if (type === "OX") {
        // y = -f(x) = -ax - b
        g_latex = `-${a}x - ${b}`;
        dist1 = `${a}x - ${b}`; // Tylko b zmienione
        dist2 = `-${a}x + ${b}`; // Tylko a zmienione (jak OY)
      } else {
        // OY: y = f(-x) = -ax + b
        g_latex = `-${a}x + ${b}`;
        dist1 = `${a}x - ${b}`;
        dist2 = `-${a}x - ${b}`;
      }
    } else {
      // x^2 + c
      const c = MathUtils.randomInt(1, 5);
      f_latex = `x^2 + ${c}`;

      if (type === "OX") {
        // -x^2 - c
        g_latex = `-x^2 - ${c}`;
        dist1 = `x^2 - ${c}`;
        dist2 = `-x^2 + ${c}`;
      } else {
        // OY: (-x)^2 + c = x^2 + c (funkcja parzysta)
        g_latex = `x^2 + ${c}`;
        dist1 = `-x^2 + ${c}`;
        dist2 = `x^2 - ${c}`;
      }
    }

    return this.createResponse({
      question: `Wykres funkcji $$g$$ powstał przez przekształcenie wykresu funkcji $$f(x) = ${f_latex}$$ w symetrii względem osi $$${type}$$. Funkcja $$g$$ jest określona wzorem:`,
      latex: ``,
      image: null,
      variables: { type, baseFunc },
      correctAnswer: `g(x) = ${g_latex}`,
      distractors: [`g(x) = ${dist1}`, `g(x) = ${dist2}`, `g(x) = ${f_latex}`],
      steps: [
        type === "OX"
          ? `Symetria względem osi $$Ox$$ zmienia wzór funkcji na $$g(x) = -f(x)$$.`
          : `Symetria względem osi $$Oy$$ zmienia wzór funkcji na $$g(x) = f(-x)$$.`,
        type === "OX"
          ? `$$g(x) = -(${f_latex}) = ${g_latex}$$`
          : baseFunc === "quadratic"
            ? `$$g(x) = (-x)^2 + c = x^2 + c$$ (funkcja się nie zmienia, bo jest parzysta).`
            : `$$g(x) = ${f_latex.replace("x", "(-x)")} = ${g_latex}$$`,
      ],
    });
  }

  // --- 5. ODCZYTYWANIE WŁASNOŚCI Z WYKRESU (SVG) ---
  generateReadGraphProperties() {
    // Generujemy "łamaną" (Polyline).
    // Musi być funkcją (dla jednego X jeden Y).
    const points = [];
    let currX = -5;
    let currY = MathUtils.randomInt(-3, 3);

    points.push({ x: currX, y: currY });

    // Generujemy 3-4 segmenty
    for (let i = 0; i < 4; i++) {
      currX += MathUtils.randomInt(2, 4);
      if (currX > 6) currX = 6;
      currY = MathUtils.randomInt(-4, 4);
      points.push({ x: currX, y: currY });
      if (currX === 6) break;
    }

    // Co badamy?
    // 1. Zbiór wartości (Range)
    // 2. Miejsca zerowe (Zeros) - trudne do wylosowania idealnie
    // 3. Wartość największa/najmniejsza

    // Uprośćmy: Pytamy o Zbiór Wartości (najczęstsze).
    const ys = points.map((p) => p.y);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const range = `\\langle ${minY}, ${maxY} \\rangle`;

    return this.createResponse({
      question:
        "Na rysunku przedstawiono wykres funkcji $$y=f(x)$$. Zbiorem wartości tej funkcji jest:",
      latex: ``,
      image: this.generateSVG({ type: "polyline", points }),
      variables: { points, minY, maxY },
      correctAnswer: range,
      distractors: [
        `\\langle ${points[0].x}, ${points[points.length - 1].x} \\rangle`, // Dziedzina
        `\\langle ${minY - 1}, ${maxY + 1} \\rangle`,
        `\\langle ${minY}, ${maxY})`, // Zły nawias
      ],
      steps: [
        `Odczytujemy z osi $$Oy$$ najniższy i najwyższy punkt wykresu.`,
        `Najmniejsza wartość: $$y_{min} = ${minY}$$`,
        `Największa wartość: $$y_{max} = ${maxY}$$`,
        `Funkcja jest ciągła (połączone odcinki), więc zbiór wartości to $$${range}$$`,
      ],
    });
  }

  // --- 6. FUNKCJA OKREŚLONA PRZEDZIAŁAMI (KLAMROWA) ---
  generatePiecewiseFunction() {
    // f(x) = { formula1 dla x < cut, formula2 dla x >= cut }
    const cut = MathUtils.randomInt(-2, 2);

    // Wzory: np. x^2 i -x+2
    const f1_c = MathUtils.randomInt(1, 3);
    const f2_a = MathUtils.randomInt(-2, 2) || 1;
    const f2_b = MathUtils.randomInt(1, 5);

    // f1(x) = x^2 + c (dla x < cut)
    // f2(x) = ax + b (dla x >= cut)

    // Pytanie: f(val1) + f(val2)
    // val1 < cut, val2 >= cut
    const val1 = cut - MathUtils.randomInt(1, 3);
    const val2 = cut + MathUtils.randomInt(0, 3);

    const res1 = val1 * val1 + f1_c;
    const res2 = f2_a * val2 + f2_b;
    const total = res1 + res2;

    return this.createResponse({
      question: `Funkcja $$f$$ jest określona wzorem: $$f(x) = \\begin{cases} x^2 + ${f1_c} & \\text{dla } x < ${cut} \\\\ ${f2_a}x + ${f2_b} & \\text{dla } x \\ge ${cut} \\end{cases}$$. Wartość wyrażenia $$f(${val1}) + f(${val2})$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { cut, val1, val2, res1, res2 },
      correctAnswer: `${total}`,
      distractors: [`${res1 - res2}`, `${res1 * res2}`, `${res1 + res2 + 2}`],
      steps: [
        `Obliczamy $$f(${val1})$$. Ponieważ $$${val1} < ${cut}$$, korzystamy z pierwszego wzoru:`,
        `$$f(${val1}) = (${val1})^2 + ${f1_c} = ${val1 * val1} + ${f1_c} = ${res1}$$`,
        `Obliczamy $$f(${val2})$$. Ponieważ $$${val2} \\ge ${cut}$$, korzystamy z drugiego wzoru:`,
        `$$f(${val2}) = ${f2_a}\\cdot(${val2}) + ${f2_b} = ${f2_a * val2} + ${f2_b} = ${res2}$$`,
        `Suma: $$${res1} + ${res2} = ${total}$$`,
      ],
    });
  }

  // --- 7. ANALIZA WYKRESU LINIOWEGO (ZNAKI A i B) ---
  generateLinearGraphAnalysis() {
    // Generujemy a i b. Rysujemy prostą.
    // Pytanie: a > 0 i b < 0 itp.
    const a = MathUtils.randomElement([-2, -1, 1, 2]);
    const b = MathUtils.randomElement([-3, -2, 2, 3]); // unikamy 0 dla jasności

    const aSign = a > 0 ? ">" : "<";
    const bSign = b > 0 ? ">" : "<";

    const correct = `$$a ${aSign} 0$$ i $$b ${bSign} 0$$`;

    // Dystraktory: kombinacje znaków
    const wrong1 = `$$a ${aSign === ">" ? "<" : ">"} 0$$ i $$b ${bSign} 0$$`; // Złe a
    const wrong2 = `$$a ${aSign} 0$$ i $$b ${bSign === ">" ? "<" : ">"} 0$$`; // Złe b
    const wrong3 = `$$a ${aSign === ">" ? "<" : ">"} 0$$ i $$b ${bSign === ">" ? "<" : ">"} 0$$`; // Oba złe

    return this.createResponse({
      question:
        "Na rysunku przedstawiono wykres funkcji liniowej $$f(x) = ax + b$$. Prawdziwe jest zdanie:",
      latex: ``,
      image: this.generateSVG({ type: "linear_full", a, b }),
      variables: { a, b },
      correctAnswer: correct,
      distractors: [wrong1, wrong2, wrong3],
      steps: [
        `Współczynnik $$a$$ decyduje o monotoniczności. Funkcja jest ${a > 0 ? "rosnąca" : "malejąca"}, więc $$a ${aSign} 0$$.`,
        `Współczynnik $$b$$ to punkt przecięcia z osią $$Oy$$ ($$0, b$$). Punkt ten leży ${b > 0 ? "nad osią" : "pod osią"} $$Ox$$, więc $$b ${bSign} 0$$.`,
      ],
    });
  }

  // --- 8. MONOTONICZNOŚĆ Z PARAMETREM ---
  generateLinearMonotonicityParam() {
    // f(x) = (2m - 4)x + 1. Rosnąca gdy...
    // 2m - 4 > 0 => 2m > 4 => m > 2

    const coeffM = MathUtils.randomElement([2, 3, 4, -2, -3]);
    const constVal = MathUtils.randomInt(-6, 6);
    // Żeby wynik był ładny: constVal podzielne przez coeffM

    // Dostosowanie constVal do podzielności
    const validConst =
      MathUtils.randomInt(1, 4) *
      Math.abs(coeffM) *
      (Math.random() > 0.5 ? 1 : -1);

    const bracket = `${coeffM}m ${validConst >= 0 ? "+" : "-"} ${Math.abs(validConst)}`;
    const type = MathUtils.randomElement(["rosnąca", "malejąca"]);

    // Nierówność: a > 0 lub a < 0
    // coeffM * m + validConst >/< 0
    // m >/< -validConst / coeffM

    const boundary = -validConst / coeffM;

    // Ustalenie znaku w wyniku
    // Jeśli dzielimy przez ujemną, znak się odwraca!
    let finalSign;
    if (type === "rosnąca") {
      // > 0
      finalSign = coeffM > 0 ? ">" : "<";
    } else {
      // < 0
      finalSign = coeffM > 0 ? "<" : ">";
    }

    return this.createResponse({
      question: `Funkcja liniowa $$f(x) = (${bracket})x + 5$$ jest ${type} dla:`,
      latex: ``,
      image: null,
      variables: { coeffM, validConst, type, boundary },
      correctAnswer: `$$m ${finalSign} ${boundary}$$`,
      distractors: [
        `$$m ${finalSign === ">" ? "<" : ">"} ${boundary}$$`, // Zły znak nierówności
        `$$m = ${boundary}$$`,
        `$$m ${finalSign} ${-boundary}$$`,
      ],
      steps: [
        `Funkcja liniowa jest ${type}, gdy jej współczynnik kierunkowy $$a$$ jest ${type === "rosnąca" ? "dodatni ($$a>0$$)" : "ujemny ($$a<0$$)"}.`,
        `$$${bracket} ${type === "rosnąca" ? ">" : "<"} 0$$`,
        `$$${coeffM}m ${type === "rosnąca" ? ">" : "<"} ${-validConst}$$`,
        `Dzielimy przez $$${coeffM}$$ ${coeffM < 0 ? "(pamiętając o zmianie znaku!)" : ""}:`,
        `$$m ${finalSign} ${boundary}$$`,
      ],
    });
  }

  // --- HELPERY ---
  formatLinear(a, b) {
    const aS = this.fractionToLatex(a);
    const xPart = aS === "1" ? "x" : aS === "-1" ? "-x" : `${aS}x`;
    const bS =
      b === 0
        ? ""
        : b > 0
          ? `+${this.fractionToLatex(b)}`
          : this.fractionToLatex(b);
    return `${xPart}${bS}`;
  }

  fractionToLatex(val) {
    if (Number.isInteger(val)) return `${val}`;
    if (Math.abs(val - 0.5) < 0.001) return "\\frac{1}{2}";
    if (Math.abs(val + 0.5) < 0.001) return "-\\frac{1}{2}";
    return parseFloat(val.toFixed(2));
  }

  generateSVG(params) {
    const size = 300;
    const center = size / 2;
    const scale = 20;

    // Base coordinate system
    let svg = `<line x1="0" y1="${center}" x2="${size}" y2="${center}" stroke="#333" stroke-width="1" />
                   <line x1="${center}" y1="0" x2="${center}" y2="${size}" stroke="#333" stroke-width="1" />
                   <text x="${size - 15}" y="${center + 15}">x</text><text x="${center + 10}" y="15">y</text>`;

    if (params.type === "linear") {
      const size = 300;
      const center = size / 2;
      const scale = 20;
      // Rysujemy osie
      let svg = `<line x1="0" y1="${center}" x2="${size}" y2="${center}" stroke="#aaa" stroke-width="1" />`;
      svg += `<line x1="${center}" y1="0" x2="${center}" y2="${size}" stroke="#aaa" stroke-width="1" />`;

      // Rysujemy linię y = ax + b
      // Punkty krawędziowe: x = -7, x = 7
      const x1 = -8;
      const y1 = params.a * x1 + params.b;
      const x2 = 8;
      const y2 = params.a * x2 + params.b;

      const toSVG = (x, y) => ({
        x: center + x * scale,
        y: center - y * scale,
      });
      const p1 = toSVG(x1, y1);
      const p2 = toSVG(x2, y2);

      svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="blue" stroke-width="2" />`;

      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">${svg}</svg>`;
    } else if (params.type === "linear_full") {
      // Rysuje prostą przez cały ekran, widoczne przecięcia
      const a = params.a;
      const b = params.b;
      // Punkty przecięcia z ramką 300x300.
      // y = ax + b -> SVG Y = center - (a * (SVG X - center)/scale + b) * scale
      // Too complex logic for quick SVG. Just draw long line.
      const x1 = -10,
        y1 = a * x1 + b;
      const x2 = 10,
        y2 = a * x2 + b;
      const p1 = { x: center + x1 * scale, y: center - y1 * scale };
      const p2 = { x: center + x2 * scale, y: center - y2 * scale };
      svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="blue" stroke-width="2" />`;
    } else if (params.type === "polyline") {
      // Rysowanie łamanej
      let pts = "";
      params.points.forEach((p, i) => {
        const sx = center + p.x * scale;
        const sy = center - p.y * scale;
        pts += `${sx},${sy} `;
        svg += `<circle cx="${sx}" cy="${sy}" r="3" fill="blue" />`;
      });
      svg += `<polyline points="${pts}" fill="none" stroke="blue" stroke-width="2" />`;

      // Linie pomocnicze do range (opcja)
      const max = Math.max(...params.points.map((p) => p.y));
      const min = Math.min(...params.points.map((p) => p.y));
      // Można dodać przerywane linie do osi Y
    }

    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">${svg}</svg>`;
  }
}

module.exports = FunctionsGeneralGenerator;
