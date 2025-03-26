import { ColorType, Position, MoveRecord, Piece, PieceType } from "../types/pieces"
import BlackRook from "../assets/images/black/rook.svg"
import BlackKnight from "../assets/images/black/knight.svg"
import BlackBishop from "../assets/images/black/bishop.svg"
import BlackQueen from "../assets/images/black/queen.svg"
import BlackKing from "../assets/images/black/king.svg"
import BlackPawn from "../assets/images/black/pawn.svg"
import WhiteRook from "../assets/images/white/rook.svg"
import WhiteKnight from "../assets/images/white/knight.svg"
import WhiteBishop from "../assets/images/white/bishop.svg"
import WhiteQueen from "../assets/images/white/queen.svg"
import WhiteKing from "../assets/images/white/king.svg"
import WhitePawn from "../assets/images/white/pawn.svg"


function createPiece(
    piece: string,
    color: ColorType,
    getPossibleMoves: (board: (Piece | null)[][], row: number, col: number, lastMove: MoveRecord | null) => Position[]
): Piece {
    return {
        piece,
        img: {
            rook: color === ColorType.White ? WhiteRook : BlackRook,
            knight: color === ColorType.White ? WhiteKnight : BlackKnight,
            bishop: color === ColorType.White ? WhiteBishop : BlackBishop,
            queen: color === ColorType.White ? WhiteQueen : BlackQueen,
            king: color === ColorType.White ? WhiteKing : BlackKing,
            pawn: color === ColorType.White ? WhitePawn : BlackPawn,
        }[piece],
        color,
        hasMoved: false,
        getPossibleMoves,
        // Default move implementation that will be overridden
        move: (board: (Piece | null)[][], fromRow: number, fromCol: number, toRow: number, toCol: number, _lastMove: MoveRecord | null) => {
            const newBoard = board.map(row => [...row])
            const movingPiece = board[fromRow][fromCol]

            if (!movingPiece) return newBoard

            newBoard[fromRow][fromCol] = null
            // Keep all the piece properties and methods, just update hasMoved
            newBoard[toRow][toCol] = { ...movingPiece, hasMoved: true }
            return newBoard
        }
    }
}

const placeholderMoves = (_board: (Piece | null)[][], _row: number, _col: number, _lastMove: MoveRecord | null): Position[] => []



const createKing = (color: ColorType) => {
    const piece: Piece = createPiece(PieceType.King, color, placeholderMoves)

    piece.getPossibleMoves = (board: (Piece | null)[][], row: number, col: number, _lastMove: MoveRecord | null): Position[] => {
        const possibleMoves: Position[] = []

        // Define all eight possible directions for king's regular moves
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ]

        // Regular moves: one square in any direction
        for (const [dRow, dCol] of directions) {
            const targetRow = row + dRow
            const targetCol = col + dCol

            // Check if the target square is within the 8x8 board
            if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
                const targetPiece = board[targetRow][targetCol]
                // Add the move if the square is empty or has an enemy piece
                if (targetPiece === null || targetPiece.color !== piece.color) {
                    possibleMoves.push({ row: targetRow, col: targetCol })
                }
            }
        }

        // Castling moves
        if (!board[row][col]?.hasMoved) {
            const homeRow = color === ColorType.White ? 7 : 0

            if (row === homeRow) {
                // Kingside castling (king moves two squares right)
                const kingsideRookCol = 7
                const kingsideRook = board[homeRow][kingsideRookCol]
                if (
                    kingsideRook &&
                    kingsideRook.piece === PieceType.Rook &&
                    kingsideRook.color === piece.color &&
                    !kingsideRook.hasMoved &&
                    board[homeRow][5] === null &&
                    board[homeRow][6] === null
                ) {
                    possibleMoves.push({ row: homeRow, col: col + 2 })
                }

                // Queenside castling (king moves two squares left)
                const queensideRookCol = 0
                const queensideRook = board[homeRow][queensideRookCol]
                if (
                    queensideRook &&
                    queensideRook.piece === PieceType.Rook &&
                    queensideRook.color === piece.color &&
                    !queensideRook.hasMoved &&
                    board[homeRow][1] === null &&
                    board[homeRow][2] === null &&
                    board[homeRow][3] === null
                ) {
                    possibleMoves.push({ row: homeRow, col: col - 2 })
                }
            }
        }

        return possibleMoves
    }

    // Special move function for king to handle castling
    piece.move = (board: (Piece | null)[][], fromRow: number, fromCol: number, toRow: number, toCol: number, _lastMove: MoveRecord | null): (Piece | null)[][] => {
        const newBoard = board.map(row => [...row])
        newBoard[fromRow][fromCol] = null

        // Create new king with hasMoved=true
        const movedKing = { ...piece, hasMoved: true }
        newBoard[toRow][toCol] = movedKing

        // Handle castling (king moves two squares horizontally)
        if (!piece.hasMoved && Math.abs(fromCol - toCol) === 2) {
            const kingsideMove = toCol > fromCol
            const rookCol = kingsideMove ? 7 : 0
            const newRookCol = kingsideMove ? toCol - 1 : toCol + 1

            // Move the rook alongside the king
            const rook = newBoard[fromRow][rookCol]
            newBoard[fromRow][rookCol] = null
            if (rook) {
                newBoard[fromRow][newRookCol] = { ...rook, hasMoved: true }
            }
        }

        return newBoard
    }

    return piece
}

