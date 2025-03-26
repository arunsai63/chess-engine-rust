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