# ♟️ Chess Engine in Rust + WebAssembly + React

Live Demo: [arunsai63.github.io/chess-engine-rust](https://arunsai63.github.io/chess-engine-rust)  
GitHub Repo: [github.com/arunsai63/chess-engine-rust](https://github.com/arunsai63/chess-engine-rust)

## 🚀 Overview

This project is a full-stack chess game built with:

- 🦀 **Rust** — for the core chess engine logic
- 🌐 **WebAssembly (WASM)** — to run high-performance Rust code in the browser
- ⚛️ **React + Vite** — for a fast, modern UI
- 🎨 **TailwindCSS** — for rapid, utility-first styling

The goal was to create a performant, interactive chess game where the heavy-lifting game logic runs via compiled WebAssembly, bringing native-like speed to the browser.

## 🧠 Features

- Full chess rules engine implemented in **Rust**
- Compile-time optimized with **`wasm-pack`**
- Seamless integration with **React frontend** via WebAssembly bindings
- Interactive chessboard UI built with **React and TailwindCSS**
- **Stateless rendering** for a responsive and minimalistic UX
- Lightweight and extremely fast — thanks to **Rust + WASM**
- Deployed on **GitHub Pages** using Vite's static export

## 📦 Tech Stack

| Layer        | Technology              |
|--------------|--------------------------|
| Game Engine  | Rust                    |
| WASM Binding | `wasm-bindgen`, `wasm-pack` |
| Frontend     | React (Vite)            |
| Styling      | TailwindCSS             |
| Deployment   | GitHub Pages            |

## 🛠️ Rust Game Engine

The chess engine is written entirely in Rust, designed with:

- **Bitboard representation** for performance
- **Move generation** (legal moves, captures, castling, etc.)
- **Check/checkmate logic**
- **Board evaluation** (optional extension)

It compiles to WebAssembly and exposes functions to JavaScript using `wasm-bindgen`.

### 🧩 Example Rust ↔ JS Binding

```rust
#[wasm_bindgen]
pub fn generate_legal_moves(fen: &str) -> JsValue {
    let board = Board::from_fen(fen).unwrap();
    let moves = board.generate_moves();
    JsValue::from_serde(&moves).unwrap()
}

🖥️ React Frontend

The UI is built using React + TailwindCSS and communicates with the Rust engine via the WASM bindings.
	•	React hooks to manage state and game flow
	•	WASM functions are called via async JS
	•	Chessboard rendered with a simple grid system
	•	No external chess libraries — all logic is native

📂 Project Structure

chess-engine-rust/
├── src/
│   ├── engine/            # Rust chess engine (compiled to WASM)
│   └── web/               # React frontend with Vite
├── pkg/                   # WASM output package
├── public/
├── index.html
└── README.md

🧪 Running Locally

Prerequisites
	•	Rust
	•	wasm-pack
	•	Node.js + npm
	•	Vite

Steps

# Build the Rust engine to WASM
cd src/engine
wasm-pack build --target web

# Move to frontend
cd ../web
npm install
npm run dev

🌍 Deployment

Deployed using GitHub Pages via Vite’s static export.

npm run build
# Push the build directory to GitHub Pages

📌 Why This Project?

This project demonstrates:
	•	Systems-level programming with Rust
	•	Real-world WASM integration into a frontend stack
	•	Building optimized web applications without bloated dependencies
	•	Clean UI/UX using Tailwind and React
	•	Deploying full Rust-to-React pipelines for modern web apps

💼 Ideal For

If you’re hiring for roles involving:
	•	Rust / WASM / Systems programming
	•	Frontend/backend web integration
	•	High-performance browser apps
	•	Cross-language architecture (Rust ↔ JS)

This project showcases end-to-end capability in building modern, high-performance web apps with low-level languages.

⸻

📫 Let’s Connect!

If you’re interested in collaborating, hiring, or just chatting about systems programming, feel free to reach out via GitHub.

---

Let me know if you'd like a one-liner for your resume or LinkedIn too!


# Todo:
- en passant
- pawn promotion