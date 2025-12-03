const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

class AnalyticGenerator extends BaseGenerator {
  generate() {
    const variants = [
      "midpoint_length", // Środek i długość odcinka
      "missing_endpoint", // NOWOŚĆ: Znajdź drugi koniec mając środek
      "line_equation_2p", // Równanie prostej przez 2 punkty
      "line_parallel", // Prosta równoległa przez punkt
      "line_perpendicular", // Prosta prostopadła przez punkt
      "line_parameter_m", // NOWOŚĆ: Parametr m (równoległe/prostopadłe)
      "intersection_point", // NOWOŚĆ: Punkt przecięcia prostych
      "perpendicular_bisector", // Symetralna odcinka
      "circle_equation", // NOWOŚĆ: Równanie okręgu
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      case "missing_endpoint":
        return this.generateMissingEndpoint();
      case "line_parameter_m":
        return this.generateParameterMProblem();
      case "intersection_point":
        return this.generateIntersectionProblem();
      case "circle_equation":
        return this.generateCircleProblem();

      case "line_equation_2p":
        return this.generateLineThroughTwoPoints();
      case "line_parallel":
        return this.generateParallelLine();
      case "line_perpendicular":
        return this.generatePerpendicularLine();
      case "perpendicular_bisector":
        return this.generateBisector();
      case "midpoint_length":
      default:
        return this.generateMidpointProblem();
    }
  }

  // --- NOWOŚĆ 1: BRAKUJĄCY KONIEC ODCINKA ---
  generateMissingEndpoint() {
    // Reverse Engineering: Losujemy A i S, wyliczamy B
    const A = { x: MathUtils.randomInt(-6, 6), y: MathUtils.randomInt(-6, 6) };
    const S = { x: MathUtils.randomInt(-4, 4), y: MathUtils.randomInt(-4, 4) };

    // Wzór na środek: xs = (xa + xb)/2  =>  xb = 2*xs - xa
    const B = {
      x: 2 * S.x - A.x,
      y: 2 * S.y - A.y,
    };

    return this.createResponse({
      question:
        "Punkt $$S=(${S.x}, ${S.y})$$ jest środkiem odcinka $$AB$$, gdzie $$A=(${A.x}, ${A.y})$$. Oblicz współrzędne punktu $$B$$.",
      latex: `S=(${S.x}, ${S.y}), A=(${A.x}, ${A.y})`,
      image: this.generateSVG({ type: "segment", A, B, S }), // Rysuje odcinek z zaznaczonym środkiem
      variables: { A, B, S },
      correctAnswer: `B=(${B.x}, ${B.y})`,
      distractors: [
        `B=(${S.x - A.x}, ${S.y - A.y})`, // Zwykła różnica wektorów (błąd logiczny)
        `B=(\\frac{${A.x}+${S.x}}{2}, \\frac{${A.y}+${S.y}}{2})`, // Liczenie środka z A i S
        `B=(${A.x}, ${A.y})`,
      ],
      steps: [
        `Ze wzoru na środek odcinka: $$S = (\\frac{x_A+x_B}{2}, \\frac{y_A+y_B}{2})$$`,
        `Tworzymy równania dla obu współrzędnych:`,
        `$$${S.x} = \\frac{${A.x} + x_B}{2} \\quad / \\cdot 2 \\implies ${2 * S.x} = ${A.x} + x_B \\implies x_B = ${B.x}$$`,
        `$$${S.y} = \\frac{${A.y} + y_B}{2} \\quad / \\cdot 2 \\implies ${2 * S.y} = ${A.y} + y_B \\implies y_B = ${B.y}$$`,
        `Odp: $$B=(${B.x}, ${B.y})$$`,
      ],
    });
  }

