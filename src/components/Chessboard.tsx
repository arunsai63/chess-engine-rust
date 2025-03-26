import { useState, useRef } from "react"

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



interface Piece {
    piece: string
    img: string | undefined
    color: "white" | "black"
    hasMoved: boolean
    getPossibleMoves: (board: (Piece | null)[][], row: number, col: number) => { row: number, col: number }[],
}

function createPiece(
    piece: string,
    color: "white" | "black",
    getPossibleMoves: (board: (Piece | null)[][], row: number, col: number) => { row: number, col: number }[]
): Piece {
    return {
        piece,
        img: {
            rook: color === "white" ? WhiteRook : BlackRook,
            knight: color === "white" ? WhiteKnight : BlackKnight,
            bishop: color === "white" ? WhiteBishop : BlackBishop,
            queen: color === "white" ? WhiteQueen : BlackQueen,
            king: color === "white" ? WhiteKing : BlackKing,
            pawn: color === "white" ? WhitePawn : BlackPawn,
        }[piece],
        color,
        hasMoved: false,
        getPossibleMoves,
    }
}

const placeholderMoves = (_board: (Piece | null)[][], _row: number, _col: number): { row: number, col: number }[] => []

enum PieceType {
    Rook = "rook",
    Knight = "knight",
    Bishop = "bishop",
    Queen = "queen",
    King = "king",
    Pawn = "pawn",
}

