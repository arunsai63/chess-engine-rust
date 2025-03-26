import LeftSidebar from "./components/LeftSidebar"
import Chessboard from "./components/Chessboard"
import RightSidebar from "./components/RightSidebar"
import { GlobalProvider } from "./Context"

const App: React.FC = () => {
    return (
        <GlobalProvider>
            <div className="flex h-screen bg-[#212121]">
                <LeftSidebar />
                <Chessboard />
                <RightSidebar />
            </div>
        </GlobalProvider>
    )
}

export default App