const createRook = (color: ColorType) => {
    const piece: Piece = createPiece(PieceType.Rook, color, placeholderMoves)

    piece.getPossibleMoves = (board: (Piece | null)[][], row: number, col: number, _lastMove: MoveRecord | null): Position[] => {
        const possibleMoves: Position[] = []

        // Helper function to add moves in a given direction
        const addMovesInDirection = (dRow: number, dCol: number) => {
            let currentRow = row + dRow
            let currentCol = col + dCol
            // Continue until we hit the board edge
            while (currentRow >= 0 && currentRow < 8 && currentCol >= 0 && currentCol < 8) {
                const targetPiece = board[currentRow][currentCol]
                // If the square is empty, add it as a possible move
                if (targetPiece === null) {
                    possibleMoves.push({ row: currentRow, col: currentCol })
                } else {
                    // If there's a piece, check if it's an enemy piece (capture possible)
                    if (targetPiece.color !== piece.color) {
                        possibleMoves.push({ row: currentRow, col: currentCol })
                    }
                    // Stop after encountering any piece (friendly or enemy)
                    break
                }
                // Move further in the same direction
                currentRow += dRow
                currentCol += dCol
            }
        }

        // Rook's possible directions
        addMovesInDirection(0, -1) // Left
        addMovesInDirection(0, 1)  // Right
        addMovesInDirection(-1, 0) // Up
        addMovesInDirection(1, 0)  // Down

        return possibleMoves
    }

    // Explicit move implementation for rook
    piece.move = (board: (Piece | null)[][], fromRow: number, fromCol: number, toRow: number, toCol: number, _lastMove: MoveRecord | null): (Piece | null)[][] => {
        const newBoard = board.map(row => [...row])
        newBoard[fromRow][fromCol] = null
        // Create new rook with hasMoved=true
        newBoard[toRow][toCol] = { ...piece, hasMoved: true }
        return newBoard
    }

    return piece
}

const createBishop = (color: ColorType) => {
    const piece: Piece = createPiece(PieceType.Bishop, color, placeholderMoves)

    piece.getPossibleMoves = (board: (Piece | null)[][], row: number, col: number, _lastMove: MoveRecord | null): Position[] => {
        const possibleMoves: Position[] = []

        // Define the four diagonal directions
        const directions = [
            [-1, -1], // Up-left
            [-1, 1],  // Up-right
            [1, -1],  // Down-left
            [1, 1]    // Down-right
        ]

        for (const [dRow, dCol] of directions) {
            let currentRow = row + dRow
            let currentCol = col + dCol

            // Continue in the direction until we hit the edge or a piece
            while (currentRow >= 0 && currentRow < 8 && currentCol >= 0 && currentCol < 8) {
                const targetPiece = board[currentRow][currentCol]

                if (targetPiece === null) {
                    // Empty square, add it and continue
                    possibleMoves.push({ row: currentRow, col: currentCol })
                } else {
                    // Occupied square
                    if (targetPiece.color !== piece.color) {
                        // Enemy piece, add it (capture) and stop
                        possibleMoves.push({ row: currentRow, col: currentCol })
                    }
                    break // Stop at any piece (friendly or enemy)
                }

                currentRow += dRow
                currentCol += dCol
            }
        }

        return possibleMoves
    }

    // Explicit move implementation for bishop
    piece.move = (board: (Piece | null)[][], fromRow: number, fromCol: number, toRow: number, toCol: number, _lastMove: MoveRecord | null): (Piece | null)[][] => {
        const newBoard = board.map(row => [...row])
        newBoard[fromRow][fromCol] = null
        // Create new bishop with hasMoved=true
        newBoard[toRow][toCol] = { ...piece, hasMoved: true }
        return newBoard
    }

    return piece
}

