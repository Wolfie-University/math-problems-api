const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class EconomicOptimizationGenerator extends BaseGenerator {
  generateRevenueProblem() {
    const scenarios = [
      {
        id: "electronics",
        subject: "słuchawek bezprzewodowych",
        unit: "zł",
        ranges: {
          easy: { price: [50, 100], sales: [20, 50] },
          medium: { price: [80, 150], sales: [40, 100] },
          hard: { price: [200, 400], sales: [100, 300] },
        },
        template: (price, sales, stepP, stepS, subject, unit) =>
          `Sklep z elektroniką sprzedaje dziennie ${sales} sztuk ${subject} w cenie ${price} ${unit} za sztukę. ` +
          `Badania rynku pokazały, że każda obniżka ceny o ${stepP} ${unit} powoduje wzrost sprzedaży o ${stepS} sztuk. ` +
          `Jaką cenę powinien ustalić sprzedawca, aby jego dzienny przychód był największy?`,
      },
      {
        id: "hotel",
        subject: "pokoi",
        unit: "zł",
        ranges: {
          easy: { price: [100, 200], sales: [10, 30] },
          medium: { price: [180, 300], sales: [20, 50] },
          hard: { price: [300, 600], sales: [50, 100] },
        },
        template: (price, sales, stepP, stepS, subject, unit) =>
          `Właściciel hotelu zauważył, że przy cenie wynajmu wynoszącej ${price} ${unit} za dobę, zajętych jest ${sales} ${subject}. ` +
          `Każde obniżenie ceny o ${stepP} ${unit} sprawia, że wynajmowanych jest o ${stepS} pokoi więcej. ` +
          `Oblicz, przy jakiej cenie za dobę przychód hotelu będzie maksymalny.`,
      },
      {
        id: "tutor",
        subject: "kurs online",
        unit: "zł",
        ranges: {
          easy: { price: [20, 50], sales: [50, 100] },
          medium: { price: [40, 90], sales: [100, 300] },
          hard: { price: [100, 200], sales: [200, 500] },
        },
        template: (price, sales, stepP, stepS, subject, unit) =>
          `Platforma edukacyjna oferuje ${subject} w cenie ${price} ${unit}. Obecnie z kursu korzysta ${sales} uczniów miesięcznie. ` +
          `Analiza wykazała, że każda obniżka ceny o ${stepP} ${unit} przyciągnie ${stepS} nowych uczniów. ` +
          `O ile ${unit} należy obniżyć cenę, aby miesięczny wpływ ze sprzedaży był największy?`,
      },
    ];

    const scenario = MathUtils.randomElement(scenarios);
    const diffRanges =
      scenario.ranges[this.difficulty] || scenario.ranges.medium;

    const stepPrice = 1;
    const stepSales =
      this.difficulty === "hard"
        ? MathUtils.randomInt(5, 15)
        : MathUtils.randomInt(2, 5);

    let startPrice, startSales, p;
    let attempts = 0;

    do {
      startPrice = MathUtils.randomInt(
        diffRanges.price[0],
        diffRanges.price[1],
      );
      startSales = MathUtils.randomInt(
        diffRanges.sales[0],
        diffRanges.sales[1],
      );

      const b = startPrice * stepSales - startSales;
      const doubleA = 2 * -stepSales;
      p = -b / doubleA;
      attempts++;

      if (this.difficulty !== "hard" && !Number.isInteger(p)) p = -1; // force retry
      if (this.difficulty === "hard" && !Number.isInteger(p * 2)) p = -1; // force retry if not .0 or .5
    } while ((p <= 0 || p >= startPrice) && attempts < 100);

    if (p <= 0) {
      // fallback
      startPrice = 50;
      startSales = 100;
      p = (50 * stepSales - 100) / (2 * stepSales);
    }

    const x = p;
    const newPrice = startPrice - x;
    const newSales = startSales + stepSales * x;
    const maxRevenue = newPrice * newSales;

    const xStr = Number.isInteger(x) ? `${x}` : x.toFixed(1);
    const newPriceStr = Number.isInteger(newPrice)
      ? `${newPrice}`
      : newPrice.toFixed(1);

    const questionText = scenario.template(
      startPrice,
      startSales,
      stepPrice,
      stepSales,
      scenario.subject,
      scenario.unit,
    );

    return this.createResponse({
      question: questionText,
      latex: `P(x) = (${startPrice} - x)(${startSales} + ${stepSales}x)`,
      image: this.generateParabolaSVG(
        startPrice,
        startSales,
        stepSales,
        x,
        maxRevenue,
      ),
      variables: { startPrice, startSales, stepSales, optimalX: x },
      correctAnswer:
        scenario.id === "hotel" || scenario.id === "electronics"
          ? `${newPriceStr} ${scenario.unit}`
          : `${xStr} ${scenario.unit}`,
      distractors: [
        `${Number(xStr) + 5} ${scenario.unit}`,
        `${Number(newPriceStr) - 10} ${scenario.unit}`,
        `${startPrice} ${scenario.unit}`,
      ],
      steps: [
        `Oznaczmy przez $$x$$ kwotę obniżki. Nowa cena: $$${startPrice} - x$$. Nowa sprzedaż: $$${startSales} + ${stepSales}x$$.`,
        `Funkcja przychodu: $$P(x) = (${startPrice} - x)(${startSales} + ${stepSales}x)$$`,
        `Po wymnożeniu: $$P(x) = -${stepSales}x^2 + ${startPrice * stepSales - startSales}x + ${startPrice * startSales}$$`,
        `Wierzchołek paraboli (maksimum): $$p = \\frac{-b}{2a} = ${xStr}$$`,
        scenario.id === "hotel" || scenario.id === "electronics"
          ? `Szukana cena: $$${startPrice} - ${xStr} = ${newPriceStr}$$ ${scenario.unit}.`
          : `Należy obniżyć cenę o $$${xStr}$$ ${scenario.unit}.`,
      ],
    });
  }

  generateDensityProblem() {
    let treeRange, lossList;
    if (this.difficulty === "easy") {
      treeRange = [40, 60];
      lossList = [1, 2];
    } else if (this.difficulty === "hard") {
      treeRange = [80, 150];
      lossList = [2, 3, 4];
    } else {
      treeRange = [50, 80];
      lossList = [1, 2];
    }

    const scenario = {
      subject: "drzew",
      unit: "szt.",
      template: (fruits, trees, stepFruits, stepTrees, subject) =>
        `Sadownik zauważył, że jeśli posadzi ${trees} ${subject} na hektar, to z każdego zbierze średnio ${fruits} kg owoców. ` +
        `Każde dodatkowe posadzone drzewo (powyżej liczby ${trees}) powoduje zmniejszenie plonu z każdego drzewa o ${stepFruits} kg. ` +
        `Ile drzew należy dosadzić, aby łączny plon z sadu był największy?`,
    };

    const startTrees = MathUtils.randomInt(treeRange[0], treeRange[1]);
    const lossPerTree = MathUtils.randomElement(lossList);
    const targetX = MathUtils.randomInt(5, 15);

    // P(x) = (startTrees + x)(startFruits - loss*x)
    // x1 = -startTrees, x2 = startFruits/loss
    // p = (x1+x2)/2 = targetX
    // 2*targetX = -startTrees + startFruits/loss
    // startFruits/loss = 2*targetX + startTrees
    // startFruits = loss * (2*targetX + startTrees)

    const calculatedStartFruits = lossPerTree * (2 * targetX + startTrees);

    const questionText = scenario.template(
      calculatedStartFruits,
      startTrees,
      lossPerTree,
      null,
      scenario.subject,
    );

    return this.createResponse({
      question: questionText,
      latex: `Plon(x) = (${startTrees} + x)(${calculatedStartFruits} - ${lossPerTree}x)`,
      image: this.generateParabolaSVG(
        calculatedStartFruits,
        startTrees,
        lossPerTree,
        targetX,
        0,
        true,
      ),
      variables: { calculatedStartFruits, startTrees, lossPerTree, targetX },
      correctAnswer: `${targetX} drzew`,
      distractors: [
        `${targetX + 5} drzew`,
        `${targetX * 2} drzew`,
        `${startTrees} drzew`,
      ],
      steps: [
        `Niech $$x$$ oznacza liczbę dosadzonych drzew. Liczba drzew: $$${startTrees} + x$$.`,
        `Plon z jednego drzewa: $$${calculatedStartFruits} - ${lossPerTree}x$$.`,
        `Funkcja plonu całkowitego: $$P(x) = (${startTrees} + x)(${calculatedStartFruits} - ${lossPerTree}x)$$`,
        `Jest to funkcja kwadratowa o ramionach w dół. Obliczamy wierzchołek $$p$$.`,
        `Miejsca zerowe: $$x_1 = -${startTrees}$$, $$x_2 = ${calculatedStartFruits / lossPerTree}$$.`,
        `Wierzchołek leży pośrodku: $$p = \\frac{-${startTrees} + ${calculatedStartFruits / lossPerTree}}{2} = ${targetX}$$`,
        `Należy dosadzić $$${targetX}$$ drzew.`,
      ],
    });
  }

  generateParabolaSVG(startP, startS, step, optX, maxRev, isDensity = false) {
    const size = 300;
    const center = size / 2;
    let pathData = "";
    for (let x = -10; x <= 10; x += 0.5) {
      const relX = x;
      const relY = -(x * x) + 9;
      const svgX = center + relX * 10;
      const svgY = center - relY * 10;
      pathData += `${pathData ? "L" : "M"} ${svgX} ${svgY} `;
    }
    const axis = `
        <line x1="10" y1="${center + 90}" x2="${size - 10}" y2="${center + 90}" stroke="#333" stroke-width="2" />
        <line x1="${center - 100}" y1="${size - 10}" x2="${center - 100}" y2="10" stroke="#333" stroke-width="2" />
        <text x="${center + 120}" y="${center + 110}" font-size="12">ilość (x)</text>
        <text x="${center - 110}" y="20" font-size="12">przychód</text>
    `;
    const vertex = `<circle cx="${center}" cy="${center - 90}" r="5" fill="red" />`;
    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">${axis}<path d="${pathData}" stroke="#007bff" stroke-width="3" fill="none" transform="translate(0, 90)"/><g transform="translate(0, 90)">${vertex}</g></svg>`;
  }
}

module.exports = EconomicOptimizationGenerator;
