// Define color type enum to avoid hardcoding strings
enum ColorType {
    White = "white",
    Black = "black"
}

// Board position type for cleaner code
type Position = { row: number, col: number }

// Last move type for en passant tracking
type MoveRecord = {
    piece: Piece
    fromRow: number
    fromCol: number
    toRow: number
    toCol: number
}

interface Piece {
    piece: string
    img: string | undefined
    color: ColorType
    hasMoved: boolean
    getPossibleMoves: (board: (Piece | null)[][], row: number, col: number, lastMove: MoveRecord | null) => Position[]
    move: (board: (Piece | null)[][], fromRow: number, fromCol: number, toRow: number, toCol: number, lastMove: MoveRecord | null) => (Piece | null)[][]
}

enum PieceType {
    Rook = "rook",
    Knight = "knight",
    Bishop = "bishop",
    Queen = "queen",
    King = "king",
    Pawn = "pawn",
}

export { ColorType, PieceType }
export type { Position, MoveRecord, Piece }

