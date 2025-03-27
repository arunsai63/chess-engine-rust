import { FaChessKnight, FaChessQueen } from "react-icons/fa"
import { useGlobal } from "../Context"
import { useEffect, useRef } from "react"

const RightSidebar: React.FC = () => {
    const { history, captures } = useGlobal()
    const movesContainerRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when history updates
    useEffect(() => {
        if (movesContainerRef.current) {
            movesContainerRef.current.scrollTop = movesContainerRef.current.scrollHeight
        }
    }, [history])

    return (
        <div className="w-80 bg-[#212121] text-[#d3d3d3] p-6 flex flex-col h-full">
            {/* Opening Section */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#779952] mb-4">Moves</h2>
                <div
                    ref={movesContainerRef}
                    className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[#779952] scrollbar-track-[#2c2c2c] space-y-2"
                >
                    {history.map((move, index) => (
                        <div
                            key={index}
                            className="flex items-center py-1 hover:bg-[#2c2c2c] transition-colors duration-200 px-2 rounded"
                        >
                            <span className="w-8 text-[#b0b0b0]">{index + 1}.</span>
                            <span className="flex-1">{move}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 text-[#b0b0b0] font-medium">1-0</div>
            </div>

            {/* Mistakes, Blunders, Misses Section */}
            <div className="mb-6 bg-[#2c2c2c] p-4 rounded">
                <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        <span>Great:</span>
                        <span className="ml-1 text-green-400 font-semibold">0</span>
                    </span>
                    <span className="flex items-center">
                        <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                        <span>Mistakes:</span>
                        <span className="ml-1 text-orange-400 font-semibold">0</span>
                    </span>
                    <span className="flex items-center">
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        <span>Blunders:</span>
                        <span className="ml-1 text-red-400 font-semibold">0</span>
                    </span>
                    <span className="flex items-center">
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                        <span>Misses:</span>
                        <span className="ml-1 text-purple-400 font-semibold">0</span>
                    </span>
                </div>
            </div>

            {/* Captured Pieces Section */}
            <div className="mb-6 bg-[#2c2c2c] p-4 rounded">
                <h3 className="text-lg font-semibold text-[#779952] mb-3">Captured Pieces</h3>
                <div className="space-y-4">
                    {/* Captured by White */}
                    <div>
                        <h4 className="text-sm font-medium text-[#d3d3d3] mb-2">By White</h4>
                        <div className="flex flex-wrap">
                            {captures.white.length > 0 ? (
                                captures.white.map((piece, index) => (
                                    <div key={index} className="flex items-center">
                                        <img src={piece} alt={"Captured piece"} className="w-6 h-6" />
                                    </div>
                                ))
                            ) : (
                                <span className="text-[#b0b0b0] text-sm"></span>
                            )}
                        </div>
                    </div>

                    {/* Captured by Black */}
                    <div>
                        <h4 className="text-sm font-medium text-[#d3d3d3] mb-2">By Black</h4>
                        <div className="flex flex-wrap">
                            {captures.black.length > 0 ? (
                                captures.black.map((piece, index) => (
                                    <div key={index} className="flex items-center">
                                        <img src={piece} alt={"Captured piece"} className="w-6 h-6" />
                                    </div>
                                ))
                            ) : (
                                <span className="text-[#b0b0b0] text-sm"></span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-auto flex space-x-3">
                <button className="flex-1 bg-[#4a4a4a] p-3 rounded flex items-center justify-center text-sm font-medium text-[#d3d3d3] hover:bg-[#779952] hover:text-white transition-colors duration-200">
                    <FaChessKnight className="mr-2" /> New Game
                </button>
                <button className="flex-1 bg-[#4a4a4a] p-3 rounded flex items-center justify-center text-sm font-medium text-[#d3d3d3] hover:bg-[#779952] hover:text-white transition-colors duration-200">
                    <FaChessQueen className="mr-2" /> Rematch
                </button>
            </div>
        </div>
    )
}

export default RightSidebar