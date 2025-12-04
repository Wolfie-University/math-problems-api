# Matura Engine API 🧮

A powerful, modular Node.js REST API engine designed to generate an infinite number of unique mathematical problems. Tailored for the Polish Matura Exam (Basic Level 2025), but applicable to general high school mathematics.

The system generates problem content, answers, step-by-step solutions in **LaTeX**, and dynamic visualizations in **SVG**.

## ✨ Key Features

* **12 Specialized Modules**: Covering Algebra, Geometry (Analytic, Planimetry, Stereometry), Functions, Statistics, Combinatorics, and more.
* **Infinite Randomization**: Problems are algorithmically generated (random numbers, variable names, scenarios), ensuring no two requests return the exact same problem.
* **Dynamic SVG Generation**: On-the-fly creation of function graphs, geometric figures, and statistical charts.
* **LaTeX Support**: All mathematical formulas are formatted for easy rendering.
* **Difficulty Levels**: `easy`, `medium`, and `hard` modes that adjust number ranges and problem complexity.
* **Flexible Retrieval**: Fetch single problems, batches of specific topics, or completely random sets.
* **Full Exam Simulator**: Generates a complete, balanced exam sheet (~30 tasks).

## 🚀 Installation & Usage

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Wolfie-University/math-problems-api.git
    cd math-problems-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the server:**
    ```bash
    node index.js
    ```
    The server runs on port `3333` by default.

## 📡 API Documentation

### Global Parameters
All generator endpoints support the following query parameters:

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `difficulty` | `string` | `medium` | Complexity level: `easy`, `medium`, or `hard`. |
| `count` | `number` | `1` | Number of problems to return. If specified, returns an Array. |

---

### 1. Specific Topic Generators
Generate problems from a specific mathematical field.

**Endpoint:** `GET /api/v2/generator/:topic`

**Available Topics:**
* `algebra` (Powers, Roots, Logarithms, Percentages)
* `functions-general` (Function properties, Linear function, Graphs)
* `quadratic` (Vertex, Roots, Inequalities, Viete's formulas)
* `optimization` (Revenue optimization, Geometry optimization)
* `sequences` (Arithmetic, Geometric, General properties)
* `analytic` (Lines, Circles, Intersections, Coordinates)
* `planimetry` (Triangles, Quadrilaterals, Angles, Theorems)
* `stereometry` (Solids, Angles in solids, Sections)
* `trigonometry` (Identities, Equations, Geometry applications)
* `combinatorics` (Permutations, Combinations, Variations)
* `probability` (Dice, Coins, Urns, Sets)
* `statistics` (Mean, Median, Mode, Standard Deviation, Charts)

**Examples:**
* Get 1 easy quadratic problem:
    `GET /api/v2/generator/quadratic?difficulty=easy`
* Get 5 hard trigonometry problems:
    `GET /api/v2/generator/trigonometry?difficulty=hard&count=5`

### 2. Random Generator (Mix)
Returns a mix of problems randomly selected from all available categories.

* **Endpoint:** `GET /api/v2/generator/random`
* **Example:** Get 10 random medium problems:
    `GET /api/v2/generator/random?count=10&difficulty=medium`

### 3. Full Exam Simulator
Generates a complete exam structure (approx. 30 tasks) following the standard distribution of topics.

* **Endpoint:** `GET /api/v2/exam/full`
* **Example:**
    `GET /api/v2/exam/full?difficulty=hard`

---

## 📦 Response Structure

### Single Object (Default)
```json
{
  "meta": {
    "type": "QuadraticGenerator",
    "difficulty": "medium"
  },
  "content": {
    "question_text": "Determine the coordinates of the vertex of the parabola:",
    "question_latex": "f(x) = 2x^2 - 4x + 1",
    "image_svg": "<svg ...>...</svg>",  // Optional
    "variables": { "a": 2, "b": -4, "c": 1, "p": 1, "q": -1 }
  },
  "answers": {
    "type": "closed", // "closed" (ABCD) or "open"
    "correct": "W(1, -1)",
    "distractors": ["W(-1, -1)", "W(-1, 1)", "W(1, 1)"]
  },
  "solution": {
    "steps": [
      "Formula for p: $$p = -b/2a$$",
      "Calculate q: $$q = f(p)$$",
      "Result: $$W(1, -1)$$"
    ]
  }
}
```

### Array (When count > 1)
```JSON

[
  { "meta": { ... }, "content": { ... } },
  { "meta": { ... }, "content": { ... } },
  ...
]
```

## 📂 Project Structure

The project follows a modular architecture:
```Plaintext

src/
  ├── engine/
  │   ├── core/           # Base generator class
  │   ├── utils/          # Math & SVG utilities
  │   └── generators/     # Business logic
  │       ├── algebra/    # Topic specific logic
  │       ├── geometry/
  │       ├── statistics/
  │       ├── ...
  │       └── ExamGenerator.js # Exam composition logic
  └── index.js            # Express server entry point
```

© 2025 Szymon Wilczek 
