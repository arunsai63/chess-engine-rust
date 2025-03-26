import { useState, useRef } from "react"
import { ColorType, Position, MoveRecord, Piece, PieceType } from "../types/pieces"
import Confetti from "./Confetti"
import { initialBoard } from "../common/pieceUtils"
import { useGlobal } from "../Context"



const Chessboard: React.FC = () => {
    const { setHistory, history, captures, setCaptures } = useGlobal()
    const [board, setBoard] = useState<(Piece | null)[][]>(initialBoard)
    const moveSound = useRef(new Audio('./drop.mp3'))
    const [nextMove, setNextMove] = useState<ColorType>(ColorType.White)
    const [draggedPiece, setDraggedPiece] = useState<{
        piece: Piece
        row: number
        col: number
    } | null>(null)
    const [possibleMoves, setPossibleMoves] = useState<Position[]>([])
    const [lastMove, setLastMove] = useState<MoveRecord | null>(null)
    const [winner, setWinner] = useState<ColorType | null>(null)
    const [showConfetti, setShowConfetti] = useState<boolean>(false)

    const handleDragStart = (row: number, col: number, piece: Piece) => {
        if (piece.color !== nextMove) return

        setDraggedPiece({ piece, row, col })
        // Calculate and show possible moves
        const moves = piece.getPossibleMoves(board, row, col, lastMove)
        setPossibleMoves(moves)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDrop = (row: number, col: number) => {
        if (!draggedPiece) return
        if (draggedPiece.piece.color !== nextMove) return

        // Check if the move is in possible moves
        const isValidMove = possibleMoves.some(move => move.row === row && move.col === col)
        if (!isValidMove) {
            setDraggedPiece(null)
            setPossibleMoves([])
            return
        }
        setHistory([
            ...history,
            `${String.fromCharCode(97 + draggedPiece.col)}${8 - draggedPiece.row + 1}${String.fromCharCode(97 + col)}${8 - row + 1}`
        ])
        // Check if we're capturing a king (win condition)
        const targetPiece = board[row][col]

        if (targetPiece) {
            if (targetPiece.color === ColorType.White) {
                setCaptures({
                    ...captures,
                    white: [...captures.white, targetPiece.img]
                })
            } else {
                setCaptures({
                    ...captures,
                    black: [...captures.black, targetPiece.img]
                })
            }
        }

        if (targetPiece && targetPiece.piece === PieceType.King) {
            setWinner(draggedPiece.piece.color)
            setShowConfetti(true)
            // moveSound.current.play()

            // Reset game after celebration
            setTimeout(() => {
                setBoard(initialBoard)
                setNextMove(ColorType.White)
                setPossibleMoves([])
                setLastMove(null)
                setWinner(null)
                setShowConfetti(false)
            }, 5000)

            setDraggedPiece(null)
            return
        }

        try {
            // Use the piece's move function for specialized movement
            const newBoard = draggedPiece.piece.move(
                board,
                draggedPiece.row,
                draggedPiece.col,
                row,
                col,
                lastMove
            )

            // Play move sound
            // moveSound.current.play()

            // Update the board
            setBoard(newBoard)

            // Record this move for en passant tracking
            setLastMove({
                piece: draggedPiece.piece,
                fromRow: draggedPiece.row,
                fromCol: draggedPiece.col,
                toRow: row,
                toCol: col
            })

            // Change player
            setNextMove(nextMove === ColorType.White ? ColorType.Black : ColorType.White)
        } catch (e) {
            console.error("Move error:", e)
        }

        // Clear drag state
        setDraggedPiece(null)
        setPossibleMoves([])
    }

    return (
        <div className="flex-1 p-4 flex flex-col items-center">
            {/* Show confetti on victory */}
            <Confetti active={showConfetti} />

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
                                    className={`flex-1 flex justify-center items-center relative
                                        ${(rowIndex + colIndex) % 2 === 0 ? "bg-[#f0d9b5]" : "bg-[#769656]"}`}
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(rowIndex, colIndex)}
                                >
                                    {/* Show dots for possible moves */}
                                    {possibleMoves.some(move => move.row === rowIndex && move.col === colIndex) && (
                                        <div className="absolute w-1/4 h-1/4 rounded-full bg-black opacity-40 z-30"></div>
                                    )}

                                    {piece && (
                                        <img
                                            src={piece.img}
                                            alt={`${piece.color} ${piece.piece}`}
                                            className="w-4/5 h-4/5 cursor-move z-20"
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