const createKnight = (color: ColorType) => {
    const piece: Piece = createPiece(PieceType.Knight, color, placeholderMoves)

    piece.getPossibleMoves = (board: (Piece | null)[][], row: number, col: number, _lastMove: MoveRecord | null): Position[] => {
        const possibleMoves: Position[] = []

        // Define the eight possible L-shaped offsets
        const offsets = [
            [-2, -1], [-2, 1],  // Two up, one left/right
            [-1, -2], [-1, 2],  // One up, two left/right
            [1, -2], [1, 2],   // One down, two left/right
            [2, -1], [2, 1]    // Two down, one left/right
        ]

        for (const [dRow, dCol] of offsets) {
            const targetRow = row + dRow
            const targetCol = col + dCol

            // Check if the target square is within the 8x8 board
            if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
                const targetPiece = board[targetRow][targetCol]
                // Add the move if the square is empty or has an enemy piece
                if (targetPiece === null || targetPiece.color !== piece.color) {
                    possibleMoves.push({ row: targetRow, col: targetCol })
                }
            }
        }

        return possibleMoves
    }

    // Explicit move implementation for knight
    piece.move = (board: (Piece | null)[][], fromRow: number, fromCol: number, toRow: number, toCol: number, _lastMove: MoveRecord | null): (Piece | null)[][] => {
        const newBoard = board.map(row => [...row])
        newBoard[fromRow][fromCol] = null
        // Create new knight with hasMoved=true
        newBoard[toRow][toCol] = { ...piece, hasMoved: true }
        return newBoard
    }

    return piece
}

const createQueen = (color: ColorType) => {
    const piece: Piece = createPiece(PieceType.Queen, color, placeholderMoves)

    piece.getPossibleMoves = (board: (Piece | null)[][], row: number, col: number, _lastMove: MoveRecord | null): Position[] => {
        const possibleMoves: Position[] = []

        // Define all eight directions (horizontal, vertical, diagonal)
        const directions = [
            [0, -1],  // Left
            [0, 1],   // Right
            [-1, 0],  // Up
            [1, 0],   // Down
            [-1, -1], // Up-left
            [-1, 1],  // Up-right
            [1, -1],  // Down-left
            [1, 1]    // Down-right
        ]

        for (const [dRow, dCol] of directions) {
            let currentRow = row + dRow
            let currentCol = col + dCol

            // Continue in the direction until we hit the edge or a piece
            while (currentRow >= 0 && currentRow < 8 && currentCol >= 0 && currentCol < 8) {
                const targetPiece = board[currentRow][currentCol]

                if (targetPiece === null) {
                    // Empty square, add it and continue
                    possibleMoves.push({ row: currentRow, col: currentCol })
                } else {
                    // Occupied square
                    if (targetPiece.color !== piece.color) {
                        // Enemy piece, add it (capture) and stop
                        possibleMoves.push({ row: currentRow, col: currentCol })
                    }
                    break // Stop at any piece (friendly or enemy)
                }

                currentRow += dRow
                currentCol += dCol
            }
        }

        return possibleMoves
    }

    // Explicit move implementation for queen
    piece.move = (board: (Piece | null)[][], fromRow: number, fromCol: number, toRow: number, toCol: number, _lastMove: MoveRecord | null): (Piece | null)[][] => {
        const newBoard = board.map(row => [...row])
        newBoard[fromRow][fromCol] = null
        // Create new queen with hasMoved=true
        newBoard[toRow][toCol] = { ...piece, hasMoved: true }
        return newBoard
    }

    return piece
}