  // --- NOWOŚĆ 2: PARAMETR M (RÓWNOLEGŁE/PROSTOPADŁE) ---
  generateParameterMProblem() {
    // Typ: Proste y = (3m - 2)x + 1 i y = 4x - 2 są równoległe. Oblicz m.
    const mode = MathUtils.randomElement(["parallel", "perpendicular"]);

    let m, a1_coeff, a1_const, a2;

    if (mode === "parallel") {
      // (a1_coeff * m + a1_const) = a2
      // Żeby m było całkowite/ładne: a2 - a1_const musi być podzielne przez a1_coeff
      m = MathUtils.randomInt(-3, 3);
      a1_coeff = MathUtils.randomElement([2, 3, 4]); // np. 2m
      a1_const = MathUtils.randomInt(-5, 5); // np. 2m - 1
      a2 = a1_coeff * m + a1_const;
    } else {
      // (a1_coeff * m + a1_const) * a2 = -1
      // To trudniejsze. Ustalmy a2 np. 1/2, wtedy nawias musi być -2.
      m = MathUtils.randomInt(-3, 3);
      a1_coeff = MathUtils.randomElement([1, 2]);
      const bracketValue = MathUtils.randomElement([-2, -1, 1, 2]); // Wartość nawiasu
      a1_const = bracketValue - a1_coeff * m;

      // a2 = -1 / bracketValue
      a2 = -1 / bracketValue;
    }

    const a1_term = `${a1_coeff}m ${a1_const >= 0 ? "+" : "-"} ${Math.abs(a1_const)}`;
    const eq1 = `y = (${a1_term})x + ${MathUtils.randomInt(1, 9)}`;
    const eq2 = `y = ${this.fractionToLatex(a2)}x - ${MathUtils.randomInt(1, 9)}`;

    return this.createResponse({
      question: `Proste $$l$$ i $$k$$ są ${mode === "parallel" ? "równoległe" : "prostopadłe"}. Oblicz parametr $$m$$.`,
      latex: `l: ${eq1}, \\quad k: ${eq2}`,
      image: null, // Tu nie trzeba rysunku, czysta algebra
      variables: { m, a1_coeff, a1_const, a2, mode },
      correctAnswer: `m = ${m}`,
      distractors: [`m = ${m + 1}`, `m = ${-m}`, `m = 0`],
      steps: [
        `Współczynniki kierunkowe prostych to: $$a_1 = ${a1_term}$$ oraz $$a_2 = ${this.fractionToLatex(a2)}$$`,
        mode === "parallel"
          ? `Warunek równoległości: $$a_1 = a_2$$`
          : `Warunek prostopadłości: $$a_1 \\cdot a_2 = -1$$`,
        mode === "parallel"
          ? `$$${a1_coeff}m ${a1_const >= 0 ? "+" : "-"} ${Math.abs(a1_const)} = ${this.fractionToLatex(a2)}$$`
          : `$$(${a1_term}) \\cdot (${this.fractionToLatex(a2)}) = -1$$`,
        `Rozwiązujemy równanie:`,
        mode === "parallel"
          ? `$$${a1_coeff}m = ${a2 - a1_const} \\implies m = ${m}$$`
          : `$$${a1_term} = ${1 / -a2} \\implies ${a1_coeff}m = ${1 / -a2 - a1_const} \\implies m = ${m}$$`,
        `Odp: $$m = ${m}$$`,
      ],
    });
  }

  // --- NOWOŚĆ 3: PUNKT PRZECIĘCIA PROSTYCH ---
  generateIntersectionProblem() {
    // Reverse Engineering: Losujemy punkt przecięcia P(intX, intY) (całkowity!)
    const intX = MathUtils.randomInt(-4, 4);
    const intY = MathUtils.randomInt(-4, 4);

    // Losujemy a1 i a2 (małe całkowite, żeby proste były ładne)
    const a1 = MathUtils.randomInt(-2, 2) || 1;
    let a2 = MathUtils.randomInt(-2, 2) || -1;
    while (a1 === a2) a2 += 1; // Muszą być różne

    // Wyliczamy b1 i b2 tak, żeby obie proste przechodziły przez P
    // y = ax + b => b = y - ax
    const b1 = intY - a1 * intX;
    const b2 = intY - a2 * intX;

    const eq1 = this.formatLineEquation(a1, b1);
    const eq2 = this.formatLineEquation(a2, b2);

    return this.createResponse({
      question: "Wyznacz punkt przecięcia dwóch prostych układu równań:",
      latex: `\\begin{cases} y = ${eq1} \\\\ y = ${eq2} \\end{cases}`,
      image: this.generateSVG({
        type: "lines_intersection",
        a1,
        b1,
        a2,
        b2,
        P: { x: intX, y: intY },
      }),
      variables: { intX, intY, a1, b1, a2, b2 },
      correctAnswer: `P=(${intX}, ${intY})`,
      distractors: [
        `P=(${intY}, ${intX})`, // Zamiana
        `P=(${-intX}, ${intY})`, // Zły znak
        `P=(0, ${b1})`, // Punkt przecięcia z osią Y
      ],
      steps: [
        `Metoda podstawiania: przyrównujemy prawe strony równań.`,
        `$$${this.formatLineEquation(a1, b1)} = ${this.formatLineEquation(a2, b2)}$$`,
        `Przenosimy x na jedną stronę, liczby na drugą:`,
        `$$${a1}x - (${a2}x) = ${b2} - (${b1})$$`,
        `$$${a1 - a2}x = ${b2 - b1}$$`,
        `$$x = ${intX}$$`,
        `Podstawiamy x do pierwszego równania:`,
        `$$y = ${a1}\\cdot(${intX}) + (${b1}) = ${intY}$$`,
        `Punkt przecięcia: $$P=(${intX}, ${intY})$$`,
      ],
    });
  }

