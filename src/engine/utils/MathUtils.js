// src/engine/utils/MathUtils.js

class MathUtils {
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Funkcja do ładnego formatowania ax^2 + bx + c
  static formatPolynomial(a, b, c) {
    let text = "";

    // Obsługa a
    if (a === 1) text += "x^2";
    else if (a === -1) text += "-x^2";
    else text += `${a}x^2`;

    // Obsługa b
    if (b > 0) text += ` + ${b === 1 ? "" : b}x`;
    else if (b < 0) text += ` - ${b === -1 ? "" : Math.abs(b)}x`;

    // Obsługa c
    if (c > 0) text += ` + ${c}`;
    else if (c < 0) text += ` - ${Math.abs(c)}`;

    return text;
  }
}

module.exports = MathUtils;
