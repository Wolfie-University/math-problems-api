const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class GeometricOptimizationGenerator extends BaseGenerator {
  generateFencingProblem() {
    let rangeL;
    if (this.difficulty === "easy") {
      rangeL = [2, 4];
    } else if (this.difficulty === "hard") {
      rangeL = [10, 20];
    } else {
      rangeL = [5, 9];
    }

    const L = MathUtils.randomInt(rangeL[0], rangeL[1]) * 12;
    const x = L / 12;
    const y = (L - 6 * x) / 4;
    const maxArea = 3 * x * y;

    return this.createResponse({
      question: `W schronisku należy zbudować ogrodzenie wydzielające trzy identyczne prostokątne wybiegi o wspólnych ścianach wewnętrznych (przylegające do siebie dłuższym bokiem całego terenu). Do wykonania ogrodzenia zakupiono $$${L}$$ metrów siatki. Oblicz wymiary jednego małego wybiegu ($$x$$ i $$y$$), dla których suma pól tych wybiegów będzie największa.`,
      latex: `L = ${L}m`,
      image: this.generateGeometrySVG({ type: "fencing_3", x, y }),
      variables: { L, x, y, maxArea },
      correctAnswer: `x=${x} m, y=${y} m`,
      distractors: [
        `x=${x + 1} m, y=${y - 1} m`,
        `x=${y} m, y=${x} m`,
        `x=${L / 6} m, y=${L / 4} m`,
      ],
      steps: [
        `Równanie długości siatki: $$6x + 4y = ${L}$$.`,
        `$$y = ${L / 4} - 1.5x$$.`,
        `Pole całkowite: $$P = 3xy = 3x(${L / 4} - 1.5x) = ${(3 * L) / 4}x - 4.5x^2$$.`,
        `Wierzchołek $$p = \\frac{-b}{2a} = ${x}$$.`,
        `$$y = ${y}$$.`,
      ],
    });
  }

  generateCuboidProblem() {
    let rangeS;
    if (this.difficulty === "easy") {
      rangeS = [2, 4];
    } else if (this.difficulty === "hard") {
      rangeS = [8, 12];
    } else {
      rangeS = [4, 8];
    }

    const S = MathUtils.randomInt(rangeS[0], rangeS[1]) * 12;
    const a = S / 12;
    const h = S / 4 - 2 * a;
    const Pc = 2 * a * a + 4 * a * h;

    return this.createResponse({
      question: `Suma długości wszystkich krawędzi prostopadłościanu o podstawie kwadratowej jest równa $$${S}$$. Oblicz długość krawędzi podstawy $$x$$ tego prostopadłościanu, dla której jego pole powierzchni całkowitej jest największe.`,
      latex: `\\text{Suma} = ${S}`,
      image: this.generateGeometrySVG({ type: "cuboid_opt", a, h }),
      variables: { S, a, h, Pc },
      correctAnswer: `x = ${a}`,
      distractors: [`x = ${a + 1}`, `x = ${a / 2}`, `x = ${S / 12 + 1}`],
      steps: [
        `$$8x + 4h = ${S} \\implies h = ${S / 4} - 2x$$.`,
        `$$P(x) = 2x^2 + 4xh = -6x^2 + ${S}x$$.`,
        `Wierzchołek $$p = ${a}$$.`,
      ],
    });
  }

  generateTrapezoidProblem() {
    let rangeA;
    if (this.difficulty === "easy") {
      rangeA = [2, 4];
    } else if (this.difficulty === "hard") {
      rangeA = [8, 12];
    } else {
      rangeA = [4, 8];
    }

    const a = MathUtils.randomInt(rangeA[0], rangeA[1]) * 2;
    const S = a + MathUtils.randomInt(2, 6) * 2;
    const h_opt = (a + S) / 2;
    const b_opt = S - h_opt;

    return this.createResponse({
      question: `Okno ma kształt trapezu równoramiennego. Dłuższa podstawa ma stałą długość $$${a}$$ dm. Suma długości krótszej podstawy i wysokości tego trapezu wynosi $$${S}$$ dm. Oblicz jaką długość powinna mieć wysokość $$h$$ tego okna, aby jego powierzchnia była największa.`,
      latex: `a=${a}, b+h=${S}`,
      image: this.generateGeometrySVG({
        type: "trapezoid_opt",
        a,
        b: b_opt,
        h: h_opt,
      }),
      variables: { a, S, h_opt, b_opt },
      correctAnswer: `h = ${h_opt} dm`,
      distractors: [
        `h = ${h_opt - 2} dm`,
        `h = ${b_opt} dm`,
        `h = ${S / 2} dm`,
      ],
      steps: [
        `$$b + h = ${S} \\implies b = ${S} - h$$.`,
        `$$P(h) = \\frac{${a} + b}{2}h = -0.5h^2 + ${(a + S) / 2}h$$.`,
        `Wierzchołek $$p = ${h_opt}$$.`,
      ],
    });
  }

  generateGeometrySVG(params) {
    const size = 300;
    const cx = 150;
    const cy = 200;

    if (params.type === "fencing_3") {
      const w = 200;
      const h = 100;
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
            <rect x="50" y="100" width="${w}" height="${h}" stroke="black" fill="none" stroke-width="2"/>
            <line x1="${50 + w / 3}" y1="100" x2="${50 + w / 3}" y2="${100 + h}" stroke="black" stroke-width="2"/>
            <line x1="${50 + (2 * w) / 3}" y1="100" x2="${50 + (2 * w) / 3}" y2="${100 + h}" stroke="black" stroke-width="2"/>
            <text x="${50 + w / 2}" y="220" font-size="14">3x</text>
            <text x="30" y="${100 + h / 2}" font-size="14">y</text>
        </svg>`;
    }

    if (params.type === "cuboid_opt") {
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
            <rect x="100" y="150" width="100" height="100" stroke="black" fill="none" stroke-width="2"/>
            <line x1="100" y1="150" x2="150" y2="100" stroke="black" stroke-width="2"/>
            <line x1="200" y1="150" x2="250" y2="100" stroke="black" stroke-width="2"/>
            <line x1="200" y1="250" x2="250" y2="200" stroke="black" stroke-width="2"/>
            <rect x="150" y="100" width="100" height="100" stroke="black" fill="none" stroke-width="2" stroke-dasharray="4"/>
            <text x="140" y="270" font-size="14">x</text>
            <text x="210" y="200" font-size="14">h</text>
        </svg>`;
    }

    if (params.type === "trapezoid_opt") {
      const scale = 10;
      const w1 = params.a * scale;
      const w2 = params.b * scale;
      const h = params.h * scale;
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
            <polygon points="${cx - w2 / 2},${cy - h} ${cx + w2 / 2},${cy - h} ${cx + w1 / 2},${cy} ${cx - w1 / 2},${cy}" stroke="black" fill="none" stroke-width="2"/>
            <line x1="${cx - w2 / 2}" y1="${cy - h}" x2="${cx - w2 / 2}" y2="${cy}" stroke="blue" stroke-dasharray="4"/>
            <text x="${cx}" y="${cy + 20}" font-size="14">a=${params.a}</text>
            <text x="${cx}" y="${cy - h - 10}" font-size="14">b=${params.b}</text>
            <text x="${cx - w2 / 2 - 20}" y="${cy - h / 2}" font-size="14" fill="blue">h</text>
        </svg>`;
    }
    return "";
  }
}

module.exports = GeometricOptimizationGenerator;