  // --- NOWOŚĆ 4: RÓWNANIE OKRĘGU ---
  generateCircleProblem() {
    const S = { x: MathUtils.randomInt(-5, 5), y: MathUtils.randomInt(-5, 5) };
    const r = MathUtils.randomInt(1, 8);

    // Formatowanie nawiasów (x-a)^2. Jeśli a ujemne to (x+a)^2. Jeśli 0 to x^2.
    const formatBracket = (variable, val) => {
      if (val === 0) return `${variable}^2`;
      return val > 0
        ? `(${variable} - ${val})^2`
        : `(${variable} + ${Math.abs(val)})^2`;
    };

    const eq = `${formatBracket("x", S.x)} + ${formatBracket("y", S.y)} = ${r * r}`;

    return this.createResponse({
      question: "Wyznacz środek i promień okręgu o równaniu:",
      latex: eq,
      image: this.generateSVG({ type: "circle", S, r }),
      variables: { S, r },
      correctAnswer: `S=(${S.x}, ${S.y}), r=${r}`,
      distractors: [
        `S=(${-S.x}, ${-S.y}), r=${r}`, // Przeciwne znaki (najczęstszy błąd!)
        `S=(${S.x}, ${S.y}), r=${r * r}`, // Promień jako r^2
        `S=(${S.y}, ${S.x}), r=${r}`, // Zamiana współrzędnych
      ],
      steps: [
        `Równanie kanoniczne okręgu to: $$(x-a)^2 + (y-b)^2 = r^2$$`,
        `gdzie $$S=(a,b)$$ to środek, a $$r$$ to promień.`,
        `Porównujemy z podanym równaniem: $$${eq}$$`,
        `Dla x: $$-a = ${-S.x} \\implies a = ${S.x}$$`,
        `Dla y: $$-b = ${-S.y} \\implies b = ${S.y}$$`,
        `Dla r: $$r^2 = ${r * r} \\implies r = \\sqrt{${r * r}} = ${r}$$`,
        `Odp: $$S=(${S.x}, ${S.y}), r=${r}$$`,
      ],
    });
  }

