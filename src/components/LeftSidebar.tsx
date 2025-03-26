import { FaChess, FaQuestionCircle } from "react-icons/fa"

const LeftSidebar: React.FC = () => {
    return (
        <div className="w-20 bg-[#2b2b2b] text-white flex flex-col items-center py-4">
            <div className="mb-4 text-sm">Chess.icu</div>
            <nav className="flex flex-col space-y-2">
                <a href="#" className="flex items-center justify-center p-2 bg-[#4caf50] rounded">Play</a>
                {/* <a href="#" className="flex items-center justify-center p-2 hover:bg-gray-700">Puzzles</a> */}
                <a href="#" className="flex items-center justify-center p-2 hover:bg-gray-700">Learn</a>
                {/* <a href="#" className="flex items-center justify-center p-2 hover:bg-gray-700">Watch</a>
                <a href="#" className="flex items-center justify-center p-2 hover:bg-gray-700">News</a>
                <a href="#" className="flex items-center justify-center p-2 hover:bg-gray-700">Social</a> */}
                <a href="#" className="flex items-center justify-center p-2 hover:bg-gray-700">More</a>
            </nav>
            {/* <div className="mt-4">
                <div className="relative">
                    <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search" className="pl-8 p-2 rounded bg-gray-800 text-sm w-full" />
                </div>
            </div>
            <div className="mt-4 flex flex-col space-y-2 w-full px-2">
                <button className="bg-[#4caf50] p-2 rounded text-sm">Sign Up</button>
                <button className="bg-[#424242] p-2 rounded text-sm">Log In</button>
            </div> */}
            <div className="mt-auto flex flex-col items-center">
                <FaChess className="text-2xl" />
                <span className="text-sm">Guest</span>
            </div>
            <div className="mt-2">
                <FaQuestionCircle className="text-2xl" />
            </div>
        </div>
    )
}

export default LeftSidebar