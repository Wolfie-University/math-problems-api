const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class ChartsGenerator extends BaseGenerator {
  generateChartMeanProblem() {
    let data = [],
      totalSum = 0,
      totalCount = 0,
      attempts = 0;
    do {
      data = [];
      totalSum = 0;
      totalCount = 0;
      for (let g = 1; g <= 6; g++) {
        const c = MathUtils.randomInt(0, 8);
        if (c > 0) {
          data.push({ grade: g, count: c });
          totalSum += g * c;
          totalCount += c;
        }
      }
      attempts++;
    } while (
      (totalCount === 0 || ((totalSum / totalCount) * 10) % 5 !== 0) &&
      attempts < 50
    );

    const mean = totalSum / totalCount;

    return this.createResponse({
      question:
        "Diagram przedstawia wyniki sprawdzianu. Średnia ocen jest równa:",
      latex: ``,
      image: this.generateSVG({ type: "bar_chart", data }),
      variables: { data },
      correctAnswer: `${mean}`,
      distractors: [
        `${(mean + 0.5).toFixed(2)}`,
        `${(mean - 0.2).toFixed(2)}`,
        `${Math.floor(mean)}`,
      ],
      steps: [
        `Suma ocen: $$${totalSum}$$`,
        `Liczba uczniów: $$${totalCount}$$`,
        `Średnia: $$${mean}$$`,
      ],
    });
  }

  generateFrequencyTableMean() {
    const values = [1, 2, 3, 4];
    const counts = [];
    let sumVals = 0,
      totalCount = 0,
      attempts = 0;

    do {
      counts.length = 0;
      sumVals = 0;
      totalCount = 0;
      for (let v of values) {
        const c = MathUtils.randomInt(1, 5);
        counts.push(c);
        sumVals += v * c;
        totalCount += c;
      }
      attempts++;
    } while (
      (totalCount === 0 || ((sumVals / totalCount) * 10) % 5 !== 0) &&
      attempts < 50
    );

    const mean = sumVals / totalCount;
    const tableLatex = `
    \\begin{array}{|c|c|c|c|c|} \\hline
    \\text{Wartość} & 1 & 2 & 3 & 4 \\\\ \\hline
    \\text{Liczebność} & ${counts[0]} & ${counts[1]} & ${counts[2]} & ${counts[3]} \\\\ \\hline
    \\end{array}`;

    return this.createResponse({
      question:
        "Tabela przedstawia rozkład pewnych danych. Średnia arytmetyczna tych danych jest równa:",
      latex: tableLatex,
      image: null,
      variables: { counts, mean },
      correctAnswer: `${mean}`,
      distractors: [
        `${(mean + 0.5).toFixed(1)}`,
        `${(mean - 0.2).toFixed(1)}`,
        `${Math.floor(mean)}`,
      ],
      steps: [`Średnia ważona z tabeli: $$${mean}$$`],
    });
  }

  generateSVG(params) {
    if (params.type === "bar_chart") {
      const size = 300;
      const margin = 40;
      const maxCount = Math.max(...params.data.map((d) => d.count));
      const barW = (size - 2 * margin) / 7;
      const scaleY = (size - 2 * margin) / (maxCount + 1);
      let svg = `<line x1="${margin}" y1="${size - margin}" x2="${size - margin}" y2="${size - margin}" stroke="black" stroke-width="2" /><line x1="${margin}" y1="${margin}" x2="${margin}" y2="${size - margin}" stroke="black" stroke-width="2" />`;
      params.data.forEach((d) => {
        const x = margin + d.grade * barW;
        const h = d.count * scaleY;
        svg += `<rect x="${x - barW / 2 + 5}" y="${size - margin - h}" width="${barW - 10}" height="${h}" fill="#4a90e2" stroke="black" /><text x="${x}" y="${size - margin - h - 5}" text-anchor="middle" font-size="12">${d.count}</text><text x="${x}" y="${size - margin + 20}" text-anchor="middle" font-size="14">${d.grade}</text>`;
      });
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">${svg}</svg>`;
    }
    return "";
  }
}

module.exports = ChartsGenerator;