const createPawn = (color: ColorType) => {
    const piece: Piece = createPiece(PieceType.Pawn, color, placeholderMoves)

    piece.getPossibleMoves = (board: (Piece | null)[][], row: number, col: number, lastMove: MoveRecord | null): Position[] => {
        const possibleMoves: Position[] = []

        // Direction is -1 for white (moves up) and +1 for black (moves down)
        const direction = piece.color === ColorType.White ? -1 : 1

        // Forward move: one square ahead if empty
        const nextRow = row + direction
        if (nextRow >= 0 && nextRow < 8 && board[nextRow][col] === null) {
            possibleMoves.push({ row: nextRow, col })

            // Double move: two squares from starting position if both squares are empty
            const doubleRow = row + 2 * direction
            if (!board[row][col]?.hasMoved && doubleRow >= 0 && doubleRow < 8 && board[doubleRow][col] === null) {
                possibleMoves.push({ row: doubleRow, col })
            }
        }

        // Diagonal captures: check left and right diagonals for enemy pieces
        if (nextRow >= 0 && nextRow < 8) {
            // Left diagonal capture
            if (col > 0) { // Ensure not on left edge
                const leftDiagonal = board[nextRow][col - 1]
                if (leftDiagonal !== null && leftDiagonal.color !== piece.color) {
                    possibleMoves.push({ row: nextRow, col: col - 1 })
                }
            }
            // Right diagonal capture
            if (col < 7) { // Ensure not on right edge
                const rightDiagonal = board[nextRow][col + 1]
                if (rightDiagonal !== null && rightDiagonal.color !== piece.color) {
                    possibleMoves.push({ row: nextRow, col: col + 1 })
                }
            }
        }

        // En passant: check if the last move was a pawn moving two squares forward and is adjacent to us
        if (lastMove &&
            lastMove.piece.piece === PieceType.Pawn &&
            Math.abs(lastMove.fromRow - lastMove.toRow) === 2 && // Moved two squares (initial pawn move)
            lastMove.toRow === row && // Is now in the same row as our pawn
            Math.abs(lastMove.toCol - col) === 1) { // Is in an adjacent column
            // We can capture en passant
            possibleMoves.push({ row: row + direction, col: lastMove.toCol })
        }

        return possibleMoves
    }

    // Implement special move function for pawns
    piece.move = (board: (Piece | null)[][], fromRow: number, fromCol: number, toRow: number, toCol: number, lastMove: MoveRecord | null): (Piece | null)[][] => {
        const newBoard = board.map(row => [...row])

        // Create a copy of the piece with hasMoved set to true
        const movedPiece = { ...piece, hasMoved: true }

        // Check for en passant capture
        if (lastMove &&
            lastMove.piece.piece === PieceType.Pawn &&
            Math.abs(lastMove.fromRow - lastMove.toRow) === 2 &&
            fromRow === lastMove.toRow &&
            Math.abs(lastMove.toCol - fromCol) === 1 &&
            toRow === lastMove.toRow + (piece.color === ColorType.White ? -1 : 1) &&
            toCol === lastMove.toCol) {
            // This is an en passant capture
            newBoard[lastMove.toRow][lastMove.toCol] = null // Remove the captured pawn
        }

        // Move the pawn
        newBoard[fromRow][fromCol] = null

        // Check for promotion (pawn reaching the opposite end)
        if ((piece.color === ColorType.White && toRow === 0) ||
            (piece.color === ColorType.Black && toRow === 7)) {
            // Promote to queen automatically
            newBoard[toRow][toCol] = createQueen(piece.color)
        } else {
            newBoard[toRow][toCol] = movedPiece
        }

        return newBoard
    }

    return piece
}

const initialBoard: (Piece | null)[][] = [
    [
        createRook(ColorType.Black),
        createKnight(ColorType.Black),
        createBishop(ColorType.Black),
        createQueen(ColorType.Black),
        createKing(ColorType.Black),
        createBishop(ColorType.Black),
        createKnight(ColorType.Black),
        createRook(ColorType.Black),
    ],
    Array(8).fill(null).map(() => createPawn(ColorType.Black)),
    ...Array(4).fill(null).map(() => Array(8).fill(null)),
    Array(8).fill(null).map(() => createPawn(ColorType.White)),
    [
        createRook(ColorType.White),
        createKnight(ColorType.White),
        createBishop(ColorType.White),
        createQueen(ColorType.White),
        createKing(ColorType.White),
        createBishop(ColorType.White),
        createKnight(ColorType.White),
        createRook(ColorType.White),
    ],
]

export { initialBoard }