  // --- STARE WARIANTY (BEZ ZMIAN W LOGICE, ALE ZACHOWANE W KLASIE) ---
  generateMidpointProblem() {
    const A = { x: MathUtils.randomInt(-6, 6), y: MathUtils.randomInt(-6, 6) };
    const S = { x: MathUtils.randomInt(-4, 4), y: MathUtils.randomInt(-4, 4) };
    const B = { x: 2 * S.x - A.x, y: 2 * S.y - A.y };
    const lenSq = Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2);
    const lenStr = Number.isInteger(Math.sqrt(lenSq))
      ? `${Math.sqrt(lenSq)}`
      : `\\sqrt{${lenSq}}`;
    return this.createResponse({
      question:
        "Dane są punkty $$A$$ i $$B$$. Oblicz środek i długość odcinka.",
      latex: `A=(${A.x}, ${A.y}), B=(${B.x}, ${B.y})`,
      image: this.generateSVG({ type: "segment", A, B, S }),
      variables: { A, B, S },
      correctAnswer: `S=(${S.x}, ${S.y}), |AB|=${lenStr}`,
      distractors: [
        `S=(${S.x}, ${S.y}), |AB|=${lenSq}`,
        `S=(${B.x - A.x}, ${B.y - A.y}), |AB|=${lenStr}`,
        `S=(${S.y}, ${S.x}), |AB|=${lenStr}`,
      ],
      steps: [
        `$$S=(\\frac{${A.x}+${B.x}}{2}, \\frac{${A.y}+${B.y}}{2})=(${S.x}, ${S.y})$$`,
        `$$|AB|=\\sqrt{(${B.x}-${A.x})^2+(${B.y}-${A.y})^2}=${lenStr}$$`,
      ],
    });
  }

  generateLineThroughTwoPoints() {
    const { A, B, a, b } = this.generateNiceLinePoints();
    const eq = this.formatLineEquation(a, b);
    return this.createResponse({
      question: "Równanie prostej przez punkty:",
      latex: `A=(${A.x}, ${A.y}), B=(${B.x}, ${B.y})`,
      image: this.generateSVG({ type: "line", A, B }),
      variables: { A, B, a, b },
      correctAnswer: `y = ${eq}`,
      distractors: [
        `y = ${this.formatLineEquation(-a, b)}`,
        `y = ${this.formatLineEquation(a, -b)}`,
        `y = ${this.formatLineEquation(b, a)}`,
      ],
      steps: [
        `$$a = \\frac{${B.y}-${A.y}}{${B.x}-${A.x}} = ${this.fractionToLatex(a)}$$`,
        `$$b = ${A.y} - ${a}\\cdot${A.x} = ${this.fractionToLatex(b)}$$`,
        `$$y = ${eq}$$`,
      ],
    });
  }

  generateParallelLine() {
    return this.generateRelativeLine("parallel");
  }
  generatePerpendicularLine() {
    return this.generateRelativeLine("perpendicular");
  }

  generateRelativeLine(mode) {
    let a1_num =
      mode === "parallel"
        ? MathUtils.randomInt(-3, 3) || 1
        : MathUtils.randomElement([-2, -1, 1, 2, 3]);
    let a1_den = mode === "parallel" ? 1 : MathUtils.randomElement([1, 2, 3]);
    const a1 = a1_num / a1_den;
    const b1 = MathUtils.randomInt(-5, 5);
    const a2 = mode === "parallel" ? a1 : -1 / a1;
    const P = {
      x:
        MathUtils.randomInt(-2, 2) *
        (mode === "parallel" ? 1 : Math.abs(a1_num)),
      y: MathUtils.randomInt(-5, 5),
    };
    const b2 = P.y - a2 * P.x;
    const eq1 = this.formatLineEquation(a1, b1);
    const eq2 = this.formatLineEquation(a2, b2);
    return this.createResponse({
      question: `Prosta $$l$$ przez $$P$$ i ${mode === "parallel" ? "równoległa" : "prostopadła"} do $$k$$:`,
      latex: `k: y=${eq1}, P=(${P.x}, ${P.y})`,
      image: this.generateSVG({ type: "lines_relative", a1, b1, a2, b2, P }),
      variables: { a1, b1, a2, b2, P },
      correctAnswer: `y = ${eq2}`,
      distractors: [
        `y = ${this.formatLineEquation(a1, b2)}`,
        `y = ${this.formatLineEquation(-a2, b2)}`,
        `y = ${this.formatLineEquation(1 / a2, b2)}`,
      ],
      steps: [
        `$$a_1 = ${this.fractionToLatex(a1)}$$`,
        `$$a_2 = ${this.fractionToLatex(a2)}$$`,
        `$$b_2 = ${P.y} - (${a2})\\cdot${P.x} = ${b2}$$`,
        `$$y = ${eq2}$$`,
      ],
    });
  }

  generateBisector() {
    const A = { x: MathUtils.randomInt(-6, 2), y: MathUtils.randomInt(-6, 2) };
    const B = {
      x: A.x + 2 * MathUtils.randomElement([1, 2, 3]),
      y:
        A.y +
        2 *
          MathUtils.randomElement([1, 2, 3]) *
          MathUtils.randomElement([-1, 1]),
    };
    const S = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
    const a_sym = -1 / ((B.y - A.y) / (B.x - A.x));
    const b_sym = S.y - a_sym * S.x;
    return this.createResponse({
      question: "Symetralna odcinka AB:",
      latex: `A=(${A.x}, ${A.y}), B=(${B.x}, ${B.y})`,
      image: this.generateSVG({ type: "bisector", A, B, S, a_sym, b_sym }),
      variables: { A, B },
      correctAnswer: `y = ${this.formatLineEquation(a_sym, b_sym)}`,
      distractors: [
        `y = ${this.formatLineEquation(-a_sym, b_sym)}`,
        `y = ${this.formatLineEquation(a_sym, -b_sym)}`,
        `y=x`,
      ],
      steps: [
        `Środek $$S=(${S.x}, ${S.y})$$`,
        `$$a_{sym} = ${this.fractionToLatex(a_sym)}$$`,
        `$$b = ${this.fractionToLatex(b_sym)}$$`,
      ],
    });
  }

  // --- HELPERY I SVG ---

  generateNiceLinePoints() {
    const x1 = MathUtils.randomInt(-5, 5),
      y1 = MathUtils.randomInt(-5, 5);
    const dx = MathUtils.randomElement([1, 2, 3]),
      dy = MathUtils.randomInt(-4, 4);
    return {
      A: { x: x1, y: y1 },
      B: { x: x1 + dx, y: y1 + dy },
      a: dy / dx,
      b: y1 - (dy / dx) * x1,
    };
  }

  formatLineEquation(a, b) {
    const aStr = this.fractionToLatex(a);
    if (a === 0) return this.fractionToLatex(b);
    let xPart = aStr === "1" ? "x" : aStr === "-1" ? "-x" : `${aStr}x`;
    if (b === 0) return xPart;
    return `${xPart} ${b > 0 ? "+" : "-"} ${this.fractionToLatex(Math.abs(b))}`;
  }

  fractionToLatex(val) {
    if (Number.isInteger(val)) return `${val}`;
    for (let d = 2; d <= 20; d++) {
      let n = Math.round(val * d);
      if (Math.abs(val - n / d) < 0.0001) {
        const gcd = (a, b) => (b ? gcd(b, a % b) : a);
        const common = gcd(Math.abs(n), d);
        return `${val < 0 ? "-" : ""}\\frac{${Math.abs(n) / common}}{${d / common}}`;
      }
    }
    return parseFloat(val.toFixed(2));
  }

  generateSVG(params) {
    const size = 300;
    const center = size / 2;
    const scale = 20;
    const toSVG = (p) => ({ x: center + p.x * scale, y: center - p.y * scale });

    let content = "";
    const drawLine = (a, b, color, dash) => {
      const x1 = -10,
        x2 = 10;
      const p1 = toSVG({ x: x1, y: a * x1 + b }),
        p2 = toSVG({ x: x2, y: a * x2 + b });
      return `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${color}" stroke-width="2" ${dash ? 'stroke-dasharray="4"' : ""}/>`;
    };

    if (params.type === "segment" || params.type === "bisector") {
      const A = toSVG(params.A),
        B = toSVG(params.B);
      content += `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" stroke="black" stroke-width="2" />`;
      content += `<circle cx="${A.x}" cy="${A.y}" r="3" fill="blue" /><text x="${A.x + 5}" y="${A.y - 5}" font-size="10">A</text>`;
      content += `<circle cx="${B.x}" cy="${B.y}" r="3" fill="blue" /><text x="${B.x + 5}" y="${B.y - 5}" font-size="10">B</text>`;
      if (params.S) {
        const S = toSVG(params.S);
        content += `<circle cx="${S.x}" cy="${S.y}" r="3" fill="red" /><text x="${S.x + 5}" y="${S.y - 10}" font-size="10" fill="red">S</text>`;
      }
      if (params.type === "bisector")
        content += drawLine(params.a_sym, params.b_sym, "green", true);
    }

    if (
      params.type === "line" ||
      params.type === "lines_relative" ||
      params.type === "lines_intersection"
    ) {
      if (params.a !== undefined)
        content += drawLine(params.a, params.b, "blue");
      if (params.a1 !== undefined)
        content += drawLine(params.a1, params.b1, "black");
      if (params.a2 !== undefined)
        content += drawLine(params.a2, params.b2, "blue", true);
      if (params.P) {
        const P = toSVG(params.P);
        content += `<circle cx="${P.x}" cy="${P.y}" r="4" fill="red" /><text x="${P.x + 5}" y="${P.y - 5}" font-size="12">P</text>`;
      }
    }

    if (params.type === "circle") {
      const S = toSVG(params.S);
      content += `<circle cx="${S.x}" cy="${S.y}" r="${params.r * scale}" stroke="blue" stroke-width="2" fill="none" />`;
      content += `<circle cx="${S.x}" cy="${S.y}" r="3" fill="red" /><text x="${S.x + 5}" y="${S.y - 5}" font-size="12">S</text>`;
    }

    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff"><line x1="0" y1="${center}" x2="${size}" y2="${center}" stroke="#aaa" stroke-width="1" /><line x1="${center}" y1="0" x2="${center}" y2="${size}" stroke="#aaa" stroke-width="1" />${content}</svg>`;
  }
}

module.exports = AnalyticGenerator;
