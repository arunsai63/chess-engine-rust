import { useState } from "react"

const Board: React.FC = () => {
    // Define the board state with TypeScript type
    const [board] = useState<string[][]>([
        ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
        ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
        ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
    ])

    // Function to map piece codes to image paths
    const getPieceImage = (piece: string): string | null => {
        if (!piece) return null // Empty square
        const color = piece.startsWith("w") ? "white" : "black"
        const pieceType = piece.slice(1) // Remove 'w' or 'b' to get piece type
        const pieceMap: { [key: string]: string } = {
            r: "rook",
            n: "knight",
            b: "bishop",
            q: "queen",
            k: "king",
            p: "pawn",
        }
        const pieceName = pieceMap[pieceType]
        return `/images/${color}/${pieceName}.svg`
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-center mb-4">Chess Board</h1>
            <div className="w-[400px] h-[400px] border-2 border-gray-700 flex flex-col">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-1">
                        {row.map((piece, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`flex-1 flex justify-center items-center ${(rowIndex + colIndex) % 2 === 0
                                    ? "bg-[#f0d9b5]" // Beige for light squares
                                    : "bg-[#769656]" // Green for dark squares
                                    }`}
                            >
                                {piece && (
                                    <img
                                        src={getPieceImage(piece)!}
                                        alt={`${piece}`}
                                        className="w-4/5 h-4/5"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Board