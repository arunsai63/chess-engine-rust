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
    getPossibleMoves: (board: Piece[][]) => { row: number, col: number }[]
}

function createPiece(
    piece: string,
    color: "white" | "black",
    getPossibleMoves: (board: Piece[][]) => { row: number, col: number }[]
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

const placeholderMoves = (_board: Piece[][]): { row: number, col: number }[] => []

enum PieceType {
    Rook = "rook",
    Knight = "knight",
    Bishop = "bishop",
    Queen = "queen",
    King = "king",
    Pawn = "pawn",
}

const createRook = (color: "white" | "black") => createPiece(PieceType.Rook, color, placeholderMoves)
const createKnight = (color: "white" | "black") => createPiece(PieceType.Knight, color, placeholderMoves)
const createBishop = (color: "white" | "black") => createPiece(PieceType.Bishop, color, placeholderMoves)
const createQueen = (color: "white" | "black") => createPiece(PieceType.Queen, color, placeholderMoves)
const createKing = (color: "white" | "black") => createPiece(PieceType.King, color, placeholderMoves)
const createPawn = (color: "white" | "black") => createPiece(PieceType.Pawn, color, placeholderMoves)

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
        moveSound.current.play()
        const newBoard = board.map(row => [...row])
        newBoard[draggedPiece.row][draggedPiece.col] = null
        newBoard[row][col] = draggedPiece.piece
        draggedPiece.piece.hasMoved = true
        setBoard(newBoard)
        setDraggedPiece(null)
    }

    return (
        <div className="flex-1 p-4 flex flex-col items-center">
            <div className="text-white mb-2 flex items-center">
                Player 1
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