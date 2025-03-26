import { FaChessKnight, FaChessQueen } from "react-icons/fa"

const RightSidebar: React.FC = () => {
    return (
        <div className="w-80 bg-[#212121] text-white p-4 flex flex-col">
            <div className="mb-4">
                <h2 className="text-lg font-bold">Opening</h2>
                <table className="w-full text-left text-sm">
                    <tbody>
                        <tr>
                            <td className="pr-2">1.</td>
                            <td>e4 e5</td>
                        </tr>
                        <tr>
                            <td className="pr-2">2.</td>
                            <td>Qh5 d6</td>
                        </tr>
                        <tr>
                            <td className="pr-2">3.</td>
                            <td>Bc4 c5</td>
                        </tr>
                        <tr>
                            <td className="pr-2">4.</td>
                            <td>Nc3 b5</td>
                        </tr>
                        <tr>
                            <td className="pr-2">5.</td>
                            <td>Qxf7#</td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-2">1-0</div>
            </div>
            <div className="mb-4">
                <div className="flex space-x-2 text-sm">
                    <span className="text-orange-500">Mistakes: 0</span>
                    <span className="text-red-500">Blunders: 0</span>
                    <span className="text-red-500">Misses: 1</span>
                </div>
            </div>
            <div className="mt-auto flex space-x-2">
                <button className="bg-[#424242] p-2 rounded flex items-center text-sm flex-1">
                    <FaChessKnight className="mr-2" /> New Game
                </button>
                <button className="bg-[#424242] p-2 rounded flex items-center text-sm flex-1">
                    <FaChessQueen className="mr-2" /> Rematch
                </button>
            </div>
        </div>
    )
}

export default RightSidebar