use std::cmp::PartialEq;
use wasm_bindgen::prelude::*;

#[derive(Clone, Copy, PartialEq)]
enum Color {
    White,
    Black
}

#[derive(Clone, Copy, PartialEq)]
enum PieceType {
    King, Queen, Rook, Bishop, Knight, Pawn
}

#[derive(Clone, Copy, PartialEq)]
struct Piece {
    has_moved: bool,
    color: Color,
    piece: PieceType
}


impl Piece {
    // Modified signature to return Vec since array size can't be determined at compile time
    fn get_possible_moves(board: &[[Option<Piece>; 8]; 8], row: usize, col: usize) -> Vec<(usize, usize)> {
        let mut moves = Vec::new();

        // For knight-specific moves
        if let Some(piece) = &board[row][col] {
            if matches!(piece.piece, PieceType::Knight) {
                // Knight moves in L-shape: 2 squares in one direction and 1 perpendicular
                let possible_offsets = [
                    (-2, -1), (-2, 1),  // Two up, one left/right
                    (2, -1),  (2, 1),   // Two down, one left/right
                    (-1, -2), (-1, 2),  // One up, two left/right
                    (1, -2),  (1, 2)    // One down, two left/right
                ];

                for &(row_offset, col_offset) in possible_offsets.iter() {
                    let new_row = row as i32 + row_offset;
                    let new_col = col as i32 + col_offset;

                    // Check if the move is within board boundaries
                    if new_row >= 0 && new_row < 8 && new_col >= 0 && new_col < 8 {
                        let target_row = new_row as usize;
                        let target_col = new_col as usize;

                        // Add move if square is empty or has opponent's piece
                        match &board[target_row][target_col] {
                            Some(target_piece) => {
                                if target_piece.color == piece.color {
                                    moves.push((target_row, target_col));
                                }
                            }
                            None => moves.push((target_row, target_col)),
                        }
                    }
                }
            }
        }

        moves
    }

    // Keeping the move_piece signature as is, adding basic implementation
    fn move_piece(board: &mut [[Option<Piece>; 8]; 8], row: usize, col: usize, new_row: usize, new_col: usize) {
        if let Some(mut piece) = board[row][col].take() {
            piece.has_moved = true;
            board[new_row][new_col] = Some(piece);
        }
    }
}

#[wasm_bindgen]
pub fn initialise_board() -> [[Option<Piece>; 8]; 8] {
    let mut board = [[None; 8]; 8];

    // Initialize white pieces
    board[0][0] = Some(Piece { has_moved: false, color: Color::White, piece: PieceType::Rook });
    board[0][1] = Some(Piece { has_moved: false, color: Color::White, piece: PieceType::Knight });
    board[0][2] = Some(Piece { has_moved: false, color: Color::White, piece: PieceType::Bishop });
    board[0][3] = Some(Piece { has_moved: false, color: Color::White, piece: PieceType::Queen });
    board[0][4] = Some(Piece { has_moved: false, color: Color::White, piece: PieceType::King });
    board[0][5] = Some(Piece { has_moved: false, color: Color::White, piece: PieceType::Bishop });
    board[0][6] = Some(Piece { has_moved: false, color: Color::White, piece: PieceType::Knight });
    board[0][7] = Some(Piece { has_moved: false, color: Color::White, piece: PieceType::Rook });

    // White pawns
    for col in 0..8 {
        board[1][col] = Some(Piece { has_moved: false, color: Color::White, piece: PieceType::Pawn });
    }

    // Initialize black pieces
    board[7][0] = Some(Piece { has_moved: false, color: Color::Black, piece: PieceType::Rook });
    board[7][1] = Some(Piece { has_moved: false, color: Color::Black, piece: PieceType::Knight });
    board[7][2] = Some(Piece { has_moved: false, color: Color::Black, piece: PieceType::Bishop });
    board[7][3] = Some(Piece { has_moved: false, color: Color::Black, piece: PieceType::Queen });
    board[7][4] = Some(Piece { has_moved: false, color: Color::Black, piece: PieceType::King });
    board[7][5] = Some(Piece { has_moved: false, color: Color::Black, piece: PieceType::Bishop });
    board[7][6] = Some(Piece { has_moved: false, color: Color::Black, piece: PieceType::Knight });
    board[7][7] = Some(Piece { has_moved: false, color: Color::Black, piece: PieceType::Rook });

    // Black pawns
    for col in 0..8 {
        board[6][col] = Some(Piece { has_moved: false, color: Color::Black, piece: PieceType::Pawn });
    }

    board
}


#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet() {
        initialise_board();
        assert_eq!(greet("Alice"), "Hello, Alice!");
        assert_eq!(greet(""), "Hello, !");
        assert_eq!(greet("world"), "Hello, world!");
    }
}