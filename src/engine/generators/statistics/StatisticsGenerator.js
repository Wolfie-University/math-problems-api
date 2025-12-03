const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

const MeasuresGenerator = require("./topics/statistics/MeasuresGenerator");
const ChartsGenerator = require("./topics/statistics/ChartsGenerator");
const TheoryStatsGenerator = require("./topics/statistics/TheoryStatsGenerator");

class StatisticsGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.measuresGen = new MeasuresGenerator(difficulty);
    this.chartsGen = new ChartsGenerator(difficulty);
    this.theoryGen = new TheoryStatsGenerator(difficulty);
  }

  generate() {
    const variants = [
      "stats_basic", // srednia/mediana z listy
      "stats_mode", // dominanta
      "weighted_mean", // srednia wazona
      "std_deviation", // odchylenie standardowe
      "missing_number_mean", // brakujaca liczba do sredniej
      "median_with_param", // mediana z x
      "mean_after_adding", // srednia po dopisaniu liczby
      "stats_chart", // srednia z wykresu
      "frequency_table_mean", // srednia z tabeli
      "std_dev_properties", // wlasnosci odchylenia
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // Measures
      case "stats_basic":
        return this.measuresGen.generateBasicStatsProblem();
      case "stats_mode":
        return this.measuresGen.generateModeProblem();
      case "weighted_mean":
        return this.measuresGen.generateWeightedMeanProblem();
      case "std_deviation":
        return this.measuresGen.generateStdDevProblem();
      case "missing_number_mean":
        return this.measuresGen.generateMissingNumberMean();
      case "median_with_param":
        return this.measuresGen.generateMedianWithParam();
      case "mean_after_adding":
        return this.measuresGen.generateMeanAfterAdding();

      // Charts & Tables
      case "stats_chart":
        return this.chartsGen.generateChartMeanProblem();
      case "frequency_table_mean":
        return this.chartsGen.generateFrequencyTableMean();

      // Theory
      case "std_dev_properties":
        return this.theoryGen.generateStdDevProperties();

      default:
        return this.measuresGen.generateBasicStatsProblem();
    }
  }
}

module.exports = StatisticsGenerator;