const createKing = (color: "white" | "black") => {
    const piece: Piece = createPiece(PieceType.King, color, placeholderMoves)

    piece.getPossibleMoves = (board: (Piece | null)[][], row: number, col: number) => {
        const possibleMoves: { row: number, col: number }[] = []

        // Define all eight possible directions for king’s regular moves
        const directions = [
            [-1, -1], // Up-left
            [-1, 0],  // Up
            [-1, 1],  // Up-right
            [0, -1],  // Left
            [0, 1],   // Right
            [1, -1],  // Down-left
            [1, 0],   // Down
            [1, 1]    // Down-right
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
        // Kingside and queenside castling are only possible if:
        // 1. The king hasn’t moved (piece.hasMoved === false)
        // 2. The rook hasn’t moved
        // 3. No pieces are between the king and rook
        // 4. The king isn’t in check (not implemented here, assumed handled elsewhere)
        if (!piece.hasMoved) {
            const homeRow = color === "white" ? 7 : 0 // White king starts at row 7, black at row 0

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

    return piece
}


const createRook = (color: "white" | "black") => {
    const piece: Piece = createPiece(PieceType.Rook, color, placeholderMoves)
    piece.getPossibleMoves = (board: (Piece | null)[][], row: number, col: number) => {
        const possibleMoves: { row: number, col: number }[] = []

        // **Helper function to add moves in a given direction**
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

        // **Rook's possible directions**
        // Move left (row unchanged, column decreases)
        addMovesInDirection(0, -1)
        // Move right (row unchanged, column increases)
        addMovesInDirection(0, 1)
        // Move up (row decreases, column unchanged)
        addMovesInDirection(-1, 0)
        // Move down (row increases, column unchanged)
        addMovesInDirection(1, 0)

        return possibleMoves
    }
    return piece
}

const createBishop = (color: "white" | "black") => {
    const piece: Piece = createPiece(PieceType.Bishop, color, placeholderMoves)

    piece.getPossibleMoves = (board: (Piece | null)[][], row: number, col: number) => {
        const possibleMoves: { row: number, col: number }[] = []

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

    return piece
}

const createKnight = (color: "white" | "black") => {
    const piece: Piece = createPiece(PieceType.Knight, color, placeholderMoves)

    piece.getPossibleMoves = (board: (Piece | null)[][], row: number, col: number) => {
        const possibleMoves: { row: number, col: number }[] = []

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

    return piece
}

const createQueen = (color: "white" | "black") => {
    const piece: Piece = createPiece(PieceType.Queen, color, placeholderMoves)

    piece.getPossibleMoves = (board: (Piece | null)[][], row: number, col: number) => {
        const possibleMoves: { row: number, col: number }[] = []

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

    return piece
}

const createPawn = (color: "white" | "black") => {
    const piece: Piece = createPiece(PieceType.Pawn, color, placeholderMoves)
    piece.getPossibleMoves = (board: (Piece | null)[][], row: number, col: number) => {
        const possibleMoves: { row: number, col: number }[] = []
        // Direction is -1 for white (moves up) and +1 for black (moves down)
        const direction = piece.color === "white" ? -1 : 1

        // Forward move: one square ahead if empty
        const nextRow = row + direction
        if (nextRow >= 0 && nextRow < 8 && board[nextRow][col] === null) {
            possibleMoves.push({ row: nextRow, col })

            // Double move: two squares from starting position if both squares are empty
            const doubleRow = row + 2 * direction
            if (!piece.hasMoved && doubleRow >= 0 && doubleRow < 8 && board[doubleRow][col] === null) {
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

        return possibleMoves
    }
    return piece
}

const initialBoard: (Piece | null)[][] = [
    [
        createRook("black"),
        createKnight("black"),
        createBishop("black"),
        createQueen("black"),
        createKing("black"),
        createBishop("black"),
        createKnight("black"),
        createRook("black"),
    ],
    Array(8).fill(null).map(() => createPawn("black")),
    ...Array(4).fill(null).map(() => Array(8).fill(null)),
    Array(8).fill(null).map(() => createPawn("white")),
    [
        createRook("white"),
        createKnight("white"),
        createBishop("white"),
        createQueen("white"),
        createKing("white"),
        createBishop("white"),
        createKnight("white"),
        createRook("white"),
    ],
]

const Chessboard: React.FC = () => {
    const [board, setBoard] = useState<(Piece | null)[][]>(initialBoard)
    const moveSound = useRef(new Audio('./drop.mp3'))
    const [nextMove, setNextMove] = useState<"white" | "black">("white")
    const [draggedPiece, setDraggedPiece] = useState<{
        piece: Piece
        row: number
        col: number
    } | null>(null)


    const handleDragStart = (row: number, col: number, piece: Piece) => {
        setDraggedPiece({ piece, row, col })
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDrop = (row: number, col: number) => {
        if (!draggedPiece) return
        if (draggedPiece.piece.color !== nextMove) return
        // moveSound.current.play()
        const newBoard = board.map(row => [...row])

        const droppedPiece = newBoard[row][col]
        if (droppedPiece && droppedPiece.color === draggedPiece.piece.color) {
            setDraggedPiece(null)
            return
        }
        if (draggedPiece.piece.getPossibleMoves(
            board, draggedPiece.row, draggedPiece.col
        ).find(move => move.row === row && move.col === col) === undefined) {
            setDraggedPiece(null)
            return
        }
        if (droppedPiece && droppedPiece.piece === PieceType.King) {
            alert(`${nextMove} wins!`)
            setBoard(initialBoard)
            setNextMove("white")
            setDraggedPiece(null)
            return
        }
        newBoard[draggedPiece.row][draggedPiece.col] = null
        newBoard[row][col] = draggedPiece.piece
        draggedPiece.piece.hasMoved = true
        setBoard(newBoard)
        setDraggedPiece(null)
        setNextMove(nextMove === "white" ? "black" : "white")
    }

    return (
        <div className="flex-1 p-4 flex flex-col items-center">
            <div className="text-white mb-2 flex items-center">
                Move {nextMove}
            </div>
            <div className="relative w-full max-w-[90vmin] aspect-square">
                <div className="absolute left-[-20px] top-0 bottom-0 flex flex-col justify-between text-white text-sm">
                    {[...Array(8)].map((_, i) => <span key={i}>{8 - i}</span>)}
                </div>
                <div className="w-full h-full border-2 border-gray-700 flex flex-col">
                    {board.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex flex-1">
                            {row.map((piece, colIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`flex-1 flex justify-center items-center ${(rowIndex + colIndex) % 2 === 0 ? "bg-[#f0d9b5]" : "bg-[#769656]"}`}
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(rowIndex, colIndex)}
                                >
                                    {piece && (
                                        <img
                                            src={piece.img}
                                            alt={`${piece.color} ${piece.piece}`}
                                            className="w-4/5 h-4/5 cursor-move"
                                            draggable
                                            onDragStart={() => handleDragStart(rowIndex, colIndex, piece)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-white text-sm">
                    {["a", "b", "c", "d", "e", "f", "g", "h"].map((letter) => (
                        <span key={letter}>{letter}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Chessboard