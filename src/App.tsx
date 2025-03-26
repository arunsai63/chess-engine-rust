import LeftSidebar from "./components/LeftSidebar"
import Chessboard from "./components/Chessboard"
import RightSidebar from "./components/RightSidebar"

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#212121]">
      <LeftSidebar />
      <Chessboard />
      <RightSidebar />
    </div>
  )
}

export default App
